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
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-full px-6 flex items-center justify-between h-14">
        <Link href={isOnboarding ? "/" : "/dashboard"} className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">CX</span>
          </div>
          <span className="text-sm font-semibold tracking-tight text-slate-800">CX Mate</span>
        </Link>
        {!isOnboarding && (
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
                      ? "bg-teal-50 text-teal-700 font-semibold"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
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
