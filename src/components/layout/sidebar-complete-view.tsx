"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { OnboardingData } from "@/types/onboarding";
import { MATURITY_OPTIONS } from "@/types/onboarding";
import type { GeneratedJourney } from "@/lib/ai/journey-prompt";
import { SidebarSection } from "./sidebar-section";

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
        <p className="text-xs text-sidebar-foreground/50">
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
    { href: `/confrontation?id=${id}`, label: "CX Report", icon: "📊" },
    { href: `/journey?id=${id}`, label: "Journey", icon: "🗺️" },
    { href: "/playbook", label: "Playbook", icon: "📋" },
    { href: "/dashboard", label: "Dashboard", icon: "📈" },
  ];

  return (
    <div className="space-y-5">
      {/* Company Header */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold text-sidebar-foreground">
          {data?.companyName || "Your Company"}
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {data?.vertical && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-sidebar-accent text-sidebar-accent-foreground">
              {data.vertical.replace(/_/g, " ")}
            </span>
          )}
          {maturityOption && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-sidebar-primary/10 text-sidebar-primary">
              {maturityOption.emoji} {maturityOption.label}
            </span>
          )}
          {data?.companySize && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-sidebar-accent text-sidebar-accent-foreground">
              {data.companySize} emp.
            </span>
          )}
        </div>
      </div>

      {/* Journey Stats */}
      {journey && (
        <SidebarSection label="Journey Overview">
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded-lg bg-sidebar-accent/50">
              <p className="text-lg font-bold text-sidebar-foreground">
                {stageCount}
              </p>
              <p className="text-[10px] text-sidebar-foreground/60">Stages</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-sidebar-accent/50">
              <p className="text-lg font-bold text-sidebar-foreground">
                {momentCount}
              </p>
              <p className="text-[10px] text-sidebar-foreground/60">Moments</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-red-50">
              <p className="text-lg font-bold text-red-700">{criticalCount}</p>
              <p className="text-[10px] text-red-600/70">Critical</p>
            </div>
          </div>
        </SidebarSection>
      )}

      {/* Maturity Assessment */}
      {journey?.maturityAssessment && (
        <SidebarSection label="CX Assessment">
          <p className="text-xs text-sidebar-foreground/80 leading-relaxed line-clamp-4">
            {journey.maturityAssessment}
          </p>
        </SidebarSection>
      )}

      {/* Top Risks */}
      {topRisks.length > 0 && (
        <SidebarSection label="Top Risks" icon="⚠️">
          <div className="space-y-1.5">
            {topRisks.map((risk, i) => (
              <Link
                key={i}
                href={`/confrontation?id=${id}`}
                className="block text-xs text-sidebar-foreground/80 hover:text-sidebar-primary transition-colors p-1.5 rounded-md hover:bg-sidebar-accent/50"
              >
                <span className="text-red-500 mr-1.5">&#9679;</span>
                {risk.pattern}
              </Link>
            ))}
          </div>
        </SidebarSection>
      )}

      {/* Goal */}
      {data?.primaryGoal && (
        <SidebarSection label="Focus">
          <div className="p-2 rounded-lg bg-sidebar-primary/5 border border-sidebar-primary/10">
            <p className="text-xs font-medium text-sidebar-foreground">
              {data.primaryGoal.replace(/_/g, " ")}
            </p>
            {data.timeframe && (
              <p className="text-[10px] text-sidebar-foreground/50 mt-0.5">
                {data.timeframe.replace(/_/g, " ")}
              </p>
            )}
          </div>
        </SidebarSection>
      )}

      {/* Quick Links */}
      <div className="pt-3 mt-1 border-t border-sidebar-border/50">
        <div className="space-y-0.5">
          {quickLinks.map((link) => {
            const isActive = pathname === link.href.split("?")[0];
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <span className="text-sm">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
