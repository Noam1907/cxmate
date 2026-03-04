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
 * Conservative: only guesses single-word names (e.g. "Acme" → "acme.com").
 * Multi-word names like "Orca AI" are skipped — too ambiguous to guess reliably
 * ("orca.ai" vs "orca-ai.io" — we'd get it wrong half the time).
 * User types their real URL instead.
 */
function guessWebsite(name: string): string {
  const lower = name.toLowerCase().trim();
  if (!lower) return "";

  const words = lower.split(/\s+/);

  // Multi-word names: too risky to guess — skip
  if (words.length > 1) return "";

  // Single word: strip noise, append .com
  const cleaned = lower.replace(/[^a-z0-9]/g, "");
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
    <div className="space-y-8">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">Let&apos;s get started</h2>
      <ChatBubble>
        <p className="font-medium">Hey! 👋 I&apos;m CX Mate, your CCXP-certified AI customer experience expert.</p>
        <p>
          I help companies map their customer journey, find the moments that
          matter, and build playbooks their team can actually execute.
        </p>
        <p>
          Let&apos;s figure out where you are and what you need.
          This takes a few minutes — and the output is worth it.
        </p>
      </ChatBubble>

      <div className="rounded-2xl border border-border/60 bg-white p-6 space-y-5 shadow-sm">
        {/* Person's name */}
        <div className="space-y-2">
          <Label htmlFor="userName" className="text-sm font-semibold text-foreground">What&apos;s your name?</Label>
          <Input
            id="userName"
            placeholder="e.g. Sarah"
            value={data.userName || ""}
            onChange={(e) => onChange({ userName: e.target.value })}
            autoFocus
            className="h-12 rounded-xl border-border/60 text-sm"
          />
        </div>

        {/* Person's email */}
        <div className="space-y-2">
          <Label htmlFor="userEmail" className="text-sm font-semibold text-foreground">Your email</Label>
          <Input
            id="userEmail"
            type="email"
            placeholder="e.g. sarah@company.com"
            value={data.userEmail || ""}
            onChange={(e) => onChange({ userEmail: e.target.value })}
            className="h-12 rounded-xl border-border/60 text-sm"
          />
          <p className="text-xs text-muted-foreground">
            We&apos;ll create your account and send you a link to access your results anytime
          </p>
        </div>

        {/* Person's role */}
        <div className="space-y-2">
          <Label htmlFor="userRole" className="text-sm font-semibold text-foreground">Your role</Label>
          <Input
            id="userRole"
            placeholder="e.g. Head of CS, CEO, VP Product"
            value={data.userRole || ""}
            onChange={(e) => onChange({ userRole: e.target.value })}
            className="h-12 rounded-xl border-border/60 text-sm"
          />
          <p className="text-xs text-muted-foreground">
            This helps me tailor recommendations to your perspective
          </p>
        </div>

        {/* Company name */}
        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-sm font-semibold text-foreground">What&apos;s your company called?</Label>
          <Input
            id="companyName"
            placeholder="e.g. Acme Corp"
            value={data.companyName}
            onChange={(e) => onChange({ companyName: e.target.value })}
            className="h-12 rounded-xl border-border/60 text-sm"
          />
        </div>

        {/* Company website */}
        <div className="space-y-2">
          <Label htmlFor="companyWebsite" className="text-sm font-semibold text-foreground">Company website</Label>
          <Input
            id="companyWebsite"
            placeholder="e.g. acme.com"
            value={data.companyWebsite}
            onChange={(e) => handleWebsiteChange(e.target.value)}
            className="h-12 rounded-xl border-border/60 text-sm"
          />
          <p className="text-xs text-muted-foreground">
            {websiteManuallyEdited
              ? "Great, I'll use this to learn about your business"
              : "Auto-suggested. Feel free to edit"}
          </p>
        </div>
      </div>
    </div>
  );
}
