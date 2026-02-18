/**
 * CX Theory Engine: Failure Patterns (Anti-Patterns)
 *
 * Common CX mistakes that B2B companies make, organized by journey stage.
 * These power the "confrontation" moment: "Here's what companies like you
 * typically get wrong."
 *
 * Each pattern includes:
 * - What goes wrong and why
 * - How to detect it
 * - What to do instead
 * - The business impact of not fixing it
 * - Which CX tool helps prevent it
 */

// ============================================
// Types
// ============================================

export type JourneyPhase = "sales" | "handoff" | "onboarding" | "adoption" | "retention" | "expansion";
export type Severity = "high" | "critical";
export type CompanyStage = "early" | "growing" | "established";

export interface FailurePattern {
  id: string;
  name: string;
  phase: JourneyPhase;
  severity: Severity;
  applicableStages: CompanyStage[]; // Which company maturity stages this applies to
  description: string;
  whyItHappens: string;
  howToDetect: string[];
  businessImpact: string;
  impactEstimate: string; // Quantified impact range
  fix: {
    immediate: string; // What to do right now
    shortTerm: string; // What to build in 1-4 weeks
    longTerm: string; // What to invest in for 1-3 months
  };
  preventionTool: string; // Which CX measurement tool prevents this
  relatedPatterns: string[]; // IDs of related failure patterns
}

// ============================================
// Sales Phase Failures
// ============================================

const SALES_FAILURES: FailurePattern[] = [
  {
    id: "early-price-reveal",
    name: "Premature Price Reveal",
    phase: "sales",
    severity: "critical",
    applicableStages: ["early", "growing"],
    description:
      "Introducing pricing before value is established. The prospect evaluates cost before understanding what they're paying for.",
    whyItHappens:
      "Founders and early sales teams want to be 'transparent.' Prospects ask for pricing early and the team complies. The pricing page is publicly accessible without context.",
    howToDetect: [
      "Price objections appearing before the demo/trial stage",
      "Prospects visiting pricing page but not booking demos",
      "High pricing page traffic but low conversion",
      "Sales conversations dominated by cost comparisons",
    ],
    businessImpact:
      "Prospects anchor on price instead of value. Win rates drop 30-50% when pricing enters the conversation before value demonstration.",
    impactEstimate: "30-50% lower win rate on affected deals",
    fix: {
      immediate: "Train sales team to redirect pricing questions to value conversations: 'Let me show you what this solves first, then we'll make sure the pricing makes sense for your situation.'",
      shortTerm: "Create a value-first demo flow that reaches the 'aha moment' before any pricing discussion. Add a value calculator the prospect can use.",
      longTerm: "Implement a gated pricing model where pricing is personalized after a value assessment. Build ROI case studies by vertical.",
    },
    preventionTool: "Post-demo survey: 'How clear is the value of our solution?' (CES scale) + track stage at which pricing is first discussed per deal",
    relatedPatterns: ["generic-demo", "feature-selling"],
  },
  {
    id: "generic-demo",
    name: "The Generic Demo",
    phase: "sales",
    severity: "high",
    applicableStages: ["early", "growing", "established"],
    description:
      "Showing every feature instead of solving the prospect's specific problem. The demo is about the product, not about the customer.",
    whyItHappens:
      "Product pride. The team is excited about what they built and wants to show everything. No pre-demo discovery process. Same demo deck for every prospect.",
    howToDetect: [
      "High demo volume but low close rate",
      "Prospects say 'interesting' but don't take next steps",
      "No discovery call before the demo",
      "Demo longer than 30 minutes",
      "Demo covers features the prospect didn't ask about",
    ],
    businessImpact:
      "Prospects leave thinking 'cool product' instead of 'I need this.' Demo-to-close conversion drops.",
    impactEstimate: "20-40% lower demo-to-close conversion",
    fix: {
      immediate: "Add a 15-minute discovery call before every demo. Ask: 'What's the one thing you need this to solve?'",
      shortTerm: "Create 3-5 demo tracks by use case. First 10 minutes address their specific pain point. Rest is optional exploration.",
      longTerm: "Build interactive demos where the prospect uses their own data. Implement personalized demo environments.",
    },
    preventionTool: "Post-demo 2-question survey: 'Did we address your specific challenge?' + 'What's your next step?'",
    relatedPatterns: ["early-price-reveal", "champion-neglect"],
  },
  {
    id: "feature-selling",
    name: "Selling Features Instead of Outcomes",
    phase: "sales",
    severity: "high",
    applicableStages: ["early", "growing"],
    description:
      "The sales pitch focuses on what the product does rather than what the customer achieves. Features don't close deals; outcomes do.",
    whyItHappens:
      "Technical founders lead sales. Marketing materials are feature-focused. No customer outcome data to reference. Easier to talk about what you built than what it achieves.",
    howToDetect: [
      "Website copy leads with features, not outcomes",
      "Sales decks have feature comparison tables as the main selling tool",
      "Prospects ask 'but what does this actually do for me?'",
      "Competitor comparison is feature-to-feature, not outcome-to-outcome",
    ],
    businessImpact:
      "Prospects can't articulate your value internally. The champion can't sell to their boss. Deals stall or lose to competitors with better value narratives.",
    impactEstimate: "20-35% longer sales cycles, 15-25% lower win rates",
    fix: {
      immediate: "Rewrite the first slide of every deck to start with: 'Companies like [similar customer] achieve [specific outcome] in [timeframe].'",
      shortTerm: "Build 3 customer outcome case studies. Create an ROI calculator. Train sales team on value-based selling.",
      longTerm: "Implement outcome-based pricing or tiers. Build in-product ROI tracking so customers can see their own outcomes.",
    },
    preventionTool: "Win/loss analysis: ask lost deals 'why did you choose the alternative?' — track frequency of 'better value story' as a reason",
    relatedPatterns: ["early-price-reveal", "generic-demo"],
  },
  {
    id: "champion-neglect",
    name: "Neglecting the Internal Champion",
    phase: "sales",
    severity: "critical",
    applicableStages: ["growing", "established"],
    description:
      "The champion needs to sell your product internally, but you leave them alone to do it. They don't have the tools, data, or support to convince their colleagues.",
    whyItHappens:
      "Sales team assumes the champion is 'bought in' and can handle internal selling. No champion enablement materials exist. Sales doesn't ask who else is involved in the decision.",
    howToDetect: [
      "Deals stalling after a good demo",
      "Champion says 'I need to check with my team/boss'",
      "Request for additional materials or presentations",
      "New stakeholders appearing late in the sales process",
      "Deal velocity slowing after initial enthusiasm",
    ],
    businessImpact:
      "Deals stall in 'evaluation' for weeks. Champions burn out. Competitors with better enablement win the internal battle.",
    impactEstimate: "40-60% of stalled deals are champion enablement failures",
    fix: {
      immediate: "Ask every champion: 'Who else needs to be involved, and what do they care about?' Offer to join stakeholder calls.",
      shortTerm: "Create a champion kit: one-pager, ROI calculator, stakeholder-specific FAQs, internal proposal template.",
      longTerm: "Build a 'deal room' — a shared space where the champion can bring stakeholders to see your value proposition on their terms.",
    },
    preventionTool: "Track deal velocity by stage. Alert when a deal has been in 'evaluation' for > 2x the average duration.",
    relatedPatterns: ["generic-demo", "feature-selling"],
  },
];

// ============================================
// Handoff Phase Failures
// ============================================

const HANDOFF_FAILURES: FailurePattern[] = [
  {
    id: "cold-handoff",
    name: "The Cold Handoff",
    phase: "handoff",
    severity: "critical",
    applicableStages: ["growing", "established"],
    description:
      "The transition from sales to customer success is abrupt, impersonal, and loses context. The customer goes from being courted to being a ticket number.",
    whyItHappens:
      "Sales and CS use different systems. No formal handoff process. Sales incentivized on close, not on customer success. CS team is under-resourced.",
    howToDetect: [
      "Customer repeats their story to the CS team",
      "CS team doesn't know why the customer bought",
      "First CS touch is an automated email, not a personal outreach",
      "Customer expresses frustration about 'starting over'",
      "Gap of 3+ days between contract signing and first CS contact",
    ],
    businessImpact:
      "Trust built during sales evaporates. Customer starts the relationship disappointed. Sets a negative trajectory for the entire lifecycle.",
    impactEstimate: "Customers with poor handoffs churn 2-3x more in first year",
    fix: {
      immediate: "Same-day introduction: sales sends a warm email introducing CS contact with context about why the customer bought and what they need.",
      shortTerm: "Create a structured handoff document template: goals, stakeholders, concerns, timeline, competitive alternatives considered.",
      longTerm: "Implement a shared CRM view where CS can see the complete sales history. Automate handoff triggers on deal-close events.",
    },
    preventionTool: "CSAT survey at day 7: 'How was your transition from our sales team to your success manager?' + track time from close to first CS contact",
    relatedPatterns: ["silent-onboarding", "reactive-support"],
  },
];

// ============================================
// Onboarding Phase Failures
// ============================================

const ONBOARDING_FAILURES: FailurePattern[] = [
  {
    id: "silent-onboarding",
    name: "The Silent Onboarding",
    phase: "onboarding",
    severity: "critical",
    applicableStages: ["early", "growing"],
    description:
      "Customer signs up and is left alone. No welcome sequence, no guided setup, no proactive check-in. They're expected to figure it out themselves.",
    whyItHappens:
      "No CS team yet (early stage). 'Self-serve' is confused with 'no touch.' Team focused on acquiring new customers, not activating existing ones. No onboarding automation built.",
    howToDetect: [
      "No automated welcome email or onboarding sequence",
      "Time to first value > 7 days",
      "High signup-to-inactive ratio in first 14 days",
      "First customer touchpoint is a support ticket (reactive)",
    ],
    businessImpact:
      "30-50% of new customers never reach first value. Early churn becomes the norm, not the exception.",
    impactEstimate: "30-50% of new signups lost in first 30 days",
    fix: {
      immediate: "Set up a 5-email onboarding sequence: Day 0 (welcome + first step), Day 1 (tutorial), Day 3 (check-in), Day 7 (milestone), Day 14 (value check).",
      shortTerm: "Define the 'first value action' for your product. Design onboarding to reach it within 48 hours. Add in-app guided tours.",
      longTerm: "Implement onboarding analytics: track each step's completion rate. A/B test onboarding flows. Add personal CS outreach for high-value accounts.",
    },
    preventionTool: "Onboarding funnel tracking (step completion rates) + CES survey at Day 7: 'How easy was it to get started?'",
    relatedPatterns: ["cold-handoff", "feature-dump"],
  },
  {
    id: "feature-dump",
    name: "The Feature Dump Onboarding",
    phase: "onboarding",
    severity: "high",
    applicableStages: ["early", "growing", "established"],
    description:
      "Onboarding tries to show everything the product can do. Customer is overwhelmed with options and can't figure out where to start.",
    whyItHappens:
      "Product team proud of all features. No clear 'first value action' defined. Onboarding designed by engineers who know the product, not by users who don't.",
    howToDetect: [
      "Onboarding walkthrough covers 10+ features",
      "Customers complete onboarding but don't return",
      "Support tickets asking 'where do I start?'",
      "Low feature adoption despite comprehensive onboarding",
    ],
    businessImpact:
      "Paradox of choice: when everything is important, nothing is. Customers don't form the one habit that makes the product sticky.",
    impactEstimate: "25-40% lower activation when onboarding covers > 5 features",
    fix: {
      immediate: "Identify the ONE action that most predicts retention. Design onboarding to reach it.",
      shortTerm: "Create progressive onboarding: Day 1 = one thing. Week 1 = three things. Month 1 = full exploration. Don't front-load.",
      longTerm: "Implement persona-based onboarding paths. Different roles see different first steps based on what's most relevant to them.",
    },
    preventionTool: "Track 'activation rate' — % of users who complete the key first action within 7 days",
    relatedPatterns: ["silent-onboarding"],
  },
];

// ============================================
// Adoption Phase Failures
// ============================================

const ADOPTION_FAILURES: FailurePattern[] = [
  {
    id: "reactive-support",
    name: "The Reactive Support Trap",
    phase: "adoption",
    severity: "high",
    applicableStages: ["early", "growing"],
    description:
      "The only touchpoint with customers is when they have problems. No proactive outreach, no value reinforcement, no check-ins. Every interaction starts with frustration.",
    whyItHappens:
      "Small team, no dedicated CS. Support is the only customer-facing function. No usage monitoring or health scoring in place.",
    howToDetect: [
      "All customer communication originates from support tickets",
      "No scheduled check-ins or QBRs",
      "No usage monitoring or proactive alerts",
      "Customers only reach out when something is broken",
    ],
    businessImpact:
      "By the time a customer complains, they've already started looking for alternatives. You only hear from the vocal minority; the silent majority just leaves.",
    impactEstimate: "For every customer who complains, 26 stay silent and churn (1:26 ratio)",
    fix: {
      immediate: "Schedule a monthly 15-minute check-in with your top 20% of customers. Ask: 'How are things going? Anything we can help with?'",
      shortTerm: "Set up basic usage monitoring. Alert when a customer's usage drops 30%+ week over week. Send automated check-in emails.",
      longTerm: "Implement a health score combining usage, support tickets, NPS, and engagement signals. Build automated intervention workflows.",
    },
    preventionTool: "Health score + automated usage decline alerts + quarterly NPS survey",
    relatedPatterns: ["silent-onboarding", "champion-single-point"],
  },
  {
    id: "champion-single-point",
    name: "Champion Single Point of Failure",
    phase: "adoption",
    severity: "critical",
    applicableStages: ["growing", "established"],
    description:
      "The entire customer relationship depends on one person. When they leave, get promoted, or lose interest, the account collapses.",
    whyItHappens:
      "Natural tendency to build relationships with one person. Easier than multi-threading. The champion handles everything and the CS team lets them.",
    howToDetect: [
      "Only 1 active user per account",
      "All communications go through one person",
      "No executive sponsor relationship",
      "When champion is on vacation, engagement drops to zero",
    ],
    businessImpact:
      "When the champion leaves: 60-80% probability of churn within 6 months. No internal advocate to justify the product.",
    impactEstimate: "60-80% churn risk when sole champion departs",
    fix: {
      immediate: "For every account, identify at least 3 contacts: champion, executive sponsor, and daily user. Build relationships with all three.",
      shortTerm: "Track 'contact depth' in CRM. Alert when accounts have fewer than 3 active contacts. Run team training sessions to multi-thread.",
      longTerm: "Build a champion change playbook: when key contacts change, trigger immediate outreach and re-onboarding sequence.",
    },
    preventionTool: "Contact depth tracking + champion departure alerts (LinkedIn monitoring or CRM contact changes)",
    relatedPatterns: ["reactive-support"],
  },
];

// ============================================
// Retention Phase Failures
// ============================================

const RETENTION_FAILURES: FailurePattern[] = [
  {
    id: "renewal-surprise",
    name: "The Renewal Surprise",
    phase: "retention",
    severity: "critical",
    applicableStages: ["growing", "established"],
    description:
      "Nobody tracks renewal dates or customer health before the renewal window. The first renewal conversation reveals problems that have been building for months.",
    whyItHappens:
      "No renewal pipeline or tracking. CS team overwhelmed with reactive work. No health scoring to flag at-risk accounts early. Renewal is treated as an event, not a process.",
    howToDetect: [
      "First renewal outreach happens at day -30 or later",
      "Surprise churn: customers leave without warning",
      "No customer health data available at renewal time",
      "Renewal conversations surface months-old unresolved issues",
    ],
    businessImpact:
      "Preventable churn. By the time you learn there's a problem at renewal, the customer has already decided to leave.",
    impactEstimate: "80% of churn at renewal was predictable 90+ days in advance",
    fix: {
      immediate: "Create a renewal calendar. For every customer, set an alert at day -90, -60, and -30.",
      shortTerm: "Implement a basic health score. At day -90, review health for all upcoming renewals. Flag at-risk accounts for intervention.",
      longTerm: "Build a continuous health monitoring system that alerts in real-time, not just at renewal. The renewal process should start at onboarding.",
    },
    preventionTool: "Health score (continuous) + NPS at day -60 + automated renewal pipeline tracking",
    relatedPatterns: ["reactive-support", "champion-single-point"],
  },
  {
    id: "no-roi-story",
    name: "No ROI Story at Renewal",
    phase: "retention",
    severity: "high",
    applicableStages: ["growing", "established"],
    description:
      "At renewal time, neither you nor the customer can articulate the specific value the product has delivered. The conversation becomes about cost, not value.",
    whyItHappens:
      "No ROI tracking built into the product. QBRs aren't happening or don't include impact data. Value was assumed, not measured.",
    howToDetect: [
      "Customer says 'it's useful but I'm not sure of the ROI'",
      "Renewal conversations focus on price negotiation",
      "No quantified outcomes to share with customer's leadership",
      "Customer asking for discounts despite good usage",
    ],
    businessImpact:
      "Products positioned as 'nice to have' are the first to be cut in budget reviews. Without ROI data, the product is always at risk.",
    impactEstimate: "Customers who can articulate ROI renew at 6x the rate of those who can't",
    fix: {
      immediate: "Before the next renewal, compile 3 specific outcomes the customer achieved. Share proactively.",
      shortTerm: "Build a basic ROI template per vertical. Track key outcomes quarterly. Include in QBR presentations.",
      longTerm: "Build in-product ROI tracking: show customers their own impact metrics automatically. Create 'value delivered' reports.",
    },
    preventionTool: "Quarterly Business Review with ROI section + pre-renewal value summary email",
    relatedPatterns: ["renewal-surprise"],
  },
];

// ============================================
// Expansion Phase Failures
// ============================================

const EXPANSION_FAILURES: FailurePattern[] = [
  {
    id: "ignored-expansion-signals",
    name: "Ignoring Expansion Signals",
    phase: "expansion",
    severity: "high",
    applicableStages: ["growing", "established"],
    description:
      "Customers are showing clear signs they need more (hitting limits, asking about features, adding users) but nobody is proactively offering the upgrade.",
    whyItHappens:
      "No expansion signal monitoring. CS team focused on retention, not growth. No upsell playbook. Fear of being 'too salesy.'",
    howToDetect: [
      "Customers hitting plan limits without being offered an upgrade",
      "Feature requests for higher-tier capabilities",
      "Customer added 50%+ more users but is on the same plan",
      "API usage growing but no expansion conversation happening",
    ],
    businessImpact:
      "Missed revenue. Customers become frustrated by limitations instead of feeling guided to the right plan. They may look for alternatives instead of upgrading.",
    impactEstimate: "20-40% of expansion revenue left on the table without proactive signals",
    fix: {
      immediate: "Review your top 20 accounts. Are any hitting plan limits or showing expansion signals? Reach out with a personalized upgrade offer.",
      shortTerm: "Set up automated alerts for expansion signals: usage thresholds, seat count growth, API limits, feature gate hits.",
      longTerm: "Build an expansion playbook: trigger → outreach → demo of next tier → trial of premium features → upgrade path.",
    },
    preventionTool: "Usage threshold alerts + expansion signal dashboard + proactive account review cadence",
    relatedPatterns: ["reactive-support", "no-roi-story"],
  },
];

// ============================================
// Combined Export
// ============================================

export const ALL_FAILURE_PATTERNS: FailurePattern[] = [
  ...SALES_FAILURES,
  ...HANDOFF_FAILURES,
  ...ONBOARDING_FAILURES,
  ...ADOPTION_FAILURES,
  ...RETENTION_FAILURES,
  ...EXPANSION_FAILURES,
];

// ============================================
// Helper Functions
// ============================================

export function getFailurePatternsByPhase(phase: JourneyPhase): FailurePattern[] {
  return ALL_FAILURE_PATTERNS.filter((p) => p.phase === phase);
}

export function getFailurePatternsByStage(stage: CompanyStage): FailurePattern[] {
  return ALL_FAILURE_PATTERNS.filter((p) => p.applicableStages.includes(stage));
}

export function getCriticalPatterns(): FailurePattern[] {
  return ALL_FAILURE_PATTERNS.filter((p) => p.severity === "critical");
}

export function getFailurePattern(id: string): FailurePattern | undefined {
  return ALL_FAILURE_PATTERNS.find((p) => p.id === id);
}
