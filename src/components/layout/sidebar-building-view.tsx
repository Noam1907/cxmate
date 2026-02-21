"use client";

import { useState } from "react";
import type { OnboardingData } from "@/types/onboarding";
import { MATURITY_OPTIONS } from "@/types/onboarding";

interface SidebarBuildingViewProps {
  data: Partial<OnboardingData> | null;
}

/**
 * Get a company logo URL from the website domain.
 * Uses Google's favicon service (free, no API key).
 */
function getLogoUrl(website: string): string | null {
  if (!website) return null;
  // Strip protocol if present, get just the domain
  const domain = website.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();
  if (!domain || !domain.includes(".")) return null;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

export function SidebarBuildingView({ data }: SidebarBuildingViewProps) {
  const [logoError, setLogoError] = useState(false);

  if (!data || !data.companyName) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8 opacity-40">
        <div className="text-4xl mb-3">🗺️</div>
        <p className="text-sm text-sidebar-foreground/70">
          Your CX profile will build here as we talk
        </p>
      </div>
    );
  }

  const maturityOption = data.companyMaturity
    ? MATURITY_OPTIONS.find((m) => m.value === data.companyMaturity)
    : null;

  const logoUrl = getLogoUrl(data.companyWebsite || "");

  // Count how many sections are filled — drives the progress feel
  const sections = [
    !!data.companyName,
    !!data.companyMaturity,
    !!data.vertical,
    !!data.customerDescription,
    !!data.biggestChallenge,
    !!data.primaryGoal,
  ];
  const filledCount = sections.filter(Boolean).length;
  const progress = Math.round((filledCount / sections.length) * 100);

  // Get first letter for fallback avatar
  const initials = data.companyName.charAt(0).toUpperCase();

  return (
    <div className="space-y-5">
      {/* Company identity card */}
      <div className="rounded-xl border border-sidebar-border bg-gradient-to-br from-sidebar-accent/30 to-transparent p-4 space-y-3">
        {/* Logo + Company name row */}
        <div className="flex items-center gap-3">
          {/* Company logo or fallback */}
          {logoUrl && !logoError ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={logoUrl}
              alt={`${data.companyName} logo`}
              width={40}
              height={40}
              className="rounded-lg bg-white border border-sidebar-border/50 object-contain p-0.5"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-sidebar-border/50 flex items-center justify-center">
              <span className="text-lg font-bold text-primary/60">{initials}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-sidebar-foreground leading-tight truncate">
              {data.companyName}
            </h2>
            {data.vertical && (
              <span className="text-xs text-sidebar-foreground/60">
                {data.vertical === "other"
                  ? data.customVertical || "Other"
                  : data.vertical.replace(/_/g, " ")}
                {data.companySize ? ` · ${data.companySize}` : ""}
              </span>
            )}
          </div>
        </div>

        {/* Maturity badge */}
        {maturityOption && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-lg">{maturityOption.emoji}</span>
            <span className="font-medium text-sidebar-foreground/80">{maturityOption.label}</span>
          </div>
        )}

        {/* Mini progress */}
        <div className="space-y-1">
          <div className="h-1 bg-sidebar-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] text-sidebar-foreground/40">
            Profile {progress}% complete
          </p>
        </div>
      </div>

      {/* Insights — only show when there's meaningful data */}
      {(data.biggestChallenge || data.primaryGoal) && (
        <div className="space-y-3 px-1">
          {/* Pain */}
          {data.biggestChallenge && (
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                🔥 Focus area
              </p>
              <p className="text-xs italic text-sidebar-foreground/70 leading-relaxed">
                &ldquo;{data.biggestChallenge}&rdquo;
              </p>
            </div>
          )}

          {/* Goal */}
          {data.primaryGoal && (
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                🎯 Goal
              </p>
              <p className="text-xs font-medium text-sidebar-foreground/70">
                {data.primaryGoal === "something_else" && data.customGoal
                  ? data.customGoal
                  : data.primaryGoal.replace(/_/g, " ")}
              </p>
            </div>
          )}

          {/* Competitors */}
          {data.competitors && (
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                ⚔️ Competitors
              </p>
              <div className="flex flex-wrap gap-1">
                {data.competitors.split(",").map((c) => c.trim()).filter(Boolean).slice(0, 4).map((c) => (
                  <span
                    key={c}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-sidebar-accent text-sidebar-accent-foreground"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CX Mate expert badge — always visible */}
      <div className="mt-auto pt-4 border-t border-sidebar-border/50">
        <div className="flex items-center gap-2 px-1">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs">✨</span>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-sidebar-foreground/60">CX Mate</p>
            <p className="text-[10px] text-sidebar-foreground/40">CCXP-certified AI expert</p>
          </div>
        </div>
      </div>
    </div>
  );
}
