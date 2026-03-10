"use client";

/**
 * OnboardingChat — Conversational onboarding (replaces the wizard).
 *
 * Flow:
 *  1. AI opens with a greeting + first question (hardcoded, no API call)
 *  2. User types → POST /api/onboarding/chat → AI replies + extracts fields
 *  3. Company profile panel slides in on the right when company name is extracted
 *  4. Insight callout bubbles appear inline for contextual benchmarks
 *  5. Enrichment fires after company name, surfaces inferences naturally
 *  6. When isComplete=true, 1.2s pause → GeneratingExperience → POST /api/onboarding
 *
 * Old wizard (onboarding-wizard.tsx) is preserved — this lives alongside it.
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkle, Microphone } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/ui/logo-mark";
import { useCompanyEnrichment } from "@/hooks/use-company-enrichment";
import { deriveFromMaturity } from "@/types/onboarding";
import type { EnrichedCompanyData } from "@/types/enrichment";
import { getVerticalBenchmark, getSizeBenchmark } from "@/lib/cx-knowledge";
import { track, identify } from "@/lib/analytics";
import { notifyOwner } from "@/lib/notify";
import { createClient } from "@/lib/supabase/client";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type ChatMessage =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string }
  | { role: "insight"; content: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fields = Record<string, any>;

// ─────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────

const FIELD_LABELS: Record<string, string> = {
  vertical: "Industry",
  companySize: "Team Size",
  companyMaturity: "Stage",
  customerDescription: "Customer Type",
  customerSize: "Customer Count",
  mainChannel: "Sales Channel",
  primaryGoal: "Main Goal",
  timeframe: "Timeline",
};


// Insights shown after specific fields are extracted (appear inline in chat).
// Now DYNAMIC — references actual company data, benchmark numbers, and enrichment.
// Each function returns a string (or null to skip) given the current fields + enrichment.
const FIELD_INSIGHT_BUILDERS: Record<
  string,
  (fields: Fields, enrichment: EnrichedCompanyData | null) => string | null
> = {
  // Stage — fire early, anchor the personalization frame
  companyMaturity: (fields) => {
    const stage = fields.companyMaturity;
    const stageLabel: Record<string, string> = {
      "pre-revenue": "pre-revenue",
      "early-customers": "early-customer",
      growing: "growth-stage",
      scaling: "scaling",
    };
    const label = stageLabel[stage] || stage;
    return `Your playbook is calibrated for ${label} companies. Every recommendation is sequenced for what moves the needle at this stage — not what works two years from now.`;
  },

  // Vertical — pull real benchmark numbers
  vertical: (fields, enrichment) => {
    const vertical = fields.vertical || enrichment?.suggestedVertical;
    if (!vertical || vertical === "other") return null;
    const bench = getVerticalBenchmark(vertical);
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
  },

  // Customer scale — make it specific to their size
  customerSize: (fields, enrichment) => {
    const size = fields.companySize || enrichment?.suggestedCompanySize;
    if (!size) return null;
    const bench = getSizeBenchmark(size);
    if (!bench) return null;
    const { annualChurnRate } = bench.metrics;
    return `At your scale, the average company loses ${annualChurnRate.average}% of customers annually. Top performers cut that to ${annualChurnRate.good}%. The patterns are already in your data — most companies don't see them until they've already cost them.`;
  },

  // Goal — link back to their specific goal
  primaryGoal: (fields) => {
    const goal = fields.primaryGoal;
    if (!goal) return null;
    return `Every recommendation will be ranked by how directly it drives "${goal}". No generic best practices — just what moves your specific outcome.`;
  },

  // Pain — connect to real cost
  biggestChallenge: (fields, enrichment) => {
    const challenge = fields.biggestChallenge;
    const vertical = fields.vertical || enrichment?.suggestedVertical;
    if (!challenge) return null;
    const bench = vertical ? getVerticalBenchmark(vertical) : null;
    const churnCost = bench
      ? `${bench.metrics.annualChurnRate.average}% annual churn`
      : "15–20% of ARR annually";
    return `Left unsystematized, this challenge drives ${churnCost} in preventable churn. Your playbook will sequence the highest-impact interventions first.`;
  },

  // Competitors — reference actual competitors from enrichment
  competitorDifferentiator: (_fields, enrichment) => {
    const competitors = enrichment?.suggestedCompetitors;
    if (competitors && competitors.length > 0) {
      const names = competitors.slice(0, 2).join(" and ");
      return `We're mapping how ${names} approach their customer journey — so your playbook shows where you can outperform them at every stage.`;
    }
    return "Your playbook will highlight the CX gaps your competitors likely share — and the moves that create an unfair advantage.";
  },
};

// ─────────────────────────────────────────────
// Stage inference from enrichment company size
// ─────────────────────────────────────────────

function inferStageFromSize(companySize: string): "early" | "growing" | "scaling" | null {
  if (companySize === "1-10" || companySize === "11-50") return "early";
  if (companySize === "51-150" || companySize === "151-300") return "growing";
  if (companySize === "300+") return "scaling";
  return null;
}

function inferStageFromMaturity(maturity: string): "early" | "growing" | "scaling" | null {
  if (maturity === "pre_launch" || maturity === "first_customers") return "early";
  if (maturity === "growing") return "growing";
  if (maturity === "scaling") return "scaling";
  return null;
}

interface StageMessage {
  headline: string;
  body: string;
}

function buildStageMessage(
  stage: "early" | "growing" | "scaling",
  enrichment: EnrichedCompanyData | null
): StageMessage {
  const competitors = enrichment?.suggestedCompetitors ?? [];
  const hasCompetitors = competitors.length >= 2;
  const competitorList = hasCompetitors
    ? competitors.slice(0, 3).join(", ")
    : null;

  const benchmarkSuffix = competitorList
    ? ` Benchmarked against ${competitorList} and others in your space.`
    : "";

  switch (stage) {
    case "early":
      return {
        headline: "First 50 customers: the make-or-break phase.",
        body:
          `Companies at this stage lose 40% of early users before they ever see real value — usually within the first 30 days. In about 5 minutes, you'll have the playbook to close that gap.${benchmarkSuffix}`,
      };
    case "growing":
      return {
        headline: "50–500 customers: where manual CS hits a wall.",
        body:
          `At this stage, teams go reactive: tickets pile up, onboarding slips, churn creeps in silently. In about 5 minutes, you'll have a system to fix it before it breaks.${benchmarkSuffix}`,
      };
    case "scaling":
      return {
        headline: "500+ customers: invisible patterns compound fast.",
        body:
          `Micro-churns, delayed expansions, at-risk accounts your team hasn't spotted yet. In about 5 minutes, you'll have the intelligence layer to stay ahead of all of it.${benchmarkSuffix}`,
      };
  }
}

// ─────────────────────────────────────────────
// Suggestion chips — shown when AI asks a question we can pre-answer
// Maps last AI message keywords → preset option chips
// ─────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSuggestionChips(lastMessage: string, fields: Record<string, any>): string[] | null {
  if (!lastMessage) return null;
  const lower = lastMessage.toLowerCase();
  const maturity = (fields.companyMaturity as string | undefined) ?? "";

  // ── Stage / maturity ─────────────────────────────────────────────────
  if (
    lower.includes("your journey") ||
    (lower.includes("pre-launch") && lower.includes("growing")) ||
    lower.includes("where are you on your journey")
  ) {
    return [
      "🚀 Pre-launch — no customers yet",
      "🌱 First customers (1-50)",
      "📈 Growing (50-500 customers)",
      "🏢 Scaling (500+ customers)",
    ];
  }

  // ── Role ─────────────────────────────────────────────────────────────
  if (lower.includes("your role") || lower.includes("what role")) {
    return ["Founder / CEO", "Head of CS", "Head of CX", "VP CS", "CSM", "CX Manager", "Other"];
  }

  // ── Journey documented ────────────────────────────────────────────────
  if (
    lower.includes("journey documented") ||
    lower.includes("even informally") ||
    lower.includes("customer journey")
  ) {
    return ["Yes — documented", "Partially — some things written down", "Not yet — in our heads"];
  }

  // ── CX setup (tools / processes) ─────────────────────────────────────
  if (
    lower.includes("cx setup") ||
    lower.includes("tools, team, processes") ||
    lower.includes("what tools")
  ) {
    return [
      "Mostly manual / spreadsheets",
      "Helpdesk (Intercom, Zendesk)",
      "Dedicated CSM team",
      "CS Platform (Gainsight, ChurnZero)",
      "Nothing formal yet",
    ];
  }

  // ── What's working / broken ───────────────────────────────────────────
  if (
    lower.includes("what's working") ||
    lower.includes("broken or missing") ||
    lower.includes("what's not working")
  ) {
    return [
      "Onboarding is too slow",
      "No visibility into customer health",
      "Team is reactive, not proactive",
      "High support / ticket volume",
      "Missing expansion opportunities",
    ];
  }

  // ── Pain points — maturity-aware ──────────────────────────────────────
  if (
    lower.includes("biggest cx challenge") ||
    lower.includes("biggest challenge right now")
  ) {
    if (maturity === "pre_launch") {
      return [
        "No structured sales process",
        "Can't explain our value clearly",
        "Losing deals without knowing why",
        "No go-to-market plan",
      ];
    }
    if (maturity === "first_customers") {
      return [
        "Onboarding is messy",
        "Customers not seeing value fast enough",
        "Every customer handled differently",
        "Too much time on support",
      ];
    }
    if (maturity === "growing") {
      return [
        "Customers leaving without warning",
        "No visibility into at-risk accounts",
        "Always firefighting",
        "No consistent playbook",
        "Missing expansion revenue",
      ];
    }
    if (maturity === "scaling") {
      return [
        "Can't identify at-risk accounts early",
        "CX is inconsistent across the team",
        "No unified customer view",
        "Onboarding doesn't scale",
        "Missing expansion revenue",
      ];
    }
    // Generic fallback
    return ["High churn", "No playbook", "Manual processes", "No health visibility"];
  }

  // ── ARR / Revenue ─────────────────────────────────────────────────────
  if (
    lower.includes("approximate arr") ||
    lower.includes("your arr") ||
    (lower.includes("arr") && lower.includes("pre-revenue"))
  ) {
    return ["Pre-revenue", "Under $100K ARR", "$100K-$500K ARR", "$500K-$1M ARR", "$1M-$5M ARR", "$5M+ ARR"];
  }

  // ── Deal size ─────────────────────────────────────────────────────────
  if (lower.includes("deal size") || lower.includes("typical deal")) {
    return ["Under $5K/yr", "$5K-$20K/yr", "$20K-$50K/yr", "$50K-$100K/yr", "$100K+/yr"];
  }

  // ── Goal — maturity-aware ─────────────────────────────────────────────
  if (
    lower.includes("hoping cx mate") ||
    lower.includes("help you achieve") ||
    lower.includes("what are you hoping")
  ) {
    if (maturity === "pre_launch") {
      return ["Map my sales process", "Understand buyer journey", "Get a GTM playbook", "Stand out from competitors"];
    }
    if (maturity === "first_customers") {
      return ["Build repeatable onboarding", "Make early customers succeed", "Create my first CX playbook", "Reduce support burden"];
    }
    if (maturity === "growing") {
      return ["Reduce churn", "Build a team playbook", "Move from reactive to proactive CX", "Fix onboarding", "Close sales-CS gaps"];
    }
    if (maturity === "scaling") {
      return ["Unify sales and CS journey", "Implement health scoring", "Scale CX without headcount", "Systematize expansion revenue"];
    }
    return ["Reduce churn", "Scale CS without hiring", "Improve onboarding", "Expand existing accounts"];
  }

  // ── Timeframe ─────────────────────────────────────────────────────────
  if (
    lower.includes("timeframe") ||
    lower.includes("seeing results") ||
    lower.includes("within 1 month")
  ) {
    return ["Within 1 month", "Within 3 months", "Within 6 months", "Just exploring"];
  }

  return null;
}

// ─────────────────────────────────────────────
// Opening message
// ─────────────────────────────────────────────

const OPENING_MESSAGE =
  "Hey! I'm your CX Mate advisor. I'm going to ask you a few sharp questions and turn your answers into a personalized CX playbook.\n\n**What's your name, and which company do you work for?** Drop your website too if you have one and I'll pull up what I know about you before we start.";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function extractDomain(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const withProtocol = url.startsWith("http") ? url : `https://${url}`;
    return new URL(withProtocol).hostname.replace(/^www\./, "");
  } catch {
    return (
      url
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .split("/")[0]
        .split("?")[0] || null
    );
  }
}

// ─────────────────────────────────────────────
// Markdown-aware content renderer
// Parses **bold** and detects plain question paragraphs
// ─────────────────────────────────────────────

function parseInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-foreground">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function renderAIContent(content: string): React.ReactNode {
  // Safety: strip any JSON that leaked through (defense-in-depth against prefill edge cases).
  const safeContent = content
    // Strip markdown JSON code blocks (```json ... ```)
    .replace(/```(?:json)?\s*[\s\S]*?```/g, "")
    // Strip raw JSON objects containing isComplete
    .replace(/\{[\s\S]*?"isComplete"\s*:\s*(true|false)[\s\S]*?\}/g, "")
    .trim() || content;

  const paragraphs = safeContent.split("\n\n");
  return paragraphs.map((para, i) => {
    const hasMarkdown = para.includes("**");
    const isPlainQuestion = !hasMarkdown && para.trimEnd().endsWith("?");
    return (
      // whitespace-pre-line renders single \n as line breaks (for option lists)
      <p
        key={i}
        className={`leading-relaxed whitespace-pre-line ${isPlainQuestion ? "font-semibold text-foreground" : ""}`}
      >
        {isPlainQuestion ? para : parseInline(para)}
      </p>
    );
  });
}

// ─────────────────────────────────────────────
// Company logo with two-level fallback:
//   1. Clearbit (higher quality when available)
//   2. Google S2 favicon (reliable fallback)
//   3. Initials (final fallback)
// ─────────────────────────────────────────────

function CompanyLogo({
  primaryUrl,
  fallbackUrl,
  companyName,
  initials,
}: {
  primaryUrl: string;
  fallbackUrl: string;
  companyName: string;
  initials: string;
}) {
  const [src, setSrc] = useState(primaryUrl);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <span className="text-base font-bold text-primary">{initials}</span>;
  }

  return (
    <img
      src={src}
      alt={companyName}
      className="w-11 h-11 object-contain"
      onError={() => {
        if (src === primaryUrl && fallbackUrl) {
          setSrc(fallbackUrl);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}

// ─────────────────────────────────────────────
// Company profile panel — sticky right sidebar
// ─────────────────────────────────────────────

function CompanyProfilePanel({
  fields,
  enrichment,
}: {
  fields: Fields;
  enrichment: EnrichedCompanyData | null;
}) {
  const userName = (fields.userName as string) || "";
  const userRole = (fields.userRole as string) || "";
  const companyName = (fields.companyName as string) || "";
  const companyWebsite = fields.companyWebsite as string | undefined;

  // Use explicit website first; fall back to auto-discovered URL from enrichment
  const domain =
    extractDomain(companyWebsite) ??
    (enrichment?.discoveredWebsite ? extractDomain(enrichment.discoveredWebsite) : null);
  // Two-level logo fallback: Clearbit (high quality) → Google S2 favicon (reliable)
  const clearbitUrl = domain ? `https://logo.clearbit.com/${domain}` : null;
  const googleFaviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : null;

  const companyInitials = companyName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase() ?? "")
    .join("");

  const userInitials = userName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase() ?? "")
    .join("");

  const fieldEntries = Object.entries(FIELD_LABELS)
    .filter(([key]) => fields[key])
    .map(([key, label]) => ({ label, value: String(fields[key]) }));

  return (
    <div className="space-y-3">
      {/* User card — shows when name is known */}
      {userName && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            {/* User avatar */}
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary">{userInitials}</span>
            </div>
            {/* Name + role */}
            <div className="min-w-0">
              <p className="font-semibold text-foreground text-sm leading-tight truncate">
                {userName}
              </p>
              {userRole && (
                <p className="text-xs text-muted-foreground truncate mt-0.5">{userRole}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Company header card — shows when company is known */}
      {companyName && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="flex items-center gap-3 mb-3">
            {/* Logo / initials */}
            <div className="w-12 h-12 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
              {clearbitUrl && googleFaviconUrl ? (
                <CompanyLogo
                  primaryUrl={clearbitUrl}
                  fallbackUrl={googleFaviconUrl}
                  companyName={companyName}
                  initials={companyInitials}
                />
              ) : (
                <span className="text-base font-bold text-primary">{companyInitials}</span>
              )}
            </div>

            {/* Name + domain */}
            <div className="min-w-0">
              <p className="font-semibold text-foreground text-sm leading-tight truncate">
                {companyName}
              </p>
              {domain && (
                <p className="text-xs text-muted-foreground truncate mt-0.5">{domain}</p>
              )}
            </div>
          </div>

          {/* Description from enrichment */}
          {enrichment?.description && (
            <div className="border-t border-slate-100 pt-3 space-y-1.5">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {enrichment.description}
              </p>
              {enrichment.confidence !== "high" && (
                <p className="text-[10px] text-amber-600 leading-snug">
                  Not sure this is right? Drop your website URL in the chat and I&apos;ll re-check.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Collected fields */}
      {fieldEntries.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Profile so far
          </p>
          <div className="space-y-3">
            {fieldEntries.map(({ label, value }) => (
              <div key={label}>
                <p className="text-[11px] text-muted-foreground mb-0.5">{label}</p>
                <p className="text-sm font-medium text-foreground leading-snug">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Chat header — logo + title only (banner lives in sticky right panel)
// ─────────────────────────────────────────────

function ChatHeader({ extractedFields }: { extractedFields: Fields }) {
  const companyName = extractedFields.companyName as string | undefined;

  return (
    <div className="mb-8 text-center space-y-1">
      <div className="flex items-center justify-center gap-2.5 mb-3">
        <LogoMark size="md" />
        <span className="text-base font-bold text-foreground tracking-tight">CX Mate</span>
      </div>
      <h1 className="text-2xl font-bold text-foreground tracking-tight">
        {companyName
          ? `Building ${companyName}'s CX playbook`
          : "Let's build your CX playbook"}
      </h1>
      <p className="text-sm text-muted-foreground">
        A 5-minute conversation that replaces hours of CX strategy work
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// Heads-up banner — lives in the sticky right panel, always visible
// ─────────────────────────────────────────────

function HeadsUpBanner({
  greeting,
  stageMsg,
}: {
  greeting: string | null;
  stageMsg: StageMessage;
}) {
  return (
    <div className="bg-primary/5 border border-primary/15 rounded-2xl px-4 py-4 flex gap-3 items-start animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="shrink-0 mt-0.5">
        <LogoMark size="sm" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5">
          {greeting ? `Heads up, ${greeting}` : "Heads up"}
        </p>
        <p className="text-sm font-semibold text-foreground leading-snug mb-1">
          {stageMsg.headline}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {stageMsg.body}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Suggestion chips — multi-select shortcuts for open-ended questions
// Tap to toggle; selected chips are sent together on submit
// ─────────────────────────────────────────────

function SuggestionChips({
  chips,
  selected,
  onToggle,
  disabled,
}: {
  chips: string[];
  selected: string[];
  onToggle: (chip: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => {
        const isSelected = selected.includes(chip);
        return (
          <button
            key={chip}
            type="button"
            disabled={disabled}
            onClick={() => onToggle(chip)}
            className={`text-sm font-medium px-4 py-2 rounded-2xl border-2 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed ${
              isSelected
                ? "bg-primary text-primary-foreground border-primary shadow-sm scale-[1.02]"
                : "border-primary/30 bg-white text-primary hover:bg-primary/10 hover:border-primary/60 shadow-sm"
            }`}
          >
            {chip}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// Insight bubble — subtle contextual nudge (inline, doesn't interrupt flow)
// ─────────────────────────────────────────────

function InsightBubble({ content }: { content: string }) {
  return (
    <div className="ml-12 mb-4 max-w-[85%]">
      <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl px-4 py-3 flex gap-3 items-start shadow-sm">
        <div className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
          <Sparkle size={14} className="text-amber-500" weight="fill" />
        </div>
        <p className="text-[13px] text-amber-900/90 leading-relaxed">{content}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Typing indicator
// ─────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex gap-3.5 mb-6">
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
        <LogoMark size="md" className="shadow-sm" />
      </div>
      <div className="bg-gradient-to-br from-white to-secondary/40 rounded-2xl rounded-tl-sm px-5 py-4 border border-border/50 shadow-sm flex items-center gap-1.5">
        <span
          className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce"
          style={{ animationDelay: "160ms" }}
        />
        <span
          className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce"
          style={{ animationDelay: "320ms" }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Generating Experience
// (mirrors onboarding-wizard.tsx — kept in sync manually)
// ─────────────────────────────────────────────

function GeneratingExperience({ companyName }: { companyName: string }) {
  const [phase, setPhase] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const name = companyName || "your company";

  const phases = [
    {
      title: "Reading your company profile",
      detail: `Cross-referencing ${name}'s stage, vertical, and business model against B2B benchmarks`,
    },
    {
      title: "Mapping the full lifecycle",
      detail: "Building a full lifecycle journey: every stage, every handoff, every risk",
    },
    {
      title: "Scoring meaningful moments",
      detail: "Identifying the 10-15 interactions where customers decide to stay or leave",
    },
    {
      title: "Running risk analysis",
      detail: `Calculating revenue at risk based on ${name}'s real numbers, not guesswork`,
    },
    {
      title: "Writing your CX intelligence report",
      detail: "Surfacing the patterns your team won't tell you about, backed by data",
    },
    {
      title: "Building your action playbook",
      detail: "Every insight becomes a prioritized action with templates, timelines, and owners",
    },
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
          Building {name}&apos;s CX playbook
        </h2>
        <p className="text-sm text-slate-500">
          A certified CX expert needs 3-4 hours for this.{" "}
          <span className="font-medium text-primary">You&apos;ll have it in minutes.</span>
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
            <div
              key={i}
              className={`flex items-start gap-3 transition-all duration-500 ${
                isDone || isActive ? "opacity-100" : "opacity-30"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-slate-500"
                      fill="none"
                      viewBox="0 0 12 12"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
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
                <p
                  className={`text-sm font-medium leading-snug ${
                    isDone ? "text-slate-400" : isActive ? "text-slate-800" : "text-slate-400"
                  }`}
                >
                  {p.title}
                </p>
                {isActive && (
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{p.detail}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────

export function OnboardingChat() {
  const router = useRouter();

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: OPENING_MESSAGE },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  // Extracted fields — grows as conversation proceeds
  const [extractedFields, setExtractedFields] = useState<Fields>({});

  // Generation state
  const [pendingFields, setPendingFields] = useState<Fields | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Voice input state
  const [isListening, setIsListening] = useState(false);
  const [supportsVoice, setSupportsVoice] = useState(false);

  // Multi-select chip state — cleared when AI replies
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const toggleChip = useCallback((chip: string) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  }, []);

  // Refs
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enrichmentRef = useRef<EnrichedCompanyData | null>(null);
  const insightsShown = useRef<Set<string>>(new Set());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Enrichment hook
  const { enrichment, enrich } = useCompanyEnrichment();

  // Keep enrichmentRef in sync
  useEffect(() => {
    enrichmentRef.current = enrichment;
  }, [enrichment]);

  // Detect voice support on mount
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    setSupportsVoice(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
  }, []);

  // Voice input toggle
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
      setInputValue(transcript);
      // Auto-resize textarea after fill
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.style.height = "auto";
          inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
          inputRef.current.focus();
        }
      }, 0);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  }, [isListening]);

  // Auto-scroll to bottom of message container
  // Use rAF to ensure scroll happens after layout reflow (prevents scroll-up on enrichment panel changes)
  useEffect(() => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  }, [messages, isThinking]);

  // Clear chip selection when AI replies (chips for a new question appear fresh)
  useEffect(() => {
    setSelectedChips([]);
  }, [messages.length]);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Side effect: fire enrichment when company name or website changes
  // Key = name|website so we re-enrich when the website is provided later
  // (first pass might get the wrong company if name is ambiguous — website disambiguates)
  const lastEnrichedKey = useRef("");
  useEffect(() => {
    const companyName = extractedFields.companyName as string | undefined;
    const companyWebsite = extractedFields.companyWebsite as string | undefined;
    if (!companyName) return;
    const key = `${companyName.toLowerCase().trim()}|${(companyWebsite || "").toLowerCase().trim()}`;
    if (key === lastEnrichedKey.current) return;
    lastEnrichedKey.current = key;
    enrich(companyName, companyWebsite);
  }, [extractedFields.companyName, extractedFields.companyWebsite, enrich]);

  // Side effect: apply officialCompanyName from enrichment back to extractedFields.
  // When the user types an ambiguous name (e.g. "orca ai"), enrichment auto-discovers
  // a domain and returns the canonical name from the website (e.g. "Orca Security").
  // This keeps the panel header, chat title, and journey generation all consistent.
  useEffect(() => {
    const officialName = enrichment?.officialCompanyName;
    if (!officialName) return;
    setExtractedFields((prev) => {
      const current = (prev.companyName as string | undefined) ?? "";
      // Only update if different (case-insensitive) — avoids unnecessary re-renders
      if (current.toLowerCase().trim() === officialName.toLowerCase().trim()) return prev;
      return { ...prev, companyName: officialName };
    });
  }, [enrichment?.officialCompanyName]);

  // Side effect: identify user + send magic link when email extracted
  const emailSentRef = useRef(false);
  useEffect(() => {
    const userEmail = extractedFields.userEmail as string | undefined;
    const userName = extractedFields.userName as string | undefined;
    const companyName = extractedFields.companyName as string | undefined;
    if (userEmail && !emailSentRef.current) {
      emailSentRef.current = true;
      identify(userEmail, { name: userName, company: companyName });
      const supabase = createClient();
      supabase.auth
        .signInWithOtp({
          email: userEmail,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?redirect=/analysis`,
            shouldCreateUser: true,
            data: { company_name: companyName, name: userName },
          },
        })
        .catch(() => {
          /* never block onboarding for auth */
        });
    }
  }, [extractedFields.userEmail, extractedFields.userName, extractedFields.companyName]);

  // ── Journey generation ────────────────────────────────────────────────
  const startGeneration = useCallback(
    async (fields: Fields, retryCount = 0) => {
      setIsGenerating(true);
      setSubmitError(null);
      const generationStart = Date.now();

      try {
        const controller = new AbortController();
        abortRef.current = controller;
        timeoutRef.current = setTimeout(
          () => controller.abort("Request timed out"),
          240_000
        );

        const submitData = enrichmentRef.current
          ? { ...fields, enrichmentData: enrichmentRef.current }
          : fields;

        track("journey_generation_started", {
          maturity: fields.companyMaturity,
          journey_type: fields.journeyType,
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
          throw new Error(
            errorBody?.details || "Failed to generate journey. Please try again."
          );
        }

        const result = await response.json();
        const durationSeconds = Math.round((Date.now() - generationStart) / 1000);

        track("journey_generation_succeeded", {
          duration_seconds: durationSeconds,
          template_id: result.templateId ?? "",
        });
        notifyOwner("journey_generation_succeeded", {
          email: fields.userEmail,
          companyName: fields.companyName,
          details: `Chat onboarding — ${result.journey?.stages?.length ?? "?"} stages in ${durationSeconds}s`,
        });

        sessionStorage.setItem("cx-mate-journey", JSON.stringify(result));
        router.push(`/analysis?id=${result.templateId}`);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          const isTimeout = abortRef.current?.signal?.reason === "Request timed out";
          if (isTimeout && retryCount < 1) {
            track("journey_generation_retried");
            startGeneration(fields, retryCount + 1);
            return;
          }
          track("journey_generation_failed", {
            error_type: "timeout",
            retry_count: retryCount,
          });
          setSubmitError(
            "Generation took a bit longer than usual. Your answers are saved. Click Retry."
          );
          setIsGenerating(false);
          return;
        }
        track("journey_generation_failed", {
          error_type: "api_error",
          retry_count: retryCount,
        });
        setSubmitError(
          error instanceof Error ? error.message : "Something went wrong. Please retry."
        );
        setIsGenerating(false);
      }
    },
    [router]
  );

  // Trigger generation 1.2s after conversation completes
  useEffect(() => {
    if (!pendingFields) return;
    const timer = setTimeout(() => {
      startGeneration(pendingFields);
      setPendingFields(null);
    }, 1200);
    return () => clearTimeout(timer);
  }, [pendingFields, startGeneration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // ── Send message ──────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isThinking) return;

      const userMsg: ChatMessage = { role: "user", content: trimmed };

      // Only pass user/assistant messages to the API
      const apiMessages = [...messages, userMsg].filter(
        (m): m is { role: "user" | "assistant"; content: string } =>
          m.role === "user" || m.role === "assistant"
      );

      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setIsThinking(true);

      try {
        const res = await fetch("/api/onboarding/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: apiMessages,
            extractedFields,
            enrichmentData: enrichmentRef.current,
          }),
        });

        if (!res.ok) throw new Error("Failed to get response");

        const data = await res.json();

        // Merge extracted fields + apply maturity-derived fields
        const prevFields: Fields = { ...extractedFields };
        const newFields: Fields = { ...data.extractedFields };
        if (newFields.companyMaturity) {
          const derived = deriveFromMaturity(newFields.companyMaturity);
          Object.assign(newFields, derived);
        }
        setExtractedFields(newFields);

        // ── Build inline insight bubbles (dynamic, context-aware) ─────
        const extras: ChatMessage[] = [];

        Object.entries(FIELD_INSIGHT_BUILDERS).forEach(([fieldKey, builder]) => {
          if (insightsShown.current.has(fieldKey)) return;
          if (!newFields[fieldKey] || prevFields[fieldKey]) return;
          const content = builder(newFields, enrichmentRef.current);
          if (!content) return;
          insightsShown.current.add(fieldKey);
          extras.push({ role: "insight", content });
        });

        // Add AI reply + any insight bubbles
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
          ...extras,
        ]);

        // Track
        track("onboarding_chat_message", {
          turn: apiMessages.filter((m) => m.role === "user").length,
          is_complete: data.isComplete,
          company: newFields.companyName,
        });

        // Trigger generation if complete
        if (data.isComplete) {
          setPendingFields(newFields);
          track("onboarding_chat_completed", { company: newFields.companyName });
          notifyOwner("onboarding_started", {
            email: newFields.userEmail,
            companyName: newFields.companyName,
          });
        }
      } catch (err) {
        console.error("[OnboardingChat] sendMessage error:", err);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, something went wrong. Could you try that again?",
          },
        ]);
      } finally {
        setIsThinking(false);
      }
    },
    [messages, extractedFields, isThinking]
  );

  const buildSendText = () => {
    const chipPart = selectedChips.length > 0 ? selectedChips.join(", ") : "";
    const typedPart = inputValue.trim();
    if (chipPart && typedPart) return `${chipPart}, ${typedPart}`;
    return chipPart || typedPart;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const text = buildSendText();
      if (text) {
        sendMessage(text);
        setSelectedChips([]);
      }
    }
  };

  // Whether to show the profile panel (appears as soon as name OR company is known)
  const hasCompanyData = !!(extractedFields.userName || extractedFields.companyName);

  // ── Banner state (computed from enrichment + conversation) ───────────
  const _companyName = extractedFields.companyName as string | undefined;
  const _userName = extractedFields.userName as string | undefined;
  const _companyMaturity = extractedFields.companyMaturity as string | undefined;
  let _stage: "early" | "growing" | "scaling" | null = null;
  if (_companyMaturity) {
    _stage = inferStageFromMaturity(_companyMaturity);
  } else if (enrichment?.suggestedCompanySize) {
    _stage = inferStageFromSize(enrichment.suggestedCompanySize);
  }
  const _hasTrustworthy = enrichment && enrichment.confidence !== "low";
  const showBanner = !!(_companyName && _stage && (_hasTrustworthy || _companyMaturity));
  const stageMsg = _stage ? buildStageMessage(_stage, enrichment) : null;
  const greeting = _userName ?? null;

  // ── Suggestion chips (based on last AI question + current field state) ─
  const lastAIMsg = [...messages].reverse().find((m) => m.role === "assistant");
  const suggestionChips =
    lastAIMsg && !isThinking && !pendingFields
      ? getSuggestionChips(lastAIMsg.content, extractedFields)
      : null;

  // ── Render: generating screen ─────────────────────────────────────────
  if (isGenerating) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <GeneratingExperience
          companyName={(extractedFields.companyName as string) || ""}
        />
        {submitError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-3">
            <p className="text-sm text-red-700">{submitError}</p>
            <Button size="sm" onClick={() => startGeneration(extractedFields)}>
              Retry
            </Button>
          </div>
        )}
      </div>
    );
  }

  // ── Render: chat ──────────────────────────────────────────────────────
  return (
    <div
      className="w-full max-w-[960px] mx-auto h-full"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 240px",
        gap: "2rem",
        alignItems: "start",
      }}
    >
      {/* ── Chat column — fixed viewport height, messages scroll inside ── */}
      <div className="min-w-0 flex flex-col" style={{ height: "calc(100dvh - 2rem)" }}>
        {/* Message list — scrolls independently, input bar sits below. Header scrolls away with messages. */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto space-y-1 pb-6 scroll-smooth">
          <ChatHeader extractedFields={extractedFields} />
          {messages.map((msg, i) => {
            // ── Insight bubble ──
            if (msg.role === "insight") {
              return <InsightBubble key={i} content={msg.content} />;
            }

            // ── AI message ──
            if (msg.role === "assistant") {
              return (
                <div key={i} className="flex gap-3.5 mb-6">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                    <LogoMark size="md" className="shadow-sm" />
                  </div>
                  <div className="bg-gradient-to-br from-white to-secondary/40 rounded-2xl rounded-tl-sm px-5 py-4 max-w-lg border border-border/50 shadow-sm">
                    <div className="text-sm leading-relaxed space-y-2 text-foreground/90">
                      {renderAIContent(msg.content)}
                    </div>
                  </div>
                </div>
              );
            }

            // ── User message ──
            return (
              <div key={i} className="flex justify-end mb-5">
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 max-w-sm shadow-sm">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            );
          })}

          {isThinking && <TypingIndicator />}

          <div ref={bottomRef} />
        </div>

        {/* Input bar — sits below the scroll area, never overlaps messages */}
        <div className="shrink-0 pb-4 pt-3">
          {/* Suggestion chips — own zone between chat and input, with real visual weight */}
          {suggestionChips && (
            <div className="mb-3">
              <SuggestionChips
                chips={suggestionChips}
                selected={selectedChips}
                onToggle={toggleChip}
                disabled={isThinking || !!pendingFields}
              />
            </div>
          )}
          <div className="bg-slate-100 rounded-2xl px-4 pt-3 pb-3">
          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Listening…" : "Type your answer…"}
              rows={1}
              disabled={isThinking || !!pendingFields}
              className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-slate-400 focus:outline-none leading-relaxed max-h-32 disabled:opacity-50"
              onInput={(e) => {
                const t = e.target as HTMLTextAreaElement;
                t.style.height = "auto";
                t.style.height = `${t.scrollHeight}px`;
              }}
            />

            {/* Mic button — only shown when browser supports it */}
            {supportsVoice && (
              <button
                type="button"
                onClick={toggleVoice}
                disabled={isThinking || !!pendingFields}
                className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                  isListening
                    ? "bg-red-100 text-red-500 animate-pulse"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-200"
                }`}
                aria-label={isListening ? "Stop listening" : "Voice input"}
              >
                <Microphone size={16} weight={isListening ? "fill" : "regular"} />
              </button>
            )}

            {/* Send button — sends chips + typed text combined */}
            <button
              onClick={() => {
                const text = buildSendText();
                if (text) {
                  sendMessage(text);
                  setSelectedChips([]);
                }
              }}
              disabled={(!inputValue.trim() && selectedChips.length === 0) || isThinking || !!pendingFields}
              className="flex-shrink-0 w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Send"
            >
              {isThinking ? (
                <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowRight size={16} weight="bold" />
              )}
            </button>
          </div>
          </div>{/* end gray input box */}
          <p className="text-center text-[11px] text-muted-foreground mt-2">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* ── Right panel — sticky to viewport, never scrolls with chat ── */}
      <div
        className="transition-opacity duration-500 ease-out"
        style={{
          opacity: hasCompanyData ? 1 : 0,
          pointerEvents: hasCompanyData ? "auto" : "none",
          // Sticky to just below the nav header (56px = h-14)
          position: "sticky",
          top: "56px",
          alignSelf: "start",
          maxHeight: "calc(100vh - 72px)",
          overflowY: "auto",
        }}
      >
        <div className="pt-4 space-y-3 pb-6">
          {/* Heads-up banner — always at top of panel */}
          {showBanner && stageMsg && (
            <HeadsUpBanner greeting={greeting} stageMsg={stageMsg} />
          )}
          <CompanyProfilePanel fields={extractedFields} enrichment={enrichment} />
        </div>
      </div>
    </div>
  );
}
