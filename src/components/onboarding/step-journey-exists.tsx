"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { JOURNEY_EXISTS_OPTIONS, type OnboardingData } from "@/types/onboarding";
import { ChatBubble } from "./chat-bubble";

interface StepJourneyExistsProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}

export function StepJourneyExists({ data, onChange }: StepJourneyExistsProps) {
  return (
    <div className="space-y-6">
      <ChatBubble>
        <p>
          At your stage, many companies have some kind of customer journey mapped out
          — even if it&apos;s just in someone&apos;s head or a Notion doc.
        </p>
        <p><strong>Do you have an existing journey or CX process?</strong></p>
      </ChatBubble>

      <div className="grid gap-3">
        {JOURNEY_EXISTS_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange({ hasExistingJourney: option.value })}
            className={`flex flex-col gap-1 rounded-xl border p-4 cursor-pointer transition-all text-left hover:shadow-sm ${
              data.hasExistingJourney === option.value
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:bg-accent/50"
            }`}
          >
            <div className="font-medium text-sm">{option.label}</div>
            <div className="text-xs text-muted-foreground">{option.description}</div>
          </button>
        ))}
      </div>

      {data.hasExistingJourney === "yes" && (
        <div className="space-y-2">
          <Label htmlFor="existingJourneyDesc">
            Tell me about it — what does it look like?
          </Label>
          <Textarea
            id="existingJourneyDesc"
            placeholder="e.g. We have a Notion doc with our onboarding steps, and a rough sales pipeline in HubSpot..."
            value={data.existingJourneyDescription || ""}
            onChange={(e) => onChange({ existingJourneyDescription: e.target.value })}
            rows={3}
          />
        </div>
      )}
    </div>
  );
}
