"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkle } from "@phosphor-icons/react";
import { LogoMark } from "@/components/ui/logo-mark";

function getTemplateId(): string {
  try {
    const stored = sessionStorage.getItem("cx-mate-journey");
    if (stored) {
      const data = JSON.parse(stored);
      return data.templateId || "preview";
    }
  } catch {
    // ignore
  }
  return "preview";
}

export function NavHeader() {
  const pathname = usePathname();
  const [templateId, setTemplateId] = useState("preview");

  useEffect(() => {
    setTemplateId(getTemplateId());
  }, []);

  // Hide nav on home page only
  if (pathname === "/") {
    return null;
  }

  const isOnboarding = pathname === "/onboarding";
  const isAuth = pathname.startsWith("/auth");

  const navItems = [
    { href: `/analysis?id=${templateId}`, label: "Analysis" },
    { href: `/confrontation?id=${templateId}`, label: "CX Report" },
    { href: `/journey?id=${templateId}`, label: "Journey" },
    { href: "/playbook", label: "Playbook" },
  ];

  return (
    <header className="border-b border-slate-200/70 bg-background sticky top-0 z-50">
      <div className="max-w-full px-6 flex items-center justify-between h-14">
        <Link href={isOnboarding || isAuth ? "/" : "/analysis"} className="flex items-center gap-2">
          <LogoMark size="sm" />
          <span className="text-sm font-semibold tracking-tight text-slate-800">CX Mate</span>
        </Link>
        {!isOnboarding && !isAuth && (
          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-0.5">
              {navItems.map((item) => {
                const basePath = item.href.split("?")[0];
                const isActive = pathname === basePath || pathname.startsWith(basePath + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-xs font-medium px-3.5 py-2 rounded-lg transition-all duration-150 ${
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/60"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Upgrade CTA — hidden on pricing page */}
            {pathname !== "/pricing" && (
              <Link
                href="/pricing"
                className="text-xs font-semibold text-primary border border-primary/30 bg-primary/10 hover:bg-primary/15 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              >
                Upgrade <Sparkle size={12} weight="fill" />
              </Link>
            )}
          </div>
        )}
        {isAuth && (
          <Link
            href="/onboarding"
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Start free →
          </Link>
        )}
      </div>
    </header>
  );
}
