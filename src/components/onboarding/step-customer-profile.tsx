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
import type { EnrichedCompanyData } from "@/types/enrichment";

interface StepCustomerProfileProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
  enrichment?: EnrichedCompanyData | null;
}

function AiSuggestedBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/8 px-2 py-0.5 rounded-full">
      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" clipRule="evenodd" />
      </svg>
      AI-suggested
    </span>
  );
}

export function StepCustomerProfile({ data, onChange, enrichment }: StepCustomerProfileProps) {
  const isPreLaunch = data.companyMaturity === "pre_launch";
  const hasEnrichment = !!enrichment;
  const customerSizeWasSuggested = hasEnrichment && data.customerSize === enrichment.suggestedCustomerSize;
  const channelWasSuggested = hasEnrichment && data.mainChannel === enrichment.suggestedMainChannel;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">Who are your customers?</h2>
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

      {/* Customer Size — quick pick first */}
      <div className="rounded-2xl border border-border/60 bg-white p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-semibold text-foreground">
            {isPreLaunch
              ? "What size companies are you targeting?"
              : "What size are most of your customers?"}
          </Label>
          {customerSizeWasSuggested && <AiSuggestedBadge />}
        </div>
        <RadioGroup
          value={data.customerSize}
          onValueChange={(value) => onChange({ customerSize: value })}
          className="grid grid-cols-2 gap-2.5"
        >
          {CUSTOMER_SIZES.map((size) => (
            <label
              key={size.value}
              className={`flex items-center gap-2 rounded-xl border-2 px-4 py-3 cursor-pointer transition-all hover:shadow-sm ${
                data.customerSize === size.value
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border/50 hover:border-border"
              }`}
            >
              <RadioGroupItem value={size.value} />
              <span className="text-sm font-medium">{size.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Customer Count — only for companies with customers */}
      {!isPreLaunch && (
        <div className="rounded-2xl border border-border/60 bg-white p-6 space-y-4 shadow-sm">
          <Label className="text-sm font-semibold text-foreground">How many paying customers do you have?</Label>
          <RadioGroup
            value={data.customerCount}
            onValueChange={(value) => onChange({ customerCount: value })}
            className="grid grid-cols-2 gap-2.5"
          >
            {CUSTOMER_COUNT_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-2 rounded-xl border-2 px-4 py-3 cursor-pointer transition-all hover:shadow-sm ${
                  data.customerCount === opt.value
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
      )}

      {/* Customer Description */}
      <div className="rounded-2xl border border-border/60 bg-white p-6 space-y-3 shadow-sm">
        <Label htmlFor="customerDescription" className="text-sm font-semibold text-foreground">
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
          className="rounded-xl border-border/60"
        />
      </div>

      {/* Main Channel — with descriptions */}
      <div className="rounded-2xl border border-border/60 bg-white p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-semibold text-foreground">
            {isPreLaunch
              ? "How will customers find and buy from you?"
              : "How do customers find and buy from you?"}
          </Label>
          {channelWasSuggested && <AiSuggestedBadge />}
        </div>
        <RadioGroup
          value={data.mainChannel}
          onValueChange={(value) => onChange({ mainChannel: value })}
          className="grid grid-cols-2 gap-2.5"
        >
          {MAIN_CHANNELS.map((channel) => (
            <label
              key={channel.value}
              className={`flex flex-col rounded-xl border-2 px-4 py-3 cursor-pointer transition-all hover:shadow-sm ${
                data.mainChannel === channel.value
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border/50 hover:border-border"
              }`}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value={channel.value} />
                <span className="text-sm font-semibold">{channel.label}</span>
              </div>
              {channel.description && (
                <span className="text-xs text-muted-foreground ml-6 mt-0.5">
                  {channel.description}
                </span>
              )}
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Pre-live process — only for companies with customers, neutral terminology */}
      {!isPreLaunch && (
        <div className="rounded-2xl border border-border/60 bg-white p-6 space-y-3 shadow-sm">
          <Label htmlFor="preLiveProcess" className="text-sm font-semibold text-foreground">
            What happens between a signed deal and a live customer?
          </Label>
          <p className="text-xs text-muted-foreground -mt-1">
            Use your own words — installation, setup call, pilot, onboarding sprint, nothing formal...
          </p>
          <Textarea
            id="preLiveProcess"
            placeholder="e.g. We do a 2-week technical installation, then a training session before they go live"
            value={data.preLiveProcess || ""}
            onChange={(e) => onChange({ preLiveProcess: e.target.value })}
            rows={2}
            className="rounded-xl border-border/60"
          />
          <p className="text-xs text-muted-foreground">
            This tells me what to call this phase in your journey — so I don&apos;t assume &ldquo;pilot&rdquo; if you call it something else.
          </p>
        </div>
      )}
    </div>
  );
}
