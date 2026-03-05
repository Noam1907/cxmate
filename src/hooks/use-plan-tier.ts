/**
 * usePlanTier — client hook that fetches the user's current plan tier.
 *
 * Returns { tier, loading, isPaid, canAccess }.
 * For anonymous users, tier is always "free".
 * Caches the result for the lifetime of the component.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import type { PlanTier, Feature } from "@/lib/tier-access";
import { hasAccess, isPaid as isPaidCheck } from "@/lib/tier-access";

interface UsePlanTierResult {
  tier: PlanTier;
  loading: boolean;
  isPaid: boolean;
  canAccess: (feature: Feature) => boolean;
  refetch: () => void;
}

export function usePlanTier(): UsePlanTierResult {
  const [tier, setTier] = useState<PlanTier>("free");
  const [loading, setLoading] = useState(true);

  const fetchTier = useCallback(async () => {
    try {
      const res = await fetch("/api/billing/plan-tier");
      if (res.ok) {
        const data = await res.json();
        setTier(data.tier ?? "free");
      }
    } catch {
      // Default to free on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTier();
  }, [fetchTier]);

  return {
    tier,
    loading,
    isPaid: isPaidCheck(tier),
    canAccess: (feature: Feature) => hasAccess(tier, feature),
    refetch: fetchTier,
  };
}
