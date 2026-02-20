"use client";

import { useState, useMemo, useEffect } from "react";
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
  goals: (d) => !!(d.primaryGoal && d.timeframe),
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
    { key: "pain_points", label: "Challenges" },
    { key: "goals", label: "Goals" },
    { key: "generate", label: "Build" },
  );

  return steps;
}

const initialData: OnboardingData = {
  companyName: "",
  companyWebsite: "",
  vertical: "",
  companySize: "",
  companyMaturity: "" as OnboardingData["companyMaturity"],
  hasExistingJourney: "",
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
) {
  switch (stepKey) {
    case "welcome":
      return <StepWelcome data={data} onChange={onChange} />;
    case "company":
      return <StepCompany data={data} onChange={onChange} />;
    case "maturity":
      return <StepMaturity data={data} onChange={onChange} />;
    case "journey_exists":
      return <StepJourneyExists data={data} onChange={onChange} />;
    case "customer_profile":
      return <StepCustomerProfile data={data} onChange={onChange} />;
    case "competitors":
      return <StepCompetitors data={data} onChange={onChange} />;
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

  return (
    <div className="space-y-6">
      <ChatBubble>
        <p>Perfect. Here&apos;s what I&apos;m going to do for {data.companyName || "you"}:</p>
      </ChatBubble>

      <div className="space-y-3 pl-11">
        <div className="flex items-start gap-3">
          <span className="text-primary mt-0.5">&#10003;</span>
          <span className="text-sm">Map your <strong>{journeyLabel} journey</strong> end-to-end</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-primary mt-0.5">&#10003;</span>
          <span className="text-sm">Identify the <strong>meaningful moments</strong> that make or break your CX</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-primary mt-0.5">&#10003;</span>
          <span className="text-sm">Show you exactly <strong>where to focus first</strong></span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-primary mt-0.5">&#10003;</span>
          <span className="text-sm">Give you a <strong>playbook with templates</strong> you can use this week</span>
        </div>
      </div>

      <ChatBubble>
        <p>
          This takes about 2 minutes. I&apos;m analyzing your company against patterns
          from thousands of businesses at your stage.
        </p>
      </ChatBubble>

      <div className="pl-11">
        <Button
          size="lg"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Building your CX playbook..." : "Build My CX Playbook"}
        </Button>

        {isSubmitting && (
          <div className="mt-4 space-y-2">
            <LoadingMessages />
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Loading Messages Animation
// ============================================

function LoadingMessages() {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "Analyzing your company profile...",
    "Mapping your journey stages...",
    "Identifying meaningful moments...",
    "Building your personalized playbook...",
  ];

  // Cycle through messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => Math.min(prev + 1, messages.length - 1));
    }, 8000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="space-y-1">
      {messages.slice(0, messageIndex + 1).map((msg, i) => (
        <div
          key={i}
          className={`text-sm flex items-center gap-2 ${
            i === messageIndex ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {i < messageIndex ? (
            <span className="text-primary">&#10003;</span>
          ) : (
            <span className="inline-block w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}
          {msg}
        </div>
      ))}
    </div>
  );
}

// ============================================
// Main Wizard
// ============================================

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const steps = useMemo(() => buildSteps(data), [data.companyMaturity]);
  const totalSteps = steps.length;
  const safeStep = Math.min(step, totalSteps - 1);

  if (safeStep !== step) {
    setStep(safeStep);
  }

  const currentStep = steps[safeStep];

  const handleChange = (updates: Partial<OnboardingData>) => {
    setData((prev) => {
      const next = { ...prev, ...updates };
      // If maturity changed, apply derived fields
      if ("companyMaturity" in updates && updates.companyMaturity) {
        const derived = deriveFromMaturity(updates.companyMaturity);
        Object.assign(next, derived);
      }
      return next;
    });
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((s) => s - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 180_000);

      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error("Failed to generate journey. Please try again.");
      }

      const result = await response.json();
      sessionStorage.setItem("cx-mate-journey", JSON.stringify(result));
      router.push(`/confrontation?id=${result.templateId}`);
    } catch (error) {
      console.error("Onboarding error:", error);
      const message =
        error instanceof DOMException && error.name === "AbortError"
          ? "Request timed out. Please try again."
          : error instanceof Error
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
      {/* Progress — subtle dots */}
      <div className="mb-8">
        <div className="flex justify-center gap-2 mb-4">
          {steps.map((s, i) => (
            <div
              key={s.key}
              className={`h-2 rounded-full transition-all duration-300 ${
                i <= safeStep ? "bg-primary" : "bg-muted"
              } ${i === safeStep ? "w-8" : "w-2"}`}
            />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep && renderStep(currentStep.key, data, handleChange, handleSubmit, isSubmitting)}
      </div>

      {/* Error message */}
      {submitError && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {submitError}
        </div>
      )}

      {/* Navigation — subtle */}
      {currentStep?.key !== "generate" && (
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 0}
            className="text-muted-foreground"
          >
            &#8592; Back
          </Button>

          <Button onClick={handleNext} disabled={!canContinue}>
            Continue &#8594;
          </Button>
        </div>
      )}

      {/* Back button on generate step */}
      {currentStep?.key === "generate" && !isSubmitting && (
        <div className="mt-8 pt-6 border-t">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-muted-foreground"
          >
            &#8592; Back
          </Button>
        </div>
      )}
    </div>
  );
}
