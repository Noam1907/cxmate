"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChatBubble } from "./chat-bubble";
import type { OnboardingData } from "@/types/onboarding";

interface StepWelcomeProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}

/**
 * Guess a website domain from a company name.
 * "Acme Corp" → "acmecorp.com"
 * "My Cool App" → "mycoolapp.com"
 */
function guessWebsite(name: string): string {
  const cleaned = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")    // strip special chars
    .replace(/\b(inc|corp|ltd|llc|co|company|group|technologies|tech|software|labs|io)\b/g, "") // strip suffixes
    .trim()
    .replace(/\s+/g, "");           // collapse spaces
  return cleaned ? `${cleaned}.com` : "";
}

export function StepWelcome({ data, onChange }: StepWelcomeProps) {
  const [websiteManuallyEdited, setWebsiteManuallyEdited] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-populate website when company name changes (unless user edited it manually)
  useEffect(() => {
    if (websiteManuallyEdited) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const guessed = guessWebsite(data.companyName);
      if (guessed && guessed !== data.companyWebsite) {
        onChange({ companyWebsite: guessed });
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.companyName, websiteManuallyEdited]);

  const handleWebsiteChange = (value: string) => {
    setWebsiteManuallyEdited(true);
    onChange({ companyWebsite: value });
  };

  return (
    <div className="space-y-6">
      <ChatBubble>
        <p className="font-medium">Hey! 👋 I&apos;m CX Mate — your AI-powered CX co-pilot.</p>
        <p>
          I help companies map their customer journey, find the moments that
          matter, and build playbooks their team can actually execute.
        </p>
        <p>
          Let&apos;s figure out where you are and what you need.
          This takes about 3 minutes.
        </p>
      </ChatBubble>

      <div className="space-y-4 max-w-sm">
        <div className="space-y-2">
          <Label htmlFor="companyName">What&apos;s your company called?</Label>
          <Input
            id="companyName"
            placeholder="e.g. Acme Corp"
            value={data.companyName}
            onChange={(e) => onChange({ companyName: e.target.value })}
            autoFocus
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyWebsite">Company website</Label>
          <Input
            id="companyWebsite"
            placeholder="e.g. acmecorp.com"
            value={data.companyWebsite}
            onChange={(e) => handleWebsiteChange(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            {websiteManuallyEdited
              ? "Great — I'll use this to learn about your business"
              : "Auto-suggested from company name — feel free to edit"}
          </p>
        </div>
      </div>
    </div>
  );
}
