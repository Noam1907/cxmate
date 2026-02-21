"use client";

import { usePathname } from "next/navigation";
import { useCompanyProfile } from "@/contexts/company-profile-context";
import { SidebarBuildingView } from "./sidebar-building-view";
import { SidebarCompleteView } from "./sidebar-complete-view";

export function CxIdentitySidebar() {
  const pathname = usePathname();
  const { onboardingData, journey, templateId } = useCompanyProfile();

  const isOnboarding = pathname === "/onboarding";

  return (
    <aside className="bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto hidden md:block">
      <div className="p-5 space-y-4">
        {/* Header */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
            {isOnboarding ? "Building profile" : "CX Profile"}
          </p>
        </div>

        {/* Content — switches between building and complete */}
        {isOnboarding ? (
          <SidebarBuildingView data={onboardingData} />
        ) : (
          <SidebarCompleteView
            data={onboardingData}
            journey={journey}
            templateId={templateId}
          />
        )}
      </div>
    </aside>
  );
}
