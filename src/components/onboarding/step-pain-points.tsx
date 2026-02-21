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
    <div className="space-y-8">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">What&apos;s keeping you up at night?</h2>
      <ChatBubble>
        <p>This is where my CCXP expertise kicks in. Understanding your pains helps me prioritize the moments in your journey that will have the biggest impact.</p>
      </ChatBubble>

      {/* Biggest Pain — plain language, no CX jargon */}
      <div className="rounded-2xl border border-border/60 bg-white p-6 space-y-3 shadow-sm">
        <Label htmlFor="biggestChallenge" className="text-sm font-semibold text-foreground">
          In one sentence, what&apos;s the #1 thing you&apos;d fix about how customers experience your product?
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
          className="rounded-xl border-border/60"
        />
        <p className="text-xs text-muted-foreground">
          This becomes the focal point of your journey map and playbook
        </p>
      </div>

      {/* Pain Points — Maturity-Adaptive */}
      <div className="rounded-2xl border border-border/60 bg-white p-6 space-y-4 shadow-sm">
        <Label className="text-sm font-semibold text-foreground">Which of these resonate? (pick all that apply)</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {painOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 cursor-pointer transition-all hover:shadow-sm ${
                (data.painPoints || []).includes(option.value)
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border/50 hover:border-border"
              }`}
            >
              <input
                type="checkbox"
                checked={(data.painPoints || []).includes(option.value)}
                onChange={() => togglePainPoint(option.value)}
                className="rounded border-input accent-primary"
              />
              <span className="text-sm font-medium">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Custom Pain Point */}
      <div className="space-y-2">
        <Label htmlFor="customPainPoint" className="text-sm font-semibold text-foreground">Anything else? (optional)</Label>
        <Input
          id="customPainPoint"
          placeholder="Describe another challenge..."
          value={data.customPainPoint || ""}
          onChange={(e) => onChange({ customPainPoint: e.target.value })}
          className="h-12 rounded-xl border-border/60"
        />
      </div>
    </div>
  );
}
