/**
 * POST /api/billing/portal
 *
 * Redirects to the Freemius customer portal where users can
 * manage subscriptions, view invoices, and update payment methods.
 *
 * Freemius doesn't have a server-generated portal URL like Stripe.
 * Instead, we link to the Freemius customer dashboard.
 */

import { NextResponse } from "next/server";
import { FREEMIUS_CONFIG } from "@/lib/freemius";
import { getUser, getOrgId } from "@/lib/supabase/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const maxDuration = 15;

export async function POST() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const orgId = await getOrgId();
    if (!orgId) {
      return NextResponse.json({ error: "No org found" }, { status: 401 });
    }

    // Check if user has a Freemius license
    const adminClient = createAdminClient();
    type OrgRow = { freemius_license_id: string | null };
    const { data: org } = (await adminClient
      .from("organizations")
      .select("freemius_license_id")
      .eq("id", orgId)
      .single()) as unknown as { data: OrgRow | null };

    if (!org?.freemius_license_id) {
      return NextResponse.json(
        { error: "No active license found" },
        { status: 404 }
      );
    }

    // Freemius customer portal URL
    // Users manage their subscription through the Freemius-hosted portal
    const portalUrl = `https://users.freemius.com/store/${FREEMIUS_CONFIG.productId}`;

    return NextResponse.json({ url: portalUrl });
  } catch (err) {
    console.error("[portal] error:", err);
    return NextResponse.json(
      { error: "Failed to get portal URL" },
      { status: 500 }
    );
  }
}
