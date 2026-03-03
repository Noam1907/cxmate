"use client";

import { useState } from "react";
import type { OnboardingData } from "@/types/onboarding";
import { Check } from "@phosphor-icons/react";

interface SidebarBuildingViewProps {
  data: Partial<OnboardingData> | null;
}

const ONBOARDING_STAGES = [
  { key: "about", label: "About your company" },
  { key: "journey", label: "Your journey" },
  { key: "customers", label: "Your customers" },
  { key: "pains", label: "Challenges & goals" },
  { key: "summary", label: "Summary" },
];

function getLogoUrl(website: string): string | null {
  if (!website) return null;
  const domain = website.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();
  if (!domain || !domain.includes(".")) return null;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

function getCurrentStageIndex(data: Partial<OnboardingData> | null): number {
  if (!data?.companyName) return 0;
  if (!data?.vertical || !data?.companyMaturity) return 0;
  // For maturities that include the journey step, stay on stage 1 until it's answered
  const hasJourneyStep =
    data.companyMaturity === "first_customers" ||
    data.companyMaturity === "growing" ||
    data.companyMaturity === "scaling";
  if (hasJourneyStep && !data?.hasExistingJourney) return 1;
  if (!data?.customerDescription) return 2;
  if (!data?.biggestChallenge || !data?.primaryGoal) return 3;
  return 4;
}

export function SidebarBuildingView({ data }: SidebarBuildingViewProps) {
  const [logoError, setLogoError] = useState(false);

  const currentStage = getCurrentStageIndex(data);
  const logoUrl = getLogoUrl(data?.companyWebsite || "");
  const companyName = data?.companyName;
  const initials = companyName ? companyName.charAt(0).toUpperCase() : null;

  return (
    <div className="space-y-6">
      {/* Company identity — shown once we have a name */}
      {companyName ? (
        <div className="flex items-center gap-3 px-1">
          {logoUrl && !logoError ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={logoUrl}
              alt={`${companyName} logo`}
              width={32}
              height={32}
              className="rounded-md bg-white p-0.5 object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-primary">{initials}</span>
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{companyName}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Building your profile</p>
          </div>
        </div>
      ) : (
        <div className="px-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Getting started
          </p>
        </div>
      )}

      {/* Lesson-style stage list */}
      <nav className="space-y-0.5">
        {ONBOARDING_STAGES.map((stage, i) => {
          const isDone = i < currentStage;
          const isCurrent = i === currentStage;
          const isLocked = i > currentStage;

          return (
            <div
              key={stage.key}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isCurrent
                  ? "bg-primary/10"
                  : isDone
                  ? "opacity-80"
                  : "opacity-40"
              }`}
            >
              {/* Step indicator */}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold transition-all ${
                  isDone
                    ? "bg-primary/15 text-primary"
                    : isCurrent
                    ? "bg-primary text-white"
                    : "border border-slate-200 text-slate-300"
                }`}
              >
                {isDone ? <Check size={12} weight="bold" /> : i + 1}
              </div>

              {/* Label */}
              <span
                className={`text-xs font-medium leading-tight ${
                  isCurrent
                    ? "text-primary font-semibold"
                    : isDone
                    ? "text-slate-600"
                    : "text-slate-300"
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="border-t border-slate-100" />

      {/* What's coming next */}
      <div className="space-y-2 px-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          After onboarding
        </p>
        <div className="space-y-1.5">
          {[
            { label: "Dashboard" },
            { label: "CX Report" },
            { label: "Journey Map" },
            { label: "Playbook" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 px-3 py-1.5 opacity-40">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
              <span className="text-xs text-slate-400">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
