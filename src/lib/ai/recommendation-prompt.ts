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
  // Layer 1A: CX Influencer Frameworks
  getRelevantFrameworks,
  buildInfluencerPromptContext,
  // Layer 1B: CCXP Professional Framework
  buildCCXPPromptContext,
} from "@/lib/cx-knowledge";
import type { OnboardingInput } from "@/lib/validations/onboarding";
import { getPainPointsForMaturity, type CompanyMaturity } from "@/types/onboarding";
import type { GeneratedJourney, GeneratedStage, GeneratedMoment } from "./journey-prompt";

// ============================================
// Output Interfaces
// ============================================

export interface PlaybookRecommendation {
  momentName: string;
  stageName: string;
  action: string; // What to do — specific and concrete
  type: "email" | "call" | "internal_process" | "automation" | "measurement" | "ai_agent";
  priority: "must_do" | "should_do" | "nice_to_have";
  owner: string; // Who should do this (role, not a name)
  timing: string; // When to do it (e.g., "Within 24 hours of signup")
  template?: string; // Ready-to-use email/script/checklist
  expectedOutcome: string;
  effort: "15_min" | "1_hour" | "half_day" | "multi_day";
  measureWith: string; // How to know it worked
  toolsUsed?: string[]; // Specific tools from the user's stack referenced in this recommendation (e.g., ["HubSpot", "Intercom"])
  addressesRisk?: string; // Which confrontation insight pattern this recommendation addresses (e.g., "Stakeholder misalignment kills 40% of expansion deals")
}

export interface StagePlaybook {
  stageName: string;
  stageType: "sales" | "customer";
  topPriority: string; // The single most important thing to do at this stage
  recommendations: PlaybookRecommendation[];
  measurementPlan?: string; // Which CX measurement to set up at this stage (NPS/CSAT/CES/event trigger) and when
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
// Confrontation Insights Summary
// ============================================

function buildConfrontationInsightsSummary(journey: GeneratedJourney): string {
  const insights = journey.confrontationInsights;
  if (!insights || insights.length === 0) return "";

  const lines = insights.map((insight, i) =>
    `${i + 1}. **"${insight.pattern}"** (${insight.likelihood} likelihood, ${insight.businessImpact} at risk)\n` +
    `   ${insight.description}\n` +
    (insight.immediateAction ? `   Immediate action suggested: ${insight.immediateAction}\n` : "") +
    (insight.competitorContext ? `   Competitor context: ${insight.competitorContext}\n` : "")
  );

  return `## Risks Identified in the Journey Analysis (MUST ADDRESS)

The journey analysis identified these specific patterns that threaten this company's growth. Your playbook MUST include recommendations that directly address each one. Tag each relevant recommendation with the risk pattern it addresses using the \`addressesRisk\` field.

${lines.join("\n")}

⚠️ CRITICAL: Every one of these risks must have at least one "must_do" recommendation that directly addresses it. The user will see these risks on the Analysis page and expect the Playbook to tell them exactly what to do about each one. This is the story arc — risk identified → action recommended.`;
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
  const confrontationContext = buildConfrontationInsightsSummary(journey);

  // Resolve pain point values to human-readable labels
  const painPointOptions = getPainPointsForMaturity(input.companyMaturity as CompanyMaturity) || [];
  const painPointLabels = input.painPoints.map((value) => {
    const option = painPointOptions.find((o) => o.value === value);
    return option ? option.label : value;
  });

  // Layer 1: Methodology Intelligence
  const relevantFrameworks = getRelevantFrameworks(
    input.painPoints,
    companyStage,
    input.journeyType
  );
  const influencerContext = buildInfluencerPromptContext(relevantFrameworks);
  const ccxpContext = buildCCXPPromptContext(companyStage);

  return `You are CX Mate's playbook engine — a practical, no-BS implementation advisor for B2B startups. You turn CX diagnoses into specific, actionable playbooks that a small team can execute this week.

Your voice: Direct, confident, touch of humor. You're the friend who's built this before and is telling them exactly what to do. "Here's what to send on Day 3" not "Consider reaching out to the customer." Include ready-to-use templates they can copy-paste — not vague advice.

## Who We're Building For
${input.userName ? `- Person: ${input.userName}${input.userRole ? ` (${input.userRole})` : ""}` : ""}${input.userRole && !input.userName ? `- Role: ${input.userRole}` : ""}
${input.userRole ? `Tailor owner assignments and language to their role. If they're a CEO, recommendations should be delegatable. If they're a Head of CS, make them tactical and hands-on.` : ""}

## Company Context
- Company: ${input.companyName}
- Size: ${input.companySize} employees (${companyStage} stage)
- Vertical: ${input.vertical}${input.industry ? ` / ${input.industry}` : ""}
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
- Pain points: ${painPointLabels.join("; ")}${input.customPainPoint ? `; ${input.customPainPoint}` : ""}
- Primary goal: ${input.primaryGoal}${input.customGoal ? ` (${input.customGoal})` : ""}
${input.secondaryGoals?.length ? `- Additional goals: ${input.secondaryGoals.join(", ")}` : ""}- Timeframe: ${input.timeframe}
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

${influencerContext}

${ccxpContext}

${confrontationContext}

---

## Your Task

Generate a complete playbook with 2-4 specific recommendations per journey stage. Each recommendation should be something the team can actually DO — not vague advice.

⚠️ TOKEN BUDGET: Keep total output under 14000 tokens. Be concise:
- "action" field: 1-2 sentences max
- "template" field: 3-5 sentences max (a micro-template, not a full email). Use [brackets] for personalization.
- "expectedOutcome": 1 sentence
- "measureWith": 1 sentence
- "topPriority": 1 sentence
- "weekOneChecklist": 5 items max, each under 15 words
- "quickWins": 3 items max
- Prefer fewer, higher-quality recommendations over quantity

Rules:
1. **Be specific.** "Send a check-in email" is bad. "Send this exact email at Day 7" with the actual email text is good.
2. **Include templates.** Every email, call script, or process recommendation should include a ready-to-use template they can copy-paste.
3. **Match their stage.** A 10-person company doesn't need a QBR process. A 200-person company doesn't need "just talk to your customers."
4. **Prioritize ruthlessly.** Mark the 1-2 items per stage as "must_do" and the rest as "should_do" or "nice_to_have."
5. **Assign owners.** Use roles like "Founder," "Sales Rep," "CS Manager," "Product Team" — not names.
6. **Make effort realistic.** Use these effort levels: "15_min", "1_hour", "half_day", "multi_day".
7. **Connect to measurement.** Every recommendation should say how to know it worked.
7b. **Tag tools explicitly.** When a recommendation specifically uses a tool from their stack (${input.currentTools ? `their tools: ${input.currentTools}` : "no specific stack given"}), include those tool names in the \`toolsUsed\` array so users can see exactly which of their tools each action uses. Only include tools that are genuinely part of executing that specific action.
8. **ALWAYS RECOMMEND AI AGENTS AND AGENTIC SOLUTIONS — NOT JUST TOOLS.** Think in the new world: autonomous AI agents that work 24/7, not just software with AI features bolted on. For EVERY recommendation, ask: "Could an AI agent handle this autonomously?" If yes, recommend the agent-first approach.

   **Agentic recommendations (prioritize these):**
   - **AI support agents** (Intercom Fin, Zendesk AI, Ada) — autonomous first-response agents that resolve 60-80% of tickets without human intervention, learn from every interaction, escalate intelligently
   - **AI SDR/BDR agents** (11x.ai, Artisan, Relevance AI) — autonomous prospecting agents that research leads, write personalized outreach, handle replies, and book meetings while humans sleep
   - **AI onboarding agents** — build custom agents (via LLM APIs or platforms like Relevance AI, Voiceflow) that guide new users through setup conversationally, detect confusion, adapt the flow in real-time
   - **AI customer success agents** (Gainsight Staircase AI, ChurnZero AI) — agents that monitor health signals continuously, detect risk patterns before humans notice, auto-trigger interventions
   - **AI meeting intelligence agents** (Gong, Fireflies, Otter) — agents that join calls autonomously, extract action items, detect sentiment shifts, flag coaching moments, generate follow-ups
   - **AI workflow agents** (Zapier AI agents, Make AI, n8n with LLM nodes, Relevance AI) — agents that don't just automate triggers but make decisions: "customer hasn't logged in for 7 days AND has open support ticket → send personalized re-engagement with context"
   - **AI content agents** — agents that generate personalized customer communications at scale: onboarding sequences that adapt per user, renewal messages that reference actual usage data, expansion suggestions timed to value milestones
   - **AI analytics agents** (Mixpanel, Amplitude, FullStory with AI) — agents that proactively surface insights: "3 customers from your enterprise segment dropped off at the same step this week"
   - **AI feedback agents** (Qualtrics XM, SentiSum, MonkeyLearn) — agents that continuously analyze open-text feedback across channels, detect emerging themes, alert on sentiment shifts
   - **AI knowledge agents** (Notion AI, Guru, Glean) — agents that keep internal docs current, answer team questions instantly, detect when documentation is stale or contradicts actual processes

   **The framing matters:** Don't say "use Intercom for chat support." Say "deploy an AI support agent that handles first-response 24/7 and escalates to your team only when it detects genuine complexity or emotional escalation." The recommendation should describe the AGENT's behavior, not just the tool name.

   **For every recommendation, specify the automation level:**
   - 🤖 **Fully autonomous** — agent handles end-to-end, human reviews results
   - 🤖+👤 **Agent-assisted** — agent does the heavy lifting, human makes the final call
   - 👤 **Human-led, AI-enhanced** — human drives, AI provides context/drafts/analysis

   When recommending, be specific: name the agent/platform, describe what the agent DOES autonomously, what it escalates, and what it learns over time. The future of CX is agentic — every playbook should reflect this reality.
9. **ALWAYS INCLUDE MEASUREMENT SETUP.** Every stage playbook MUST include at least one "type: measurement" recommendation. Choose the RIGHT measurement tool for this stage using the CX Measurement Tools knowledge above:
   - **Demo/Trial** → Post-interaction survey (CSAT/stars after every demo), CES after trial setup. Template: a 2-question email sent within 1 hour of the demo.
   - **Onboarding** → Onboarding completion tracking (milestone-based funnel), CES at Day 3 ("How easy was setup?"), CSAT at Day 7. Template: a simple 1-question in-app survey or email.
   - **Adoption** → NPS at Day 30 (first baseline), event-triggered alerts (usage decline, inactivity > 14 days). Template: a Day 30 NPS email + what to do when someone scores 0-6.
   - **Value Realization / Renewal** → Quarterly NPS, health score inputs, pre-renewal NPS at Day -60. Template: renewal risk survey email.
   - **Sales stages (Evaluation/Close)** → Post-demo CSAT, win/loss analysis process.
   - **General:** Include a ready-to-use survey question or trigger definition. Tell them exactly WHAT to send, WHEN to send it, and WHAT to do with a low score. Don't just say "measure NPS" — give them the Day 30 email template.
   Set the "measurementPlan" field for each stage: name the measurement tool + when to fire it (e.g., "NPS at Day 30 + CSAT after every support ticket").
${!input.hasExistingCustomers ? '10. **PRE-CUSTOMER CONSTRAINT (CRITICAL):** This company has NO customers yet. Every recommendation MUST be sales-focused (winning first customers). Do NOT generate any recommendations about customer onboarding, customer success, retention, renewal, or expansion. Those do not apply. The weekOneChecklist and quickWins must also be 100% sales-focused.' : ""}

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
      "measurementPlan": "Which CX measurement to set up at this stage and when (e.g., 'NPS at Day 30 via Delighted + CSAT after every support ticket via Intercom')",
      "recommendations": [
        {
          "momentName": "Which moment this addresses",
          "stageName": "Stage Name",
          "action": "Specific action to take (2-3 sentences max)",
          "type": "email" | "call" | "internal_process" | "automation" | "measurement" | "ai_agent",
          "priority": "must_do" | "should_do" | "nice_to_have",
          "owner": "Role name",
          "timing": "When to do this (specific trigger or timeframe)",
          "template": "Ready-to-use template text (email body, script, checklist). Include actual words they should use. Use [brackets] for personalization fields.",
          "expectedOutcome": "What happens when they do this right",
          "effort": "15_min" | "1_hour" | "half_day" | "multi_day",
          "measureWith": "How to know it worked (specific metric or signal)",
          "toolsUsed": ["ToolName"], // ONLY if this recommendation specifically uses a tool from their stack. Omit or use [] if no specific tool from their stack applies.
          "addressesRisk": "Pattern name from Risks Identified section" // Include ONLY if this recommendation directly addresses one of the identified risks. Use the exact pattern text.
        }
      ]
    }
  ],
  "quickWins": [
    // IMPORTANT: Pick the 3 best recommendations from your stagePlaybooks that have BOTH low effort (15_min or 1_hour) AND high priority (must_do or should_do).
    // Copy them here as COMPLETE PlaybookRecommendation objects — same full structure as above, not references or pointers.
    // These are the "start here" items — things the team can do TODAY for immediate impact.
  ],
  "weekOneChecklist": [
    "Action 1 to do this week",
    "Action 2 to do this week",
    // 5-7 items total
  ]
}

Return ONLY the JSON object, no markdown fences, no explanation.`;
}
