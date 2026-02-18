/**
 * CX Theory Engine: Customer Lifecycle Science
 *
 * This module encodes evidence-based patterns about customer behavior
 * after purchase. It defines what's "normal" vs. "red flag" at each
 * lifecycle stage, with benchmarks by company size and vertical.
 *
 * Used by the AI to:
 * - Identify whether a customer's described experience is normal or concerning
 * - Set realistic expectations for each lifecycle phase
 * - Power Mode A (early stage) with "here's what to expect" guidance
 * - Power Mode B/C with "here's where you might be off track" diagnosis
 */

// ============================================
// Types
// ============================================

export type LifecyclePhase =
  | "onboarding"
  | "early_adoption"
  | "deep_adoption"
  | "value_realization"
  | "expansion"
  | "renewal"
  | "advocacy";

export type SignalType = "healthy" | "warning" | "critical";

export interface LifecyclePhaseProfile {
  phase: LifecyclePhase;
  name: string;
  typicalTimeframe: string;
  description: string;
  healthySignals: string[];
  warningSignals: string[];
  criticalSignals: string[];
  keyMetrics: MetricBenchmark[];
  whatToMeasure: string;
  recommendedCxTool: string;
  scienceBehind: string; // The theory/evidence backing this
}

export interface MetricBenchmark {
  metric: string;
  healthy: string;
  warning: string;
  critical: string;
  source: string; // Where this benchmark comes from
}

export interface LifecycleAntiPattern {
  name: string;
  phase: LifecyclePhase;
  description: string;
  signals: string[];
  impact: string;
  fix: string;
  preventionAction: string;
}

// ============================================
// Customer Lifecycle Phases
// ============================================

export const LIFECYCLE_PHASES: LifecyclePhaseProfile[] = [
  {
    phase: "onboarding",
    name: "Onboarding (Days 0-14)",
    typicalTimeframe: "0-14 days",
    description:
      "The customer is setting up, learning the basics, and forming their first impression of reality vs. sales promise. The first 14 days determine the trajectory of the entire relationship.",
    healthySignals: [
      "Login within 24 hours of purchase",
      "Core setup completed within 48 hours",
      "First meaningful action within 7 days",
      "Multiple team members invited within 14 days",
      "Proactive questions (engaged, not confused)",
    ],
    warningSignals: [
      "No login within 48 hours",
      "Partial setup: started but didn't complete",
      "Support ticket within first week (friction signal)",
      "Only one user active (no team adoption)",
      "Login but no meaningful activity",
    ],
    criticalSignals: [
      "No login within 7 days",
      "Multiple support tickets about basics",
      "Negative feedback in first interaction",
      "Requesting cancellation or refund",
      "Champion goes silent",
    ],
    keyMetrics: [
      {
        metric: "Time to first login",
        healthy: "< 24 hours",
        warning: "24-72 hours",
        critical: "> 72 hours",
        source: "Industry benchmark: Gainsight 2024 report",
      },
      {
        metric: "Time to first value",
        healthy: "< 7 days",
        warning: "7-14 days",
        critical: "> 14 days",
        source: "Lincoln Murphy / Sixteen Ventures research",
      },
      {
        metric: "Onboarding completion rate",
        healthy: "> 80%",
        warning: "50-80%",
        critical: "< 50%",
        source: "Totango benchmark data",
      },
    ],
    whatToMeasure: "Time to first value action, onboarding step completion rate, first-week engagement",
    recommendedCxTool: "Onboarding completion tracking + Day 3 CES survey",
    scienceBehind:
      "The 'first 14 days' effect is well-documented: customers form lasting impressions in the first two weeks. Research by Totango shows that customers who achieve 'first value' within 7 days have 3x higher retention at 12 months compared to those who take 30+ days.",
  },
  {
    phase: "early_adoption",
    name: "Early Adoption (Days 14-60)",
    typicalTimeframe: "14-60 days",
    description:
      "The customer is moving from 'trying' to 'using.' They're forming habits and deciding whether this tool becomes part of their workflow or stays peripheral.",
    healthySignals: [
      "Regular usage pattern established (daily/weekly)",
      "Multiple features being explored",
      "Team members actively using (not just the champion)",
      "Integrations being set up",
      "Positive informal feedback",
    ],
    warningSignals: [
      "Usage declining after initial spike",
      "Only using 1-2 basic features",
      "Only the champion is active",
      "No integrations connected",
      "Usage is sporadic, not habitual",
    ],
    criticalSignals: [
      "Usage drops below once per week",
      "Champion stops logging in",
      "Competitor mentioned in conversations",
      "Request to 'revisit the contract'",
      "Complete silence (no logins, no support, no communication)",
    ],
    keyMetrics: [
      {
        metric: "Weekly active users (% of seats)",
        healthy: "> 70%",
        warning: "40-70%",
        critical: "< 40%",
        source: "SaaS benchmarks composite",
      },
      {
        metric: "Feature adoption breadth",
        healthy: "3+ features used regularly",
        warning: "1-2 features only",
        critical: "Setup only, no feature usage",
        source: "Pendo product analytics benchmark",
      },
      {
        metric: "Usage trend (week over week)",
        healthy: "Stable or growing",
        warning: "Declining 10-20%",
        critical: "Declining > 20%",
        source: "ChurnZero benchmark data",
      },
    ],
    whatToMeasure: "Feature adoption rate, weekly active users, usage trend direction",
    recommendedCxTool: "Product analytics + 30-day NPS or CSAT",
    scienceBehind:
      "Habit formation research (BJ Fogg, James Clear) shows that behaviors need to be repeated consistently for ~60 days to become habits. If a product isn't part of the customer's routine by day 60, the probability of it becoming essential drops significantly.",
  },
  {
    phase: "deep_adoption",
    name: "Deep Adoption (Days 60-180)",
    typicalTimeframe: "60-180 days",
    description:
      "The customer has formed a habit. Now they're exploring deeper functionality, integrating with other tools, and the product is becoming embedded in their operations.",
    healthySignals: [
      "Advanced features being used",
      "API or integrations actively connected",
      "Internal workflows built around the product",
      "New team members being onboarded by the customer (not by you)",
      "Customer suggests feature improvements (invested in the product)",
    ],
    warningSignals: [
      "Usage plateaued but not growing",
      "Hitting plan limits but not upgrading",
      "Feature requests going unaddressed",
      "Increasing support tickets (complexity friction)",
      "Customer builds workarounds instead of using built-in features",
    ],
    criticalSignals: [
      "Usage declining after a plateau",
      "Key user (champion) leaves the company",
      "Data export requests (potential migration signal)",
      "Mentions of evaluating alternatives",
      "Executive sponsor changes or is unresponsive",
    ],
    keyMetrics: [
      {
        metric: "Feature depth score",
        healthy: "> 5 features used regularly",
        warning: "3-5 features",
        critical: "< 3 features after 60 days",
        source: "Composite SaaS benchmarks",
      },
      {
        metric: "Expansion indicators",
        healthy: "Exploring higher tier features or requesting more seats",
        warning: "Stable, no growth signals",
        critical: "Contracting usage",
        source: "Gainsight lifecycle metrics",
      },
    ],
    whatToMeasure: "Feature depth, integration count, team growth, support sentiment",
    recommendedCxTool: "Quarterly Business Review (QBR) + Health Score",
    scienceBehind:
      "The 60-180 day window is what Bessemer Venture Partners calls the 'stickiness zone.' Products that become operationally embedded (tied to workflows, integrated with other tools) have 5x lower churn than products that remain standalone utilities.",
  },
  {
    phase: "value_realization",
    name: "Value Realization (Months 3-6)",
    typicalTimeframe: "3-6 months",
    description:
      "The customer can now articulate the ROI of your product. This is the bridge between 'we use it' and 'we need it.'",
    healthySignals: [
      "Customer can state specific outcomes achieved",
      "Internal champion shares wins with leadership",
      "Usage of reporting/analytics features",
      "Request for case study participation",
      "Customer refers others",
    ],
    warningSignals: [
      "Customer can't articulate ROI when asked",
      "No executive visibility into the product's impact",
      "Usage is habitual but outcomes aren't being tracked",
      "Customer describes it as 'nice to have' not 'must have'",
    ],
    criticalSignals: [
      "Customer explicitly says they don't see ROI",
      "Budget review includes your product as a 'cut candidate'",
      "No one internally can justify the spend",
      "Champion leaves and no one else can explain the value",
    ],
    keyMetrics: [
      {
        metric: "ROI articulation (can customer state specific value?)",
        healthy: "Yes, with specific numbers",
        warning: "Vague ('it's useful')",
        critical: "No ('not sure if it's worth it')",
        source: "Customer success best practice",
      },
      {
        metric: "Executive sponsor engagement",
        healthy: "Exec aware and supportive",
        warning: "Exec unaware of product",
        critical: "Exec questioning the investment",
        source: "Gainsight lifecycle metrics",
      },
    ],
    whatToMeasure: "ROI metrics, executive engagement, internal advocacy signals",
    recommendedCxTool: "QBR with ROI review + NPS survey",
    scienceBehind:
      "Research by Bain & Company shows that customers who can articulate specific ROI are 6x more likely to renew and 4x more likely to expand. The 'value gap' — where customers use a product but can't quantify its impact — is the #1 predictor of at-risk renewals.",
  },
  {
    phase: "expansion",
    name: "Expansion (Months 6-12)",
    typicalTimeframe: "6-12 months",
    description:
      "The customer is a proven success. Now is the opportunity to grow the relationship — more seats, higher tier, additional products.",
    healthySignals: [
      "Hitting plan limits (growth indicator)",
      "Requesting features from higher tiers",
      "Adding new departments or teams",
      "API usage increasing",
      "Asking about enterprise features or security certifications",
    ],
    warningSignals: [
      "Stable but not growing (content stagnation)",
      "Feature requests that indicate outgrowing the product",
      "Using competitors for adjacent capabilities",
      "Budget not increasing despite team growth",
    ],
    criticalSignals: [
      "Active evaluation of alternatives for additional needs",
      "Reducing seat count",
      "Moving workflows off the platform",
      "Executive pushing for 'consolidation' to fewer tools",
    ],
    keyMetrics: [
      {
        metric: "Net Revenue Retention (NRR)",
        healthy: "> 120%",
        warning: "100-120%",
        critical: "< 100%",
        source: "Bessemer / OpenView SaaS benchmarks",
      },
      {
        metric: "Expansion revenue % of total",
        healthy: "> 30% of revenue from expansion",
        warning: "10-30%",
        critical: "< 10%",
        source: "SaaS Capital benchmark data",
      },
    ],
    whatToMeasure: "Usage growth trends, expansion signals, plan limit proximity",
    recommendedCxTool: "Expansion signal alerts + proactive account review",
    scienceBehind:
      "McKinsey research shows that acquiring a new customer costs 5-7x more than expanding an existing one. Companies with NRR > 120% grow 2.5x faster than those with NRR < 100%. Expansion is the most capital-efficient growth lever.",
  },
  {
    phase: "renewal",
    name: "Renewal Window (60 days before renewal)",
    typicalTimeframe: "60 days before contract end",
    description:
      "The formal renewal process. By this point, the outcome is largely determined by everything that came before. The renewal conversation is a lagging indicator, not a leading one.",
    healthySignals: [
      "Proactive renewal interest from the customer",
      "Expanding scope (adding seats, upgrading tier)",
      "Quick signature with minimal negotiation",
      "Multi-year commitment discussion",
      "Customer advocating for budget approval",
    ],
    warningSignals: [
      "Delayed response to renewal outreach",
      "Requesting significant discounts",
      "Asking for month-to-month instead of annual",
      "New procurement contact (original champion not involved)",
      "Requesting competitive comparisons",
    ],
    criticalSignals: [
      "Explicit statement of intent to churn",
      "Legal/procurement requesting contract details (exit clause review)",
      "No response after multiple outreach attempts",
      "Data export requests near renewal date",
      "Budget not approved for renewal",
    ],
    keyMetrics: [
      {
        metric: "Gross Retention Rate",
        healthy: "> 90%",
        warning: "80-90%",
        critical: "< 80%",
        source: "Bessemer Venture Partners benchmarks",
      },
      {
        metric: "Renewal cycle time (days from first outreach to signature)",
        healthy: "< 30 days",
        warning: "30-60 days",
        critical: "> 60 days",
        source: "Gainsight renewal metrics",
      },
    ],
    whatToMeasure: "Renewal pipeline, time to close, discount frequency, downsell rate",
    recommendedCxTool: "Pre-renewal NPS (at day -60) + automated health check",
    scienceBehind:
      "Gainsight data shows that 80% of renewal outcomes are determined by day -90. By the time you get to the renewal conversation, it's a confirmation of what the customer already decided. The 'renewal process' should start at onboarding, not at renewal.",
  },
  {
    phase: "advocacy",
    name: "Advocacy & Growth",
    typicalTimeframe: "Ongoing after successful renewal",
    description:
      "The customer has renewed and is a proven success story. They're now a potential advocate, referral source, and internal case study.",
    healthySignals: [
      "NPS 9-10 score",
      "Unprompted referrals",
      "Case study participation",
      "Speaking at events or webinars",
      "Active in customer community",
    ],
    warningSignals: [
      "Happy but passive (no advocacy actions)",
      "NPS 7-8 (satisfied but not enthusiastic)",
      "No referrals despite good relationship",
      "Declining engagement with community or events",
    ],
    criticalSignals: [
      "NPS declining after renewal",
      "Post-renewal buyer's remorse",
      "Renewed but reducing usage",
      "Champions becoming less responsive",
    ],
    keyMetrics: [
      {
        metric: "NPS score",
        healthy: "9-10 (Promoter)",
        warning: "7-8 (Passive)",
        critical: "0-6 (Detractor)",
        source: "Bain & Company NPS methodology",
      },
      {
        metric: "Referral rate",
        healthy: "> 20% of customers refer",
        warning: "5-20%",
        critical: "< 5%",
        source: "SaaS industry benchmark",
      },
    ],
    whatToMeasure: "NPS, referral count, case study pipeline, community engagement",
    recommendedCxTool: "NPS survey + referral program tracking",
    scienceBehind:
      "Fred Reichheld's research (creator of NPS) shows that a 5% increase in customer retention increases profits by 25-95%. Advocates have a customer lifetime value 2-4x higher than average customers because of referrals, expansion, and reduced support costs.",
  },
];

// ============================================
// Lifecycle Anti-Patterns
// ============================================

export const LIFECYCLE_ANTI_PATTERNS: LifecycleAntiPattern[] = [
  {
    name: "The Silent Onboarding",
    phase: "onboarding",
    description:
      "Customer signs up and hears nothing for days. No welcome, no guide, no check-in. They're left to figure it out alone.",
    signals: [
      "No automated welcome sequence",
      "CS team doesn't reach out until week 2+",
      "Customer support is the first touch (reactive, not proactive)",
    ],
    impact: "30-50% of new customers never reach first value. Early churn becomes normalized.",
    fix: "Implement a Day 0/1/3/7/14 communication sequence with clear milestones and proactive check-ins.",
    preventionAction: "Set up automated onboarding emails + CS calendar alerts for Day 1 and Day 7 check-ins.",
  },
  {
    name: "The Feature Dump",
    phase: "onboarding",
    description:
      "Instead of guiding the customer to their first win, the onboarding tries to show everything the product can do. Information overload delays time-to-value.",
    signals: [
      "Onboarding walkthrough covers 10+ features",
      "Customer completes onboarding but doesn't use the product",
      "Support tickets about 'where do I start?'",
    ],
    impact: "Customer feels overwhelmed. Paradox of choice leads to no action.",
    fix: "Design onboarding around ONE key outcome. Everything else can wait.",
    preventionAction: "Define the single 'first value action' for each vertical and optimize onboarding to reach it.",
  },
  {
    name: "The Champion Single Point of Failure",
    phase: "deep_adoption",
    description:
      "The entire relationship depends on one person. When they leave, the account collapses because no one else understands or cares about the product.",
    signals: [
      "Only 1 user actively engaged",
      "All communication goes through one contact",
      "No executive sponsor relationship",
    ],
    impact: "When champion leaves: 60-80% chance of churn within 6 months.",
    fix: "Multi-thread the relationship. Build connections with at least 3 stakeholders: champion, executive sponsor, and end users.",
    preventionAction: "Track 'contact depth' per account. Alert when fewer than 3 active contacts exist.",
  },
  {
    name: "The Renewal Surprise",
    phase: "renewal",
    description:
      "No one tracks renewal dates or health leading up to them. The renewal conversation happens last-minute, and problems surface too late to fix.",
    signals: [
      "No renewal calendar or pipeline",
      "First renewal outreach at day -30 or less",
      "Customer health not monitored before renewal window",
    ],
    impact: "Preventable churn. By the time you learn there's a problem, the customer has already decided to leave.",
    fix: "Start renewal process at day -90. Monitor health continuously. Flag at-risk accounts at day -120.",
    preventionAction: "Implement a health score that updates weekly and triggers alerts at day -90 for any account scoring below healthy.",
  },
  {
    name: "The Sales-to-CS Black Hole",
    phase: "onboarding",
    description:
      "The handoff from sales to customer success loses all context. The customer has to repeat their story, goals, and expectations to a new person.",
    signals: [
      "CS team doesn't know why the customer bought",
      "Customer repeats their goals in the kickoff call",
      "Sales notes not shared or not actionable",
    ],
    impact: "Trust erodes immediately. The customer feels like a ticket, not a relationship.",
    fix: "Structured handoff document: why they bought, their goals, key stakeholders, timeline, concerns raised during sales.",
    preventionAction: "Create mandatory handoff template in CRM. Block CS kickoff until handoff doc is completed.",
  },
  {
    name: "The Reactive Support Trap",
    phase: "early_adoption",
    description:
      "The only customer touchpoint is support tickets. No proactive outreach, no check-ins, no value reinforcement. Every interaction is initiated by a problem.",
    signals: [
      "No proactive CS touchpoints scheduled",
      "Support tickets are the primary communication channel",
      "No usage monitoring or health scoring",
    ],
    impact: "By the time a customer complains, they've already mentally started looking for alternatives.",
    fix: "Implement proactive touchpoints: Day 7 check-in, Day 30 review, Day 60 QBR. Use usage data to trigger outreach before problems surface.",
    preventionAction: "Set up usage decline alerts and automated check-in sequences.",
  },
];

// ============================================
// Helper Functions
// ============================================

export function getLifecyclePhase(phase: LifecyclePhase): LifecyclePhaseProfile | undefined {
  return LIFECYCLE_PHASES.find((p) => p.phase === phase);
}

export function getAntiPatternsForPhase(phase: LifecyclePhase): LifecycleAntiPattern[] {
  return LIFECYCLE_ANTI_PATTERNS.filter((a) => a.phase === phase);
}

export function assessSignal(
  phase: LifecyclePhase,
  signals: string[]
): SignalType {
  const phaseProfile = LIFECYCLE_PHASES.find((p) => p.phase === phase);
  if (!phaseProfile) return "warning";

  const hasCritical = signals.some((s) =>
    phaseProfile.criticalSignals.some((cs) =>
      cs.toLowerCase().includes(s.toLowerCase())
    )
  );
  if (hasCritical) return "critical";

  const hasWarning = signals.some((s) =>
    phaseProfile.warningSignals.some((ws) =>
      ws.toLowerCase().includes(s.toLowerCase())
    )
  );
  if (hasWarning) return "warning";

  return "healthy";
}
