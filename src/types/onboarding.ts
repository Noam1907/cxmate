import type { JourneyType } from "./database";

// ============================================
// Core Types
// ============================================

export type CompanyMaturity = "pre_launch" | "first_customers" | "growing" | "scaling";

export interface OnboardingData {
  // Step 1: Welcome
  companyName: string;
  companyWebsite: string;

  // Step 2: Company Context
  vertical: string;
  customVertical?: string;
  companySize: string;

  // Step 3: Maturity (drives all branching)
  companyMaturity: CompanyMaturity;

  // Step 4: Journey Existence (growing/scaling only)
  hasExistingJourney: "yes" | "no" | "partial" | "";
  existingJourneyDescription?: string;

  // Step 5: Customer Profile (adaptive)
  customerCount: string;
  customerDescription: string;
  customerSize: string;
  mainChannel: string;

  // Step 6: Business Data (growing/scaling only)
  pricingModel: string;
  roughRevenue: string;
  averageDealSize: string;

  // Step 7: Pain Points (maturity-adaptive)
  painPoints: string[];
  biggestChallenge: string;
  customPainPoint?: string;

  // Step 8: Goals (maturity-adaptive)
  primaryGoal: string;
  timeframe: string;
  additionalContext?: string;

  // Competitors (optional, asked after customer profile)
  competitors: string;

  // ============================================
  // Derived fields (computed from maturity, sent to API for backward compat)
  // ============================================
  journeyType: JourneyType;
  hasExistingCustomers: boolean;

  // CX maturity defaults (set based on maturity, not asked)
  measuresNps: boolean;
  measuresCsat: boolean;
  measuresCes: boolean;
  npsResponseCount: string;
  hasJourneyMap: boolean;
  dataVsGut: string;
}

// ============================================
// Maturity → Derived Fields
// ============================================

export function deriveFromMaturity(maturity: CompanyMaturity): Partial<OnboardingData> {
  switch (maturity) {
    case "pre_launch":
      return {
        hasExistingCustomers: false,
        journeyType: "sales",
        measuresNps: false,
        measuresCsat: false,
        measuresCes: false,
        npsResponseCount: "",
        hasJourneyMap: false,
        dataVsGut: "all_gut",
      };
    case "first_customers":
      return {
        hasExistingCustomers: true,
        journeyType: "full_lifecycle",
        measuresNps: false,
        measuresCsat: false,
        measuresCes: false,
        npsResponseCount: "",
        hasJourneyMap: false,
        dataVsGut: "mostly_gut",
      };
    case "growing":
      return {
        hasExistingCustomers: true,
        journeyType: "full_lifecycle",
        measuresNps: false,
        measuresCsat: true,
        measuresCes: false,
        npsResponseCount: "",
        hasJourneyMap: false,
        dataVsGut: "mix",
      };
    case "scaling":
      return {
        hasExistingCustomers: true,
        journeyType: "full_lifecycle",
        measuresNps: true,
        measuresCsat: true,
        measuresCes: false,
        npsResponseCount: "50_100",
        hasJourneyMap: true,
        dataVsGut: "mostly_data",
      };
  }
}

// ============================================
// Options
// ============================================

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

export const CUSTOMER_COUNT_OPTIONS = [
  { value: "1-10", label: "1-10 customers" },
  { value: "11-50", label: "11-50 customers" },
  { value: "51-200", label: "51-200 customers" },
  { value: "200+", label: "200+ customers" },
] as const;

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

export const TIMEFRAME_OPTIONS = [
  { value: "1_month", label: "Within 1 month" },
  { value: "3_months", label: "Within 3 months" },
  { value: "6_months", label: "Within 6 months" },
  { value: "exploring", label: "Just exploring for now" },
] as const;

// ============================================
// Maturity-Adaptive Pain Points
// ============================================

export function getPainPointsForMaturity(maturity: CompanyMaturity) {
  switch (maturity) {
    case "pre_launch":
      return [
        { value: "no_sales_process", label: "Don't know how to structure our sales process" },
        { value: "unclear_value_prop", label: "Can't articulate our value prop clearly" },
        { value: "unknown_buyer_journey", label: "No idea what the buying journey looks like" },
        { value: "losing_deals", label: "Losing deals but don't know why" },
      ];
    case "first_customers":
      return [
        { value: "messy_onboarding", label: "Onboarding is messy / manual" },
        { value: "unclear_value", label: "Not sure if customers are getting value" },
        { value: "inconsistent_process", label: "No consistent process — every customer is different" },
        { value: "worried_about_losing", label: "Worried about losing early customers" },
      ];
    case "growing":
      return [
        { value: "churn", label: "Customers leaving without warning" },
        { value: "handoff_gaps", label: "Gaps between sales handoff and CS" },
        { value: "no_visibility", label: "No visibility into customer health" },
        { value: "no_playbook", label: "Team doesn't have a playbook to follow" },
      ];
    case "scaling":
      return [
        { value: "inconsistent_cx", label: "CX is inconsistent across the team" },
        { value: "late_risk_detection", label: "Can't identify at-risk accounts early enough" },
        { value: "onboarding_scale", label: "Onboarding takes too long / doesn't scale" },
        { value: "no_unified_view", label: "No unified view of the customer lifecycle" },
      ];
  }
}

// ============================================
// Maturity-Adaptive Goals
// ============================================

export function getGoalsForMaturity(maturity: CompanyMaturity) {
  switch (maturity) {
    case "pre_launch":
      return [
        { value: "map_sales_process", label: "Map my sales process end-to-end" },
        { value: "understand_buyer", label: "Understand my buyer's decision journey" },
        { value: "gtm_playbook", label: "Get a clear go-to-market playbook" },
      ];
    case "first_customers":
      return [
        { value: "repeatable_onboarding", label: "Build a repeatable onboarding process" },
        { value: "early_success", label: "Make sure early customers succeed" },
        { value: "first_playbook", label: "Create my first CX playbook" },
      ];
    case "growing":
      return [
        { value: "reduce_churn", label: "Reduce churn" },
        { value: "build_playbook", label: "Build a playbook the whole team can follow" },
        { value: "proactive_cx", label: "Move from reactive to proactive CX" },
      ];
    case "scaling":
      return [
        { value: "unify_journey", label: "Unify sales and CS into one journey" },
        { value: "health_scoring", label: "Implement health scoring and early warning" },
        { value: "scale_cx", label: "Scale CX without scaling headcount" },
      ];
  }
}

// ============================================
// Maturity Display Config
// ============================================

export const MATURITY_OPTIONS = [
  {
    value: "pre_launch" as CompanyMaturity,
    emoji: "🚀",
    label: "Pre-launch / Pre-revenue",
    subtitle: "No paying customers yet — building our go-to-market",
  },
  {
    value: "first_customers" as CompanyMaturity,
    emoji: "🌱",
    label: "First customers",
    subtitle: "1-10 customers — figuring out what works",
  },
  {
    value: "growing" as CompanyMaturity,
    emoji: "📈",
    label: "Growing",
    subtitle: "11-50 customers — building our first playbook",
  },
  {
    value: "scaling" as CompanyMaturity,
    emoji: "🏗️",
    label: "Scaling",
    subtitle: "50+ customers — formalizing and optimizing",
  },
] as const;

export const JOURNEY_EXISTS_OPTIONS = [
  { value: "yes" as const, label: "Yes, we have something", description: "We have a documented journey or CX process" },
  { value: "no" as const, label: "Not really", description: "It's all in people's heads" },
  { value: "partial" as const, label: "It's outdated / incomplete", description: "We've tried but it needs a refresh" },
] as const;
