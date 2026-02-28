/**
 * AI Engineer: Recommendation/Playbook Generation Prompt
 *
 * Takes a generated journey + company context and produces actionable
 * playbook recommendations for each meaningful moment.
 *
 * This powers Layer 2 (Playbook — $249/mo): specific actions, templates,
 * timelines, and ownership for every moment in the journey.
 */

import {
  getSuccessPatternsByStage,
  getFailurePatternsByStage,
  MEASUREMENT_TOOLS,
  getStageGuidance,
  type MaturityStage,
} from "@/lib/cx-knowledge";
import type { OnboardingInput } from "@/lib/validations/onboarding";
import type { GeneratedJourney, GeneratedStage, GeneratedMoment } from "./journey-prompt";

// ============================================
// Output Interfaces
// ============================================

export interface PlaybookRecommendation {
  momentName: string;
  stageName: string;
  action: string; // What to do — specific and concrete
  type: "email" | "call" | "internal_process" | "automation" | "measurement";
  priority: "must_do" | "should_do" | "nice_to_have";
  owner: string; // Who should do this (role, not a name)
  timing: string; // When to do it (e.g., "Within 24 hours of signup")
  template?: string; // Ready-to-use email/script/checklist
  expectedOutcome: string;
  effort: "15_min" | "1_hour" | "half_day" | "multi_day";
  measureWith: string; // How to know it worked
}

export interface StagePlaybook {
  stageName: string;
  stageType: "sales" | "customer";
  topPriority: string; // The single most important thing to do at this stage
  recommendations: PlaybookRecommendation[];
}

export interface GeneratedPlaybook {
  companyName: string;
  generatedAt: string;
  totalRecommendations: number;
  mustDoCount: number;
  stagePlaybooks: StagePlaybook[];
  quickWins: PlaybookRecommendation[]; // Top 3-5 highest-impact, lowest-effort items
  weekOneChecklist: string[]; // 5-7 things to do this week
}

// ============================================
// Knowledge Context Builders
// ============================================

function buildSuccessPatternContext(companyStage: "early" | "growing" | "established"): string {
  const patterns = getSuccessPatternsByStage(companyStage);
  return patterns
    .map(
      (p) =>
        `- **${p.name}** (${p.phase}, effort: ${p.effort}): ${p.description} ` +
        `Implementation: 1) ${p.implementation.step1} 2) ${p.implementation.step2} 3) ${p.implementation.step3}. ` +
        `Template: ${p.template || "N/A"}`
    )
    .join("\n");
}

function buildFailurePatternContext(companyStage: "early" | "growing" | "established"): string {
  const patterns = getFailurePatternsByStage(companyStage);
  return patterns
    .map(
      (p) =>
        `- **${p.name}** (${p.phase}): ${p.description} ` +
        `Immediate fix: ${p.fix.immediate} ` +
        `Short-term fix: ${p.fix.shortTerm}`
    )
    .join("\n");
}

function buildToolsContext(): string {
  return MEASUREMENT_TOOLS.map(
    (t) =>
      `- **${t.name}**: ${t.whatItMeasures}. Question: "${t.question}". ` +
      `Best for stages: ${t.bestForStages.join(", ")}.`
  ).join("\n");
}

function buildStageGuidanceContext(maturityStage: MaturityStage): string {
  const guidance = getStageGuidance(maturityStage);
  if (!guidance) return "";

  return `Stage: ${guidance.name}
Focus: ${guidance.keyFocus}
Immediate actions: ${guidance.immediateActions.join("; ")}
CX tools to deploy: ${guidance.cxToolsToDeploy.join("; ")}
Don't do yet: ${guidance.dontDoYet.join("; ")}`;
}

// ============================================
// Journey Summary Builder
// ============================================

function buildJourneySummary(journey: GeneratedJourney): string {
  return journey.stages
    .map((stage: GeneratedStage) => {
      const moments = stage.meaningfulMoments
        .map(
          (m: GeneratedMoment) =>
            `    - ${m.name} (${m.type}, ${m.severity}): ${m.description}` +
            (m.diagnosis ? ` Diagnosis: ${m.diagnosis}` : "")
        )
        .join("\n");

      return `  Stage: ${stage.name} (${stage.stageType})
  Description: ${stage.description}
  Top failure risk: ${stage.topFailureRisk || "N/A"}
  Moments:
${moments}`;
    })
    .join("\n\n");
}

// ============================================
// Maturity Detection
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
// Main Prompt Builder
// ============================================

export function buildRecommendationPrompt(
  journey: GeneratedJourney,
  input: OnboardingInput
): string {
  const maturityStage = detectMaturityStage(input.companySize);
  const companyStage = detectCompanyStage(input.companySize);

  const successPatterns = buildSuccessPatternContext(companyStage);
  const failurePatterns = buildFailurePatternContext(companyStage);
  const toolsContext = buildToolsContext();
  const stageGuidance = buildStageGuidanceContext(maturityStage);
  const journeySummary = buildJourneySummary(journey);

  return `You are CX Mate's playbook engine — a practical, no-BS implementation advisor for B2B startups. You turn CX diagnoses into specific, actionable playbooks that a small team can execute this week.

Your voice: Direct, confident, touch of humor. You're the friend who's built this before and is telling them exactly what to do. "Here's what to send on Day 3" not "Consider reaching out to the customer." Include ready-to-use templates they can copy-paste — not vague advice.

## Who We're Building For
${input.userName ? `- Person: ${input.userName}${input.userRole ? ` (${input.userRole})` : ""}` : ""}${input.userRole && !input.userName ? `- Role: ${input.userRole}` : ""}
${input.userRole ? `Tailor owner assignments and language to their role. If they're a CEO, recommendations should be delegatable. If they're a Head of CS, make them tactical and hands-on.` : ""}

## Company Context
- Company: ${input.companyName}
- Size: ${input.companySize} employees (${companyStage} stage)
- Vertical: ${input.vertical}
- Has existing customers: ${input.hasExistingCustomers ? "Yes" : "No (pre-customer)"}
- Customers: ${input.customerDescription} (${input.customerSize})
- Main channel: ${input.mainChannel}
${input.preLiveProcess ? `- Pre-live / implementation process: ${input.preLiveProcess}` : ""}
${input.pricingModel ? `- Pricing model: ${input.pricingModel}` : ""}
${input.roughRevenue ? `- Revenue range: ${input.roughRevenue}` : ""}
${input.averageDealSize ? `- Avg deal size: ${input.averageDealSize}` : ""}
${input.customerCount ? `- Customer count: ${input.customerCount}` : ""}
${input.competitors ? `- Competitors: ${input.competitors}` : ""}
${input.currentTools ? `- Current tools/stack: ${input.currentTools}\nWhen recommending tools or automation, BUILD ON their existing stack. Recommend integrations, not replacements. If they use HubSpot, recommend HubSpot workflows — don't suggest switching to Salesforce.` : ""}
${input.hasExistingJourney === "yes" || input.hasExistingJourney === "partial" ? `
## Existing Processes (Don't Reinvent)
- Status: ${input.hasExistingJourney === "yes" ? "Has formal processes" : "Has partial processes"}
${input.existingJourneyComponents && input.existingJourneyComponents.length > 0 ? `- Already have: ${input.existingJourneyComponents.join(", ")}` : ""}
${input.existingJourneyDescription ? `- Description: "${input.existingJourneyDescription}"` : ""}
IMPORTANT: Acknowledge and build on their existing work. Recommendations for stages they already cover should be IMPROVEMENTS, not from-scratch rebuilds.` : ""}
- Biggest challenge: ${input.biggestChallenge}
- Pain points: ${input.painPoints.join(", ")}${input.customPainPoint ? `, ${input.customPainPoint}` : ""}
- Primary goal: ${input.primaryGoal}${input.customGoal ? ` (${input.customGoal})` : ""}
- Timeframe: ${input.timeframe}
${input.additionalContext ? `- Additional context: ${input.additionalContext}` : ""}

## Stage Guidance
${stageGuidance}

## Their Journey Map
${journeySummary}

## CX Knowledge Base

### Success Patterns (what works for ${companyStage}-stage companies)
${successPatterns}

### Common Failures (what to fix)
${failurePatterns}

### CX Measurement Tools
${toolsContext}

---

## Your Task

Generate a complete playbook with 3-5 specific recommendations per journey stage. Each recommendation should be something the team can actually DO — not vague advice.

Rules:
1. **Be specific.** "Send a check-in email" is bad. "Send this exact email at Day 7" with the actual email text is good.
2. **Include templates.** Every email, call script, or process recommendation should include a ready-to-use template they can copy-paste.
3. **Match their stage.** A 10-person company doesn't need a QBR process. A 200-person company doesn't need "just talk to your customers."
4. **Prioritize ruthlessly.** Mark the 1-2 items per stage as "must_do" and the rest as "should_do" or "nice_to_have."
5. **Assign owners.** Use roles like "Founder," "Sales Rep," "CS Manager," "Product Team" — not names.
6. **Make effort realistic.** Use these effort levels: "15_min", "1_hour", "half_day", "multi_day".
7. **Connect to measurement.** Every recommendation should say how to know it worked.
8. **ALWAYS RECOMMEND AI SOLUTIONS.** For EVERY recommendation, think about whether an AI tool available TODAY can automate, assist, or enhance it. Actively recommend specific AI-powered tools and solutions. Examples:
   - AI writing assistants (Jasper, Copy.ai) for email/content templates
   - AI chatbots (Intercom Fin, Zendesk AI, Drift) for customer support and onboarding
   - AI-powered analytics (Mixpanel, Amplitude, FullStory with AI insights) for behavior analysis
   - AI meeting assistants (Gong, Chorus, Fireflies) for call analysis and coaching
   - AI customer success platforms (Gainsight with AI, Totango, ChurnZero) for health scoring
   - AI survey/feedback tools (Qualtrics XM, Medallia, SentiSum) for sentiment analysis
   - AI sales tools (Apollo, Outreach, Salesloft) for prospecting and sequencing
   - AI knowledge bases (Notion AI, Guru, Slite) for internal documentation
   - AI workflow automation (Zapier AI, Make, n8n) for process automation
   - LLM-powered personalization for emails, onboarding flows, and customer communications
   When recommending AI tools, be specific: name the tool, explain HOW it applies to their specific moment, and note if it replaces manual work. The future of CX is AI-augmented — make sure every playbook reflects this.
${!input.hasExistingCustomers ? '9. **PRE-CUSTOMER CONSTRAINT (CRITICAL):** This company has NO customers yet. Every recommendation MUST be sales-focused (winning first customers). Do NOT generate any recommendations about customer onboarding, customer success, retention, renewal, or expansion. Those do not apply. The weekOneChecklist and quickWins must also be 100% sales-focused.' : ""}

## Output Format

Return a JSON object with this exact structure:
{
  "companyName": "${input.companyName}",
  "generatedAt": "${new Date().toISOString()}",
  "totalRecommendations": <number>,
  "mustDoCount": <number>,
  "stagePlaybooks": [
    {
      "stageName": "Stage Name",
      "stageType": "sales" | "customer",
      "topPriority": "The single most important thing at this stage (one sentence)",
      "recommendations": [
        {
          "momentName": "Which moment this addresses",
          "stageName": "Stage Name",
          "action": "Specific action to take (2-3 sentences max)",
          "type": "email" | "call" | "internal_process" | "automation" | "measurement",
          "priority": "must_do" | "should_do" | "nice_to_have",
          "owner": "Role name",
          "timing": "When to do this (specific trigger or timeframe)",
          "template": "Ready-to-use template text (email body, script, checklist). Include actual words they should use. Use [brackets] for personalization fields.",
          "expectedOutcome": "What happens when they do this right",
          "effort": "15_min" | "1_hour" | "half_day" | "multi_day",
          "measureWith": "How to know it worked (specific metric or signal)"
        }
      ]
    }
  ],
  "quickWins": [
    // Top 3-5 recommendations with lowest effort and highest impact (reference the same objects from stagePlaybooks)
  ],
  "weekOneChecklist": [
    "Action 1 to do this week",
    "Action 2 to do this week",
    // 5-7 items total
  ]
}

Return ONLY the JSON object, no markdown fences, no explanation.`;
}
