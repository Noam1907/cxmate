"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NavHeader } from "@/components/nav-header";
import { useCompanyProfile } from "@/contexts/company-profile-context";
import { CxIdentitySidebar } from "./cx-identity-sidebar";
import { SidebarBuildingView } from "./sidebar-building-view";
import { SidebarCompleteView } from "./sidebar-complete-view";

// Routes where the sidebar should NOT appear
const SIDEBAR_EXCLUDED_ROUTES = ["/", "/auth", "/reset"];

function isExcluded(pathname: string): boolean {
  return SIDEBAR_EXCLUDED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { hydrateFromStorage, journey } = useCompanyProfile();
  const [mobileOpen, setMobileOpen] = useState(false);

  const showSidebar = !isExcluded(pathname);
  const isOnboarding = pathname === "/onboarding";

  // Hydrate context from sessionStorage on non-onboarding pages
  useEffect(() => {
    if (showSidebar && !isOnboarding && !journey) {
      hydrateFromStorage();
    }
  }, [showSidebar, isOnboarding, journey, hydrateFromStorage]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (!showSidebar) {
    return (
      <>
        <NavHeader />
        {children}
      </>
    );
  }

  return (
    <>
      <NavHeader />
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] min-h-[calc(100vh-3.5rem)]">
        {/* Desktop sidebar */}
        <CxIdentitySidebar />

        {/* Main content */}
        <main className="overflow-y-auto bg-slate-50">{children}</main>
      </div>

      {/* Mobile: floating toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-5 left-5 z-40 md:hidden w-11 h-11 rounded-full bg-slate-900 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        aria-label="Show navigation"
      >
        <span className="text-[10px] font-bold">≡</span>
      </button>

      {/* Mobile: slide-over drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <aside className="absolute left-0 top-0 bottom-0 w-[240px] bg-sidebar border-r border-sidebar-border overflow-y-auto animate-in slide-in-from-left duration-200">
            <div className="p-5 pt-6">
              {/* Close button */}
              <div className="flex items-center justify-end mb-4">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-white/30 hover:text-white/60 text-xl leading-none"
                  aria-label="Close sidebar"
                >
                  &times;
                </button>
              </div>

              {/* Reuse the same views as desktop */}
              {isOnboarding ? (
                <MobileBuildingView />
              ) : (
                <MobileCompleteView />
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

// Mobile wrappers that read from context
function MobileBuildingView() {
  const { onboardingData } = useCompanyProfile();
  return <SidebarBuildingView data={onboardingData} />;
}

function MobileCompleteView() {
  const { onboardingData, journey, templateId } = useCompanyProfile();
  return (
    <SidebarCompleteView
      data={onboardingData}
      journey={journey}
      templateId={templateId}
    />
  );
}
