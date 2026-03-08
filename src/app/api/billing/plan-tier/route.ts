/**
 * GET /api/billing/plan-tier
 *
 * Returns the current user's plan tier.
 * - Authenticated users: reads from organizations table
 * - Unauthenticated users: returns "free"
 */

import { NextResponse } from "next/server";
import { getUser, getOrgId } from "@/lib/supabase/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PlanTier } from "@/lib/tier-access";

export async function GET(request: Request) {
  try {
    // Dev override: ?tier=pro or ?tier=full_analysis for testing
    const url = new URL(request.url);
    const devTier = url.searchParams.get("tier");
    if (process.env.NODE_ENV === "development" && devTier) {
      return NextResponse.json({ tier: devTier as PlanTier });
    }

    const user = await getUser();
    if (!user) {
      return NextResponse.json({ tier: "free" as PlanTier });
    }

    const orgId = await getOrgId();
    if (!orgId) {
      return NextResponse.json({ tier: "free" as PlanTier });
    }

    const adminClient = createAdminClient();

    type OrgRow = { plan_tier: string | null };
    const { data: org } = await adminClient
      .from("organizations")
      .select("plan_tier")
      .eq("id", orgId)
      .single() as unknown as { data: OrgRow | null };

    const tier = (org?.plan_tier as PlanTier) ?? "free";

    return NextResponse.json({ tier });
  } catch (err) {
    console.error("[plan-tier] error:", err);
    return NextResponse.json({ tier: "free" as PlanTier });
  }
}
