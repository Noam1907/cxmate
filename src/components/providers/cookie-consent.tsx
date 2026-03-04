"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import posthog from "posthog-js";

const CONSENT_KEY = "cx-mate-cookie-consent";

type ConsentState = "accepted" | "declined" | null;

export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState | "loading">("loading");

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY) as ConsentState | null;
    setConsent(stored);
  }, []);

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setConsent("accepted");
    // PostHog is already initialized — nothing more needed
  }

  function handleDecline() {
    localStorage.setItem(CONSENT_KEY, "declined");
    setConsent("declined");
    // Opt out of PostHog tracking
    if (typeof window !== "undefined" && posthog?.__loaded) {
      posthog.opt_out_capturing();
    }
  }

  // Don't render until we've checked localStorage (avoids hydration flash)
  if (consent === "loading") return null;
  // Don't show if already decided
  if (consent !== null) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
      style={{ pointerEvents: "none" }}
    >
      <div
        className="max-w-2xl mx-auto rounded-2xl border border-slate-200 bg-white shadow-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{ pointerEvents: "auto" }}
      >
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0">
          🍪
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 mb-0.5">
            We use analytics cookies
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            We use PostHog to understand how you use CX Mate — no ads, no tracking across other sites.{" "}
            <Link href="/privacy#5-cookies-and-tracking" className="text-teal-600 hover:underline">
              Learn more
            </Link>
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={handleDecline}
            className="flex-1 sm:flex-none text-xs font-medium text-slate-500 hover:text-slate-800 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 sm:flex-none text-xs font-bold text-white px-4 py-2 rounded-lg transition-colors"
            style={{ backgroundColor: "#0D9488" }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
