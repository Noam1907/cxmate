"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/confrontation?id=preview", label: "CX Report" },
  { href: "/journey?id=preview", label: "Journey" },
  { href: "/playbook", label: "Playbook" },
];

export function NavHeader() {
  const pathname = usePathname();

  // Hide nav on home page and during onboarding
  if (pathname === "/" || pathname === "/onboarding") {
    return null;
  }

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-12">
        <Link href="/dashboard" className="text-sm font-bold tracking-tight">
          CX Mate
        </Link>
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
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
