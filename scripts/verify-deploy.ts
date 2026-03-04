#!/usr/bin/env npx tsx
/**
 * Post-Deploy Verification Script
 * ================================
 * Run after EVERY deploy to verify all services are connected.
 *
 * Usage:
 *   npx tsx scripts/verify-deploy.ts                  # checks production
 *   npx tsx scripts/verify-deploy.ts http://localhost:3000  # checks local
 *
 * What it checks:
 *   1. App is reachable (homepage loads)
 *   2. Health endpoint — all services connected (Supabase, Claude, PostHog, Resend)
 *   3. Auth page loads correctly
 *   4. API routes respond (journey, notify)
 *
 * Exit code 0 = all pass, 1 = failures detected
 */

const BASE_URL = process.argv[2] || "https://cx-mate.vercel.app";

interface CheckResult {
  name: string;
  status: "✅" | "⚠️" | "❌";
  message: string;
  durationMs?: number;
}

const results: CheckResult[] = [];

async function check(
  name: string,
  fn: () => Promise<{ ok: boolean; message: string }>,
): Promise<void> {
  const start = Date.now();
  try {
    const result = await fn();
    const durationMs = Date.now() - start;
    results.push({
      name,
      status: result.ok ? "✅" : "❌",
      message: result.message,
      durationMs,
    });
  } catch (err) {
    const durationMs = Date.now() - start;
    results.push({
      name,
      status: "❌",
      message: (err as Error).message,
      durationMs,
    });
  }
}

async function main() {
  console.log(`\n🔍 CX Mate — Post-Deploy Verification`);
  console.log(`   Target: ${BASE_URL}`);
  console.log(`   Time:   ${new Date().toLocaleString("en-IL", { timeZone: "Asia/Jerusalem" })}\n`);
  console.log("─".repeat(60));

  // 1. Homepage loads
  await check("Homepage loads", async () => {
    const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(10000) });
    const text = await res.text();
    const hasCXMate = text.includes("CX Mate");
    return {
      ok: res.ok && hasCXMate,
      message: res.ok ? (hasCXMate ? `OK (${res.status})` : "Page loaded but missing CX Mate content") : `HTTP ${res.status}`,
    };
  });

  // 2. Health endpoint — the big one
  await check("Health endpoint", async () => {
    const res = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(30000) });
    const data = await res.json();

    // Print individual service checks
    if (data.checks) {
      for (const c of data.checks) {
        const icon = c.status === "pass" ? "  ✅" : c.status === "warn" ? "  ⚠️" : "  ❌";
        console.log(`${icon} ${c.service}: ${c.message}`);
      }
    }

    return {
      ok: data.status === "healthy",
      message: data.summary || data.status,
    };
  });

  // 3. Auth page loads (client-rendered — check for 200 + has Next.js app shell)
  await check("Auth page loads", async () => {
    const res = await fetch(`${BASE_URL}/auth`, { signal: AbortSignal.timeout(10000) });
    const text = await res.text();
    const hasApp = text.includes("__next") || text.includes("CX Mate") || text.includes("_next");
    return {
      ok: res.ok && hasApp,
      message: res.ok ? `OK (${res.status})` : `HTTP ${res.status}`,
    };
  });

  // 4. Journey API responds (auth required, so 401 is expected)
  await check("Journey API responds", async () => {
    const res = await fetch(`${BASE_URL}/api/journey/default`, { signal: AbortSignal.timeout(10000) });
    // 401 is expected (no auth) — but at least the route works
    return {
      ok: res.status === 401 || res.ok,
      message: res.status === 401 ? "OK (401 — auth required as expected)" : `HTTP ${res.status}`,
    };
  });

  // 5. Notify API responds
  await check("Notify API responds", async () => {
    const res = await fetch(`${BASE_URL}/api/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "health_check" }),
      signal: AbortSignal.timeout(10000),
    });
    const data = await res.json();
    return {
      ok: res.ok && data.ok,
      message: data.skipped ? "OK (skipped — no alert recipient)" : "OK — notification sent",
    };
  });

  // ─── Results ─────────────────────────────────────────────────────
  console.log("\n" + "─".repeat(60));
  console.log("\n📋 RESULTS\n");

  for (const r of results) {
    const duration = r.durationMs ? ` (${r.durationMs}ms)` : "";
    console.log(`  ${r.status} ${r.name}: ${r.message}${duration}`);
  }

  const fails = results.filter((r) => r.status === "❌").length;
  const warns = results.filter((r) => r.status === "⚠️").length;
  const passes = results.filter((r) => r.status === "✅").length;

  console.log(`\n${"─".repeat(60)}`);
  if (fails > 0) {
    console.log(`\n🔴 DEPLOY VERIFICATION FAILED — ${fails} issue(s) need fixing before testers use this.`);
    process.exit(1);
  } else if (warns > 0) {
    console.log(`\n🟡 DEPLOY OK with ${warns} warning(s) — ${passes} checks passed.`);
  } else {
    console.log(`\n🟢 ALL CHECKS PASSED — ${passes}/${passes} services verified. Safe to share with testers.`);
  }
  console.log("");
}

main().catch((err) => {
  console.error("❌ Verification script crashed:", err.message);
  process.exit(1);
});
