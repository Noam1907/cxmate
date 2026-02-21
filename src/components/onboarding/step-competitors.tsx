"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChatBubble } from "./chat-bubble";
import type { OnboardingData } from "@/types/onboarding";
import type { EnrichedCompanyData } from "@/types/enrichment";

interface StepCompetitorsProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
  enrichment?: EnrichedCompanyData | null;
}

export function StepCompetitors({ data, onChange, enrichment }: StepCompetitorsProps) {
  const maturity = data.companyMaturity;
  const [customCompetitor, setCustomCompetitor] = useState("");
  const hasEnrichment = !!enrichment?.suggestedCompetitors?.length;

  // Parse competitors into an array for chip display
  const competitorList = data.competitors
    ? data.competitors.split(",").map((c) => c.trim()).filter(Boolean)
    : [];

  const updateCompetitors = (list: string[]) => {
    onChange({ competitors: list.join(", ") });
  };

  const removeCompetitor = (name: string) => {
    updateCompetitors(competitorList.filter((c) => c !== name));
  };

  const addCompetitor = () => {
    const trimmed = customCompetitor.trim();
    if (trimmed && !competitorList.includes(trimmed)) {
      updateCompetitors([...competitorList, trimmed]);
      setCustomCompetitor("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCompetitor();
    }
  };

  const bubbleText = hasEnrichment
    ? `I found some competitors in your space. Remove any that don't fit and add your own.`
    : maturity === "pre_launch" || maturity === "first_customers"
      ? "Who else is trying to solve this problem for your customers? Knowing your competitive landscape helps me position your CX as a differentiator."
      : "Who are your main competitors? Understanding how your customers compare you helps me find CX moments where you can stand out.";

  return (
    <div className="space-y-6">
      <ChatBubble>
        <p>{bubbleText}</p>
      </ChatBubble>

      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label>Competitors or alternatives your customers consider</Label>
            {hasEnrichment && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/8 px-2 py-0.5 rounded-full">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" clipRule="evenodd" />
                </svg>
                AI-detected
              </span>
            )}
          </div>

          {/* Competitor chips */}
          {competitorList.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {competitorList.map((competitor) => (
                <span
                  key={competitor}
                  className="inline-flex items-center gap-1.5 text-sm font-medium bg-primary/8 text-primary border border-primary/20 rounded-full px-3 py-1.5"
                >
                  {competitor}
                  <button
                    type="button"
                    onClick={() => removeCompetitor(competitor)}
                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                    aria-label={`Remove ${competitor}`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Add competitor input */}
          <div className="flex gap-2">
            <Input
              placeholder="Add a competitor..."
              value={customCompetitor}
              onChange={(e) => setCustomCompetitor(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <button
              type="button"
              onClick={addCompetitor}
              disabled={!customCompetitor.trim()}
              className="px-3 py-2 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Add
            </button>
          </div>

          <p className="text-xs text-muted-foreground">
            Optional — but it helps me find CX moments where you can stand out
          </p>
        </div>
      </div>
    </div>
  );
}
