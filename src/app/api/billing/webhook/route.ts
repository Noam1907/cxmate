/**
 * POST /api/billing/webhook
 *
 * Stripe webhook handler. Listens for payment/subscription events
 * and updates the organization's plan tier in Supabase.
 *
 * Stripe sends events here; verify signature, then update DB.
 *
 * Events handled:
 *   checkout.session.completed     → activate plan
 *   customer.subscription.updated  → sync status changes
 *   customer.subscription.deleted  → downgrade to free
 */

import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, planTierFromPriceId } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const maxDuration = 30;

// Stripe requires raw body for signature verification
export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  // ── Verify signature ───────────────────────────────────────────────────────
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const adminClient = createAdminClient();

  // ── Handle events ──────────────────────────────────────────────────────────
  try {
    switch (event.type) {

      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orgId = session.metadata?.org_id;
        if (!orgId) break;

        // Get the price from the line items
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
        const priceId = lineItems.data[0]?.price?.id ?? "";
        const planTier = planTierFromPriceId(priceId);

        // Build update — different for subscription vs one-time
        const update: Record<string, unknown> = {
          plan_tier: planTier,
          stripe_price_id: priceId,
          stripe_customer_id: session.customer as string,
        };

        if (session.mode === "subscription" && session.subscription) {
          update.stripe_subscription_id = session.subscription as string;
          // subscription status will be synced by customer.subscription.created event
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await adminClient.from("organizations").update(update as any).eq("id", orgId);
        console.log(`[webhook] checkout.session.completed: org ${orgId} → ${planTier}`);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const orgId = subscription.metadata?.org_id;
        if (!orgId) break;

        const priceId = subscription.items.data[0]?.price?.id ?? "";
        const planTier = planTierFromPriceId(priceId);
        // current_period_end moved in newer Stripe API versions — access via items or cast
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const periodEnd = (subscription as any).current_period_end as number | undefined;
        const currentPeriodEnd = periodEnd ? new Date(periodEnd * 1000).toISOString() : null;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await adminClient.from("organizations").update({
          plan_tier: subscription.status === "active" ? planTier : "free",
          stripe_subscription_id: subscription.id,
          stripe_subscription_status: subscription.status,
          stripe_price_id: priceId,
          subscription_current_period_end: currentPeriodEnd,
        } as any).eq("id", orgId);

        console.log(`[webhook] subscription ${event.type}: org ${orgId} → ${subscription.status}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const orgId = subscription.metadata?.org_id;
        if (!orgId) break;

        // Downgrade to free when subscription cancels
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await adminClient.from("organizations").update({
          plan_tier: "free",
          stripe_subscription_status: "canceled",
          subscription_current_period_end: null,
        } as any).eq("id", orgId);

        console.log(`[webhook] subscription.deleted: org ${orgId} → free`);
        break;
      }

      default:
        // Ignore unhandled events
        console.log(`[webhook] Unhandled event: ${event.type}`);
    }
  } catch (err) {
    console.error(`[webhook] Error handling ${event.type}:`, err);
    // Return 200 to Stripe — don't retry (we'll fix in DB manually)
    return NextResponse.json({ received: true, error: "Internal handler error" });
  }

  return NextResponse.json({ received: true });
}
