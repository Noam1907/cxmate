import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Daily Digest — sends a morning summary email to the configured address.
 *
 * Called by Vercel cron daily at 7am IL (GET), or manually via POST.
 * Includes:
 *   1. System health check — all external services verified
 *   2. Product stats — signups, journeys in last 24h
 *
 * Protected by CRON_SECRET (Vercel sends Authorization: Bearer <CRON_SECRET>).
 *
 * Required env vars:
 *   RESEND_API_KEY       — from resend.com
 *   DIGEST_EMAIL         — where to send the digest (your inbox)
 *   CRON_SECRET          — any random string, set in Vercel env vars too
 */
async function handleDigest(request: Request) {
  // Security: accept Vercel cron header (Authorization: Bearer) or legacy x-cron-secret
  const expected = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  const legacySecret = request.headers.get("x-cron-secret");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!expected || (bearerToken !== expected && legacySecret !== expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const toEmail = process.env.DIGEST_EMAIL;
  const resendKey = process.env.RESEND_API_KEY;

  if (!toEmail || !resendKey) {
    return NextResponse.json(
      { error: "DIGEST_EMAIL or RESEND_API_KEY not configured" },
      { status: 500 }
    );
  }

  // ─── Run health check + Pull stats (in parallel) ─────────────────────────
  const [health, stats] = await Promise.all([
    runHealthCheck(),
    fetchStats(),
  ]);

  // ─── Compose email ────────────────────────────────────────────────────────
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const html = buildEmailHtml(today, stats, health);

  // ─── Send via Resend ──────────────────────────────────────────────────────
  const resend = new Resend(resendKey);
  const { error } = await resend.emails.send({
    from: "CX Mate Digest <onboarding@resend.dev>",
    to: toEmail,
    subject: `CX Mate Daily Digest — ${today}`,
    html,
  });

  if (error) {
    console.error("Digest send error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, sentTo: toEmail });
}

// Vercel crons send GET requests
export async function GET(request: Request) {
  return handleDigest(request);
}

// Manual trigger via POST (e.g. curl)
export async function POST(request: Request) {
  return handleDigest(request);
}

// ─── Health check ─────────────────────────────────────────────────────────────

type ServiceStatus = { service: string; status: "pass" | "fail" | "warn"; message: string };

async function runHealthCheck(): Promise<{ overall: "healthy" | "degraded" | "unhealthy"; checks: ServiceStatus[] }> {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cx-mate.vercel.app";
    const res = await fetch(`${appUrl}/api/health`, { signal: AbortSignal.timeout(15000) });
    const data = await res.json();
    return { overall: data.status, checks: data.checks || [] };
  } catch {
    return { overall: "unhealthy", checks: [{ service: "health-endpoint", status: "fail", message: "Could not reach /api/health" }] };
  }
}

// ─── Stats fetcher ────────────────────────────────────────────────────────────

async function fetchStats() {
  try {
    const admin = createAdminClient();
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

    // Total users (organizations)
    const { count: totalOrgs } = await admin
      .from("organizations")
      .select("*", { count: "exact", head: true });

    // New orgs in last 24h
    const { count: newOrgs } = await admin
      .from("organizations")
      .select("*", { count: "exact", head: true })
      .gte("created_at", yesterday);

    // Total journeys saved
    const { count: totalJourneys } = await admin
      .from("journey_templates")
      .select("*", { count: "exact", head: true });

    // New journeys in last 24h
    const { count: newJourneys } = await admin
      .from("journey_templates")
      .select("*", { count: "exact", head: true })
      .gte("created_at", yesterday);

    return {
      totalOrgs: totalOrgs ?? 0,
      newOrgs: newOrgs ?? 0,
      totalJourneys: totalJourneys ?? 0,
      newJourneys: newJourneys ?? 0,
    };
  } catch {
    // Don't fail the digest if stats can't be fetched
    return { totalOrgs: "—", newOrgs: "—", totalJourneys: "—", newJourneys: "—" };
  }
}

// ─── Email HTML template ──────────────────────────────────────────────────────

function buildEmailHtml(
  today: string,
  stats: {
    totalOrgs: number | string;
    newOrgs: number | string;
    totalJourneys: number | string;
    newJourneys: number | string;
  },
  health: { overall: "healthy" | "degraded" | "unhealthy"; checks: ServiceStatus[] }
) {
  const healthColor = health.overall === "healthy" ? "#16a34a" : health.overall === "degraded" ? "#d97706" : "#dc2626";
  const healthBg = health.overall === "healthy" ? "#f0fdf4" : health.overall === "degraded" ? "#fffbeb" : "#fef2f2";
  const healthBorder = health.overall === "healthy" ? "#bbf7d0" : health.overall === "degraded" ? "#fde68a" : "#fecaca";
  const healthIcon = health.overall === "healthy" ? "🟢" : health.overall === "degraded" ? "🟡" : "🔴";
  const healthLabel = health.overall === "healthy" ? "All systems operational" : health.overall === "degraded" ? "Degraded — some warnings" : "UNHEALTHY — action required";

  const statusIcon = (s: "pass" | "fail" | "warn") => s === "pass" ? "✅" : s === "warn" ? "⚠️" : "❌";

  const checksHtml = health.checks.map(c =>
    `<tr>
      <td style="padding:5px 10px 5px 0;font-size:13px;white-space:nowrap;">${statusIcon(c.status)}</td>
      <td style="padding:5px 10px 5px 0;font-size:13px;color:#334155;font-weight:600;">${c.service}</td>
      <td style="padding:5px 0;font-size:13px;color:#64748b;">${c.message}</td>
    </tr>`
  ).join("");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cx-mate.vercel.app";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CX Mate Morning Briefing</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f8fafc;color:#1e293b;">

  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">

    <!-- Header -->
    <div style="background:#0f172a;border-radius:16px;padding:32px;margin-bottom:24px;text-align:center;">
      <div style="display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;background:rgba(20,184,166,0.2);border-radius:12px;margin-bottom:16px;">
        <span style="font-size:20px;font-weight:700;color:#14b8a6;">CX</span>
      </div>
      <h1 style="color:#f1f5f9;font-size:22px;font-weight:700;margin:0 0 4px;">Morning Briefing</h1>
      <p style="color:#64748b;font-size:14px;margin:0;">${today}</p>
    </div>

    <!-- System Health -->
    <div style="background:${healthBg};border-radius:12px;padding:20px;border:1px solid ${healthBorder};margin-bottom:24px;">
      <p style="color:#64748b;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px;">System Health</p>
      <p style="font-size:15px;font-weight:700;color:${healthColor};margin:0 0 14px;">${healthIcon} ${healthLabel}</p>
      <table style="border-collapse:collapse;width:100%;">
        ${checksHtml}
      </table>
    </div>

    <!-- Stats grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;">

      <div style="background:white;border-radius:12px;padding:20px;border:1px solid #e2e8f0;">
        <p style="color:#64748b;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 4px;">New signups (24h)</p>
        <p style="color:#0f172a;font-size:32px;font-weight:700;margin:0;">${stats.newOrgs}</p>
      </div>

      <div style="background:white;border-radius:12px;padding:20px;border:1px solid #e2e8f0;">
        <p style="color:#64748b;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 4px;">Total users</p>
        <p style="color:#0f172a;font-size:32px;font-weight:700;margin:0;">${stats.totalOrgs}</p>
      </div>

      <div style="background:white;border-radius:12px;padding:20px;border:1px solid #e2e8f0;">
        <p style="color:#64748b;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 4px;">New journeys (24h)</p>
        <p style="color:#0f172a;font-size:32px;font-weight:700;margin:0;">${stats.newJourneys}</p>
      </div>

      <div style="background:white;border-radius:12px;padding:20px;border:1px solid #e2e8f0;">
        <p style="color:#64748b;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 4px;">Total journeys</p>
        <p style="color:#0f172a;font-size:32px;font-weight:700;margin:0;">${stats.totalJourneys}</p>
      </div>

    </div>

    <!-- Quick links -->
    <div style="background:white;border-radius:12px;padding:20px;border:1px solid #e2e8f0;margin-bottom:24px;">
      <p style="color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">Quick Links</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <a href="https://us.posthog.com" style="display:inline-block;background:#0f172a;color:white;text-decoration:none;padding:8px 14px;border-radius:8px;font-size:13px;font-weight:600;">PostHog →</a>
        <a href="https://supabase.com/dashboard" style="display:inline-block;background:#0d9488;color:white;text-decoration:none;padding:8px 14px;border-radius:8px;font-size:13px;font-weight:600;">Supabase →</a>
        <a href="${appUrl}" style="display:inline-block;background:#334155;color:white;text-decoration:none;padding:8px 14px;border-radius:8px;font-size:13px;font-weight:600;">Open App →</a>
      </div>
    </div>

    <!-- Footer -->
    <p style="text-align:center;color:#94a3b8;font-size:12px;margin:0;">
      CX Mate · Sent daily at 7am ·
      <a href="${appUrl}/api/health" style="color:#14b8a6;">View health check</a>
    </p>

  </div>
</body>
</html>
  `.trim();
}
