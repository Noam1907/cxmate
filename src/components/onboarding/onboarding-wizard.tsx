"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StepCompany } from "./step-company";
import { StepJourneyType } from "./step-journey-type";
import { StepCustomerProfile } from "./step-customer-profile";
import { StepBusinessData } from "./step-business-data";
import { StepCxMaturity } from "./step-cx-maturity";
import { StepPainPoints } from "./step-pain-points";
import { StepGoals } from "./step-goals";
import type { OnboardingData } from "@/types/onboarding";

type StepKey =
  | "company"
  | "journey_type"
  | "customer_profile"
  | "business_data"
  | "cx_maturity"
  | "pain_points"
  | "goals";

interface StepDef {
  key: StepKey;
  label: string;
}

const validationMap: Record<StepKey, (data: OnboardingData) => boolean> = {
  company: (d) => !!(d.companyName && d.vertical && d.companySize),
  journey_type: (d) => !!d.journeyType,
  customer_profile: (d) =>
    !!(d.customerDescription && d.customerSize && d.mainChannel),
  business_data: (d) =>
    !!(d.pricingModel && d.roughRevenue && d.averageDealSize),
  cx_maturity: (d) => !!d.dataVsGut,
  pain_points: (d) => !!(d.biggestChallenge && d.painPoints.length > 0),
  goals: (d) => !!(d.primaryGoal && d.timeframe),
};

function buildSteps(hasExistingCustomers: boolean): StepDef[] {
  const steps: StepDef[] = [
    { key: "company", label: "Company" },
    { key: "journey_type", label: "Journey Type" },
    { key: "customer_profile", label: "Customers" },
  ];

  if (hasExistingCustomers) {
    steps.push({ key: "business_data", label: "Business Data" });
  }

  steps.push(
    { key: "cx_maturity", label: "CX Maturity" },
    { key: "pain_points", label: "Challenges" },
    { key: "goals", label: "Goals" }
  );

  return steps;
}

const initialData: OnboardingData = {
  companyName: "",
  vertical: "",
  companySize: "",
  journeyType: "customer",
  hasExistingCustomers: false,
  customerCount: "",
  customerDescription: "",
  customerSize: "",
  mainChannel: "",
  pricingModel: "",
  roughRevenue: "",
  averageDealSize: "",
  measuresNps: false,
  measuresCsat: false,
  measuresCes: false,
  npsResponseCount: "",
  hasJourneyMap: false,
  dataVsGut: "all_gut",
  biggestChallenge: "",
  painPoints: [],
  primaryGoal: "",
  timeframe: "",
};

function renderStep(
  stepKey: StepKey,
  data: OnboardingData,
  onChange: (updates: Partial<OnboardingData>) => void
) {
  switch (stepKey) {
    case "company":
      return <StepCompany data={data} onChange={onChange} />;
    case "journey_type":
      return <StepJourneyType data={data} onChange={onChange} />;
    case "customer_profile":
      return <StepCustomerProfile data={data} onChange={onChange} />;
    case "business_data":
      return <StepBusinessData data={data} onChange={onChange} />;
    case "cx_maturity":
      return <StepCxMaturity data={data} onChange={onChange} />;
    case "pain_points":
      return <StepPainPoints data={data} onChange={onChange} />;
    case "goals":
      return <StepGoals data={data} onChange={onChange} />;
  }
}

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const steps = useMemo(() => buildSteps(data.hasExistingCustomers), [data.hasExistingCustomers]);
  const totalSteps = steps.length;
  const currentStep = steps[step];

  const handleChange = (updates: Partial<OnboardingData>) => {
    setData((prev) => {
      const next = { ...prev, ...updates };

      // If user toggled hasExistingCustomers OFF, clamp step to avoid landing on business_data
      if (
        "hasExistingCustomers" in updates &&
        !updates.hasExistingCustomers &&
        prev.hasExistingCustomers
      ) {
        // We're on customer_profile step (index 2) — stay there
        // The next buildSteps will remove business_data, so no step adjustment needed
        // unless we were already past the customer_profile step
      }

      return next;
    });
  };

  // Clamp step if it's out of bounds after steps change
  const safeStep = Math.min(step, totalSteps - 1);
  if (safeStep !== step) {
    setStep(safeStep);
  }

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

  const progress = ((step + 1) / totalSteps) * 100;
  const canContinue = currentStep
    ? validationMap[currentStep.key](data)
    : false;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            Step {step + 1} of {totalSteps}
          </span>
          <span className="text-sm font-medium">{currentStep?.label}</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2">
          {steps.map((s, i) => (
            <span
              key={s.key}
              className={`text-xs ${
                i <= step
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep && renderStep(currentStep.key, data, handleChange)}
      </div>

      {/* Error message */}
      {submitError && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {submitError}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t">
        <Button variant="ghost" onClick={handleBack} disabled={step === 0}>
          Back
        </Button>

        {step < totalSteps - 1 ? (
          <Button onClick={handleNext} disabled={!canContinue}>
            Continue
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!canContinue || isSubmitting}
          >
            {isSubmitting
              ? "Generating your journey..."
              : "Generate My Journey"}
          </Button>
        )}
      </div>
    </div>
  );
}
