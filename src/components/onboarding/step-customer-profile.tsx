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
import { ChatBubble } from "./chat-bubble";

interface StepCustomerProfileProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}

export function StepCustomerProfile({ data, onChange }: StepCustomerProfileProps) {
  const isPreLaunch = data.companyMaturity === "pre_launch";

  return (
    <div className="space-y-6">
      <ChatBubble>
        {isPreLaunch ? (
          <>
            <p>Since you&apos;re building your go-to-market, let me understand <strong>who you&apos;re going after</strong>.</p>
            <p>Even without customers yet, knowing your target helps me map the right sales journey.</p>
          </>
        ) : (
          <p>Tell me about <strong>your customers</strong> — this helps me make the journey specific to them.</p>
        )}
      </ChatBubble>

      {/* Customer Count — only for companies with customers */}
      {!isPreLaunch && (
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
          {isPreLaunch
            ? "Describe your target customer in one sentence"
            : "Describe your typical customer in one sentence"}
        </Label>
        <Textarea
          id="customerDescription"
          placeholder={
            isPreLaunch
              ? "e.g. B2B SaaS companies that need better customer onboarding processes"
              : "e.g. Mid-market SaaS companies with 50-200 employees looking to improve retention"
          }
          value={data.customerDescription}
          onChange={(e) => onChange({ customerDescription: e.target.value })}
          rows={3}
        />
      </div>

      {/* Customer Size */}
      <div className="space-y-3">
        <Label>
          {isPreLaunch
            ? "What size companies are you targeting?"
            : "What size are most of your customers?"}
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
          {isPreLaunch
            ? "How will customers find and buy from you?"
            : "How do customers find and buy from you?"}
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
