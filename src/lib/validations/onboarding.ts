import { z } from "zod";

export const onboardingSchema = z.object({
  userName: z.string().optional(),
  userRole: z.string().optional(),
  companyName: z.string().min(1, "Company name is required"),
  companyWebsite: z.string().default(""),
  currentTools: z.string().optional(),
  vertical: z.string().min(1, "Vertical is required"),
  companySize: z.string().min(1, "Company size is required"),
  customVertical: z.string().optional(),

  // New: maturity-driven
  companyMaturity: z.enum(["pre_launch", "first_customers", "growing", "scaling"]),

  // Journey existence (growing/scaling)
  hasExistingJourney: z.enum(["yes", "no", "partial", ""]).default(""),
  existingJourneyComponents: z.array(z.string()).optional(),
  existingJourneyDescription: z.string().optional(),
  existingJourneyFileName: z.string().optional(),

  // Derived (backward compat — auto-set from maturity)
  journeyType: z.enum(["sales", "customer", "full_lifecycle"]),
  hasExistingCustomers: z.boolean().default(false),

  // Customer profile
  customerCount: z.string().default(""),
  customerDescription: z.string().min(1, "Customer description is required"),
  customerSize: z.string().min(1, "Customer size is required"),
  mainChannel: z.string().min(1, "Main channel is required"),

  // Business data (when growing/scaling)
  pricingModel: z.string().default(""),
  roughRevenue: z.string().default(""),
  averageDealSize: z.string().default(""),

  // CX Maturity (auto-set from maturity, not asked)
  measuresNps: z.boolean().default(false),
  measuresCsat: z.boolean().default(false),
  measuresCes: z.boolean().default(false),
  npsResponseCount: z.string().default(""),
  hasJourneyMap: z.boolean().default(false),
  dataVsGut: z.string().default("all_gut"),

  // Pain points (maturity-adaptive)
  biggestChallenge: z.string().min(1, "Biggest challenge is required"),
  painPoints: z.array(z.string()).min(1, "At least one pain point is required"),
  customPainPoint: z.string().optional(),

  // Goals (maturity-adaptive)
  primaryGoal: z.string().min(1, "Primary goal is required"),
  customGoal: z.string().optional(),
  timeframe: z.string().min(1, "Timeframe is required"),
  additionalContext: z.string().optional(),

  // Competitors
  competitors: z.string().default(""),

  // AI-enriched company data (optional — from auto-enrichment)
  enrichmentData: z.object({
    suggestedVertical: z.string().optional(),
    suggestedCompanySize: z.string().optional(),
    description: z.string().optional(),
    suggestedCompetitors: z.array(z.string()).optional(),
    suggestedCustomerSize: z.string().optional(),
    suggestedMainChannel: z.string().optional(),
    confidence: z.enum(["high", "medium", "low"]).optional(),
    reasoning: z.string().optional(),
  }).optional(),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
