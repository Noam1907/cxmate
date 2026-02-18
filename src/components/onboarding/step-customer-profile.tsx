"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CUSTOMER_SIZES,
  MAIN_CHANNELS,
  type OnboardingData,
} from "@/types/onboarding";

interface StepCustomerProfileProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}

export function StepCustomerProfile({
  data,
  onChange,
}: StepCustomerProfileProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Who are your customers?</h2>
        <p className="text-muted-foreground mt-1">
          Help us understand who you serve so we can make the journey specific to
          them.
        </p>
      </div>

      {/* Customer Description */}
      <div className="space-y-2">
        <Label htmlFor="customerDescription">
          Describe your typical customer in one sentence
        </Label>
        <Textarea
          id="customerDescription"
          placeholder="e.g. Mid-market SaaS companies with 50-200 employees looking to improve their customer onboarding"
          value={data.customerDescription}
          onChange={(e) => onChange({ customerDescription: e.target.value })}
          rows={3}
        />
      </div>

      {/* Customer Size */}
      <div className="space-y-3">
        <Label>What size are most of your customers?</Label>
        <RadioGroup
          value={data.customerSize}
          onValueChange={(value) => onChange({ customerSize: value })}
          className="grid grid-cols-2 gap-2"
        >
          {CUSTOMER_SIZES.map((size) => (
            <label
              key={size.value}
              className={`flex items-center gap-2 rounded-lg border px-4 py-3 cursor-pointer transition-colors hover:bg-accent/50 ${
                data.customerSize === size.value
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

      {/* Main Channel */}
      <div className="space-y-3">
        <Label>How do customers typically find and buy from you?</Label>
        <RadioGroup
          value={data.mainChannel}
          onValueChange={(value) => onChange({ mainChannel: value })}
          className="grid grid-cols-2 gap-2"
        >
          {MAIN_CHANNELS.map((channel) => (
            <label
              key={channel.value}
              className={`flex items-center gap-2 rounded-lg border px-4 py-3 cursor-pointer transition-colors hover:bg-accent/50 ${
                data.mainChannel === channel.value
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
            >
              <RadioGroupItem value={channel.value} />
              <span className="text-sm">{channel.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
