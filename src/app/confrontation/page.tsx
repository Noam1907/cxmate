"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PageLoading } from "@/components/ui/page-loading";

/**
 * Confrontation page is now merged into the unified CX Brief at /analysis.
 * This page redirects to preserve old URLs and bookmarks.
 */
function RedirectToAnalysis() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const target = id ? `/analysis?id=${id}` : "/analysis";
    router.replace(target);
  }, [router, id]);

  return <PageLoading label="Redirecting to your CX Brief..." />;
}

export default function ConfrontationPage() {
  return (
    <Suspense fallback={<PageLoading label="Loading..." />}>
      <RedirectToAnalysis />
    </Suspense>
  );
}
