import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
    return NextResponse.json({ success: false, error: "Invalid code", debug: "no_supabase_client" }, { status: 401 });
  }

  try {
    const normalizedCode = password.trim().toUpperCase();
    const { data, error } = await supabase
      .from("invite_codes")
      .select("id, code, max_uses, use_count, is_active")
      .eq("code", normalizedCode)
      .single();

    if (error) {
      console.error("Gate: Supabase query error:", error.message, error.code);
      return NextResponse.json({ success: false, error: "Invalid code", debug: error.message }, { status: 401 });
    }

    if (data && data.is_active && data.use_count < data.max_uses) {
      // Increment use count
      await supabase
        .from("invite_codes")
        .update({ use_count: data.use_count + 1 })
        .eq("id", data.id);

      return grantAccess();
    }

    return NextResponse.json({ success: false, error: "Invalid code", debug: data ? `active=${data.is_active} uses=${data.use_count}/${data.max_uses}` : "code_not_found" }, { status: 401 });
  } catch (err) {
    console.error("Invite code check failed:", err);
    return NextResponse.json({ success: false, error: "Invalid code", debug: "exception" }, { status: 401 });
  }
}
