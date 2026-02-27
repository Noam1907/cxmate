"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StepWelcome } from "./step-welcome";
import { StepCompany } from "./step-company";
import { StepMaturity } from "./step-maturity";
import { StepJourneyExists } from "./step-journey-exists";
import { StepCustomerProfile } from "./step-customer-profile";
import { StepBusinessData } from "./step-business-data";
import { StepPainPoints } from "./step-pain-points";
import { StepGoals } from "./step-goals";
import { StepCompetitors } from "./step-competitors";
import { ChatBubble } from "./chat-bubble";
import { deriveFromMaturity, type OnboardingData } from "@/types/onboarding";
import { useCompanyProfile } from "@/contexts/company-profile-context";
import { useCompanyEnrichment } from "@/hooks/use-company-enrichment";
import { useOnboardingAutosave, loadOnboardingDraft, clearOnboardingDraft } from "@/hooks/use-onboarding-autosave";
import type { EnrichedCompanyData } from "@/types/enrichment";
import { track } from "@/lib/analytics";

type StepKey =
  | "welcome"
  | "company"
  | "maturity"
  | "journey_exists"
  | "customer_profile"
  | "competitors"
  | "business_data"
  | "pain_points"
  | "goals"
  | "generate";

interface StepDef {
  key: StepKey;
  label: string;
}

const validationMap: Record<StepKey, (data: OnboardingData) => boolean> = {
  welcome: (d) => !!d.companyName,
  company: (d) => !!(d.vertical && d.companySize),
  maturity: (d) => !!d.companyMaturity,
  journey_exists: (d) => !!d.hasExistingJourney,
  customer_profile: (d) => !!(d.customerDescription && d.customerSize && d.mainChannel),
  competitors: () => true, // Optional step — always valid
  business_data: (d) => !!(d.pricingModel && d.roughRevenue && d.averageDealSize),
  pain_points: (d) => !!(d.biggestChallenge && d.painPoints.length > 0),
  goals: (d) => !!(d.primaryGoal && d.timeframe && (d.primaryGoal !== "something_else" || d.customGoal)),
  generate: () => true,
};

function buildSteps(data: OnboardingData): StepDef[] {
  const steps: StepDef[] = [
    { key: "welcome", label: "Welcome" },
    { key: "company", label: "Company" },
    { key: "maturity", label: "Stage" },
  ];

  // Journey exists question — for anyone with customers (first_customers, growing, scaling)
  if (
    data.companyMaturity === "first_customers" ||
    data.companyMaturity === "growing" ||
    data.companyMaturity === "scaling"
  ) {
    steps.push({ key: "journey_exists", label: "Journey" });
  }

  steps.push({ key: "customer_profile", label: "Customers" });
  steps.push({ key: "competitors", label: "Competitors" });

  // Business data — only for growing/scaling
  if (data.companyMaturity === "growing" || data.companyMaturity === "scaling") {
    steps.push({ key: "business_data", label: "Numbers" });
  }

  steps.push(
    { key: "pain_points", label: "Pains" },
    { key: "goals", label: "Goals" },
    { key: "generate", label: "Build" },
  );

  return steps;
}

const initialData: OnboardingData = {
  userName: "",
  userRole: "",
  companyName: "",
  companyWebsite: "",
  currentTools: "",
  vertical: "",
  companySize: "",
  companyMaturity: "" as OnboardingData["companyMaturity"],
  hasExistingJourney: "",
  existingJourneyComponents: [],
  existingJourneyDescription: "",
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
  // Derived defaults
  journeyType: "full_lifecycle",
  hasExistingCustomers: false,
  measuresNps: false,
  measuresCsat: false,
  measuresCes: false,
  npsResponseCount: "",
  hasJourneyMap: false,
  dataVsGut: "all_gut",
};

function renderStep(
  stepKey: StepKey,
  data: OnboardingData,
  onChange: (updates: Partial<OnboardingData>) => void,
  onSubmit: () => void,
  isSubmitting: boolean,
  enrichment: EnrichedCompanyData | null,
  isEnriching: boolean,
) {
  switch (stepKey) {
    case "welcome":
      return <StepWelcome data={data} onChange={onChange} />;
    case "company":
      return <StepCompany data={data} onChange={onChange} enrichment={enrichment} isEnriching={isEnriching} />;
    case "maturity":
      return <StepMaturity data={data} onChange={onChange} />;
    case "journey_exists":
      return <StepJourneyExists data={data} onChange={onChange} />;
    case "customer_profile":
      return <StepCustomerProfile data={data} onChange={onChange} enrichment={enrichment} />;
    case "competitors":
      return <StepCompetitors data={data} onChange={onChange} enrichment={enrichment} />;
    case "business_data":
      return <StepBusinessData data={data} onChange={onChange} />;
    case "pain_points":
      return <StepPainPoints data={data} onChange={onChange} />;
    case "goals":
      return <StepGoals data={data} onChange={onChange} />;
    case "generate":
      return <StepGenerate data={data} onSubmit={onSubmit} isSubmitting={isSubmitting} />;
  }
}

// ============================================
// Generate Step — The Story Conclusion
// ============================================

function StepGenerate({
  data,
  onSubmit,
  isSubmitting,
}: {
  data: OnboardingData;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  const journeyLabel = data.companyMaturity === "pre_launch"
    ? "sales"
    : "full lifecycle";

  if (isSubmitting) {
    return <GeneratingExperience data={data} />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {data.userName ? `${data.userName}, ready to build.` : "Ready to build."}
        </h2>
        <p className="text-muted-foreground mt-2">
          I&apos;ll analyze <strong>{data.companyName || "your company"}</strong> against patterns from thousands of B2B teams at your stage — then build your playbook.
        </p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-white p-6 space-y-3 shadow-sm">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">What you&apos;ll get</p>
        <ul className="space-y-2.5">
          {[
            { icon: "🗺️", label: `${journeyLabel.charAt(0).toUpperCase() + journeyLabel.slice(1)} journey map` },
            { icon: "⚡", label: "Meaningful moments — scored by impact" },
            { icon: "📊", label: "CX Intelligence Report with risk projections" },
            { icon: "📋", label: "Prioritized playbook with templates" },
          ].map((item) => (
            <li key={item.label} className="flex items-center gap-3 text-sm text-foreground">
              <span className="text-base w-5 shrink-0">{item.icon}</span>
              {item.label}
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground border-t border-border/40 pt-3 mt-1">
          Takes about 2–3 minutes. Completely personalized to your business.
        </p>
      </div>

      <div className="flex justify-center pt-2">
        <Button
          size="lg"
          onClick={onSubmit}
          className="rounded-2xl shadow-lg hover:shadow-xl transition-all px-10 py-6 text-base font-semibold"
        >
          Build My CX Playbook &rarr;
        </Button>
      </div>
    </div>
  );
}

// ============================================
// Generating Experience — Gold Time
// ============================================

function GeneratingExperience({ data }: { data: OnboardingData }) {
  const [phase, setPhase] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const phases = [
    { title: "Analyzing your company profile", detail: `Mapping ${data.companyName || "your company"}'s stage, customers, and business model` },
    { title: "Building your journey stages", detail: `Structuring a ${data.companyMaturity === "pre_launch" ? "sales" : "full lifecycle"} map tailored to your vertical` },
    { title: "Identifying meaningful moments", detail: "Finding the interactions that make or break customer relationships" },
    { title: "Scoring priorities", detail: "Connecting your pains to specific, actionable improvements" },
    { title: "Generating your intelligence report", detail: "Mapping risk areas, impact projections, and your personalised action items" },
  ];

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Phase progression — staggered timing for realism
  useEffect(() => {
    const timings = [0, 15000, 35000, 60000, 90000];
    const timeouts = timings.map((ms, i) =>
      setTimeout(() => setPhase(i), ms)
    );
    return () => timeouts.forEach(clearTimeout);
  }, []);

  const progress = Math.min((seconds / 120) * 100, 95);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 space-y-8">

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="mx-auto w-12 h-12 flex items-center justify-center">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
            <circle cx="24" cy="24" r="20" stroke="#e2e8f0" strokeWidth="2" />
            <path d="M14 24 C17 19 21 29 24 23 C27 17 31 27 34 22" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 2.5" />
            <circle cx="14" cy="24" r="2.5" fill="#cbd5e1" />
            <circle cx="24" cy="23" r="2.5" fill="#94a3b8" />
            <circle cx="34" cy="22" r="2.5" fill="#64748b" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          Building your CX intelligence
        </h2>
        <p className="text-sm text-slate-400">
          Deep analysis in progress — about 2 minutes
        </p>
      </div>

      {/* Progress bar */}
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
          <span className="text-[11px] text-slate-400">~2 min total</span>
        </div>
      </div>

      {/* Phase list */}
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
                <p className={`text-sm font-medium leading-snug ${
                  isDone ? "text-slate-400" : isActive ? "text-slate-800" : "text-slate-400"
                }`}>
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

      {/* Insight line */}
      <p className="text-xs text-slate-400 text-center leading-relaxed border-t border-slate-100 pt-5 italic">
        {data.companyMaturity === "pre_launch"
          ? "Companies that map their sales journey before launch close first deals 2× faster."
          : data.companyMaturity === "first_customers"
          ? "Early-stage teams that formalize CX see 40% higher retention in year one."
          : data.companyMaturity === "growing"
          ? "Growing companies that prioritize the right moments reduce churn by up to 30%."
          : "Unified journey mapping drives 2× improvement in expansion revenue."
        }
      </p>
    </div>
  );
}

// ============================================
// Main Wizard
// ============================================

// ============================================
// Intro Hero — Value Pitch Before Any Form
// ============================================

function IntroHero({ onStart }: { onStart: () => void }) {
  return (
    <div className="w-full max-w-2xl mx-auto text-center space-y-14 py-12">
      {/* Headline */}
      <div className="space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center mx-auto shadow-md">
          <span className="text-xl font-bold text-primary">CX</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
          Your AI CX expert is ready
        </h1>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Your customers have a journey whether you designed it or not.
          In 3 minutes, we&apos;ll map it, find what&apos;s breaking, and tell you exactly what to fix.
        </p>
      </div>

      {/* 3-Step Story Flow */}
      <div className="relative max-w-sm mx-auto text-left">
        {[
          {
            num: "01",
            accent: "bg-teal-500",
            ring: "ring-teal-500/20",
            label: "text-teal-600",
            title: "Map your journey",
            desc: "Every stage, every moment where customers decide to stay — or leave.",
          },
          {
            num: "02",
            accent: "bg-rose-500",
            ring: "ring-rose-500/20",
            label: "text-rose-600",
            title: "Find what's costing you",
            desc: "Revenue at risk, critical gaps, ranked by urgency. Backed by your numbers.",
          },
          {
            num: "03",
            accent: "bg-amber-500",
            ring: "ring-amber-500/20",
            label: "text-amber-600",
            title: "Fix it this week",
            desc: "A prioritized action plan with templates ready to execute — starting Monday.",
          },
        ].map((step, i, arr) => (
          <div key={step.num} className="flex gap-5">
            {/* Timeline spine */}
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full ${step.accent} ring-4 ${step.ring} flex items-center justify-center shrink-0 shadow-sm`}
              >
                <span className="text-white text-[11px] font-bold tracking-tight">{step.num}</span>
              </div>
              {i < arr.length - 1 && (
                <div className="w-px bg-slate-200 flex-1 my-2" />
              )}
            </div>
            {/* Content */}
            <div className={i < arr.length - 1 ? "pb-8 pt-1" : "pt-1"}>
              <div className={`text-[11px] font-semibold uppercase tracking-widest ${step.label} mb-0.5`}>
                Step {step.num}
              </div>
              <div className="font-semibold text-[15px] text-foreground leading-snug">
                {step.title}
              </div>
              <div className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {step.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="space-y-5">
        <Button
          size="lg"
          onClick={onStart}
          className="rounded-2xl px-12 py-7 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
        >
          Map my journey →
        </Button>
        <p className="text-sm text-muted-foreground">
          Takes about 3 minutes. No account needed.
        </p>
      </div>
    </div>
  );
}

export function OnboardingWizard() {
  const router = useRouter();
  const profileContext = useCompanyProfile();
  const [showIntro, setShowIntro] = useState(true);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [enrichmentApplied, setEnrichmentApplied] = useState(false);
  const [restoredDraft, setRestoredDraft] = useState(false);
  const [showRestoredBanner, setShowRestoredBanner] = useState(false);

  // Restore draft on mount (client-side only)
  useEffect(() => {
    const draft = loadOnboardingDraft();
    if (draft && !restoredDraft) {
      setData(draft.data);
      setStep(draft.step);
      setShowIntro(false); // Skip intro — go straight to where they left off
      setShowRestoredBanner(true);
      setRestoredDraft(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Company enrichment — fires once after welcome step
  const { enrichment, isEnriching, enrich } = useCompanyEnrichment();

  // Track abort controller for cleanup on unmount
  const abortRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      // Don't abort on unmount — the request may have succeeded and we're navigating
    };
  }, []);

  const steps = useMemo(() => buildSteps(data), [data.companyMaturity]);
  const totalSteps = steps.length;
  const safeStep = Math.min(step, totalSteps - 1);
  const wizardTopRef = useRef<HTMLDivElement>(null);

  // Clamp step to valid range — must be in useEffect, not during render
  useEffect(() => {
    if (safeStep !== step) {
      setStep(safeStep);
    }
  }, [safeStep, step]);

  // Scroll to top when step changes
  useEffect(() => {
    wizardTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [safeStep]);

  const currentStep = steps[safeStep];

  // Apply enrichment data once it arrives (pre-fill empty fields only)
  useEffect(() => {
    if (!enrichment || enrichmentApplied) return;
    setEnrichmentApplied(true);

    // Store enrichment in context for other components
    profileContext.setEnrichment(enrichment);

    // Pre-fill only empty fields — never override user input
    const updates: Partial<OnboardingData> = {};
    if (!data.vertical && enrichment.suggestedVertical) {
      updates.vertical = enrichment.suggestedVertical;
    }
    if (!data.companySize && enrichment.suggestedCompanySize) {
      updates.companySize = enrichment.suggestedCompanySize;
    }
    if (!data.customerSize && enrichment.suggestedCustomerSize) {
      updates.customerSize = enrichment.suggestedCustomerSize;
    }
    if (!data.mainChannel && enrichment.suggestedMainChannel) {
      updates.mainChannel = enrichment.suggestedMainChannel;
    }
    if (!data.competitors && enrichment.suggestedCompetitors?.length > 0) {
      updates.competitors = enrichment.suggestedCompetitors.join(", ");
    }

    if (Object.keys(updates).length > 0) {
      handleChange(updates);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrichment, enrichmentApplied]);

  // Autosave to localStorage — protects against accidental navigation
  useOnboardingAutosave(data, step);

  // Sync onboarding data to sidebar context via useEffect (not during render)
  useEffect(() => {
    profileContext.setOnboardingData(data);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = useCallback((updates: Partial<OnboardingData>) => {
    setData((prev) => {
      const next = { ...prev, ...updates };
      // If maturity changed, apply derived fields
      if ("companyMaturity" in updates && updates.companyMaturity) {
        const derived = deriveFromMaturity(updates.companyMaturity);
        Object.assign(next, derived);
      }
      return next;
    });
  }, []);

  const handleNext = () => {
    // Trigger enrichment when leaving the welcome step
    if (currentStep?.key === "welcome" && data.companyName) {
      enrich(data.companyName, data.companyWebsite);
    }

    // Track step completion
    if (currentStep) {
      track("onboarding_step_completed", {
        step_key: currentStep.key,
        step_number: step + 1,
        company_name: data.companyName,
      });
    }

    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((s) => s - 1);
    }
  };

  const handleSubmit = async (retryCount = 0) => {
    const generationStartTime = Date.now();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const controller = new AbortController();
      abortRef.current = controller;
      // 4 min timeout — generation takes ~2.8 min, leave headroom
      timeoutRef.current = setTimeout(() => {
        controller.abort("Request timed out");
      }, 240_000);

      // Include enrichment data if available
      const submitData = enrichment
        ? { ...data, enrichmentData: enrichment }
        : data;

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
        throw new Error(errorBody?.details || "Failed to generate journey. Please try again.");
      }

      const result = await response.json();
      track("journey_generation_succeeded", {
        duration_seconds: Math.round((Date.now() - generationStartTime) / 1000),
        template_id: result.templateId,
      });
      sessionStorage.setItem("cx-mate-journey", JSON.stringify(result));
      // Push generated journey to sidebar context
      profileContext.setJourney(result.journey);
      profileContext.setTemplateId(result.templateId);
      // Clear draft — successfully submitted, no need to restore
      clearOnboardingDraft();
      router.push(`/journey?id=${result.templateId}`);
    } catch (error) {
      // Ignore abort errors from unmount/navigation
      if (error instanceof DOMException && error.name === "AbortError") {
        const isTimeout = abortRef.current?.signal?.reason === "Request timed out";
        if (isTimeout) {
          if (retryCount < 1) {
            track("journey_generation_retried");
            handleSubmit(retryCount + 1);
            return;
          }
          track("journey_generation_failed", { error_type: "timeout", retry_count: retryCount });
          setSubmitError("Generation took a bit longer than usual. Please try again — your data is saved.");
          setIsSubmitting(false);
        }
        // Otherwise it's a navigation abort — ignore
        return;
      }
      console.error("Onboarding error:", error);
      track("journey_generation_failed", { error_type: "api_error", retry_count: retryCount });
      const message = error instanceof Error
        ? error.message
        : "Something went wrong. Please try again.";
      setSubmitError(message);
      setIsSubmitting(false);
    }
  };

  const canContinue = currentStep
    ? validationMap[currentStep.key](data)
    : false;

  // Show intro hero before any form
  if (showIntro) {
    return <IntroHero onStart={() => {
      setShowIntro(false);
      track("onboarding_started");
    }} />;
  }

  return (
    <div ref={wizardTopRef} className="w-full max-w-2xl mx-auto">
      {/* Welcome back banner — shown when draft is restored */}
      {showRestoredBanner && (
        <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 animate-in fade-in duration-300">
          <p className="text-sm text-foreground">
            <span className="font-semibold">Welcome back{data.companyName ? `, ${data.companyName}` : ""}.</span>
            {" "}Picking up where you left off.
          </p>
          <button
            type="button"
            onClick={() => {
              clearOnboardingDraft();
              setData(initialData);
              setStep(0);
              setShowRestoredBanner(false);
            }}
            className="text-xs text-muted-foreground hover:text-foreground shrink-0 underline underline-offset-2"
          >
            Start fresh
          </button>
        </div>
      )}

      {/* Progress bar with step labels */}
      {currentStep?.key !== "generate" && (
        <div className="mb-12">
          <div className="flex justify-center gap-1.5 mb-3">
            {steps.map((s, i) => (
              <div
                key={s.key}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i < safeStep ? "bg-primary" : i === safeStep ? "bg-primary" : "bg-primary/10"
                } ${i === safeStep ? "w-12" : "w-4"}`}
              />
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground font-medium">
            Step {safeStep + 1} of {totalSteps} &middot; {currentStep?.label}
          </p>
        </div>
      )}

      {/* Step Content — key-based fade on step change */}
      <div key={currentStep?.key} className="min-h-[420px] animate-in fade-in duration-300">
        {currentStep && renderStep(currentStep.key, data, handleChange, handleSubmit, isSubmitting, enrichment, isEnriching)}
      </div>

      {/* Error message with retry */}
      {submitError && (
        <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 space-y-3">
          <p className="text-sm text-red-700">{submitError}</p>
          <Button
            size="sm"
            onClick={() => handleSubmit()}
            className="rounded-lg"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Navigation */}
      {currentStep?.key !== "generate" && (
        <div className="flex justify-between mt-10 pt-6 border-t border-border/30">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 0}
            className="text-muted-foreground hover:text-foreground"
          >
            &larr; Back
          </Button>

          <Button onClick={handleNext} disabled={!canContinue} className="rounded-xl px-8 shadow-sm">
            Continue &rarr;
          </Button>
        </div>
      )}

      {/* Back button on generate step */}
      {currentStep?.key === "generate" && !isSubmitting && (
        <div className="mt-10 pt-6 border-t border-border/30">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-muted-foreground hover:text-foreground"
          >
            &larr; Back
          </Button>
        </div>
      )}
    </div>
  );
}
