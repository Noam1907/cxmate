import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

// GET /api/billing/verify-session?session_id=cs_xxx
// Called by the billing success page to confirm plan activation.
// The webhook is the source of truth for DB updates — this just returns
// the current plan tier so the UI can show the right label.

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    // Verify session exists in Stripe (confirms payment is real)
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session || session.payment_status === "unpaid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    // Get current plan from Supabase (set by webhook)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const orgId = user.app_metadata?.org_id as string | undefined;
    if (!orgId) {
      return NextResponse.json({ error: "No org found" }, { status: 400 });
    }

    type OrgRow = { plan_tier: string | null };
    const { data: org } = await supabase
      .from("organizations")
      .select("plan_tier")
      .eq("id", orgId)
      .single() as unknown as { data: OrgRow | null };

    return NextResponse.json({
      planTier: org?.plan_tier ?? "starter",
      paymentStatus: session.payment_status,
    });
  } catch (err) {
    console.error("[verify-session] Error:", err);
    // Return a graceful response — success page will still render
    return NextResponse.json({ planTier: "starter" });
  }
}
