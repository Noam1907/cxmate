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
// Two products, three price objects:
//   1. "Full Analysis" — one-time $149
//   2. "CX Mate Pro"  — recurring $99/month
export const STRIPE_PRICES = {
  full_analysis: process.env.STRIPE_FULL_ANALYSIS_PRICE_ID ?? "",
  pro_monthly:   process.env.STRIPE_PRO_MONTHLY_PRICE_ID ?? "",
} as const;

export type StripePriceKey = keyof typeof STRIPE_PRICES;

// ── Plan tier mapping ────────────────────────────────────────────────────────
// Maps a Stripe price ID back to our internal PlanTier.
import type { PlanTier } from "@/lib/tier-access";

export function planTierFromPriceId(priceId: string): PlanTier {
  if (priceId === STRIPE_PRICES.full_analysis) return "full_analysis";
  if (priceId === STRIPE_PRICES.pro_monthly)   return "pro";
  return "free";
}
