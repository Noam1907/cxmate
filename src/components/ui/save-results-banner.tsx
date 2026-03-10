"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface SaveResultsBannerProps {
  isPreview: boolean;
  companyName?: string;
}

/**
 * Shows a "Save My Results" prompt to anonymous (preview-mode) users.
 * Checks actual Supabase auth state — hides for signed-in users even
 * if the URL still has ?id=preview.
 */
export function SaveResultsBanner({ isPreview, companyName }: SaveResultsBannerProps) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setIsAuthenticated(!!data.user);
    });
  }, []);

  // Don't show while checking auth state
  if (isAuthenticated === null) return null;
  // Don't show if user is signed in
  if (isAuthenticated) return null;
  // Don't show if not in preview mode
  if (!isPreview) return null;

  const redirectPath = encodeURIComponent(pathname);

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <span className="text-amber-500 text-lg mt-0.5">⚠️</span>
        <div>
          <p className="text-sm font-semibold text-amber-900">
            {companyName
              ? `${companyName}'s results are only saved in this browser.`
              : "Your results are only saved in this browser."}
          </p>
          <p className="text-xs text-amber-700 mt-0.5">
            Sign up to access your journey map, CX report, and playbook from any device. Your results stay with you as your CX evolves.
          </p>
        </div>
      </div>
      <Link href={`/auth?redirect=${redirectPath}`} className="shrink-0">
        <Button size="sm" className="w-full sm:w-auto whitespace-nowrap">
          Save My Results →
        </Button>
      </Link>
    </div>
  );
}
