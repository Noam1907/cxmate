"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CUSTOMER_SIZES,
  CUSTOMER_COUNT_OPTIONS,
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

      {/* Has Existing Customers Toggle */}
      <div className="space-y-3">
        <Label>Do you have paying customers?</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChange({ hasExistingCustomers: true })}
            className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
              data.hasExistingCustomers
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground hover:bg-accent/50"
            }`}
          >
            Yes, we do
          </button>
          <button
            type="button"
            onClick={() =>
              onChange({
                hasExistingCustomers: false,
                customerCount: "",
                pricingModel: "",
                roughRevenue: "",
                averageDealSize: "",
              })
            }
            className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
              !data.hasExistingCustomers
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground hover:bg-accent/50"
            }`}
          >
            Not yet
          </button>
        </div>
      </div>

      {/* Customer Count — shown when hasExistingCustomers */}
      {data.hasExistingCustomers && (
        <div className="space-y-3">
          <Label>How many paying customers do you have?</Label>
          <RadioGroup
            value={data.customerCount}
            onValueChange={(value) => onChange({ customerCount: value })}
            className="grid grid-cols-2 gap-2"
          >
            {CUSTOMER_COUNT_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-2 rounded-lg border px-4 py-3 cursor-pointer transition-colors hover:bg-accent/50 ${
                  data.customerCount === opt.value
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

      {/* Customer Description */}
      <div className="space-y-2">
        <Label htmlFor="customerDescription">
          {data.hasExistingCustomers
            ? "Describe your typical customer in one sentence"
            : "Describe your target customer in one sentence"}
        </Label>
        <Textarea
          id="customerDescription"
          placeholder={
            data.hasExistingCustomers
              ? "e.g. Mid-market SaaS companies with 50-200 employees looking to improve their customer onboarding"
              : "e.g. B2B SaaS companies that need better customer onboarding processes"
          }
          value={data.customerDescription}
          onChange={(e) => onChange({ customerDescription: e.target.value })}
          rows={3}
        />
      </div>

      {/* Customer Size */}
      <div className="space-y-3">
        <Label>
          {data.hasExistingCustomers
            ? "What size are most of your customers?"
            : "What size companies are you targeting?"}
        </Label>
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
        <Label>
          {data.hasExistingCustomers
            ? "How do customers typically find and buy from you?"
            : "How will customers find and buy from you?"}
        </Label>
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
