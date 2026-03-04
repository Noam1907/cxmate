import { NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * POST /api/notify
 * Sends a real-time email notification when a tester does something important.
 *
 * Body: { event: string, email?: string, companyName?: string, details?: string }
 *
 * Uses the same RESEND_API_KEY and DIGEST_EMAIL as the daily digest.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event, email, companyName, details } = body as {
      event: string;
      email?: string;
      companyName?: string;
      details?: string;
    };

    const toEmail = process.env.DIGEST_EMAIL;
    const resendKey = process.env.RESEND_API_KEY;

    if (!toEmail || !resendKey) {
      // Silently skip if not configured — don't break the app
      console.warn("[notify] DIGEST_EMAIL or RESEND_API_KEY not set, skipping notification");
      return NextResponse.json({ ok: true, skipped: true });
    }

    const timestamp = new Date().toLocaleString("en-IL", {
      timeZone: "Asia/Jerusalem",
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const subjectMap: Record<string, string> = {
      user_signed_up: `🎉 New signup${companyName ? `: ${companyName}` : ""}`,
      onboarding_started: `🚀 Onboarding started${companyName ? `: ${companyName}` : ""}`,
      journey_generation_succeeded: `✅ Journey generated${companyName ? `: ${companyName}` : ""}`,
      playbook_generation_succeeded: `📋 Playbook generated${companyName ? `: ${companyName}` : ""}`,
    };

    const subject = subjectMap[event] || `📌 CX Mate: ${event}`;

    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
        <div style="background:#0d9488;color:white;padding:12px 16px;border-radius:8px 8px 0 0;font-size:14px;font-weight:600;">
          CX Mate — Activity Alert
        </div>
        <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;padding:20px;">
          <h2 style="margin:0 0 12px;font-size:18px;color:#0f172a;">${subject}</h2>
          <table style="font-size:14px;color:#334155;line-height:1.6;">
            <tr><td style="padding:4px 12px 4px 0;font-weight:600;color:#64748b;">When</td><td>${timestamp}</td></tr>
            ${email ? `<tr><td style="padding:4px 12px 4px 0;font-weight:600;color:#64748b;">Email</td><td>${email}</td></tr>` : ""}
            ${companyName ? `<tr><td style="padding:4px 12px 4px 0;font-weight:600;color:#64748b;">Company</td><td>${companyName}</td></tr>` : ""}
            ${details ? `<tr><td style="padding:4px 12px 4px 0;font-weight:600;color:#64748b;">Details</td><td>${details}</td></tr>` : ""}
          </table>
          <div style="margin-top:16px;padding-top:12px;border-top:1px solid #e2e8f0;">
            <a href="https://us.posthog.com" style="display:inline-block;background:#0f172a;color:white;text-decoration:none;padding:8px 14px;border-radius:6px;font-size:13px;font-weight:600;">
              Open PostHog →
            </a>
            <a href="https://supabase.com/dashboard" style="display:inline-block;background:#0d9488;color:white;text-decoration:none;padding:8px 14px;border-radius:6px;font-size:13px;font-weight:600;margin-left:8px;">
              Open Supabase →
            </a>
          </div>
        </div>
      </div>
    `;

    const resend = new Resend(resendKey);
    const { error } = await resend.emails.send({
      from: "CX Mate Alerts <alerts@cx-mate.com>",
      to: toEmail,
      subject,
      html,
    });

    if (error) {
      console.error("[notify] Failed to send:", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[notify] Error:", err);
    // Never break the user flow — just log
    return NextResponse.json({ ok: true, skipped: true });
  }
}
