/**
 * POST /api/billing/create-checkout
 *
 * Returns a Freemius hosted checkout URL for the selected plan.
 * The pricing page can use this as a fallback if the JS overlay doesn't load,
 * or for direct link sharing.
 *
 * Body: { priceKey: "full_analysis" | "pro_monthly" }
 */

import { NextResponse } from "next/server";
import { FREEMIUS_CONFIG } from "@/lib/freemius";
import { getUser } from "@/lib/supabase/auth";

export const maxDuration = 15;

type PriceKey = "full_analysis" | "pro_monthly";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const priceKey = body.priceKey as PriceKey;

    // Map priceKey to Freemius plan
    const planMap: Record<PriceKey, { planId: string; billing_cycle?: string }> =
      {
        full_analysis: {
          planId: FREEMIUS_CONFIG.plans.full_analysis.planId,
          billing_cycle: "lifetime",
        },
        pro_monthly: {
          planId: FREEMIUS_CONFIG.plans.pro.planId,
          billing_cycle: "monthly",
        },
      };

    const plan = planMap[priceKey];
    if (!plan) {
      return NextResponse.json(
        { error: `Unknown price key: ${priceKey}` },
        { status: 400 }
      );
    }

    // Pre-fill email if user is authenticated
    const user = await getUser().catch(() => null);
    const email = user?.email ?? "";

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    // Build Freemius hosted checkout URL
    const params = new URLSearchParams({
      plan_id: plan.planId,
      ...(plan.billing_cycle && { billing_cycle: plan.billing_cycle }),
      ...(email && {
        user_email: email,
        readonly_user: "true",
      }),
      success_url: `${appUrl}/billing/success`,
      cancel_url: `${appUrl}/pricing`,
    });

    const checkoutUrl = `https://checkout.freemius.com/product/${FREEMIUS_CONFIG.productId}/?${params.toString()}`;

    return NextResponse.json({ url: checkoutUrl });
  } catch (err) {
    console.error("[create-checkout] error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout URL" },
      { status: 500 }
    );
  }
}
