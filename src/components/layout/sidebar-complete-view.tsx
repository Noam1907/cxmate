"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { OnboardingData } from "@/types/onboarding";
import type { GeneratedJourney } from "@/lib/ai/journey-prompt";

interface SidebarCompleteViewProps {
  data: Partial<OnboardingData> | null;
  journey: GeneratedJourney | null;
  templateId: string | null;
}

function getLogoUrl(website: string): string | null {
  if (!website) return null;
  const domain = website.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();
  if (!domain || !domain.includes(".")) return null;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

export function SidebarCompleteView({
  data,
  journey,
  templateId,
}: SidebarCompleteViewProps) {
  const pathname = usePathname();
  const [logoError, setLogoError] = useState(false);

  const id = templateId || "preview";
  const companyName = data?.companyName;
  const initials = companyName ? companyName.charAt(0).toUpperCase() : "C";
  const logoUrl = getLogoUrl(data?.companyWebsite || "");

  const navItems = [
    {
      label: "About your company",
      href: "/onboarding",
      match: "/onboarding",
      sublabel: "Company profile",
    },
    {
      label: "Journey Map",
      href: `/journey?id=${id}`,
      match: "/journey",
      sublabel: journey ? `${journey.stages.length} stages mapped` : "Your customer journey",
    },
    {
      label: "Analysis",
      href: "/analysis",
      match: "/analysis",
      sublabel: "Overview & metrics",
    },
    {
      label: "CX Report",
      href: `/confrontation?id=${id}`,
      match: "/confrontation",
      sublabel: "Intelligence & risks",
    },
    {
      label: "Playbook",
      href: "/playbook",
      match: "/playbook",
      sublabel: "Actions & recommendations",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Company identity */}
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
          <p className="text-sm font-semibold text-slate-800 truncate">
            {companyName || "Your Company"}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">CX Mate</p>
        </div>
      </div>

      {/* Lesson-style navigation */}
      <nav className="space-y-0.5">
        {navItems.map((item, i) => {
          const isActive = pathname === item.match || pathname.startsWith(item.match + "?");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                isActive
                  ? "bg-primary/10"
                  : "hover:bg-slate-50"
              }`}
            >
              {/* Step number */}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold transition-all ${
                  isActive
                    ? "bg-primary text-white"
                    : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600"
                }`}
              >
                {i + 1}
              </div>

              {/* Label + sublabel */}
              <div className="min-w-0 flex-1">
                <p
                  className={`text-xs font-medium leading-tight truncate ${
                    isActive ? "text-primary font-semibold" : "text-slate-500 group-hover:text-slate-700"
                  }`}
                >
                  {item.label}
                </p>
                {isActive && item.sublabel && (
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">{item.sublabel}</p>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Divider + Re-run */}
      <div className="border-t border-slate-100 pt-4">
        <Link
          href="/onboarding"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-all group"
        >
          <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
            <span className="text-[9px] text-slate-400">↺</span>
          </div>
          <span className="text-[11px] text-slate-400 group-hover:text-slate-600 transition-colors">
            Re-run analysis
          </span>
        </Link>
      </div>
    </div>
  );
}
