/**
 * Tier access control — the gate between free and paid.
 *
 * Plan tiers:
 *   "free"           → anonymous or unpaid users
 *   "full_analysis"  → one-time $149 purchase
 *   "pro"            → $99/mo subscription
 *
 * Feature access matrix:
 *   Feature                  | free | full_analysis | pro
 *   ─────────────────────────┼──────┼───────────────┼─────
 *   journey_map              |  ✅  |      ✅       |  ✅
 *   report_headlines         |  ✅  |      ✅       |  ✅
 *   report_details           |  ❌  |      ✅       |  ✅
 *   playbook                 |  ❌  |      ✅       |  ✅
 *   pdf_export               |  ❌  |      ✅       |  ✅
 *   evidence_wall            |  ❌  |      ✅       |  ✅
 *   unlimited_runs           |  ❌  |      ❌       |  ✅
 *   cx_score                 |  ❌  |      ❌       |  ✅
 *   review_mining            |  ❌  |      ❌       |  ✅
 *   integrations             |  ❌  |      ❌       |  ✅
 */

export type PlanTier = "free" | "full_analysis" | "pro";

export type Feature =
  | "journey_map"
  | "report_headlines"
  | "report_details"
  | "playbook"
  | "pdf_export"
  | "evidence_wall"
  | "unlimited_runs"
  | "cx_score"
  | "review_mining"
  | "integrations";

const ACCESS_MATRIX: Record<Feature, PlanTier[]> = {
  journey_map:       ["free", "full_analysis", "pro"],
  report_headlines:  ["free", "full_analysis", "pro"],
  report_details:    ["full_analysis", "pro"],
  playbook:          ["full_analysis", "pro"],
  pdf_export:        ["full_analysis", "pro"],
  evidence_wall:     ["full_analysis", "pro"],
  unlimited_runs:    ["pro"],
  cx_score:          ["pro"],
  review_mining:     ["pro"],
  integrations:      ["pro"],
};

/** Check if a plan tier has access to a feature */
export function hasAccess(tier: PlanTier, feature: Feature): boolean {
  return ACCESS_MATRIX[feature].includes(tier);
}

/** Check if tier is paid (any paid plan) */
export function isPaid(tier: PlanTier): boolean {
  return tier !== "free";
}

/** Get the minimum tier required for a feature */
export function requiredTier(feature: Feature): PlanTier {
  const tiers = ACCESS_MATRIX[feature];
  if (tiers.includes("free")) return "free";
  if (tiers.includes("full_analysis")) return "full_analysis";
  return "pro";
}

/** Human-readable tier label */
export function tierLabel(tier: PlanTier): string {
  switch (tier) {
    case "free": return "Free";
    case "full_analysis": return "Full Analysis";
    case "pro": return "Pro";
  }
}

/** Upgrade CTA text based on what feature they're trying to access */
export function upgradeCTA(feature: Feature): { label: string; description: string } {
  const tier = requiredTier(feature);
  if (tier === "full_analysis") {
    return {
      label: "Get My Full Analysis — $149",
      description: "See the full details, get your action playbook, and export everything as PDF.",
    };
  }
  return {
    label: "Go Pro — $99/mo",
    description: "Monthly CX Score, unlimited re-runs, and integrations.",
  };
}
