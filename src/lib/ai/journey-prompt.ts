/**
 * AI Engineer: Journey Generation Prompt (v3 — CX Mate Companion)
 *
 * v3 enhancements:
 * - CX Mate persona: peer advisor, not judge. "Companies like yours typically..." not "Here's the truth..."
 * - Two-path analysis: COMPARISON mode (has customers) vs PRESCRIPTIVE mode (pre-customer)
 * - CX maturity context: NPS/CSAT/CES usage, response counts, journey maps, data vs gut
 * - Business data context: real revenue, ACV, pricing model → grounded math
 * - Transparent impact projections: show the formula, cite the data source
 * - companionAdvice field on ConfrontationInsight
 * - calculation + dataSource fields on ImpactProjection
 */

import {
  getDefaultStages,
  getDefaultMoments,
  getVertical,
  // Failure & success patterns
  getFailurePatternsByStage,
  getSuccessPatternsByStage,
  // Benchmarks & impact
  getVerticalBenchmark,
  getSizeBenchmark,
  // Best practice foundations (Mode A)
  getFoundationsForStage,
  getStageGuidance,
  type MaturityStage,
} from "@/lib/cx-knowledge";
import { buildProfileFromOnboarding } from "@/lib/cx-knowledge/impact-models/impact-calculator";
import type { OnboardingInput } from "@/lib/validations/onboarding";

// ============================================
// Output Interfaces (v3 — enriched)
// ============================================

export interface GeneratedMoment {
  name: string;
  type: "risk" | "delight" | "decision" | "handoff";
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  triggers: string[];
  recommendations: string[];
  diagnosis?: string;
  actionTemplate?: string;
  cxToolRecommendation?: string;
  decisionScienceInsight?: string;
  impactIfIgnored?: string;
  addressesPainPoints?: string[]; // v4: links moment back to user's stated pain point keys
  competitorGap?: string; // v4: competitor-specific insight for this moment
}

export interface GeneratedStage {
  name: string;
  stageType: "sales" | "customer";
  description: string;
  emotionalState: string;
  meaningfulMoments: GeneratedMoment[];
  topFailureRisk?: string;
  successPattern?: string;
  benchmarkContext?: string;
  existingTools?: { name: string; domain: string }[];
}

export interface ConfrontationInsight {
  pattern: string;
  likelihood: "high" | "medium" | "low";
  description: string;
  businessImpact: string;
  immediateAction: string;
  measureWith: string;
  companionAdvice?: string; // v3: CX Mate's peer one-liner
  addressesPainPoints?: string[]; // v4: which user pain point keys this insight addresses
  competitorContext?: string; // v4: competitor-specific context for this insight
}

export interface CxToolRecommendation {
  tool: string;
  whenToDeploy: string;
  whyThisTool: string;
  expectedOutcome: string;
}

export interface ImpactProjection {
  area: string;
  potentialImpact: string;
  timeToRealize: string;
  effort: string;
  calculation?: string; // v3: show the math formula
  dataSource?: "user_provided" | "benchmark_estimated"; // v3: transparency
}

export interface TechStackRecommendation {
  category: "crm" | "marketing" | "support" | "analytics" | "cs_platform" | "communication" | "bi" | "survey" | "data_infrastructure";
  categoryLabel: string;
  tools: string[];
  whyNow: string;
  connectWith: string;
}

export interface GeneratedJourney {
  name: string;
  stages: GeneratedStage[];
  confrontationInsights?: ConfrontationInsight[];
  cxToolRoadmap?: CxToolRecommendation[];
  impactProjections?: ImpactProjection[];
  techStackRecommendations?: TechStackRecommendation[];
  maturityAssessment?: string;
  assumptions?: string[];
}

// ============================================
// Company Maturity Detection
// ============================================

function detectMaturityStage(companySize: string): MaturityStage {
  switch (companySize) {
    case "1-10":
      return "pre_revenue";
    case "11-50":
      return "first_customers";
    case "51-150":
    case "151-300":
      return "growing";
    default:
      return "first_customers";
  }
}

function detectCompanyStage(companySize: string): "early" | "growing" | "established" {
  switch (companySize) {
    case "1-10":
    case "11-50":
      return "early";
    case "51-150":
      return "growing";
    case "151-300":
      return "established";
    default:
      return "early";
  }
}

// ============================================
// Knowledge Base Context Builders
// ============================================

function buildFailurePatternContext(companyStage: "early" | "growing" | "established"): string {
  const patterns = getFailurePatternsByStage(companyStage);
  return `## Failure Risks (${companyStage})
${patterns.map(p => `- ${p.name} (${p.severity}): ${p.description}. Fix: ${p.fix.immediate}`).join("\n")}`;
}

function buildSuccessPatternContext(companyStage: "early" | "growing" | "established"): string {
  const patterns = getSuccessPatternsByStage(companyStage);
  return `## Success Patterns (${companyStage})
${patterns.map(p => `- ${p.name} (${p.impact}): ${p.description}. Measure: ${p.measureWith}`).join("\n")}`;
}

function buildBenchmarkContext(vertical: string, companySize: string): string {
  const verticalBench = getVerticalBenchmark(
    vertical as "b2b_saas" | "professional_services" | "marketplace" | "fintech" | "ecommerce_b2b" | "healthtech" | "other"
  );
  const sizeBench = getSizeBenchmark(companySize as "1-10" | "11-50" | "51-150" | "151-300");

  let context = "## Industry Benchmarks\n";

  if (verticalBench) {
    const m = verticalBench.metrics;
    context += `\nVertical (${vertical}) benchmarks:
- Monthly churn: good=${m.monthlyChurnRate.good}%, avg=${m.monthlyChurnRate.average}%, poor=${m.monthlyChurnRate.poor}%
- Demo-to-close: good=${m.demoToCloseRate.good}%, avg=${m.demoToCloseRate.average}%, poor=${m.demoToCloseRate.poor}%
- Onboarding completion: good=${m.onboardingCompletionRate.good}%, avg=${m.onboardingCompletionRate.average}%, poor=${m.onboardingCompletionRate.poor}%
- Time to first value: good=${m.timeToFirstValue.good}, avg=${m.timeToFirstValue.average}, poor=${m.timeToFirstValue.poor}
- NPS: good=${m.npsScore.good}, avg=${m.npsScore.average}, poor=${m.npsScore.poor}
- NRR: good=${m.netRevenueRetention.good}%, avg=${m.netRevenueRetention.average}%, poor=${m.netRevenueRetention.poor}%`;
  }

  if (sizeBench) {
    const m = sizeBench.metrics;
    context += `\n\nCompany size (${companySize}) benchmarks:
- Monthly churn: good=${m.monthlyChurnRate.good}%, avg=${m.monthlyChurnRate.average}%, poor=${m.monthlyChurnRate.poor}%
- Average ACV: $${m.averageACV.median.toLocaleString()}
- Sales cycle: fast=${m.salesCycleLength.fast}, avg=${m.salesCycleLength.average}`;
  }

  return context;
}

function buildFoundationsContext(maturityStage: MaturityStage): string {
  const foundations = getFoundationsForStage(maturityStage);
  const guidance = getStageGuidance(maturityStage);
  let context = `## Foundations (${maturityStage})\n`;
  if (guidance) {
    context += `Focus: ${guidance.keyFocus}
Avoid: ${guidance.topMistakes.map(m => m.mistake).join("; ")}
Do now: ${guidance.immediateActions.join("; ")}`;
  }
  context += `\n${foundations.map(f => `- ${f.name} (P${f.priority}): ${f.minimalViableVersion}`).join("\n")}`;
  return context;
}

// ============================================
// v3: CX Maturity Context Builder
// ============================================

function buildCxMaturityContext(input: OnboardingInput): string {
  const sections: string[] = [];

  // What they measure
  const metrics: string[] = [];
  if (input.measuresNps) metrics.push("NPS");
  if (input.measuresCsat) metrics.push("CSAT");
  if (input.measuresCes) metrics.push("CES");

  if (metrics.length > 0) {
    sections.push(`CX metrics in use: ${metrics.join(", ")}`);

    // NPS callout
    if (input.measuresNps && input.npsResponseCount) {
      if (input.npsResponseCount === "under_50") {
        sections.push(
          "⚠️ NPS with under 50 responses is NOT statistically reliable. " +
          "Suggest they weight CSAT more heavily until response volume grows. " +
          "Don't cite their NPS score as meaningful — use it as directional only."
        );
      } else if (input.npsResponseCount === "50_100") {
        sections.push(
          "NPS with 50-100 responses is borderline reliable. " +
          "Recommend increasing sample size. Treat as directional."
        );
      } else {
        sections.push(
          "NPS with 100+ responses — statistically meaningful. Can be used with confidence."
        );
      }
    }
  } else {
    sections.push(
      "Not tracking any CX metrics yet. " +
      "This is common at their stage. Recommend starting with one simple metric."
    );
  }

  // Journey map
  sections.push(
    input.hasJourneyMap
      ? "Has an existing journey map — build on what they have, don't start from scratch."
      : "No existing journey map — this will be their first. Keep it simple and actionable."
  );

  // Data vs gut
  const dataLabels: Record<string, string> = {
    all_gut: "Makes CX decisions entirely on instinct — no data infrastructure yet",
    mostly_gut: "Mostly instinct-driven with some data — early stage of measurement maturity",
    mix: "Balanced data and instinct — has some measurement but gaps remain",
    mostly_data: "Primarily data-driven — good measurement foundation, optimize from here",
    data_driven: "Fully data-driven CX decisions — mature measurement stack",
  };
  sections.push(dataLabels[input.dataVsGut] || "CX decision style unknown");

  return `## CX Maturity
${sections.join("\n")}`;
}

// ============================================
// v3: Business Data Context Builder
// ============================================

function buildBusinessDataContext(input: OnboardingInput): string {
  const onboardingProfile = buildProfileFromOnboarding({
    hasExistingCustomers: input.hasExistingCustomers,
    customerCount: input.customerCount,
    roughRevenue: input.roughRevenue,
    averageDealSize: input.averageDealSize,
    companySize: input.companySize,
    vertical: input.vertical,
  });

  const { calculations, dataSource } = onboardingProfile;
  const p = onboardingProfile.profile;

  let context = `## Business Data (${dataSource === "user_provided" ? "User-provided numbers" : "Benchmark estimates"})\n`;

  context += `
- Customers: ~${p.customerCount} (${calculations.customerCount.source})
- Average ACV: $${p.averageACV.toLocaleString()} (${calculations.averageACV.source})
- Est. monthly churn: ${p.monthlyChurnRate}% (${calculations.churnRate.source})
- Est. annual revenue: $${p.annualRevenue?.toLocaleString()} (${calculations.annualRevenue.source})
${input.pricingModel ? `- Pricing model: ${input.pricingModel}` : ""}`;

  context += `\nData source: ${dataSource}. Use "${dataSource}" for all impactProjection.dataSource fields.${dataSource === "user_provided" ? " Show math with their actual numbers." : " Use percentage-based projections."}`;

  return context;
}

// ============================================
// v3: Two-Path Analysis Mode
// ============================================

function buildAnalysisModeContext(input: OnboardingInput): string {
  return input.hasExistingCustomers
    ? `Mode: COMPARISON — validate progress, compare vs ${input.vertical} best practices, show revenue gaps with math. Peer tone: "Companies like yours..."`
    : `Mode: PRESCRIPTIVE — prescribe optimal journey from day one, top 3 priorities only, percentage-based projections. Mentor tone.`;
}

// ============================================
// Main Prompt Builder
// ============================================

export function buildJourneyPrompt(input: OnboardingInput): string {
  const vertical = getVertical(input.vertical);

  // Pre-customer companies can only have a sales journey — no customers yet means
  // no customer lifecycle stages. Override to "sales" regardless of what was selected.
  const effectiveJourneyType = !input.hasExistingCustomers ? "sales" : input.journeyType;

  const defaultStages = getDefaultStages(effectiveJourneyType);
  const defaultMoments = getDefaultMoments(effectiveJourneyType);

  const maturityStage = detectMaturityStage(input.companySize);
  const companyStage = detectCompanyStage(input.companySize);

  const verticalContext = vertical
    ? `
Industry: ${vertical.label} - ${vertical.description}
Typical sales cycle: ${vertical.typicalSalesCycle}
Common churn drivers in this vertical: ${vertical.typicalChurnDrivers.join(", ") || "varies"}
Key moments for this vertical: ${vertical.keyMoments.join(", ") || "varies"}`
    : `Industry: ${input.customVertical || input.vertical}`;

  const stageNames = defaultStages.map((s) => s.name).join(", ");
  const momentNames = defaultMoments.map((m) => m.name).join(", ");

  // Build note for pre-customer companies
  const preCustomerNote = !input.hasExistingCustomers
    ? `\n⚠️ IMPORTANT: This company has NO existing customers yet. Generate ONLY sales-stage content (pre-sale journey). Do NOT generate any post-sale or customer success stages (onboarding, activation, retention, expansion, renewal). Those stages don't apply — there are no customers yet. Focus 100% on the journey from awareness through to winning the first customers.\n`
    : "";

  // Build context sections — benchmarks are company-specific, keep full
  // Generic CX theory (decision cycle, lifecycle, measurement tools) is omitted
  // because Claude already has this knowledge — adding it bloats the prompt by ~3000 tokens
  const failureContext = buildFailurePatternContext(companyStage);
  const successContext = buildSuccessPatternContext(companyStage);
  const benchmarkContext = buildBenchmarkContext(input.vertical, input.companySize);
  const foundationsContext = buildFoundationsContext(maturityStage);

  // v3: New context sections
  const cxMaturityContext = buildCxMaturityContext(input);
  const businessDataContext = buildBusinessDataContext(input);
  const analysisModeContext = buildAnalysisModeContext(input);

  return `You are CX Mate — a knowledgeable, assertive CX advisor for B2B startups. Peer advisor voice: direct, opinionated, touch of humor, never condescending. Use "Companies like yours..." framing.

## User
${input.userName ? `${input.userName}${input.userRole ? ` (${input.userRole})` : ""}` : ""}${input.userRole && !input.userName ? `${input.userRole}` : ""}
${input.userName || input.userRole ? `Personalize to their role.` : ""}

## Company Context
- Company: ${input.companyName}
- Size: ${input.companySize} employees
- Maturity stage: ${maturityStage} (${companyStage})
- Has existing customers: ${input.hasExistingCustomers ? "Yes" : "No (pre-customer)"}
${input.hasExistingCustomers && input.customerCount ? `- Customer count: ${input.customerCount}` : ""}
${input.industry ? `- Industry sector: ${input.industry}` : ""}
${verticalContext}
- Journey type requested: ${input.journeyType}
- Their customers: ${input.customerDescription}
- Customer size: ${input.customerSize}
- Main acquisition channel: ${input.mainChannel}
${input.preLiveProcess ? `- Pre-live / implementation process: ${input.preLiveProcess}` : ""}
${input.currentTools ? `- Current CX tools/stack: ${input.currentTools}` : ""}
${input.currentTools ? `\nMap their tools to stage existingTools as {"name":"ToolName","domain":"tool-domain.com"}.` : ""}

## Existing CX Processes
${input.hasExistingJourney === "yes" || input.hasExistingJourney === "partial" ? `- Has existing journey processes: ${input.hasExistingJourney === "yes" ? "Yes (formal)" : "Partially"}` : "- No existing CX processes in place — building from scratch"}
${input.existingJourneyComponents && input.existingJourneyComponents.length > 0 ? `- Processes they have in place: ${input.existingJourneyComponents.join(", ")}` : ""}
${input.existingJourneyWorking && input.existingJourneyWorking.length > 0 ? `- What is working well: ${input.existingJourneyWorking.join("; ")}` : ""}
${input.existingJourneyBroken && input.existingJourneyBroken.length > 0 ? `- What needs fixing: ${input.existingJourneyBroken.join("; ")}` : ""}
${input.existingJourneyDescription ? `- Additional context: "${input.existingJourneyDescription}"` : ""}
${input.existingJourneyPastedContent ? `- Pasted content from their existing docs:\n"""\n${input.existingJourneyPastedContent}\n"""` : ""}
${(input.hasExistingJourney === "yes" || input.hasExistingJourney === "partial") ? `When generating recommendations, BUILD ON what they already have. Reinforce what is working. Focus gaps and improvements on what needs fixing. Don't recommend replacing working processes — extend and improve them.` : ""}

## Competitive Landscape
${input.competitors ? `- Known competitors/alternatives: ${input.competitors}` : "- No competitors specified — use industry knowledge to identify likely alternatives"}
${input.companyWebsite ? `- Company website: ${input.companyWebsite}` : ""}
${input.enrichmentData ? `
## AI-Enriched Company Intelligence
- Company description: ${input.enrichmentData.description || "N/A"}
- Enrichment confidence: ${input.enrichmentData.confidence || "unknown"}
${input.enrichmentData.reasoning ? `- Analysis notes: ${input.enrichmentData.reasoning}` : ""}
Use this enrichment data to make your analysis more specific and personalized. If the enrichment data conflicts with user-provided data, prefer the user-provided data.` : ""}

## Their Challenges
- Biggest challenge: ${input.biggestChallenge}
- Pain points: ${input.painPoints.join(", ")}${input.customPainPoint ? `, ${input.customPainPoint}` : ""}

## Their Goals
- Primary goal: ${input.primaryGoal}${input.customGoal ? ` — "${input.customGoal}"` : ""}
${input.secondaryGoals?.length ? `- Additional goals: ${input.secondaryGoals.join(", ")}` : ""}- Timeframe: ${input.timeframe}
${input.additionalContext ? `- Additional context: ${input.additionalContext}` : ""}

## Default Template
The standard stages for a ${effectiveJourneyType} journey are: ${stageNames}
Standard meaningful moments include: ${momentNames}
${preCustomerNote}
---

${analysisModeContext}
${cxMaturityContext}
${businessDataContext}
${benchmarkContext}
${failureContext}
${successContext}
${foundationsContext}

## Task
Generate JSON journey map. ULTRA CONCISE — every field max 12 words. emotionalState max 4 words.
${!input.hasExistingCustomers ? 'All stageType MUST be "sales". No post-sale stages. ' : ""}Counts: 2 moments/stage, 2-3 confrontation insights, 2 cxToolRoadmap, 2 impactProjections, 2-3 techStack, 2 assumptions.
Impact projections MUST include calculation (math formula) and dataSource. addressesPainPoints only if direct match. Prefer AI agents over manual tools.

JSON schema:
{"name":"str","stages":[{"name":"str","stageType":"sales|customer","description":"str","emotionalState":"2-4 words","topFailureRisk":"str","successPattern":"str","benchmarkContext":"str","existingTools":[{"name":"str","domain":"str"}],"meaningfulMoments":[{"name":"str","type":"risk|delight|decision|handoff","description":"str","severity":"low|medium|high|critical","triggers":["str"],"recommendations":["str"],"diagnosis":"str","actionTemplate":"str","cxToolRecommendation":"str","impactIfIgnored":"str","addressesPainPoints":["str"]}]}],"confrontationInsights":[{"pattern":"str","likelihood":"high|medium|low","description":"str","businessImpact":"str","immediateAction":"str","measureWith":"str","companionAdvice":"str","addressesPainPoints":["str"]}],"cxToolRoadmap":[{"tool":"str","whenToDeploy":"str","whyThisTool":"str","expectedOutcome":"str"}],"impactProjections":[{"area":"str","potentialImpact":"str","timeToRealize":"str","effort":"low|medium|high","calculation":"math formula","dataSource":"user_provided|benchmark_estimated"}],"techStackRecommendations":[{"category":"crm|marketing|support|analytics|cs_platform|communication|bi|survey|data_infrastructure","categoryLabel":"str","tools":["str"],"whyNow":"str","connectWith":"str"}],"assumptions":["str"],"maturityAssessment":"str"}

Return ONLY JSON.`;
}
