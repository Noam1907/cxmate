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

  // Hide nav on home page, onboarding, and auth
  if (pathname === "/" || pathname === "/onboarding" || pathname.startsWith("/auth")) {
    return null;
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: `/confrontation?id=${templateId}`, label: "CX Report" },
    { href: `/journey?id=${templateId}`, label: "Journey" },
    { href: "/playbook", label: "Playbook" },
  ];

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-12">
        <Link href="/dashboard" className="text-sm font-bold tracking-tight">
          CX Mate
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href.split("?")[0];
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
