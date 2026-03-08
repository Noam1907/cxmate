import type { GeneratedPlaybook } from "./recommendation-prompt";
import type { GeneratedJourney } from "./journey-prompt";

// ============================================
// QBR Output Types
// ============================================

export interface QBRHealthScore {
  score: number; // 1-10
  label: "At Risk" | "Developing" | "Healthy" | "Leading";
  rationale: string;
}

export interface QBRRisk {
  risk: string;
  description: string;
  impact: "high" | "medium" | "low";
  mitigation: string;
}

export interface QBRPriority {
  initiative: string;
  rationale: string;
  owner: string;
  successMetric: string;
  timeline: string;
}

export interface QBRMeasurementCheckpoint {
  stage: string;
  metric: string;
  frequency: string;
  target: string;
}

export interface GeneratedQBR {
  companyName: string;
  quarter: string;
  generatedAt: string;
  executiveSummary: string;
  cxHealthScore: QBRHealthScore;
  keyFindings: string[];
  topRisks: QBRRisk[];
  quarterPriorities: QBRPriority[];
  measurementFramework: {
    summary: string;
    checkpoints: QBRMeasurementCheckpoint[];
  };
  askOfTheQuarter: string[];
  openItems: string[];
  closingStatement: string;
}

// ============================================
// Prompt Builder
// ============================================

export function buildQBRPrompt(
  playbook: GeneratedPlaybook,
  journey: GeneratedJourney | null,
  onboardingData: Record<string, unknown>
): string {
  const companyName = playbook.companyName || (onboardingData.companyName as string) || "Your Company";
  const now = new Date();
  const quarter = `Q${Math.ceil((now.getMonth() + 1) / 3)} ${now.getFullYear()}`;

  // Summarize journey stages with their top risks
  const stagesText = journey?.stages?.map((s) =>
    `- **${s.name}** (${s.stageType}): Risk — ${s.topFailureRisk || "not identified"}. Customer state: ${s.emotionalState || "unknown"}.`
  ).join("\n") || "Journey data not available.";

  // Critical + high severity moments
  const criticalMoments = journey?.stages
    ?.flatMap((s) =>
      (s.meaningfulMoments || [])
        .filter((m) => m.severity === "critical" || m.severity === "high")
        .map((m) => `- [${s.name}] ${m.name}: ${m.impactIfIgnored || m.description}`)
    )
    .slice(0, 6)
    .join("\n") || "No critical moments flagged.";

  // Must-do playbook actions
  const mustDoRecs = playbook.stagePlaybooks
    ?.flatMap((sp) => sp.recommendations.filter((r) => r.priority === "must_do"))
    .slice(0, 8)
    .map((r) => `- [${r.stageName}] ${r.action} | Owner: ${r.owner} | Timing: ${r.timing}`)
    .join("\n") || "No priority recommendations.";

  // Measurement plans
  const measurementPlans = playbook.stagePlaybooks
    ?.filter((sp) => sp.measurementPlan)
    .map((sp) => `- ${sp.stageName}: ${sp.measurementPlan}`)
    .join("\n") || "No measurement plans defined.";

  // Impact projections
  const impacts = journey?.impactProjections
    ?.slice(0, 4)
    .map((i) => `- ${i.area}: ${i.potentialImpact} (${i.timeToRealize})`)
    .join("\n");

  return `You are a senior CX strategist creating a Quarterly Business Review document for ${companyName}.

This is a REAL QBR — not a template with placeholder text. Write specific, substantive content using the analysis data below. Every section must feel personalized to ${companyName}'s actual situation. Reference their real challenges, real risks, and real recommendations.

## Company Context
- Company: ${companyName}
- Vertical: ${(onboardingData.vertical as string) || "B2B SaaS"}
- Size: ${(onboardingData.companySize as string) || "unknown"} employees
- Maturity stage: ${(onboardingData.companyMaturity as string) || "growing"}
- Biggest challenge: ${(onboardingData.biggestChallenge as string) || "not specified"}
- Primary goal: ${(onboardingData.primaryGoal as string) || "not specified"}
- Current tools/stack: ${(onboardingData.currentTools as string) || "not specified"}
${onboardingData.roughRevenue ? `- Revenue range: ${onboardingData.roughRevenue as string}` : ""}
${onboardingData.customerCount ? `- Customer count: ${onboardingData.customerCount as string}` : ""}

## Journey Stage Analysis
${stagesText}

## Critical & High-Risk Moments
${criticalMoments}

## Must-Do Recommendations (from playbook)
${mustDoRecs}

## Measurement Plans by Stage
${measurementPlans}
${impacts ? `\n## Projected Business Impact\n${impacts}` : ""}
${journey?.maturityAssessment ? `\n## Maturity Assessment\n${journey.maturityAssessment}` : ""}

---

## Your Task

Generate a complete, professional QBR for ${companyName} for ${quarter}. Write as if a CX leader would present this to their leadership team or key customers. Every sentence should be specific to ${companyName} — no generic filler.

Return a JSON object with this EXACT structure:

{
  "companyName": "${companyName}",
  "quarter": "${quarter}",
  "generatedAt": "${new Date().toISOString()}",
  "executiveSummary": "3-4 sentences. Open with ${companyName}'s specific CX situation, what this analysis revealed, and the strategic direction for ${quarter}. Be direct, not vague.",
  "cxHealthScore": {
    "score": <1-10 based on risk severity and stage coverage>,
    "label": "At Risk" | "Developing" | "Healthy" | "Leading",
    "rationale": "2 sentences explaining this specific score based on ${companyName}'s journey analysis."
  },
  "keyFindings": [
    "Finding 1 — reference actual stage names and specific risks identified",
    "Finding 2 — specific pattern observed",
    "Finding 3 — specific opportunity or gap",
    "Finding 4 — specific metric or benchmark insight"
  ],
  "topRisks": [
    {
      "risk": "Risk name (2-5 words)",
      "description": "1-2 sentences describing this specific risk for ${companyName}. Be concrete.",
      "impact": "high" | "medium" | "low",
      "mitigation": "Specific action from the playbook that addresses this risk"
    }
  ],
  "quarterPriorities": [
    {
      "initiative": "Initiative name — directly from the must-do recommendations above",
      "rationale": "Why this is the priority for ${companyName} specifically this quarter",
      "owner": "Role name",
      "successMetric": "Specific measurable metric (e.g., 'Day-7 activation rate above 60%', 'CSAT score above 4.2')",
      "timeline": "Specific timeline (e.g., 'Week 1-2', 'End of month 1', 'Ongoing from day 1')"
    }
  ],
  "measurementFramework": {
    "summary": "1-2 sentences on the measurement approach for ${companyName} this quarter.",
    "checkpoints": [
      {
        "stage": "Journey stage name",
        "metric": "NPS / CSAT / CES / specific metric",
        "frequency": "How often (e.g., 'Day 30', 'After every demo', 'Weekly')",
        "target": "Specific target (e.g., 'NPS > 40', 'CSAT > 4.0/5', 'CES < 3')"
      }
    ]
  },
  "askOfTheQuarter": [
    "Specific thing leadership/team must commit to for execution to succeed",
    "Specific resource or decision needed",
    "Specific stakeholder or process alignment needed"
  ],
  "openItems": [
    "Outstanding decision or blocker that needs resolution before execution starts"
  ],
  "closingStatement": "1-2 sentences. Reference ${companyName}'s specific opportunity and what a successful quarter looks like."
}

Return ONLY the JSON. No markdown code fences. No explanation before or after.`;
}

// ============================================
// Text Formatter (for NotebookLM / Claude export)
// ============================================

export function generateQBRText(qbr: GeneratedQBR): string {
  const lines: string[] = [
    `# ${qbr.quarter} CX Review — ${qbr.companyName}`,
    `Generated by CX Mate on ${new Date(qbr.generatedAt).toLocaleDateString()}`,
    "",
    "## Executive Summary",
    qbr.executiveSummary,
    "",
    `## CX Health Score: ${qbr.cxHealthScore.score}/10 — ${qbr.cxHealthScore.label}`,
    qbr.cxHealthScore.rationale,
    "",
    "## Key Findings",
    ...qbr.keyFindings.map((f) => `- ${f}`),
    "",
    "## Top Risks",
    ...qbr.topRisks.flatMap((r) => [
      `### ${r.risk} (${r.impact} impact)`,
      r.description,
      `Mitigation: ${r.mitigation}`,
      "",
    ]),
    `## ${qbr.quarter} Priorities`,
    ...qbr.quarterPriorities.flatMap((p, i) => [
      `${i + 1}. ${p.initiative}`,
      `   ${p.rationale}`,
      `   Owner: ${p.owner} | By: ${p.timeline}`,
      `   Success metric: ${p.successMetric}`,
      "",
    ]),
    "## Measurement Framework",
    qbr.measurementFramework.summary,
    ...qbr.measurementFramework.checkpoints.map(
      (c) => `- ${c.stage}: ${c.metric} | ${c.frequency} | Target: ${c.target}`
    ),
    "",
    "## Ask of the Quarter",
    ...qbr.askOfTheQuarter.map((a) => `- ${a}`),
  ];

  if (qbr.openItems?.length) {
    lines.push("", "## Open Items", ...qbr.openItems.map((o) => `- ${o}`));
  }

  lines.push("", "## Closing", qbr.closingStatement);

  return lines.join("\n");
}
