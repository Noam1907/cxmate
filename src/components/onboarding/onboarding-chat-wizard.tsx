"use client";

/**
 * OnboardingChatWizard — Chat-skinned wizard for onboarding.
 *
 * Combines the wizard's structured data collection (typed fields, chips, validation)
 * with the chat's visual identity (AI bubbles, user answer bubbles, inline insights).
 *
 * Two-pass approach:
 *   Pass 1 (4 steps, ~2 min): Identity → Maturity → Challenge → Goal → Generate
 *   Pass 2 (optional, after output): Deep dive fields → Regenerate
 *
 * No AI extraction — every field is collected via structured UI widgets.
 * Enrichment pre-fills and shows a compact "here's what I found" card.
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Sparkle,
  Microphone,
  MicrophoneSlash,
  PencilSimple,
  CheckCircle,
  Buildings,
  Rocket,
  Plant,
  TrendUp,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/ui/logo-mark";
import { useCompanyEnrichment } from "@/hooks/use-company-enrichment";
import { useCompanyProfile } from "@/contexts/company-profile-context";
import {
  useOnboardingAutosave,
  loadOnboardingDraft,
  clearOnboardingDraft,
} from "@/hooks/use-onboarding-autosave";
import {
  deriveFromMaturity,
  getPainPointsForMaturity,
  getGoalsForPainAndMaturity,
  MATURITY_OPTIONS,
  TIMEFRAME_OPTIONS,
  GOAL_TIMEFRAME_MAP,
  type CompanyMaturity,
  type OnboardingData,
} from "@/types/onboarding";
import type { EnrichedCompanyData } from "@/types/enrichment";
import { getVerticalBenchmark, getSizeBenchmark } from "@/lib/cx-knowledge";
import { track, identify } from "@/lib/analytics";
import { notifyOwner } from "@/lib/notify";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type WizardStep = "identity" | "maturity" | "challenge" | "context" | "goal" | "generating";

type ConversationEntry =
  | { type: "ai"; content: string; key: string }
  | { type: "user-summary"; content: string; key: string }
  | { type: "insight"; content: string; key: string }
  | { type: "widget"; step: WizardStep; key: string }
  | { type: "enrichment-card"; key: string };

// ─────────────────────────────────────────────
// Default onboarding data
// ─────────────────────────────────────────────

const DEFAULT_DATA: OnboardingData = {
  userName: "",
  userEmail: "",
  userRole: "",
  companyName: "",
  companyWebsite: "",
  vertical: "",
  companySize: "",
  companyMaturity: "first_customers",
  hasExistingJourney: "",
  customerCount: "",
  customerDescription: "",
  customerSize: "",
  mainChannel: "",
  pricingModel: "",
  roughRevenue: "",
  averageDealSize: "",
  painPoints: [],
  biggestChallenge: "",
  primaryGoal: "",
  timeframe: "",
  competitors: "",
  currentTools: "",
  existingJourneyDescription: "",
  existingJourneyComponents: [],
  journeyType: "full_lifecycle",
  hasExistingCustomers: false,
  measuresNps: false,
  measuresCsat: false,
  measuresCes: false,
  npsResponseCount: "",
  hasJourneyMap: false,
  dataVsGut: "all_gut",
};

// ─────────────────────────────────────────────
// Maturity icon map
// ─────────────────────────────────────────────

const MATURITY_ICONS: Record<string, React.ElementType> = {
  Rocket,
  Seedling: Plant,
  TrendUp,
  Buildings,
};

// ─────────────────────────────────────────────
// Insight builders — triggered after specific steps
// ─────────────────────────────────────────────

function buildInsightForStep(
  step: WizardStep,
  data: OnboardingData,
  enrichment: EnrichedCompanyData | null
): string | null {
  switch (step) {
    case "maturity": {
      const vertical = data.vertical || enrichment?.suggestedVertical;
      if (!vertical || vertical === "other") {
        const stageLabel: Record<string, string> = {
          pre_launch: "pre-revenue",
          first_customers: "early-customer",
          growing: "growth-stage",
          scaling: "scaling",
        };
        return `Your playbook is calibrated for ${stageLabel[data.companyMaturity] || data.companyMaturity} companies. Every recommendation is sequenced for what moves the needle at this stage.`;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bench = getVerticalBenchmark(vertical as any);
      if (!bench) return null;
      const { monthlyChurnRate, onboardingCompletionRate } = bench.metrics;
      const verticalLabel: Record<string, string> = {
        b2b_saas: "B2B SaaS",
        professional_services: "professional services",
        marketplace: "marketplace",
        fintech: "fintech",
        ecommerce_b2b: "B2B ecommerce",
        healthtech: "healthtech",
      };
      const label = verticalLabel[vertical] || vertical;
      return `${label} benchmarks loaded: top performers hold monthly churn under ${monthlyChurnRate.good}% and onboarding completion above ${onboardingCompletionRate.good}%. Your playbook will show exactly where you sit.`;
    }
    case "challenge": {
      const vertical = data.vertical || enrichment?.suggestedVertical;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bench = vertical ? getVerticalBenchmark(vertical as any) : null;
      const churnCost = bench
        ? `${bench.metrics.annualChurnRate.average}% annual churn`
        : "15-20% of ARR annually";
      return `Left unsystematized, these challenges drive ${churnCost} in preventable churn. Your playbook will sequence the highest-impact interventions first.`;
    }
    default:
      return null;
  }
}

// ─────────────────────────────────────────────
// Visual sub-components
// ─────────────────────────────────────────────

function AIBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3.5 mb-4">
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
        <LogoMark size="md" className="shadow-sm" />
      </div>
      <div className="bg-gradient-to-br from-white to-secondary/40 rounded-2xl rounded-tl-sm px-5 py-4 border border-border/50 shadow-sm max-w-[85%]">
        <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

function UserSummaryBubble({ content }: { content: string }) {
  return (
    <div className="ml-14 mb-4 max-w-[85%]">
      <div className="inline-block bg-primary text-primary-foreground rounded-2xl rounded-tl-sm px-5 py-3 shadow-sm">
        <p className="text-sm leading-relaxed">{content}</p>
      </div>
    </div>
  );
}

function InsightBubble({ content }: { content: string }) {
  return (
    <div className="ml-14 mb-4 max-w-[80%] animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl px-4 py-3 flex gap-3 items-start shadow-sm">
        <div className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
          <Sparkle size={14} className="text-amber-500" weight="fill" />
        </div>
        <p className="text-[13px] text-amber-900/90 leading-relaxed">{content}</p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3.5 mb-4">
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
        <LogoMark size="md" className="shadow-sm" />
      </div>
      <div className="bg-gradient-to-br from-white to-secondary/40 rounded-2xl rounded-tl-sm px-5 py-4 border border-border/50 shadow-sm flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "160ms" }} />
        <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "320ms" }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Enrichment card — inline "here's what I found"
// ─────────────────────────────────────────────

function EnrichmentCard({
  enrichment,
  data,
  onEdit,
}: {
  enrichment: EnrichedCompanyData;
  data: OnboardingData;
  onEdit: () => void;
}) {
  const domain = data.companyWebsite
    ? data.companyWebsite.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0]
    : enrichment.discoveredWebsite
      ? enrichment.discoveredWebsite.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0]
      : null;

  const LOGO_SOURCES = domain
    ? [
        `https://logo.clearbit.com/${domain}`,
        `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
      ]
    : [];
  const [logoSourceIndex, setLogoSourceIndex] = useState(0);
  const currentLogoSrc = LOGO_SOURCES[logoSourceIndex];

  const initials = data.companyName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  const verticalLabel: Record<string, string> = {
    b2b_saas: "B2B SaaS",
    professional_services: "Professional Services",
    marketplace: "Marketplace",
    fintech: "Fintech",
    ecommerce_b2b: "B2B E-commerce",
    healthtech: "Healthtech",
  };

  const sizeLabel: Record<string, string> = {
    "1-10": "1-10 employees",
    "11-50": "11-50 employees",
    "51-150": "51-150 employees",
    "151-300": "151-300 employees",
    "300+": "300+ employees",
  };

  return (
    <div className="ml-14 mb-4 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
            {currentLogoSrc ? (
              <img
                src={currentLogoSrc}
                alt={data.companyName}
                className="w-10 h-10 object-contain"
                onError={() => setLogoSourceIndex((i) => i + 1)}
              />
            ) : (
              <span className="text-sm font-bold text-primary">{initials}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground text-sm leading-tight truncate">
              {enrichment.officialCompanyName || data.companyName}
            </p>
            {domain && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">{domain}</p>
            )}
          </div>
          {enrichment.confidence && (
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
              enrichment.confidence === "high"
                ? "bg-emerald-50 text-emerald-600"
                : enrichment.confidence === "medium"
                  ? "bg-amber-50 text-amber-600"
                  : "bg-slate-100 text-slate-500"
            }`}>
              {enrichment.confidence} confidence
            </span>
          )}
        </div>

        {/* Description */}
        {enrichment.description && (
          <p className="text-xs text-muted-foreground leading-relaxed">{enrichment.description}</p>
        )}

        {/* Quick facts */}
        <div className="flex flex-wrap gap-2">
          {enrichment.suggestedVertical && (
            <span className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
              {verticalLabel[enrichment.suggestedVertical] || enrichment.suggestedVertical}
            </span>
          )}
          {enrichment.suggestedCompanySize && (
            <span className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
              {sizeLabel[enrichment.suggestedCompanySize] || enrichment.suggestedCompanySize}
            </span>
          )}
          {enrichment.suggestedMainChannel && (
            <span className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
              {enrichment.suggestedMainChannel === "sales_led" ? "Sales-led" :
               enrichment.suggestedMainChannel === "self_serve" ? "Product-led" :
               enrichment.suggestedMainChannel === "partner" ? "Partner-led" : "Mixed channels"}
            </span>
          )}
          {enrichment.suggestedCompetitors && enrichment.suggestedCompetitors.length > 0 && (
            <span className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
              vs {enrichment.suggestedCompetitors.slice(0, 2).join(", ")}
            </span>
          )}
        </div>

        {/* Fix it button */}
        <button
          type="button"
          onClick={onEdit}
          className="text-xs border border-primary/30 text-primary hover:bg-primary/5 font-medium flex items-center gap-1.5 transition-colors px-2.5 py-1.5 rounded-lg"
        >
          <PencilSimple size={12} weight="bold" />
          Not right? Edit this
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Company logo helper
// ─────────────────────────────────────────────

function CompanyLogo({ domain, companyName }: { domain: string | null; companyName: string }) {
  const LOGO_SOURCES = domain
    ? [
        `https://logo.clearbit.com/${domain}`,
        `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
      ]
    : [];

  const [sourceIndex, setSourceIndex] = useState(0);

  const initials = companyName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  const currentSrc = LOGO_SOURCES[sourceIndex];

  if (!currentSrc) {
    return <span className="text-base font-bold text-primary">{initials}</span>;
  }
  return (
    <img
      src={currentSrc}
      alt={companyName}
      className="w-11 h-11 object-contain"
      onError={() => setSourceIndex((i) => i + 1)}
    />
  );
}

// ─────────────────────────────────────────────
// Insights panel (right sidebar) — grows as user progresses
// ─────────────────────────────────────────────

function InsightsPanel({
  insights,
  data,
  enrichment,
}: {
  insights: Array<{ key: string; content: string }>;
  data: OnboardingData;
  enrichment: EnrichedCompanyData | null;
}) {
  const domain = data.companyWebsite
    ? data.companyWebsite.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0]
    : enrichment?.discoveredWebsite
      ? enrichment.discoveredWebsite.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0]
      : null;

  return (
    <div className="space-y-3">
      {/* Compact company card */}
      {data.companyName && (
        <div className="bg-white rounded-2xl border border-slate-200 p-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
              <CompanyLogo domain={domain} companyName={data.companyName} />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground text-xs leading-tight truncate">{data.companyName}</p>
              {domain && <p className="text-[10px] text-muted-foreground truncate">{domain}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Insights — appear as user answers questions */}
      {insights.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide px-0.5">
            Insights for you
          </p>
          {insights.map((insight) => (
            <div
              key={insight.key}
              className="bg-amber-50/80 border border-amber-200/60 rounded-xl p-3 flex gap-2 items-start animate-in fade-in slide-in-from-right-2 duration-500"
            >
              <div className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                <Sparkle size={11} className="text-amber-500" weight="fill" />
              </div>
              <p className="text-[11px] text-amber-900/90 leading-relaxed">{insight.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Empty state — shown before any insights appear */}
      {insights.length === 0 && data.companyName && (
        <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center">
          <Sparkle size={16} className="text-slate-300 mx-auto mb-1.5" weight="fill" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Insights appear as you answer questions
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Generating Experience (reused from wizard)
// ─────────────────────────────────────────────

function GeneratingExperience({ companyName }: { companyName: string }) {
  const [phase, setPhase] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const name = companyName || "your company";

  const phases = [
    { title: "Reading your company profile", detail: `Cross-referencing ${name}'s stage, vertical, and business model against B2B benchmarks` },
    { title: "Mapping the full lifecycle", detail: "Building a full lifecycle journey: every stage, every handoff, every meaningful risk" },
    { title: "Scoring meaningful moments", detail: "Identifying the 10-15 interactions where customers decide to stay or leave" },
    { title: "Running risk analysis", detail: `Calculating revenue at risk based on ${name}'s real numbers, not guesswork` },
    { title: "Writing your CX intelligence report", detail: "Surfacing the patterns your team won't tell you about, backed by data" },
    { title: "Building your action playbook", detail: "Every insight becomes a prioritized action with templates, timelines, and owners" },
  ];

  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timings = [0, 10000, 25000, 45000, 65000, 85000];
    const timeouts = timings.map((ms, i) => setTimeout(() => setPhase(i), ms));
    return () => timeouts.forEach(clearTimeout);
  }, []);

  const progress = Math.min((seconds / 120) * 100, 95);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          Mapping your journey &amp; building your playbook
        </h2>
        <p className="text-sm text-slate-500">
          First your journey map, then a prioritized action playbook —{" "}
          <span className="font-medium text-primary">all personalized, all in minutes.</span>
        </p>
      </div>

      <div className="space-y-1.5">
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-slate-400 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between">
          <span className="text-[11px] text-slate-400 tabular-nums">
            {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, "0")} elapsed
          </span>
          <span className="text-[11px] text-slate-400">
            {seconds < 60 ? "Analyzing..." : seconds < 90 ? "Almost there..." : "Finalizing..."}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {phases.map((p, i) => {
          const isDone = i < phase;
          const isActive = i === phase;
          return (
            <div key={i} className={`flex items-start gap-3 transition-all duration-500 ${isDone || isActive ? "opacity-100" : "opacity-30"}`}>
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center">
                    <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                    </svg>
                  </div>
                ) : isActive ? (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-200" />
                )}
              </div>
              <div>
                <p className={`text-sm font-medium leading-snug ${isDone ? "text-slate-400" : isActive ? "text-slate-800" : "text-slate-400"}`}>
                  {p.title}
                </p>
                {isActive && <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{p.detail}</p>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-slate-100 pt-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Manual strategy work</p>
            <p className="text-lg font-bold text-slate-300">3-4 hours</p>
            <p className="text-[11px] text-slate-300">At your desk, from scratch</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide">CX Mate</p>
            <p className="text-lg font-bold text-primary">~2 minutes</p>
            <p className="text-[11px] text-slate-500">Same depth, your real data</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Step widgets
// ─────────────────────────────────────────────

function IdentityWidget({
  data,
  onChange,
  onSubmit,
  isEnriching,
}: {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
  onSubmit: () => void;
  isEnriching: boolean;
}) {
  const canSubmit = data.companyName.trim().length >= 2;
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canSubmit && !isEnriching) onSubmit();
  };
  return (
    <div className="ml-14 mb-4 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
        {/* Name + Role — inline, minimal */}
        <div className="flex gap-3">
          <input
            type="text"
            value={data.userName || ""}
            onChange={(e) => onChange({ userName: e.target.value })}
            onKeyDown={handleKey}
            placeholder="Your first name"
            className="flex-1 text-sm border-0 border-b border-slate-200 px-0 py-2 focus:outline-none focus:border-primary/60 transition-all bg-transparent placeholder:text-slate-400"
          />
          <input
            type="text"
            value={data.userRole || ""}
            onChange={(e) => onChange({ userRole: e.target.value })}
            onKeyDown={handleKey}
            placeholder="Your role"
            className="flex-1 text-sm border-0 border-b border-slate-200 px-0 py-2 focus:outline-none focus:border-primary/60 transition-all bg-transparent placeholder:text-slate-400"
          />
        </div>
        {/* Company — prominent */}
        <input
          type="text"
          value={data.companyName}
          onChange={(e) => onChange({ companyName: e.target.value })}
          onKeyDown={handleKey}
          placeholder="Company name"
          className="w-full text-sm font-medium border-0 border-b border-slate-200 px-0 py-2 focus:outline-none focus:border-primary/60 transition-all bg-transparent placeholder:text-slate-400"
        />
        {/* Website */}
        <input
          type="text"
          value={data.companyWebsite}
          onChange={(e) => onChange({ companyWebsite: e.target.value })}
          onKeyDown={handleKey}
          placeholder="company.com  (used to find public info about you)"
          className="w-full text-sm border-0 border-b border-slate-200 px-0 py-2 focus:outline-none focus:border-primary/60 transition-all bg-transparent placeholder:text-slate-400"
        />
        <div className="pt-1 min-h-[28px] flex items-center">
          {isEnriching ? (
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              Analyzing your company...
            </span>
          ) : canSubmit ? (
            <span className="text-[11px] text-muted-foreground">↵ Press Enter to continue</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function MaturityWidget({
  onSelect,
}: {
  onSelect: (maturity: CompanyMaturity) => void;
}) {
  return (
    <div className="ml-14 mb-4 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="grid grid-cols-1 gap-2">
        {MATURITY_OPTIONS.map((opt) => {
          const Icon = MATURITY_ICONS[opt.iconName];
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-primary/50 hover:bg-primary/5 transition-all text-left group shadow-sm"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                {Icon && <Icon size={18} className="text-primary" weight="duotone" />}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground leading-tight">{opt.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{opt.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChallengeWidget({
  data,
  onChange,
  onSubmit,
  supportsVoice,
  isListening,
  onToggleVoice,
}: {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
  onSubmit: () => void;
  supportsVoice: boolean;
  isListening: boolean;
  onToggleVoice: () => void;
}) {
  const painOptions = getPainPointsForMaturity(data.companyMaturity);
  const hasText = data.biggestChallenge.trim().length >= 5;
  const hasChips = data.painPoints.length >= 1;
  const canSubmit = hasText || hasChips;
  const autoSubmitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (autoSubmitTimer.current) clearTimeout(autoSubmitTimer.current); };
  }, []);

  const togglePain = (value: string) => {
    const current = data.painPoints;
    const updated = current.includes(value)
      ? current.filter((p) => p !== value)
      : [...current, value];
    onChange({ painPoints: updated });
    // Auto-advance 2s after last chip click (only if no free-text is being typed)
    if (autoSubmitTimer.current) clearTimeout(autoSubmitTimer.current);
    if (updated.length > 0) {
      autoSubmitTimer.current = setTimeout(onSubmit, 2000);
    }
  };

  return (
    <div className="ml-14 mb-4 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        {/* Challenge textarea */}
        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">
            What&apos;s your biggest challenge with customers right now?
          </label>
          <div className="relative">
            <textarea
              value={data.biggestChallenge}
              onChange={(e) => {
                onChange({ biggestChallenge: e.target.value });
                // Cancel chip auto-submit if user is actively typing
                if (autoSubmitTimer.current) clearTimeout(autoSubmitTimer.current);
              }}
              placeholder="Tell me what's keeping you up at night…"
              rows={3}
              className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
            />
            {supportsVoice && (
              <button
                type="button"
                onClick={onToggleVoice}
                className={`absolute right-2 bottom-2 p-1.5 rounded-lg transition-colors ${
                  isListening ? "bg-red-100 text-red-500" : "text-slate-400 hover:bg-slate-100"
                }`}
              >
                {isListening ? <MicrophoneSlash size={16} /> : <Microphone size={16} />}
              </button>
            )}
          </div>
        </div>

        {/* Pain point chips */}
        <div>
          <label className="text-xs font-medium text-slate-500 mb-2 block">
            Also pick any that hit home:
          </label>
          <div className="flex flex-wrap gap-2">
            {painOptions.map((pain) => {
              const isSelected = data.painPoints.includes(pain.value);
              return (
                <button
                  key={pain.value}
                  type="button"
                  onClick={() => togglePain(pain.value)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-xl border transition-all duration-150 ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  {isSelected && <CheckCircle size={12} className="inline mr-1 -mt-0.5" weight="bold" />}
                  {pain.label}
                </button>
              );
            })}
          </div>
          {canSubmit && (
            <div className="flex items-center justify-between mt-2.5">
              {hasChips
                ? <p className="text-[11px] text-muted-foreground">Moving on in a moment…</p>
                : <span />
              }
              <button
                type="button"
                onClick={() => {
                  if (autoSubmitTimer.current) clearTimeout(autoSubmitTimer.current);
                  onSubmit();
                }}
                className="text-xs font-medium text-primary flex items-center gap-1 hover:gap-1.5 transition-all"
              >
                Continue <ArrowRight size={11} weight="bold" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Maturity-adaptive copy for the tools question
const TOOLS_COPY: Record<string, { label: string; placeholder: string }> = {
  scaling: {
    label: "Which ERP, CRM, and automation tools are you running?",
    placeholder: "e.g. Salesforce, HubSpot, SAP, Marketo, Intercom...",
  },
  growing: {
    label: "Which CRM, support, and marketing tools does your team use?",
    placeholder: "e.g. HubSpot, Zendesk, Mailchimp, Intercom, Slack...",
  },
  first_customers: {
    label: "Which tools are you using to manage customers today?",
    placeholder: "e.g. HubSpot, Notion, Intercom, Gmail, Slack...",
  },
  pre_launch: {
    label: "Which tools are you planning to use? (CRM, support, comms…)",
    placeholder: "e.g. HubSpot, Notion, Intercom, Slack...",
  },
};

// Journey component groups — mirrors step-journey-exists.tsx (text-only for chat widget)
const JOURNEY_COMPONENT_GROUPS: { label: string; items: { value: string; label: string }[] }[] = [
  {
    label: "Pre-sale",
    items: [
      { value: "ideal_customer_profile", label: "ICP / ideal customer profile" },
      { value: "sales_pipeline", label: "Sales pipeline / CRM" },
      { value: "sales_playbook", label: "Sales playbook" },
      { value: "demo_process", label: "Demo / trial process" },
      { value: "proposal_contract", label: "Proposal / contract flow" },
    ],
  },
  {
    label: "Onboarding",
    items: [
      { value: "handoff_process", label: "Sales → CS handoff" },
      { value: "onboarding_checklist", label: "Onboarding checklist" },
      { value: "kickoff_process", label: "Kickoff call structure" },
      { value: "implementation_plan", label: "Implementation plan" },
    ],
  },
  {
    label: "Enablement",
    items: [
      { value: "training_program", label: "Training program" },
      { value: "knowledge_base", label: "Knowledge base / docs" },
      { value: "adoption_tracking", label: "Adoption tracking" },
    ],
  },
  {
    label: "Ongoing Success",
    items: [
      { value: "cs_playbook", label: "CS playbook" },
      { value: "qbr_cadence", label: "QBR / review cadence" },
      { value: "health_scoring", label: "Health scoring" },
      { value: "nps_csat", label: "NPS / CSAT loop" },
      { value: "support_flow", label: "Support / escalation flow" },
      { value: "sla_process", label: "SLA process" },
    ],
  },
  {
    label: "Expansion",
    items: [
      { value: "renewal_process", label: "Renewal process" },
      { value: "upsell_playbook", label: "Upsell / cross-sell" },
      { value: "churn_prevention", label: "Churn prevention" },
    ],
  },
];

function ContextWidget({
  data,
  onChange,
  onSubmit,
  supportsVoice,
  isListening,
  onToggleVoice,
}: {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
  onSubmit: () => void;
  supportsVoice: boolean;
  isListening: boolean;
  onToggleVoice: () => void;
}) {
  const toolsCopy = TOOLS_COPY[data.companyMaturity] ?? TOOLS_COPY.first_customers;
  const existingComponents = data.existingJourneyComponents || [];
  const selectedCount = existingComponents.length;

  const toggleComponent = (value: string) => {
    const updated = existingComponents.includes(value)
      ? existingComponents.filter((c) => c !== value)
      : [...existingComponents, value];
    onChange({ existingJourneyComponents: updated });
  };

  return (
    <div className="ml-14 mb-4 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
        {/* Tech stack */}
        <div>
          <p className="text-xs font-medium text-slate-500 mb-2">{toolsCopy.label}</p>
          <div className="relative">
            <textarea
              value={data.currentTools || ""}
              onChange={(e) => onChange({ currentTools: e.target.value })}
              placeholder={toolsCopy.placeholder}
              rows={2}
              className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
            />
            {supportsVoice && (
              <button
                type="button"
                onClick={onToggleVoice}
                className={`absolute right-2 bottom-2 p-1.5 rounded-lg transition-colors ${
                  isListening ? "bg-red-100 text-red-500" : "text-slate-400 hover:bg-slate-100"
                }`}
              >
                {isListening ? <MicrophoneSlash size={16} /> : <Microphone size={16} />}
              </button>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* Journey checklist */}
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1">
            What do you already have in your customer journey?
          </p>
          <p className="text-[11px] text-muted-foreground mb-3">
            Check everything that exists — even if it&apos;s informal. This shapes your playbook.
          </p>
          <div className="space-y-4">
            {JOURNEY_COMPONENT_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => {
                    const isSelected = existingComponents.includes(item.value);
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => toggleComponent(item.value)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all duration-150 ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        {isSelected && (
                          <CheckCircle size={11} className="inline mr-1 -mt-0.5" weight="bold" />
                        )}
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {/* Free-text for anything not in the list */}
          <div className="mt-3">
            <input
              type="text"
              value={data.existingJourneyDescription || ""}
              onChange={(e) => onChange({ existingJourneyDescription: e.target.value })}
              placeholder="Anything else? e.g. 'weekly customer calls', 'champion program'…"
              className="w-full text-xs border-0 border-b border-slate-200 px-0 py-1.5 focus:outline-none focus:border-primary/60 transition-all bg-transparent placeholder:text-slate-400"
            />
          </div>
          {selectedCount > 0 && (
            <p className="text-[11px] text-primary mt-3 font-medium">
              {selectedCount} piece{selectedCount === 1 ? "" : "s"} selected — your playbook will build on what you have
            </p>
          )}
        </div>

        <Button
          onClick={onSubmit}
          className="w-full rounded-xl py-2.5 font-semibold"
        >
          <span className="flex items-center gap-2">
            Continue <ArrowRight size={16} weight="bold" />
          </span>
        </Button>
        <button
          type="button"
          onClick={onSubmit}
          className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip this step
        </button>
      </div>
    </div>
  );
}

function GoalWidget({
  data,
  onChange,
  onSubmit,
}: {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
  onSubmit: () => void;
}) {
  const goalOptions = getGoalsForPainAndMaturity(data.companyMaturity, data.painPoints);
  const canSubmit = data.primaryGoal && data.timeframe;

  // Auto-suggest timeframe when goal is selected
  const handleGoalSelect = (goalValue: string) => {
    const patch: Partial<OnboardingData> = { primaryGoal: goalValue };
    const suggested = GOAL_TIMEFRAME_MAP[goalValue];
    if (suggested && !data.timeframe) {
      patch.timeframe = suggested.timeframe;
    }
    onChange(patch);
  };

  return (
    <div className="ml-14 mb-4 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        {/* Goal chips */}
        <div>
          <label className="text-xs font-medium text-slate-500 mb-2 block">
            What do you want to fix first?
          </label>
          <div className="flex flex-wrap gap-2">
            {goalOptions.map((goal) => {
              const isSelected = data.primaryGoal === goal.value;
              return (
                <button
                  key={goal.value}
                  type="button"
                  onClick={() => handleGoalSelect(goal.value)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-xl border transition-all duration-150 ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : goal.relatedToPain
                        ? "border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  {isSelected && <CheckCircle size={12} className="inline mr-1 -mt-0.5" weight="bold" />}
                  {goal.relatedToPain && !isSelected && <Sparkle size={10} className="inline mr-1 -mt-0.5" weight="fill" />}
                  {goal.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeframe */}
        <div>
          <label className="text-xs font-medium text-slate-500 mb-2 block">
            When do you need results?
          </label>
          <div className="flex flex-wrap gap-2">
            {TIMEFRAME_OPTIONS.map((tf) => {
              const isSelected = data.timeframe === tf.value;
              return (
                <button
                  key={tf.value}
                  type="button"
                  onClick={() => onChange({ timeframe: tf.value })}
                  className={`text-xs font-medium px-3 py-1.5 rounded-xl border transition-all duration-150 ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  {tf.label}
                </button>
              );
            })}
          </div>
          {data.primaryGoal && GOAL_TIMEFRAME_MAP[data.primaryGoal] && (
            <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
              {GOAL_TIMEFRAME_MAP[data.primaryGoal].explanation}
            </p>
          )}
        </div>

        <Button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="w-full rounded-xl py-2.5 font-semibold"
        >
          <span className="flex items-center gap-2">
            Build my journey &amp; playbook <ArrowRight size={16} weight="bold" />
          </span>
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Enrichment edit modal (inline)
// ─────────────────────────────────────────────

function EnrichmentEditor({
  data,
  enrichment,
  onChange,
  onClose,
}: {
  data: OnboardingData;
  enrichment: EnrichedCompanyData;
  onChange: (patch: Partial<OnboardingData>) => void;
  onClose: () => void;
}) {
  return (
    <div className="ml-14 mb-4 max-w-[85%] animate-in fade-in duration-300">
      <div className="bg-white border border-primary/20 rounded-2xl p-5 shadow-sm space-y-3">
        <p className="text-xs font-semibold text-primary uppercase tracking-wide">Fix company info</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[11px] text-slate-400 mb-1">Industry</p>
            <input
              type="text"
              value={data.vertical}
              onChange={(e) => onChange({ vertical: e.target.value })}
              placeholder="e.g. B2B SaaS, Fintech..."
              className="w-full text-sm border-0 border-b border-slate-200 px-0 py-1.5 focus:outline-none focus:border-primary/60 transition-all bg-transparent placeholder:text-slate-400"
            />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 mb-1">Team size</p>
            <input
              type="text"
              value={data.companySize}
              onChange={(e) => onChange({ companySize: e.target.value })}
              placeholder="e.g. 11-50"
              className="w-full text-sm border-0 border-b border-slate-200 px-0 py-1.5 focus:outline-none focus:border-primary/60 transition-all bg-transparent placeholder:text-slate-400"
            />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 mb-1">Company name</p>
            <input
              type="text"
              value={data.companyName}
              onChange={(e) => onChange({ companyName: e.target.value })}
              placeholder="Company name"
              className="w-full text-sm border-0 border-b border-slate-200 px-0 py-1.5 focus:outline-none focus:border-primary/60 transition-all bg-transparent placeholder:text-slate-400"
            />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 mb-1">Website</p>
            <input
              type="text"
              value={data.companyWebsite}
              onChange={(e) => onChange({ companyWebsite: e.target.value })}
              placeholder="company.com"
              className="w-full text-sm border-0 border-b border-slate-200 px-0 py-1.5 focus:outline-none focus:border-primary/60 transition-all bg-transparent placeholder:text-slate-400"
            />
          </div>
        </div>
        <Button onClick={onClose} size="sm" className="rounded-xl">
          <CheckCircle size={14} className="mr-1" weight="bold" /> Done
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────

export function OnboardingChatWizard() {
  const router = useRouter();
  const profileContext = useCompanyProfile();

  // ── State ──────────────────────────────────────
  const [data, setData] = useState<OnboardingData>(DEFAULT_DATA);
  const [currentStep, setCurrentStep] = useState<WizardStep>("identity");
  const [conversation, setConversation] = useState<ConversationEntry[]>([
    { type: "ai", content: "Hey! I'm your CX Mate advisor. Tell me a bit about yourself and your company, and I'll build you a personalized CX playbook in minutes.", key: "greeting" },
    { type: "widget", step: "identity", key: "widget-identity" },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showEnrichmentEditor, setShowEnrichmentEditor] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sidebarInsights, setSidebarInsights] = useState<Array<{ key: string; content: string }>>([]);

  // Voice input
  const [isListening, setIsListening] = useState(false);
  const [supportsVoice, setSupportsVoice] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const insightsShown = useRef<Set<string>>(new Set());

  // Enrichment
  const { enrichment, isEnriching, enrich } = useCompanyEnrichment();

  // Autosave
  const stepIndex = ["identity", "maturity", "challenge", "context", "goal", "generating"].indexOf(currentStep);
  useOnboardingAutosave(data, stepIndex);

  // ── Effects ──────────────────────────────────────

  // Detect voice support
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    setSupportsVoice(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
  }, []);

  // Auto-scroll — multiple attempts to catch widgets that render after paint
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const doScroll = () => container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    // Immediate
    requestAnimationFrame(doScroll);
    // After first paint (catches most elements)
    const t1 = setTimeout(doScroll, 100);
    // After animations start (catches large widget cards)
    const t2 = setTimeout(doScroll, 350);
    // Final catch-all (widgets with entrance animations)
    const t3 = setTimeout(doScroll, 700);
    // Extra catch for large widget cards that animate in slowly
    const t4 = setTimeout(doScroll, 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [conversation, isTyping, currentStep]);

  // Push data to sidebar context
  useEffect(() => {
    profileContext.setOnboardingData(data);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  // Push enrichment to sidebar context
  useEffect(() => {
    if (enrichment) {
      profileContext.setEnrichment(enrichment);
    }
  }, [enrichment]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Data helpers ──────────────────────────────────

  const updateData = useCallback((patch: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  // Apply enrichment to data fields
  const applyEnrichment = useCallback((e: EnrichedCompanyData) => {
    const patch: Partial<OnboardingData> = {};
    if (e.officialCompanyName) patch.companyName = e.officialCompanyName;
    if (e.suggestedVertical) patch.vertical = e.suggestedVertical;
    if (e.suggestedCompanySize) patch.companySize = e.suggestedCompanySize;
    if (e.suggestedCustomerSize) patch.customerSize = e.suggestedCustomerSize;
    if (e.suggestedMainChannel) patch.mainChannel = e.suggestedMainChannel;
    if (e.suggestedCompetitors?.length) patch.competitors = e.suggestedCompetitors.join(", ");
    if (e.discoveredWebsite && !data.companyWebsite) patch.companyWebsite = e.discoveredWebsite;
    setData((prev) => ({ ...prev, ...patch }));
  }, [data.companyWebsite]);

  // ── Voice toggle ──────────────────────────────────

  const toggleVoice = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript: string = event.results[0][0].transcript;
      setData((prev) => ({ ...prev, biggestChallenge: (prev.biggestChallenge ? prev.biggestChallenge + " " : "") + transcript }));
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  }, [isListening]);

  // ── Transition helper — adds typing delay ──────────

  const transitionTo = useCallback((
    nextStep: WizardStep,
    entries: ConversationEntry[],
    delay = 600
  ) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setConversation((prev) => [...prev, ...entries]);
      setCurrentStep(nextStep);
    }, delay);
  }, []);

  // ── Step handlers ──────────────────────────────────

  const handleIdentitySubmit = useCallback(async () => {
    const name = data.userName || "there";
    const company = data.companyName;
    const summaryParts = [data.userName, data.userRole, company].filter(Boolean);
    const summary = summaryParts.join(", ");

    // User summary bubble
    const entries: ConversationEntry[] = [
      { type: "user-summary", content: summary, key: `user-identity-${Date.now()}` },
    ];

    // Remove the widget from conversation
    setConversation((prev) => [...prev.filter((e) => e.key !== "widget-identity"), ...entries]);

    // Trigger enrichment
    const enrichResult = await enrich(company, data.companyWebsite || undefined);

    if (enrichResult) {
      applyEnrichment(enrichResult);

      // Add enrichment card + AI response
      const nextEntries: ConversationEntry[] = [
        { type: "enrichment-card", key: `enrichment-${Date.now()}` },
        { type: "ai", content: `Great to meet you, ${name}! I found some info about ${enrichResult.officialCompanyName || company}. Does this look right? You can adjust anything that's off.`, key: `ai-post-enrich-${Date.now()}` },
      ];

      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setConversation((prev) => [
          ...prev,
          ...nextEntries,
          { type: "ai", content: `Where is ${enrichResult.officialCompanyName || company} on its journey?`, key: `ai-maturity-q-${Date.now()}` },
          { type: "widget", step: "maturity", key: "widget-maturity" },
        ]);
        setCurrentStep("maturity");
      }, 800);
    } else {
      // No enrichment — proceed directly
      transitionTo("maturity", [
        { type: "ai", content: `Nice to meet you, ${name}! Where is ${company} on its journey?`, key: `ai-maturity-q-${Date.now()}` },
        { type: "widget", step: "maturity", key: "widget-maturity" },
      ]);
    }

    track("onboarding_step_completed", { step_key: "identity", step_number: 0, company_name: company });
    notifyOwner("onboarding_started", { companyName: company, email: data.userEmail || undefined });
  }, [data, enrich, applyEnrichment, transitionTo]);

  const handleMaturitySelect = useCallback((maturity: CompanyMaturity) => {
    const derived = deriveFromMaturity(maturity);
    const maturityLabel = MATURITY_OPTIONS.find((m) => m.value === maturity)?.label || maturity;

    updateData({ companyMaturity: maturity, ...derived });

    // User summary + insight
    const entries: ConversationEntry[] = [
      { type: "user-summary", content: maturityLabel, key: `user-maturity-${Date.now()}` },
    ];

    // Push insight to sidebar (not inline chat)
    const insightContent = buildInsightForStep("maturity", { ...data, companyMaturity: maturity, ...derived }, enrichment);
    if (insightContent && !insightsShown.current.has("maturity")) {
      insightsShown.current.add("maturity");
      setSidebarInsights((prev) => [...prev, { key: `insight-maturity-${Date.now()}`, content: insightContent }]);
    }

    // Remove maturity widget, add entries
    setConversation((prev) => [...prev.filter((e) => e.key !== "widget-maturity"), ...entries]);

    // Transition to challenge
    transitionTo("challenge", [
      { type: "ai", content: "What's the biggest challenge you're facing with customers right now? Tell me in your own words, then pick the ones that hit home.", key: `ai-challenge-q-${Date.now()}` },
      { type: "widget", step: "challenge", key: "widget-challenge" },
    ]);

    track("onboarding_step_completed", { step_key: "maturity", step_number: 1, company_name: data.companyName });
  }, [data, enrichment, updateData, transitionTo]);

  const handleChallengeSubmit = useCallback(() => {
    const painLabels = getPainPointsForMaturity(data.companyMaturity)
      .filter((p) => data.painPoints.includes(p.value))
      .map((p) => p.label);
    // If no free text, use pain labels as the challenge description
    if (!data.biggestChallenge.trim() && painLabels.length > 0) {
      updateData({ biggestChallenge: painLabels.join("; ") });
    }
    const challengeText = data.biggestChallenge.trim() || painLabels.join("; ");
    const summary = painLabels.length > 0
      ? `${challengeText}${data.biggestChallenge.trim() ? "\n" + painLabels.join(" / ") : ""}`
      : challengeText;

    const entries: ConversationEntry[] = [
      { type: "user-summary", content: summary, key: `user-challenge-${Date.now()}` },
    ];

    // Push insight to sidebar (not inline chat)
    const insightContent = buildInsightForStep("challenge", data, enrichment);
    if (insightContent && !insightsShown.current.has("challenge")) {
      insightsShown.current.add("challenge");
      setSidebarInsights((prev) => [...prev, { key: `insight-challenge-${Date.now()}`, content: insightContent }]);
    }

    setConversation((prev) => [...prev.filter((e) => e.key !== "widget-challenge"), ...entries]);

    const contextPrompt = data.companyMaturity === "scaling" || data.companyMaturity === "growing"
      ? `Two quick questions — your tools and what's already built. Helps me build on what you have instead of starting from scratch.`
      : `Almost done — what tools do you use, and what's already in place? Even informal processes count.`;

    transitionTo("context", [
      { type: "ai", content: contextPrompt, key: `ai-context-q-${Date.now()}` },
      { type: "widget", step: "context", key: "widget-context" },
    ]);

    track("onboarding_step_completed", { step_key: "challenge", step_number: 2, company_name: data.companyName });
  }, [data, enrichment, updateData, transitionTo]);

  const handleContextSubmit = useCallback(() => {
    // Build user summary
    const toolsSummary = data.currentTools?.trim();
    const components = data.existingJourneyComponents || [];
    const componentCount = components.length;
    const componentsSummary = componentCount > 0
      ? `${componentCount} journey piece${componentCount === 1 ? "" : "s"}`
      : "";
    const parts = [toolsSummary, componentsSummary].filter(Boolean);
    const summary = parts.length > 0 ? parts.join(" · ") : "Skipped";

    // Derive hasExistingJourney from checklist selection
    const journeyStatus = componentCount >= 8 ? "yes" : componentCount > 0 ? "partial" : "no";
    updateData({ hasExistingJourney: journeyStatus });

    const entries: ConversationEntry[] = [
      { type: "user-summary", content: summary, key: `user-context-${Date.now()}` },
    ];
    setConversation((prev) => [...prev.filter((e) => e.key !== "widget-context"), ...entries]);

    transitionTo("goal", [
      { type: "ai", content: "Almost there — what do you want to fix first, and when do you need results?", key: `ai-goal-q-${Date.now()}` },
      { type: "widget", step: "goal", key: "widget-goal" },
    ]);

    track("onboarding_step_completed", { step_key: "context", step_number: 3, company_name: data.companyName });
  }, [data, updateData, transitionTo]);

  const handleGoalSubmit = useCallback(() => {
    const goalLabel = getGoalsForPainAndMaturity(data.companyMaturity, data.painPoints)
      .find((g) => g.value === data.primaryGoal)?.label || data.primaryGoal;
    const tfLabel = TIMEFRAME_OPTIONS.find((t) => t.value === data.timeframe)?.label || data.timeframe;
    const summary = `${goalLabel} / ${tfLabel}`;

    const entries: ConversationEntry[] = [
      { type: "user-summary", content: summary, key: `user-goal-${Date.now()}` },
    ];

    setConversation((prev) => [...prev.filter((e) => e.key !== "widget-goal"), ...entries]);

    // Set missing required fields with defaults from enrichment or sensible defaults
    const finalPatch: Partial<OnboardingData> = {};
    if (!data.customerDescription) {
      finalPatch.customerDescription = enrichment?.suggestedCustomerSize
        ? `${enrichment.suggestedCustomerSize} companies`
        : "B2B companies";
    }
    if (!data.customerSize) {
      finalPatch.customerSize = enrichment?.suggestedCustomerSize || "mid_market";
    }
    if (!data.mainChannel) {
      finalPatch.mainChannel = enrichment?.suggestedMainChannel || "sales_led";
    }
    if (!data.vertical) {
      finalPatch.vertical = enrichment?.suggestedVertical || "b2b_saas";
    }
    if (!data.companySize) {
      finalPatch.companySize = enrichment?.suggestedCompanySize || "11-50";
    }
    if (Object.keys(finalPatch).length > 0) {
      setData((prev) => ({ ...prev, ...finalPatch }));
    }

    // Identify user
    if (data.userEmail) {
      identify(data.userEmail, {
        name: data.userName,
        company: data.companyName,
        role: data.userRole,
      });
    }

    // Transition to generating
    transitionTo("generating", [
      { type: "ai", content: `I have everything I need. Building ${data.companyName}'s personalized CX playbook now...`, key: `ai-generating-${Date.now()}` },
    ]);

    track("onboarding_step_completed", { step_key: "goal", step_number: 3, company_name: data.companyName });

    // Trigger generation after a beat
    setTimeout(() => {
      handleSubmit();
    }, 500);
  }, [data, enrichment, transitionTo]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Submit / Generate ──────────────────────────────

  const handleSubmit = useCallback(async (retryCount = 0) => {
    const generationStartTime = Date.now();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const controller = new AbortController();
      abortRef.current = controller;
      timeoutRef.current = setTimeout(() => {
        controller.abort("Request timed out");
      }, 240_000);

      // Build final payload — apply defaults for Pass-2 fields not yet collected
      const defaults: Partial<OnboardingData> = {};
      if (!data.biggestChallenge || data.biggestChallenge.trim().length < 1) {
        // Use pain point labels as fallback
        const painLabels = getPainPointsForMaturity(data.companyMaturity)
          .filter((p) => data.painPoints.includes(p.value))
          .map((p) => p.label);
        defaults.biggestChallenge = painLabels.length > 0 ? painLabels.join("; ") : "Improving CX";
      }
      if (!data.customerDescription) {
        defaults.customerDescription = enrichment?.suggestedCustomerSize
          ? `${enrichment.suggestedCustomerSize} companies`
          : "B2B companies";
      }
      if (!data.customerSize) {
        defaults.customerSize = enrichment?.suggestedCustomerSize || "mid_market";
      }
      if (!data.mainChannel) {
        defaults.mainChannel = enrichment?.suggestedMainChannel || "sales_led";
      }
      if (!data.vertical) {
        defaults.vertical = enrichment?.suggestedVertical || "b2b_saas";
      }
      if (!data.companySize) {
        defaults.companySize = enrichment?.suggestedCompanySize || "11-50";
      }
      const merged = { ...data, ...defaults };
      const submitData = enrichment
        ? { ...merged, enrichmentData: enrichment }
        : merged;

      track("journey_generation_started", {
        maturity: data.companyMaturity,
        journey_type: data.journeyType,
        has_existing_customers: data.hasExistingCustomers,
      });

      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
        signal: controller.signal,
      });

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        let errMsg = "Failed to generate journey. Please try again.";
        if (errorBody?.details?.fieldErrors && typeof errorBody.details.fieldErrors === "object") {
          const fields = Object.keys(errorBody.details.fieldErrors);
          errMsg = `Missing required fields: ${fields.join(", ")}. Please try again.`;
          console.warn("Validation field errors:", errorBody.details.fieldErrors);
        } else if (typeof errorBody?.details === "string") {
          errMsg = errorBody.details;
        } else if (typeof errorBody?.error === "string") {
          errMsg = errorBody.error;
        }
        throw new Error(errMsg);
      }

      const result = await response.json();
      track("journey_generation_succeeded", {
        duration_seconds: Math.round((Date.now() - generationStartTime) / 1000),
        template_id: result.templateId,
      });
      notifyOwner("journey_generation_succeeded", {
        email: data.userEmail || undefined,
        companyName: data.companyName || undefined,
        details: `${result.journey?.stages?.length || "?"} stages generated in ${Math.round((Date.now() - generationStartTime) / 1000)}s`,
      });

      sessionStorage.setItem("cx-mate-journey", JSON.stringify(result));
      profileContext.setJourney(result.journey);
      profileContext.setTemplateId(result.templateId);
      clearOnboardingDraft();
      router.push(`/journey?id=${result.templateId}`);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        const isTimeout = abortRef.current?.signal?.reason === "Request timed out";
        if (isTimeout) {
          if (retryCount < 1) {
            track("journey_generation_retried");
            handleSubmit(retryCount + 1);
            return;
          }
          track("journey_generation_failed", { error_type: "timeout", retry_count: retryCount });
          setSubmitError("Generation took a bit longer than usual. Please try again.");
          setIsSubmitting(false);
        }
        return;
      }
      console.error("Onboarding error:", error);
      track("journey_generation_failed", { error_type: "api_error", retry_count: retryCount });
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      setSubmitError(message);
      setIsSubmitting(false);
    }
  }, [data, enrichment, profileContext, router]);

  // ── Cleanup on unmount ──────────────────────────────

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      abortRef.current?.abort();
    };
  }, []);

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────

  return (
    <div className="w-full h-full grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-4 min-h-0 overflow-hidden">
      {/* Left: Chat column */}
      <div className="flex flex-col h-full min-h-0 min-w-0">
        {/* Header */}
        <div className="mb-4 text-center space-y-1 shrink-0">
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <LogoMark size="md" />
            <span className="text-base font-bold text-foreground tracking-tight">CX Mate</span>
          </div>
          <h1 className="text-xl font-bold text-foreground tracking-tight flex items-center justify-center gap-2">
            {data.companyWebsite && (
              <CompanyLogo
                domain={data.companyWebsite.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0]}
                companyName={data.companyName}
              />
            )}
            {data.companyName
              ? `Building ${data.companyName}'s journey & playbook`
              : "Let's build your CX playbook"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {currentStep !== "generating"
              ? "A few questions that replace hours of CX strategy work"
              : "Your journey map and playbook are being built…"}
          </p>
        </div>

        {/* Scrollable conversation */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-1 pb-4 min-h-0"
        >
          {conversation.map((entry) => {
            switch (entry.type) {
              case "ai":
                return (
                  <AIBubble key={entry.key}>
                    {entry.content.split("\n").map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </AIBubble>
                );
              case "user-summary":
                return <UserSummaryBubble key={entry.key} content={entry.content} />;
              case "insight":
                return <InsightBubble key={entry.key} content={entry.content} />;
              case "enrichment-card":
                return enrichment ? (
                  showEnrichmentEditor ? (
                    <EnrichmentEditor
                      key={entry.key}
                      data={data}
                      enrichment={enrichment}
                      onChange={updateData}
                      onClose={() => setShowEnrichmentEditor(false)}
                    />
                  ) : (
                    <EnrichmentCard
                      key={entry.key}
                      enrichment={enrichment}
                      data={data}
                      onEdit={() => setShowEnrichmentEditor(true)}
                    />
                  )
                ) : null;
              case "widget":
                // Only render the active widget
                if (entry.step !== currentStep) return null;
                switch (entry.step) {
                  case "identity":
                    return (
                      <IdentityWidget
                        key={entry.key}
                        data={data}
                        onChange={updateData}
                        onSubmit={handleIdentitySubmit}
                        isEnriching={isEnriching}
                      />
                    );
                  case "maturity":
                    return (
                      <MaturityWidget
                        key={entry.key}
                        onSelect={handleMaturitySelect}
                      />
                    );
                  case "challenge":
                    return (
                      <ChallengeWidget
                        key={entry.key}
                        data={data}
                        onChange={updateData}
                        onSubmit={handleChallengeSubmit}
                        supportsVoice={supportsVoice}
                        isListening={isListening}
                        onToggleVoice={toggleVoice}
                      />
                    );
                  case "context":
                    return (
                      <ContextWidget
                        key={entry.key}
                        data={data}
                        onChange={updateData}
                        onSubmit={handleContextSubmit}
                        supportsVoice={supportsVoice}
                        isListening={isListening}
                        onToggleVoice={toggleVoice}
                      />
                    );
                  case "goal":
                    return (
                      <GoalWidget
                        key={entry.key}
                        data={data}
                        onChange={updateData}
                        onSubmit={handleGoalSubmit}
                      />
                    );
                  default:
                    return null;
                }
              default:
                return null;
            }
          })}

          {/* Typing indicator */}
          {isTyping && <TypingIndicator />}

          {/* Generating experience */}
          {currentStep === "generating" && (
            <div className="ml-14 mb-4 max-w-[85%]">
              <GeneratingExperience companyName={data.companyName} />
            </div>
          )}

          {/* Error */}
          {submitError && (
            <div className="ml-14 mb-4 max-w-[85%]">
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                {submitError}
                <button
                  onClick={() => handleSubmit()}
                  className="ml-2 font-semibold text-red-800 underline hover:no-underline"
                >
                  Try again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Insights panel (hidden on mobile) */}
      <div className="hidden lg:block">
        <div className="sticky top-4 space-y-3">
          <InsightsPanel data={data} enrichment={enrichment} insights={sidebarInsights} />
        </div>
      </div>
    </div>
  );
}
