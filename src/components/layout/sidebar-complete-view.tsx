"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { OnboardingData } from "@/types/onboarding";
import { MATURITY_OPTIONS } from "@/types/onboarding";
import type { GeneratedJourney } from "@/lib/ai/journey-prompt";

interface SidebarCompleteViewProps {
  data: Partial<OnboardingData> | null;
  journey: GeneratedJourney | null;
  templateId: string | null;
}

export function SidebarCompleteView({
  data,
  journey,
  templateId,
}: SidebarCompleteViewProps) {
  const pathname = usePathname();

  if (!data && !journey) {
    return (
      <div className="text-center py-8">
        <p className="text-xs text-sidebar-foreground/40">
          Complete onboarding to see your CX profile
        </p>
      </div>
    );
  }

  // Compute stats
  const stageCount = journey?.stages?.length || 0;
  const momentCount =
    journey?.stages?.reduce(
      (sum, stage) => sum + (stage.meaningfulMoments?.length || 0),
      0
    ) || 0;
  const criticalCount =
    journey?.stages?.reduce(
      (sum, stage) =>
        sum +
        (stage.meaningfulMoments?.filter((m) => m.severity === "critical")
          ?.length || 0),
      0
    ) || 0;
  const topRisks = (journey?.confrontationInsights || [])
    .filter((i) => i.likelihood === "high")
    .slice(0, 3);

  const maturityOption = data?.companyMaturity
    ? MATURITY_OPTIONS.find((m) => m.value === data.companyMaturity)
    : null;

  const id = templateId || "preview";

  const quickLinks = [
    { href: `/confrontation?id=${id}`, label: "CX Report" },
    { href: `/journey?id=${id}`, label: "Journey Map" },
    { href: "/playbook", label: "Playbook" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <div className="space-y-5">
      {/* Company Header */}
      <div className="space-y-2">
        <h2 className="text-base font-bold text-sidebar-foreground">
          {data?.companyName || "Your Company"}
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {data?.vertical && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-sidebar-accent text-sidebar-accent-foreground">
              {data.vertical.replace(/_/g, " ")}
            </span>
          )}
          {maturityOption && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/8 text-primary">
              {maturityOption.label}
            </span>
          )}
          {data?.companySize && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-sidebar-accent text-sidebar-accent-foreground">
              {data.companySize}
            </span>
          )}
        </div>
      </div>

      {/* Journey Stats */}
      {journey && (
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/35">Journey</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded-lg bg-sidebar-accent">
              <p className="text-lg font-bold text-sidebar-foreground">
                {stageCount}
              </p>
              <p className="text-[10px] text-sidebar-foreground/50">Stages</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-sidebar-accent">
              <p className="text-lg font-bold text-sidebar-foreground">
                {momentCount}
              </p>
              <p className="text-[10px] text-sidebar-foreground/50">Moments</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-red-50">
              <p className="text-lg font-bold text-red-600">{criticalCount}</p>
              <p className="text-[10px] text-red-500/70">Critical</p>
            </div>
          </div>
        </div>
      )}

      {/* Maturity Assessment */}
      {journey?.maturityAssessment && (
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/35">Assessment</p>
          <p className="text-xs text-sidebar-foreground/70 leading-relaxed line-clamp-4">
            {journey.maturityAssessment}
          </p>
        </div>
      )}

      {/* Top Risks */}
      {topRisks.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/35">Top risks</p>
          <div className="space-y-1.5">
            {topRisks.map((risk, i) => (
              <Link
                key={i}
                href={`/confrontation?id=${id}`}
                className="block text-xs text-sidebar-foreground/70 hover:text-primary transition-colors p-1.5 rounded-md hover:bg-sidebar-accent"
              >
                <span className="text-red-400 mr-1.5">&#9679;</span>
                {risk.pattern}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Goal */}
      {data?.primaryGoal && (
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/35">Focus</p>
          <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-xs font-medium text-sidebar-foreground">
              {data.primaryGoal.replace(/_/g, " ")}
            </p>
            {data.timeframe && (
              <p className="text-[10px] text-sidebar-foreground/45 mt-0.5">
                {data.timeframe.replace(/_/g, " ")}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="pt-3 mt-1 border-t border-sidebar-border">
        <div className="space-y-0.5">
          {quickLinks.map((link) => {
            const isActive = pathname === link.href.split("?")[0];
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
