"use client";

import { useState, useCallback, useRef } from "react";
import type { EnrichedCompanyData, EnrichmentResponse } from "@/types/enrichment";

interface UseCompanyEnrichmentReturn {
  /** The enrichment result, or null if not yet enriched */
  enrichment: EnrichedCompanyData | null;
  /** Whether enrichment is currently in progress */
  isEnriching: boolean;
  /** Any error message from the enrichment call */
  error: string | null;
  /** Trigger enrichment for a company */
  enrich: (companyName: string, companyWebsite?: string) => Promise<EnrichedCompanyData | null>;
  /** Clear the enrichment data */
  clear: () => void;
}

/**
 * Hook for company auto-enrichment.
 *
 * Call `enrich(companyName, website)` after the user enters their company info.
 * Returns structured data for pre-filling onboarding steps.
 *
 * Features:
 * - 15-second timeout
 * - Deduplication (won't re-enrich the same company)
 * - Graceful failure (returns null, doesn't throw)
 */
export function useCompanyEnrichment(): UseCompanyEnrichmentReturn {
  const [enrichment, setEnrichment] = useState<EnrichedCompanyData | null>(null);
  const [isEnriching, setIsEnriching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastEnrichedRef = useRef<string>("");

  const enrich = useCallback(
    async (
      companyName: string,
      companyWebsite?: string
    ): Promise<EnrichedCompanyData | null> => {
      // Skip if company name too short
      if (!companyName || companyName.trim().length < 2) return null;

      // Skip if we already enriched this exact company
      const key = `${companyName.trim().toLowerCase()}|${companyWebsite || ""}`;
      if (key === lastEnrichedRef.current && enrichment) return enrichment;

      setIsEnriching(true);
      setError(null);

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        const response = await fetch("/api/enrich-company", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            companyName: companyName.trim(),
            companyWebsite: companyWebsite?.trim() || "",
          }),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!response.ok) {
          setIsEnriching(false);
          return null;
        }

        const data: EnrichmentResponse = await response.json();

        if (data.success && data.enrichedData) {
          setEnrichment(data.enrichedData);
          lastEnrichedRef.current = key;
          setIsEnriching(false);
          return data.enrichedData;
        }

        setIsEnriching(false);
        return null;
      } catch (err) {
        const isTimeout =
          err instanceof DOMException && err.name === "AbortError";
        setError(isTimeout ? "Analysis timed out" : "Could not analyze company");
        setIsEnriching(false);
        return null;
      }
    },
    [enrichment]
  );

  const clear = useCallback(() => {
    setEnrichment(null);
    setError(null);
    lastEnrichedRef.current = "";
  }, []);

  return { enrichment, isEnriching, error, enrich, clear };
}
