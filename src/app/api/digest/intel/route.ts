import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * POST /api/digest/intel
 * Sends the CX Intelligence Digest via email.
 *
 * Body: { content: string } — markdown content of the digest
 *
 * Protected by CRON_SECRET header (same as daily digest).
 */
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-cron-secret");
  const expected = process.env.CRON_SECRET;
  if (!expected || secret !== expected) {
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

  const { content } = (await request.json()) as { content: string };
  if (!content) {
    return NextResponse.json({ error: "No content provided" }, { status: 400 });
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const html = buildIntelEmailHtml(today, content);

  const resend = new Resend(resendKey);
  const { error } = await resend.emails.send({
    from: "CX Mate Intel <onboarding@resend.dev>",
    to: toEmail,
    subject: `📊 CX Intel Digest — ${today}`,
    html,
  });

  if (error) {
    console.error("[digest/intel] Send error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, sentTo: toEmail });
}

// ─── Markdown to HTML (simple conversion for digest format) ──────────────────

function markdownToHtml(md: string): string {
  return md
    // Headers
    .replace(/^### (.+)$/gm, '<h3 style="color:#0f172a;font-size:15px;font-weight:700;margin:16px 0 6px;">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="color:#0f172a;font-size:17px;font-weight:700;margin:20px 0 8px;padding-top:16px;border-top:1px solid #e2e8f0;">$1</h2>')
    .replace(/^# (.+)$/gm, '')  // Strip the H1 title — it's in the email header
    // Bold + italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em style="color:#64748b;">$1</em>')
    // Numbered list items
    .replace(/^\d+\.\s+(.+)$/gm, '<div style="padding:6px 0 6px 8px;border-left:3px solid #14b8a6;margin:4px 0;font-size:14px;line-height:1.5;">$1</div>')
    // Unordered list items
    .replace(/^[-•]\s+(.+)$/gm, '<div style="padding:3px 0 3px 8px;font-size:13px;color:#475569;line-height:1.5;">• $1</div>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#0d9488;text-decoration:underline;">$1</a>')
    // Paragraphs (non-empty lines that aren't already tagged)
    .replace(/^(?!<[hda]|<div|<strong)(.+)$/gm, '<p style="font-size:14px;color:#334155;margin:6px 0;line-height:1.5;">$1</p>')
    // Clean up empty lines
    .replace(/^\s*$/gm, '');
}

function buildIntelEmailHtml(today: string, content: string): string {
  const bodyHtml = markdownToHtml(content);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CX Intel Digest</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f8fafc;color:#1e293b;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0f172a 0%,#134e4a 100%);border-radius:16px;padding:32px;margin-bottom:24px;text-align:center;">
      <div style="display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;background:rgba(20,184,166,0.2);border-radius:12px;margin-bottom:16px;">
        <span style="font-size:20px;font-weight:700;color:#14b8a6;">📊</span>
      </div>
      <h1 style="color:#f1f5f9;font-size:22px;font-weight:700;margin:0 0 4px;">CX Intelligence Digest</h1>
      <p style="color:#94a3b8;font-size:14px;margin:0;">${today}</p>
    </div>

    <!-- Content -->
    <div style="background:white;border-radius:12px;padding:24px;border:1px solid #e2e8f0;margin-bottom:24px;">
      ${bodyHtml}
    </div>

    <!-- Footer -->
    <p style="text-align:center;color:#94a3b8;font-size:12px;margin:0;">
      CX Mate · Market Intelligence · Curated by AI
    </p>

  </div>
</body>
</html>
  `.trim();
}
