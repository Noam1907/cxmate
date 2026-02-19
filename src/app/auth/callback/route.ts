import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Auth callback handler.
 * Exchanges the auth code for a session, then:
 * - If new user (no org_id): creates org, sets app_metadata, redirects to /onboarding
 * - If existing user: redirects to /dashboard (or redirect param)
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const user = data.user;
      const orgId = user.app_metadata?.org_id;

      // New user — create organization + set org_id
      if (!orgId) {
        try {
          const admin = createAdminClient();

          // Create organization
          const companyName =
            user.user_metadata?.company_name || "My Company";
          const { data: org, error: orgError } = await admin
            .from("organizations")
            .insert({
              name: companyName,
              vertical: "general",
              size: "1-10",
            })
            .select("id")
            .single();

          if (orgError) throw orgError;

          // Set org_id in user's app_metadata
          await admin.auth.admin.updateUserById(user.id, {
            app_metadata: { org_id: org.id },
          });
        } catch (err) {
          console.error("Org creation error:", err);
          // Continue anyway — they can still use preview mode
        }

        // New user goes to onboarding
        return NextResponse.redirect(`${origin}/onboarding`);
      }

      // Existing user with org — go to dashboard or redirect target
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  // Auth failed — redirect to auth page with error
  return NextResponse.redirect(`${origin}/auth?error=auth_failed`);
}
