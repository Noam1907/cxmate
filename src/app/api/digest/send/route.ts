import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Daily Digest — sends a summary email to the configured address.
 *
 * Called by Vercel cron daily at 8am, or manually via POST.
 * Protected by CRON_SECRET header.
 *
 * Required env vars:
 *   RESEND_API_KEY       — from resend.com
 *   DIGEST_EMAIL         — where to send the digest (your inbox)
 *   CRON_SECRET          — any random string, set in Vercel env vars too
 */
export async function POST(request: Request) {
  // Security: require secret header to prevent abuse
  const secret = request.headers.get("x-cron-secret");
  const expected = process.env.CRON_SECRET;
  if (expected && secret !== expected) {
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

  // ─── Pull stats from Supabase ─────────────────────────────────────────────
  const stats = await fetchStats();

  // ─── Compose email ────────────────────────────────────────────────────────
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const html = buildEmailHtml(today, stats);

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
  }
) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CX Mate Daily Digest</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f8fafc;color:#1e293b;">

  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">

    <!-- Header -->
    <div style="background:#0f172a;border-radius:16px;padding:32px;margin-bottom:24px;text-align:center;">
      <div style="display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;background:rgba(20,184,166,0.2);border-radius:12px;margin-bottom:16px;">
        <span style="font-size:20px;font-weight:700;color:#14b8a6;">CX</span>
      </div>
      <h1 style="color:#f1f5f9;font-size:22px;font-weight:700;margin:0 0 4px;">Daily Digest</h1>
      <p style="color:#64748b;font-size:14px;margin:0;">${today}</p>
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

    <!-- PostHog link -->
    <div style="background:white;border-radius:12px;padding:20px;border:1px solid #e2e8f0;margin-bottom:24px;">
      <p style="color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">Tester Behaviour</p>
      <p style="color:#475569;font-size:14px;margin:0 0 12px;">
        Session recordings and event funnels are live in PostHog.
        Check the recordings dashboard to see exactly how testers navigate your app.
      </p>
      <a href="https://us.posthog.com" style="display:inline-block;background:#0f172a;color:white;text-decoration:none;padding:10px 18px;border-radius:8px;font-size:13px;font-weight:600;">
        Open PostHog →
      </a>
    </div>

    <!-- Footer -->
    <p style="text-align:center;color:#94a3b8;font-size:12px;margin:0;">
      CX Mate · Sent daily at 8am ·
      <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://cx-mate.vercel.app"}" style="color:#14b8a6;">Open app</a>
    </p>

  </div>
</body>
</html>
  `.trim();
}
