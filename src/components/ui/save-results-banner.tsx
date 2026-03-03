"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SaveResultsBannerProps {
  isPreview: boolean;
  companyName?: string;
}

/**
 * Shows a "Save My Results" prompt to anonymous (preview-mode) users.
 * Renders nothing for authenticated users.
 */
export function SaveResultsBanner({ isPreview, companyName }: SaveResultsBannerProps) {
  if (!isPreview) return null;

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
            Create a free account to access your journey map, CX report, and playbook from any device — and keep them forever.
          </p>
        </div>
      </div>
      <Link href="/auth" className="shrink-0">
        <Button size="sm" className="w-full sm:w-auto whitespace-nowrap">
          Save My Results →
        </Button>
      </Link>
    </div>
  );
}
