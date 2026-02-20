"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChatBubble } from "./chat-bubble";
import type { OnboardingData } from "@/types/onboarding";

interface StepCompetitorsProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}

export function StepCompetitors({ data, onChange }: StepCompetitorsProps) {
  const maturity = data.companyMaturity;

  const bubbleText =
    maturity === "pre_launch" || maturity === "first_customers"
      ? "Who else is trying to solve this problem for your customers? Knowing your competitive landscape helps me position your CX as a differentiator."
      : "Who are your main competitors? Understanding how your customers compare you helps me find CX moments where you can stand out.";

  return (
    <div className="space-y-6">
      <ChatBubble>
        <p>{bubbleText}</p>
      </ChatBubble>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="competitors">
            Name 2-3 competitors or alternatives your customers consider
          </Label>
          <Textarea
            id="competitors"
            placeholder="e.g. Gainsight, ChurnZero, or they just use spreadsheets"
            value={data.competitors}
            onChange={(e) => onChange({ competitors: e.target.value })}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            Optional — but it helps me tailor your journey to stand out where it matters
          </p>
        </div>
      </div>
    </div>
  );
}
