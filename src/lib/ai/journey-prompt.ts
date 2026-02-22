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
  // Buyer decision cycle
  DECISION_CYCLE,
  DECISION_DIAGNOSES,
  // Customer lifecycle
  LIFECYCLE_PHASES,
  // Failure & success patterns
  getFailurePatternsByStage,
  getSuccessPatternsByStage,
  // CX measurement tools
  MEASUREMENT_TOOLS,
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

function buildDecisionCycleContext(): string {
  const stages = DECISION_CYCLE.map(
    (s) =>
      `- **${s.name}** (${s.stage}): Buyer mindset: "${s.buyerMindset}". ` +
      `Dominant currency: ${s.dominantCurrency}. Price relevance: ${s.priceRelevance}. ` +
      `Trust relevance: ${s.trustRelevance}.`
  ).join("\n");

  const diagnoses = DECISION_DIAGNOSES.map(
    (d) =>
      `- "${d.symptom}" → Stage: ${d.likelyStage}. Root cause: ${d.rootCause}. ` +
      `Action: ${d.recommendedAction}.`
  ).join("\n");

  return `## Buyer Decision Cycle Theory
Understanding where buyers are in their decision cycle determines which CX interventions work:

${stages}

Common sales/CX problems and their decision-stage diagnosis:
${diagnoses}`;
}

function buildLifecycleContext(): string {
  const phases = LIFECYCLE_PHASES.map(
    (p) =>
      `- **${p.name}** (${p.typicalTimeframe}): ${p.description}. ` +
      `Healthy signals: ${p.healthySignals.slice(0, 2).join(", ")}. ` +
      `Warning signals: ${p.warningSignals.slice(0, 2).join(", ")}. ` +
      `Recommended CX tool: ${p.recommendedCxTool}. ` +
      `Science: ${p.scienceBehind}`
  ).join("\n");

  return `## Customer Lifecycle Science
Each post-sale phase has known healthy and warning signals:

${phases}`;
}

function buildFailurePatternContext(companyStage: "early" | "growing" | "established"): string {
  const patterns = getFailurePatternsByStage(companyStage);
  const formatted = patterns.map(
    (p) =>
      `- **${p.name}** (${p.phase}, ${p.severity}): ${p.description} ` +
      `Impact: ${p.impactEstimate}. ` +
      `Immediate fix: ${p.fix.immediate} ` +
      `Prevention tool: ${p.preventionTool}`
  ).join("\n");

  return `## Common CX Failure Patterns for ${companyStage}-stage companies
These are the mistakes companies at this stage typically make:

${formatted}`;
}

function buildSuccessPatternContext(companyStage: "early" | "growing" | "established"): string {
  const patterns = getSuccessPatternsByStage(companyStage);
  const formatted = patterns.map(
    (p) =>
      `- **${p.name}** (${p.phase}, effort: ${p.effort}, impact: ${p.impact}): ${p.description} ` +
      `Why it works: ${p.whyItWorks} ` +
      `Measure with: ${p.measureWith}`
  ).join("\n");

  return `## Proven CX Success Patterns for ${companyStage}-stage companies
Evidence-based interventions to recommend:

${formatted}`;
}

function buildMeasurementToolsContext(): string {
  const tools = MEASUREMENT_TOOLS.map(
    (t) =>
      `- **${t.name}** (${t.id}): ${t.whatItMeasures}. ` +
      `Question: "${t.question}". ` +
      `Best for: ${t.bestForStages.join(", ")}. ` +
      `When NOT to use: ${t.whenNotToUse[0]}.`
  ).join("\n");

  return `## CX Measurement Tools
Recommend the right tool at the right moment:

${tools}`;
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

  let context = `## Best Practice Foundations (for ${maturityStage} companies)\n`;

  if (guidance) {
    context += `\nStage: ${guidance.name} (${guidance.customerRange})
Focus: ${guidance.keyFocus}

Top mistakes at this stage:
${guidance.topMistakes.map((m) => `- "${m.mistake}" — ${m.consequence} → Do instead: ${m.whatToDoInstead}`).join("\n")}

Immediate actions to recommend:
${guidance.immediateActions.map((a) => `- ${a}`).join("\n")}

CX tools to deploy now:
${guidance.cxToolsToDeploy.map((t) => `- ${t}`).join("\n")}

Don't do yet:
${guidance.dontDoYet.map((d) => `- ${d}`).join("\n")}`;
  }

  context += `\n\nFoundation elements to build:
${foundations.map((f) => `- **${f.name}** (priority ${f.priority}): ${f.description} Start with: ${f.minimalViableVersion}`).join("\n")}`;

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

  return `## CX Maturity Assessment
${sections.join("\n")}

Use this to calibrate your recommendations:
- If they're gut-driven, don't recommend complex analytics — start with basic measurement
- If they already measure well, focus on acting on data rather than collecting more
- Match CX tool recommendations to their actual measurement maturity`;
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
- Est. annual revenue: $${p.annualRevenue?.toLocaleString()} (${calculations.annualRevenue.source})`;

  if (dataSource === "user_provided") {
    context += `

IMPORTANT: Since the user provided real business data, you MUST:
1. Show your math in impact projections — e.g., "50 customers × $12K ACV × 25% churn reduction = $150K saved"
2. Set dataSource to "user_provided" on all impactProjections
3. Use their actual numbers, not benchmarks
4. Include the calculation formula in the "calculation" field`;
  } else {
    context += `

IMPORTANT: These are benchmark estimates (user didn't provide real numbers). You MUST:
1. Label all projections clearly — "Based on industry benchmarks for [vertical] companies at your stage"
2. Set dataSource to "benchmark_estimated" on all impactProjections
3. Use percentage-based language when possible ("typically reduces churn by 20-30%")
4. Include the benchmark source in the "calculation" field`;
  }

  return context;
}

// ============================================
// v3: Two-Path Analysis Mode
// ============================================

function buildAnalysisModeContext(input: OnboardingInput): string {
  if (input.hasExistingCustomers) {
    return `## Analysis Mode: COMPARISON
This company has existing customers. Your job is to:
1. VALIDATE what they're doing right — acknowledge their progress
2. COMPARE their current state against best practices for ${input.vertical} companies at their stage
3. Identify GAPS between where they are and where they should be
4. Show the REVENUE IMPACT of closing each gap (with transparent math)
5. Frame insights as "Companies like yours typically..." not "You're doing this wrong"

Tone: You're a knowledgeable peer who's seen this movie before. You're validating their experience while showing them what the best companies at their stage do differently.`;
  }

  return `## Analysis Mode: PRESCRIPTIVE
This company is pre-customer or very early. Your job is to:
1. PRESCRIBE the optimal journey from day one — they have a blank canvas
2. Show them what "great" looks like at their stage (not aspirational enterprise practices)
3. Highlight the TOP 3 things to get right from the start (not 20 things)
4. Use PERCENTAGE-based projections since we don't have real revenue data
5. Frame insights as "The companies that nail this early..." and "Here's what you want to avoid..."

Tone: You're a mentor who's helped dozens of companies launch. You're excited about their potential while being practical about priorities.`;
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

  // Build all context sections
  const decisionCycleContext = buildDecisionCycleContext();
  const lifecycleContext = buildLifecycleContext();
  const failureContext = buildFailurePatternContext(companyStage);
  const successContext = buildSuccessPatternContext(companyStage);
  const toolsContext = buildMeasurementToolsContext();
  const benchmarkContext = buildBenchmarkContext(input.vertical, input.companySize);
  const foundationsContext = buildFoundationsContext(maturityStage);

  // v3: New context sections
  const cxMaturityContext = buildCxMaturityContext(input);
  const businessDataContext = buildBusinessDataContext(input);
  const analysisModeContext = buildAnalysisModeContext(input);

  return `You are CX Mate — a knowledgeable CX companion for B2B startups. Think of yourself as a trusted peer advisor who's been in the trenches, seen what works and what doesn't, and is now whispering smart advice in the founder's ear.

## Your Persona
- **Peer advisor, not judge.** You validate what they're doing right before showing gaps. Frame insights as "Companies like yours typically..." not "Here's the truth about your business..."
- **Assertive and direct** — you don't hedge or give wishy-washy advice. You have opinions backed by data.
- **Touch of humor** — professional but not corporate. You're the kind of advisor people actually enjoy talking to.
- **Never condescending.** Even if they're early stage with no CX in place, you respect where they are and meet them there.
- **Transparent about data quality.** When using their real numbers, say "Based on your numbers..." When using benchmarks, say "Based on what we see with similar companies..."

## Who We're Talking To
${input.userName ? `- Person: ${input.userName}${input.userRole ? ` (${input.userRole})` : ""}` : ""}${input.userRole && !input.userName ? `- Role: ${input.userRole}` : ""}
${input.userName || input.userRole ? `Use their name and role to personalize advice. A CEO needs strategic framing; a Head of CS needs tactical playbooks; a VP Product needs cross-functional recommendations.` : ""}

## Company Context
- Company: ${input.companyName}
- Size: ${input.companySize} employees
- Maturity stage: ${maturityStage} (${companyStage})
- Has existing customers: ${input.hasExistingCustomers ? "Yes" : "No (pre-customer)"}
${input.hasExistingCustomers && input.customerCount ? `- Customer count: ${input.customerCount}` : ""}
${verticalContext}
- Journey type requested: ${input.journeyType}
- Their customers: ${input.customerDescription}
- Customer size: ${input.customerSize}
- Main acquisition channel: ${input.mainChannel}
${input.currentTools ? `- Current CX tools/stack: ${input.currentTools}` : ""}

## Existing CX Processes
${input.hasExistingJourney === "yes" || input.hasExistingJourney === "partial" ? `- Has existing journey processes: ${input.hasExistingJourney === "yes" ? "Yes (formal)" : "Partially"}` : "- No existing CX processes in place — building from scratch"}
${input.existingJourneyComponents && input.existingJourneyComponents.length > 0 ? `- What they already have: ${input.existingJourneyComponents.join(", ")}` : ""}
${input.existingJourneyDescription ? `- Their description: "${input.existingJourneyDescription}"` : ""}
${(input.hasExistingJourney === "yes" || input.hasExistingJourney === "partial") ? `When generating recommendations, BUILD ON what they already have. Don't recommend replacing working processes — extend and improve them. Acknowledge their existing work.` : ""}

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
- Timeframe: ${input.timeframe}
${input.additionalContext ? `- Additional context: ${input.additionalContext}` : ""}

## Default Template
The standard stages for a ${effectiveJourneyType} journey are: ${stageNames}
Standard meaningful moments include: ${momentNames}
${preCustomerNote}
---

${analysisModeContext}

---

${cxMaturityContext}

---

${businessDataContext}

---

# CX INTELLIGENCE (Use this knowledge to enrich every recommendation)

${decisionCycleContext}

${lifecycleContext}

${failureContext}

${successContext}

${toolsContext}

${benchmarkContext}

${foundationsContext}

---

## Your Task
Generate a customized, theory-backed journey map with the CX Mate companion voice:

1. **Stages**: Use the standard stages as a foundation but customize names, descriptions, and emotional states to match this specific company. For each stage, identify the top failure risk and recommend the highest-impact success pattern.${!input.hasExistingCustomers ? ' IMPORTANT: ALL stages MUST have stageType: "sales". Do not generate any stages with stageType: "customer". There are no customers yet.' : ""}

2. **Meaningful Moments (2-3 per stage, max)**: Tailored to their industry and challenges. For each moment:
   - Provide a theory-backed **diagnosis** (1 sentence: root cause)
   - Give a specific **actionTemplate** (1 sentence: exactly what to do)
   - Recommend a specific **cxToolRecommendation** (1 sentence: which tool + why)
   - State the **impactIfIgnored** (1 sentence: business cost)
   - **addressesPainPoints**: Array of pain point keys from user input (only if direct match, else omit)
   - Omit **decisionScienceInsight** and **competitorGap** to keep output concise

3. **Confrontation Insights (3-4 max)**: Companion voice. Each in 1 sentence per field:
   - Pattern name, likelihood, business impact (with math if user data available), immediate action, what to measure
   - **companionAdvice**: 1 sentence, first person, direct advice
   - **addressesPainPoints**: pain point keys (use EXACT keys, omit if no match)
   - Omit **competitorContext** to keep output concise

4. **CX Tool Roadmap (2-3 tools max)**: Most critical tools only. Don't recommend NPS if under 50 responses — suggest CSAT instead.

5. **Impact Projections (2-3)**: Each MUST include:
   - **calculation**: Math formula (e.g., "50 customers × $12K ACV × 25% churn reduction = $150K")
   - **dataSource**: "user_provided" or "benchmark_estimated"
   - Include both dollar amount AND percentage (e.g., "$36K–$72K / 20-40% churn reduction")

6. **Maturity Assessment**: 2 sentences max in companion voice.

7. **Tech Stack Recommendations (3-4 max)**: Most critical categories only. Each: category, 2 tool names, 1-sentence whyNow, 1-sentence connectWith.

8. **Assumptions (2-3)**: Most important assumptions only, 1 sentence each.

Prioritize moments related to their stated pain points. Use plain language. Be the advisor they'd actually want to talk to. KEEP IT CONCISE — every field is 1 sentence max.

## Output Format
Return a JSON object with this exact structure:
{
  "name": "Journey map name",
  "stages": [
    {
      "name": "Stage Name",
      "stageType": "sales" | "customer",
      "description": "What happens at this stage for this specific company",
      "emotionalState": "how the customer feels",
      "topFailureRisk": "The most likely CX failure pattern at this stage",
      "successPattern": "The highest-impact success intervention for this stage",
      "benchmarkContext": "How similar companies perform at this stage",
      "meaningfulMoments": [
        {
          "name": "Moment Name",
          "type": "risk" | "delight" | "decision" | "handoff",
          "description": "Why this moment matters for this company",
          "severity": "low" | "medium" | "high" | "critical",
          "triggers": ["signal 1", "signal 2"],
          "recommendations": ["specific action 1", "specific action 2"],
          "diagnosis": "Root cause in 1 sentence",
          "actionTemplate": "Specific action in 1 sentence",
          "cxToolRecommendation": "Tool + why in 1 sentence",
          "impactIfIgnored": "Business cost in 1 sentence",
          "addressesPainPoints": ["pain_point_key_1"]
        }
      ]
    }
  ],
  "confrontationInsights": [
    {
      "pattern": "Pattern Name",
      "likelihood": "high" | "medium" | "low",
      "description": "Why this pattern is likely affecting this company (companion voice)",
      "businessImpact": "Quantified impact",
      "immediateAction": "What to do right now",
      "measureWith": "Which CX tool to track this",
      "companionAdvice": "CX Mate's one-liner in first person",
      "addressesPainPoints": ["pain_point_key_1", "pain_point_key_2"]
    }
  ],
  "cxToolRoadmap": [
    {
      "tool": "Tool name",
      "whenToDeploy": "When to start using this",
      "whyThisTool": "Why this tool at this stage",
      "expectedOutcome": "What you'll learn"
    }
  ],
  "impactProjections": [
    {
      "area": "Area of improvement",
      "potentialImpact": "Estimated annual revenue impact range",
      "timeToRealize": "How long until results",
      "effort": "low | medium | high",
      "calculation": "The math formula showing how you got this number",
      "dataSource": "user_provided" | "benchmark_estimated"
    }
  ],
  "techStackRecommendations": [
    {
      "category": "crm" | "marketing" | "support" | "analytics" | "cs_platform" | "communication" | "bi" | "survey" | "data_infrastructure",
      "categoryLabel": "Human-readable category name (e.g. CRM, Marketing Automation)",
      "tools": ["Tool 1", "Tool 2"],
      "whyNow": "Why this category matters at their stage",
      "connectWith": "What to integrate it with for maximum CX impact"
    }
  ],
  "assumptions": [
    "Key assumption 1 with source (e.g. 'Assumed 4% monthly churn based on industry benchmark for early-stage B2B SaaS')",
    "Key assumption 2..."
  ],
  "maturityAssessment": "2-3 sentence CX Mate assessment in companion voice"
}

Return ONLY the JSON object, no markdown fences, no explanation.`;
}
