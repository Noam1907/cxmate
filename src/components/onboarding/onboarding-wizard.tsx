"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StepCompany } from "./step-company";
import { StepJourneyType } from "./step-journey-type";
import { StepCustomerProfile } from "./step-customer-profile";
import { StepPainPoints } from "./step-pain-points";
import { StepGoals } from "./step-goals";
import type { OnboardingData } from "@/types/onboarding";

const TOTAL_STEPS = 5;

const STEP_LABELS = [
  "Company",
  "Journey Type",
  "Customers",
  "Challenges",
  "Goals",
];

const initialData: OnboardingData = {
  companyName: "",
  vertical: "",
  companySize: "",
  journeyType: "customer",
  customerDescription: "",
  customerSize: "",
  mainChannel: "",
  biggestChallenge: "",
  painPoints: [],
  primaryGoal: "",
  timeframe: "",
};

function canProceed(step: number, data: OnboardingData): boolean {
  switch (step) {
    case 0:
      return !!(data.companyName && data.vertical && data.companySize);
    case 1:
      return !!data.journeyType;
    case 2:
      return !!(
        data.customerDescription &&
        data.customerSize &&
        data.mainChannel
      );
    case 3:
      return !!(data.biggestChallenge && data.painPoints.length > 0);
    case 4:
      return !!(data.primaryGoal && data.timeframe);
    default:
      return false;
  }
}

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
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
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit onboarding data");
      }

      const result = await response.json();
      // Store result for the journey page to pick up
      sessionStorage.setItem("cx-mate-journey", JSON.stringify(result));
      // Redirect to confrontation screen (the "aha moment"), then they proceed to full journey
      router.push(`/confrontation?id=${result.templateId}`);
    } catch (error) {
      console.error("Onboarding error:", error);
      // TODO: Show error toast
      setIsSubmitting(false);
    }
  };

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            Step {step + 1} of {TOTAL_STEPS}
          </span>
          <span className="text-sm font-medium">{STEP_LABELS[step]}</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2">
          {STEP_LABELS.map((label, i) => (
            <span
              key={label}
              className={`text-xs ${
                i <= step
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {step === 0 && <StepCompany data={data} onChange={handleChange} />}
        {step === 1 && <StepJourneyType data={data} onChange={handleChange} />}
        {step === 2 && (
          <StepCustomerProfile data={data} onChange={handleChange} />
        )}
        {step === 3 && <StepPainPoints data={data} onChange={handleChange} />}
        {step === 4 && <StepGoals data={data} onChange={handleChange} />}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={step === 0}
        >
          Back
        </Button>

        {step < TOTAL_STEPS - 1 ? (
          <Button
            onClick={handleNext}
            disabled={!canProceed(step, data)}
          >
            Continue
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed(step, data) || isSubmitting}
          >
            {isSubmitting ? "Generating your journey..." : "Generate My Journey"}
          </Button>
        )}
      </div>
    </div>
  );
}
