/**
 * CX Theory Engine: Best Practice Foundations (Mode A)
 *
 * For early-stage companies that don't have customers or data yet.
 * "Tell me what I should be doing from day one."
 *
 * This module provides the CX foundation checklist, stage-appropriate
 * guidance, and "mistakes companies like you make" confrontation data
 * for Mode A (Early Stage / Best Practice) of the confrontation layer.
 */

// ============================================
// Types
// ============================================

export type MaturityStage = "pre_revenue" | "first_customers" | "growing";

export interface FoundationElement {
  id: string;
  name: string;
  priority: 1 | 2 | 3; // 1 = build now, 2 = build soon, 3 = build later
  description: string;
  whyItMatters: string;
  minimalViableVersion: string; // The simplest version to start with
  matureVersion: string; // What it should evolve into
  applicableFrom: MaturityStage;
  effortToImplement: "1-day" | "1-week" | "2-4-weeks" | "1-3-months";
  tools: string[]; // What CX tools support this
}

export interface StageGuidance {
  stage: MaturityStage;
  name: string;
  description: string;
  customerRange: string;
  keyFocus: string;
  topMistakes: StageMistake[];
  immediateActions: string[];
  cxToolsToDeploy: string[];
  dontDoYet: string[];
}

export interface StageMistake {
  mistake: string;
  whyItHappens: string;
  consequence: string;
  whatToDoInstead: string;
}

// ============================================
// CX Foundation Elements (The 7 Essentials)
// ============================================

export const CX_FOUNDATIONS: FoundationElement[] = [
  {
    id: "onboarding-flow",
    name: "Structured Onboarding Flow",
    priority: 1,
    description:
      "A defined path from signup to first value. Not a tutorial — a guided experience that leads to the customer's first meaningful outcome.",
    whyItMatters:
      "Customers who reach first value within 7 days have 3x higher 12-month retention. Without structured onboarding, you're leaving retention to chance.",
    minimalViableVersion:
      "A 5-email welcome sequence: Day 0 (welcome + first step), Day 1 (key feature), Day 3 (check-in), Day 7 (milestone check), Day 14 (value summary). Can be done with Mailchimp/Loops/Customer.io in 1 day.",
    matureVersion:
      "In-app guided tours, personalized onboarding paths by persona, automated progress tracking, proactive CS outreach for stalled users.",
    applicableFrom: "pre_revenue",
    effortToImplement: "1-day",
    tools: ["Onboarding email sequence", "In-app tooltip (Appcues/Intercom)", "CES survey at Day 7"],
  },
  {
    id: "first-value-definition",
    name: "Defined 'First Value' Action",
    priority: 1,
    description:
      "A clearly identified action that represents the customer's first meaningful outcome. This is the ONE thing that predicts retention.",
    whyItMatters:
      "If you don't know what 'first value' looks like in your product, you can't optimize for it. Every SaaS has one action that most predicts retention — find it.",
    minimalViableVersion:
      "Write down: 'A customer has gotten value when they [specific action].' Examples: created their first report, sent their first campaign, completed their first workflow. Track whether customers do this within 7 days.",
    matureVersion:
      "Instrumented activation metrics with cohort analysis. A/B testing different paths to first value. Real-time alerts when customers haven't activated.",
    applicableFrom: "pre_revenue",
    effortToImplement: "1-day",
    tools: ["Analytics tracking", "Onboarding funnel", "Event triggers"],
  },
  {
    id: "feedback-loop",
    name: "Customer Feedback Loop",
    priority: 1,
    description:
      "A systematic way to collect, process, and act on customer feedback. Not ad hoc — structured and regular.",
    whyItMatters:
      "Without a feedback loop, you're building blind. Every decision is a guess. A simple feedback mechanism is worth more than the most sophisticated analytics.",
    minimalViableVersion:
      "A CSAT survey after onboarding + an NPS survey at Day 30. Review responses weekly. Follow up on every score below 3/5. Can be set up in 2 hours with Typeform.",
    matureVersion:
      "Multi-channel feedback: in-app surveys, NPS, CSAT, CES at key moments. Sentiment analysis. Feedback categorization and routing to product/engineering. Closed-loop follow-up.",
    applicableFrom: "first_customers",
    effortToImplement: "1-day",
    tools: ["NPS survey (Day 30)", "CSAT post-onboarding", "CES for key actions"],
  },
  {
    id: "proactive-checkpoints",
    name: "Proactive Customer Checkpoints",
    priority: 2,
    description:
      "Scheduled touchpoints at critical moments: Day 7, Day 30, Day 90, pre-renewal. Don't wait for problems — check in before they happen.",
    whyItMatters:
      "For every customer who complains, 26 stay silent and churn. Proactive check-ins catch the silent majority before they leave.",
    minimalViableVersion:
      "Calendar reminders to personally email every customer at Day 7 and Day 30. Ask: 'How are things going? Anything I can help with?' Takes 5 minutes per customer.",
    matureVersion:
      "Automated check-in sequences triggered by time and behavior. CS playbooks for each checkpoint. Usage-based outreach (declining engagement triggers proactive call).",
    applicableFrom: "first_customers",
    effortToImplement: "1-day",
    tools: ["Calendar/CRM reminders", "Email templates", "Event-based triggers"],
  },
  {
    id: "handoff-process",
    name: "Sales-to-CS Handoff Process",
    priority: 2,
    description:
      "A documented process for transitioning a new customer from the sales team to whoever manages the ongoing relationship (CS, support, account manager).",
    whyItMatters:
      "The #1 destroyer of post-sale trust is the cold handoff. Customers who feel 'dropped' after signing have 2-3x higher early churn.",
    minimalViableVersion:
      "A simple handoff document template: customer name, what they bought, why they bought, their primary goal, their timeline, any concerns from the sales process. Share in Slack/email within 1 hour of close.",
    matureVersion:
      "CRM-integrated handoff workflow. Automated triggers on deal-close. Warm introduction protocol. Shared customer workspace (Notion/wiki) with full history.",
    applicableFrom: "first_customers",
    effortToImplement: "1-day",
    tools: ["Handoff template (Google Doc/Notion)", "CRM automation", "CSAT at Day 7"],
  },
  {
    id: "health-monitoring",
    name: "Basic Customer Health Monitoring",
    priority: 2,
    description:
      "A way to know which customers are healthy and which are at risk — before they tell you.",
    whyItMatters:
      "80% of churn is predictable 90 days in advance if you're watching the right signals. Without monitoring, every churn is a 'surprise.'",
    minimalViableVersion:
      "A spreadsheet with 3 columns per customer: Last login date, Support tickets this month, Overall sentiment (Green/Yellow/Red — your gut feeling). Review weekly.",
    matureVersion:
      "Automated health score combining usage, engagement, support, NPS. Dashboard. Alerts. Intervention playbooks.",
    applicableFrom: "first_customers",
    effortToImplement: "1-week",
    tools: ["Spreadsheet or CRM health field", "Usage analytics", "Health Score (when ready)"],
  },
  {
    id: "value-documentation",
    name: "Customer Value Documentation",
    priority: 3,
    description:
      "A way to track and communicate the value each customer has received. Not just usage metrics — actual business outcomes.",
    whyItMatters:
      "Customers who can articulate ROI renew at 6x the rate. If you don't help them document value, they can't justify the investment at renewal time.",
    minimalViableVersion:
      "At each QBR or check-in, ask: 'What's the most valuable thing our product has done for you this quarter?' Write it down. Share it back before renewal.",
    matureVersion:
      "In-product ROI dashboard. Automated value summaries. Pre-renewal value reports. Outcome-based case studies.",
    applicableFrom: "growing",
    effortToImplement: "1-week",
    tools: ["QBR template", "Value summary email template", "ROI calculator"],
  },
];

// ============================================
// Stage-Specific Guidance
// ============================================

export const STAGE_GUIDANCE: StageGuidance[] = [
  {
    stage: "pre_revenue",
    name: "Pre-Revenue / Building",
    description:
      "You're building your product and haven't sold it yet (or have < 5 beta users). Your CX focus is: design for success from day one.",
    customerRange: "0-5 beta users",
    keyFocus: "Design your onboarding and first-value experience BEFORE you have customers. It's 10x harder to fix later.",
    topMistakes: [
      {
        mistake: "Building without a defined 'first value' action",
        whyItHappens: "You're focused on features, not customer outcomes. The product grows but nobody knows what 'success' looks like for the user.",
        consequence: "When customers arrive, they don't know what to do. Onboarding is generic. Time to value is long and unpredictable.",
        whatToDoInstead: "Before writing another line of code, answer: 'A customer has gotten value when they ____.' Build everything toward that moment.",
      },
      {
        mistake: "Skipping onboarding design",
        whyItHappens: "'We'll figure it out when we have customers.' Onboarding feels premature when you're still building.",
        consequence: "Your first customers have a terrible experience. You lose them before you learn from them.",
        whatToDoInstead: "Draft a 5-step onboarding flow now. Even if it changes, having a plan is better than figuring it out live.",
      },
      {
        mistake: "No feedback mechanism from day one",
        whyItHappens: "You think you'll just talk to customers. But conversations are unstructured and insights get lost.",
        consequence: "You miss patterns. Feedback is anecdotal, not systematic. You react to the loudest voice, not the most common issue.",
        whatToDoInstead: "Set up a simple feedback form (even Google Forms) and a CSAT question from your very first beta user.",
      },
    ],
    immediateActions: [
      "Define your 'first value' action — the ONE thing that means a customer got value",
      "Draft a 5-step onboarding flow (even on paper)",
      "Set up a feedback form for your beta users",
      "Write down your onboarding email sequence (5 emails: Day 0, 1, 3, 7, 14)",
      "Create a simple handoff template for when you start selling",
    ],
    cxToolsToDeploy: [
      "CSAT after onboarding (even for beta users)",
      "Feedback form (Google Forms / Typeform)",
      "Analytics: track 'first value' action completion",
    ],
    dontDoYet: [
      "NPS (not enough customers for statistical significance)",
      "Health Score (need data foundation first)",
      "QBRs (no enough customers or history)",
      "Automated event triggers (build manually first, automate later)",
    ],
  },
  {
    stage: "first_customers",
    name: "First Customers (1-50)",
    description:
      "You have paying customers. Every customer matters. Your CX focus is: learn from every interaction and build the foundation.",
    customerRange: "1-50 paying customers",
    keyFocus: "Talk to every customer. Personally. Learn what works and what doesn't. Build your CX processes from real patterns, not theory.",
    topMistakes: [
      {
        mistake: "Treating support as the only CX function",
        whyItHappens: "You're a small team. When something breaks, you fix it. But nobody is proactively checking in or monitoring health.",
        consequence: "You only hear from unhappy customers. The silent majority churns without warning.",
        whatToDoInstead: "Set up proactive check-ins at Day 7 and Day 30 for every customer. 5 minutes per customer. Worth more than any feature.",
      },
      {
        mistake: "No structured onboarding — each customer gets a different experience",
        whyItHappens: "You onboard each customer personally, which is great. But each one gets a different flow, and you can't optimize what isn't consistent.",
        consequence: "Onboarding quality is unpredictable. Good for some, terrible for others. No way to identify what works.",
        whatToDoInstead: "Standardize: create an onboarding checklist that every customer goes through. Personal touches on top of a consistent foundation.",
      },
      {
        mistake: "Not tracking why customers leave",
        whyItHappens: "It feels personal. You don't want to ask. Or the customer just stops responding.",
        consequence: "You repeat the same mistakes. Every churn feels like a surprise when it was actually a pattern.",
        whatToDoInstead: "Ask every churning customer two questions: 'What was the main reason?' and 'What could we have done differently?' Even a 30% response rate gives you patterns.",
      },
      {
        mistake: "Depending on one champion per customer",
        whyItHappens: "Natural tendency — you know one person, you talk to one person. It works until they leave.",
        consequence: "When the champion departs, the account collapses. 60-80% churn risk.",
        whatToDoInstead: "For every customer, know at least 2 contacts. Even asking 'who else on your team uses this?' starts the multi-threading.",
      },
    ],
    immediateActions: [
      "Set up Day 7 and Day 30 check-in emails for every new customer",
      "Standardize your onboarding checklist (5-7 steps every customer goes through)",
      "Create a simple customer health tracker (spreadsheet: last login, sentiment, risk)",
      "Set up CSAT after onboarding + NPS at Day 30",
      "Start a churn exit survey (2 questions, automated on cancellation)",
      "Document your handoff process (even if you're the only person)",
    ],
    cxToolsToDeploy: [
      "CSAT after onboarding completion",
      "NPS at Day 30 (your first baseline)",
      "Churn exit survey (2 questions)",
      "Onboarding completion tracking (simple checklist)",
      "CES after setup: 'How easy was it to get started?'",
    ],
    dontDoYet: [
      "Automated health scoring (you don't have enough data yet — use gut feel with a spreadsheet)",
      "Complex event triggers (do it manually for now)",
      "Expansion playbooks (focus on retention first)",
    ],
  },
  {
    stage: "growing",
    name: "Growing (50-300 customers)",
    description:
      "You have product-market fit and a growing customer base. Your CX focus is: systematize what works and build early warning systems.",
    customerRange: "50-300 paying customers",
    keyFocus: "You can't personally manage every customer anymore. Build systems that scale your best practices.",
    topMistakes: [
      {
        mistake: "Not investing in a health score",
        whyItHappens: "It feels complex. You think you still know your customers. But at 100+, you can't keep track in your head.",
        consequence: "Churn becomes a surprise again. You're reactive instead of proactive. CS team is firefighting.",
        whatToDoInstead: "Build a simple health score with 4 inputs: usage frequency, feature adoption, support sentiment, NPS. Start with a spreadsheet, graduate to a tool.",
      },
      {
        mistake: "Skipping QBRs for strategic accounts",
        whyItHappens: "Too busy. Customer seems happy. No one is asking for one.",
        consequence: "No value reinforcement. At renewal time, customer can't articulate ROI. Price negotiations intensify.",
        whatToDoInstead: "Run quarterly reviews for your top 20% of accounts. Focus on: what you achieved, the business impact, what's next.",
      },
      {
        mistake: "No expansion motion",
        whyItHappens: "CS team is focused on retention. Sales team is focused on new logos. Nobody owns expansion.",
        consequence: "You're leaving 20-40% of potential revenue on the table. Customers outgrow your plans and look for alternatives instead of upgrading.",
        whatToDoInstead: "Build expansion signal detection: usage limits, feature requests, seat growth. Assign expansion ownership (CS or dedicated).",
      },
    ],
    immediateActions: [
      "Implement a basic customer health score",
      "Start QBRs for your top 20% of accounts by ACV",
      "Build expansion signal alerts (plan limits, usage thresholds)",
      "Segment customers: high-touch (top 20%), tech-touch (middle 60%), self-serve (bottom 20%)",
      "Create a pre-renewal value summary template",
      "Set up automated NPS at quarterly intervals",
    ],
    cxToolsToDeploy: [
      "Health Score (composite: usage + engagement + support + NPS)",
      "NPS quarterly",
      "Event-based triggers (usage decline, champion change, expansion signals)",
      "QBR template for strategic accounts",
      "Pre-renewal value summary (automated at day -60)",
      "Win/loss analysis for deals > threshold",
    ],
    dontDoYet: [
      "Nothing — at this stage, all CX tools are fair game. The question is prioritization, not whether to deploy.",
    ],
  },
];

// ============================================
// Helper Functions
// ============================================

export function getFoundationsByPriority(priority: 1 | 2 | 3): FoundationElement[] {
  return CX_FOUNDATIONS.filter((f) => f.priority === priority);
}

export function getFoundationsForStage(stage: MaturityStage): FoundationElement[] {
  const stageOrder: MaturityStage[] = ["pre_revenue", "first_customers", "growing"];
  const stageIndex = stageOrder.indexOf(stage);
  return CX_FOUNDATIONS.filter((f) => {
    const foundationIndex = stageOrder.indexOf(f.applicableFrom);
    return foundationIndex <= stageIndex;
  });
}

export function getStageGuidance(stage: MaturityStage): StageGuidance | undefined {
  return STAGE_GUIDANCE.find((s) => s.stage === stage);
}

export function getMistakesForStage(stage: MaturityStage): StageMistake[] {
  const guidance = getStageGuidance(stage);
  return guidance?.topMistakes || [];
}
