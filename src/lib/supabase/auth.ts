import { createClient } from "@/lib/supabase/server";

/**
 * Server-side auth helpers.
 * Use in Server Components, API routes, and Server Actions.
 */

/** Get the current session, or null if not authenticated */
export async function getSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

/** Get the current user, or null if not authenticated */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Extract org_id from user's app_metadata */
export async function getOrgId(): Promise<string | null> {
  const user = await getUser();
  if (!user) return null;
  return (user.app_metadata?.org_id as string) ?? null;
}
