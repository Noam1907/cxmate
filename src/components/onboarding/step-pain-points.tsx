"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { getPainPointsForMaturity, type OnboardingData } from "@/types/onboarding";
import { ChatBubble } from "./chat-bubble";

interface StepPainPointsProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}

export function StepPainPoints({ data, onChange }: StepPainPointsProps) {
  const painOptions = getPainPointsForMaturity(data.companyMaturity);

  const togglePainPoint = (value: string) => {
    const current = data.painPoints || [];
    const updated = current.includes(value)
      ? current.filter((p) => p !== value)
      : [...current, value];
    onChange({ painPoints: updated });
  };

  return (
    <div className="space-y-6">
      <ChatBubble>
        <p>Now — <strong>what&apos;s keeping you up at night?</strong></p>
        <p>Understanding your pain points helps me prioritize which moments matter most in your journey.</p>
      </ChatBubble>

      {/* Biggest Challenge */}
      <div className="space-y-2">
        <Label htmlFor="biggestChallenge">
          What&apos;s your single biggest CX challenge right now?
        </Label>
        <Textarea
          id="biggestChallenge"
          placeholder={
            data.companyMaturity === "pre_launch"
              ? "e.g. We don't know how to structure our sales process to close our first deal"
              : "e.g. We're losing 15% of customers in the first 90 days and we don't know why"
          }
          value={data.biggestChallenge}
          onChange={(e) => onChange({ biggestChallenge: e.target.value })}
          rows={3}
        />
      </div>

      {/* Pain Points — Maturity-Adaptive */}
      <div className="space-y-3">
        <Label>Which of these resonate? (pick all that apply)</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {painOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors hover:bg-accent/50 ${
                (data.painPoints || []).includes(option.value)
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
            >
              <input
                type="checkbox"
                checked={(data.painPoints || []).includes(option.value)}
                onChange={() => togglePainPoint(option.value)}
                className="rounded border-input"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Custom Pain Point */}
      <div className="space-y-2">
        <Label htmlFor="customPainPoint">Anything else? (optional)</Label>
        <Input
          id="customPainPoint"
          placeholder="Describe another challenge..."
          value={data.customPainPoint || ""}
          onChange={(e) => onChange({ customPainPoint: e.target.value })}
        />
      </div>
    </div>
  );
}
