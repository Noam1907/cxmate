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
      label: "Dashboard",
      href: "/dashboard",
      match: "/dashboard",
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
            className="rounded-md bg-white/10 object-contain"
            onError={() => setLogoError(true)}
          />
        ) : (
          <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-white/80">{initials}</span>
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white/90 truncate">
            {companyName || "Your Company"}
          </p>
          <p className="text-[10px] text-white/35 mt-0.5">CX Mate</p>
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
                  ? "bg-white/10"
                  : "hover:bg-white/5"
              }`}
            >
              {/* Step number */}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold transition-all ${
                  isActive
                    ? "bg-white text-slate-900"
                    : "bg-white/10 text-white/40 group-hover:bg-white/15 group-hover:text-white/60"
                }`}
              >
                {i + 1}
              </div>

              {/* Label + sublabel */}
              <div className="min-w-0 flex-1">
                <p
                  className={`text-xs font-medium leading-tight truncate ${
                    isActive ? "text-white" : "text-white/50 group-hover:text-white/70"
                  }`}
                >
                  {item.label}
                </p>
                {isActive && item.sublabel && (
                  <p className="text-[10px] text-white/35 mt-0.5 truncate">{item.sublabel}</p>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Divider + Re-run */}
      <div className="border-t border-white/8 pt-4">
        <Link
          href="/onboarding"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-all group"
        >
          <div className="w-5 h-5 rounded-full bg-white/6 flex items-center justify-center shrink-0">
            <span className="text-[9px] text-white/30">↺</span>
          </div>
          <span className="text-[11px] text-white/30 group-hover:text-white/50 transition-colors">
            Re-run analysis
          </span>
        </Link>
      </div>
    </div>
  );
}
