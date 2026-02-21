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
import type { EnrichedCompanyData } from "@/types/enrichment";

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

  // Journey exists question — only for growing/scaling
  if (data.companyMaturity === "growing" || data.companyMaturity === "scaling") {
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
    <div className="space-y-6">
      <ChatBubble>
        <p>
          {data.userName ? `${data.userName}, ` : ""}I&apos;ve got everything I need.
          {" "}Here&apos;s what I&apos;m about to build for <strong>{data.companyName || "you"}</strong>:
        </p>
      </ChatBubble>

      <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-5 space-y-4">
        <div className="flex items-start gap-3">
          <span className="text-lg mt-0.5">🗺️</span>
          <div>
            <div className="font-medium text-sm">End-to-end {journeyLabel} journey map</div>
            <div className="text-xs text-muted-foreground">Every stage your customer goes through — mapped to your specific business</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-lg mt-0.5">⚡</span>
          <div>
            <div className="font-medium text-sm">Meaningful moments analysis</div>
            <div className="text-xs text-muted-foreground">The make-or-break interactions that determine whether customers stay or leave</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-lg mt-0.5">🎯</span>
          <div>
            <div className="font-medium text-sm">Priority focus areas</div>
            <div className="text-xs text-muted-foreground">Where to invest your time first for maximum impact — based on your pains and goals</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-lg mt-0.5">📋</span>
          <div>
            <div className="font-medium text-sm">Ready-to-use playbook with templates</div>
            <div className="text-xs text-muted-foreground">Actionable recommendations your team can start executing this week</div>
          </div>
        </div>
      </div>

      <ChatBubble>
        <p>
          I&apos;m going to analyze {data.companyName || "your company"} against patterns from
          {" "}<strong>thousands of B2B companies</strong> at your stage. This is where my CCXP expertise meets real data.
        </p>
      </ChatBubble>

      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={onSubmit}
          className="rounded-xl shadow-md hover:shadow-lg transition-all px-8 py-3 text-base"
        >
          Build My CX Playbook →
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
    {
      icon: "🔍",
      title: "Analyzing your company profile",
      detail: `Looking at ${data.companyName || "your company"}'s stage, customers, and business model`,
      insight: "Every company has a unique CX fingerprint — I'm identifying yours",
    },
    {
      icon: "🗺️",
      title: "Mapping your journey stages",
      detail: `Building a ${data.companyMaturity === "pre_launch" ? "sales" : "full lifecycle"} journey map tailored to your vertical`,
      insight: "I'm using frameworks trusted by Fortune 500 CX teams, adapted for your stage",
    },
    {
      icon: "⚡",
      title: "Identifying meaningful moments",
      detail: "Finding the interactions that make or break customer relationships",
      insight: "Most companies focus on the wrong touchpoints — I'll show you where the real leverage is",
    },
    {
      icon: "📊",
      title: "Scoring priorities and building recommendations",
      detail: "Connecting your pains to specific, actionable improvements",
      insight: "Every recommendation comes with a clear first step you can take this week",
    },
    {
      icon: "📋",
      title: "Assembling your personalized playbook",
      detail: "Pulling together templates, metrics, and an implementation plan",
      insight: "This isn't generic advice — it's built specifically for your situation",
    },
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

  const currentPhase = phases[phase];
  const progress = Math.min((seconds / 120) * 100, 95); // Cap at 95% until done

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="text-4xl mb-3">✨</div>
        <h2 className="text-xl font-bold text-foreground">
          Building your CX playbook
        </h2>
        <p className="text-sm text-muted-foreground">
          This takes about 2 minutes — your CCXP expert is doing deep analysis
        </p>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>{Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, "0")} elapsed</span>
          <span>~2 min total</span>
        </div>
      </div>

      {/* Current phase card */}
      <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-5 space-y-3 transition-all duration-500">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{currentPhase.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-foreground">{currentPhase.title}</span>
              <span className="inline-block w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{currentPhase.detail}</p>
          </div>
        </div>
        <div className="border-t border-primary/10 pt-2">
          <p className="text-xs text-primary/80 italic">&ldquo;{currentPhase.insight}&rdquo;</p>
        </div>
      </div>

      {/* Completed phases */}
      {phase > 0 && (
        <div className="space-y-2">
          {phases.slice(0, phase).map((p, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="text-primary">✓</span>
              <span>{p.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* Excitement / what they'll get */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <p className="text-xs font-medium text-foreground">💡 While you wait...</p>
        <p className="text-xs text-muted-foreground">
          {data.companyMaturity === "pre_launch"
            ? "Companies that map their sales journey before launch close their first deals 2x faster on average."
            : data.companyMaturity === "first_customers"
            ? "Early-stage companies that formalize their CX playbook see 40% higher retention in the first year."
            : data.companyMaturity === "growing"
            ? "Growing companies that prioritize the right CX moments reduce churn by up to 30% within a quarter."
            : "Companies at scale that unify their customer journey see 2x improvement in expansion revenue."
          }
        </p>
      </div>
    </div>
  );
}

// ============================================
// Main Wizard
// ============================================

export function OnboardingWizard() {
  const router = useRouter();
  const profileContext = useCompanyProfile();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [enrichmentApplied, setEnrichmentApplied] = useState(false);

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

  // Clamp step to valid range — must be in useEffect, not during render
  useEffect(() => {
    if (safeStep !== step) {
      setStep(safeStep);
    }
  }, [safeStep, step]);

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
      sessionStorage.setItem("cx-mate-journey", JSON.stringify(result));
      // Push generated journey to sidebar context
      profileContext.setJourney(result.journey);
      profileContext.setTemplateId(result.templateId);
      router.push(`/confrontation?id=${result.templateId}`);
    } catch (error) {
      // Ignore abort errors from unmount/navigation
      if (error instanceof DOMException && error.name === "AbortError") {
        const isTimeout = abortRef.current?.signal?.reason === "Request timed out";
        if (isTimeout) {
          // Auto-retry once on timeout
          if (retryCount < 1) {
            console.log("Generation timed out, retrying...");
            handleSubmit(retryCount + 1);
            return;
          }
          setSubmitError("Generation is taking longer than expected. Please try again — it usually works on the second attempt.");
          setIsSubmitting(false);
        }
        // Otherwise it's a navigation abort — ignore
        return;
      }
      console.error("Onboarding error:", error);
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

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress bar with step labels */}
      <div className="mb-10">
        <div className="flex justify-center gap-1.5 mb-3">
          {steps.map((s, i) => (
            <div
              key={s.key}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i < safeStep ? "bg-primary" : i === safeStep ? "bg-primary" : "bg-primary/15"
              } ${i === safeStep ? "w-10" : "w-3"}`}
            />
          ))}
        </div>
        {currentStep && currentStep.key !== "generate" && (
          <p className="text-center text-xs text-muted-foreground font-medium">
            Step {safeStep + 1} of {totalSteps} &middot; {currentStep.label}
          </p>
        )}
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep && renderStep(currentStep.key, data, handleChange, handleSubmit, isSubmitting, enrichment, isEnriching)}
      </div>

      {/* Error message with retry */}
      {submitError && (
        <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 space-y-3">
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

      {/* Navigation — subtle */}
      {currentStep?.key !== "generate" && (
        <div className="flex justify-between mt-8 pt-6 border-t border-border/50">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 0}
            className="text-muted-foreground hover:text-foreground"
          >
            &larr; Back
          </Button>

          <Button onClick={handleNext} disabled={!canContinue} className="rounded-xl px-6 shadow-sm">
            Continue &rarr;
          </Button>
        </div>
      )}

      {/* Back button on generate step */}
      {currentStep?.key === "generate" && !isSubmitting && (
        <div className="mt-8 pt-6 border-t border-border/50">
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
