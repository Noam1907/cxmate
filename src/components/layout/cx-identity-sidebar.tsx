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
      <div className="p-5 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-bold text-sidebar-primary">
              CX
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-sidebar-foreground leading-none">
              CX Identity
            </p>
            <p className="text-[10px] text-sidebar-foreground/50 mt-0.5">
              {isOnboarding ? "Building your profile..." : "Your CX profile"}
            </p>
          </div>
        </div>

        <div className="border-t border-sidebar-border/50" />

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
