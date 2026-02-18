"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { VERTICALS } from "@/lib/cx-knowledge";
import { COMPANY_SIZES, type OnboardingData } from "@/types/onboarding";

interface StepCompanyProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}

export function StepCompany({ data, onChange }: StepCompanyProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Tell us about your company</h2>
        <p className="text-muted-foreground mt-1">
          This helps us tailor your journey map to your specific business.
        </p>
      </div>

      {/* Company Name */}
      <div className="space-y-2">
        <Label htmlFor="companyName">Company name</Label>
        <Input
          id="companyName"
          placeholder="e.g. Acme Corp"
          value={data.companyName}
          onChange={(e) => onChange({ companyName: e.target.value })}
        />
      </div>

      {/* Vertical */}
      <div className="space-y-3">
        <Label>What does your company do?</Label>
        <RadioGroup
          value={data.vertical}
          onValueChange={(value) =>
            onChange({ vertical: value, customVertical: undefined })
          }
          className="grid grid-cols-1 sm:grid-cols-2 gap-2"
        >
          {VERTICALS.map((v) => (
            <label
              key={v.id}
              className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors hover:bg-accent/50 ${
                data.vertical === v.id
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
            >
              <RadioGroupItem value={v.id} className="mt-0.5" />
              <div>
                <div className="font-medium text-sm">{v.label}</div>
                <div className="text-xs text-muted-foreground">
                  {v.description}
                </div>
              </div>
            </label>
          ))}
        </RadioGroup>
        {data.vertical === "other" && (
          <Input
            placeholder="Describe your business"
            value={data.customVertical || ""}
            onChange={(e) => onChange({ customVertical: e.target.value })}
            className="mt-2"
          />
        )}
      </div>

      {/* Company Size */}
      <div className="space-y-3">
        <Label>How big is your team?</Label>
        <RadioGroup
          value={data.companySize}
          onValueChange={(value) => onChange({ companySize: value })}
          className="flex flex-wrap gap-2"
        >
          {COMPANY_SIZES.map((size) => (
            <label
              key={size.value}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 cursor-pointer transition-colors hover:bg-accent/50 ${
                data.companySize === size.value
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
            >
              <RadioGroupItem value={size.value} />
              <span className="text-sm">{size.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
