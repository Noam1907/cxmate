"use client";

import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // used for timeframe
import {
  getGoalsForPainAndMaturity,
  GOAL_TIMEFRAME_MAP,
  TIMEFRAME_OPTIONS,
  type OnboardingData,
} from "@/types/onboarding";
import { ChatBubble } from "./chat-bubble";

const MAX_GOALS = 3;

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

  // All selected goals: primaryGoal + secondaryGoals
  const selectedGoals = [
    ...(data.primaryGoal ? [data.primaryGoal] : []),
    ...(data.secondaryGoals || []),
  ];

  const toggleGoal = (value: string) => {
    if (selectedGoals.includes(value)) {
      // Deselect
      const remaining = selectedGoals.filter((g) => g !== value);
      onChange({
        primaryGoal: remaining[0] || "",
        secondaryGoals: remaining.slice(1),
        customGoal: value === "something_else" ? undefined : data.customGoal,
      });
    } else {
      // Select — cap at MAX_GOALS
      if (selectedGoals.length >= MAX_GOALS) return;
      const updated = [...selectedGoals, value];
      const suggestion = GOAL_TIMEFRAME_MAP[updated[0]];
      onChange({
        primaryGoal: updated[0],
        secondaryGoals: updated.slice(1),
        timeframe: !data.timeframe && suggestion ? suggestion.timeframe : data.timeframe,
      });
    }
  };

  // Auto-suggest timeframe when primary goal changes
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
    <div className="space-y-8">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">What are your top CX goals?</h2>
      <ChatBubble>
        {hasRelatedGoals ? (
          <>
            <p>Based on the pains you mentioned{data.customPainPoint ? <>, including <strong>&ldquo;{data.customPainPoint}&rdquo;</strong></> : ""}: <strong>what does winning look like for your customer experience?</strong></p>
            <p>I&apos;ve highlighted the goals most connected to your challenges. This shapes the entire playbook I&apos;ll build.</p>
          </>
        ) : (
          <>
            <p>Almost there{data.customPainPoint ? <>. I noted your challenge: <strong>&ldquo;{data.customPainPoint}&rdquo;</strong></> : ""}! <strong>What are your top customer experience goals?</strong></p>
            <p>This shapes which parts of your journey I&apos;ll focus on and what actions I&apos;ll prioritize.</p>
          </>
        )}
      </ChatBubble>

      {/* Goals — multi-select, up to 3 */}
      <div className="rounded-2xl border border-border/60 bg-white p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-foreground">
            Pick up to {MAX_GOALS} goals
          </Label>
          {selectedGoals.length > 0 && (
            <span className="text-xs text-primary font-medium shrink-0">
              {selectedGoals.length} of {MAX_GOALS} selected
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 gap-2.5">
          {goalOptions.map((goal) => {
            const selected = selectedGoals.includes(goal.value);
            const disabled = !selected && selectedGoals.length >= MAX_GOALS;
            return (
              <button
                key={goal.value}
                type="button"
                onClick={() => toggleGoal(goal.value)}
                disabled={disabled}
                className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 cursor-pointer transition-all hover:shadow-sm text-left ${
                  selected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : disabled
                    ? "border-border/30 opacity-40 cursor-not-allowed"
                    : "border-border/50 hover:border-border"
                }`}
              >
                <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                  selected ? "border-primary bg-primary" : "border-border/60"
                }`}>
                  {selected && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium flex-1">{goal.label}</span>
                <div className="ml-auto flex items-center gap-1.5 shrink-0">
                  {goal.relatedToPain && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                      Related to your pains
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom goal text input — when "Something else" is selected */}
      {selectedGoals.includes("something_else") && (
        <div className="space-y-2">
          <Label htmlFor="customGoal" className="text-sm font-semibold text-foreground">Tell me what you&apos;re aiming for</Label>
          <Input
            id="customGoal"
            placeholder="e.g. Build a world-class renewal process..."
            value={data.customGoal || ""}
            onChange={(e) => onChange({ customGoal: e.target.value })}
            className="h-12 rounded-xl border-border/60"
          />
        </div>
      )}

      {/* Timeframe — CX Mate suggests, user can adjust */}
      {data.primaryGoal && suggestedTimeframe && (
        <div className="space-y-4">
          <div className="rounded-xl bg-primary/5 border-2 border-primary/15 p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Based on your goal, I&apos;d plan for{" "}
                  <strong>{TIMEFRAME_OPTIONS.find((t) => t.value === suggestedTimeframe.timeframe)?.label?.toLowerCase() || suggestedTimeframe.timeframe}</strong>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {suggestedTimeframe.explanation}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Adjust if needed:</Label>
            <RadioGroup
              value={data.timeframe}
              onValueChange={(value) => onChange({ timeframe: value })}
              className="flex flex-wrap gap-2"
            >
              {TIMEFRAME_OPTIONS.map((tf) => (
                <label
                  key={tf.value}
                  className={`flex items-center gap-2 rounded-xl border-2 px-3.5 py-2 cursor-pointer transition-all text-xs font-medium ${
                    data.timeframe === tf.value
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border/50 hover:border-border"
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

      {/* Additional Context — prominent open text field */}
      <div className="rounded-2xl border border-border/60 bg-white p-6 space-y-3 shadow-sm">
        <Label htmlFor="additionalContext" className="text-sm font-bold text-foreground">
          Anything else you want me to know?
        </Label>
        <p className="text-xs text-muted-foreground">
          Context, recent changes, upcoming launches, team dynamics — anything that helps me make your analysis more specific.
        </p>
        <Textarea
          id="additionalContext"
          placeholder="e.g. We just hired a Head of CS and want to give them a clear starting point... We're launching a new pricing tier next quarter... Our support team is overwhelmed..."
          value={data.additionalContext || ""}
          onChange={(e) => onChange({ additionalContext: e.target.value })}
          rows={4}
          className="rounded-xl border-border/60"
        />
      </div>
    </div>
  );
}
