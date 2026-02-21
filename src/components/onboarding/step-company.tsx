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
    <div className="space-y-6">
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

      {/* Enrichment result card — prominent, not buried */}
      {hasEnrichment && enrichment.description && !isEnriching && (
        <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">What I found about {data.companyName}</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            {enrichment.description}
          </p>
          {enrichment.confidence && (
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className={`w-1.5 h-1.5 rounded-full ${enrichment.confidence === "high" ? "bg-emerald-500" : enrichment.confidence === "medium" ? "bg-amber-500" : "bg-gray-400"}`} />
              {enrichment.confidence === "high" ? "High confidence" : enrichment.confidence === "medium" ? "Medium confidence" : "Best guess"} analysis
            </div>
          )}
        </div>
      )}

      {/* Vertical */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Label>What does your company do?</Label>
          {verticalWasSuggested && <AiSuggestedBadge />}
        </div>
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
        <div className="flex items-center gap-2">
          <Label>How big is your team?</Label>
          {sizeWasSuggested && <AiSuggestedBadge />}
        </div>
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
