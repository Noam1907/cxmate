"use client";

import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  getGoalsForPainAndMaturity,
  GOAL_TIMEFRAME_MAP,
  TIMEFRAME_OPTIONS,
  type OnboardingData,
} from "@/types/onboarding";
import { ChatBubble } from "./chat-bubble";

interface StepGoalsProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}

export function StepGoals({ data, onChange }: StepGoalsProps) {
  const goalOptions = getGoalsForPainAndMaturity(
    data.companyMaturity,
    data.painPoints || [],
  );

  const hasRelatedGoals = goalOptions.some((g) => g.relatedToPain);

  // Auto-suggest timeframe when goal changes
  useEffect(() => {
    if (!data.primaryGoal) return;
    const suggestion = GOAL_TIMEFRAME_MAP[data.primaryGoal];
    if (suggestion && !data.timeframe) {
      onChange({ timeframe: suggestion.timeframe });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.primaryGoal]);

  const suggestedTimeframe = data.primaryGoal
    ? GOAL_TIMEFRAME_MAP[data.primaryGoal]
    : null;

  return (
    <div className="space-y-6">
      <ChatBubble>
        {hasRelatedGoals ? (
          <>
            <p>Based on the pains you mentioned — <strong>what does success look like?</strong></p>
            <p>I&apos;ve highlighted the goals most connected to your challenges. This shapes the entire playbook I&apos;ll build.</p>
          </>
        ) : (
          <>
            <p>Almost there — <strong>what does success look like for you?</strong></p>
            <p>This shapes which parts of your journey I&apos;ll focus on and what actions I&apos;ll prioritize.</p>
          </>
        )}
      </ChatBubble>

      {/* Primary Goal — Pain-Connected + Maturity-Adaptive */}
      <div className="space-y-3">
        <Label>What&apos;s your #1 goal?</Label>
        <RadioGroup
          value={data.primaryGoal}
          onValueChange={(value) => {
            const suggestion = GOAL_TIMEFRAME_MAP[value];
            onChange({
              primaryGoal: value,
              customGoal: value === "something_else" ? data.customGoal : undefined,
              // Auto-set suggested timeframe
              timeframe: suggestion?.timeframe || data.timeframe,
            });
          }}
          className="grid grid-cols-1 gap-2"
        >
          {goalOptions.map((goal) => (
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
              {goal.relatedToPain && (
                <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/8 px-2 py-0.5 rounded-full">
                  Related to your pains
                </span>
              )}
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Custom goal text input — when "Something else" is selected */}
      {data.primaryGoal === "something_else" && (
        <div className="space-y-2">
          <Label htmlFor="customGoal">Tell me what you&apos;re aiming for</Label>
          <Input
            id="customGoal"
            placeholder="e.g. Build a world-class renewal process..."
            value={data.customGoal || ""}
            onChange={(e) => onChange({ customGoal: e.target.value })}
          />
        </div>
      )}

      {/* Timeframe — CX Mate suggests, user can adjust */}
      {data.primaryGoal && suggestedTimeframe && (
        <div className="space-y-3">
          <div className="rounded-lg bg-primary/5 border border-primary/15 p-3">
            <div className="flex items-start gap-2">
              <span className="text-primary text-sm mt-0.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" clipRule="evenodd" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Based on your goal, I&apos;d plan for{" "}
                  <strong>{TIMEFRAME_OPTIONS.find((t) => t.value === suggestedTimeframe.timeframe)?.label?.toLowerCase() || suggestedTimeframe.timeframe}</strong>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {suggestedTimeframe.explanation}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Adjust if needed:</Label>
            <RadioGroup
              value={data.timeframe}
              onValueChange={(value) => onChange({ timeframe: value })}
              className="flex flex-wrap gap-2"
            >
              {TIMEFRAME_OPTIONS.map((tf) => (
                <label
                  key={tf.value}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 cursor-pointer transition-colors hover:bg-accent/50 text-xs ${
                    data.timeframe === tf.value
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <RadioGroupItem value={tf.value} className="w-3 h-3" />
                  <span>{tf.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>
        </div>
      )}

      {/* Additional Context */}
      <div className="space-y-2">
        <Label htmlFor="additionalContext">
          Anything else I should know? (optional)
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
