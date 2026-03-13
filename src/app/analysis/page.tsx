"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type {
  GeneratedJourney,
  ConfrontationInsight,
  ImpactProjection,
} from "@/lib/ai/journey-prompt";
import type { OnboardingData } from "@/types/onboarding";
import { buildEvidenceMap, getInsightAnnotations, type EvidenceMap } from "@/lib/evidence-matching";
import { EvidenceWall } from "@/components/evidence/evidence-wall";
import { track } from "@/lib/analytics";
import { ExportPdfButton } from "@/components/ui/export-pdf-button";
import { PrintCover } from "@/components/pdf/print-cover";
import { PageLoading } from "@/components/ui/page-loading";
import { SaveResultsBanner } from "@/components/ui/save-results-banner";
import { usePlanTier } from "@/hooks/use-plan-tier";
import { UpgradeGate, LockedSection } from "@/components/ui/upgrade-gate";

// ─── Confrontation Modes ────────────────────────────────────────────────────

type ConfrontationMode = "early_stage" | "growing" | "established";

function detectMode(companyMaturity?: string): ConfrontationMode {
  switch (companyMaturity) {
    case "pre_launch":
    case "first_customers":
      return "early_stage";
    case "growing":
      return "growing";
    case "scaling":
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
  }
> = {
  early_stage: {
    label: "Foundation Analysis",
    headline: (company) => `${company}, let\u2019s build this right.`,
    subtitle:
      "We analyzed your setup against what works for companies at your stage. Here\u2019s where the biggest opportunities are.",
    insightsHeading: (hasCustomers) =>
      hasCustomers
        ? "What typically trips up companies at your stage"
        : "What to get right from day one",
  },
  growing: {
    label: "Growth Intelligence",
    headline: (company) => `${company}, growth changes everything.`,
    subtitle:
      "We analyzed your business against CX patterns from companies scaling past your stage.",
    insightsHeading: () => "What typically trips up companies at your stage",
  },
  established: {
    label: "Optimization Report",
    headline: (company) => `${company}, time to compound.`,
    subtitle:
      "At your scale, small CX improvements compound into major revenue impact.",
    insightsHeading: () => "Optimization opportunities",
  },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function parseDollarValue(impact: string): number | null {
  let match = impact.match(/\$[\d,.]+\s*[KkMmBb]?/);
  if (!match) match = impact.match(/[\d,.]+\s*[KkMmBb]/);
  if (!match) match = impact.match(/[\d,]+(?:\.\d+)?/);
  if (!match) return null;
  let raw = match[0].replace(/[$,\s]/g, "");
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
  if (isNaN(num) || num < 100) return null;
  return num * multiplier;
}

function formatDollarCompact(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${Math.round(value)}`;
}

// ─── FadeIn ─────────────────────────────────────────────────────────────────

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
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Hero Section ───────────────────────────────────────────────────────────

function HeroSection({
  projections,
  companyName,
  firstName,
  config,
  delay,
}: {
  projections: ImpactProjection[];
  companyName: string;
  firstName: string;
  config: (typeof MODE_CONFIG)[ConfrontationMode];
  delay: number;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const values = projections
    .map((p) => parseDollarValue(p.potentialImpact))
    .filter((v): v is number => v !== null);
  const total = values.reduce((s, v) => s + v, 0);

  if (values.length > 0) {
    const lo = formatDollarCompact(Math.round(total * 0.7));
    const hi = formatDollarCompact(Math.round(total * 1.3));

    return (
      <div
        className={`rounded-2xl bg-gradient-to-br from-slate-800 to-teal-900 text-white p-8 md:p-10 transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {firstName && (
          <p className="text-sm text-teal-300 font-medium mb-1">
            Here&apos;s what we found, {firstName}.
          </p>
        )}
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
          {config.label}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 leading-tight">
          {config.headline(companyName)}
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed max-w-lg mb-6">
          {config.subtitle}
        </p>
        <div className="border-t border-white/15 pt-5">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">
            Potential revenue at risk annually
          </p>
          <div className="text-5xl md:text-6xl font-bold tracking-tight">
            {lo} &ndash; {hi}
          </div>
          <p className="text-sm text-slate-400 mt-2">
            Based on your deal size, customer count, and industry benchmarks.
          </p>
        </div>
      </div>
    );
  }

  // Fallback — no parseable dollar values
  return (
    <div
      className={`rounded-2xl bg-gradient-to-br from-slate-800 to-teal-900 text-white p-8 md:p-10 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {firstName && (
        <p className="text-sm text-teal-300 font-medium mb-1">
          Here&apos;s what we found, {firstName}.
        </p>
      )}
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
        {config.label}
      </p>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 leading-tight">
        {config.headline(companyName)}
      </h1>
      <p className="text-sm text-slate-300 leading-relaxed max-w-lg mb-6">
        {config.subtitle}
      </p>
      <div className="border-t border-white/15 pt-5">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">
          Impact areas identified
        </p>
        <div className="text-4xl font-bold tracking-tight">
          {projections.length} risk{" "}
          {projections.length === 1 ? "area" : "areas"}
        </div>
        <div className="mt-4 space-y-2">
          {projections.slice(0, 3).map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              <span className="text-sm text-slate-300">
                {p.area}: {p.potentialImpact}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Stat Row ───────────────────────────────────────────────────────────────

function StatRow({
  highRisk,
  critical,
  moments,
  delay,
}: {
  highRisk: number;
  critical: number;
  moments: number;
  delay: number;
}) {
  return (
    <FadeIn delay={delay} className="grid grid-cols-3 gap-3">
      <div
        className={`rounded-xl p-5 ${
          highRisk > 0
            ? "bg-rose-50 border border-rose-100"
            : "bg-white border border-slate-200"
        }`}
      >
        <div
          className={`text-3xl font-bold tracking-tight ${
            highRisk > 0 ? "text-rose-600" : "text-slate-900"
          }`}
        >
          {highRisk}
        </div>
        <div
          className={`text-xs mt-1 font-medium ${
            highRisk > 0 ? "text-rose-500" : "text-slate-500"
          }`}
        >
          High-risk patterns
        </div>
      </div>
      <div
        className={`rounded-xl p-5 ${
          critical > 0
            ? "bg-rose-50 border border-rose-100"
            : "bg-white border border-slate-200"
        }`}
      >
        <div
          className={`text-3xl font-bold tracking-tight ${
            critical > 0 ? "text-rose-700" : "text-slate-900"
          }`}
        >
          {critical}
        </div>
        <div
          className={`text-xs mt-1 font-medium ${
            critical > 0 ? "text-rose-600" : "text-slate-500"
          }`}
        >
          Critical moments
        </div>
      </div>
      <div className="rounded-xl p-5 bg-white border border-slate-200">
        <div className="text-3xl font-bold tracking-tight text-slate-900">
          {moments}
        </div>
        <div className="text-xs text-slate-500 mt-1 font-medium">
          Moments mapped
        </div>
      </div>
    </FadeIn>
  );
}

// ─── Journey Danger Map ─────────────────────────────────────────────────────

function JourneyDangerMap({
  stages,
  templateId,
  delay,
}: {
  stages: GeneratedJourney["stages"];
  templateId: string | null;
  delay: number;
}) {
  const dangerStages = new Set<number>();
  stages.forEach((stage, idx) => {
    const hasCritical = stage.meaningfulMoments?.some(
      (m) => m.severity === "critical"
    );
    if (hasCritical) dangerStages.add(idx);
  });

  return (
    <FadeIn delay={delay}>
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Your customer lifecycle
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {stages.filter((s) => s.stageType === "sales").length} pre-sale +{" "}
              {stages.filter((s) => s.stageType === "customer").length}{" "}
              post-sale stages
            </p>
          </div>
          <Link href={`/journey?id=${templateId}`}>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              Full journey map &rarr;
            </Button>
          </Link>
        </div>
        <div className="flex items-start gap-0 overflow-x-auto pb-2">
          {stages.map((stage, idx) => {
            const isDanger = dangerStages.has(idx);
            return (
              <div key={idx} className="flex items-start shrink-0">
                <div className="flex flex-col items-center gap-1.5 w-[90px]">
                  <div className="relative">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0 ${
                        isDanger
                          ? "bg-rose-500 ring-2 ring-rose-200"
                          : stage.stageType === "sales"
                          ? "bg-sky-500"
                          : "bg-teal-500"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    {isDanger && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full flex items-center justify-center">
                        <span className="text-[7px] text-white font-bold">
                          !
                        </span>
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-[10px] text-center leading-tight w-full ${
                      isDanger
                        ? "text-rose-600 font-semibold"
                        : "text-slate-600"
                    }`}
                  >
                    {stage.name}
                  </p>
                  {isDanger && (
                    <span className="text-[8px] font-bold uppercase tracking-widest text-rose-500">
                      Risk
                    </span>
                  )}
                </div>
                {idx < stages.length - 1 && (
                  <div
                    className={`w-6 h-px shrink-0 mt-[18px] -ml-[5px] -mr-[5px] ${
                      isDanger ? "bg-rose-300" : "bg-slate-300"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </FadeIn>
  );
}

// ─── Impact Breakdown ───────────────────────────────────────────────────────

function ImpactBreakdown({
  projections,
  delay,
}: {
  projections: ImpactProjection[];
  delay: number;
}) {
  const parsed = projections
    .map((p) => ({ ...p, value: parseDollarValue(p.potentialImpact) }))
    .filter(
      (p): p is typeof p & { value: number } => p.value !== null
    )
    .sort((a, b) => b.value - a.value);

  if (!parsed.length) return null;
  const max = parsed[0].value;

  return (
    <FadeIn delay={delay}>
      <div className="rounded-xl border bg-white p-6">
        <div className="mb-5">
          <h3 className="text-base font-semibold text-slate-900">
            Where the risk is concentrated
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Estimated from your deal size, churn rate, and industry benchmarks
          </p>
        </div>
        <div className="space-y-5">
          {parsed.map((item, i) => {
            const pct = max > 0 ? (item.value / max) * 100 : 0;
            return (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-800">
                    {item.area}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {item.potentialImpact}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-slate-400 transition-all duration-1000 ease-out"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-slate-500">
                    {item.timeToRealize}
                  </span>
                  <span className="text-xs text-slate-500">
                    {item.effort} effort &middot;{" "}
                    {item.dataSource === "user_provided"
                      ? "your data"
                      : "industry benchmark"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </FadeIn>
  );
}

// ─── Insight Card ───────────────────────────────────────────────────────────

function InsightCard({
  insight,
  index,
  locked = false,
  annotations,
}: {
  insight: ConfrontationInsight;
  index: number;
  locked?: boolean;
  annotations?: { painPoints: string[]; competitorContext: string | null };
}) {
  const [expanded, setExpanded] = useState(false);

  const isHigh = insight.likelihood === "high";
  const isMedium = insight.likelihood === "medium";

  const cardStyle = isHigh
    ? "border-l-4 border-l-rose-500 border-t border-r border-b border-rose-100 bg-rose-50/40"
    : isMedium
    ? "border-l-4 border-l-amber-400 border-t border-r border-b border-amber-100 bg-amber-50/20"
    : "border border-slate-200 bg-white";

  const badge = isHigh ? (
    <span className="text-xs font-bold uppercase tracking-widest text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full shrink-0">
      Urgent
    </span>
  ) : isMedium ? (
    <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
      Important
    </span>
  ) : (
    <span className="text-xs font-medium uppercase tracking-widest text-slate-400 shrink-0">
      On radar
    </span>
  );

  const hasPainBadges = annotations && annotations.painPoints.length > 0;
  const hasCompBadge = annotations && annotations.competitorContext;

  return (
    <FadeIn delay={1200 + index * 150}>
      <div
        className={`rounded-xl cursor-pointer transition-all hover:shadow-sm ${cardStyle}`}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Collapsed header */}
        <div className="flex items-start gap-3 px-5 py-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              {badge}
              {isHigh && !expanded && insight.immediateAction && (
                <span className="text-xs text-rose-500 font-medium truncate hidden sm:block">
                  Act:{" "}
                  {insight.immediateAction.slice(0, 50)}
                  {insight.immediateAction.length > 50 ? "\u2026" : ""}
                </span>
              )}
            </div>
            <p
              className={`text-sm font-semibold leading-snug ${
                isHigh
                  ? "text-slate-900"
                  : isMedium
                  ? "text-slate-800"
                  : "text-slate-700"
              }`}
            >
              {insight.pattern}
            </p>
            {(hasPainBadges || hasCompBadge) && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {annotations!.painPoints.map((pp, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full"
                  >
                    <svg
                      className="w-2.5 h-2.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {pp}
                  </span>
                ))}
                {hasCompBadge && (
                  <span className="inline-flex items-center text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {annotations!.competitorContext}
                  </span>
                )}
              </div>
            )}
          </div>
          <span
            className={`text-sm shrink-0 mt-0.5 ${
              isHigh
                ? "text-rose-300"
                : isMedium
                ? "text-amber-300"
                : "text-slate-300"
            }`}
          >
            {expanded ? "\u2212" : "+"}
          </span>
        </div>

        {/* Expanded detail */}
        {expanded && !locked && (
          <div
            className={`px-5 pb-5 space-y-4 border-t pt-4 ${
              isHigh
                ? "border-rose-100"
                : isMedium
                ? "border-amber-100"
                : "border-slate-100"
            }`}
          >
            <p className="text-sm text-slate-600 leading-relaxed">
              {insight.description}
            </p>

            {insight.evidenceBasis && (
              <div className="rounded-lg bg-amber-50/60 border border-amber-200/60 p-3">
                <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">
                  Why we flagged this
                </p>
                <p className="text-sm text-amber-800">
                  {insight.evidenceBasis.replace(/^\[.*?\]\s*/, "")}
                </p>
              </div>
            )}

            {insight.immediateAction && (
              <div
                className={`rounded-lg p-4 ${
                  isHigh
                    ? "bg-rose-50 border border-rose-200"
                    : isMedium
                    ? "bg-amber-50 border border-amber-200"
                    : "bg-slate-50 border border-slate-200"
                }`}
              >
                <p
                  className={`text-xs font-bold uppercase tracking-widest mb-1.5 ${
                    isHigh
                      ? "text-rose-600"
                      : isMedium
                      ? "text-amber-700"
                      : "text-slate-500"
                  }`}
                >
                  {isHigh ? "Do this now" : "Next action"}
                </p>
                <p
                  className={`text-sm font-medium ${
                    isHigh
                      ? "text-rose-900"
                      : isMedium
                      ? "text-amber-900"
                      : "text-slate-700"
                  }`}
                >
                  {insight.immediateAction}
                </p>
              </div>
            )}

            {insight.businessImpact && (
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Business impact
                </p>
                <p className="text-sm text-slate-700">
                  {insight.businessImpact}
                </p>
              </div>
            )}

            {insight.measureWith && (
              <p className="text-sm text-slate-400">
                <span className="font-medium text-slate-500">
                  Measure with:{" "}
                </span>
                {insight.measureWith}
              </p>
            )}

            {insight.companionAdvice && (
              <div className="border-l-2 border-slate-200 pl-3">
                <p className="text-sm text-slate-500 italic">
                  &ldquo;{insight.companionAdvice}&rdquo;
                </p>
              </div>
            )}
          </div>
        )}

        {/* Locked teaser */}
        {expanded && locked && (
          <div
            className={`px-5 pb-5 border-t pt-4 ${
              isHigh
                ? "border-rose-100"
                : isMedium
                ? "border-amber-100"
                : "border-slate-100"
            }`}
          >
            <div className="relative">
              <div
                className="blur-[5px] pointer-events-none select-none opacity-40 space-y-3"
                aria-hidden="true"
              >
                <p className="text-sm text-slate-600">
                  This pattern is costing companies at your stage significant
                  revenue. The full analysis explains exactly why and gives you a
                  concrete action plan.
                </p>
                <div className="rounded-lg p-4 bg-slate-50 border border-slate-200">
                  <p className="text-xs font-bold uppercase text-slate-500 mb-1">
                    Next action
                  </p>
                  <p className="text-sm text-slate-700">
                    Implement a structured approach to address this specific gap
                    in your customer journey.
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Link
                  href="/pricing"
                  className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-md px-5 py-3 text-center hover:shadow-lg transition-shadow"
                >
                  <p className="text-sm font-semibold text-slate-900">
                    See the full analysis
                  </p>
                  <p className="text-xs text-primary font-medium mt-0.5">
                    Get My Full Analysis &mdash; $149
                  </p>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </FadeIn>
  );
}

// ─── Assumptions ────────────────────────────────────────────────────────────

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
  if (!assumptions.length && !projections.some((p) => p.calculation))
    return null;

  return (
    <FadeIn delay={delay}>
      <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between text-left"
        >
          <span className="text-sm font-medium text-slate-600">
            How we calculated these numbers
          </span>
          <span className="text-sm text-slate-500">
            {open ? "Hide \u2191" : "Show \u2193"}
          </span>
        </button>
        {open && (
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
            {projections
              .filter((p) => p.calculation)
              .map((p, i) => (
                <div key={i}>
                  <p className="text-sm font-medium text-slate-700 mb-0.5">
                    {p.area}
                  </p>
                  <p className="text-sm text-slate-500 font-mono">
                    {p.calculation}
                  </p>
                </div>
              ))}
            {assumptions.length > 0 && (
              <div className="pt-2 border-t border-slate-200">
                <p className="text-xs font-medium text-slate-600 mb-2">
                  Key assumptions
                </p>
                {assumptions.map((a, i) => (
                  <p
                    key={i}
                    className="text-sm text-slate-500 flex gap-2 mb-1"
                  >
                    <span className="shrink-0">&middot;</span>
                    <span>{a}</span>
                  </p>
                ))}
              </div>
            )}
            <p className="text-xs text-slate-500 italic pt-2 border-t border-slate-200">
              These are directional estimates to help you prioritize, not
              guarantees.
            </p>
          </div>
        )}
      </div>
    </FadeIn>
  );
}

// ─── Quick Wins Preview ─────────────────────────────────────────────────────

function QuickWinsPreview({
  stages,
  delay,
}: {
  stages: GeneratedJourney["stages"];
  delay: number;
}) {
  const quickWins = stages
    .flatMap((stage) =>
      (stage.meaningfulMoments || []).map((m) => ({
        ...m,
        stageName: stage.name,
      }))
    )
    .filter((m) => m.severity === "critical" && m.nextStep)
    .slice(0, 3);

  if (!quickWins.length) return null;

  return (
    <FadeIn delay={delay}>
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-slate-900">
            Quick wins to start with
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            High-impact actions you can take this week
          </p>
        </div>
        <div className="space-y-3">
          {quickWins.map((win, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg bg-primary/5 border border-primary/15 px-4 py-3"
            >
              <span className="text-primary text-sm mt-0.5 shrink-0">
                &#9889;
              </span>
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {win.nextStep}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {win.stageName} &middot; {win.name}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100">
          <Link href="/playbook">
            <Button variant="outline" size="sm" className="w-full text-xs">
              See full playbook with all actions &rarr;
            </Button>
          </Link>
        </div>
      </div>
    </FadeIn>
  );
}

// ─── Methodology Note ───────────────────────────────────────────────────────

function MethodologyNote({
  note,
  delay,
}: {
  note: GeneratedJourney["methodologyNote"];
  delay: number;
}) {
  if (!note) return null;

  return (
    <FadeIn delay={delay}>
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
          How we built this analysis
        </p>
        <p className="text-sm text-slate-600 mb-3">{note.personalizedTo}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {note.dataLayersUsed?.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
                Data layers
              </p>
              <div className="flex flex-wrap gap-1">
                {note.dataLayersUsed.map((d, i) => (
                  <span
                    key={i}
                    className="text-[11px] bg-white border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}
          {note.frameworksApplied?.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
                Frameworks
              </p>
              <div className="flex flex-wrap gap-1">
                {note.frameworksApplied.map((f, i) => (
                  <span
                    key={i}
                    className="text-[11px] bg-white border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}
          {note.crossReferences?.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
                Cross-references
              </p>
              <div className="flex flex-wrap gap-1">
                {note.crossReferences.map((c, i) => (
                  <span
                    key={i}
                    className="text-[11px] bg-white border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
}

// ─── CX Brief Content ──────────────────────────────────────────────────────

function CxBriefContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("id");
  const { canAccess } = usePlanTier();
  const canSeeDetails = canAccess("report_details");
  const canSeeEvidence = canAccess("evidence_wall");

  const [journey, setJourney] = useState<GeneratedJourney | null>(null);
  const [onboardingData, setOnboardingData] =
    useState<Partial<OnboardingData> | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [mode, setMode] = useState<ConfrontationMode>("early_stage");
  const [hasExistingCustomers, setHasExistingCustomers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [evidenceMap, setEvidenceMap] = useState<EvidenceMap | null>(null);

  useEffect(() => {
    async function load() {
      let j: GeneratedJourney | null = null;
      let od: Partial<OnboardingData> | null = null;
      let company = "";
      let user = "";

      // Helper: load from sessionStorage
      function loadFromSession(): boolean {
        const stored = sessionStorage.getItem("cx-mate-journey");
        if (!stored) return false;
        try {
          const data = JSON.parse(stored);
          if (data.journey && Array.isArray(data.journey.stages)) {
            j = data.journey as GeneratedJourney;
            od = data.onboardingData || null;
            company =
              data.onboardingData?.companyName || "your company";
            user =
              data.onboardingData?.contactName?.split(" ")[0] ||
              data.onboardingData?.userName?.split(" ")[0] ||
              "";
            return true;
          }
        } catch (err) {
          console.error("Failed to load journey:", err);
        }
        return false;
      }

      // Preview mode: prefer sessionStorage
      if (templateId === "preview" || !templateId) {
        loadFromSession();
      }

      // Authenticated mode: try Supabase, fall back to session
      if (!j) {
        try {
          const res = await fetch("/api/journey/default");
          if (res.ok) {
            const json = await res.json();
            if (
              json.success &&
              json.journey &&
              Array.isArray(json.journey.stages)
            ) {
              j = json.journey;
              od = json.onboardingData || null;
              company =
                json.onboardingData?.companyName || "your company";
              user =
                json.onboardingData?.userName?.split(" ")[0] || "";
            }
          }
        } catch {
          /* not authenticated or API error */
        }
      }

      // Final fallback: sessionStorage
      if (!j) {
        loadFromSession();
      }

      if (j) {
        setJourney(j);
        setOnboardingData(od);
        setCompanyName(company);
        setFirstName(user);
        setMode(
          detectMode(
            (od as Record<string, string> | null)?.companyMaturity ||
              (od as Record<string, string> | null)?.companySize
          )
        );
        setHasExistingCustomers(
          !!(od as Record<string, boolean> | null)?.hasExistingCustomers
        );
        if (od) {
          setEvidenceMap(buildEvidenceMap(od, j));
        }
        track("cx_brief_viewed", {
          template_id: templateId ?? undefined,
          company_name: company || undefined,
          mode,
          stage_count: j.stages.length,
        });
      }
      setLoading(false);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId]);

  const insights = useMemo(
    () => journey?.confrontationInsights || [],
    [journey]
  );
  const projections = useMemo(
    () => journey?.impactProjections || [],
    [journey]
  );

  if (loading) {
    return <PageLoading label="Preparing your CX brief..." />;
  }

  // ─── Empty state — no journey yet ──────────────────────────────────────
  if (!journey) {
    return (
      <div className="max-w-2xl mx-auto px-6 pt-8 pb-24">
        <div className="mb-12">
          <p className="text-xs font-semibold text-primary/70 uppercase tracking-widest mb-3">
            CX Intelligence
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 leading-tight mb-4">
            Your customers have a journey.
            <br />
            <span className="text-slate-500">
              You just haven&apos;t mapped it yet.
            </span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed max-w-lg">
            One conversation about your business. In return: your full customer
            lifecycle mapped, the risks quantified, and a playbook for what to
            fix first.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-10">
          <div
            className="rounded-2xl border-2 p-5 shadow-lg"
            style={{ backgroundColor: "#E0F7F4", borderColor: "#0D9488" }}
          >
            <p className="text-sm font-bold text-slate-800 mb-1">CX Brief</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Revenue at risk, danger zones, and what to fix first
            </p>
            <div
              className="mt-3 pt-2 border-t text-xs font-semibold"
              style={{ borderColor: "#0D9488", color: "#134E4A" }}
            >
              Quantified risk analysis
            </div>
          </div>
          <div
            className="rounded-2xl border-2 p-5 shadow-lg"
            style={{ backgroundColor: "#FFF1F2", borderColor: "#F43F5E" }}
          >
            <p className="text-sm font-bold text-slate-800 mb-1">
              Journey Map
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your full lifecycle, stage by stage
            </p>
            <div className="mt-3 pt-2 border-t border-rose-200 text-xs font-semibold text-rose-700">
              50+ meaningful moments
            </div>
          </div>
          <div
            className="rounded-2xl border-2 p-5 shadow-lg"
            style={{ backgroundColor: "#DCFCE7", borderColor: "#16A34A" }}
          >
            <p className="text-sm font-bold text-slate-800 mb-1">
              CX Playbook
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              AI-built action plan for your stack
            </p>
            <div className="mt-3 pt-2 border-t border-green-200 text-xs font-semibold text-green-800">
              Week 1 quick wins ready
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/onboarding">
            <Button size="lg" className="font-semibold px-8">
              Find where I&apos;m losing them &rarr;
            </Button>
          </Link>
          <p className="text-xs text-slate-400">
            Results in minutes, not months
          </p>
        </div>
      </div>
    );
  }

  // ─── Computed values ───────────────────────────────────────────────────
  const highRiskCount = insights.filter(
    (i) => i.likelihood === "high"
  ).length;
  const totalMoments = journey.stages.reduce(
    (s, st) =>
      s +
      (Array.isArray(st?.meaningfulMoments)
        ? st.meaningfulMoments.length
        : 0),
    0
  );
  const criticalMoments = journey.stages.reduce(
    (s, st) =>
      s +
      (st.meaningfulMoments || []).filter((m) => m.severity === "critical")
        .length,
    0
  );
  const config = MODE_CONFIG[mode];

  // ─── Main CX Brief Layout ─────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      <PrintCover
        firstName={firstName || undefined}
        companyName={companyName || undefined}
        documentType="CX Intelligence Report"
      />

      <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">
        {/* Export button */}
        <div className="flex justify-end">
          {canAccess("pdf_export") && (
            <ExportPdfButton
              page="analysis"
              title={`${companyName || "CX Mate"} - CX Brief`}
            />
          )}
        </div>

        {/* Save banner */}
        <SaveResultsBanner
          isPreview={templateId === "preview" || !templateId}
          companyName={companyName}
        />

        {/* 1. HERO — the AHA moment */}
        <HeroSection
          projections={projections}
          companyName={companyName}
          firstName={firstName}
          config={config}
          delay={200}
        />

        {/* 2. STATS — fast context */}
        <StatRow
          highRisk={highRiskCount}
          critical={criticalMoments}
          moments={totalMoments}
          delay={500}
        />

        {/* 3. JOURNEY DANGER MAP — where the risk lives */}
        <JourneyDangerMap
          stages={journey.stages}
          templateId={templateId}
          delay={700}
        />

        {/* 4. INSIGHTS — grouped by priority */}
        {insights.length > 0 && (
          <div>
            <FadeIn delay={900}>
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-slate-900">
                  {config.insightsHeading(hasExistingCustomers)}
                </h2>
                <p className="text-sm text-slate-500 mt-1.5">
                  Click any issue to see what to do, ordered by urgency
                </p>
              </div>
            </FadeIn>

            {/* HIGH risk group */}
            {insights.filter((i) => i.likelihood === "high").length > 0 && (
              <FadeIn delay={1000} className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                  <p className="text-xs font-bold uppercase tracking-widest text-rose-600">
                    Fix these first
                  </p>
                  <span className="text-xs text-slate-400">
                    (
                    {
                      insights.filter((i) => i.likelihood === "high")
                        .length
                    }
                    )
                  </span>
                </div>
                <div className="space-y-2">
                  {insights
                    .filter((i) => i.likelihood === "high")
                    .map((insight, i) => (
                      <InsightCard
                        key={i}
                        insight={insight}
                        index={i}
                        locked={!canSeeDetails}
                        annotations={
                          evidenceMap
                            ? getInsightAnnotations(
                                insight.pattern,
                                evidenceMap
                              )
                            : undefined
                        }
                      />
                    ))}
                </div>
              </FadeIn>
            )}

            {/* MEDIUM risk group */}
            {insights.filter((i) => i.likelihood === "medium").length >
              0 && (
              <FadeIn delay={1400} className="mb-5">
                <div className="flex items-center gap-2 mb-3 mt-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
                    Also important
                  </p>
                  <span className="text-xs text-slate-400">
                    (
                    {
                      insights.filter((i) => i.likelihood === "medium")
                        .length
                    }
                    )
                  </span>
                </div>
                <div className="space-y-2">
                  {insights
                    .filter((i) => i.likelihood === "medium")
                    .map((insight, i) => (
                      <InsightCard
                        key={i}
                        insight={insight}
                        index={
                          i +
                          insights.filter(
                            (x) => x.likelihood === "high"
                          ).length
                        }
                        annotations={
                          evidenceMap
                            ? getInsightAnnotations(
                                insight.pattern,
                                evidenceMap
                              )
                            : undefined
                        }
                      />
                    ))}
                </div>
              </FadeIn>
            )}

            {/* LOW risk group */}
            {insights.filter((i) => i.likelihood === "low").length > 0 && (
              <FadeIn delay={1600} className="mb-5">
                <div className="flex items-center gap-2 mb-3 mt-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0" />
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    On the radar
                  </p>
                  <span className="text-xs text-slate-400">
                    (
                    {
                      insights.filter((i) => i.likelihood === "low")
                        .length
                    }
                    )
                  </span>
                </div>
                <div className="space-y-2">
                  {insights
                    .filter((i) => i.likelihood === "low")
                    .map((insight, i) => (
                      <InsightCard
                        key={i}
                        insight={insight}
                        index={
                          i +
                          insights.filter(
                            (x) => x.likelihood !== "low"
                          ).length
                        }
                        annotations={
                          evidenceMap
                            ? getInsightAnnotations(
                                insight.pattern,
                                evidenceMap
                              )
                            : undefined
                        }
                      />
                    ))}
                </div>
              </FadeIn>
            )}
          </div>
        )}

        {/* 5. IMPACT BREAKDOWN — gated */}
        {projections.length > 0 && (
          <UpgradeGate
            hasAccess={canSeeDetails}
            feature="report_details"
            hiddenCount={`${projections.length} risk areas analyzed`}
          >
            <ImpactBreakdown projections={projections} delay={1800} />
          </UpgradeGate>
        )}

        {/* 6. ASSUMPTIONS — gated */}
        {canSeeDetails &&
          (journey.assumptions?.length ||
            projections.some((p) => p.calculation)) && (
            <AssumptionsSection
              assumptions={journey.assumptions || []}
              projections={projections}
              delay={2000}
            />
          )}

        {/* 7. QUICK WINS — bridge to playbook */}
        <QuickWinsPreview stages={journey.stages} delay={2100} />

        {/* 8. EVIDENCE WALL — gated */}
        {evidenceMap && canSeeEvidence && (
          <FadeIn delay={2200}>
            <EvidenceWall
              evidenceMap={evidenceMap}
              companyName={companyName}
              biggestChallenge={onboardingData?.biggestChallenge}
            />
          </FadeIn>
        )}
        {evidenceMap && !canSeeEvidence && (
          <FadeIn delay={2200}>
            <LockedSection
              feature="evidence_wall"
              message="Your Evidence Wall maps every pain point back to your journey. See exactly which moments address your biggest challenges."
            />
          </FadeIn>
        )}

        {/* 9. TECH STACK RECOMMENDATIONS */}
        {journey.techStackRecommendations &&
          journey.techStackRecommendations.length > 0 && (
            <FadeIn delay={2300}>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">
                  Tools to consider
                </h2>
                <p className="text-sm text-slate-400 mb-5">
                  Recommended based on your current stage and gaps
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {journey.techStackRecommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="rounded-xl border bg-white p-4 space-y-2"
                    >
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                        {rec.categoryLabel}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {rec.tools.map((tool, j) => (
                          <span
                            key={j}
                            className="text-xs font-medium bg-primary/8 text-primary px-2 py-0.5 rounded-md"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {rec.whyNow}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          )}

        {/* 10. METHODOLOGY — how we built this */}
        <MethodologyNote note={journey.methodologyNote} delay={2400} />

        {/* 11. CTA */}
        <FadeIn delay={2500}>
          <div className="border-t pt-10 flex flex-col sm:flex-row items-center gap-3">
            <Link href={`/journey?id=${templateId}`}>
              <Button size="lg" className="w-full sm:w-auto">
                See Your Full Journey Map
              </Button>
            </Link>
            {canAccess("playbook") ? (
              <Link href="/playbook">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Get Your Playbook
                </Button>
              </Link>
            ) : (
              <Link href="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-primary/5 border-primary/20 text-primary hover:bg-primary/10"
                >
                  Get My Full Analysis &mdash; $149
                </Button>
              </Link>
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function AnalysisPage() {
  return (
    <Suspense fallback={<PageLoading label="Loading..." />}>
      <CxBriefContent />
    </Suspense>
  );
}
