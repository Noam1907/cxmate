"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  NPS_RESPONSE_OPTIONS,
  DATA_VS_GUT_OPTIONS,
  type OnboardingData,
} from "@/types/onboarding";

interface StepCxMaturityProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}

export function StepCxMaturity({ data, onChange }: StepCxMaturityProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">How do you measure CX today?</h2>
        <p className="text-muted-foreground mt-1">
          No wrong answers — this helps us tailor recommendations to where you
          actually are.
        </p>
      </div>

      {/* CX Metrics Toggles */}
      <div className="space-y-3">
        <Label>Which CX metrics do you track?</Label>
        <p className="text-xs text-muted-foreground">
          Select all that apply — or none if you haven&apos;t started measuring yet.
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { key: "measuresNps" as const, label: "NPS", description: "Net Promoter Score" },
            { key: "measuresCsat" as const, label: "CSAT", description: "Customer Satisfaction" },
            { key: "measuresCes" as const, label: "CES", description: "Customer Effort Score" },
          ].map((metric) => (
            <button
              key={metric.key}
              type="button"
              onClick={() => onChange({ [metric.key]: !data[metric.key] })}
              className={`rounded-lg border px-4 py-3 text-sm transition-colors cursor-pointer ${
                data[metric.key]
                  ? "border-primary bg-primary/5 text-primary font-medium"
                  : "border-border text-muted-foreground hover:bg-accent/50"
              }`}
            >
              <span className="font-medium">{metric.label}</span>
              <span className="text-xs ml-1 opacity-70">({metric.description})</span>
            </button>
          ))}
        </div>
      </div>

      {/* NPS Response Count — shown when NPS is selected */}
      {data.measuresNps && (
        <div className="space-y-3 pl-4 border-l-2 border-primary/20">
          <Label>How many NPS responses do you get per survey?</Label>
          <p className="text-xs text-muted-foreground">
            Under 100 responses makes NPS statistically unreliable — we&apos;ll factor
            that into our recommendations.
          </p>
          <RadioGroup
            value={data.npsResponseCount}
            onValueChange={(value) => onChange({ npsResponseCount: value })}
            className="grid grid-cols-3 gap-2"
          >
            {NPS_RESPONSE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-2 rounded-lg border px-4 py-3 cursor-pointer transition-colors hover:bg-accent/50 ${
                  data.npsResponseCount === opt.value
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
      )}

      {/* Journey Map */}
      <div className="space-y-3">
        <Label>Do you have a customer journey map?</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChange({ hasJourneyMap: true })}
            className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
              data.hasJourneyMap
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground hover:bg-accent/50"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => onChange({ hasJourneyMap: false })}
            className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
              !data.hasJourneyMap
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground hover:bg-accent/50"
            }`}
          >
            No
          </button>
        </div>
      </div>

      {/* Data vs Gut */}
      <div className="space-y-3">
        <Label>How do you make CX decisions today?</Label>
        <RadioGroup
          value={data.dataVsGut}
          onValueChange={(value) => onChange({ dataVsGut: value })}
          className="space-y-2"
        >
          {DATA_VS_GUT_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex flex-col rounded-lg border px-4 py-3 cursor-pointer transition-colors hover:bg-accent/50 ${
                data.dataVsGut === opt.value
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
    </div>
  );
}
