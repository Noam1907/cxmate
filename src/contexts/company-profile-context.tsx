"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { OnboardingData } from "@/types/onboarding";
import type { GeneratedJourney } from "@/lib/ai/journey-prompt";
import type { EnrichedCompanyData } from "@/types/enrichment";

// ============================================
// Types
// ============================================

interface CompanyProfileContextValue {
  // Onboarding data (live during onboarding, from storage post-onboarding)
  onboardingData: Partial<OnboardingData> | null;
  setOnboardingData: (data: Partial<OnboardingData>) => void;

  // Generated journey data (null until generation completes)
  journey: GeneratedJourney | null;
  setJourney: (journey: GeneratedJourney | null) => void;

  // Template ID for linking
  templateId: string | null;
  setTemplateId: (id: string) => void;

  // AI-enriched company data (null until enrichment completes)
  enrichment: EnrichedCompanyData | null;
  setEnrichment: (data: EnrichedCompanyData | null) => void;

  // State flag — true when journey is generated
  isComplete: boolean;

  // Hydrate from sessionStorage (called by post-onboarding pages)
  hydrateFromStorage: () => void;
}

// ============================================
// Context
// ============================================

const CompanyProfileContext = createContext<CompanyProfileContextValue | null>(
  null
);

// ============================================
// Provider
// ============================================

export function CompanyProfileProvider({ children }: { children: ReactNode }) {
  const [onboardingData, setOnboardingData] =
    useState<Partial<OnboardingData> | null>(null);
  const [journey, setJourney] = useState<GeneratedJourney | null>(null);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [enrichment, setEnrichment] = useState<EnrichedCompanyData | null>(null);

  const isComplete = journey !== null;

  const hydrateFromStorage = useCallback(() => {
    try {
      const stored = sessionStorage.getItem("cx-mate-journey");
      if (stored) {
        const data = JSON.parse(stored);
        if (data.onboardingData) {
          setOnboardingData(data.onboardingData);
        }
        if (data.journey) {
          setJourney(data.journey);
        }
        if (data.templateId) {
          setTemplateId(data.templateId);
        }
      }
    } catch {
      console.error("Failed to hydrate company profile from sessionStorage");
    }
  }, []);

  return (
    <CompanyProfileContext.Provider
      value={{
        onboardingData,
        setOnboardingData,
        journey,
        setJourney,
        templateId,
        setTemplateId,
        enrichment,
        setEnrichment,
        isComplete,
        hydrateFromStorage,
      }}
    >
      {children}
    </CompanyProfileContext.Provider>
  );
}

// ============================================
// Hook
// ============================================

export function useCompanyProfile(): CompanyProfileContextValue {
  const context = useContext(CompanyProfileContext);
  if (!context) {
    throw new Error(
      "useCompanyProfile must be used within a CompanyProfileProvider"
    );
  }
  return context;
}
