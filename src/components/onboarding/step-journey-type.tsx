"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { OnboardingData } from "@/types/onboarding";
import type { JourneyType } from "@/types/database";

interface StepJourneyTypeProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}

const JOURNEY_TYPE_OPTIONS: {
  value: JourneyType;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: "sales",
    label: "Sales Journey",
    description:
      "Map how prospects find, evaluate, and buy from you. Great if you're building or refining your sales process.",
    icon: "Target",
  },
  {
    value: "customer",
    label: "Customer Journey",
    description:
      "Map what happens after someone becomes a customer — from onboarding to advocacy. Great for reducing churn.",
    icon: "Heart",
  },
  {
    value: "full_lifecycle",
    label: "Full Lifecycle",
    description:
      "Map the complete journey from first touch to loyal advocate. Best for seeing the whole picture and fixing handoff gaps.",
    icon: "Workflow",
  },
];

export function StepJourneyType({ data, onChange }: StepJourneyTypeProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          What part of the journey do you want to map?
        </h2>
        <p className="text-muted-foreground mt-1">
          Pick what matters most right now. You can always expand later.
        </p>
      </div>

      <RadioGroup
        value={data.journeyType}
        onValueChange={(value) =>
          onChange({ journeyType: value as JourneyType })
        }
        className="grid gap-3"
      >
        {JOURNEY_TYPE_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`flex items-start gap-4 rounded-xl border p-5 cursor-pointer transition-all hover:shadow-sm ${
              data.journeyType === option.value
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border"
            }`}
          >
            <RadioGroupItem value={option.value} className="mt-1" />
            <div className="space-y-1">
              <div className="font-semibold">{option.label}</div>
              <div className="text-sm text-muted-foreground">
                {option.description}
              </div>
            </div>
          </label>
        ))}
      </RadioGroup>

      <Label className="text-xs text-muted-foreground block">
        Not sure? Start with &quot;Customer Journey&quot; — it&apos;s the most
        common starting point and you can add sales stages later.
      </Label>
    </div>
  );
}
