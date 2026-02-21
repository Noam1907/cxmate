"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  PRICING_MODEL_OPTIONS,
  REVENUE_RANGE_OPTIONS,
  DEAL_SIZE_OPTIONS,
  type OnboardingData,
} from "@/types/onboarding";
import { ChatBubble } from "./chat-bubble";

interface StepBusinessDataProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}

export function StepBusinessData({ data, onChange }: StepBusinessDataProps) {
  return (
    <div className="space-y-6">
      <ChatBubble>
        <p>
          Let&apos;s ground this in <strong>real numbers</strong> so your playbook has
          actual ROI projections — not hand-wavy estimates.
        </p>
      </ChatBubble>

      {/* Average Deal Size — first (most concrete/easy to answer) */}
      <div className="space-y-3">
        <Label>Average deal size (annual contract value)</Label>
        <RadioGroup
          value={data.averageDealSize}
          onValueChange={(value) => onChange({ averageDealSize: value })}
          className="grid grid-cols-2 gap-2"
        >
          {DEAL_SIZE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-2 rounded-lg border px-4 py-3 cursor-pointer transition-colors hover:bg-accent/50 ${
                data.averageDealSize === opt.value
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
            >
              <RadioGroupItem value={opt.value} />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Pricing Model */}
      <div className="space-y-3">
        <Label>How do you price your product?</Label>
        <RadioGroup
          value={data.pricingModel}
          onValueChange={(value) => onChange({ pricingModel: value })}
          className="grid grid-cols-2 gap-2"
        >
          {PRICING_MODEL_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex flex-col rounded-lg border px-4 py-3 cursor-pointer transition-colors hover:bg-accent/50 ${
                data.pricingModel === opt.value
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value={opt.value} />
                <span className="text-sm font-medium">{opt.label}</span>
              </div>
              <span className="text-xs text-muted-foreground ml-6">
                {opt.description}
              </span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Rough Revenue */}
      <div className="space-y-3">
        <Label>Rough annual revenue range</Label>
        <RadioGroup
          value={data.roughRevenue}
          onValueChange={(value) => onChange({ roughRevenue: value })}
          className="grid grid-cols-2 gap-2"
        >
          {REVENUE_RANGE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-2 rounded-lg border px-4 py-3 cursor-pointer transition-colors hover:bg-accent/50 ${
                data.roughRevenue === opt.value
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
            >
              <RadioGroupItem value={opt.value} />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Tech Stack */}
      <div className="space-y-2">
        <Label htmlFor="currentTools">What tools do you use for CX today? (optional)</Label>
        <Input
          id="currentTools"
          placeholder="e.g. HubSpot, Intercom, Zendesk, Salesforce..."
          value={data.currentTools || ""}
          onChange={(e) => onChange({ currentTools: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          This helps me recommend tools that integrate with your stack — and suggest what AI can replace today
        </p>
      </div>
    </div>
  );
}
