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
  const domain = website.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();
  if (!domain || !domain.includes(".")) return null;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

export function SidebarBuildingView({ data }: SidebarBuildingViewProps) {
  const [logoError, setLogoError] = useState(false);

  if (!data || !data.companyName) {
    return (
      <div className="flex flex-col items-center justify-center text-center px-4 py-20 space-y-3">
        <p className="text-sm text-sidebar-foreground/30 leading-relaxed max-w-[200px]">
          Answer questions and watch your profile build in real time
        </p>
      </div>
    );
  }

  const maturityOption = data.companyMaturity
    ? MATURITY_OPTIONS.find((m) => m.value === data.companyMaturity)
    : null;

  const logoUrl = getLogoUrl(data.companyWebsite || "");

  // Count how many sections are filled
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

  const initials = data.companyName.charAt(0).toUpperCase();

  return (
    <div className="space-y-5">
      {/* Company identity */}
      <div className="space-y-4">
        {/* Logo + Company name row */}
        <div className="flex items-center gap-3">
          {logoUrl && !logoError ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={logoUrl}
              alt={`${data.companyName} logo`}
              width={40}
              height={40}
              className="rounded-lg bg-white border border-sidebar-border object-contain p-1"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-primary/8 border border-sidebar-border flex items-center justify-center">
              <span className="text-base font-bold text-primary">{initials}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-sidebar-foreground leading-tight truncate">
              {data.companyName}
            </h2>
            {data.vertical && (
              <span className="text-xs text-sidebar-foreground/50 mt-0.5 block">
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
          <div className="text-xs font-medium text-primary bg-primary/6 rounded-lg px-3 py-2">
            {maturityOption.label}
          </div>
        )}

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="h-1.5 bg-sidebar-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] text-sidebar-foreground/35 font-medium">
            {progress}% complete
          </p>
        </div>
      </div>

      <div className="border-t border-sidebar-border" />

      {/* Data sections — clean labels + values */}
      <div className="space-y-4">
        {/* Customer profile */}
        {data.customerDescription && (
          <DataSection label="Customers">
            <p className="text-sm font-medium text-sidebar-foreground leading-snug">{data.customerDescription}</p>
            {data.customerSize && (
              <p className="text-xs text-sidebar-foreground/45 mt-0.5">{data.customerSize} segment</p>
            )}
          </DataSection>
        )}

        {/* Focus area */}
        {data.biggestChallenge && (
          <DataSection label="Focus area">
            <p className="text-sm text-sidebar-foreground/80 italic leading-snug">
              &ldquo;{data.biggestChallenge}&rdquo;
            </p>
          </DataSection>
        )}

        {/* Pain points tags */}
        {data.painPoints && data.painPoints.length > 0 && (
          <DataSection label="Pain points">
            <div className="flex flex-wrap gap-1.5">
              {data.painPoints.slice(0, 5).map((p) => (
                <span
                  key={p}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary/8 text-primary"
                >
                  {p.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </DataSection>
        )}

        {/* Goal */}
        {data.primaryGoal && (
          <DataSection label="Goal">
            <p className="text-sm font-medium text-sidebar-foreground">
              {data.primaryGoal === "something_else" && data.customGoal
                ? data.customGoal
                : data.primaryGoal.replace(/_/g, " ")}
            </p>
            {data.timeframe && (
              <p className="text-xs text-sidebar-foreground/45 mt-0.5">
                {data.timeframe.replace(/_/g, " ")}
              </p>
            )}
          </DataSection>
        )}

        {/* Competitors */}
        {data.competitors && (
          <DataSection label="Competitors">
            <div className="flex flex-wrap gap-1.5">
              {data.competitors.split(",").map((c) => c.trim()).filter(Boolean).slice(0, 4).map((c) => (
                <span
                  key={c}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-sidebar-accent text-sidebar-foreground/70"
                >
                  {c}
                </span>
              ))}
            </div>
          </DataSection>
        )}
      </div>
    </div>
  );
}

/** Clean data section — label + content, no icons */
function DataSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/35">{label}</p>
      {children}
    </div>
  );
}
