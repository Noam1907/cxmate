"use client";

/**
 * UpgradeGate — locks content behind a tier check.
 *
 * Shows a blurred overlay with upgrade CTA when the user's tier
 * doesn't have access to the feature.
 */

import Link from "next/link";
import type { Feature } from "@/lib/tier-access";
import { upgradeCTA } from "@/lib/tier-access";

interface UpgradeGateProps {
  /** Is the user allowed to see this content? */
  hasAccess: boolean;
  /** Which feature is being gated (determines CTA copy) */
  feature: Feature;
  /** The content to show when unlocked */
  children: React.ReactNode;
  /** Optional: how many content items are hidden (e.g. "7 patterns") */
  hiddenCount?: string;
}

export function UpgradeGate({ hasAccess, feature, children, hiddenCount }: UpgradeGateProps) {
  if (hasAccess) return <>{children}</>;

  const cta = upgradeCTA(feature);

  return (
    <div className="relative">
      {/* Blurred content preview */}
      <div className="pointer-events-none select-none blur-[6px] opacity-50" aria-hidden="true">
        {children}
      </div>

      {/* Overlay CTA */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-lg p-8 max-w-sm text-center">
          {hiddenCount && (
            <p className="text-sm font-semibold text-slate-900 mb-1">
              {hiddenCount} waiting for you
            </p>
          )}
          <p className="text-sm text-slate-500 mb-5 leading-relaxed">
            {cta.description}
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-primary hover:bg-primary/90 text-white text-sm font-semibold py-2.5 px-6 rounded-xl transition-colors"
          >
            {cta.label}
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * LockedSection — simpler lock that replaces content entirely with a CTA.
 * Used for sections that shouldn't even show a blurred preview.
 */
export function LockedSection({ feature, message }: { feature: Feature; message?: string }) {
  const cta = upgradeCTA(feature);

  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center">
      <p className="text-sm text-slate-500 mb-4 leading-relaxed">
        {message || cta.description}
      </p>
      <Link
        href="/pricing"
        className="inline-block bg-primary hover:bg-primary/90 text-white text-sm font-semibold py-2.5 px-6 rounded-xl transition-colors"
      >
        {cta.label}
      </Link>
    </div>
  );
}
