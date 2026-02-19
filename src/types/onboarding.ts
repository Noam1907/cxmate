import type { JourneyType } from "./database";

export interface OnboardingData {
  // Step 1: Company Basics
  companyName: string;
  vertical: string;
  companySize: string;
  customVertical?: string;

  // Step 2: Journey Type
  journeyType: JourneyType;

  // Step 3: Customer Profile
  hasExistingCustomers: boolean;
  customerCount: string;
  customerDescription: string;
  customerSize: string;
  mainChannel: string;

  // Step 3B: Business Data (shown when hasExistingCustomers)
  pricingModel: string;
  roughRevenue: string;
  averageDealSize: string;

  // Step 4: CX Maturity
  measuresNps: boolean;
  measuresCsat: boolean;
  measuresCes: boolean;
  npsResponseCount: string;
  hasJourneyMap: boolean;
  dataVsGut: string;

  // Step 5: Pain Points
  biggestChallenge: string;
  painPoints: string[];
  customPainPoint?: string;

  // Step 6: Goals
  primaryGoal: string;
  timeframe: string;
  additionalContext?: string;
}

export const COMPANY_SIZES = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-150", label: "51-150 employees" },
  { value: "151-300", label: "151-300 employees" },
  { value: "300+", label: "300+ employees" },
] as const;

export const CUSTOMER_SIZES = [
  { value: "smb", label: "Small businesses" },
  { value: "mid_market", label: "Mid-market companies" },
  { value: "enterprise", label: "Enterprise" },
  { value: "mixed", label: "Mix of sizes" },
] as const;

export const MAIN_CHANNELS = [
  { value: "self_serve", label: "Self-serve / product-led" },
  { value: "sales_led", label: "Sales-led" },
  { value: "partner", label: "Partner / referral" },
  { value: "mixed", label: "Mix of channels" },
] as const;

export const PAIN_POINT_OPTIONS = [
  { value: "losing_deals", label: "Losing deals we should be winning" },
  { value: "slow_onboarding", label: "Slow or messy onboarding" },
  { value: "low_adoption", label: "Customers not using the product fully" },
  { value: "churn", label: "Customers leaving without warning" },
  { value: "no_playbook", label: "No consistent playbook across the team" },
  { value: "handoff_gaps", label: "Gaps between sales and customer success" },
  { value: "reactive", label: "Always reacting instead of preventing issues" },
  { value: "no_visibility", label: "No visibility into customer health" },
] as const;

export const GOAL_OPTIONS = [
  { value: "reduce_churn", label: "Reduce customer churn" },
  { value: "improve_onboarding", label: "Improve onboarding experience" },
  { value: "increase_conversion", label: "Increase sales conversion" },
  { value: "build_playbook", label: "Build a CX playbook for the team" },
  { value: "unify_journey", label: "Unify sales and CS into one journey" },
  { value: "proactive_cx", label: "Move from reactive to proactive CX" },
] as const;

export const TIMEFRAME_OPTIONS = [
  { value: "1_month", label: "Within 1 month" },
  { value: "3_months", label: "Within 3 months" },
  { value: "6_months", label: "Within 6 months" },
  { value: "exploring", label: "Just exploring for now" },
] as const;

// Customer count (shown when hasExistingCustomers)
export const CUSTOMER_COUNT_OPTIONS = [
  { value: "1-10", label: "1-10 customers" },
  { value: "11-50", label: "11-50 customers" },
  { value: "51-200", label: "51-200 customers" },
  { value: "200+", label: "200+ customers" },
] as const;

// Business data (shown when hasExistingCustomers)
export const PRICING_MODEL_OPTIONS = [
  { value: "packages", label: "Package tiers", description: "Good / Better / Best" },
  { value: "a_la_carte", label: "A la carte", description: "Per-feature or per-seat" },
  { value: "usage_based", label: "Usage-based", description: "Pay for what you use" },
  { value: "hybrid", label: "Hybrid / mix", description: "Combination model" },
] as const;

export const REVENUE_RANGE_OPTIONS = [
  { value: "pre_revenue", label: "Pre-revenue" },
  { value: "under_100k", label: "Under $100K ARR" },
  { value: "100k_500k", label: "$100K - $500K ARR" },
  { value: "500k_1m", label: "$500K - $1M ARR" },
  { value: "1m_plus", label: "$1M+ ARR" },
] as const;

export const DEAL_SIZE_OPTIONS = [
  { value: "under_1k", label: "Under $1K / year" },
  { value: "1k_5k", label: "$1K - $5K / year" },
  { value: "5k_20k", label: "$5K - $20K / year" },
  { value: "20k_50k", label: "$20K - $50K / year" },
  { value: "50k_plus", label: "$50K+ / year" },
] as const;

// CX Maturity
export const NPS_RESPONSE_OPTIONS = [
  { value: "under_50", label: "Under 50 responses" },
  { value: "50_100", label: "50-100 responses" },
  { value: "100_plus", label: "100+ responses" },
] as const;

export const DATA_VS_GUT_OPTIONS = [
  { value: "all_gut", label: "All gut feel", description: "We go with instinct" },
  { value: "mostly_gut", label: "Mostly gut", description: "Some data, mostly instinct" },
  { value: "mix", label: "Mix of both", description: "Data and instinct together" },
  { value: "mostly_data", label: "Mostly data", description: "Data-driven with some intuition" },
  { value: "data_driven", label: "Fully data-driven", description: "Everything measured" },
] as const;
