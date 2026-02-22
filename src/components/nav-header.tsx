"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

  // Hide nav on home page and auth
  if (pathname === "/" || pathname.startsWith("/auth")) {
    return null;
  }

  const isOnboarding = pathname === "/onboarding";

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: `/confrontation?id=${templateId}`, label: "CX Report" },
    { href: `/journey?id=${templateId}`, label: "Journey" },
    { href: "/playbook", label: "Playbook" },
  ];

  return (
    <header className="border-b border-white/8 bg-sidebar sticky top-0 z-50">
      <div className="max-w-full px-6 flex items-center justify-between h-14">
        <Link href={isOnboarding ? "/" : "/dashboard"} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <span className="text-sm font-bold text-white/80">CX</span>
          </div>
          <span className="text-sm font-bold tracking-tight text-white/80">CX Mate</span>
        </Link>
        {!isOnboarding && (
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href.split("?")[0];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-medium px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "text-white/40 hover:text-white/70 hover:bg-white/8"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
