/**
 * POST /api/billing/portal
 *
 * Creates a Stripe Customer Portal session.
 * The portal lets subscribers manage billing: cancel, update card, view invoices.
 *
 * Returns { url } — redirect the browser there.
 */

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOrgId } from "@/lib/supabase/auth";

export const maxDuration = 15;

export async function POST() {
  try {
    const orgId = await getOrgId();
    if (!orgId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const adminClient = createAdminClient();
    type OrgRow = { stripe_customer_id: string | null };
    const { data: org } = await adminClient
      .from("organizations")
      .select("stripe_customer_id")
      .eq("id", orgId)
      .single() as unknown as { data: OrgRow | null };

    if (!org?.stripe_customer_id) {
      return NextResponse.json({ error: "No Stripe customer found" }, { status: 404 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: org.stripe_customer_id,
      return_url: `${appUrl}/dashboard`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    console.error("[portal] error:", err);
    return NextResponse.json({ error: "Failed to create portal session" }, { status: 500 });
  }
}
