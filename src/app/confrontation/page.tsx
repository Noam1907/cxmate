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
import { buildEvidenceMap, type EvidenceMap } from "@/lib/evidence-matching";
import { EvidenceWall } from "@/components/evidence/evidence-wall";
import { track } from "@/lib/analytics";

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
    maturityHeading: (hasCustomers: boolean) => string;
  }
> = {
  early_stage: {
    label: "Foundation Analysis",
    headline: (company) => `${company}, let\u2019s build this right.`,
    subtitle: "We analyzed your setup against what works for companies at your stage. Here\u2019s where the biggest opportunities are.",
    insightsHeading: (hasCustomers) =>
      hasCustomers ? "What typically trips up companies at your stage" : "What to get right from day one",
    maturityHeading: (hasCustomers) =>
      hasCustomers ? "Your CX maturity snapshot" : "Your starting position",
  },
  growing: {
    label: "Growth Intelligence",
    headline: (company) => `${company}, growth changes everything.`,
    subtitle: "We analyzed your business against CX patterns from companies scaling past your stage.",
    insightsHeading: () => "What typically trips up companies at your stage",
    maturityHeading: () => "Your CX maturity snapshot",
  },
  established: {
    label: "Optimization Report",
    headline: (company) => `${company}, time to compound.`,
    subtitle: "At your scale, small CX improvements compound into major revenue impact.",
    insightsHeading: () => "Optimization opportunities",
    maturityHeading: () => "Your CX maturity snapshot",
  },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function parseDollarValue(impact: string): number | null {
  const match = impact.match(/\$[\d,.]+\s*[KkMmBb]?/);
  if (!match) return null;
  let raw = match[0].replace(/[$,]/g, "");
  let multiplier = 1;
  if (/[Kk]$/.test(raw)) { multiplier = 1000; raw = raw.replace(/[Kk]$/, ""); }
  else if (/[Mm]$/.test(raw)) { multiplier = 1_000_000; raw = raw.replace(/[Mm]$/, ""); }
  else if (/[Bb]$/.test(raw)) { multiplier = 1_000_000_000; raw = raw.replace(/[Bb]$/, ""); }
  const num = parseFloat(raw);
  return isNaN(num) ? null : num * multiplier;
}

function formatDollarCompact(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${Math.round(value)}`;
}

// ─── Fade-in ────────────────────────────────────────────────────────────────

function FadeIn({ children, delay, className = "" }: { children: React.ReactNode; delay: number; className?: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"} ${className}`}>
      {children}
    </div>
  );
}

// ─── Hero Card ───────────────────────────────────────────────────────────────

function HeroImpactCard({ projections, delay }: { projections: ImpactProjection[]; delay: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const values = projections
    .map((p) => parseDollarValue(p.potentialImpact))
    .filter((v): v is number => v !== null);
  const total = values.reduce((s, v) => s + v, 0);
  if (values.length === 0) return null;

  const lo = formatDollarCompact(Math.round(total * 0.7));
  const hi = formatDollarCompact(Math.round(total * 1.3));

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Revenue at risk — annually</p>
      <div className="text-5xl font-bold tracking-tight text-slate-900">{lo} – {hi}</div>
      <p className="text-sm text-slate-400 mt-2 leading-relaxed max-w-md">
        Estimated value leaving through CX gaps — based on your deal size, customer count, and industry benchmarks for companies at your stage.
      </p>
    </div>
  );
}

// ─── Stat Row ────────────────────────────────────────────────────────────────

function StatRow({ highRisk, critical, moments, delay }: { highRisk: number; critical: number; moments: number; delay: number }) {
  return (
    <FadeIn delay={delay} className="grid grid-cols-3 divide-x border rounded-xl overflow-hidden bg-white">
      {[
        { label: "High-risk patterns", value: highRisk },
        { label: "Critical moments", value: critical },
        { label: "Moments mapped", value: moments },
      ].map(({ label, value }) => (
        <div key={label} className="p-5">
          <div className="text-3xl font-bold tracking-tight">{value}</div>
          <div className="text-xs text-slate-500 mt-1">{label}</div>
        </div>
      ))}
    </FadeIn>
  );
}

// ─── Impact Breakdown ────────────────────────────────────────────────────────

function ImpactBreakdown({ projections, delay }: { projections: ImpactProjection[]; delay: number }) {
  const parsed = projections
    .map((p) => ({ ...p, value: parseDollarValue(p.potentialImpact) }))
    .filter((p): p is typeof p & { value: number } => p.value !== null)
    .sort((a, b) => b.value - a.value);

  if (!parsed.length) return null;
  const max = parsed[0].value;

  return (
    <FadeIn delay={delay}>
      <div className="rounded-xl border bg-white p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-slate-900">Where the risk is concentrated</h3>
          <p className="text-xs text-slate-400 mt-1">Each area is estimated from your deal size × churn rate × industry benchmarks</p>
        </div>
        <div className="space-y-5">
          {parsed.map((item, i) => {
            const pct = max > 0 ? (item.value / max) * 100 : 0;
            return (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-800">{item.area}</span>
                  <span className="text-sm font-semibold text-slate-900">{item.potentialImpact}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-slate-400 transition-all duration-1000 ease-out" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-slate-400">{item.timeToRealize}</span>
                  <span className="text-xs text-slate-400">{item.effort} effort · {item.dataSource === "user_provided" ? "your data" : "industry benchmark"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </FadeIn>
  );
}

// ─── Insight Row ─────────────────────────────────────────────────────────────

function InsightRow({ insight, index }: { insight: ConfrontationInsight; index: number }) {
  const [expanded, setExpanded] = useState(false);

  const riskConfig = {
    high:   { dot: "bg-rose-400",   label: "High",   labelColor: "text-rose-500"  },
    medium: { dot: "bg-amber-400",  label: "Medium", labelColor: "text-amber-500" },
    low:    { dot: "bg-slate-300",  label: "Low",    labelColor: "text-slate-400" },
  }[insight.likelihood] ?? { dot: "bg-slate-300", label: "", labelColor: "text-slate-400" };

  return (
    <FadeIn delay={1900 + index * 250}>
      <div
        className="rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-slate-300 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Collapsed — title only */}
        <div className="flex items-center gap-3 px-5 py-4">
          <div className={`w-2 h-2 rounded-full shrink-0 ${riskConfig.dot}`} />
          <span className="text-sm font-semibold text-slate-900 flex-1 leading-snug">{insight.pattern}</span>
          <span className={`text-xs font-medium shrink-0 ${riskConfig.labelColor}`}>{riskConfig.label}</span>
          <span className="text-slate-300 text-sm shrink-0 ml-1">{expanded ? "−" : "+"}</span>
        </div>

        {/* Expanded */}
        {expanded && (
          <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">

            {/* Description */}
            <p className="text-sm text-slate-500 leading-relaxed">{insight.description}</p>

            {/* Key details — 2-col grid, compact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {insight.businessImpact && (
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Impact</p>
                  <p className="text-sm text-slate-700">{insight.businessImpact}</p>
                </div>
              )}
              {insight.immediateAction && (
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Do this now</p>
                  <p className="text-sm text-slate-700">{insight.immediateAction}</p>
                </div>
              )}
            </div>

            {/* Measure — inline, less prominent */}
            {insight.measureWith && (
              <p className="text-xs text-slate-400">
                <span className="font-medium text-slate-500">Measure: </span>
                {insight.measureWith}
              </p>
            )}

            {/* CX Mate advice — pull-quote style */}
            {insight.companionAdvice && (
              <div className="border-l-2 border-slate-200 pl-3">
                <p className="text-sm text-slate-500 italic">&ldquo;{insight.companionAdvice}&rdquo;</p>
              </div>
            )}
          </div>
        )}
      </div>
    </FadeIn>
  );
}

// ─── Assumptions ─────────────────────────────────────────────────────────────

function AssumptionsSection({ assumptions, projections, delay }: { assumptions: string[]; projections: ImpactProjection[]; delay: number }) {
  const [open, setOpen] = useState(false);
  if (!assumptions.length && !projections.some((p) => p.calculation)) return null;

  return (
    <FadeIn delay={delay}>
      <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between text-left"
        >
          <span className="text-xs font-medium text-slate-500">How we calculated these numbers</span>
          <span className="text-xs text-slate-400">{open ? "Hide ↑" : "Show ↓"}</span>
        </button>
        {open && (
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
            {projections.filter((p) => p.calculation).map((p, i) => (
              <div key={i}>
                <p className="text-xs font-medium text-slate-600 mb-0.5">{p.area}</p>
                <p className="text-xs text-slate-400 font-mono">{p.calculation}</p>
              </div>
            ))}
            {assumptions.map((a, i) => (
              <p key={i} className="text-xs text-slate-400 flex gap-2">
                <span className="shrink-0">·</span>
                <span>{a}</span>
              </p>
            ))}
            <p className="text-xs text-slate-400 italic pt-2 border-t border-slate-200">These are directional estimates — not guarantees. They exist to help you prioritize.</p>
          </div>
        )}
      </div>
    </FadeIn>
  );
}

// ─── Main Content ─────────────────────────────────────────────────────────────

function ConfrontationContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("id");
  const [journey, setJourney] = useState<GeneratedJourney | null>(null);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData> | null>(null);
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
            setCompanyName(data.onboardingData?.companyName || "your company");
            setMode(detectMode(data.onboardingData?.companyMaturity));
            setHasExistingCustomers(data.onboardingData?.hasExistingCustomers || false);
          } catch { /* ignore */ }
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
              setCompanyName(parsed.onboardingData?.companyName || "your company");
              setMode(detectMode(parsed.onboardingData?.companySize || ""));
              setHasExistingCustomers(parsed.onboardingData?.hasExistingCustomers || false);
            }
          }
        } catch (err) { console.error("Failed to load journey:", err); }
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
      const t = setTimeout(() => setHeaderVisible(true), 200);
      track("cx_report_viewed", {
        template_id: templateId ?? undefined,
        company_name: companyName || undefined,
        mode,
      });
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, journey]);

  const insights = useMemo(() => journey?.confrontationInsights || [], [journey]);
  const projections = useMemo(() => journey?.impactProjections || [], [journey]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Loading your report...</p>
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">No analysis available</h1>
          <p className="text-slate-500">Complete onboarding to get your CX intelligence report.</p>
          <Link href="/onboarding"><Button>Start Onboarding</Button></Link>
        </div>
      </div>
    );
  }

  const highRiskCount = insights.filter((i) => i.likelihood === "high").length;
  const totalMoments = journey.stages.reduce((s, st) => s + st.meaningfulMoments.length, 0);
  const criticalMoments = journey.stages.reduce((s, st) => s + st.meaningfulMoments.filter((m) => m.severity === "critical").length, 0);
  const config = MODE_CONFIG[mode];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-16">

        {/* Header */}
        <div className={`mb-12 transition-all duration-700 ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">{config.label}</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-3">{config.headline(companyName)}</h1>
          <p className="text-base text-slate-500 leading-relaxed">{config.subtitle}</p>
        </div>

        {/* Impact hero */}
        {projections.length > 0 && (
          <div className="mb-4">
            <HeroImpactCard projections={projections} delay={400} />
          </div>
        )}

        {/* Stats */}
        <div className="mb-8">
          <StatRow highRisk={highRiskCount} critical={criticalMoments} moments={totalMoments} delay={700} />
        </div>

        {/* Impact breakdown */}
        {projections.length > 0 && (
          <div className="mb-8">
            <ImpactBreakdown projections={projections} delay={1000} />
          </div>
        )}

        {/* Assumptions */}
        {(journey.assumptions?.length || projections.some((p) => p.calculation)) && (
          <div className="mb-12">
            <AssumptionsSection assumptions={journey.assumptions || []} projections={projections} delay={1300} />
          </div>
        )}

        {/* Evidence */}
        {evidenceMap && (
          <FadeIn delay={1500} className="mb-12">
            <EvidenceWall evidenceMap={evidenceMap} companyName={companyName} biggestChallenge={onboardingData?.biggestChallenge} />
          </FadeIn>
        )}

        {/* Maturity */}
        {journey.maturityAssessment && (
          <FadeIn delay={1700} className="mb-12">
            <div className="rounded-xl border bg-white p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">{config.maturityHeading(hasExistingCustomers)}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{journey.maturityAssessment}</p>
            </div>
          </FadeIn>
        )}

        {/* Insights */}
        {insights.length > 0 && (
          <div className="mb-12">
            <FadeIn delay={1700}>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-900">{config.insightsHeading(hasExistingCustomers)}</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Patterns we identified in your journey — click any to see the action plan
                  {highRiskCount > 0 && <span className="ml-2 text-amber-600 font-medium">· {highRiskCount} high priority</span>}
                </p>
              </div>
            </FadeIn>
            <div className="space-y-2">
              {insights.map((insight, i) => <InsightRow key={i} insight={insight} index={i} />)}
            </div>
          </div>
        )}

        {/* Tech Stack */}
        {journey.techStackRecommendations && journey.techStackRecommendations.length > 0 && (
          <div className="mb-12">
            <FadeIn delay={2200}>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Tools to consider</h2>
              <p className="text-sm text-slate-400 mb-5">Recommended based on your current stage and gaps</p>
            </FadeIn>
            <FadeIn delay={2400}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {journey.techStackRecommendations.map((rec, i) => (
                  <div key={i} className="rounded-xl border bg-white p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{rec.categoryLabel}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {rec.tools.map((tool, j) => (
                        <span key={j} className="text-xs font-medium bg-primary/8 text-primary px-2 py-0.5 rounded-md">{tool}</span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{rec.whyNow}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        )}

        {/* CTA */}
        <FadeIn delay={2000}>
          <div className="border-t pt-10 flex flex-col sm:flex-row items-center gap-3">
            <Link href={`/journey?id=${templateId}`}>
              <Button size="lg" className="w-full sm:w-auto">See Your Full Journey Map</Button>
            </Link>
            <Link href="/playbook">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">Get Your Playbook</Button>
            </Link>
          </div>
        </FadeIn>

      </div>
    </div>
  );
}

export default function ConfrontationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-slate-400">Loading...</p></div>}>
      <ConfrontationContent />
    </Suspense>
  );
}
