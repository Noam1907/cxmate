import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/** Prevent open-redirect: only allow relative paths, reject protocol-relative URLs */
function sanitizeRedirect(path: string | null, fallback: string): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return fallback;
  // Also reject backslash-based tricks and encoded schemes
  if (path.includes("\\") || path.includes("%2f%2f")) return fallback;
  return path;
}

/**
 * Auth callback handler.
 * Exchanges the auth code for a session, then:
 * - If new user (no org_id): creates org, sets app_metadata, redirects to /onboarding
 * - If existing user: redirects to /analysis (or redirect param)
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = sanitizeRedirect(searchParams.get("redirect"), "/analysis");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const user = data.user;
      const orgId = user.app_metadata?.org_id;

      // New user — create organization + set org_id
      if (!orgId) {
        let orgCreated = false;
        for (let attempt = 0; attempt < 2 && !orgCreated; attempt++) {
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
            const { error: metaError } = await admin.auth.admin.updateUserById(user.id, {
              app_metadata: { org_id: org.id },
            });

            if (metaError) {
              console.error(`[auth-callback] Org ${org.id} created but failed to set metadata for ${user.email}:`, metaError);
            } else {
              console.log(`[auth-callback] Created org ${org.id} for ${user.email}`);
            }
            orgCreated = true;
          } catch (err) {
            console.error(`[auth-callback] Org creation attempt ${attempt + 1} failed for ${user.email}:`, err);
            // The ensure-org hook on the client will retry as a safety net
          }
        }

        // New user — use redirect param if provided (e.g. magic link from onboarding),
        // otherwise default to /onboarding for standard email+password signups
        const newUserRedirect = sanitizeRedirect(searchParams.get("redirect"), "/onboarding");
        return NextResponse.redirect(`${origin}${newUserRedirect}`);
      }

      // Existing user with org — go to dashboard or redirect target
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  // Auth failed — redirect to auth page with error
  return NextResponse.redirect(`${origin}/auth?error=auth_failed`);
}
