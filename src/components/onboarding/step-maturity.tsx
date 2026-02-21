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
    <div className="space-y-8">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">Where are you on your journey?</h2>
      <ChatBubble>
        <p>This drives everything I&apos;ll build for you, so pick what fits best.</p>
      </ChatBubble>

      <div className="grid gap-3">
        {MATURITY_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleSelect(option.value)}
            className={`flex items-start gap-4 rounded-2xl border-2 p-5 cursor-pointer transition-all text-left ${
              data.companyMaturity === option.value
                ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20"
                : "border-border/50 hover:border-border hover:shadow-sm bg-white"
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              data.companyMaturity === option.value
                ? "bg-primary/15"
                : "bg-primary/8"
            }`}>
              <span className="text-2xl">{option.emoji}</span>
            </div>
            <div className="space-y-1">
              <div className="font-bold text-sm text-foreground">{option.label}</div>
              <div className="text-sm text-muted-foreground leading-relaxed">
                {option.subtitle}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
