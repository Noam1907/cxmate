import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// Service-role client — bypasses RLS so we can write to the waitlist table
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, role, cx_challenge, referral_source } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const supabase = getAdminClient();

    // Upsert — if they've already joined, just update their info
    const { error: dbError } = await supabase
      .from("waitlist")
      .upsert(
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          company: company?.trim() || null,
          role: role?.trim() || null,
          cx_challenge: cx_challenge?.trim() || null,
          referral_source: referral_source?.trim() || null,
          status: "pending",
        },
        { onConflict: "email" }
      );

    if (dbError) {
      console.error("Waitlist DB error:", dbError);
      return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
    }

    // Notify owner via email
    try {
      const resendApiKey = process.env.RESEND_API_KEY;
      const notifyEmail = process.env.DIGEST_EMAIL;
      if (resendApiKey && notifyEmail) {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: "CX Mate <noreply@cxmate.io>",
          to: notifyEmail,
          subject: `New waitlist signup: ${name} from ${company || "unknown company"}`,
          html: `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Company:</strong> ${company || "—"}</p>
            <p><strong>Role:</strong> ${role || "—"}</p>
            <p><strong>CX Challenge:</strong> ${cx_challenge || "—"}</p>
            <p><strong>Referral:</strong> ${referral_source || "—"}</p>
          `,
        });
      }
    } catch (emailErr) {
      // Non-fatal — don't fail the request if notification fails
      console.warn("Failed to send waitlist notification email:", emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Waitlist error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
