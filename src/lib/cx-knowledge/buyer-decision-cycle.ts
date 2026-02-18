/**
 * CX Theory Engine: Buyer Decision Cycle
 *
 * This module encodes the decision science behind how B2B buyers make purchasing
 * decisions. It maps what psychological factors dominate at each stage and what
 * CX interventions are most effective.
 *
 * Key insight: Different currencies matter at different stages.
 * Early = Attention. Middle = Trust. Late = Risk reduction. Post = Validation.
 *
 * Used by the AI to:
 * - Diagnose misaligned sales/CX strategies (e.g., pricing too early)
 * - Recommend stage-appropriate interventions
 * - Power the "confrontation" moment in onboarding
 */

// ============================================
// Types
// ============================================

export type DecisionStage =
  | "trigger"
  | "research"
  | "evaluation"
  | "consideration"
  | "negotiation"
  | "decision"
  | "post_purchase";

export interface DecisionStageProfile {
  stage: DecisionStage;
  name: string;
  buyerMindset: string;
  dominantCurrency: string; // What matters most to the buyer at this stage
  buyerQuestions: string[]; // What the buyer is asking themselves
  effectiveInterventions: string[]; // What works at this stage
  commonMistakes: string[]; // What companies get wrong
  priceRelevance: "none" | "low" | "emerging" | "high" | "dominant";
  trustRelevance: "low" | "medium" | "high" | "critical";
  emotionalDrivers: string[];
  typicalDuration: {
    smb: string;
    midMarket: string;
    enterprise: string;
  };
}

export interface DecisionDiagnosis {
  symptom: string;
  likelyStage: DecisionStage;
  diagnosis: string;
  rootCause: string;
  recommendedAction: string;
  actionTemplate?: string;
  measurementTool: string;
}

// ============================================
// Buyer Decision Cycle Stages
// ============================================

export const DECISION_CYCLE: DecisionStageProfile[] = [
  {
    stage: "trigger",
    name: "Trigger / Problem Recognition",
    buyerMindset:
      "Something happened that made the status quo unacceptable. A pain point became urgent enough to act on.",
    dominantCurrency: "Attention",
    buyerQuestions: [
      "Do I actually have a problem worth solving?",
      "How urgent is this really?",
      "What happens if I do nothing?",
    ],
    effectiveInterventions: [
      "Content that validates the problem (not your solution)",
      "Industry reports showing the cost of inaction",
      "Peer stories: 'I was in your position and here's what happened'",
      "Problem-first messaging, not product-first",
    ],
    commonMistakes: [
      "Jumping straight to product features before the buyer acknowledges the problem",
      "Pushing demos before the buyer is ready to evaluate solutions",
      "Talking about pricing or ROI when the buyer hasn't committed to solving the problem yet",
    ],
    priceRelevance: "none",
    trustRelevance: "low",
    emotionalDrivers: ["frustration", "curiosity", "fear of falling behind"],
    typicalDuration: {
      smb: "1-2 weeks",
      midMarket: "2-4 weeks",
      enterprise: "1-3 months",
    },
  },
  {
    stage: "research",
    name: "Research / Information Gathering",
    buyerMindset:
      "The buyer has committed to finding a solution and is actively learning about options. They're building a mental model of the category.",
    dominantCurrency: "Credibility",
    buyerQuestions: [
      "What solutions exist for this problem?",
      "Who are the main players?",
      "What do people like me use?",
      "What should I be looking for in a solution?",
    ],
    effectiveInterventions: [
      "Educational content (guides, comparisons, frameworks)",
      "Transparent comparison pages (honest about trade-offs)",
      "Social proof from similar companies (case studies, G2 reviews)",
      "SEO-optimized content that answers their search queries",
    ],
    commonMistakes: [
      "Gating all content behind forms (creates friction at the wrong moment)",
      "Only talking about yourself instead of educating about the category",
      "Ignoring competitor comparisons (the buyer is making them anyway)",
      "Aggressive outbound at this stage (they're not ready for a sales call)",
    ],
    priceRelevance: "low",
    trustRelevance: "medium",
    emotionalDrivers: ["overwhelm", "analytical curiosity", "hope"],
    typicalDuration: {
      smb: "1-2 weeks",
      midMarket: "2-6 weeks",
      enterprise: "1-3 months",
    },
  },
  {
    stage: "evaluation",
    name: "Evaluation / Shortlisting",
    buyerMindset:
      "The buyer has a shortlist and is actively comparing 2-4 options. They're looking for reasons to include or exclude.",
    dominantCurrency: "Differentiation",
    buyerQuestions: [
      "Which solution fits my specific needs best?",
      "What makes each option different?",
      "What do existing customers say?",
      "Can I see it work for my use case?",
    ],
    effectiveInterventions: [
      "Personalized demos showing their specific use case",
      "Free trials with guided onboarding to the 'aha' moment",
      "Customer references in their industry/size",
      "Clear differentiation messaging (why you, not why you're good)",
    ],
    commonMistakes: [
      "Generic demos that don't address the buyer's specific problem",
      "Not providing references or social proof from similar companies",
      "Introducing pricing pressure before value is established",
      "Ignoring the buying committee (only selling to the champion)",
    ],
    priceRelevance: "emerging",
    trustRelevance: "high",
    emotionalDrivers: ["analytical pressure", "FOMO", "excitement about possibilities"],
    typicalDuration: {
      smb: "1-2 weeks",
      midMarket: "2-4 weeks",
      enterprise: "1-2 months",
    },
  },
  {
    stage: "consideration",
    name: "Deep Consideration / Internal Alignment",
    buyerMindset:
      "The buyer has a preferred option but needs to build internal consensus. The champion is now selling internally.",
    dominantCurrency: "Risk Reduction",
    buyerQuestions: [
      "Can I convince my team/boss this is the right choice?",
      "What's the implementation risk?",
      "What if it doesn't work?",
      "How does this fit with what we already have?",
    ],
    effectiveInterventions: [
      "Internal champion enablement materials (one-pagers, ROI calculators)",
      "Multi-stakeholder demos (technical, financial, end-user)",
      "Implementation plan with clear milestones",
      "Risk reversal: money-back guarantees, phased rollouts, pilot programs",
    ],
    commonMistakes: [
      "Leaving the champion alone to sell internally (they need tools)",
      "Not engaging other stakeholders (finance, IT, end users)",
      "Pushing for close before internal alignment is done",
      "Not addressing implementation concerns proactively",
    ],
    priceRelevance: "high",
    trustRelevance: "critical",
    emotionalDrivers: ["anxiety about making the wrong choice", "desire for consensus", "career risk"],
    typicalDuration: {
      smb: "3-7 days",
      midMarket: "2-4 weeks",
      enterprise: "1-3 months",
    },
  },
  {
    stage: "negotiation",
    name: "Negotiation / Terms",
    buyerMindset:
      "The buyer has decided they want your solution. Now they're optimizing terms, price, and risk.",
    dominantCurrency: "Value Justification",
    buyerQuestions: [
      "Can we get a better deal?",
      "What's the total cost of ownership?",
      "What are the contract terms and exit clauses?",
      "Can we start smaller and expand?",
    ],
    effectiveInterventions: [
      "Value reframing (cost of inaction vs. cost of solution)",
      "Flexible pricing structures (annual vs. monthly, tiered, usage-based)",
      "Clear ROI projections with realistic assumptions",
      "Pilot/proof-of-concept options to reduce perceived risk",
    ],
    commonMistakes: [
      "Discounting too quickly (undermines perceived value)",
      "Not having pricing flexibility prepared in advance",
      "Making the negotiation adversarial instead of collaborative",
      "Failing to tie pricing to outcomes the buyer cares about",
    ],
    priceRelevance: "dominant",
    trustRelevance: "high",
    emotionalDrivers: ["desire for fairness", "budget anxiety", "pressure to close"],
    typicalDuration: {
      smb: "1-3 days",
      midMarket: "1-3 weeks",
      enterprise: "2-8 weeks",
    },
  },
  {
    stage: "decision",
    name: "Final Decision / Commit",
    buyerMindset:
      "The buyer is about to commit. Last-minute doubts and final sign-offs. This is the highest-stakes moment for buyer's remorse.",
    dominantCurrency: "Confidence",
    buyerQuestions: [
      "Am I making the right choice?",
      "What if something goes wrong?",
      "Is there something I'm missing?",
      "What happens on day one?",
    ],
    effectiveInterventions: [
      "Clear post-purchase plan (what happens after they sign)",
      "Direct access to their future CS contact before signing",
      "Final customer reference call with a similar company",
      "Eliminate last-minute friction (easy contract, simple signing)",
    ],
    commonMistakes: [
      "Adding surprise terms or fees at the last minute",
      "Being unavailable or slow to respond during the critical window",
      "Not painting a clear picture of what day 1 looks like",
      "Celebrating the close without ensuring a smooth handoff",
    ],
    priceRelevance: "high",
    trustRelevance: "critical",
    emotionalDrivers: ["anticipation", "anxiety", "commitment fear", "excitement"],
    typicalDuration: {
      smb: "1-2 days",
      midMarket: "3-7 days",
      enterprise: "1-4 weeks",
    },
  },
  {
    stage: "post_purchase",
    name: "Post-Purchase / Validation",
    buyerMindset:
      "The buyer just committed. They need immediate validation that they made the right choice. Buyer's remorse is a real risk in the first 48 hours.",
    dominantCurrency: "Reassurance",
    buyerQuestions: [
      "Did I make the right decision?",
      "Is the onboarding going to be painful?",
      "Will this actually work as promised?",
      "How do I explain this purchase to my team?",
    ],
    effectiveInterventions: [
      "Immediate welcome and clear next steps (within 1 hour of signing)",
      "Warm handoff from sales to CS (personal introduction, not automated email)",
      "Quick win in the first 24-48 hours (even if it's small)",
      "Validation content: 'here's what companies like you achieved in their first month'",
    ],
    commonMistakes: [
      "Going silent after the deal closes (no communication for days)",
      "Cold handoff: automated email from unknown CS person",
      "Overwhelming the new customer with too much too fast",
      "Not sharing sales context with the CS team (customer has to repeat themselves)",
    ],
    priceRelevance: "low",
    trustRelevance: "critical",
    emotionalDrivers: ["vulnerability", "hope", "need for validation", "impatience"],
    typicalDuration: {
      smb: "1-7 days",
      midMarket: "1-2 weeks",
      enterprise: "2-4 weeks",
    },
  },
];

// ============================================
// Common Diagnosis Patterns
// ============================================

export const DECISION_DIAGNOSES: DecisionDiagnosis[] = [
  {
    symptom: "Losing deals on price",
    likelyStage: "evaluation",
    diagnosis:
      "If price objections come up during evaluation (before deep consideration), value hasn't been established. This is a timing problem, not a pricing problem.",
    rootCause:
      "Pricing was introduced before the buyer understood the full value. The buyer is comparing price-to-price instead of value-to-price.",
    recommendedAction:
      "Restructure the sales flow to delay pricing until after the 'aha moment' in demo/trial. Lead with outcomes, not features or cost.",
    actionTemplate:
      "Before sharing pricing, send: 'Here's what [similar company] achieved in 90 days: [specific outcome]. Let's discuss how this maps to your situation before we talk numbers.'",
    measurementTool: "Post-demo CES survey + track time between demo and pricing request",
  },
  {
    symptom: "Deals stalling in evaluation",
    likelyStage: "consideration",
    diagnosis:
      "The champion is stuck selling internally. They don't have the tools or support to get other stakeholders on board.",
    rootCause:
      "The selling effort depends on a single champion who can't articulate your value to finance, IT, or leadership.",
    recommendedAction:
      "Create champion enablement kit: one-pager, ROI calculator, stakeholder-specific pitch decks. Offer to join calls with other decision makers.",
    actionTemplate:
      "Share this with your champion: 'I put together a quick summary you can share with [stakeholder]. It focuses on [their concern]. Want me to join a call with them?'",
    measurementTool: "Deal velocity tracking: days from demo to close by deal size",
  },
  {
    symptom: "High demo-to-close drop-off",
    likelyStage: "evaluation",
    diagnosis:
      "The demo isn't reaching the 'aha moment' or isn't personalized to the buyer's specific problem.",
    rootCause:
      "Generic demo flow that shows features instead of solving the buyer's specific problem. The buyer leaves thinking 'cool product' but not 'I need this.'",
    recommendedAction:
      "Redesign the demo to reach the buyer's specific 'aha moment' within the first 10 minutes. Use their data or scenario whenever possible.",
    actionTemplate:
      "Pre-demo discovery call template: 'What would success look like for you in 90 days? What's the #1 thing you need this to solve?'",
    measurementTool: "Post-demo survey (2 questions): clarity of value + next step intent",
  },
  {
    symptom: "Long sales cycles getting longer",
    likelyStage: "consideration",
    diagnosis:
      "Multiple stakeholders are slowing down the process. The buying committee has grown but the sales approach hasn't adapted.",
    rootCause:
      "More people in the buying decision = more questions, more concerns, more alignment needed. Each stakeholder has different priorities.",
    recommendedAction:
      "Map the buying committee early. Create stakeholder-specific materials. Run a multi-stakeholder demo. Address security, compliance, and integration concerns proactively.",
    measurementTool: "Track number of stakeholders involved per deal + deal velocity correlation",
  },
  {
    symptom: "Customers churning within 90 days",
    likelyStage: "post_purchase",
    diagnosis:
      "The post-purchase experience is failing. The transition from sales promise to customer reality has a gap.",
    rootCause:
      "Sales oversold or misaligned expectations. Onboarding isn't reaching first value fast enough. The handoff from sales to CS lost context.",
    recommendedAction:
      "Fix the handoff: share full sales context with CS. Set up a 'first 48 hours' automated welcome sequence. Design onboarding to reach first value within 7 days.",
    actionTemplate:
      "Day 1 email: 'Welcome! Here's your onboarding plan. Your CS contact is [name]. Your first milestone: [specific action] by [date].'",
    measurementTool: "Time to first value + 14-day and 30-day CSAT",
  },
  {
    symptom: "Low conversion from free trial",
    likelyStage: "evaluation",
    diagnosis:
      "The trial experience isn't guided enough. Users sign up, look around, and leave without experiencing the core value.",
    rootCause:
      "Self-serve trial without onboarding guidance leads to exploration without direction. The user doesn't know what 'success' looks like in the product.",
    recommendedAction:
      "Add guided trial onboarding: day 1 email with 3 steps to first value, day 3 check-in, day 7 feature highlight. Show progress toward 'aha moment.'",
    actionTemplate:
      "Trial day 1 email: 'Welcome! Most teams see results by doing these 3 things first: 1. [action], 2. [action], 3. [action]. Let us know if you need help.'",
    measurementTool: "Trial activation rate (% completing key actions) + trial-to-paid conversion",
  },
  {
    symptom: "Prospects ghosting after proposal",
    likelyStage: "negotiation",
    diagnosis:
      "The proposal created sticker shock or the buyer hit internal budget resistance. The silence is avoidance, not disinterest.",
    rootCause:
      "Price was presented without sufficient value anchoring. The buyer can't justify the cost internally. Or the proposal was too complex to process.",
    recommendedAction:
      "Send a brief, value-first follow-up that reframes cost as investment. Offer a phased approach or pilot to reduce the initial commitment.",
    actionTemplate:
      "Follow-up: 'I know pricing decisions take time. A quick thought: companies like yours typically see [outcome] within [timeframe], which represents [X]x return. Would it help to start with a smaller pilot?'",
    measurementTool: "Proposal-to-response time + win rate by proposal format",
  },
  {
    symptom: "Winning deals but customers aren't engaged post-sale",
    likelyStage: "post_purchase",
    diagnosis:
      "The excitement of buying hasn't transferred into action. The customer is in 'buyer's remorse' territory.",
    rootCause:
      "No immediate post-purchase engagement. The gap between signing and onboarding is too long. The customer doesn't know what to do next.",
    recommendedAction:
      "Create a '48-hour activation plan': welcome call within 24 hours, first meaningful action within 48 hours, CS check-in at day 7.",
    measurementTool: "Time from contract to first login + time to first value action",
  },
];

// ============================================
// Price Relevance by Stage (for quick lookup)
// ============================================

export function getPriceRelevance(stage: DecisionStage): string {
  const profile = DECISION_CYCLE.find((s) => s.stage === stage);
  if (!profile) return "unknown";

  switch (profile.priceRelevance) {
    case "none":
      return "Price is irrelevant at this stage. Focus on problem validation.";
    case "low":
      return "Price is a background consideration. Focus on education and credibility.";
    case "emerging":
      return "Price awareness is growing. Ensure value is established before it becomes central.";
    case "high":
      return "Price is actively being evaluated. Frame it in terms of ROI and business impact.";
    case "dominant":
      return "Price is the primary discussion. Lead with value justification and flexible terms.";
  }
}

// ============================================
// Diagnose a symptom
// ============================================

export function diagnoseSalesProblem(symptom: string): DecisionDiagnosis | undefined {
  // Simple keyword matching for now; will be enhanced with AI
  const normalizedSymptom = symptom.toLowerCase();
  return DECISION_DIAGNOSES.find((d) => {
    const normalizedDiagnosis = d.symptom.toLowerCase();
    return normalizedSymptom.includes(normalizedDiagnosis) ||
      normalizedDiagnosis.includes(normalizedSymptom);
  });
}

// ============================================
// Get stage profile
// ============================================

export function getDecisionStage(stage: DecisionStage): DecisionStageProfile | undefined {
  return DECISION_CYCLE.find((s) => s.stage === stage);
}
