"use client";

import { Suspense, useEffect, useState } from "react";
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
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
    >
      {children}
    </div>
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
    high: "border-red-300 bg-red-50",
    medium: "border-orange-300 bg-orange-50",
    low: "border-yellow-300 bg-yellow-50",
  };

  const likelihoodBadge = {
    high: "destructive" as const,
    medium: "secondary" as const,
    low: "outline" as const,
  };

  return (
    <FadeIn delay={800 + index * 200}>
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
            {/* CX Mate companion advice */}
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
// Impact Card (with calculation + dataSource)
// ============================================

function ImpactCard({
  projection,
  index,
}: {
  projection: ImpactProjection;
  index: number;
}) {
  const effortColor = {
    low: "bg-emerald-100 text-emerald-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  const dataSourceLabel =
    projection.dataSource === "user_provided"
      ? "Based on your numbers"
      : "Based on industry benchmarks";

  return (
    <FadeIn delay={1600 + index * 150}>
      <div className="rounded-xl border bg-white p-5 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="font-semibold text-sm">{projection.area}</div>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              effortColor[projection.effort as keyof typeof effortColor] ||
              effortColor.medium
            }`}
          >
            {projection.effort} effort
          </span>
        </div>
        <div className="text-2xl font-bold text-emerald-700">
          <AnimatedValue value={projection.potentialImpact} delay={1800 + index * 150} />
        </div>
        <div className="text-xs text-muted-foreground">
          {projection.timeToRealize}
        </div>

        {/* Transparent calculation */}
        {projection.calculation && (
          <div className="mt-2 pt-2 border-t">
            <div className="text-xs text-muted-foreground font-mono bg-slate-50 rounded px-2 py-1.5">
              {projection.calculation}
            </div>
          </div>
        )}

        {/* Data source badge */}
        {projection.dataSource && (
          <div className="flex items-center gap-1">
            <span
              className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                projection.dataSource === "user_provided"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              {dataSourceLabel}
            </span>
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
  const [companyName, setCompanyName] = useState<string>("");
  const [mode, setMode] = useState<ConfrontationMode>("early_stage");
  const [hasExistingCustomers, setHasExistingCustomers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    async function load() {
      if (templateId === "preview" || !templateId) {
        // Preview mode — load from sessionStorage
        const stored = sessionStorage.getItem("cx-mate-journey");
        if (stored) {
          try {
            const data = JSON.parse(stored);
            setJourney(data.journey);
            setCompanyName(data.onboardingData?.companyName || "your company");
            setMode(detectMode(data.onboardingData?.companySize || ""));
            setHasExistingCustomers(
              data.onboardingData?.hasExistingCustomers || false
            );
          } catch {
            console.error("Failed to parse stored journey");
          }
        }
      } else {
        // Persisted mode — fetch from API
        try {
          const response = await fetch(`/api/journey/${templateId}`);
          if (response.ok) {
            const data = await response.json();
            setJourney(data.journey || null);
            // For persisted journeys, try to get onboarding data from sessionStorage as fallback
            const stored = sessionStorage.getItem("cx-mate-journey");
            if (stored) {
              const parsed = JSON.parse(stored);
              setCompanyName(parsed.onboardingData?.companyName || "your company");
              setMode(detectMode(parsed.onboardingData?.companySize || ""));
              setHasExistingCustomers(parsed.onboardingData?.hasExistingCustomers || false);
            }
          }
        } catch (err) {
          console.error("Failed to load journey:", err);
        }
      }
      setLoading(false);
    }
    load();
  }, [templateId]);

  useEffect(() => {
    if (!loading && journey) {
      const timer = setTimeout(() => setHeaderVisible(true), 200);
      return () => clearTimeout(timer);
    }
  }, [loading, journey]);

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

  const insights = journey.confrontationInsights || [];
  const projections = journey.impactProjections || [];
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header — dramatic reveal */}
        <div
          className={`text-center space-y-4 mb-12 transition-all duration-1000 ${
            headerVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              CX Intelligence Report
            </div>
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

        {/* Quick stats bar */}
        <FadeIn delay={400} className="mb-10">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center rounded-xl border bg-white p-4">
              <div className="text-3xl font-bold">
                <AnimatedValue
                  value={String(journey.stages.length)}
                  delay={600}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Journey stages
              </div>
            </div>
            <div className="text-center rounded-xl border bg-white p-4">
              <div className="text-3xl font-bold">
                <AnimatedValue value={String(totalMoments)} delay={700} />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Meaningful moments
              </div>
            </div>
            <div className="text-center rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="text-3xl font-bold text-red-700">
                <AnimatedValue value={String(criticalMoments)} delay={800} />
              </div>
              <div className="text-xs text-red-600 mt-1">
                {config.criticalLabel(hasExistingCustomers)}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Maturity Assessment */}
        {journey.maturityAssessment && (
          <FadeIn delay={600} className="mb-10">
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

        {/* Confrontation Insights — the core "aha" section */}
        {insights.length > 0 && (
          <div className="mb-10">
            <FadeIn delay={700}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
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

        {/* Impact Projections — the "what you could gain" section */}
        {projections.length > 0 && (
          <div className="mb-12">
            <FadeIn delay={1500}>
              <h2 className="text-xl font-bold mb-4">
                {config.impactHeading(hasExistingCustomers)}
              </h2>
            </FadeIn>

            <div className="grid gap-3">
              {projections.map((projection, i) => (
                <ImpactCard key={i} projection={projection} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* CTA — proceed to full journey */}
        <FadeIn delay={2000} className="text-center space-y-4">
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
