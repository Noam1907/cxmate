"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VERTICALS } from "@/lib/cx-knowledge";
import { COMPANY_SIZES, type OnboardingData } from "@/types/onboarding";
import { ChatBubble } from "./chat-bubble";
import type { EnrichedCompanyData } from "@/types/enrichment";

interface StepCompanyProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
  enrichment?: EnrichedCompanyData | null;
  isEnriching?: boolean;
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

export function StepCompany({ data, onChange, enrichment, isEnriching }: StepCompanyProps) {
  const hasEnrichment = !!enrichment;
  const verticalWasSuggested = hasEnrichment && data.vertical === enrichment.suggestedVertical;
  const sizeWasSuggested = hasEnrichment && data.companySize === enrichment.suggestedCompanySize;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">Tell me about your company</h2>
      <ChatBubble>
        {isEnriching ? (
          <>
            <p>Nice to meet you{data.userName ? `, ${data.userName}` : ""}! Let me look into <strong>{data.companyName || "your company"}</strong>...</p>
            <p>I&apos;m researching your business now. In the meantime, confirm a few things for me.</p>
          </>
        ) : hasEnrichment ? (
          <>
            <p>I&apos;ve pre-filled what I found. Confirm or change anything below.</p>
          </>
        ) : (
          <>
            <p>Nice to meet you{data.userName ? `, ${data.userName}` : ""}!</p>
            <p>Tell me a bit about <strong>{data.companyName || "your company"}</strong> so I can tailor everything to your world.</p>
          </>
        )}
      </ChatBubble>

      {/* Enrichment loading indicator */}
      {isEnriching && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 rounded-lg px-3 py-2">
          <span className="inline-block w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Analyzing {data.companyName}...
        </div>
      )}

      {/* Enrichment result card — large, prominent showcase */}
      {hasEnrichment && enrichment.description && !isEnriching && (
        <div className="rounded-2xl border-2 border-primary/25 bg-gradient-to-br from-primary/5 via-primary/8 to-amber-50/50 p-6 space-y-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/12 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm font-bold text-foreground tracking-tight">What I found about {data.companyName}</span>
          </div>
          <p className="text-base text-foreground leading-relaxed">
            {enrichment.description}
          </p>
          {enrichment.confidence && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <span className={`w-2 h-2 rounded-full ${enrichment.confidence === "high" ? "bg-emerald-500" : enrichment.confidence === "medium" ? "bg-amber-500" : "bg-gray-400"}`} />
              {enrichment.confidence === "high" ? "High confidence" : enrichment.confidence === "medium" ? "Medium confidence" : "Best guess"} analysis
            </div>
          )}
        </div>
      )}

      {/* Vertical */}
      <div className="rounded-2xl border border-border/60 bg-white p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-semibold text-foreground">What does your company do?</Label>
          {verticalWasSuggested && <AiSuggestedBadge />}
        </div>
        <RadioGroup
          value={data.vertical}
          onValueChange={(value) =>
            onChange({ vertical: value, customVertical: undefined })
          }
          className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
        >
          {VERTICALS.map((v) => (
            <label
              key={v.id}
              className={`flex items-start gap-3 rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-sm ${
                data.vertical === v.id
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border/50 hover:border-border"
              }`}
            >
              <RadioGroupItem value={v.id} className="mt-0.5" />
              <div>
                <div className="font-semibold text-sm text-foreground">{v.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
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
            className="mt-2 h-12 rounded-xl"
          />
        )}
      </div>

      {/* Company Size */}
      <div className="rounded-2xl border border-border/60 bg-white p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-semibold text-foreground">How big is your team?</Label>
          {sizeWasSuggested && <AiSuggestedBadge />}
        </div>
        <RadioGroup
          value={data.companySize}
          onValueChange={(value) => onChange({ companySize: value })}
          className="flex flex-wrap gap-2.5"
        >
          {COMPANY_SIZES.map((size) => (
            <label
              key={size.value}
              className={`flex items-center gap-2 rounded-xl border-2 px-5 py-3 cursor-pointer transition-all hover:shadow-sm ${
                data.companySize === size.value
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
    </div>
  );
}
