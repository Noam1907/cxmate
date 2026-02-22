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
    <div className="space-y-8">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">Let&apos;s talk numbers</h2>
      <ChatBubble>
        <p>
          This grounds your playbook in <strong>real ROI projections</strong> — not hand-wavy estimates.
        </p>
      </ChatBubble>

      {/* Average Deal Size — first (most concrete/easy to answer) */}
      <div className="rounded-2xl border border-border/60 bg-white p-6 space-y-4 shadow-sm">
        <Label className="text-sm font-semibold text-foreground">Average deal size (annual contract value)</Label>
        <RadioGroup
          value={data.averageDealSize}
          onValueChange={(value) => onChange({ averageDealSize: value })}
          className="grid grid-cols-2 gap-2.5"
        >
          {DEAL_SIZE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-2 rounded-xl border-2 px-4 py-3 cursor-pointer transition-all hover:shadow-sm ${
                data.averageDealSize === opt.value
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border/50 hover:border-border"
              }`}
            >
              <RadioGroupItem value={opt.value} />
              <span className="text-sm font-medium">{opt.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Pricing Model */}
      <div className="rounded-2xl border border-border/60 bg-white p-6 space-y-4 shadow-sm">
        <Label className="text-sm font-semibold text-foreground">How do you price your product?</Label>
        <RadioGroup
          value={data.pricingModel}
          onValueChange={(value) => onChange({ pricingModel: value })}
          className="grid grid-cols-2 gap-2.5"
        >
          {PRICING_MODEL_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex flex-col rounded-xl border-2 px-4 py-3.5 cursor-pointer transition-all hover:shadow-sm ${
                data.pricingModel === opt.value
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border/50 hover:border-border"
              }`}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value={opt.value} />
                <span className="text-sm font-semibold">{opt.label}</span>
              </div>
              <span className="text-xs text-muted-foreground ml-6 mt-0.5">
                {opt.description}
              </span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Rough Revenue */}
      <div className="rounded-2xl border border-border/60 bg-white p-6 space-y-4 shadow-sm">
        <Label className="text-sm font-semibold text-foreground">Rough annual revenue range</Label>
        <RadioGroup
          value={data.roughRevenue}
          onValueChange={(value) => onChange({ roughRevenue: value })}
          className="grid grid-cols-2 gap-2.5"
        >
          {REVENUE_RANGE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-2 rounded-xl border-2 px-4 py-3 cursor-pointer transition-all hover:shadow-sm ${
                data.roughRevenue === opt.value
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border/50 hover:border-border"
              }`}
            >
              <RadioGroupItem value={opt.value} />
              <span className="text-sm font-medium">{opt.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Tech Stack */}
      <div className="space-y-2">
        <Label htmlFor="currentTools" className="text-sm font-semibold text-foreground">What tools does your team use? <span className="font-normal text-muted-foreground">(optional)</span></Label>
        <Input
          id="currentTools"
          placeholder="e.g. Salesforce, HubSpot, Zendesk, Intercom, Jira, Slack..."
          value={data.currentTools || ""}
          onChange={(e) => onChange({ currentTools: e.target.value })}
          className="h-12 rounded-xl border-border/60"
        />
        <p className="text-xs text-muted-foreground">
          CRM, ERP, support, BI, communication — the more I know, the better I can recommend what to add or replace
        </p>
      </div>
    </div>
  );
}
