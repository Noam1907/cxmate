/**
 * Stripe singleton — server-side only.
 * Import this in API routes and server components.
 * Never import in client components.
 */

import Stripe from "stripe";

// Lazy singleton — initialised on first use so build doesn't fail without env vars
let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable");
  }
  _stripe = new Stripe(key, {
    apiVersion: "2026-02-25.clover",
    typescript: true,
  });
  return _stripe;
}

// Proxy so callers can do `stripe.checkout.sessions.create(...)` as before
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string, unknown>)[prop as string];
  },
});

// ── Price IDs (set in Stripe Dashboard → Products) ──────────────────────────
// Create two prices under a "CX Mate Starter" product:
//   1. Recurring: $79/month
//   2. One-time:  $149
export const STRIPE_PRICES = {
  starter_monthly: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID ?? "",
  starter_onetime: process.env.STRIPE_STARTER_ONETIME_PRICE_ID ?? "",
} as const;

export type StripePriceKey = keyof typeof STRIPE_PRICES;

// ── Plan tier mapping ────────────────────────────────────────────────────────
// Maps a Stripe price ID back to our internal plan tier name.
export function planTierFromPriceId(priceId: string): string {
  const starters = [
    STRIPE_PRICES.starter_monthly,
    STRIPE_PRICES.starter_onetime,
  ];
  if (starters.includes(priceId)) return "starter";
  return "free";
}
