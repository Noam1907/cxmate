/**
 * CX Theory Engine: Success Patterns
 *
 * Evidence-based CX interventions that work. These are the positive counterparts
 * to failure-patterns.ts — what to do right, when, and why it works.
 *
 * Each pattern includes:
 * - What the intervention is and when to deploy it
 * - The evidence/science behind why it works
 * - Concrete implementation steps
 * - How to measure effectiveness
 * - Templates and examples
 */

// ============================================
// Types
// ============================================

export type InterventionPhase = "sales" | "handoff" | "onboarding" | "adoption" | "retention" | "expansion" | "advocacy";
export type EffortLevel = "low" | "medium" | "high";
export type ImpactLevel = "medium" | "high" | "very_high";
export type CompanyStage = "early" | "growing" | "established";

export interface SuccessPattern {
  id: string;
  name: string;
  phase: InterventionPhase;
  applicableStages: CompanyStage[];
  description: string;
  whyItWorks: string; // The science/evidence behind this
  implementation: {
    step1: string;
    step2: string;
    step3: string;
  };
  effort: EffortLevel;
  impact: ImpactLevel;
  timeToResult: string;
  measureWith: string; // CX tool to measure effectiveness
  successMetric: string;
  template?: string; // Optional ready-to-use template
}

// ============================================
// Sales Success Patterns
// ============================================

const SALES_PATTERNS: SuccessPattern[] = [
  {
    id: "value-first-demo",
    name: "Value-First Demo Design",
    phase: "sales",
    applicableStages: ["early", "growing", "established"],
    description:
      "Structure every demo to solve the prospect's specific problem within the first 10 minutes. Feature tour comes after, not before, the 'aha moment.'",
    whyItWorks:
      "Peak-end rule (Kahneman): people judge an experience based on its most intense point and its end. If the peak is their problem being solved, the demo is memorable. If the peak is a feature list, it's forgettable.",
    implementation: {
      step1: "Pre-demo discovery: 'What's the one thing you need this to solve?' Identify their #1 pain point.",
      step2: "Design demo opening around their specific pain point. Show it being solved with their context (their data, their scenario) within 10 minutes.",
      step3: "After the 'aha moment,' ask: 'Is this what you were looking for?' Then explore additional features based on their interest.",
    },
    effort: "low",
    impact: "very_high",
    timeToResult: "Immediate (next demo)",
    measureWith: "Post-demo 2-question survey + demo-to-next-step conversion rate",
    successMetric: "Demo-to-close conversion rate increase of 20-40%",
    template: "Pre-demo email: 'Before our call, I'd love to understand: (1) What's the #1 problem you're hoping we can solve? (2) What have you tried so far? This helps me show you exactly what's relevant to your situation.'",
  },
  {
    id: "champion-enablement",
    name: "Champion Enablement Kit",
    phase: "sales",
    applicableStages: ["growing", "established"],
    description:
      "Equip your internal champion with everything they need to sell on your behalf: one-pager, ROI calculator, stakeholder-specific talking points, and internal proposal template.",
    whyItWorks:
      "B2B purchase decisions involve an average of 6-10 stakeholders (Gartner). The champion is the most important one, but they're selling a product they don't work for. They need tools.",
    implementation: {
      step1: "Create a one-pager that answers: What is it? Why now? What's the impact? How much does it cost? (Each answer < 2 sentences.)",
      step2: "Build an ROI calculator the champion can fill in with their own numbers. Output: 'Investing $X returns $Y in Z months.'",
      step3: "Create stakeholder-specific FAQs: 'What the CFO wants to know,' 'What IT needs to verify,' 'What end users care about.'",
    },
    effort: "medium",
    impact: "very_high",
    timeToResult: "2-4 weeks to build, immediate impact on next deals",
    measureWith: "Deal velocity: days from demo to close. Track improvement after kit is deployed.",
    successMetric: "20-30% reduction in average sales cycle length",
    template: "One-pager structure: [Problem] → [Solution] → [Outcome for their company] → [Social proof: similar company result] → [Next step] — all on one page, under 200 words.",
  },
  {
    id: "outcome-based-selling",
    name: "Outcome-Based Value Narrative",
    phase: "sales",
    applicableStages: ["early", "growing"],
    description:
      "Replace 'our product does X, Y, Z' with 'companies like you achieve A, B, C.' Sell the outcome, not the feature.",
    whyItWorks:
      "Prospects don't buy features; they buy the future state the features enable. Outcome framing activates loss aversion: 'what are you losing by not doing this?' is more powerful than 'look what you could gain.'",
    implementation: {
      step1: "Collect 3 customer outcome stories with specific numbers: '35% faster onboarding,' '$200K saved in first year,' '50% fewer support tickets.'",
      step2: "Rewrite all sales materials to lead with outcomes. Every feature mention should be preceded by the outcome it enables.",
      step3: "Train sales team: for every feature mentioned, state the customer outcome first. 'Companies use [feature] to achieve [outcome].'",
    },
    effort: "medium",
    impact: "high",
    timeToResult: "2-4 weeks to build narrative, ongoing refinement",
    measureWith: "Win/loss analysis: track whether 'clear value narrative' appears as a win reason",
    successMetric: "Win rate improvement of 15-25%",
  },
];

// ============================================
// Handoff Success Patterns
// ============================================

const HANDOFF_PATTERNS: SuccessPattern[] = [
  {
    id: "warm-handoff",
    name: "The Warm Handoff Protocol",
    phase: "handoff",
    applicableStages: ["growing", "established"],
    description:
      "A structured, personal transition from sales to customer success that preserves context, builds trust, and sets expectations for the next phase.",
    whyItWorks:
      "Trust transfer theory: trust built with one person doesn't automatically transfer to another. The warm introduction from a trusted person (sales rep) to a new person (CS manager) creates a 'trust bridge.'",
    implementation: {
      step1: "Sales rep sends introduction email: 'Meet [CS name], who will be your success partner. I've shared everything we discussed about your goals for [specific goal].'",
      step2: "CS manager sends follow-up within 2 hours: 'Great to connect! [Sales rep] told me about [specific goal]. Here's your onboarding plan: [3 milestones with dates].'",
      step3: "Schedule a 30-minute kickoff call within 48 hours of contract signing. Sales rep attends first 5 minutes for warm intro, then hands off.",
    },
    effort: "low",
    impact: "very_high",
    timeToResult: "Immediate",
    measureWith: "Day 7 CSAT: 'How was your transition from our sales team to your success manager?'",
    successMetric: "CSAT > 4.5/5 on handoff experience. 30-day churn reduction of 20-30%.",
    template: "Handoff email: 'Hi [Customer], I'd like to introduce you to [CS Name], your dedicated success manager. I've shared: (1) Your primary goal: [goal], (2) Your timeline: [timeframe], (3) Key contacts: [names]. [CS Name] will be reaching out shortly with your onboarding plan. You're in great hands!'",
  },
];

// ============================================
// Onboarding Success Patterns
// ============================================

const ONBOARDING_PATTERNS: SuccessPattern[] = [
  {
    id: "first-value-48h",
    name: "First Value in 48 Hours",
    phase: "onboarding",
    applicableStages: ["early", "growing", "established"],
    description:
      "Design the onboarding experience so the customer achieves one meaningful result within 48 hours of signing up. Not a tutorial completion — an actual outcome.",
    whyItWorks:
      "Totango research: customers who reach first value within 7 days have 3x higher 12-month retention. Within 48 hours is even better — it confirms the purchase decision before buyer's remorse sets in.",
    implementation: {
      step1: "Define the 'first value action' for your product. What is the simplest meaningful outcome? (e.g., first report generated, first workflow automated, first insight received.)",
      step2: "Strip everything else from initial onboarding. Day 1 should ONLY be about reaching that one action. All other features wait.",
      step3: "Send a 'first win' celebration when they hit the milestone: 'You just [achieved X]! Here's what this means for your [goal].'",
    },
    effort: "medium",
    impact: "very_high",
    timeToResult: "2-4 weeks to redesign onboarding, immediate impact on new cohorts",
    measureWith: "Time to first value (T2FV) metric + Day 14 retention rate by activation status",
    successMetric: "80%+ of customers reach first value within 48 hours. 14-day retention > 90% for activated users.",
    template: "Day 0 email: 'Welcome to [Product]! Your first goal: [specific action] by tomorrow. Here's how (3 steps): 1. [Step] 2. [Step] 3. [Step]. It takes about [time]. Let us know if you need help!'",
  },
  {
    id: "proactive-day-7",
    name: "The Proactive Day 7 Check-In",
    phase: "onboarding",
    applicableStages: ["early", "growing", "established"],
    description:
      "Personal outreach at Day 7 to every customer, asking how things are going and offering help. Not automated — a real person reaching out.",
    whyItWorks:
      "Day 7 is the 'habit formation window.' By day 7, the customer has either started forming a usage habit or they haven't. A proactive check-in catches the non-adopters before they become churners.",
    implementation: {
      step1: "On Day 7, check usage data: Did they complete onboarding? Are they using the product? How often?",
      step2: "For active users: 'Great to see you're up and running! How's [specific feature] working for you? Anything else you need?'",
      step3: "For inactive users: 'I noticed you haven't had a chance to [key action] yet. Can I help? I'd love to do a quick 15-minute walkthrough.'",
    },
    effort: "low",
    impact: "high",
    timeToResult: "Immediate",
    measureWith: "Response rate to check-in + 30-day retention rate for contacted vs. non-contacted customers",
    successMetric: "20-30% improvement in 30-day retention for at-risk customers who receive the check-in",
    template: "Day 7 check-in (active): 'Hi [Name], it's been a week since you started with [Product]. I see you've already [specific action they took] — great progress! Quick question: is there anything you're trying to do that you haven't figured out yet? Happy to do a quick call if it'd help.'",
  },
];

// ============================================
// Adoption Success Patterns
// ============================================

const ADOPTION_PATTERNS: SuccessPattern[] = [
  {
    id: "usage-milestone-celebrations",
    name: "Usage Milestone Celebrations",
    phase: "adoption",
    applicableStages: ["early", "growing", "established"],
    description:
      "Acknowledge and celebrate customer milestones: first report, 100th action, team milestone, integration connected. Small moments of recognition reinforce the behavior you want.",
    whyItWorks:
      "Variable ratio reinforcement (behavioral psychology): unexpected positive reinforcement is the strongest driver of habit formation. When good behavior (usage) is rewarded unpredictably, it strengthens the habit.",
    implementation: {
      step1: "Define 5-7 milestone events that indicate healthy usage progression: first action, first week streak, first team member invited, first integration, first report shared.",
      step2: "Create automated congratulations messages for each milestone. Keep them specific and tie them to the customer's goal.",
      step3: "For high-value milestones (100th action, 6-month anniversary), have the CS manager send a personal note.",
    },
    effort: "low",
    impact: "medium",
    timeToResult: "1-2 weeks to implement",
    measureWith: "Feature adoption rate before/after milestone celebrations + NPS",
    successMetric: "10-15% improvement in feature adoption breadth",
    template: "Milestone email: 'Your team just completed their 100th [action] in [Product]! That means you've [specific outcome these actions drive]. Here's what teams like yours do next: [next feature suggestion].'",
  },
  {
    id: "qbr-with-roi",
    name: "Quarterly Business Review with ROI",
    phase: "adoption",
    applicableStages: ["growing", "established"],
    description:
      "Structured quarterly meeting that reviews: what was achieved, what the impact was (in numbers), what's next. Not a feature update — a business impact conversation.",
    whyItWorks:
      "The QBR creates a regular 'value reinforcement' moment. Research by Bain shows customers who can articulate ROI renew at 6x the rate. The QBR is where you build the ROI narrative together.",
    implementation: {
      step1: "Prepare: usage data, key outcomes achieved, comparison to their goals, 2-3 next recommendations.",
      step2: "Structure: 5 min check-in → 10 min 'what you achieved this quarter' (with numbers) → 10 min 'what we recommend next' → 5 min open questions.",
      step3: "Follow up with written summary the customer can share internally. Include: outcomes achieved, ROI to date, next quarter plan.",
    },
    effort: "medium",
    impact: "very_high",
    timeToResult: "First QBR cycle (3 months)",
    measureWith: "Renewal rate for QBR'd accounts vs. non-QBR'd. NPS difference. Expansion rate difference.",
    successMetric: "QBR'd accounts renew 20-30% more than non-QBR'd accounts",
  },
];

// ============================================
// Retention Success Patterns
// ============================================

const RETENTION_PATTERNS: SuccessPattern[] = [
  {
    id: "health-score-system",
    name: "Customer Health Score",
    phase: "retention",
    applicableStages: ["growing", "established"],
    description:
      "A composite score combining usage, engagement, support, and sentiment signals that predicts churn risk. Enables proactive intervention before problems become crises.",
    whyItWorks:
      "Leading vs. lagging indicators. Churn is a lagging indicator — by the time you see it, it's too late. Usage decline, support sentiment, and engagement drops are leading indicators that predict churn 60-90 days in advance.",
    implementation: {
      step1: "Define 4-6 health signals: login frequency (weight: 25%), feature adoption (20%), support ticket sentiment (20%), NPS score (15%), engagement with emails/QBRs (10%), contact depth (10%).",
      step2: "Score each signal: Green (healthy), Yellow (warning), Red (critical). Combine into overall score: 80-100 = Healthy, 50-79 = At Risk, 0-49 = Critical.",
      step3: "Set up automated alerts: when any account drops to Yellow, notify CS. When any account drops to Red, trigger immediate intervention playbook.",
    },
    effort: "high",
    impact: "very_high",
    timeToResult: "1-2 months to build, 1-2 quarters to prove impact",
    measureWith: "Predictive accuracy: what % of Red accounts actually churned? What % of saves were successful?",
    successMetric: "Identify 80%+ of at-risk accounts 60 days before churn. Save 30-50% of flagged accounts.",
  },
  {
    id: "pre-renewal-value-summary",
    name: "Pre-Renewal Value Summary",
    phase: "retention",
    applicableStages: ["growing", "established"],
    description:
      "60 days before renewal, send a personalized 'value delivered' report showing specific outcomes the customer achieved. Reframe the renewal as a continuation of success, not a cost decision.",
    whyItWorks:
      "Anchoring effect: the first number in a negotiation sets the anchor. If the first thing the customer sees at renewal is value delivered ($X saved, Y hours recovered), the price is contextualized against value, not against budget.",
    implementation: {
      step1: "At day -60, generate a value report: key metrics (usage, outcomes, milestones), comparison to their stated goals, ROI calculation.",
      step2: "Send as a personalized email from the CS manager: 'Your year with [Product]: here's what you achieved.'",
      step3: "Follow up with a renewal call that starts with the value story, not with pricing or contract terms.",
    },
    effort: "medium",
    impact: "very_high",
    timeToResult: "Next renewal cycle",
    measureWith: "Renewal rate for value-summarized accounts vs. non-summarized. Discount request frequency comparison.",
    successMetric: "15-25% improvement in renewal rate. 30-40% reduction in discount requests.",
    template: "Value summary email: 'Hi [Name], as your renewal approaches, I wanted to share what your team achieved this year with [Product]: [Metric 1: specific number]. [Metric 2: specific number]. [Metric 3: specific number]. This represents an estimated [ROI calculation] return on your investment. I'd love to discuss how we can build on this next year.'",
  },
];

// ============================================
// Advocacy Success Patterns
// ============================================

const ADVOCACY_PATTERNS: SuccessPattern[] = [
  {
    id: "moment-of-delight-capture",
    name: "Capture the Moment of Delight",
    phase: "advocacy",
    applicableStages: ["growing", "established"],
    description:
      "When a customer expresses genuine satisfaction (NPS 9-10, positive feedback, praise), ask for a referral, testimonial, or case study within 48 hours. The window for advocacy is small.",
    whyItWorks:
      "Peak emotion fades quickly. The willingness to advocate is highest at the moment of peak satisfaction. Waiting a week to ask drops the conversion rate by 60%+ (HubSpot research on referral timing).",
    implementation: {
      step1: "Set up alerts for delight signals: NPS 9-10, positive support feedback, positive meeting notes, public praise (social media, reviews).",
      step2: "Within 48 hours, reach out: 'We loved hearing that [specific positive thing they said]. Would you be open to [specific ask: 2-sentence testimonial, 15-min case study call, referral introduction]?'",
      step3: "Make it easy: pre-write the testimonial for them to approve. Offer to handle the case study writing. Provide a referral email template they can forward.",
    },
    effort: "low",
    impact: "high",
    timeToResult: "Immediate",
    measureWith: "Referral conversion rate within 48 hours vs. after 48 hours. Testimonial collection rate.",
    successMetric: "3-5x higher advocacy conversion when asked within 48 hours of delight signal",
    template: "Referral ask: 'Hi [Name], thanks for the kind words about [Product]! Quick question: do you know anyone facing a similar challenge who might benefit from what you've experienced? If so, I'd love an introduction — and of course, I'd take great care of them.'",
  },
];

// ============================================
// Combined Export
// ============================================

export const ALL_SUCCESS_PATTERNS: SuccessPattern[] = [
  ...SALES_PATTERNS,
  ...HANDOFF_PATTERNS,
  ...ONBOARDING_PATTERNS,
  ...ADOPTION_PATTERNS,
  ...RETENTION_PATTERNS,
  ...ADVOCACY_PATTERNS,
];

// ============================================
// Helper Functions
// ============================================

export function getSuccessPatternsByPhase(phase: InterventionPhase): SuccessPattern[] {
  return ALL_SUCCESS_PATTERNS.filter((p) => p.phase === phase);
}

export function getSuccessPatternsByStage(stage: CompanyStage): SuccessPattern[] {
  return ALL_SUCCESS_PATTERNS.filter((p) => p.applicableStages.includes(stage));
}

export function getQuickWins(): SuccessPattern[] {
  return ALL_SUCCESS_PATTERNS.filter((p) => p.effort === "low" && (p.impact === "high" || p.impact === "very_high"));
}

export function getHighImpactPatterns(): SuccessPattern[] {
  return ALL_SUCCESS_PATTERNS.filter((p) => p.impact === "very_high");
}

export function getSuccessPattern(id: string): SuccessPattern | undefined {
  return ALL_SUCCESS_PATTERNS.find((p) => p.id === id);
}
