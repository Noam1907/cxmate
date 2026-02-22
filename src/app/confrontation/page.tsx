"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import type {
  GeneratedJourney,
  ConfrontationInsight,
  ImpactProjection,
} from "@/lib/ai/journey-prompt";
import type { OnboardingData } from "@/types/onboarding";
import { buildEvidenceMap, type EvidenceMap } from "@/lib/evidence-matching";
import { EvidenceWall } from "@/components/evidence/evidence-wall";

// ============================================
// Confrontation Modes (A/B/C)
// ============================================

type ConfrontationMode = "early_stage" | "growing" | "established";

function detectMode(companySize: string): ConfrontationMode {
  switch (companySize) {
    case "1-10":
    case "11-50":
      return "early_stage";
    case "51-150":
    case "151-300":
      return "growing";
    case "300+":
      return "established";
    default:
      return "early_stage";
  }
}

const MODE_CONFIG: Record<
  ConfrontationMode,
  {
    label: string;
    headline: (company: string) => string;
    subtitle: string;
    insightsHeading: (hasCustomers: boolean) => string;
    impactHeading: (hasCustomers: boolean) => string;
    maturityHeading: (hasCustomers: boolean) => string;
    criticalLabel: (hasCustomers: boolean) => string;
    badgeColor: string;
  }
> = {
  early_stage: {
    label: "Foundation Analysis",
    headline: (company) => `${company}, let\u2019s build this right.`,
    subtitle:
      "We analyzed your setup against what works best for companies at your stage. Here\u2019s what the top performers get right early \u2014 and where you have the biggest opportunities.",
    insightsHeading: (hasCustomers) =>
      hasCustomers
        ? "What typically trips up companies at your stage"
        : "What to get right from day one",
    impactHeading: (hasCustomers) =>
      hasCustomers
        ? "Revenue impact if you act"
        : "The opportunity ahead",
    maturityHeading: (hasCustomers) =>
      hasCustomers
        ? "Your CX maturity snapshot"
        : "Your starting position",
    criticalLabel: () => "Priority areas",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
  },
  growing: {
    label: "Growth Intelligence",
    headline: (company) => `${company}, growth changes everything.`,
    subtitle:
      "We analyzed your business against CX patterns from companies scaling past your stage. Here\u2019s where the biggest opportunities are hiding.",
    insightsHeading: () => "What typically trips up companies at your stage",
    impactHeading: () => "Revenue impact if you act",
    maturityHeading: () => "Your CX maturity snapshot",
    criticalLabel: () => "Priority areas",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
  },
  established: {
    label: "Optimization Report",
    headline: (company) => `${company}, time to compound.`,
    subtitle:
      "At your scale, small CX improvements compound into major revenue impact. We benchmarked you against industry leaders and found these optimization opportunities.",
    insightsHeading: () => "Optimization opportunities",
    impactHeading: () => "Projected impact at scale",
    maturityHeading: () => "Your CX maturity snapshot",
    criticalLabel: () => "Priority areas",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
  },
};

// ============================================
// Animated number counter
// ============================================

function AnimatedValue({ value, delay }: { value: string; delay: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <span
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      {value}
    </span>
  );
}

// ============================================
// Staggered fade-in wrapper
// ============================================

function FadeIn({
  children,
  delay,
  className = "",
  slow = false,
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
  slow?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all ${slow ? "duration-1000" : "duration-700"} ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ============================================
// Parse dollar value from impact string
// ============================================

function parseDollarValue(impact: string): number | null {
  // Try to extract a dollar amount like "$50,000" or "$50K" or "$1.2M"
  const match = impact.match(/\$[\d,.]+\s*[KkMmBb]?/);
  if (!match) return null;

  let raw = match[0].replace(/[$,]/g, "");
  let multiplier = 1;
  if (/[Kk]$/.test(raw)) {
    multiplier = 1000;
    raw = raw.replace(/[Kk]$/, "");
  } else if (/[Mm]$/.test(raw)) {
    multiplier = 1_000_000;
    raw = raw.replace(/[Mm]$/, "");
  } else if (/[Bb]$/.test(raw)) {
    multiplier = 1_000_000_000;
    raw = raw.replace(/[Bb]$/, "");
  }

  const num = parseFloat(raw);
  return isNaN(num) ? null : num * multiplier;
}

function formatDollarCompact(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${Math.round(value)}`;
}

// ============================================
// Hero Impact Card (Mesh-style)
// ============================================

function HeroImpactCard({
  projections,
  delay,
}: {
  projections: ImpactProjection[];
  delay: number;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  // Aggregate total impact range
  const values = projections
    .map((p) => parseDollarValue(p.potentialImpact))
    .filter((v): v is number => v !== null);

  const totalImpact = values.reduce((sum, v) => sum + v, 0);
  // Show a range: 70%-130% of total
  const lowEnd = Math.round(totalImpact * 0.7);
  const highEnd = Math.round(totalImpact * 1.3);

  if (values.length === 0) return null;

  return (
    <div
      className={`rounded-2xl bg-slate-900 text-white p-8 transition-all duration-1000 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">
          Estimated Annual CX Impact
        </span>
      </div>
      <div className="text-5xl font-bold tracking-tight mb-1">
        <AnimatedValue
          value={`${formatDollarCompact(lowEnd)} \u2013 ${formatDollarCompact(highEnd)}`}
          delay={delay + 300}
        />
      </div>
      <div className="text-sm text-slate-400">per year</div>
    </div>
  );
}

// ============================================
// Stat Pair Cards (Mesh-style)
// ============================================

function StatPairCards({
  highRiskCount,
  criticalMoments,
  totalMoments,
  delay,
}: {
  highRiskCount: number;
  criticalMoments: number;
  totalMoments: number;
  delay: number;
}) {
  return (
    <FadeIn delay={delay} className="grid grid-cols-3 gap-4">
      <div className="rounded-xl border bg-white p-5">
        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center mb-3">
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <div className="text-xs text-muted-foreground mb-1">High-Risk Patterns</div>
        <div className="text-3xl font-bold">{highRiskCount}</div>
      </div>
      <div className="rounded-xl border bg-white p-5">
        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center mb-3">
          <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        </div>
        <div className="text-xs text-muted-foreground mb-1">Critical Moments</div>
        <div className="text-3xl font-bold">{criticalMoments}</div>
      </div>
      <div className="rounded-xl border bg-white p-5">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
          </svg>
        </div>
        <div className="text-xs text-muted-foreground mb-1">Moments Mapped</div>
        <div className="text-3xl font-bold">{totalMoments}</div>
      </div>
    </FadeIn>
  );
}

// ============================================
// Impact Breakdown (horizontal bars — Mesh-style)
// ============================================

function ImpactBreakdown({
  projections,
  delay,
}: {
  projections: ImpactProjection[];
  delay: number;
}) {
  const parsed = projections
    .map((p) => ({
      ...p,
      value: parseDollarValue(p.potentialImpact),
    }))
    .filter((p): p is typeof p & { value: number } => p.value !== null)
    .sort((a, b) => b.value - a.value);

  if (parsed.length === 0) return null;

  const maxValue = parsed[0].value;

  return (
    <FadeIn delay={delay}>
      <div className="rounded-2xl border bg-white p-6">
        <h3 className="text-base font-bold mb-5">Impact by Area</h3>
        <div className="space-y-4">
          {parsed.map((item, i) => {
            const pct = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
            const effortColor =
              item.effort === "low"
                ? "bg-emerald-500"
                : item.effort === "medium"
                ? "bg-amber-500"
                : "bg-red-500";

            return (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.area}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium text-white ${effortColor}`}
                    >
                      {item.effort}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-emerald-700">
                    {item.potentialImpact}
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-1000 ease-out"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">
                    {item.timeToRealize}
                  </span>
                  {item.dataSource && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${
                        item.dataSource === "user_provided"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                          : "bg-slate-50 text-slate-500 border-slate-200"
                      }`}
                    >
                      {item.dataSource === "user_provided"
                        ? "Your data"
                        : "Industry benchmark"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </FadeIn>
  );
}

// ============================================
// Top Drivers (simple bullets — Mesh-style)
// ============================================

function TopDrivers({
  insights,
  delay,
}: {
  insights: ConfrontationInsight[];
  delay: number;
}) {
  const topThree = insights
    .filter((i) => i.likelihood === "high")
    .slice(0, 3);

  if (topThree.length === 0) return null;

  return (
    <FadeIn delay={delay}>
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          Top Impact Drivers
        </h3>
        {topThree.map((insight, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
              </svg>
            </div>
            <span className="text-sm">{insight.immediateAction}</span>
          </div>
        ))}
      </div>
    </FadeIn>
  );
}

// ============================================
// Insight Row (with companionAdvice)
// ============================================

function InsightRow({
  insight,
  index,
}: {
  insight: ConfrontationInsight;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  const likelihoodStyles = {
    high: "border-red-300 bg-red-50 border-l-4 border-l-red-400",
    medium: "border-orange-300 bg-orange-50 border-l-4 border-l-amber-400",
    low: "border-yellow-300 bg-yellow-50 border-l-4 border-l-blue-400",
  };

  const likelihoodBadge = {
    high: "destructive" as const,
    medium: "secondary" as const,
    low: "outline" as const,
  };

  return (
    <FadeIn delay={1400 + index * 200}>
      <div
        className={`rounded-xl border-2 p-5 cursor-pointer transition-all hover:shadow-md ${
          likelihoodStyles[insight.likelihood]
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{insight.pattern}</span>
              <Badge
                variant={likelihoodBadge[insight.likelihood]}
                className="text-xs"
              >
                {insight.likelihood} risk
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {insight.description}
            </p>
          </div>
          <div className="text-muted-foreground text-sm shrink-0">
            {expanded ? "\u2212" : "+"}
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-current/10 grid gap-3">
            {insight.companionAdvice && (
              <div className="rounded-lg bg-slate-800 text-white p-3">
                <div className="text-xs font-semibold text-slate-300 mb-1">
                  CX Mate says
                </div>
                <div className="text-sm italic">
                  &ldquo;{insight.companionAdvice}&rdquo;
                </div>
              </div>
            )}
            <div className="rounded-lg bg-white/80 border p-3">
              <div className="text-xs font-semibold text-red-800 mb-1">
                Business impact
              </div>
              <div className="text-sm">{insight.businessImpact}</div>
            </div>
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
              <div className="text-xs font-semibold text-emerald-800 mb-1">
                Do this now
              </div>
              <div className="text-sm text-emerald-700">
                {insight.immediateAction}
              </div>
            </div>
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
              <div className="text-xs font-semibold text-blue-800 mb-1">
                Measure with
              </div>
              <div className="text-sm text-blue-700">{insight.measureWith}</div>
            </div>
          </div>
        )}
      </div>
    </FadeIn>
  );
}

// ============================================
// Tech Stack Category Colors
// ============================================

const TECH_CATEGORY_COLORS: Record<string, string> = {
  crm: "bg-indigo-100 text-indigo-800 border-indigo-200",
  marketing: "bg-indigo-100 text-indigo-800 border-indigo-200",
  support: "bg-indigo-100 text-indigo-800 border-indigo-200",
  communication: "bg-indigo-100 text-indigo-800 border-indigo-200",
  cs_platform: "bg-indigo-100 text-indigo-800 border-indigo-200",
  analytics: "bg-emerald-100 text-emerald-800 border-emerald-200",
  bi: "bg-emerald-100 text-emerald-800 border-emerald-200",
  survey: "bg-emerald-100 text-emerald-800 border-emerald-200",
  data_infrastructure: "bg-slate-100 text-slate-800 border-slate-200",
};

// ============================================
// Assumptions Modal
// ============================================

function AssumptionsSection({
  assumptions,
  projections,
  delay,
}: {
  assumptions: string[];
  projections: ImpactProjection[];
  delay: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <FadeIn delay={delay}>
      <div className="rounded-2xl border bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Want to see how we estimated this?</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Review the data sources and calculations behind these projections
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={open ? "default" : "outline"}
              size="sm"
              onClick={() => setOpen(!open)}
            >
              {open ? "Hide" : "Review assumptions"}
            </Button>
          </div>
        </div>

        {open && (
          <div className="mt-4 pt-4 border-t space-y-4">
            {/* Calculation details per projection */}
            {projections.filter((p) => p.calculation).length > 0 && (
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Calculations
                </div>
                <div className="space-y-2">
                  {projections
                    .filter((p) => p.calculation)
                    .map((p, i) => (
                      <div
                        key={i}
                        className="rounded-lg bg-slate-50 border p-3"
                      >
                        <div className="text-xs font-medium mb-1">
                          {p.area}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {p.calculation}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Assumptions list */}
            {assumptions.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Key assumptions
                </div>
                <ul className="space-y-1.5">
                  {assumptions.map((a, i) => (
                    <li
                      key={i}
                      className="text-xs text-muted-foreground flex items-start gap-2"
                    >
                      <span className="mt-1 text-slate-400">&bull;</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-xs text-muted-foreground italic pt-2 border-t">
              Projections are directional estimates, not predictions. Actual
              results depend on execution and market conditions.
            </p>
          </div>
        )}
      </div>
    </FadeIn>
  );
}

// ============================================
// Main Confrontation Content
// ============================================

function ConfrontationContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("id");
  const [journey, setJourney] = useState<GeneratedJourney | null>(null);
  const [onboardingData, setOnboardingData] =
    useState<Partial<OnboardingData> | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [mode, setMode] = useState<ConfrontationMode>("early_stage");
  const [hasExistingCustomers, setHasExistingCustomers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [evidenceMap, setEvidenceMap] = useState<EvidenceMap | null>(null);

  useEffect(() => {
    async function load() {
      let loadedJourney: GeneratedJourney | null = null;
      let loadedOnboarding: Partial<OnboardingData> | null = null;

      if (templateId === "preview" || !templateId) {
        const stored = sessionStorage.getItem("cx-mate-journey");
        if (stored) {
          try {
            const data = JSON.parse(stored);
            loadedJourney = data.journey;
            loadedOnboarding = data.onboardingData || null;
            setJourney(data.journey);
            setOnboardingData(loadedOnboarding);
            setCompanyName(
              data.onboardingData?.companyName || "your company"
            );
            setMode(detectMode(data.onboardingData?.companySize || ""));
            setHasExistingCustomers(
              data.onboardingData?.hasExistingCustomers || false
            );
          } catch {
            console.error("Failed to parse stored journey");
          }
        }
      } else {
        try {
          const response = await fetch(`/api/journey/${templateId}`);
          if (response.ok) {
            const data = await response.json();
            loadedJourney = data.journey || null;
            setJourney(loadedJourney);
            const stored = sessionStorage.getItem("cx-mate-journey");
            if (stored) {
              const parsed = JSON.parse(stored);
              loadedOnboarding = parsed.onboardingData || null;
              setOnboardingData(loadedOnboarding);
              setCompanyName(
                parsed.onboardingData?.companyName || "your company"
              );
              setMode(
                detectMode(parsed.onboardingData?.companySize || "")
              );
              setHasExistingCustomers(
                parsed.onboardingData?.hasExistingCustomers || false
              );
            }
          }
        } catch (err) {
          console.error("Failed to load journey:", err);
        }
      }

      if (loadedJourney && loadedOnboarding) {
        setEvidenceMap(buildEvidenceMap(loadedOnboarding, loadedJourney));
      }

      setLoading(false);
    }
    load();
  }, [templateId]);

  useEffect(() => {
    if (!loading && journey) {
      const timer = setTimeout(() => setHeaderVisible(true), 300);
      return () => clearTimeout(timer);
    }
  }, [loading, journey]);

  const insights = useMemo(
    () => journey?.confrontationInsights || [],
    [journey]
  );
  const projections = useMemo(
    () => journey?.impactProjections || [],
    [journey]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-2xl font-bold">Analyzing your business...</div>
          <p className="text-muted-foreground">
            Running CX intelligence engine
          </p>
        </div>
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">No analysis available</h1>
          <p className="text-muted-foreground">
            Complete the onboarding to get your CX intelligence report.
          </p>
          <Link href="/onboarding">
            <Button>Start Onboarding</Button>
          </Link>
        </div>
      </div>
    );
  }

  const highRiskCount = insights.filter((i) => i.likelihood === "high").length;
  const totalMoments = journey.stages.reduce(
    (sum, s) => sum + s.meaningfulMoments.length,
    0
  );
  const criticalMoments = journey.stages.reduce(
    (sum, s) =>
      sum +
      s.meaningfulMoments.filter((m) => m.severity === "critical").length,
    0
  );

  const config = MODE_CONFIG[mode];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div
          className={`text-center space-y-4 mb-10 transition-all duration-[1200ms] ${
            headerVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <p className="text-sm font-medium text-primary uppercase tracking-widest">
              CX Intelligence Report
            </p>
            <span
              className={`text-xs px-2 py-0.5 rounded-full border font-medium ${config.badgeColor}`}
            >
              {config.label}
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            {config.headline(companyName)}
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            {config.subtitle}
          </p>
        </div>

        {/* === SECTION 1: VALUE (Mesh-style) === */}

        {/* Hero Impact Card — the big number */}
        {projections.length > 0 && (
          <div className="mb-6">
            <HeroImpactCard projections={projections} delay={500} />
          </div>
        )}

        {/* Stat pair cards */}
        <StatPairCards
          highRiskCount={highRiskCount}
          criticalMoments={criticalMoments}
          totalMoments={totalMoments}
          delay={700}
        />

        {/* Impact breakdown bars */}
        {projections.length > 0 && (
          <div className="mt-6 mb-6">
            <ImpactBreakdown projections={projections} delay={900} />
          </div>
        )}

        {/* Top drivers */}
        {insights.length > 0 && (
          <div className="mb-6">
            <TopDrivers insights={insights} delay={1000} />
          </div>
        )}

        {/* Transparency — review assumptions */}
        {(journey.assumptions?.length || projections.some((p) => p.calculation)) && (
          <div className="mb-12">
            <AssumptionsSection
              assumptions={journey.assumptions || []}
              projections={projections}
              delay={1100}
            />
          </div>
        )}

        {/* === SECTION 2: EVIDENCE === */}

        {evidenceMap && (
          <FadeIn delay={1200} className="mb-12" slow>
            <EvidenceWall
              evidenceMap={evidenceMap}
              companyName={companyName}
              biggestChallenge={onboardingData?.biggestChallenge}
            />
          </FadeIn>
        )}

        {/* === SECTION 3: MATURITY === */}

        {journey.maturityAssessment && (
          <FadeIn delay={1300} className="mb-12">
            <Card className="border-slate-200 bg-gradient-to-br from-slate-50 to-white">
              <CardHeader>
                <CardTitle className="text-base">
                  {config.maturityHeading(hasExistingCustomers)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {journey.maturityAssessment}
                </p>
              </CardContent>
            </Card>
          </FadeIn>
        )}

        {/* === SECTION 4: DETAILED INSIGHTS === */}

        {insights.length > 0 && (
          <div className="mb-12">
            <FadeIn delay={1300}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">
                  {config.insightsHeading(hasExistingCustomers)}
                </h2>
                {highRiskCount > 0 && (
                  <Badge variant="destructive">
                    {highRiskCount} high priority
                  </Badge>
                )}
              </div>
            </FadeIn>

            <div className="space-y-3">
              {insights.map((insight, i) => (
                <InsightRow key={i} insight={insight} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* === SECTION 5: TECH STACK === */}

        {journey.techStackRecommendations &&
          journey.techStackRecommendations.length > 0 && (
            <div className="mb-12">
              <FadeIn delay={2100}>
                <h2 className="text-2xl font-bold mb-2">
                  Recommended tech stack
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Tools to connect for maximum CX impact at your stage
                </p>
              </FadeIn>
              <div className="grid gap-3">
                {journey.techStackRecommendations.map((rec, i) => (
                  <FadeIn key={i} delay={2200 + i * 100}>
                    <div className="rounded-xl border bg-white p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                            TECH_CATEGORY_COLORS[rec.category] ||
                            "bg-blue-100 text-blue-800 border-blue-200"
                          }`}
                        >
                          {rec.categoryLabel}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {rec.tools.map((tool, j) => (
                          <span
                            key={j}
                            className="text-sm font-medium bg-slate-100 px-2 py-1 rounded"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {rec.whyNow}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Connect with:</span>{" "}
                        {rec.connectWith}
                      </p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          )}

        {/* === CTA === */}

        <FadeIn delay={2400} className="text-center space-y-4">
          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold mb-2">
              Ready to see the full picture?
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Your complete journey map with stage-by-stage guidance, action
              templates, and CX tool recommendations.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link href={`/journey?id=${templateId}`}>
                <Button size="lg">See Your Full Journey Map</Button>
              </Link>
              <Link href="/playbook">
                <Button size="lg" variant="outline">
                  Get Your Playbook
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

export default function ConfrontationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="text-2xl font-bold">Analyzing...</div>
          </div>
        </div>
      }
    >
      <ConfrontationContent />
    </Suspense>
  );
}
