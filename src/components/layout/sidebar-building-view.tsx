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
      <div className="flex flex-col items-center justify-center text-center px-4 py-16 space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-sidebar-primary/10 flex items-center justify-center">
          <span className="text-2xl">🗺️</span>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-sidebar-foreground/70">
            Your CX profile
          </p>
          <p className="text-xs text-sidebar-foreground/40 leading-relaxed max-w-[200px]">
            Answer questions and watch your profile build in real time
          </p>
        </div>
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
      {/* Company identity card */}
      <div className="rounded-xl bg-sidebar-accent/50 p-5 space-y-4">
        {/* Logo + Company name row */}
        <div className="flex items-center gap-3.5">
          {logoUrl && !logoError ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={logoUrl}
              alt={`${data.companyName} logo`}
              width={48}
              height={48}
              className="rounded-xl bg-white/10 border border-sidebar-border/30 object-contain p-1"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-sidebar-primary/15 border border-sidebar-border/30 flex items-center justify-center">
              <span className="text-xl font-bold text-sidebar-primary">{initials}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-sidebar-foreground leading-tight truncate">
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
          <div className="flex items-center gap-2.5 bg-sidebar-primary/8 rounded-lg px-3 py-2">
            <span className="text-lg">{maturityOption.emoji}</span>
            <span className="text-sm font-semibold text-sidebar-primary">{maturityOption.label}</span>
          </div>
        )}

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="h-2 bg-sidebar-border/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-sidebar-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[11px] text-sidebar-foreground/40 font-medium">
            Profile {progress}% complete
          </p>
        </div>
      </div>

      {/* Data cards — bold values on dark bg */}
      <div className="space-y-3">
        {/* Customer profile */}
        {data.customerDescription && (
          <DataCard icon="👥" label="Customers">
            <p className="text-base font-semibold text-sidebar-foreground leading-snug">{data.customerDescription}</p>
            {data.customerSize && (
              <p className="text-xs text-sidebar-foreground/50 mt-1">{data.customerSize} segment</p>
            )}
          </DataCard>
        )}

        {/* Focus area */}
        {data.biggestChallenge && (
          <DataCard icon="🔥" label="Focus area">
            <p className="text-base font-medium text-sidebar-foreground/90 italic leading-snug">
              &ldquo;{data.biggestChallenge}&rdquo;
            </p>
          </DataCard>
        )}

        {/* Pain points tags */}
        {data.painPoints && data.painPoints.length > 0 && (
          <DataCard icon="⚠️" label="Pain points">
            <div className="flex flex-wrap gap-1.5">
              {data.painPoints.slice(0, 5).map((p) => (
                <span
                  key={p}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-sidebar-primary/12 text-sidebar-primary"
                >
                  {p.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </DataCard>
        )}

        {/* Goal */}
        {data.primaryGoal && (
          <DataCard icon="🎯" label="Goal">
            <p className="text-base font-semibold text-sidebar-foreground">
              {data.primaryGoal === "something_else" && data.customGoal
                ? data.customGoal
                : data.primaryGoal.replace(/_/g, " ")}
            </p>
            {data.timeframe && (
              <p className="text-xs text-sidebar-foreground/50 mt-1">
                Timeframe: {data.timeframe.replace(/_/g, " ")}
              </p>
            )}
          </DataCard>
        )}

        {/* Competitors */}
        {data.competitors && (
          <DataCard icon="⚔️" label="Competitors">
            <div className="flex flex-wrap gap-1.5">
              {data.competitors.split(",").map((c) => c.trim()).filter(Boolean).slice(0, 4).map((c) => (
                <span
                  key={c}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-sidebar-primary/12 text-sidebar-primary"
                >
                  {c}
                </span>
              ))}
            </div>
          </DataCard>
        )}
      </div>

      {/* CX Mate expert badge */}
      <div className="pt-4 border-t border-sidebar-border/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-sidebar-primary/10 flex items-center justify-center">
            <span className="text-xs">✨</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-sidebar-foreground/60">CX Mate</p>
            <p className="text-[10px] text-sidebar-foreground/35">CCXP-certified AI expert</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Reusable data card for sidebar */
function DataCard({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-sidebar-accent/40 p-4 space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm">{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-sidebar-foreground/35">{label}</span>
      </div>
      {children}
    </div>
  );
}
