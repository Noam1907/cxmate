"use client";

import { useEffect, useCallback } from "react";
import type { OnboardingData } from "@/types/onboarding";

const STORAGE_KEY = "cx-mate-onboarding-draft";
const STEP_KEY = "cx-mate-onboarding-step";

/**
 * Autosave onboarding data to localStorage.
 * Protects against accidental navigation — user can resume from where they left off.
 */
export function useOnboardingAutosave(data: OnboardingData, step: number) {
  // Save on every change (debounced via useEffect)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(STEP_KEY, String(step));
    } catch {
      // localStorage may be unavailable (private browsing, storage full) — fail silently
    }
  }, [data, step]);
}

/**
 * Load saved draft from localStorage.
 * Returns null if nothing saved or data is corrupted.
 */
export function loadOnboardingDraft(): { data: OnboardingData; step: number } | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const savedStep = localStorage.getItem(STEP_KEY);
    if (!saved) return null;

    const data = JSON.parse(saved) as OnboardingData;
    const step = savedStep ? parseInt(savedStep, 10) : 0;

    // Validate that it's a real draft (must have at least a company name)
    if (!data.companyName) return null;

    return { data, step: isNaN(step) ? 0 : step };
  } catch {
    return null;
  }
}

/**
 * Clear the saved draft (call after successful submission).
 */
export function clearOnboardingDraft() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STEP_KEY);
  } catch {
    // ignore
  }
}
