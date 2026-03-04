import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key);
}

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ valid: false, error: "No invite code provided" }, { status: 400 });
    }

    const normalizedCode = code.trim().toUpperCase();

    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("invite_codes")
      .select("id, code, max_uses, use_count, is_active")
      .eq("code", normalizedCode)
      .single();

    if (error || !data) {
      return NextResponse.json({ valid: false, error: "Invalid invite code" });
    }

    if (!data.is_active) {
      return NextResponse.json({ valid: false, error: "This invite code has been deactivated" });
    }

    if (data.use_count >= data.max_uses) {
      return NextResponse.json({ valid: false, error: "This invite code has reached its limit" });
    }

    return NextResponse.json({ valid: true });
  } catch (err) {
    console.error("Invite validation error:", err);
    return NextResponse.json({ valid: false, error: "Server error" }, { status: 500 });
  }
}
