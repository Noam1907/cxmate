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

// ─── Confrontation Modes ────────────────────────────────────────────────────

type ConfrontationMode = "early_stage" | "growing" | "established";

function detectMode(companySize: string): ConfrontationMode {
  switch (companySize) {
    case "1-10":
    case "11-50":
      return "early_stage";
    case "51-150":
    case "151-300":
      return "growing";
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
    <div className={`rounded-2xl bg-slate-900 text-white p-8 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Estimated Annual CX Impact</p>
      <div className="text-5xl font-bold tracking-tight">{lo} – {hi}</div>
      <p className="text-sm text-slate-500 mt-1">per year · based on industry benchmarks</p>
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
        <h3 className="text-sm font-semibold text-slate-900 mb-5">Impact breakdown</h3>
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
                  <div className="h-full rounded-full bg-slate-800 transition-all duration-1000 ease-out" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-slate-400">{item.timeToRealize}</span>
                  <span className="text-xs text-slate-400">{item.effort} effort · {item.dataSource === "user_provided" ? "your data" : "benchmark"}</span>
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

  const riskDot = { high: "bg-slate-800", medium: "bg-slate-400", low: "bg-slate-300" }[insight.likelihood];

  return (
    <FadeIn delay={1200 + index * 150}>
      <div
        className="rounded-xl border bg-white p-5 cursor-pointer hover:border-slate-300 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${riskDot}`} />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">{insight.pattern}</span>
                <span className="text-xs text-slate-400 capitalize">{insight.likelihood} risk</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">{insight.description}</p>
            </div>
          </div>
          <span className="text-slate-400 text-sm shrink-0">{expanded ? "−" : "+"}</span>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t space-y-3 ml-5">
            {insight.companionAdvice && (
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                <p className="text-xs font-semibold text-slate-500 mb-1">CX Mate says</p>
                <p className="text-sm text-slate-700 italic">&ldquo;{insight.companionAdvice}&rdquo;</p>
              </div>
            )}
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
              <p className="text-xs font-semibold text-slate-500 mb-1">Business impact</p>
              <p className="text-sm text-slate-700">{insight.businessImpact}</p>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
              <p className="text-xs font-semibold text-slate-500 mb-1">Do this now</p>
              <p className="text-sm text-slate-700">{insight.immediateAction}</p>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
              <p className="text-xs font-semibold text-slate-500 mb-1">Measure with</p>
              <p className="text-sm text-slate-700">{insight.measureWith}</p>
            </div>
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
      <div className="rounded-xl border bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-800">How we calculated this</p>
            <p className="text-xs text-slate-400 mt-0.5">Review data sources and assumptions</p>
          </div>
          <button
            onClick={() => setOpen(!open)}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {open ? "Hide" : "Show assumptions"}
          </button>
        </div>
        {open && (
          <div className="mt-4 pt-4 border-t space-y-4">
            {projections.filter((p) => p.calculation).map((p, i) => (
              <div key={i} className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-medium text-slate-600 mb-1">{p.area}</p>
                <p className="text-xs text-slate-500 font-mono">{p.calculation}</p>
              </div>
            ))}
            {assumptions.map((a, i) => (
              <p key={i} className="text-xs text-slate-500 flex gap-2">
                <span className="text-slate-300 shrink-0">·</span>
                <span>{a}</span>
              </p>
            ))}
            <p className="text-xs text-slate-400 italic pt-2 border-t">Projections are directional estimates, not guarantees.</p>
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
            setMode(detectMode(data.onboardingData?.companySize || ""));
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
      return () => clearTimeout(t);
    }
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
            <HeroImpactCard projections={projections} delay={300} />
          </div>
        )}

        {/* Stats */}
        <div className="mb-8">
          <StatRow highRisk={highRiskCount} critical={criticalMoments} moments={totalMoments} delay={500} />
        </div>

        {/* Impact breakdown */}
        {projections.length > 0 && (
          <div className="mb-8">
            <ImpactBreakdown projections={projections} delay={700} />
          </div>
        )}

        {/* Assumptions */}
        {(journey.assumptions?.length || projections.some((p) => p.calculation)) && (
          <div className="mb-12">
            <AssumptionsSection assumptions={journey.assumptions || []} projections={projections} delay={900} />
          </div>
        )}

        {/* Evidence */}
        {evidenceMap && (
          <FadeIn delay={1000} className="mb-12">
            <EvidenceWall evidenceMap={evidenceMap} companyName={companyName} biggestChallenge={onboardingData?.biggestChallenge} />
          </FadeIn>
        )}

        {/* Maturity */}
        {journey.maturityAssessment && (
          <FadeIn delay={1100} className="mb-12">
            <div className="rounded-xl border bg-white p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">{config.maturityHeading(hasExistingCustomers)}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{journey.maturityAssessment}</p>
            </div>
          </FadeIn>
        )}

        {/* Insights */}
        {insights.length > 0 && (
          <div className="mb-12">
            <FadeIn delay={1100}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">{config.insightsHeading(hasExistingCustomers)}</h2>
                {highRiskCount > 0 && (
                  <span className="text-xs font-medium text-slate-500">{highRiskCount} high priority</span>
                )}
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
            <FadeIn delay={1600}>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Recommended tech stack</h2>
              <p className="text-sm text-slate-400 mb-5">Tools to connect for maximum CX impact at your stage</p>
            </FadeIn>
            <div className="space-y-2">
              {journey.techStackRecommendations.map((rec, i) => (
                <FadeIn key={i} delay={1700 + i * 80}>
                  <div className="rounded-xl border bg-white p-4">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{rec.categoryLabel}</span>
                      <div className="flex flex-wrap gap-1.5 justify-end">
                        {rec.tools.map((tool, j) => (
                          <span key={j} className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">{tool}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">{rec.whyNow}</p>
                    <p className="text-xs text-slate-400 mt-1">Connect with: {rec.connectWith}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
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
