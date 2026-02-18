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
  customerDescription: string;
  customerSize: string;
  mainChannel: string;

  // Step 4: Pain Points
  biggestChallenge: string;
  painPoints: string[];
  customPainPoint?: string;

  // Step 5: Goals
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
