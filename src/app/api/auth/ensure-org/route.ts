import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Ensure the authenticated user has an organization.
 * Idempotent — safe to call multiple times.
 *
 * This repairs users whose org wasn't created during the auth callback
 * (e.g., if they signed in via password instead of email link, or if
 * the callback's org creation failed silently).
 */
export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Already has an org — nothing to do
    const existingOrgId = user.app_metadata?.org_id;
    if (existingOrgId) {
      return NextResponse.json({ org_id: existingOrgId, created: false });
    }

    // Create organization using admin client (bypasses RLS)
    const admin = createAdminClient();
    const companyName = user.user_metadata?.company_name || "My Company";

    const { data: org, error: orgError } = await admin
      .from("organizations")
      .insert({
        name: companyName,
        vertical: "general",
        size: "1-10",
      })
      .select("id")
      .single();

    if (orgError) {
      console.error("[ensure-org] Org creation failed:", orgError);
      return NextResponse.json(
        { error: "Failed to create organization", detail: orgError.message },
        { status: 500 }
      );
    }

    // Set org_id in user's app_metadata
    const { error: updateError } = await admin.auth.admin.updateUserById(
      user.id,
      { app_metadata: { org_id: org.id } }
    );

    if (updateError) {
      console.error("[ensure-org] Failed to set org_id:", updateError);
      // Org was created but metadata wasn't set — still return the org_id
      // Next call will find the org-less user and create a duplicate, but
      // that's better than the user having no org at all.
      return NextResponse.json(
        { org_id: org.id, created: true, metadata_error: true },
        { status: 207 }
      );
    }

    console.log(
      `[ensure-org] Created org ${org.id} for user ${user.email} (${user.id})`
    );

    return NextResponse.json({ org_id: org.id, created: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[ensure-org] Unexpected error:", message);
    return NextResponse.json(
      { error: "Internal error", detail: message },
      { status: 500 }
    );
  }
}
