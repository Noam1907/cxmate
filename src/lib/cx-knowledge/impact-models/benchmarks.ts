/**
 * Impact Engine: Vertical & Size Benchmarks
 *
 * Industry benchmarks for key CX and business metrics, segmented by
 * vertical and company size. These power the impact calculations
 * ("if you fix this, here's the estimated business impact").
 *
 * Sources: OpenView, Bessemer, SaaS Capital, Gainsight, Totango,
 * ProfitWell, ChartMogul — composite averages from public reports.
 *
 * See also: ../enterprise-cx-maturity.ts for enterprise CX maturity
 * benchmarks (Qualtrics XM Institute 2025 + Gladly 2026) that provide
 * industry-wide context for how companies perform on CX.
 *
 * All numbers are estimates/ranges and should be presented as such.
 */

// ============================================
// Types
// ============================================

export type CompanySize = "1-10" | "11-50" | "51-150" | "151-300";
export type Vertical =
  | "b2b_saas"
  | "professional_services"
  | "marketplace"
  | "fintech"
  | "ecommerce_b2b"
  | "healthtech"
  | "other";

export interface VerticalBenchmark {
  vertical: Vertical;
  metrics: BenchmarkMetrics;
}

export interface SizeBenchmark {
  size: CompanySize;
  metrics: BenchmarkMetrics;
}

export interface BenchmarkMetrics {
  // Revenue metrics
  averageACV: { low: number; median: number; high: number }; // Annual Contract Value in USD
  monthlyChurnRate: { good: number; average: number; poor: number }; // % monthly
  annualChurnRate: { good: number; average: number; poor: number }; // % annual
  netRevenueRetention: { good: number; average: number; poor: number }; // % NRR

  // Sales metrics
  salesCycleLength: { fast: string; average: string; slow: string };
  demoToCloseRate: { good: number; average: number; poor: number }; // %
  trialToCloseRate: { good: number; average: number; poor: number }; // %

  // CX metrics
  onboardingCompletionRate: { good: number; average: number; poor: number }; // %
  timeToFirstValue: { good: string; average: string; poor: string };
  npsScore: { good: number; average: number; poor: number };
  csatScore: { good: number; average: number; poor: number }; // %

  // Engagement metrics
  weeklyActiveUserRate: { good: number; average: number; poor: number }; // % of seats
  supportTicketsPerMonth: { low: string; average: string; high: string };
}

// ============================================
// Vertical Benchmarks
// ============================================

export const VERTICAL_BENCHMARKS: VerticalBenchmark[] = [
  {
    vertical: "b2b_saas",
    metrics: {
      averageACV: { low: 3000, median: 12000, high: 50000 },
      monthlyChurnRate: { good: 1.5, average: 3.0, poor: 5.0 },
      annualChurnRate: { good: 10, average: 25, poor: 40 },
      netRevenueRetention: { good: 120, average: 105, poor: 85 },
      salesCycleLength: { fast: "2-3 weeks", average: "4-8 weeks", slow: "3-6 months" },
      demoToCloseRate: { good: 30, average: 20, poor: 10 },
      trialToCloseRate: { good: 25, average: 15, poor: 5 },
      onboardingCompletionRate: { good: 85, average: 65, poor: 40 },
      timeToFirstValue: { good: "< 3 days", average: "7-14 days", poor: "> 30 days" },
      npsScore: { good: 50, average: 30, poor: 10 },
      csatScore: { good: 90, average: 80, poor: 65 },
      weeklyActiveUserRate: { good: 75, average: 55, poor: 30 },
      supportTicketsPerMonth: { low: "< 2 per customer", average: "2-5 per customer", high: "> 5 per customer" },
    },
  },
  {
    vertical: "professional_services",
    metrics: {
      averageACV: { low: 5000, median: 25000, high: 100000 },
      monthlyChurnRate: { good: 1.0, average: 2.0, poor: 4.0 },
      annualChurnRate: { good: 8, average: 18, poor: 35 },
      netRevenueRetention: { good: 115, average: 102, poor: 90 },
      salesCycleLength: { fast: "2-4 weeks", average: "6-12 weeks", slow: "3-6 months" },
      demoToCloseRate: { good: 35, average: 22, poor: 12 },
      trialToCloseRate: { good: 20, average: 12, poor: 5 },
      onboardingCompletionRate: { good: 90, average: 75, poor: 50 },
      timeToFirstValue: { good: "< 1 week", average: "2-4 weeks", poor: "> 6 weeks" },
      npsScore: { good: 55, average: 35, poor: 15 },
      csatScore: { good: 92, average: 82, poor: 68 },
      weeklyActiveUserRate: { good: 70, average: 50, poor: 25 },
      supportTicketsPerMonth: { low: "< 1 per customer", average: "1-3 per customer", high: "> 3 per customer" },
    },
  },
  {
    vertical: "marketplace",
    metrics: {
      averageACV: { low: 1000, median: 5000, high: 25000 },
      monthlyChurnRate: { good: 2.0, average: 4.0, poor: 7.0 },
      annualChurnRate: { good: 15, average: 35, poor: 55 },
      netRevenueRetention: { good: 110, average: 95, poor: 75 },
      salesCycleLength: { fast: "1-2 weeks", average: "2-4 weeks", slow: "1-3 months" },
      demoToCloseRate: { good: 25, average: 15, poor: 8 },
      trialToCloseRate: { good: 20, average: 12, poor: 5 },
      onboardingCompletionRate: { good: 75, average: 55, poor: 30 },
      timeToFirstValue: { good: "< 1 day", average: "3-7 days", poor: "> 14 days" },
      npsScore: { good: 45, average: 25, poor: 5 },
      csatScore: { good: 85, average: 72, poor: 55 },
      weeklyActiveUserRate: { good: 60, average: 40, poor: 20 },
      supportTicketsPerMonth: { low: "< 3 per customer", average: "3-8 per customer", high: "> 8 per customer" },
    },
  },
  {
    vertical: "fintech",
    metrics: {
      averageACV: { low: 10000, median: 40000, high: 150000 },
      monthlyChurnRate: { good: 0.8, average: 1.5, poor: 3.0 },
      annualChurnRate: { good: 5, average: 12, poor: 25 },
      netRevenueRetention: { good: 130, average: 112, poor: 95 },
      salesCycleLength: { fast: "4-6 weeks", average: "8-16 weeks", slow: "4-9 months" },
      demoToCloseRate: { good: 25, average: 15, poor: 8 },
      trialToCloseRate: { good: 15, average: 8, poor: 3 },
      onboardingCompletionRate: { good: 80, average: 60, poor: 35 },
      timeToFirstValue: { good: "< 2 weeks", average: "4-8 weeks", poor: "> 12 weeks" },
      npsScore: { good: 45, average: 25, poor: 5 },
      csatScore: { good: 88, average: 75, poor: 60 },
      weeklyActiveUserRate: { good: 80, average: 60, poor: 35 },
      supportTicketsPerMonth: { low: "< 1 per customer", average: "1-3 per customer", high: "> 5 per customer" },
    },
  },
  {
    vertical: "ecommerce_b2b",
    metrics: {
      averageACV: { low: 2000, median: 8000, high: 35000 },
      monthlyChurnRate: { good: 1.5, average: 3.5, poor: 6.0 },
      annualChurnRate: { good: 12, average: 30, poor: 50 },
      netRevenueRetention: { good: 115, average: 100, poor: 80 },
      salesCycleLength: { fast: "1-2 weeks", average: "3-6 weeks", slow: "2-4 months" },
      demoToCloseRate: { good: 28, average: 18, poor: 9 },
      trialToCloseRate: { good: 22, average: 14, poor: 6 },
      onboardingCompletionRate: { good: 80, average: 60, poor: 35 },
      timeToFirstValue: { good: "< 3 days", average: "7-14 days", poor: "> 21 days" },
      npsScore: { good: 45, average: 28, poor: 8 },
      csatScore: { good: 88, average: 76, poor: 60 },
      weeklyActiveUserRate: { good: 70, average: 50, poor: 25 },
      supportTicketsPerMonth: { low: "< 2 per customer", average: "2-5 per customer", high: "> 5 per customer" },
    },
  },
  {
    vertical: "healthtech",
    metrics: {
      averageACV: { low: 15000, median: 50000, high: 200000 },
      monthlyChurnRate: { good: 0.5, average: 1.2, poor: 2.5 },
      annualChurnRate: { good: 4, average: 10, poor: 22 },
      netRevenueRetention: { good: 125, average: 110, poor: 92 },
      salesCycleLength: { fast: "8-12 weeks", average: "12-24 weeks", slow: "6-12 months" },
      demoToCloseRate: { good: 20, average: 12, poor: 5 },
      trialToCloseRate: { good: 12, average: 6, poor: 2 },
      onboardingCompletionRate: { good: 75, average: 55, poor: 30 },
      timeToFirstValue: { good: "< 4 weeks", average: "8-12 weeks", poor: "> 16 weeks" },
      npsScore: { good: 50, average: 30, poor: 10 },
      csatScore: { good: 90, average: 78, poor: 62 },
      weeklyActiveUserRate: { good: 75, average: 55, poor: 30 },
      supportTicketsPerMonth: { low: "< 1 per customer", average: "1-3 per customer", high: "> 4 per customer" },
    },
  },
  {
    vertical: "other",
    metrics: {
      averageACV: { low: 3000, median: 15000, high: 60000 },
      monthlyChurnRate: { good: 1.5, average: 3.0, poor: 5.0 },
      annualChurnRate: { good: 10, average: 25, poor: 40 },
      netRevenueRetention: { good: 115, average: 103, poor: 85 },
      salesCycleLength: { fast: "2-4 weeks", average: "4-10 weeks", slow: "3-6 months" },
      demoToCloseRate: { good: 28, average: 18, poor: 9 },
      trialToCloseRate: { good: 20, average: 12, poor: 5 },
      onboardingCompletionRate: { good: 80, average: 62, poor: 38 },
      timeToFirstValue: { good: "< 5 days", average: "10-20 days", poor: "> 30 days" },
      npsScore: { good: 48, average: 28, poor: 8 },
      csatScore: { good: 88, average: 77, poor: 62 },
      weeklyActiveUserRate: { good: 70, average: 50, poor: 28 },
      supportTicketsPerMonth: { low: "< 2 per customer", average: "2-5 per customer", high: "> 5 per customer" },
    },
  },
];

// ============================================
// Size-Based Benchmarks
// ============================================

export const SIZE_BENCHMARKS: SizeBenchmark[] = [
  {
    size: "1-10",
    metrics: {
      averageACV: { low: 1000, median: 5000, high: 15000 },
      monthlyChurnRate: { good: 2.0, average: 4.0, poor: 7.0 },
      annualChurnRate: { good: 15, average: 35, poor: 55 },
      netRevenueRetention: { good: 110, average: 95, poor: 75 },
      salesCycleLength: { fast: "1-2 weeks", average: "2-4 weeks", slow: "1-3 months" },
      demoToCloseRate: { good: 25, average: 15, poor: 8 },
      trialToCloseRate: { good: 20, average: 12, poor: 5 },
      onboardingCompletionRate: { good: 75, average: 55, poor: 30 },
      timeToFirstValue: { good: "< 2 days", average: "5-10 days", poor: "> 20 days" },
      npsScore: { good: 50, average: 30, poor: 10 },
      csatScore: { good: 88, average: 75, poor: 60 },
      weeklyActiveUserRate: { good: 65, average: 45, poor: 20 },
      supportTicketsPerMonth: { low: "< 1", average: "1-3", high: "> 3" },
    },
  },
  {
    size: "11-50",
    metrics: {
      averageACV: { low: 3000, median: 12000, high: 40000 },
      monthlyChurnRate: { good: 1.5, average: 3.0, poor: 5.0 },
      annualChurnRate: { good: 10, average: 25, poor: 40 },
      netRevenueRetention: { good: 115, average: 103, poor: 85 },
      salesCycleLength: { fast: "2-4 weeks", average: "4-8 weeks", slow: "2-5 months" },
      demoToCloseRate: { good: 28, average: 18, poor: 10 },
      trialToCloseRate: { good: 22, average: 14, poor: 6 },
      onboardingCompletionRate: { good: 80, average: 62, poor: 38 },
      timeToFirstValue: { good: "< 5 days", average: "10-20 days", poor: "> 30 days" },
      npsScore: { good: 48, average: 28, poor: 8 },
      csatScore: { good: 88, average: 78, poor: 64 },
      weeklyActiveUserRate: { good: 70, average: 50, poor: 28 },
      supportTicketsPerMonth: { low: "< 2", average: "2-4", high: "> 5" },
    },
  },
  {
    size: "51-150",
    metrics: {
      averageACV: { low: 8000, median: 25000, high: 80000 },
      monthlyChurnRate: { good: 1.0, average: 2.0, poor: 4.0 },
      annualChurnRate: { good: 8, average: 18, poor: 35 },
      netRevenueRetention: { good: 120, average: 108, poor: 90 },
      salesCycleLength: { fast: "3-6 weeks", average: "6-12 weeks", slow: "3-6 months" },
      demoToCloseRate: { good: 30, average: 20, poor: 12 },
      trialToCloseRate: { good: 20, average: 12, poor: 5 },
      onboardingCompletionRate: { good: 82, average: 65, poor: 42 },
      timeToFirstValue: { good: "< 7 days", average: "14-28 days", poor: "> 45 days" },
      npsScore: { good: 50, average: 32, poor: 12 },
      csatScore: { good: 90, average: 80, poor: 66 },
      weeklyActiveUserRate: { good: 72, average: 52, poor: 30 },
      supportTicketsPerMonth: { low: "< 2", average: "2-5", high: "> 5" },
    },
  },
  {
    size: "151-300",
    metrics: {
      averageACV: { low: 15000, median: 50000, high: 150000 },
      monthlyChurnRate: { good: 0.8, average: 1.5, poor: 3.0 },
      annualChurnRate: { good: 6, average: 14, poor: 28 },
      netRevenueRetention: { good: 125, average: 112, poor: 95 },
      salesCycleLength: { fast: "4-8 weeks", average: "8-16 weeks", slow: "4-9 months" },
      demoToCloseRate: { good: 30, average: 20, poor: 10 },
      trialToCloseRate: { good: 18, average: 10, poor: 4 },
      onboardingCompletionRate: { good: 85, average: 68, poor: 45 },
      timeToFirstValue: { good: "< 10 days", average: "20-40 days", poor: "> 60 days" },
      npsScore: { good: 52, average: 34, poor: 14 },
      csatScore: { good: 92, average: 82, poor: 68 },
      weeklyActiveUserRate: { good: 75, average: 55, poor: 32 },
      supportTicketsPerMonth: { low: "< 2", average: "2-5", high: "> 6" },
    },
  },
];

// ============================================
// Helper Functions
// ============================================

export function getVerticalBenchmark(vertical: Vertical): VerticalBenchmark | undefined {
  return VERTICAL_BENCHMARKS.find((v) => v.vertical === vertical);
}

export function getSizeBenchmark(size: CompanySize): SizeBenchmark | undefined {
  return SIZE_BENCHMARKS.find((s) => s.size === size);
}

/**
 * Get blended benchmark by combining vertical and size data.
 * Uses vertical as primary, size as modifier.
 */
export function getBlendedBenchmark(
  vertical: Vertical,
  size: CompanySize
): BenchmarkMetrics | undefined {
  const vBenchmark = getVerticalBenchmark(vertical);
  const sBenchmark = getSizeBenchmark(size);

  if (!vBenchmark || !sBenchmark) return vBenchmark?.metrics || sBenchmark?.metrics;

  // For now, return vertical benchmark as primary.
  // In future: blend based on weighted average.
  return vBenchmark.metrics;
}
