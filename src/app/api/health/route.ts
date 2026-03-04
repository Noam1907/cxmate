import { NextResponse } from "next/server";

/**
 * GET /api/health
 *
 * Proactive health check — verifies ALL external services are connected
 * and properly configured. Run after every deploy, before any demo,
 * and on a schedule to catch issues BEFORE testers hit them.
 *
 * Returns:
 *   { status: "healthy" | "degraded" | "unhealthy", checks: [...] }
 */
export async function GET() {
  const checks: {
    service: string;
    status: "pass" | "fail" | "warn";
    message: string;
    latencyMs?: number;
  }[] = [];

  // ─── 1. Supabase Auth ──────────────────────────────────────────────
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    checks.push({
      service: "supabase",
      status: "fail",
      message: "NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not set",
    });
  } else {
    try {
      const start = Date.now();
      const res = await fetch(`${supabaseUrl}/auth/v1/settings`, {
        headers: { apikey: supabaseKey },
        signal: AbortSignal.timeout(5000),
      });
      const latencyMs = Date.now() - start;

      if (res.ok) {
        checks.push({ service: "supabase", status: "pass", message: `Auth API reachable (${latencyMs}ms)`, latencyMs });
      } else {
        checks.push({ service: "supabase", status: "fail", message: `Auth API returned ${res.status}`, latencyMs });
      }
    } catch (err) {
      checks.push({ service: "supabase", status: "fail", message: `Auth API unreachable: ${(err as Error).message}` });
    }
  }

  // ─── 2. Supabase DB (Service Role) ─────────────────────────────────
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRole) {
    checks.push({ service: "supabase-db", status: "fail", message: "SUPABASE_SERVICE_ROLE_KEY not set" });
  } else if (supabaseUrl) {
    try {
      const start = Date.now();
      const res = await fetch(`${supabaseUrl}/rest/v1/organizations?select=id&limit=1`, {
        headers: {
          apikey: serviceRole,
          Authorization: `Bearer ${serviceRole}`,
        },
        signal: AbortSignal.timeout(5000),
      });
      const latencyMs = Date.now() - start;

      if (res.ok) {
        checks.push({ service: "supabase-db", status: "pass", message: `DB query OK (${latencyMs}ms)`, latencyMs });
      } else {
        checks.push({ service: "supabase-db", status: "fail", message: `DB returned ${res.status}: ${res.statusText}`, latencyMs });
      }
    } catch (err) {
      checks.push({ service: "supabase-db", status: "fail", message: `DB unreachable: ${(err as Error).message}` });
    }
  }

  // ─── 3. Claude API ─────────────────────────────────────────────────
  const claudeKey = process.env.CX_MATE_ANTHROPIC_API_KEY;

  if (!claudeKey) {
    checks.push({ service: "claude", status: "fail", message: "CX_MATE_ANTHROPIC_API_KEY not set" });
  } else {
    try {
      const start = Date.now();
      // Lightweight test — just check if the API key is valid with a minimal request
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": claudeKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1,
          messages: [{ role: "user", content: "hi" }],
        }),
        signal: AbortSignal.timeout(10000),
      });
      const latencyMs = Date.now() - start;

      if (res.ok || res.status === 200) {
        checks.push({ service: "claude", status: "pass", message: `API key valid, model accessible (${latencyMs}ms)`, latencyMs });
      } else if (res.status === 401) {
        checks.push({ service: "claude", status: "fail", message: "API key invalid (401)", latencyMs });
      } else if (res.status === 429) {
        checks.push({ service: "claude", status: "warn", message: "Rate limited but key valid (429)", latencyMs });
      } else {
        checks.push({ service: "claude", status: "warn", message: `API returned ${res.status}`, latencyMs });
      }
    } catch (err) {
      checks.push({ service: "claude", status: "fail", message: `API unreachable: ${(err as Error).message}` });
    }
  }

  // ─── 4. Resend Email ───────────────────────────────────────────────
  const resendKey = process.env.RESEND_API_KEY;
  const digestEmail = process.env.DIGEST_EMAIL;

  if (!resendKey) {
    checks.push({ service: "resend", status: "warn", message: "RESEND_API_KEY not set — email notifications disabled" });
  } else {
    try {
      const start = Date.now();
      const res = await fetch("https://api.resend.com/api-keys", {
        headers: { Authorization: `Bearer ${resendKey}` },
        signal: AbortSignal.timeout(5000),
      });
      const latencyMs = Date.now() - start;

      if (res.ok) {
        checks.push({ service: "resend", status: "pass", message: `API key valid (${latencyMs}ms)`, latencyMs });
      } else if (res.status === 401) {
        checks.push({ service: "resend", status: "fail", message: "API key invalid (401)", latencyMs });
      } else {
        checks.push({ service: "resend", status: "warn", message: `API returned ${res.status}`, latencyMs });
      }
    } catch (err) {
      checks.push({ service: "resend", status: "fail", message: `API unreachable: ${(err as Error).message}` });
    }
  }

  if (!digestEmail) {
    checks.push({ service: "resend-config", status: "warn", message: "DIGEST_EMAIL not set — no alert recipient" });
  } else {
    checks.push({ service: "resend-config", status: "pass", message: `Alert recipient: ${digestEmail}` });
  }

  // ─── 5. PostHog Analytics ──────────────────────────────────────────
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

  if (!posthogKey) {
    checks.push({ service: "posthog", status: "warn", message: "NEXT_PUBLIC_POSTHOG_KEY not set — analytics disabled" });
  } else {
    // Verify key format (should start with phc_)
    if (!posthogKey.startsWith("phc_")) {
      checks.push({ service: "posthog", status: "fail", message: `Key has invalid format (doesn't start with phc_)` });
    } else if (posthogKey.includes("\n") || posthogKey.includes(" ")) {
      checks.push({ service: "posthog", status: "fail", message: "Key contains whitespace/newline characters" });
    } else {
      try {
        const start = Date.now();
        const res = await fetch(`${posthogHost}/decide/?v=3`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ api_key: posthogKey, distinct_id: "health-check" }),
          signal: AbortSignal.timeout(5000),
        });
        const latencyMs = Date.now() - start;

        if (res.ok) {
          checks.push({ service: "posthog", status: "pass", message: `Connected (${latencyMs}ms)`, latencyMs });
        } else {
          checks.push({ service: "posthog", status: "fail", message: `Returned ${res.status}`, latencyMs });
        }
      } catch (err) {
        checks.push({ service: "posthog", status: "fail", message: `Unreachable: ${(err as Error).message}` });
      }
    }
  }

  // ─── 6. App URL ────────────────────────────────────────────────────
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    checks.push({ service: "app-url", status: "warn", message: "NEXT_PUBLIC_APP_URL not set" });
  } else {
    checks.push({ service: "app-url", status: "pass", message: appUrl });
  }

  // ─── Summary ───────────────────────────────────────────────────────
  const failCount = checks.filter((c) => c.status === "fail").length;
  const warnCount = checks.filter((c) => c.status === "warn").length;

  const status = failCount > 0 ? "unhealthy" : warnCount > 0 ? "degraded" : "healthy";
  const httpStatus = failCount > 0 ? 503 : 200;

  return NextResponse.json(
    {
      status,
      timestamp: new Date().toISOString(),
      summary: `${checks.filter((c) => c.status === "pass").length} pass, ${warnCount} warn, ${failCount} fail`,
      checks,
    },
    { status: httpStatus }
  );
}
