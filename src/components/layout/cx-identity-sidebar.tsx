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
    <aside className="bg-white border-r border-slate-200 h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto hidden md:block">
      <div className="p-5 pt-6">
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
