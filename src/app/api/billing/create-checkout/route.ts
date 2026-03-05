/**
 * POST /api/billing/create-checkout
 *
 * Creates a Stripe Checkout session for the selected price.
 * Returns { url } — redirect the browser there.
 *
 * Body: { priceKey: "starter_monthly" | "starter_onetime" }
 */

import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, STRIPE_PRICES, type StripePriceKey } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUser, getOrgId } from "@/lib/supabase/auth";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // ── Auth ──────────────────────────────────────────────────────────────────
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }
    const orgId = await getOrgId();
    if (!orgId) {
      return NextResponse.json({ error: "No organisation found" }, { status: 400 });
    }

    // ── Price key ─────────────────────────────────────────────────────────────
    const body = await req.json();
    const priceKey = body.priceKey as StripePriceKey;
    const priceId = STRIPE_PRICES[priceKey];

    if (!priceId) {
      return NextResponse.json(
        { error: `Unknown price key: ${priceKey}. Check STRIPE_PRICES and env vars.` },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    // ── Find or create Stripe customer ────────────────────────────────────────
    const adminClient = createAdminClient();

    // Cast to include billing columns added in migration 002
    // (Supabase types regenerate after `supabase db push` is run)
    type OrgRow = { id: string; name: string | null; stripe_customer_id: string | null };

    const { data: org, error: orgError } = await adminClient
      .from("organizations")
      .select("id, name, stripe_customer_id")
      .eq("id", orgId)
      .single() as unknown as { data: OrgRow | null; error: unknown };

    if (orgError || !org) {
      return NextResponse.json({ error: "Organisation not found" }, { status: 404 });
    }

    let stripeCustomerId = org.stripe_customer_id;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: org.name || undefined,
        metadata: { org_id: orgId, user_id: user.id },
      });
      stripeCustomerId = customer.id;

      // Save to DB immediately so we don't create duplicates
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await adminClient
        .from("organizations")
        .update({ stripe_customer_id: stripeCustomerId } as any)
        .eq("id", orgId);
    }

    // ── Determine mode: subscription vs payment ───────────────────────────────
    const isOneTime = priceKey === "full_analysis";

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: stripeCustomerId ?? undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: isOneTime ? "payment" : "subscription",
      success_url: `${appUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing`,
      metadata: { org_id: orgId },
      allow_promotion_codes: true,
    };

    // For subscriptions, pass org metadata on subscription object
    if (!isOneTime) {
      sessionParams.subscription_data = {
        metadata: { org_id: orgId },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[create-checkout] error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
