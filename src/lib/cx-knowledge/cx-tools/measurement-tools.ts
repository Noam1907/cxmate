/**
 * CX Tools Knowledge Base: Measurement Tools
 *
 * When to use NPS vs. CSAT vs. CES vs. event-based tracking vs. surveys.
 * CX Mate needs to recommend the RIGHT tool at the RIGHT moment.
 *
 * This module encodes the decision logic for CX measurement tool selection.
 */

// ============================================
// Types
// ============================================

export type MeasurementToolType =
  | "nps"
  | "csat"
  | "ces"
  | "post_interaction_survey"
  | "onboarding_tracking"
  | "event_trigger"
  | "health_score"
  | "win_loss_analysis"
  | "qbr"
  | "churn_exit_survey";

export type JourneyStage =
  | "awareness"
  | "evaluation"
  | "demo_trial"
  | "negotiation"
  | "close"
  | "onboarding"
  | "adoption"
  | "value_realization"
  | "expansion"
  | "renewal"
  | "advocacy";

export interface MeasurementTool {
  id: MeasurementToolType;
  name: string;
  fullName: string;
  description: string;
  whatItMeasures: string;
  question: string; // The core question asked
  scale: string;
  whenToUse: string[];
  whenNotToUse: string[];
  bestForStages: JourneyStage[];
  frequency: string;
  benchmarks: {
    excellent: string;
    good: string;
    needsWork: string;
    critical: string;
  };
  implementationSteps: string[];
  commonMistakes: string[];
  pairsWellWith: MeasurementToolType[];
  costToImplement: "free" | "low" | "medium" | "high";
  timeToImplement: string;
}

// ============================================
// Measurement Tools
// ============================================

export const MEASUREMENT_TOOLS: MeasurementTool[] = [
  {
    id: "nps",
    name: "NPS",
    fullName: "Net Promoter Score",
    description:
      "Measures overall customer loyalty and likelihood to recommend. A relationship metric, not a transaction metric.",
    whatItMeasures: "Overall relationship health and advocacy potential",
    question: "On a scale of 0-10, how likely are you to recommend [Product] to a colleague?",
    scale: "0-10. Promoters (9-10), Passives (7-8), Detractors (0-6). NPS = %Promoters - %Detractors.",
    whenToUse: [
      "Measuring overall relationship health quarterly",
      "Tracking sentiment trends over time",
      "Identifying advocates (Promoters) for referral programs",
      "Identifying at-risk customers (Detractors) for intervention",
      "Pre-renewal health check (60 days before renewal)",
    ],
    whenNotToUse: [
      "After a specific interaction (use CSAT instead)",
      "To measure product usability (use CES instead)",
      "More frequently than quarterly (survey fatigue)",
      "With very small customer bases (< 30 responses = unreliable)",
    ],
    bestForStages: ["adoption", "value_realization", "renewal", "advocacy"],
    frequency: "Quarterly or semi-annually. Also at Day 30 (early baseline) and Day -60 (pre-renewal).",
    benchmarks: {
      excellent: "> 50 NPS (world-class)",
      good: "30-50 NPS (strong)",
      needsWork: "0-30 NPS (room for improvement)",
      critical: "< 0 NPS (more detractors than promoters)",
    },
    implementationSteps: [
      "Choose a survey tool (Typeform, Delighted, SatisMeter, or built-in)",
      "Set up automated NPS email at Day 30, then quarterly",
      "Add a follow-up question: 'What's the main reason for your score?'",
      "Build a dashboard showing NPS trend, score distribution, and top themes",
      "Create alert rules: Detractor → immediate CS outreach within 24 hours",
    ],
    commonMistakes: [
      "Sending NPS too frequently (monthly = survey fatigue)",
      "Not following up on Detractor responses (defeats the purpose)",
      "Celebrating high NPS without investigating Passive responses",
      "Only measuring NPS and ignoring transactional metrics (CSAT, CES)",
    ],
    pairsWellWith: ["csat", "health_score", "churn_exit_survey"],
    costToImplement: "low",
    timeToImplement: "1-2 days with a survey tool",
  },
  {
    id: "csat",
    name: "CSAT",
    fullName: "Customer Satisfaction Score",
    description:
      "Measures satisfaction with a specific interaction or touchpoint. A transactional metric that tells you how a specific moment went.",
    whatItMeasures: "Quality of a specific interaction, feature, or touchpoint",
    question: "How satisfied were you with [specific interaction]?",
    scale: "1-5 stars or 1-5 scale. CSAT = (4s + 5s) / total responses.",
    whenToUse: [
      "After a support ticket is resolved",
      "After onboarding milestone completion",
      "After a training session or QBR",
      "After a demo or trial experience",
      "After any significant touchpoint you want to optimize",
    ],
    whenNotToUse: [
      "As a standalone relationship metric (use NPS for that)",
      "When you want to measure effort, not satisfaction (use CES)",
      "After every single interaction (pick the moments that matter)",
    ],
    bestForStages: ["demo_trial", "onboarding", "adoption"],
    frequency: "After specific events/touchpoints. Not time-based — trigger-based.",
    benchmarks: {
      excellent: "> 90% CSAT",
      good: "80-90% CSAT",
      needsWork: "70-80% CSAT",
      critical: "< 70% CSAT",
    },
    implementationSteps: [
      "Identify 3-5 key touchpoints worth measuring (support, onboarding, QBR, demo)",
      "Set up post-interaction automated surveys (1-2 questions max)",
      "Track CSAT by touchpoint, not as one aggregate number",
      "Alert when CSAT drops below 80% for any touchpoint",
      "Review low-score responses weekly and categorize by theme",
    ],
    commonMistakes: [
      "Measuring CSAT as one aggregate number instead of per-touchpoint",
      "Long surveys (> 3 questions) that lower response rates",
      "Not acting on the data (collecting scores but never improving)",
      "Confusing CSAT with NPS — they measure different things",
    ],
    pairsWellWith: ["nps", "ces", "post_interaction_survey"],
    costToImplement: "free",
    timeToImplement: "1 day per touchpoint",
  },
  {
    id: "ces",
    name: "CES",
    fullName: "Customer Effort Score",
    description:
      "Measures how easy it was for the customer to accomplish something. Low effort = high loyalty. The best predictor of future behavior.",
    whatItMeasures: "Friction in the customer experience. How hard was it to do what they needed to do?",
    question: "How easy was it to [specific action]? (1 = Very Difficult, 7 = Very Easy)",
    scale: "1-7. CES = average score. > 5 = low effort (good). < 4 = high effort (problem).",
    whenToUse: [
      "After self-serve actions (signup, setup, configuration)",
      "After onboarding completion",
      "After a complex workflow or process",
      "After support resolution (how easy was it to get help?)",
      "When optimizing UX and reducing friction",
    ],
    whenNotToUse: [
      "As a relationship metric (use NPS)",
      "When measuring emotional satisfaction (use CSAT)",
      "For simple, routine actions (not worth measuring)",
    ],
    bestForStages: ["onboarding", "adoption", "demo_trial"],
    frequency: "After specific self-serve actions and complex processes.",
    benchmarks: {
      excellent: "> 6.0 CES",
      good: "5.0-6.0 CES",
      needsWork: "4.0-5.0 CES",
      critical: "< 4.0 CES",
    },
    implementationSteps: [
      "Identify friction points: where do customers get stuck? (support tickets, drop-off points, time-to-complete)",
      "Add CES survey after key self-serve actions: setup, first use, integration, advanced feature",
      "Track CES over time per action. Look for declining trends (feature getting harder) or improving trends (UX working)",
      "Correlate CES with retention: which low-CES actions predict churn?",
    ],
    commonMistakes: [
      "Only measuring CES once instead of tracking trends",
      "Not connecting CES to specific product areas (need per-action tracking)",
      "Ignoring CES and focusing only on satisfaction (ease > satisfaction for predicting loyalty)",
    ],
    pairsWellWith: ["csat", "onboarding_tracking", "event_trigger"],
    costToImplement: "free",
    timeToImplement: "1-2 days",
  },
  {
    id: "onboarding_tracking",
    name: "Onboarding Funnel",
    fullName: "Onboarding Completion Tracking",
    description:
      "Tracks each step of the onboarding process to identify where customers get stuck, drop off, or succeed. A funnel, not a score.",
    whatItMeasures: "Step-by-step progress through onboarding. Where customers succeed and where they fall off.",
    question: "N/A — this is behavioral tracking, not a survey.",
    scale: "% completion per step. Overall completion rate. Time per step.",
    whenToUse: [
      "For every new customer from Day 0",
      "To identify which onboarding steps cause the most friction",
      "To trigger proactive outreach when a customer stalls",
      "To compare onboarding effectiveness across cohorts",
    ],
    whenNotToUse: [
      "As a replacement for satisfaction measurement (pair with CES)",
      "When onboarding is a single step (only useful with multi-step processes)",
    ],
    bestForStages: ["onboarding"],
    frequency: "Continuous from Day 0. Review cohort data monthly.",
    benchmarks: {
      excellent: "> 80% complete all steps within expected timeframe",
      good: "60-80% completion",
      needsWork: "40-60% completion",
      critical: "< 40% completion",
    },
    implementationSteps: [
      "Define 4-7 onboarding milestones that represent meaningful progress (not just 'clicked through tutorial')",
      "Instrument tracking: when does each user complete each step?",
      "Build a dashboard: completion rate per step, drop-off points, time per step, cohort comparison",
      "Set up alerts: if user hasn't completed Step X within Y days, trigger outreach",
      "A/B test onboarding variations to improve completion",
    ],
    commonMistakes: [
      "Tracking too many micro-steps (focus on meaningful milestones)",
      "Not acting on drop-off data (tracking without intervening)",
      "Defining completion as 'tutorial viewed' instead of 'outcome achieved'",
    ],
    pairsWellWith: ["ces", "event_trigger"],
    costToImplement: "medium",
    timeToImplement: "1-2 weeks",
  },
  {
    id: "event_trigger",
    name: "Event-Based Triggers",
    fullName: "Behavioral Event Triggers & Alerts",
    description:
      "Automated detection of customer behavior signals that indicate risk, opportunity, or need for intervention. The 'nervous system' of proactive CX.",
    whatItMeasures: "Behavioral patterns: usage decline, feature milestones, inactivity, expansion signals.",
    question: "N/A — automated behavioral detection.",
    scale: "Binary: trigger fired / not fired. Severity: info / warning / critical.",
    whenToUse: [
      "To detect usage decline before the customer complains",
      "To identify expansion opportunities (usage growing, limits approaching)",
      "To catch inactivity before it becomes churn",
      "To celebrate positive milestones automatically",
      "To trigger proactive CS outreach based on data, not calendar",
    ],
    whenNotToUse: [
      "As a replacement for human judgment (triggers flag, humans decide)",
      "When you don't have usage data yet (need a minimum data foundation)",
    ],
    bestForStages: ["adoption", "value_realization", "expansion", "renewal"],
    frequency: "Continuous (real-time or daily processing).",
    benchmarks: {
      excellent: "Triggers catch 80%+ of churn cases 60+ days in advance",
      good: "Triggers catch 60-80% of cases 30+ days in advance",
      needsWork: "Triggers catch < 60% or with < 30 days notice",
      critical: "No event triggers in place (fully reactive)",
    },
    implementationSteps: [
      "Define 5-8 key trigger events: usage decline 30%+, no login 14 days, champion contact changed, plan limit hit, first integration connected, NPS detractor",
      "Set severity levels: which triggers need immediate action vs. monitoring",
      "Route alerts: CS manager gets critical alerts, automated emails handle info-level triggers",
      "Build response playbooks: for each trigger, what's the recommended action?",
      "Track trigger accuracy: how many alerts led to actual intervention? False positive rate?",
    ],
    commonMistakes: [
      "Too many triggers = alert fatigue (start with 5-8, not 50)",
      "No response playbook (trigger fires but nobody knows what to do)",
      "Setting thresholds too sensitively (too many false positives erode trust)",
      "Not iterating on thresholds based on outcomes (triggers should improve over time)",
    ],
    pairsWellWith: ["health_score", "onboarding_tracking", "nps"],
    costToImplement: "medium",
    timeToImplement: "2-4 weeks",
  },
  {
    id: "health_score",
    name: "Health Score",
    fullName: "Customer Health Score (Composite)",
    description:
      "A composite score that combines multiple signals into a single risk/health indicator. The 'vital signs' for each customer account.",
    whatItMeasures: "Overall account health: likelihood of renewal, expansion potential, churn risk.",
    question: "N/A — calculated from multiple data sources.",
    scale: "0-100. Green (80-100), Yellow (50-79), Red (0-49).",
    whenToUse: [
      "As the primary view for CS team account management",
      "For pre-renewal risk assessment",
      "For board/leadership reporting on customer base health",
      "For resource allocation: which accounts need the most attention?",
    ],
    whenNotToUse: [
      "As a replacement for direct customer communication (it's an indicator, not truth)",
      "Before you have enough data to make it meaningful (need 3-6 months of data minimum)",
    ],
    bestForStages: ["adoption", "value_realization", "expansion", "renewal"],
    frequency: "Updated weekly or in real-time. Reviewed in team meetings.",
    benchmarks: {
      excellent: "> 70% of accounts in Green",
      good: "50-70% in Green, < 10% in Red",
      needsWork: "< 50% in Green",
      critical: "> 20% in Red",
    },
    implementationSteps: [
      "Choose 4-6 health inputs: usage frequency (25%), feature depth (20%), support sentiment (20%), NPS (15%), engagement (10%), contact depth (10%)",
      "Define thresholds for each input: Green/Yellow/Red",
      "Calculate weighted composite score",
      "Build dashboard with account list sorted by health",
      "Set alerts: any account dropping to Red triggers immediate outreach",
      "Review and calibrate weights quarterly based on actual churn correlation",
    ],
    commonMistakes: [
      "Over-weighting usage (it's important but not everything)",
      "Not calibrating against actual churn data",
      "Making the score too complex (more than 6 inputs reduces clarity)",
      "Not taking action on Red accounts (a health score without intervention is just a dashboard)",
    ],
    pairsWellWith: ["event_trigger", "nps", "csat"],
    costToImplement: "high",
    timeToImplement: "1-2 months",
  },
  {
    id: "win_loss_analysis",
    name: "Win/Loss Analysis",
    fullName: "Post-Decision Win/Loss Analysis",
    description:
      "Structured interviews with prospects who chose you (wins) and chose a competitor (losses). The most honest feedback you'll ever get about your sales and product.",
    whatItMeasures: "Why buyers choose you or don't. Real competitive intelligence from the buyer's perspective.",
    question: "Why did you ultimately choose [winner]? What were the key factors in your decision?",
    scale: "Qualitative themes + frequency analysis.",
    whenToUse: [
      "After every deal > $10K (won or lost)",
      "When win rates are declining and you need to understand why",
      "When entering a new market or launching a new product",
      "Quarterly batch analysis to identify trends",
    ],
    whenNotToUse: [
      "For small/self-serve deals (too resource-intensive)",
      "When you're not prepared to act on the findings",
    ],
    bestForStages: ["negotiation", "close"],
    frequency: "After every significant deal. Batch analysis quarterly.",
    benchmarks: {
      excellent: "Clear, actionable themes from 20+ interviews per quarter",
      good: "10-20 interviews per quarter with emerging themes",
      needsWork: "< 10 interviews per quarter (insufficient data)",
      critical: "No win/loss analysis being conducted",
    },
    implementationSteps: [
      "Wait 5-10 days after decision (emotions settle but memory is fresh)",
      "Use a neutral interviewer (not the salesperson who worked the deal)",
      "Ask: What problem were you solving? Who else did you consider? What were the top 3 factors in your decision? What almost changed your mind?",
      "Categorize findings: themes that appear in 3+ interviews = actionable patterns",
      "Share findings monthly with sales, product, and marketing teams",
    ],
    commonMistakes: [
      "Having the salesperson conduct the interview (biased and uncomfortable)",
      "Only analyzing losses (wins tell you what's working — protect it)",
      "Not sharing findings cross-functionally (insights trapped in one team)",
      "Conducting interviews too long after the decision (memory fades)",
    ],
    pairsWellWith: ["post_interaction_survey"],
    costToImplement: "low",
    timeToImplement: "1 week to set up process",
  },
  {
    id: "qbr",
    name: "QBR",
    fullName: "Quarterly Business Review",
    description:
      "Structured quarterly meeting with the customer to review value delivered, align on goals, and plan the next quarter. The backbone of strategic account management.",
    whatItMeasures: "Relationship depth, value alignment, expansion readiness, risk level.",
    question: "How did we do this quarter? What should we focus on next?",
    scale: "Qualitative assessment + outcome metrics. Track QBR sentiment over time.",
    whenToUse: [
      "For all accounts above a value threshold (e.g., ACV > $5K/year)",
      "At months 3, 6, 9, 12 — or quarterly after that",
      "When a customer is approaching renewal (mandatory QBR at month -3)",
      "When customer health is declining (accelerated QBR)",
    ],
    whenNotToUse: [
      "For self-serve / low-touch accounts (use automated value reports instead)",
      "When the customer explicitly doesn't want them (offer alternatives)",
    ],
    bestForStages: ["adoption", "value_realization", "expansion", "renewal"],
    frequency: "Quarterly for strategic accounts. Semi-annually for mid-tier.",
    benchmarks: {
      excellent: "100% of strategic accounts receive QBRs. Outcomes tracked.",
      good: "80%+ QBR coverage. Most have follow-up actions.",
      needsWork: "< 80% coverage or QBRs happening without structure.",
      critical: "No QBR process in place.",
    },
    implementationSteps: [
      "Define which accounts qualify for QBRs (by ACV, strategic importance, or health)",
      "Create a QBR template: achievements (with data), challenges, recommendations, next quarter goals",
      "Schedule all QBRs at the beginning of each quarter (don't let them slip)",
      "Send QBR summary within 24 hours with clear action items and owners",
      "Track QBR outcomes: did the recommended actions get implemented?",
    ],
    commonMistakes: [
      "Making QBRs a product update instead of a business impact conversation",
      "Not preparing usage/outcome data before the meeting",
      "Running QBRs without the executive sponsor present",
      "No follow-up on action items from the previous QBR",
    ],
    pairsWellWith: ["nps", "health_score"],
    costToImplement: "low",
    timeToImplement: "1 week to build template and process",
  },
  {
    id: "churn_exit_survey",
    name: "Churn Exit Survey",
    fullName: "Customer Churn Exit Survey / Interview",
    description:
      "Structured feedback from customers who are leaving. The most painful but most honest data source. If you can get it.",
    whatItMeasures: "Why customers leave. The real reasons, not the excuses.",
    question: "What was the primary reason for your decision to leave? What could we have done differently?",
    scale: "Categorical (reason codes) + qualitative (open text). Track reason distribution over time.",
    whenToUse: [
      "For every churning customer above a value threshold",
      "When churn rate is increasing and causes are unclear",
      "To validate whether your churn prevention efforts are working",
    ],
    whenNotToUse: [
      "As the only feedback mechanism (it's too late to save these customers)",
      "When you're not prepared to act on the data (collecting without action is worse than not collecting)",
    ],
    bestForStages: ["renewal"],
    frequency: "At every churn event. Batch analysis monthly.",
    benchmarks: {
      excellent: "Response rate > 40%. Clear theme patterns.",
      good: "Response rate 20-40%.",
      needsWork: "Response rate < 20%.",
      critical: "No exit survey process.",
    },
    implementationSteps: [
      "Create a short (3-5 question) exit survey: primary reason (multiple choice), what could we have done differently (open text), would you consider returning (yes/no/maybe)",
      "Send within 24 hours of cancellation notice",
      "For high-value accounts, request a 15-minute exit call instead",
      "Categorize reasons monthly: product (features), service (support), value (ROI), competitive (switched), business (budget/closure)",
      "Share churn themes monthly with product, CS, and leadership teams",
    ],
    commonMistakes: [
      "Making the survey too long (keep it under 3 minutes)",
      "Not offering a human conversation option for high-value accounts",
      "Treating exit feedback as criticism instead of learning opportunity",
      "Not closing the loop: if you fix the issue, tell former customers",
    ],
    pairsWellWith: ["health_score", "nps"],
    costToImplement: "free",
    timeToImplement: "1-2 days",
  },
  {
    id: "post_interaction_survey",
    name: "Post-Interaction Survey",
    fullName: "Post-Demo / Post-Call Micro-Survey",
    description:
      "Ultra-short (1-2 question) survey sent immediately after a key interaction: demo, support call, training session. Captures in-the-moment feedback.",
    whatItMeasures: "Quality and effectiveness of a specific interaction.",
    question: "How would you rate your experience with [specific interaction]? + One open-text follow-up.",
    scale: "1-5 stars or thumbs up/down + optional comment.",
    whenToUse: [
      "After sales demos",
      "After support calls or ticket resolution",
      "After training sessions",
      "After QBRs or strategic meetings",
    ],
    whenNotToUse: [
      "After every trivial interaction (only meaningful touchpoints)",
      "When you're already surveying the customer (avoid survey fatigue)",
    ],
    bestForStages: ["demo_trial", "onboarding", "adoption"],
    frequency: "Event-triggered. Limit to 1-2 surveys per customer per month.",
    benchmarks: {
      excellent: "> 4.5/5 average with > 50% response rate",
      good: "4.0-4.5/5 average",
      needsWork: "3.5-4.0/5 average",
      critical: "< 3.5/5 average",
    },
    implementationSteps: [
      "Identify 2-3 key interactions worth measuring",
      "Create a 2-question survey: rating + 'anything we should improve?'",
      "Automate survey sending within 1 hour of the interaction",
      "Alert on low scores for immediate follow-up",
      "Review trends weekly by interaction type",
    ],
    commonMistakes: [
      "Surveys longer than 2 questions (response rate drops dramatically)",
      "Sending too many surveys (max 1-2 per customer per month)",
      "Not acting on low scores immediately",
    ],
    pairsWellWith: ["csat", "ces"],
    costToImplement: "free",
    timeToImplement: "1 day",
  },
];

// ============================================
// Tool Selection Logic
// ============================================

export interface ToolRecommendation {
  tool: MeasurementToolType;
  reason: string;
  priority: "primary" | "secondary" | "optional";
}

/**
 * Given a journey stage, recommend which CX tools to deploy
 */
export function getToolsForStage(stage: JourneyStage): ToolRecommendation[] {
  const recommendations: Record<JourneyStage, ToolRecommendation[]> = {
    awareness: [
      { tool: "event_trigger", reason: "Track website engagement and content consumption", priority: "primary" },
    ],
    evaluation: [
      { tool: "post_interaction_survey", reason: "Measure demo effectiveness", priority: "primary" },
      { tool: "win_loss_analysis", reason: "Understand why prospects choose you or don't", priority: "secondary" },
    ],
    demo_trial: [
      { tool: "ces", reason: "Measure trial ease-of-use", priority: "primary" },
      { tool: "post_interaction_survey", reason: "Capture post-demo feedback", priority: "primary" },
      { tool: "onboarding_tracking", reason: "Track trial activation steps", priority: "secondary" },
    ],
    negotiation: [
      { tool: "win_loss_analysis", reason: "Track deal outcome patterns", priority: "secondary" },
    ],
    close: [
      { tool: "csat", reason: "Measure handoff experience quality", priority: "primary" },
    ],
    onboarding: [
      { tool: "onboarding_tracking", reason: "Track step-by-step completion", priority: "primary" },
      { tool: "ces", reason: "Measure onboarding friction", priority: "primary" },
      { tool: "csat", reason: "Day 7 satisfaction check", priority: "secondary" },
    ],
    adoption: [
      { tool: "event_trigger", reason: "Detect usage decline and milestones", priority: "primary" },
      { tool: "nps", reason: "Day 30 baseline relationship score", priority: "primary" },
      { tool: "health_score", reason: "Composite health monitoring", priority: "secondary" },
    ],
    value_realization: [
      { tool: "nps", reason: "Quarterly relationship health check", priority: "primary" },
      { tool: "qbr", reason: "Structured value review", priority: "primary" },
      { tool: "health_score", reason: "Continuous monitoring", priority: "secondary" },
    ],
    expansion: [
      { tool: "event_trigger", reason: "Detect expansion signals", priority: "primary" },
      { tool: "qbr", reason: "Strategic growth planning", priority: "primary" },
    ],
    renewal: [
      { tool: "nps", reason: "Pre-renewal health check at day -60", priority: "primary" },
      { tool: "health_score", reason: "At-risk account identification", priority: "primary" },
      { tool: "churn_exit_survey", reason: "Learn from churning customers", priority: "secondary" },
    ],
    advocacy: [
      { tool: "nps", reason: "Identify promoters for referral programs", priority: "primary" },
      { tool: "event_trigger", reason: "Detect advocacy moments", priority: "secondary" },
    ],
  };

  return recommendations[stage] || [];
}

/**
 * Get a specific measurement tool by ID
 */
export function getMeasurementTool(id: MeasurementToolType): MeasurementTool | undefined {
  return MEASUREMENT_TOOLS.find((t) => t.id === id);
}

/**
 * Get all tools sorted by implementation cost (easiest first)
 */
export function getToolsByEase(): MeasurementTool[] {
  const order = { free: 0, low: 1, medium: 2, high: 3 };
  return [...MEASUREMENT_TOOLS].sort(
    (a, b) => order[a.costToImplement] - order[b.costToImplement]
  );
}
