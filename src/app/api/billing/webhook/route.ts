/**
 * POST /api/billing/webhook
 *
 * Freemius webhook handler. Listens for license/subscription events
 * and updates the organization's plan tier in Supabase.
 *
 * Register this URL in Freemius Dashboard → Integrations → Webhooks.
 *
 * Events handled:
 *   license.created          → activate plan (one-time or subscription)
 *   subscription.cancelled   → downgrade to free (when period ends)
 *   subscription.expired     → downgrade to free
 *   license.plan.changed     → sync plan changes (upgrade/downgrade)
 */

import { NextResponse } from "next/server";
import {
  verifyWebhookSignature,
  planTierFromFreemiusPlanId,
} from "@/lib/freemius";
import { createAdminClient } from "@/lib/supabase/admin";

export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-signature") ?? "";

  if (!signature) {
    return NextResponse.json(
      { error: "Missing x-signature header" },
      { status: 400 }
    );
  }

  // ── Verify HMAC-SHA256 signature ──────────────────────────────────────────
  const isValid = verifyWebhookSignature(body, signature);
  if (!isValid) {
    console.error("[freemius-webhook] Signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = event.type as string;
  const adminClient = createAdminClient();

  try {
    // Freemius webhooks include the user's email — we use that to find the org
    const userEmail = (event.user_email ?? event.email ?? "") as string;
    const planId = event.plan_id as number | undefined;
    const licenseId = event.license_id as number | undefined;
    const subscriptionId = event.subscription_id as number | undefined;

    // Find org by the email used during checkout
    // (We match via the user who owns the org in Supabase Auth)
    const orgId = await findOrgByEmail(adminClient, userEmail);

    if (!orgId) {
      console.warn(
        `[freemius-webhook] No org found for email: ${userEmail}, event: ${eventType}`
      );
      // Return 200 so Freemius doesn't retry — we'll reconcile manually
      return NextResponse.json({ received: true, matched: false });
    }

    switch (eventType) {
      case "license.created":
      case "license.plan.changed": {
        if (!planId) break;

        const planTier = planTierFromFreemiusPlanId(planId);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await adminClient
          .from("organizations")
          .update({
            plan_tier: planTier,
            freemius_license_id: licenseId ? String(licenseId) : null,
            freemius_subscription_id: subscriptionId
              ? String(subscriptionId)
              : null,
            freemius_plan_id: String(planId),
          } as any)
          .eq("id", orgId);

        console.log(
          `[freemius-webhook] ${eventType}: org ${orgId} → ${planTier}`
        );
        break;
      }

      case "subscription.cancelled":
      case "subscription.expired": {
        // Downgrade to free
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await adminClient
          .from("organizations")
          .update({
            plan_tier: "free",
            freemius_subscription_id: null,
          } as any)
          .eq("id", orgId);

        console.log(
          `[freemius-webhook] ${eventType}: org ${orgId} → free`
        );
        break;
      }

      default:
        console.log(`[freemius-webhook] Unhandled event: ${eventType}`);
    }
  } catch (err) {
    console.error(`[freemius-webhook] Error handling ${eventType}:`, err);
    // Return 200 — don't make Freemius retry on our internal errors
    return NextResponse.json({ received: true, error: "Internal handler error" });
  }

  return NextResponse.json({ received: true });
}

// ── Helper: find org by user email ──────────────────────────────────────────

async function findOrgByEmail(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adminClient: any,
  email: string
): Promise<string | null> {
  if (!email) return null;

  const normalizedEmail = email.toLowerCase();
  let page = 1;
  const perPage = 1000;

  // Paginate through all auth users to find the one matching this email.
  // listUsers() without pagination only returns the first 50 (Supabase default).
  while (true) {
    const { data: authData, error } = await adminClient.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error || !authData?.users?.length) return null;

    const user = authData.users.find(
      (u: { email?: string }) =>
        u.email?.toLowerCase() === normalizedEmail
    );

    if (user) {
      return (user.app_metadata?.org_id as string) ?? null;
    }

    // Reached the last page — no more users to check
    if (authData.users.length < perPage) return null;

    page++;
  }
}
