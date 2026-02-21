"use client";

import { MATURITY_OPTIONS, deriveFromMaturity, type OnboardingData, type CompanyMaturity } from "@/types/onboarding";
import { ChatBubble } from "./chat-bubble";

interface StepMaturityProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}

export function StepMaturity({ data, onChange }: StepMaturityProps) {
  const handleSelect = (maturity: CompanyMaturity) => {
    const derived = deriveFromMaturity(maturity);
    onChange({
      companyMaturity: maturity,
      // Reset pain points and goals when maturity changes
      painPoints: [],
      primaryGoal: "",
      // Clear journey existence when not applicable
      hasExistingJourney: (maturity === "growing" || maturity === "scaling") ? data.hasExistingJourney : "",
      existingJourneyDescription: "",
      ...derived,
    });
  };

  return (
    <div className="space-y-6">
      <ChatBubble>
        <p>Now the big question — <strong>where are you on your customer journey?</strong></p>
        <p>This drives everything I&apos;ll build for you, so pick what fits best.</p>
      </ChatBubble>

      <div className="grid gap-4">
        {MATURITY_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleSelect(option.value)}
            className={`flex items-start gap-5 rounded-xl border p-6 cursor-pointer transition-all text-left hover:shadow-sm ${
              data.companyMaturity === option.value
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:bg-accent/50"
            }`}
          >
            <span className="text-4xl mt-0.5">{option.emoji}</span>
            <div className="space-y-1">
              <div className="font-semibold text-base">{option.label}</div>
              <div className="text-sm text-muted-foreground">
                {option.subtitle}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
