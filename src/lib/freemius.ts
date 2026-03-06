/**
 * Freemius configuration and server-side helpers.
 *
 * Freemius is our Merchant of Record — handles payments, taxes, subscriptions.
 * Checkout is client-side (JS overlay). Webhooks update the DB.
 * This module provides server-side API helpers and config constants.
 */

import crypto from "crypto";
import type { PlanTier } from "@/lib/tier-access";

// ── Config ───────────────────────────────────────────────────────────────────

export const FREEMIUS_CONFIG = {
  productId: process.env.NEXT_PUBLIC_FREEMIUS_PRODUCT_ID ?? "25475",
  publicKey: process.env.NEXT_PUBLIC_FREEMIUS_PUBLIC_KEY ?? "",
  secretKey: process.env.FREEMIUS_SECRET_KEY ?? "",
  plans: {
    full_analysis: { planId: "42170", type: "one-time" as const },
    pro: { planId: "42172", type: "subscription" as const },
  },
} as const;

// ── Plan tier mapping ────────────────────────────────────────────────────────

export function planTierFromFreemiusPlanId(planId: string | number): PlanTier {
  const id = String(planId);
  if (id === FREEMIUS_CONFIG.plans.full_analysis.planId) return "full_analysis";
  if (id === FREEMIUS_CONFIG.plans.pro.planId) return "pro";
  return "free";
}

// ── Webhook signature verification (HMAC-SHA256) ────────────────────────────

export function verifyWebhookSignature(
  rawBody: string,
  signature: string
): boolean {
  const secret = FREEMIUS_CONFIG.secretKey;
  if (!secret) {
    console.error("[freemius] Missing FREEMIUS_SECRET_KEY");
    return false;
  }
  const computed = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(computed, "hex"),
    Buffer.from(signature, "hex")
  );
}

// ── Freemius API helpers ─────────────────────────────────────────────────────

const FREEMIUS_API_BASE = "https://api.freemius.com/v1";

async function freemiusApiGet(path: string): Promise<unknown> {
  const secret = FREEMIUS_CONFIG.secretKey;
  if (!secret) throw new Error("Missing FREEMIUS_SECRET_KEY");

  const res = await fetch(`${FREEMIUS_API_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${secret}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Freemius API error (${res.status}): ${text}`);
  }

  return res.json();
}

/** Get license details by license ID */
export async function getLicense(licenseId: string | number) {
  const pid = FREEMIUS_CONFIG.productId;
  return freemiusApiGet(`/products/${pid}/licenses/${licenseId}.json`) as Promise<{
    id: number;
    plan_id: number;
    pricing_id: number;
    user_id: number;
    quota: number;
    activated: number;
    expiration: string | null;
    is_cancelled: boolean;
    is_whitelabeled: boolean;
    secret_key: string;
  }>;
}

/** Get subscription details by subscription ID */
export async function getSubscription(subscriptionId: string | number) {
  const pid = FREEMIUS_CONFIG.productId;
  return freemiusApiGet(
    `/products/${pid}/subscriptions/${subscriptionId}.json`
  ) as Promise<{
    id: number;
    user_id: number;
    plan_id: number;
    pricing_id: number;
    license_id: number;
    billing_cycle: number; // 1 = monthly, 12 = annual
    outstanding_balance: number;
    failed_payments: number;
    next_payment: string | null;
    is_active: boolean;
    cancel_date: string | null;
    created: string;
  }>;
}

// ── Freemius webhook event types ─────────────────────────────────────────────

export type FreemiusWebhookEvent = {
  type: string;
  // Common fields from Freemius webhook payload
  id: string;
  plugin_id?: number;
  user_id?: number;
  install_id?: number;
  license_id?: number;
  subscription_id?: number;
  plan_id?: number;
  pricing_id?: number;
  // Additional fields vary per event type
  [key: string]: unknown;
};
