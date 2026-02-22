import type { JourneyType } from "./database";

// ============================================
// Core Types
// ============================================

export type CompanyMaturity = "pre_launch" | "first_customers" | "growing" | "scaling";

export interface OnboardingData {
  // Step 1: Welcome
  userName?: string;
  userRole?: string;
  companyName: string;
  companyWebsite: string;

  // Tech stack (asked after business data or customer profile)
  currentTools?: string;

  // Step 2: Company Context
  vertical: string;           // Business model: b2b_saas / professional_services / marketplace / ecommerce_b2b / other
  customVertical?: string;    // Free text when vertical = "other"
  industry?: string;          // Industry vertical: fintech / healthtech / etc. (optional qualifier)
  companySize: string;

  // Step 3: Maturity (drives all branching)
  companyMaturity: CompanyMaturity;

  // Step 4: Journey Existence (growing/scaling only)
  hasExistingJourney: "yes" | "no" | "partial" | "";
  existingJourneyComponents?: string[];
  existingJourneyDescription?: string;
  existingJourneyFileName?: string;

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
  customGoal?: string;
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
  { value: "self_serve", label: "Self-serve / product-led", description: "Customers sign up, onboard, and get value on their own" },
  { value: "sales_led", label: "Sales-led", description: "A salesperson guides evaluation and purchase" },
  { value: "partner", label: "Partner / referral", description: "Customers come through resellers or word of mouth" },
  { value: "mixed", label: "Mix of channels", description: "Some customers self-serve, others go through sales" },
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
  { value: "1m_5m", label: "$1M - $5M ARR" },
  { value: "5m_20m", label: "$5M - $20M ARR" },
  { value: "20m_plus", label: "$20M+ ARR" },
] as const;

export const DEAL_SIZE_OPTIONS = [
  { value: "under_1k", label: "Under $1K / year" },
  { value: "1k_5k", label: "$1K - $5K / year" },
  { value: "5k_20k", label: "$5K - $20K / year" },
  { value: "20k_50k", label: "$20K - $50K / year" },
  { value: "50k_100k", label: "$50K - $100K / year" },
  { value: "100k_500k", label: "$100K - $500K / year" },
  { value: "500k_plus", label: "$500K+ / year" },
] as const;

export const TIMEFRAME_OPTIONS = [
  { value: "1_month", label: "Within 1 month" },
  { value: "3_months", label: "Within 3 months" },
  { value: "6_months", label: "Within 6 months" },
  { value: "exploring", label: "Just exploring for now" },
] as const;

/**
 * Maps goals to realistic expected timeframes.
 * CX Mate suggests the timeframe — user confirms or adjusts.
 */
export const GOAL_TIMEFRAME_MAP: Record<string, { timeframe: string; explanation: string }> = {
  // Pre-launch
  map_sales_process: { timeframe: "1_month", explanation: "Sales process mapping can show results within 2-4 weeks" },
  understand_buyer: { timeframe: "1_month", explanation: "Buyer journey clarity is achievable within a few weeks" },
  gtm_playbook: { timeframe: "3_months", explanation: "A solid GTM playbook needs 1-2 months to build and validate" },
  differentiate: { timeframe: "3_months", explanation: "Differentiation takes research and market testing" },
  // First customers
  repeatable_onboarding: { timeframe: "3_months", explanation: "Building repeatable onboarding typically takes 6-10 weeks" },
  early_success: { timeframe: "1_month", explanation: "Quick wins for early customer success are achievable fast" },
  first_playbook: { timeframe: "3_months", explanation: "A first CX playbook takes 4-8 weeks to build right" },
  reduce_support_load: { timeframe: "3_months", explanation: "Support optimization shows impact in 6-10 weeks" },
  find_expansion: { timeframe: "6_months", explanation: "Expansion motions take time to identify and test" },
  // Growing
  reduce_churn: { timeframe: "3_months", explanation: "Churn reduction requires 2-3 months of changes + measurement" },
  build_playbook: { timeframe: "3_months", explanation: "A team-wide playbook needs 6-10 weeks to build and roll out" },
  proactive_cx: { timeframe: "6_months", explanation: "Moving to proactive CX is a 3-6 month transformation" },
  fix_onboarding: { timeframe: "3_months", explanation: "Onboarding fixes typically show impact in 8-12 weeks" },
  close_handoff_gaps: { timeframe: "3_months", explanation: "Sales-to-CS alignment takes 6-10 weeks to formalize" },
  // Scaling
  unify_journey: { timeframe: "6_months", explanation: "Unifying the journey is a 4-6 month initiative" },
  health_scoring: { timeframe: "6_months", explanation: "Health scoring needs data collection + calibration time" },
  scale_cx: { timeframe: "6_months", explanation: "Scaling CX without headcount is a 4-6 month project" },
  fix_onboarding_scale: { timeframe: "3_months", explanation: "Onboarding automation typically takes 8-12 weeks" },
  drive_expansion: { timeframe: "6_months", explanation: "Systematic expansion takes 3-6 months to build" },
  // Default
  something_else: { timeframe: "3_months", explanation: "Most CX improvements show meaningful results in 2-3 months" },
};

// ============================================
// Maturity-Adaptive Pain Points
// ============================================

// Pain points ordered by customer lifecycle stage: Acquire → Onboard → Enable → Retain → Grow
export function getPainPointsForMaturity(maturity: CompanyMaturity) {
  switch (maturity) {
    case "pre_launch":
      return [
        // Acquisition / Sales
        { value: "no_sales_process", label: "Don't have a structured sales process yet", category: "acquisition" as const },
        { value: "unknown_buyer_journey", label: "Don't know what the buying journey looks like", category: "acquisition" as const },
        { value: "losing_deals", label: "Losing deals but don't know why", category: "acquisition" as const },
        { value: "long_sales_cycle", label: "Sales conversations drag on too long", category: "acquisition" as const },
        // Positioning / Messaging
        { value: "unclear_value_prop", label: "Hard to explain what we do in a clear way", category: "acquisition" as const },
        { value: "no_competitive_edge", label: "Not sure how to stand out from competitors", category: "acquisition" as const },
        // Pricing / Planning
        { value: "pricing_uncertainty", label: "Not confident in our pricing or packaging", category: "operations" as const },
        { value: "no_gtm_plan", label: "No clear go-to-market plan", category: "operations" as const },
      ];
    case "first_customers":
      return [
        // Acquisition
        { value: "inconsistent_pipeline", label: "No repeatable way to find new customers", category: "acquisition" as const },
        // Onboarding
        { value: "messy_onboarding", label: "Onboarding is messy and inconsistent", category: "retention" as const },
        { value: "onboarding_too_slow", label: "Takes too long for customers to see value", category: "retention" as const },
        // Retention / Health
        { value: "unclear_value", label: "Not sure if customers are actually getting value", category: "retention" as const },
        { value: "worried_about_losing", label: "Worried about losing early customers", category: "retention" as const },
        { value: "no_feedback_loop", label: "No way to know if customers are happy or struggling", category: "operations" as const },
        // Operations
        { value: "inconsistent_process", label: "Every customer is handled differently", category: "operations" as const },
        { value: "support_overwhelm", label: "Spending too much time on support / handholding", category: "operations" as const },
        // Expansion
        { value: "expansion_unknown", label: "Don't know when or how to upsell", category: "acquisition" as const },
      ];
    case "growing":
      return [
        // Acquisition / Handoff
        { value: "handoff_gaps", label: "Sales-to-CS handoff is broken or incomplete", category: "operations" as const },
        // Onboarding
        { value: "onboarding_too_long", label: "Onboarding takes too long — customers lose patience", category: "retention" as const },
        { value: "implementation_fails", label: "Customers buy but never fully implement", category: "retention" as const },
        // Customer Health / Retention
        { value: "churn", label: "Customers leaving without warning", category: "retention" as const },
        { value: "no_visibility", label: "No visibility into which accounts are at risk", category: "operations" as const },
        { value: "reactive_support", label: "Always firefighting — can't get ahead of issues", category: "operations" as const },
        // Operations / Playbook
        { value: "no_playbook", label: "Team doesn't have a consistent playbook to follow", category: "operations" as const },
        { value: "manual_processes", label: "Too many manual steps — can't keep up with growth", category: "operations" as const },
        // Expansion
        { value: "expansion_missed", label: "Missing upsell and expansion opportunities", category: "acquisition" as const },
      ];
    case "scaling":
      return [
        // Acquisition / Handoff
        { value: "handoff_gaps", label: "Sales-to-CS handoff gaps are hurting retention", category: "operations" as const },
        // Onboarding
        { value: "onboarding_scale", label: "Onboarding doesn't scale — too many manual steps", category: "operations" as const },
        { value: "implementation_fails", label: "Customers churn before fully adopting the product", category: "retention" as const },
        // Customer Health / Retention
        { value: "late_risk_detection", label: "Can't identify at-risk accounts early enough", category: "retention" as const },
        { value: "inconsistent_cx", label: "CX quality is inconsistent across the team", category: "operations" as const },
        // Operations / Visibility
        { value: "no_unified_view", label: "No unified view of the customer lifecycle", category: "operations" as const },
        { value: "data_silos", label: "Customer data is scattered across too many tools", category: "operations" as const },
        { value: "no_health_scoring", label: "No health scoring or early warning system", category: "operations" as const },
        // Expansion
        { value: "expansion_missed", label: "Missing expansion revenue — no systematic upsell motion", category: "acquisition" as const },
        { value: "no_qbr_process", label: "No structured business review or renewal process", category: "operations" as const },
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
        { value: "differentiate", label: "Stand out from competitors" },
        { value: "something_else", label: "Something else" },
      ];
    case "first_customers":
      return [
        { value: "repeatable_onboarding", label: "Build a repeatable onboarding process" },
        { value: "early_success", label: "Make sure early customers succeed" },
        { value: "first_playbook", label: "Create my first CX playbook" },
        { value: "reduce_support_load", label: "Reduce support burden on the team" },
        { value: "find_expansion", label: "Find upsell / expansion opportunities" },
        { value: "something_else", label: "Something else" },
      ];
    case "growing":
      return [
        { value: "reduce_churn", label: "Reduce churn" },
        { value: "build_playbook", label: "Build a playbook the whole team can follow" },
        { value: "proactive_cx", label: "Move from reactive to proactive CX" },
        { value: "fix_onboarding", label: "Fix onboarding / implementation" },
        { value: "close_handoff_gaps", label: "Close gaps between sales and CS" },
        { value: "something_else", label: "Something else" },
      ];
    case "scaling":
      return [
        { value: "unify_journey", label: "Unify sales and CS into one journey" },
        { value: "health_scoring", label: "Implement health scoring and early warning" },
        { value: "scale_cx", label: "Scale CX without scaling headcount" },
        { value: "fix_onboarding_scale", label: "Make onboarding scalable" },
        { value: "drive_expansion", label: "Systematize expansion revenue" },
        { value: "something_else", label: "Something else" },
      ];
  }
}

// ============================================
// Pain → Goal Connection Map
// ============================================

const PAIN_TO_GOAL_MAP: Record<string, string[]> = {
  // Pre-launch pains
  no_sales_process: ["map_sales_process", "gtm_playbook"],
  unclear_value_prop: ["differentiate", "understand_buyer"],
  unknown_buyer_journey: ["understand_buyer", "map_sales_process"],
  losing_deals: ["map_sales_process", "differentiate"],
  no_competitive_edge: ["differentiate", "gtm_playbook"],
  pricing_uncertainty: ["gtm_playbook"],
  // First customers pains
  messy_onboarding: ["repeatable_onboarding", "first_playbook"],
  unclear_value: ["early_success", "first_playbook"],
  inconsistent_process: ["first_playbook", "repeatable_onboarding"],
  worried_about_losing: ["early_success", "repeatable_onboarding"],
  no_feedback_loop: ["early_success", "first_playbook"],
  support_overwhelm: ["reduce_support_load", "repeatable_onboarding"],
  expansion_unknown: ["find_expansion"],
  // Growing pains
  churn: ["reduce_churn", "proactive_cx"],
  handoff_gaps: ["close_handoff_gaps", "build_playbook"],
  onboarding_too_long: ["fix_onboarding", "build_playbook"],
  implementation_fails: ["fix_onboarding", "reduce_churn", "fix_onboarding_scale"],
  no_visibility: ["proactive_cx", "reduce_churn"],
  no_playbook: ["build_playbook"],
  reactive_support: ["proactive_cx", "build_playbook"],
  // Scaling pains
  inconsistent_cx: ["unify_journey", "scale_cx"],
  late_risk_detection: ["health_scoring", "scale_cx"],
  onboarding_scale: ["fix_onboarding_scale", "scale_cx"],
  no_unified_view: ["unify_journey", "health_scoring"],
  expansion_missed: ["drive_expansion"],
  data_silos: ["unify_journey", "health_scoring"],
};

/**
 * Returns goals ordered by relevance to selected pains.
 * Goals connected to pains appear first (tagged as related),
 * followed by other maturity-appropriate goals.
 */
export function getGoalsForPainAndMaturity(
  maturity: CompanyMaturity,
  painPoints: string[],
): Array<{ value: string; label: string; relatedToPain: boolean }> {
  const allGoals = getGoalsForMaturity(maturity);

  // Collect goal values connected to selected pains
  const relatedGoalValues = new Set<string>();
  for (const pain of painPoints) {
    const goals = PAIN_TO_GOAL_MAP[pain];
    if (goals) {
      goals.forEach((g) => relatedGoalValues.add(g));
    }
  }

  // Tag and sort: related goals first, then others, "something_else" always last
  const tagged = allGoals.map((goal) => ({
    ...goal,
    relatedToPain: relatedGoalValues.has(goal.value),
  }));

  return tagged.sort((a, b) => {
    if (a.value === "something_else") return 1;
    if (b.value === "something_else") return -1;
    if (a.relatedToPain && !b.relatedToPain) return -1;
    if (!a.relatedToPain && b.relatedToPain) return 1;
    return 0;
  });
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
  { value: "yes" as const, label: "Yes — we have documented processes", description: "Onboarding flows, playbooks, training timelines, or other documented CX processes" },
  { value: "partial" as const, label: "Partially — some things are documented", description: "We have bits and pieces, but it's incomplete or outdated" },
  { value: "no" as const, label: "Not yet — it's all in people's heads", description: "We handle things case by case, no formal documentation" },
] as const;
