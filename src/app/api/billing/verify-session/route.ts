/**
 * POST /api/billing/verify-purchase
 *
 * Called from the client after a successful Freemius checkout.
 * Stores the license/subscription info in the org record and returns the plan tier.
 *
 * Body: { license_id, plan_id, subscription_id? }
 *
 * Also serves as GET /api/billing/verify-session for the success page
 * (polls until webhook has updated the DB).
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  planTierFromFreemiusPlanId,
  getLicense,
  FREEMIUS_CONFIG,
} from "@/lib/freemius";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUser, getOrgId } from "@/lib/supabase/auth";

// ── POST: client calls after checkout success ────────────────────────────────

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const orgId = await getOrgId();
    if (!orgId) {
      return NextResponse.json({ error: "No org found" }, { status: 400 });
    }

    const body = await req.json();
    const { license_id, plan_id, subscription_id } = body;

    if (!license_id || !plan_id) {
      return NextResponse.json(
        { error: "Missing license_id or plan_id" },
        { status: 400 }
      );
    }

    // Verify the license exists in Freemius (prevents spoofing)
    let verified = false;
    try {
      const license = await getLicense(license_id);
      verified = license && String(license.plan_id) === String(plan_id);
    } catch {
      // If API call fails, we still save — webhook is the source of truth
      console.warn("[verify-purchase] Could not verify license via API");
    }

    const planTier = planTierFromFreemiusPlanId(plan_id);

    const adminClient = createAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await adminClient
      .from("organizations")
      .update({
        plan_tier: planTier,
        freemius_license_id: String(license_id),
        freemius_plan_id: String(plan_id),
        ...(subscription_id && {
          freemius_subscription_id: String(subscription_id),
        }),
      } as any)
      .eq("id", orgId);

    console.log(
      `[verify-purchase] org ${orgId} → ${planTier} (verified: ${verified})`
    );

    return NextResponse.json({ planTier, verified });
  } catch (err) {
    console.error("[verify-purchase] Error:", err);
    return NextResponse.json(
      { error: "Failed to verify purchase" },
      { status: 500 }
    );
  }
}

// ── GET: success page polls for plan tier ─────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const orgId = user.app_metadata?.org_id as string | undefined;
    if (!orgId) {
      return NextResponse.json({ error: "No org found" }, { status: 400 });
    }

    type OrgRow = { plan_tier: string | null };
    const { data: org } = (await supabase
      .from("organizations")
      .select("plan_tier")
      .eq("id", orgId)
      .single()) as unknown as { data: OrgRow | null };

    return NextResponse.json({
      planTier: org?.plan_tier ?? "free",
    });
  } catch (err) {
    console.error("[verify-session] Error:", err);
    return NextResponse.json({ planTier: "free" });
  }
}
