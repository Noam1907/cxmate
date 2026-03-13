import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

/**
 * Fire-and-forget email alert for server-side gate failures.
 * Never throws, never blocks — the user response is sacred.
 */
function notifyGateError(reason: string, details?: string): void {
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.DIGEST_EMAIL;
  if (!resendKey || !toEmail) return;

  const timestamp = new Date().toLocaleString("en-IL", {
    timeZone: "Asia/Jerusalem",
    weekday: "short", year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const resend = new Resend(resendKey);
  resend.emails.send({
    from: "CX Mate Alerts <onboarding@resend.dev>",
    to: toEmail,
    subject: `🚨 Gate failure: ${reason}`,
    html: `
      <div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
        <div style="background:#dc2626;color:white;padding:12px 16px;border-radius:8px 8px 0 0;font-size:14px;font-weight:600;">
          Beta Gate — Server Error
        </div>
        <div style="border:1px solid #fecaca;border-top:none;border-radius:0 0 8px 8px;padding:20px;background:#fef2f2;">
          <p style="margin:0 0 8px;font-size:15px;font-weight:600;color:#991b1b;">${reason}</p>
          ${details ? `<pre style="margin:0 0 12px;font-size:13px;color:#64748b;white-space:pre-wrap;">${details}</pre>` : ""}
          <p style="margin:0;font-size:13px;color:#94a3b8;">${timestamp}</p>
        </div>
      </div>`,
  }).catch(() => { /* swallow — never break the gate response */ });
}

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function grantAccess() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("beta_access", "granted", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    // 30 days — testers stay logged in
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return response;
}

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (!password || typeof password !== "string") {
    return NextResponse.json({ success: false, error: "No code provided" }, { status: 400 });
  }

  // Check 1: site-wide password (admin access)
  if (password === process.env.SITE_PASSWORD) {
    return grantAccess();
  }

  // Check 2: invite codes from Supabase
  const supabase = getAdminClient();
  if (!supabase) {
    console.error("Gate: No Supabase admin client — missing URL or SERVICE_ROLE_KEY");
    notifyGateError("Missing env vars", "NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set");
    return NextResponse.json({ success: false, error: "Invalid code" }, { status: 401 });
  }

  try {
    const normalizedCode = password.trim().toUpperCase();
    const { data, error } = await supabase
      .from("invite_codes")
      .select("id, code, max_uses, use_count, is_active")
      .eq("code", normalizedCode)
      .single();

    if (error) {
      // PGRST116 = "no rows returned" from .single() — that's just an invalid code, not a server error
      if (error.code !== "PGRST116") {
        console.error("Gate: Supabase query error:", error.message, error.code);
        notifyGateError("Supabase query error", `${error.code}: ${error.message}`);
      }
      return NextResponse.json({ success: false, error: "Invalid code" }, { status: 401 });
    }

    if (data && data.is_active && data.use_count < data.max_uses) {
      // Increment use count
      await supabase
        .from("invite_codes")
        .update({ use_count: data.use_count + 1 })
        .eq("id", data.id);

      return grantAccess();
    }

    return NextResponse.json({ success: false, error: "Invalid code" }, { status: 401 });
  } catch (err) {
    console.error("Invite code check failed:", err);
    notifyGateError("Unhandled exception", err instanceof Error ? err.message : String(err));
    return NextResponse.json({ success: false, error: "Invalid code" }, { status: 401 });
  }
}
