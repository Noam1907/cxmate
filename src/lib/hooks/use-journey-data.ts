"use client";

import { useEffect, useState } from "react";
import type { GeneratedJourney } from "@/lib/ai/journey-prompt";

interface JourneyData {
  journey: GeneratedJourney | null;
  templateId: string | null;
  onboardingData: Record<string, unknown> | null;
  loading: boolean;
  isPreview: boolean;
}

/**
 * Dual-mode journey data hook.
 *
 * - Preview mode (templateId === "preview"): loads from sessionStorage
 * - Persisted mode (real UUID): fetches from /api/journey/[id]
 *
 * Used by confrontation, journey, dashboard, and playbook pages.
 */
export function useJourneyData(templateId: string | null): JourneyData {
  const [journey, setJourney] = useState<GeneratedJourney | null>(null);
  const [onboardingData, setOnboardingData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  const isPreview = !templateId || templateId === "preview";

  useEffect(() => {
    async function load() {
      setLoading(true);

      if (isPreview) {
        // Preview mode — load from sessionStorage
        try {
          const stored = sessionStorage.getItem("cx-mate-journey");
          if (stored) {
            const data = JSON.parse(stored);
            setJourney(data.journey || null);
            setOnboardingData(data.onboardingData || null);
          }
        } catch {
          console.error("Failed to parse stored journey");
        }
        setLoading(false);
        return;
      }

      // Persisted mode — fetch from API
      try {
        const response = await fetch(`/api/journey/${templateId}`);
        if (response.ok) {
          const data = await response.json();
          setJourney(data.journey || null);
          setOnboardingData(data.onboardingData || null);
        }
      } catch (err) {
        console.error("Failed to load journey from API:", err);
        // Fallback: try sessionStorage
        try {
          const stored = sessionStorage.getItem("cx-mate-journey");
          if (stored) {
            const data = JSON.parse(stored);
            setJourney(data.journey || null);
            setOnboardingData(data.onboardingData || null);
          }
        } catch {
          // nothing we can do
        }
      }

      setLoading(false);
    }

    load();
  }, [templateId, isPreview]);

  return {
    journey,
    templateId,
    onboardingData,
    loading,
    isPreview,
  };
}
