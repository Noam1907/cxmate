"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Ensures the authenticated user has an organization.
 * Calls /api/auth/ensure-org once per session if the user is logged in
 * but missing org_id in their JWT. No-op for anonymous users.
 *
 * Include this hook in any layout that wraps authenticated pages.
 */
export function useEnsureOrg() {
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;

    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return; // anonymous — nothing to do

      // Check if org_id is already in the JWT
      if (user.app_metadata?.org_id) return;

      // User is authenticated but has no org — repair it
      called.current = true;
      fetch("/api/auth/ensure-org", { method: "POST" })
        .then(async (res) => {
          if (res.ok) {
            const data = await res.json();
            if (data.created) {
              console.log("[ensure-org] Organization created, refreshing session...");
              // Refresh the session to get updated JWT with org_id
              await supabase.auth.refreshSession();
            }
          } else {
            console.error("[ensure-org] Failed:", await res.text());
          }
        })
        .catch((err) => {
          console.error("[ensure-org] Network error:", err);
        });
    });
  }, []);
}
