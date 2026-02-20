"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * /reset — clears all sessionStorage + localStorage and redirects to home.
 * Used for QA testing and fresh-start flows.
 * No JS execution required from browser tools — just navigate to this URL.
 */
export default function ResetPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      sessionStorage.clear();
      localStorage.clear();
    } catch {
      // ignore
    }
    router.replace("/");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground text-sm">Resetting...</p>
    </div>
  );
}
