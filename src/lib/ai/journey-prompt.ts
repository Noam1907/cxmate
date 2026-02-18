/**
 * AI Engineer: Journey Generation Prompt (v2 — Theory-Backed)
 *
 * This module builds the prompt sent to Claude to generate a
 * customized journey map based on onboarding data.
 *
 * v2 enhancements:
 * - Injects CX theory engine (buyer decision cycle, lifecycle science)
 * - Includes failure/success patterns relevant to company stage
 * - Recommends CX measurement tools per stage
 * - Provides benchmark context for the company's vertical and size
 * - Includes best-practice foundations for early-stage companies
 * - Outputs actionable diagnoses, not just observations
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
import type { OnboardingInput } from "@/lib/validations/onboarding";

// ============================================
// Output Interfaces (v2 — enriched)
// ============================================

export interface GeneratedMoment {
  name: string;
  type: "risk" | "delight" | "decision" | "handoff";
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  triggers: string[];
  recommendations: string[];
  // v2: Theory-backed enrichments
  diagnosis?: string; // What's likely going wrong and why (from CX theory)
  actionTemplate?: string; // Specific thing to do/write/send
  cxToolRecommendation?: string; // Which measurement tool to deploy here
  decisionScienceInsight?: string; // What the buyer/customer is thinking at this stage
  impactIfIgnored?: string; // Business impact of not addressing this
}

export interface GeneratedStage {
  name: string;
  stageType: "sales" | "customer";
  description: string;
  emotionalState: string;
  meaningfulMoments: GeneratedMoment[];
  // v2: Stage-level enrichments
  topFailureRisk?: string; // The most likely CX failure at this stage
  successPattern?: string; // The highest-impact success pattern for this stage
  benchmarkContext?: string; // How similar companies perform at this stage
}

export interface ConfrontationInsight {
  pattern: string; // e.g., "Premature Price Reveal"
  likelihood: "high" | "medium" | "low";
  description: string;
  businessImpact: string;
  immediateAction: string;
  measureWith: string;
}

export interface CxToolRecommendation {
  tool: string;
  whenToDeploy: string;
  whyThisTool: string;
  expectedOutcome: string;
}

export interface ImpactProjection {
  area: string;
  potentialImpact: string; // e.g., "$50K-120K annual revenue impact"
  timeToRealize: string;
  effort: string;
}

export interface GeneratedJourney {
  name: string;
  stages: GeneratedStage[];
  // v2: Journey-level intelligence (optional for backward compatibility with v1 journeys)
  confrontationInsights?: ConfrontationInsight[];
  cxToolRoadmap?: CxToolRecommendation[];
  impactProjections?: ImpactProjection[];
  maturityAssessment?: string; // Where they are and what to focus on
}

// ============================================
// Company Maturity Detection
// ============================================

function detectMaturityStage(companySize: string): MaturityStage {
  // Map company size to maturity stage for knowledge base routing
  switch (companySize) {
    case "1-10":
      return "pre_revenue"; // Or first_customers — small team
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
      return "early";
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
These are the mistakes companies at this stage typically make. Use these to diagnose and confront:

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
// Main Prompt Builder
// ============================================

export function buildJourneyPrompt(input: OnboardingInput): string {
  const vertical = getVertical(input.vertical);
  const defaultStages = getDefaultStages(input.journeyType);
  const defaultMoments = getDefaultMoments(input.journeyType);

  // Detect maturity for knowledge routing
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

  // Build knowledge context sections
  const decisionCycleContext = buildDecisionCycleContext();
  const lifecycleContext = buildLifecycleContext();
  const failureContext = buildFailurePatternContext(companyStage);
  const successContext = buildSuccessPatternContext(companyStage);
  const toolsContext = buildMeasurementToolsContext();
  const benchmarkContext = buildBenchmarkContext(input.vertical, input.companySize);
  const foundationsContext = buildFoundationsContext(maturityStage);

  return `You are a world-class CX architect with deep expertise in B2B customer experience, buyer psychology, and decision science. You don't just map journeys — you diagnose problems, prescribe actions, and quantify impact.

## Company Context
- Company: ${input.companyName}
- Size: ${input.companySize} employees
- Maturity stage: ${maturityStage} (${companyStage})
${verticalContext}
- Journey type requested: ${input.journeyType}
- Their customers: ${input.customerDescription}
- Customer size: ${input.customerSize}
- Main acquisition channel: ${input.mainChannel}

## Their Challenges
- Biggest challenge: ${input.biggestChallenge}
- Pain points: ${input.painPoints.join(", ")}${input.customPainPoint ? `, ${input.customPainPoint}` : ""}

## Their Goals
- Primary goal: ${input.primaryGoal}
- Timeframe: ${input.timeframe}
${input.additionalContext ? `- Additional context: ${input.additionalContext}` : ""}

## Default Template
The standard stages for a ${input.journeyType} journey are: ${stageNames}
Standard meaningful moments include: ${momentNames}

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
Generate a customized, theory-backed journey map that goes beyond generic advice:

1. **Stages**: Use the standard stages as a foundation but customize names, descriptions, and emotional states to match this specific company. For each stage, identify the top failure risk and recommend the highest-impact success pattern.

2. **Meaningful Moments (2-4 per stage)**: Tailored to their industry and challenges. For each moment:
   - Provide a theory-backed **diagnosis** (what's likely going wrong and the root cause, based on the failure patterns and decision science above)
   - Give a specific **actionTemplate** (exactly what to do, write, or send — not vague advice)
   - Recommend a specific **cxToolRecommendation** (which measurement tool to deploy at this moment)
   - Include a **decisionScienceInsight** (what the buyer/customer is psychologically experiencing here)
   - State the **impactIfIgnored** (the business cost of not addressing this)

3. **Confrontation Insights (3-5)**: The most important "here's what companies like you get wrong" findings. Be specific and direct. Each includes the pattern name, likelihood for this company, business impact, immediate action, and what to measure.

4. **CX Tool Roadmap (3-5 tools)**: Which CX measurement tools to deploy, in what order, and why. Match to the company's maturity stage.

5. **Impact Projections (2-3)**: Estimated business impact if they address the top CX issues. Use the benchmarks above to ground estimates.

6. **Maturity Assessment**: A 2-3 sentence assessment of where this company is, what they should focus on first, and what to avoid doing too early.

Prioritize moments related to their stated pain points. Use plain language — no CX jargon. Be direct and confrontational when needed.

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
      "topFailureRisk": "The most likely CX failure pattern at this stage (from the failure patterns above)",
      "successPattern": "The highest-impact success intervention for this stage",
      "benchmarkContext": "How similar companies perform at this stage (from benchmarks)",
      "meaningfulMoments": [
        {
          "name": "Moment Name",
          "type": "risk" | "delight" | "decision" | "handoff",
          "description": "Why this moment matters for this company",
          "severity": "low" | "medium" | "high" | "critical",
          "triggers": ["signal 1", "signal 2"],
          "recommendations": ["specific action 1", "specific action 2"],
          "diagnosis": "What's likely going wrong and the root cause",
          "actionTemplate": "Specific thing to do/write/send (be concrete — include email text, survey questions, or process steps)",
          "cxToolRecommendation": "Which CX measurement tool to deploy here and why",
          "decisionScienceInsight": "What the buyer/customer is psychologically experiencing",
          "impactIfIgnored": "Business cost of not addressing this (use benchmarks to quantify)"
        }
      ]
    }
  ],
  "confrontationInsights": [
    {
      "pattern": "Pattern Name (from the failure patterns knowledge)",
      "likelihood": "high" | "medium" | "low",
      "description": "Why this pattern is likely affecting this company",
      "businessImpact": "Quantified impact (use benchmarks)",
      "immediateAction": "What to do right now (be specific)",
      "measureWith": "Which CX tool to track this"
    }
  ],
  "cxToolRoadmap": [
    {
      "tool": "Tool name",
      "whenToDeploy": "When to start using this (e.g., 'Week 1', 'After 30 customers')",
      "whyThisTool": "Why this tool at this stage",
      "expectedOutcome": "What you'll learn from deploying this"
    }
  ],
  "impactProjections": [
    {
      "area": "Area of improvement",
      "potentialImpact": "Estimated annual revenue impact range",
      "timeToRealize": "How long until you see results",
      "effort": "low | medium | high"
    }
  ],
  "maturityAssessment": "2-3 sentence assessment of where this company is and what to focus on"
}

Return ONLY the JSON object, no markdown fences, no explanation.`;
}
