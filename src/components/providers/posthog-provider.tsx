"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// ─── Page View Tracker ────────────────────────────────────────────────────────
// Next.js App Router doesn't fire traditional page events on navigation.
// This component tracks route changes as PostHog page views.

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      posthog.capture("$pageview", {
        $current_url: window.location.href,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

// ─── PostHog Provider ────────────────────────────────────────────────────────

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

    if (!key) {
      // No key configured — analytics silently disabled
      return;
    }

    posthog.init(key, {
      api_host: host,
      person_profiles: "identified_only", // Only create profiles for logged-in users
      capture_pageview: false,            // We handle pageviews manually above
      capture_pageleave: true,            // Track when users leave
      autocapture: false,                 // We track events explicitly — no noise
      persistence: "localStorage",
      loaded: (ph) => {
        if (process.env.NODE_ENV === "development") {
          ph.debug();
        }
      },
    });
  }, []);

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      {children}
    </PHProvider>
  );
}
