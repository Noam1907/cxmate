"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  GOAL_OPTIONS,
  TIMEFRAME_OPTIONS,
  type OnboardingData,
} from "@/types/onboarding";

interface StepGoalsProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}

export function StepGoals({ data, onChange }: StepGoalsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">What does success look like?</h2>
        <p className="text-muted-foreground mt-1">
          This helps us focus your journey map and recommendations on what
          matters most.
        </p>
      </div>

      {/* Primary Goal */}
      <div className="space-y-3">
        <Label>What&apos;s your #1 goal?</Label>
        <RadioGroup
          value={data.primaryGoal}
          onValueChange={(value) => onChange({ primaryGoal: value })}
          className="grid grid-cols-1 sm:grid-cols-2 gap-2"
        >
          {GOAL_OPTIONS.map((goal) => (
            <label
              key={goal.value}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors hover:bg-accent/50 ${
                data.primaryGoal === goal.value
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
            >
              <RadioGroupItem value={goal.value} />
              <span className="text-sm">{goal.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Timeframe */}
      <div className="space-y-3">
        <Label>When do you want to see results?</Label>
        <RadioGroup
          value={data.timeframe}
          onValueChange={(value) => onChange({ timeframe: value })}
          className="flex flex-wrap gap-2"
        >
          {TIMEFRAME_OPTIONS.map((tf) => (
            <label
              key={tf.value}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 cursor-pointer transition-colors hover:bg-accent/50 ${
                data.timeframe === tf.value
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
            >
              <RadioGroupItem value={tf.value} />
              <span className="text-sm">{tf.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Additional Context */}
      <div className="space-y-2">
        <Label htmlFor="additionalContext">
          Anything else we should know? (optional)
        </Label>
        <Textarea
          id="additionalContext"
          placeholder="e.g. We just hired a Head of CS and want to give them a clear starting point..."
          value={data.additionalContext || ""}
          onChange={(e) => onChange({ additionalContext: e.target.value })}
          rows={3}
        />
      </div>
    </div>
  );
}
