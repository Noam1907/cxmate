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
import { getPainPointsForMaturity, type CompanyMaturity } from "@/types/onboarding";

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
  diagnosis?: string; // v5: evidence format "[source_tag] evidence statement" — REQUIRED in prompt output, optional for DB compat
  actionTemplate?: string;
  cxToolRecommendation?: string;
  decisionScienceInsight?: string;
  impactIfIgnored?: string;
  addressesPainPoints?: string[]; // v4: links moment back to user's stated pain point keys
  competitorGap?: string; // v4: competitor-specific insight for this moment
  nextStep?: string; // v5: actionable next step with specific tool name (e.g. "Set up in HubSpot", "Track with Mixpanel")
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
  evidenceBasis?: string; // v5: "[source_tag] explanation of evidence chain"
}

export interface CxToolRecommendation {
  tool: string;
  whenToDeploy: string;
  whyThisTool: string;
  expectedOutcome: string;
  aiCapability?: string; // v5: What AI/agent capability this tool provides
  automationLevel?: "autonomous" | "agent_assisted" | "human_led"; // v5
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

export interface MethodologyNote {
  dataLayersUsed: string[];
  crossReferences: string[];
  frameworksApplied: string[];
  personalizedTo: string;
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
  methodologyNote?: MethodologyNote; // v5: how CX Mate built this analysis
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
// v5: Tense Matrix (maturity-aware language)
// ============================================

const TENSE_MATRIX: Record<CompanyMaturity, string> = {
  pre_launch: `FUTURE TENSE — This company has no customers. Use "will," "would," "can expect."
- Moments: "Prospects WILL encounter..." not "Prospects encounter..."
- Risks: "If [Company] doesn't address this, first customers WILL..." not "Customers are experiencing..."
- Recommendations: "When you launch, SET UP..." not "You should be doing..."
- Never reference existing customer behavior — it doesn't exist yet.`,

  first_customers: `PRESENT + CONDITIONAL — Early customers, patterns forming not established.
- Moments: "Your first customers ARE experiencing..." or "Early signs SUGGEST..."
- Risks: "If this continues, it WILL become..." not "This is costing you..."
- Recommendations: "Start doing this NOW before it becomes a pattern..."
- Revenue impact: use ranges and conditionals ("COULD cost," "risks becoming").`,

  growing: `PRESENT TENSE — Real customers, real data, real patterns.
- Moments: "Your customers ARE experiencing..." / "This IS happening..."
- Risks: "This IS costing [Company]..." not "This could cost..."
- Recommendations: "Fix this now" / "Your team NEEDS to..."
- Revenue impact: use definitive statements with stated confidence level.`,

  scaling: `PRESENT + HISTORICAL — Enough history to reference trends.
- Moments: "Your customers HAVE BEEN experiencing..." / "This pattern HAS persisted..."
- Risks: "This HAS cost [Company]..." / "Over the past year, this trend HAS..."
- Recommendations: "It's time to formalize..." / "You've outgrown the current approach..."
- Revenue impact: reference trajectory ("growing from X to Y," "accelerating").`,
};

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
  const modeLine = input.hasExistingCustomers
    ? `Mode: COMPARISON — validate progress, compare vs ${input.vertical} best practices, show revenue gaps with math. Peer tone: "Companies like yours..."`
    : `Mode: PRESCRIPTIVE — prescribe optimal journey from day one, top 3 priorities only, percentage-based projections. Mentor tone.`;

  const maturity = (input.companyMaturity as CompanyMaturity) || "first_customers";
  const tenseRule = TENSE_MATRIX[maturity] || TENSE_MATRIX.first_customers;

  return `${modeLine}

Tense rule based on maturity:
${tenseRule}`;
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

  // Resolve pain point values to human-readable labels
  const painPointOptions = getPainPointsForMaturity(input.companyMaturity as CompanyMaturity) || [];
  const painPointLabels = input.painPoints.map((value) => {
    const option = painPointOptions.find((o) => o.value === value);
    return option ? option.label : value; // fallback to raw value if not found
  });

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

## Personalization Rules (MANDATORY — screenshot test)
Every field must pass the "screenshot test": if someone screenshots any single field, it must be obvious this was built for THIS company.
1. COMPANY NAME: Use "${input.companyName}" by name in journey name, every confrontation pattern/description, maturityAssessment. Never use "your company" when you can use the name.
2. VERTICAL: Reference ${input.vertical}${input.industry ? ` / ${input.industry}` : ""} in stage descriptions, moment descriptions, confrontation insights.
3. TOOLS: When user has tools (${input.currentTools || "none specified"}), reference specific tool names in recommendations and immediateAction fields.
4. PAIN POINTS: Echo the user's exact pain point language in descriptions — not just in addressesPainPoints tags.
5. CUSTOMERS: Reference ${input.customerDescription} (${input.customerSize}) in stage descriptions and triggers.

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

## Their Challenges (CRITICAL — EVERY pain point must appear in the output)
- Biggest challenge: ${input.biggestChallenge}
- Pain points (EACH is an independent problem — do NOT merge or combine them):
${painPointLabels.map((label, i) => `  ${i + 1}. "${label}"`).join("\n")}${input.customPainPoint ? `\n  ${painPointLabels.length + 1}. "${input.customPainPoint}"` : ""}

⚠️ MANDATORY RULES FOR PAIN POINTS:
1. Every pain point listed above MUST be reflected in at least one meaningful moment's addressesPainPoints OR one confrontation insight's addressesPainPoints.
2. Each pain point is a SEPARATE, INDEPENDENT problem. NEVER merge two unrelated pain points into one insight. "Founder-led sales" and "billing bottlenecks" are two different problems — address them separately.
3. Use the EXACT pain point text when tagging addressesPainPoints so we can trace it.
4. If a pain point doesn't naturally fit into a moment, create a confrontation insight specifically for it.
The user explicitly told us these are their problems — if the output doesn't address them individually, it feels generic and AI-mashed.

## Evidence Requirement (MANDATORY)
Every meaningful moment and every confrontation insight MUST include evidence for its claims. Evidence sources (tag it):
- "user_stated" — the user told us this directly (pain point, challenge, tool, process)
- "enrichment" — from AI-enriched company intelligence data
- "benchmark" — from industry/vertical/size benchmarks
- "inferred" — we connected two data points (e.g., deal size + customer count = revenue exposure)
Use the diagnosis field on moments and evidenceBasis field on confrontation insights to show WHY. Format: "[source_tag] specific evidence statement"

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

## Generic Statement Anchoring Rule
When making a broad statement, NEVER leave it generic. Anchor it:
- "B2B ${input.vertical} companies at ${input.companyName}'s stage typically see..."
- "Companies similar to ${input.companyName} — ${input.companySize} ${input.vertical} teams — report..."
NEVER write: "Companies see..." / "Best practice is..." / "Research shows..."

## AI-First Recommendation Rules
For every moment recommendation and cxToolRoadmap entry, think AI-NATIVE first:
1. AUTOMATION LEVEL: Do NOT put bracket tags like [autonomous] or [agent-assisted] in recommendation text. Instead, use the cxToolRoadmap's automationLevel field for this.
2. SPECIFICITY: Name the actual AI tool/platform, not just the category
3. INTEGRATION: When user has tools, recommend AI layers ON TOP of their stack
4. AI tools: Intercom Fin, Zendesk AI, Gong, Gainsight Staircase AI, ChurnZero AI, Zapier AI agents, SentiSum, 11x.ai
5. CLEAN TEXT: Recommendation strings must be plain actionable text. No brackets, no tags, no prefixes. Write like you're telling a colleague what to do.
6. NEXT STEP: Every moment MUST have a "nextStep" field — a short, specific action with a NAMED TOOL. Examples: "Set up onboarding sequence in HubSpot", "Create health score in Gainsight", "Build dashboard in Mixpanel", "Draft playbook in NotebookLM", "Automate alert in Slack". If the user already has the tool, reference THEIR tool. Never say just "use a tool" — name it.

## Methodology Note (REQUIRED)
Generate a "methodologyNote" object explaining HOW CX Mate structured this analysis:
- "dataLayersUsed" — which data sources fed this analysis (company profile, enrichment, benchmarks, maturity, pain points, competitors, existing processes, business data)
- "crossReferences" — specific connections made across layers (e.g., "Connected pain point X to 3 moments")
- "frameworksApplied" — CX frameworks used (CCXP, vertical benchmarks, stage guidance)
- "personalizedTo" — "Built specifically for [Company], a [size]-employee [vertical] company at [stage] stage with [customer_count] customers."

## Confrontation Insight Ordering (MANDATORY)
- Insight #1 MUST directly address the user's biggestChallenge ("${input.biggestChallenge}") or their #1 pain point. It MUST include "${input.companyName}" by name and a specific, quantified consequence.
- Insight #2 MUST reveal a HIDDEN connection — something the user did NOT explicitly state but that we can infer by crossing two data points (e.g., deal size + churn signal = revenue exposure they haven't calculated).
- Insight #3 (if present) can be a broader industry pattern or benchmark comparison.
Goal: #1 proves "we listened," #2 proves "we're smarter than a search engine," #3 proves "we know your industry."

## Website Recommendation Rules (MANDATORY)
- NEVER recommend "improve website messaging," "add use cases," "add testimonials," or ANY website content change UNLESS the enrichment data explicitly confirms the gap.
- If no enrichment data is available, do NOT make any website-specific recommendations. Say nothing rather than risk being wrong about something the user can verify in 5 seconds.
- SAFE alternatives: recommend internal process improvements, team alignment, measurement setup — things we CAN assess from their inputs.

## Task
Generate JSON journey map. ULTRA CONCISE — every field max 12 words. emotionalState max 4 words. EXCEPTION: diagnosis, evidenceBasis, and methodologyNote fields are exempt from the 12-word limit — these should be thorough.
${!input.hasExistingCustomers ? 'All stageType MUST be "sales". No post-sale stages. ' : ""}Counts: 2 moments/stage, 2-3 confrontation insights, 2 cxToolRoadmap, 2 impactProjections, 2-3 techStack, 2 assumptions.
Impact projections MUST include calculation (math formula) and dataSource. potentialImpact MUST be a dollar value (e.g. "$50K", "$120K", "$1.2M") — never percentages or vague text. confrontationInsights businessImpact MUST also be a dollar value (e.g. "$50K", "$2.1M") — never descriptive text like "Lost expansion revenue". Put the dollar amount in businessImpact, NOT in the pattern title. addressesPainPoints: tag generously. Use the exact pain point text from above. diagnosis is REQUIRED on every moment (evidence format). evidenceBasis is REQUIRED on every confrontation insight.

JSON schema:
{"name":"str","stages":[{"name":"str","stageType":"sales|customer","description":"str","emotionalState":"2-4 words","topFailureRisk":"str","successPattern":"str","benchmarkContext":"str","existingTools":[{"name":"str","domain":"str"}],"meaningfulMoments":[{"name":"str","type":"risk|delight|decision|handoff","description":"str","severity":"low|medium|high|critical","triggers":["str"],"recommendations":["str"],"diagnosis":"str","actionTemplate":"str","cxToolRecommendation":"str","impactIfIgnored":"str","addressesPainPoints":["str"],"nextStep":"str"}]}],"confrontationInsights":[{"pattern":"str","likelihood":"high|medium|low","description":"str","businessImpact":"str","immediateAction":"str","measureWith":"str","companionAdvice":"str","addressesPainPoints":["str"],"evidenceBasis":"str"}],"cxToolRoadmap":[{"tool":"str","whenToDeploy":"str","whyThisTool":"str","expectedOutcome":"str","aiCapability":"str","automationLevel":"autonomous|agent_assisted|human_led"}],"impactProjections":[{"area":"str","potentialImpact":"str","timeToRealize":"str","effort":"low|medium|high","calculation":"math formula","dataSource":"user_provided|benchmark_estimated"}],"techStackRecommendations":[{"category":"crm|marketing|support|analytics|cs_platform|communication|bi|survey|data_infrastructure","categoryLabel":"str","tools":["str"],"whyNow":"str","connectWith":"str"}],"assumptions":["str"],"maturityAssessment":"str","methodologyNote":{"dataLayersUsed":["str"],"crossReferences":["str"],"frameworksApplied":["str"],"personalizedTo":"str"}}

Return ONLY JSON.`;
}
