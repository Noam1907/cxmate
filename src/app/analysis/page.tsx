"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/ui/page-loading";
import { SaveResultsBanner } from "@/components/ui/save-results-banner";
import { ExportPdfButton } from "@/components/ui/export-pdf-button";
import { PrintCover } from "@/components/pdf/print-cover";
import { track } from "@/lib/analytics";
import type { GeneratedJourney, ConfrontationInsight } from "@/lib/ai/journey-prompt";
import { AlertCircle, TrendingDown, ArrowRight, Info } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

type RiskItem = {
  title: string;
  description: string;
  impact: string;
  likelihood: "High" | "Medium" | "Low";
  businessImpact: number;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function parseDollarValue(impact: string): number {
  const match = impact.match(/\$[\d,.]+\s*[KkMmBb]?/);
  if (!match) return 0;
  let raw = match[0].replace(/[$,]/g, "");
  let multiplier = 1;
  if (/[Kk]$/.test(raw)) { multiplier = 1000; raw = raw.replace(/[Kk]$/, ""); }
  else if (/[Mm]$/.test(raw)) { multiplier = 1_000_000; raw = raw.replace(/[Mm]$/, ""); }
  else if (/[Bb]$/.test(raw)) { multiplier = 1_000_000_000; raw = raw.replace(/[Bb]$/, ""); }
  const num = parseFloat(raw);
  return isNaN(num) ? 0 : num * multiplier;
}

function formatDollarCompact(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${Math.round(value)}`;
}

function getTopRisks(insights: ConfrontationInsight[], limit: number = 3): RiskItem[] {
  return insights
    .map((insight) => {
      // Try businessImpact first, fall back to extracting from pattern title
      let dollarValue = parseDollarValue(insight.businessImpact || "");
      if (dollarValue === 0 && insight.pattern) {
        dollarValue = parseDollarValue(insight.pattern);
      }
      const displayImpact = dollarValue > 0
        ? formatDollarCompact(dollarValue)
        : (insight.businessImpact || "$0");
      return {
        title: insight.pattern || "Unknown risk",
        description: insight.description || "",
        impact: displayImpact,
        likelihood: insight.likelihood as "High" | "Medium" | "Low",
        businessImpact: dollarValue,
      };
    })
    .sort((a, b) => {
      const lw = (r: RiskItem) => r.likelihood === "High" ? 1 : r.likelihood === "Medium" ? 0.6 : 0.3;
      return (b.businessImpact * lw(b)) - (a.businessImpact * lw(a));
    })
    .slice(0, limit);
}

function getTotalRevenueAtRisk(insights: ConfrontationInsight[]): number {
  return insights.reduce((sum, i) => {
    let val = parseDollarValue(i.businessImpact || "");
    if (val === 0 && i.pattern) val = parseDollarValue(i.pattern);
    return sum + val;
  }, 0);
}

// ─── Mini Journey Preview ───────────────────────────────────────────────────

function MiniJourneyPreview({ stages }: { stages: GeneratedJourney["stages"] }) {
  return (
    <div className="flex items-start gap-0 overflow-x-auto pb-2">
      {stages.map((stage, idx) => (
        <div key={idx} className="flex items-start shrink-0">
          {/* Stage node */}
          <div className="flex flex-col items-center gap-1.5 w-[90px]">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0 ${
                stage.stageType === "sales"
                  ? "bg-sky-500"
                  : "bg-teal-500"
              }`}
            >
              {idx + 1}
            </div>
            <p className="text-[10px] text-slate-600 text-center leading-tight w-full">
              {stage.name}
            </p>
          </div>
          {/* Connector */}
          {idx < stages.length - 1 && (
            <div className="w-6 h-px bg-slate-300 shrink-0 mt-[18px] -ml-[5px] -mr-[5px]" />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Analysis Content ────────────────────────────────────────────────────────

function AnalysisContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("id");
  const [journey, setJourney] = useState<GeneratedJourney | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [topRisks, setTopRisks] = useState<RiskItem[]>([]);
  const [totalAtRisk, setTotalAtRisk] = useState(0);
  const [onboardingMeta, setOnboardingMeta] = useState<{
    industry?: string; vertical?: string; competitors?: string;
    painPoints?: string[]; currentChallenges?: string[];
  }>({});

  useEffect(() => {
    async function load() {
      let j: GeneratedJourney | null = null;
      let company = "";
      let user = "";
      let tid = templateId || "preview";
      let meta: typeof onboardingMeta = {};
      const isPreview = templateId === "preview";

      // Helper: load from sessionStorage
      function loadFromSession(): boolean {
        const stored = sessionStorage.getItem("cx-mate-journey");
        if (!stored) return false;
        try {
          const data = JSON.parse(stored);
          if (data.journey && Array.isArray(data.journey.stages)) {
            j = data.journey as GeneratedJourney;
            company = data.onboardingData?.companyName || "";
            user = data.onboardingData?.contactName?.split(" ")[0] ||
                   data.onboardingData?.userName?.split(" ")[0] || "";
            tid = data.templateId || tid;
            const od = data.onboardingData || {};
            meta = {
              industry: od.industry || od.vertical,
              vertical: od.vertical || od.industry,
              competitors: od.competitors,
              painPoints: od.painPoints,
              currentChallenges: od.currentChallenges,
            };
            return true;
          }
        } catch (err) {
          console.error("Failed to load journey:", err);
        }
        return false;
      }

      // Preview mode: prefer sessionStorage (local demo data)
      if (isPreview) {
        loadFromSession();
      }

      // Authenticated mode: try Supabase first, fall back to session
      if (!j) {
        try {
          const res = await fetch("/api/journey/default");
          if (res.ok) {
            const json = await res.json();
            if (json.success && json.journey && Array.isArray(json.journey.stages)) {
              j = json.journey;
              company = json.onboardingData?.companyName || "";
              user = json.onboardingData?.userName?.split(" ")[0] || "";
              tid = json.templateId || tid;
              const od = json.onboardingData || {};
              meta = {
                industry: od.industry || od.vertical,
                vertical: od.vertical || od.industry,
                competitors: od.competitors,
                painPoints: od.painPoints,
                currentChallenges: od.currentChallenges,
              };
            }
          }
        } catch { /* not authenticated or API error — fall through */ }
      }

      // Final fallback: sessionStorage (for non-preview anonymous users)
      if (!j) {
        loadFromSession();
      }

      if (j) {
        setJourney(j);
        setCompanyName(company);
        setFirstName(user);
        setOnboardingMeta(meta);
        const insights = j.confrontationInsights || [];
        setTopRisks(getTopRisks(insights));
        setTotalAtRisk(getTotalRevenueAtRisk(insights));
        track("analysis_viewed", { template_id: tid, stage_count: j.stages.length });
      }
      setLoading(false);
    }
    load();
  }, [templateId]);

  if (loading) {
    return <PageLoading label="Preparing your analysis..." />;
  }

  if (!journey) {
    return (
      <div className="max-w-2xl mx-auto px-6 pt-8 pb-24">
        <div className="mb-12">
          <p className="text-xs font-semibold text-primary/70 uppercase tracking-widest mb-3">CX Intelligence</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 leading-tight mb-4">
            Your customers have a journey.<br />
            <span className="text-slate-500">You just haven&apos;t mapped it yet.</span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed max-w-lg">
            One conversation about your business. In return: your full customer lifecycle mapped, the risks quantified, and a playbook for what to fix first.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-10">
          <div className="rounded-2xl border-2 p-5 shadow-lg" style={{ backgroundColor: "#E0F7F4", borderColor: "#0D9488" }}>
            <p className="text-sm font-bold text-slate-800 mb-1">Journey Map</p>
            <p className="text-xs text-slate-600 leading-relaxed">Your full lifecycle, stage by stage</p>
            <div className="mt-3 pt-2 border-t text-xs font-semibold" style={{ borderColor: "#0D9488", color: "#134E4A" }}>50+ meaningful moments</div>
          </div>
          <div className="rounded-2xl border-2 p-5 shadow-lg" style={{ backgroundColor: "#FFF1F2", borderColor: "#F43F5E" }}>
            <p className="text-sm font-bold text-slate-800 mb-1">CX Report</p>
            <p className="text-xs text-slate-600 leading-relaxed">Revenue at risk and failure patterns</p>
            <div className="mt-3 pt-2 border-t border-rose-200 text-xs font-semibold text-rose-700">Quantified revenue impact</div>
          </div>
          <div className="rounded-2xl border-2 p-5 shadow-lg" style={{ backgroundColor: "#DCFCE7", borderColor: "#16A34A" }}>
            <p className="text-sm font-bold text-slate-800 mb-1">CX Playbook</p>
            <p className="text-xs text-slate-600 leading-relaxed">AI-built action plan for your stack</p>
            <div className="mt-3 pt-2 border-t border-green-200 text-xs font-semibold text-green-800">Week 1 quick wins ready</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/onboarding">
            <Button size="lg" className="font-semibold px-8">Find where I&apos;m losing them →</Button>
          </Link>
          <p className="text-xs text-slate-400">Results in minutes, not months</p>
        </div>
      </div>
    );
  }

  const totalMoments = journey.stages.reduce(
    (s, st) => s + (Array.isArray(st?.meaningfulMoments) ? st.meaningfulMoments.length : 0),
    0,
  );

  return (
    <div className="w-full space-y-10">
      {/* PDF cover */}
      <PrintCover
        firstName={firstName || undefined}
        companyName={companyName || undefined}
        documentType="CX Intelligence Report"
      />

      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
            CX Intelligence
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            {firstName
              ? `${firstName}, your customer journey has gaps`
              : "Your customer journey has gaps"}
          </h1>
          <p className="text-sm text-slate-500 mt-2 max-w-lg">
            We mapped {companyName ? `${companyName}'s` : "your"} full customer lifecycle and surfaced the friction points, revenue risks, and missed moments your team should know about.
          </p>
        </div>
        <ExportPdfButton page="analysis" title={`${companyName || "CX Mate"} - CX Analysis`} />
      </div>

      {/* Save banner */}
      <SaveResultsBanner isPreview={templateId === "preview" || !templateId} companyName={companyName} />

      {/* Summary stats — not a score, just facts */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
          <p className="text-3xl font-bold text-slate-900">{journey.stages.length}</p>
          <p className="text-xs text-slate-500 mt-1">Lifecycle stages mapped</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
          <p className="text-3xl font-bold text-slate-900">{totalMoments}</p>
          <p className="text-xs text-slate-500 mt-1">Meaningful moments identified</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center group relative">
          <p className="text-3xl font-bold text-rose-600">
            {formatDollarCompact(Math.round(totalAtRisk * 0.6))}–{formatDollarCompact(totalAtRisk)}
          </p>
          <p className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-1">
            Estimated revenue at risk
            <span className="relative inline-flex">
              <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-lg bg-slate-800 text-white text-[11px] leading-relaxed shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
                Combined impact of {topRisks.length} risk patterns identified in your journey. Each risk is estimated from your business data (revenue, deal size, churn rates) and industry benchmarks. Range accounts for overlap between patterns.
              </span>
            </span>
          </p>
        </div>
      </div>

      {/* Mini Journey Preview */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Your customer lifecycle</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {journey.stages.filter(s => s.stageType === "sales").length} pre-sale + {journey.stages.filter(s => s.stageType === "customer").length} post-sale stages
            </p>
          </div>
          <Link href={`/journey?id=${templateId}`}>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              Full journey map <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
        <MiniJourneyPreview stages={journey.stages} />
      </div>

      {/* Early Signals Section */}
      <div className="space-y-5">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Confrontation Insights
          </p>
          <h2 className="text-2xl font-bold text-slate-900">
            Where you&apos;re most likely losing them
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            These patterns showed up in your journey, ranked by revenue impact and likelihood. The CX Report has the full picture.
          </p>
        </div>

        <div className="space-y-3">
          {topRisks.map((risk, idx) => (
            <div key={idx} className="rounded-lg border border-slate-200 bg-white p-5 hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  {risk.likelihood === "High" ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-amber-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">{risk.title}</h3>
                  <p className="text-sm text-slate-600 mb-3">{risk.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                      {risk.likelihood} likelihood
                    </span>
                    <span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-700">
                      {formatDollarCompact(risk.businessImpact)} at risk
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What powers this analysis */}
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
          What powers this analysis
        </h3>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
          {onboardingMeta.industry && (
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px]">🏢</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700">Vertical intelligence</p>
                <p className="text-[11px] text-slate-500">{onboardingMeta.industry} B2B patterns, benchmarks, and lifecycle models</p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[10px]">🧠</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">CX methodology</p>
              <p className="text-[11px] text-slate-500">CCXP frameworks, journey science, and B2B lifecycle research</p>
            </div>
          </div>
          {onboardingMeta.competitors && (
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px]">⚡</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700">Competitive landscape</p>
                <p className="text-[11px] text-slate-500">Signals from {onboardingMeta.competitors}</p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[10px]">📊</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Your business context</p>
              <p className="text-[11px] text-slate-500">
                {(onboardingMeta.painPoints || onboardingMeta.currentChallenges)
                  ? `Pain points, challenges, and goals you shared with us`
                  : `Company profile, sales cycle, and growth stage`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Deep-dive cards — borrowed from dashboard 3-card pattern */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Your three deliverables
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">

          {/* Journey Map — teal */}
          <Link href={`/journey?id=${templateId}`}>
            <div className="rounded-2xl border-2 p-5 h-full hover:shadow-lg transition-shadow cursor-pointer" style={{ backgroundColor: "#E0F7F4", borderColor: "#0D9488" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#99F6E4" }}>
                  <svg viewBox="0 0 20 20" width="14" height="14" fill="none">
                    <circle cx="3" cy="16" r="2" fill="#0D9488" />
                    <circle cx="10" cy="10" r="2" fill="#0D9488" />
                    <circle cx="17" cy="4"  r="2" fill="#0D9488" />
                    <path d="M3 16 C5.5 13.5 7.5 11.5 10 10 C12.5 8.5 14.5 6 17 4" stroke="#0D9488" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ backgroundColor: "#99F6E4", color: "#134E4A" }}>Journey</span>
              </div>
              <p className="text-sm font-bold text-slate-800 mb-1">Journey Map</p>
              <p className="text-xs text-slate-600 leading-relaxed">Every stage, touchpoint, and meaningful moment. Visualized and interactive.</p>
              <div className="mt-3 pt-2 border-t text-xs font-semibold" style={{ borderColor: "#0D9488", color: "#134E4A" }}>{totalMoments} moments mapped</div>
            </div>
          </Link>

          {/* CX Report — rose */}
          <Link href={`/confrontation?id=${templateId}`}>
            <div className="rounded-2xl border-2 p-5 h-full hover:shadow-lg transition-shadow cursor-pointer" style={{ backgroundColor: "#FFF1F2", borderColor: "#F43F5E" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center">
                  <svg viewBox="0 0 20 20" width="14" height="14" fill="none">
                    <rect x="3" y="10" width="3" height="8" rx="1.5" fill="#F43F5E" />
                    <rect x="8.5" y="6" width="3" height="12" rx="1.5" fill="#F43F5E" />
                    <rect x="14" y="2" width="3" height="16" rx="1.5" fill="#F43F5E" opacity="0.4" />
                    <path d="M4 7 L9.5 4 L15 6" stroke="#F43F5E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ backgroundColor: "#FECDD3", color: "#881337" }}>Intelligence</span>
              </div>
              <p className="text-sm font-bold text-slate-800 mb-1">CX Report</p>
              <p className="text-xs text-slate-600 leading-relaxed">Revenue at risk, failure patterns, and the signals most likely to impact growth</p>
              <div className="mt-3 pt-2 border-t border-rose-200 text-xs font-semibold text-rose-700">{formatDollarCompact(Math.round(totalAtRisk * 0.6))}–{formatDollarCompact(totalAtRisk)} quantified</div>
            </div>
          </Link>

          {/* Playbook — green */}
          <Link href="/playbook">
            <div className="rounded-2xl border-2 p-5 h-full hover:shadow-lg transition-shadow cursor-pointer" style={{ backgroundColor: "#DCFCE7", borderColor: "#16A34A" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
                  <svg viewBox="0 0 20 20" width="14" height="14" fill="none">
                    <rect x="3" y="2" width="14" height="16" rx="2" stroke="#16A34A" strokeWidth="1.6" />
                    <path d="M7 7h6M7 10h6M7 13h4" stroke="#16A34A" strokeWidth="1.4" strokeLinecap="round" />
                    <circle cx="15" cy="15" r="3.5" fill="#16A34A" />
                    <path d="M13.5 15l1 1 2-1.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ backgroundColor: "#BBF7D0", color: "#14532D" }}>Action Plan</span>
              </div>
              <p className="text-sm font-bold text-slate-800 mb-1">CX Playbook</p>
              <p className="text-xs text-slate-600 leading-relaxed">AI-built action plan with priorities, timelines, and week-1 quick wins</p>
              <div className="mt-3 pt-2 border-t border-green-200 text-xs font-semibold text-green-800">Ready to execute</div>
            </div>
          </Link>

        </div>
      </div>

      {/* Sign-up CTA */}
      <div className="rounded-2xl border-2 border-teal-600 bg-gradient-to-br from-teal-50 to-cyan-50 p-10 text-center space-y-4">
        <h3 className="text-2xl font-bold text-slate-900">
          This is your starting point, not a one-time report
        </h3>
        <p className="text-slate-600 max-w-md mx-auto">
          Save your analysis, revisit quarterly, and track how your customer experience evolves as you grow.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/auth?redirect=/analysis">
            <Button size="lg" className="gap-2" style={{ backgroundColor: "#0D9488", color: "white" }}>
              Keep My Analysis <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/auth?redirect=/analysis">
            <Button size="lg" variant="outline">
              Log in
            </Button>
          </Link>
        </div>
        <p className="text-xs text-slate-500 mt-4">
          Takes 30 seconds. Your results are waiting.
        </p>
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function AnalysisPage() {
  return (
    <main className="min-h-screen py-12 px-4">
      <Suspense fallback={<PageLoading label="Loading..." />}>
        <AnalysisContent />
      </Suspense>
    </main>
  );
}
