/**
 * Impact Engine: Business Impact Calculator
 *
 * Calculates the estimated business impact of CX improvements.
 * Takes a moment of truth or failure pattern and estimates the
 * revenue/churn/conversion impact of fixing it.
 *
 * All estimates are ranges (conservative → optimistic) to be
 * presented as directional guidance, not precise predictions.
 */

// ============================================
// Types
// ============================================

export interface CompanyProfile {
  customerCount: number;
  averageACV: number; // Annual Contract Value in USD
  monthlyChurnRate: number; // As percentage (e.g., 3.0 = 3%)
  annualRevenue?: number; // Optional, can be calculated
  salesConversionRate?: number; // Demo-to-close %
  monthlyNewCustomers?: number;
}

export interface ImpactEstimate {
  area: string;
  description: string;
  currentState: string;
  improvedState: string;
  annualRevenueImpact: {
    conservative: number;
    optimistic: number;
  };
  timeToRealize: string;
  effortRequired: "low" | "medium" | "high";
  priorityScore: number; // 1-100, combining impact and effort
  confidence: "high" | "medium" | "low";
}

export type ImpactArea =
  | "churn_reduction"
  | "onboarding_improvement"
  | "conversion_improvement"
  | "expansion_revenue"
  | "support_efficiency"
  | "sales_cycle_reduction";

// ============================================
// Impact Calculation Functions
// ============================================

/**
 * Calculate impact of reducing churn
 */
export function calculateChurnReductionImpact(
  profile: CompanyProfile,
  reductionPercent: number // e.g., 20 means reducing churn by 20%
): ImpactEstimate {
  const currentAnnualChurn = profile.monthlyChurnRate * 12; // Simplified
  const customersLostPerYear = Math.round(
    profile.customerCount * (currentAnnualChurn / 100)
  );
  const revenueLostToChurn = customersLostPerYear * profile.averageACV;

  const customersSaved = Math.round(customersLostPerYear * (reductionPercent / 100));
  const conservativeImpact = Math.round(customersSaved * profile.averageACV * 0.7);
  const optimisticImpact = Math.round(customersSaved * profile.averageACV * 1.0);

  return {
    area: "Churn Reduction",
    description: `Reducing monthly churn from ${profile.monthlyChurnRate}% to ${(
      profile.monthlyChurnRate *
      (1 - reductionPercent / 100)
    ).toFixed(1)}%`,
    currentState: `Losing ~${customersLostPerYear} customers/year ($${revenueLostToChurn.toLocaleString()} ARR)`,
    improvedState: `Saving ~${customersSaved} customers/year`,
    annualRevenueImpact: {
      conservative: conservativeImpact,
      optimistic: optimisticImpact,
    },
    timeToRealize: "3-6 months",
    effortRequired: "medium",
    priorityScore: calculatePriorityScore(
      (conservativeImpact + optimisticImpact) / 2,
      "medium"
    ),
    confidence: "medium",
  };
}

/**
 * Calculate impact of improving onboarding
 */
export function calculateOnboardingImpact(
  profile: CompanyProfile,
  currentActivationRate: number, // % of new customers who reach first value
  improvedActivationRate: number
): ImpactEstimate {
  const monthlyNew = profile.monthlyNewCustomers || Math.round(profile.customerCount * 0.08);
  const currentlyActivated = Math.round(monthlyNew * (currentActivationRate / 100));
  const improvedActivated = Math.round(monthlyNew * (improvedActivationRate / 100));
  const additionalActivated = (improvedActivated - currentlyActivated) * 12;

  // Activated customers have ~3x better retention
  const conservativeImpact = Math.round(additionalActivated * profile.averageACV * 0.5);
  const optimisticImpact = Math.round(additionalActivated * profile.averageACV * 0.8);

  return {
    area: "Onboarding Improvement",
    description: `Improving activation rate from ${currentActivationRate}% to ${improvedActivationRate}%`,
    currentState: `~${currentlyActivated} customers/month reaching first value (${currentActivationRate}%)`,
    improvedState: `~${improvedActivated} customers/month reaching first value (${improvedActivationRate}%)`,
    annualRevenueImpact: {
      conservative: conservativeImpact,
      optimistic: optimisticImpact,
    },
    timeToRealize: "1-3 months",
    effortRequired: "medium",
    priorityScore: calculatePriorityScore(
      (conservativeImpact + optimisticImpact) / 2,
      "medium"
    ),
    confidence: "medium",
  };
}

/**
 * Calculate impact of improving sales conversion
 */
export function calculateConversionImpact(
  profile: CompanyProfile,
  currentConversionRate: number,
  improvedConversionRate: number,
  monthlyDeals: number
): ImpactEstimate {
  const currentWins = Math.round(monthlyDeals * (currentConversionRate / 100));
  const improvedWins = Math.round(monthlyDeals * (improvedConversionRate / 100));
  const additionalWins = (improvedWins - currentWins) * 12;

  const conservativeImpact = Math.round(additionalWins * profile.averageACV * 0.7);
  const optimisticImpact = Math.round(additionalWins * profile.averageACV * 1.0);

  return {
    area: "Sales Conversion Improvement",
    description: `Improving demo-to-close from ${currentConversionRate}% to ${improvedConversionRate}%`,
    currentState: `~${currentWins} deals closed/month at ${currentConversionRate}% conversion`,
    improvedState: `~${improvedWins} deals closed/month at ${improvedConversionRate}% conversion`,
    annualRevenueImpact: {
      conservative: conservativeImpact,
      optimistic: optimisticImpact,
    },
    timeToRealize: "1-3 months",
    effortRequired: "low",
    priorityScore: calculatePriorityScore(
      (conservativeImpact + optimisticImpact) / 2,
      "low"
    ),
    confidence: "medium",
  };
}

/**
 * Calculate impact of capturing expansion revenue
 */
export function calculateExpansionImpact(
  profile: CompanyProfile,
  currentExpansionRate: number, // % of customers who expand annually
  improvedExpansionRate: number,
  averageExpansionAmount: number // Additional ACV from expansion
): ImpactEstimate {
  const currentExpansions = Math.round(
    profile.customerCount * (currentExpansionRate / 100)
  );
  const improvedExpansions = Math.round(
    profile.customerCount * (improvedExpansionRate / 100)
  );
  const additionalExpansions = improvedExpansions - currentExpansions;

  const conservativeImpact = Math.round(additionalExpansions * averageExpansionAmount * 0.6);
  const optimisticImpact = Math.round(additionalExpansions * averageExpansionAmount * 1.0);

  return {
    area: "Expansion Revenue",
    description: `Improving annual expansion rate from ${currentExpansionRate}% to ${improvedExpansionRate}%`,
    currentState: `~${currentExpansions} customers expanding/year at ${currentExpansionRate}% rate`,
    improvedState: `~${improvedExpansions} customers expanding/year at ${improvedExpansionRate}% rate`,
    annualRevenueImpact: {
      conservative: conservativeImpact,
      optimistic: optimisticImpact,
    },
    timeToRealize: "6-12 months",
    effortRequired: "medium",
    priorityScore: calculatePriorityScore(
      (conservativeImpact + optimisticImpact) / 2,
      "medium"
    ),
    confidence: "low",
  };
}

// ============================================
// Quick Impact Estimates (Without Detailed Data)
// ============================================

export interface QuickImpactInput {
  vertical: string;
  companySize: string;
  customerCount?: number;
  estimatedACV?: number;
}

/**
 * Generate impact estimates with minimal input.
 * Uses benchmarks to fill in gaps. Good for Mode A/B companies
 * that don't have detailed metrics yet.
 */
export function generateQuickImpactEstimates(
  input: QuickImpactInput
): ImpactEstimate[] {
  // Use defaults if not provided
  const customerCount = input.customerCount || estimateCustomerCount(input.companySize);
  const acv = input.estimatedACV || estimateACV(input.vertical);
  const churnRate = estimateChurnRate(input.companySize);

  const profile: CompanyProfile = {
    customerCount,
    averageACV: acv,
    monthlyChurnRate: churnRate,
  };

  const estimates: ImpactEstimate[] = [];

  // 1. Churn reduction (always applicable)
  estimates.push(calculateChurnReductionImpact(profile, 25));

  // 2. Onboarding improvement (always applicable)
  estimates.push(calculateOnboardingImpact(profile, 55, 80));

  // 3. Conversion improvement (if they have sales)
  estimates.push(
    calculateConversionImpact(
      profile,
      15,
      22,
      Math.round(customerCount * 0.15)
    )
  );

  // Sort by priority score (highest first)
  return estimates.sort((a, b) => b.priorityScore - a.priorityScore);
}

// ============================================
// Helper / Estimation Functions
// ============================================

function estimateCustomerCount(companySize: string): number {
  const estimates: Record<string, number> = {
    "1-10": 30,
    "11-50": 100,
    "51-150": 350,
    "151-300": 800,
  };
  return estimates[companySize] || 100;
}

function estimateACV(vertical: string): number {
  const estimates: Record<string, number> = {
    b2b_saas: 12000,
    professional_services: 25000,
    marketplace: 5000,
    fintech: 40000,
    ecommerce_b2b: 8000,
    healthtech: 50000,
    other: 15000,
  };
  return estimates[vertical] || 15000;
}

function estimateChurnRate(companySize: string): number {
  const estimates: Record<string, number> = {
    "1-10": 4.0,
    "11-50": 3.0,
    "51-150": 2.0,
    "151-300": 1.5,
  };
  return estimates[companySize] || 3.0;
}

function calculatePriorityScore(
  avgImpact: number,
  effort: "low" | "medium" | "high"
): number {
  const effortMultiplier = { low: 1.5, medium: 1.0, high: 0.6 };
  const impactScore = Math.min(100, Math.round(avgImpact / 1000));
  return Math.round(impactScore * effortMultiplier[effort]);
}

// ============================================
// Build Profile from Onboarding Data
// ============================================

export interface OnboardingProfile {
  profile: CompanyProfile;
  dataSource: "user_provided" | "benchmark_estimated";
  calculations: {
    customerCount: { value: number; source: string };
    averageACV: { value: number; source: string };
    churnRate: { value: number; source: string };
    annualRevenue: { value: number; source: string };
  };
}

/**
 * Maps onboarding string values to a CompanyProfile with numeric data.
 * Returns dataSource to indicate whether we used user data or benchmarks.
 */
export function buildProfileFromOnboarding(input: {
  hasExistingCustomers: boolean;
  customerCount: string;
  roughRevenue: string;
  averageDealSize: string;
  companySize: string;
  vertical: string;
}): OnboardingProfile {
  const hasData = input.hasExistingCustomers;

  // Customer count
  const customerCountMap: Record<string, number> = {
    "1-10": 5,
    "11-50": 30,
    "51-200": 100,
    "200+": 350,
  };
  const customerCount = hasData && input.customerCount
    ? customerCountMap[input.customerCount] || estimateCustomerCount(input.companySize)
    : estimateCustomerCount(input.companySize);

  // Average ACV
  const dealSizeMap: Record<string, number> = {
    under_1k: 500,
    "1k_5k": 3000,
    "5k_20k": 12000,
    "20k_50k": 35000,
    "50k_plus": 75000,
  };
  const averageACV = hasData && input.averageDealSize
    ? dealSizeMap[input.averageDealSize] || estimateACV(input.vertical)
    : estimateACV(input.vertical);

  // Revenue
  const revenueMap: Record<string, number> = {
    pre_revenue: 0,
    under_100k: 50000,
    "100k_500k": 300000,
    "500k_1m": 750000,
    "1m_plus": 1500000,
  };
  const annualRevenue = hasData && input.roughRevenue
    ? revenueMap[input.roughRevenue] || customerCount * averageACV
    : customerCount * averageACV;

  // Churn rate — always benchmarked (we don't ask for it yet)
  const churnRate = estimateChurnRate(input.companySize);

  const dataSource = hasData && input.customerCount && input.averageDealSize
    ? "user_provided" as const
    : "benchmark_estimated" as const;

  return {
    profile: {
      customerCount,
      averageACV: averageACV,
      monthlyChurnRate: churnRate,
      annualRevenue,
    },
    dataSource,
    calculations: {
      customerCount: {
        value: customerCount,
        source: hasData && input.customerCount
          ? `User selected: ${input.customerCount}`
          : `Benchmark for ${input.companySize} company`,
      },
      averageACV: {
        value: averageACV,
        source: hasData && input.averageDealSize
          ? `User selected: ${input.averageDealSize} range`
          : `Industry benchmark for ${input.vertical}`,
      },
      churnRate: {
        value: churnRate,
        source: `Industry benchmark for ${input.companySize} company`,
      },
      annualRevenue: {
        value: annualRevenue,
        source: hasData && input.roughRevenue
          ? `User selected: ${input.roughRevenue} range`
          : `Estimated: ${customerCount} customers × $${averageACV.toLocaleString()} ACV`,
      },
    },
  };
}

// ============================================
// Format helpers for display
// ============================================

export function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toLocaleString()}`;
}

export function formatImpactRange(estimate: ImpactEstimate): string {
  return `${formatCurrency(estimate.annualRevenueImpact.conservative)} - ${formatCurrency(estimate.annualRevenueImpact.optimistic)} annual revenue impact`;
}
