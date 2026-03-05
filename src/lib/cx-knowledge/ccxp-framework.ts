/**
 * CCXP Body of Knowledge — Layer 1B: Methodology Intelligence
 *
 * The CXPA (Customer Experience Professionals Association) defines 6 core
 * competency areas. This module structures them with maturity-appropriate
 * guidance so Claude can inject the right competency context based on
 * where the company is.
 *
 * This is what gives CX Mate its "CCXP-methodology" credibility.
 * Wired into prompts: 2026-03-05
 */

// ============================================
// Types
// ============================================

export interface CCXPCompetency {
  id: string;
  name: string;
  description: string;
  /** Which journey stages this competency matters most */
  relevantStageTypes: ("sales" | "customer" | "both")[];
  /** What to focus on at each maturity level */
  maturityGuidance: {
    early: string;
    growing: string;
    established: string;
  };
  /** Key metrics for this competency */
  keyMetrics: string[];
  /** Common mistakes companies make in this competency */
  commonMistakes: string[];
  /** Quick win for each maturity stage */
  quickWin: {
    early: string;
    growing: string;
    established: string;
  };
}

// ============================================
// The 6 CCXP Competency Blocks
// ============================================

export const CCXP_COMPETENCIES: CCXPCompetency[] = [
  {
    id: "customer_centric_culture",
    name: "Customer-Centric Culture",
    description:
      "How deeply CX is embedded in the company's DNA — from leadership commitment to frontline behaviours.",
    relevantStageTypes: ["customer"],
    maturityGuidance: {
      early:
        "Focus on founder-led CX: the founder IS the CX team. Make customer conversations a weekly ritual, not a quarterly report. Share every customer email with the whole team.",
      growing:
        "Formalise CX ownership: designate a CX champion (doesn't need to be full-time). Create a shared Slack channel for customer wins and losses. Make churn discussions part of all-hands.",
      established:
        "Build CX into performance reviews and hiring criteria. Establish a Customer Advisory Board. Run quarterly CX reviews at the leadership level. Measure CX culture with eNPS.",
    },
    keyMetrics: [
      "Employee CX awareness score",
      "Customer issue escalation time",
      "Cross-functional CX initiative count",
      "eNPS (Employee Net Promoter Score)",
    ],
    commonMistakes: [
      "Delegating CX entirely to support — it should be company-wide",
      "Treating CX as a project with an end date, not an ongoing discipline",
      "Measuring CX satisfaction without acting on the results",
    ],
    quickWin: {
      early: "Start a weekly 'Customer Story' ritual — 5 min in standup sharing one customer interaction",
      growing: "Create a #customer-wins-and-losses Slack channel visible to entire company",
      established: "Add 'CX impact' as a required section in every product roadmap proposal",
    },
  },
  {
    id: "voc_insight",
    name: "Voice of Customer, Insight & Understanding",
    description:
      "How effectively the company collects, analyses, and acts on customer feedback — formal surveys, informal signals, and behavioural data.",
    relevantStageTypes: ["customer"],
    maturityGuidance: {
      early:
        "Don't build a survey programme yet. Talk to customers directly — 15-min calls, support chat analysis, founder check-ins. You need qualitative depth, not quantitative breadth.",
      growing:
        "Deploy ONE structured feedback mechanism (CSAT or NPS — not both yet). Close the feedback loop: every detractor gets a human response within 48h. Start tracking themes, not just scores.",
      established:
        "Build a multi-channel VoC programme: surveys + support tickets + product usage + sales feedback. Use AI to synthesise themes across channels. Share monthly VoC digests with leadership.",
    },
    keyMetrics: [
      "NPS / CSAT / CES scores",
      "Feedback response rate",
      "Time to close feedback loop",
      "Actionable insights per quarter",
    ],
    commonMistakes: [
      "Collecting NPS with under 50 responses and treating it as statistically valid",
      "Sending surveys but never closing the loop — customers stop responding",
      "Only listening to vocal customers — silent churn is the real threat",
    ],
    quickWin: {
      early: "Schedule 5 customer calls this week — ask 'What almost made you not buy?' and 'What surprised you after signing?'",
      growing: "Set up a single CSAT survey at the end of onboarding — track the trend weekly",
      established: "Build a monthly VoC digest that combines survey data + support themes + product usage patterns",
    },
  },
  {
    id: "org_adoption",
    name: "Organisational Adoption & Accountability",
    description:
      "How CX responsibilities are distributed across the organisation — governance, role clarity, and cross-functional alignment.",
    relevantStageTypes: ["both"],
    maturityGuidance: {
      early:
        "Everyone does CX. No dedicated role needed yet, but someone (usually the founder) must be the CX conscience — the person who asks 'What does this mean for the customer?' in every decision.",
      growing:
        "Assign CX ownership to a specific person or team. Define handoff protocols between sales, onboarding, and CS. Create SLAs for customer-facing response times.",
      established:
        "Establish a CX governance committee. Define CX KPIs by department (not just CS). Build CX into product development process. Consider a CCO or VP CX role.",
    },
    keyMetrics: [
      "Handoff quality score (sales → CS)",
      "Cross-team CX initiative ownership",
      "Customer issue resolution ownership clarity",
      "CX-specific KPIs per department",
    ],
    commonMistakes: [
      "Hiring a CX person and expecting them to fix everything alone",
      "No defined handoff between sales and CS — customers fall through the crack",
      "CX metrics owned only by CS team, invisible to product and engineering",
    ],
    quickWin: {
      early: "Document your sales-to-CS handoff in one page: what info transfers, who owns what, when",
      growing: "Create a shared dashboard where sales, CS, and product can all see CX health metrics",
      established: "Add CX KPIs to every department's quarterly goals — not just CS",
    },
  },
  {
    id: "cx_strategy",
    name: "Customer Experience Strategy",
    description:
      "The deliberate design of end-to-end customer experiences — journey mapping, experience design, and strategic CX planning.",
    relevantStageTypes: ["both"],
    maturityGuidance: {
      early:
        "Map your journey at the highest level: Awareness → Evaluation → Purchase → Onboarding → Value Realisation → Renewal. Identify the ONE stage that's breaking. Fix that first.",
      growing:
        "Build detailed journey maps for your top 2 customer segments. Identify moments of truth where experience quality determines retention. Design proactive interventions at each.",
      established:
        "Run journey mapping workshops with cross-functional teams. Track journey metrics end-to-end. Design differentiated experiences by segment. Benchmark against industry.",
    },
    keyMetrics: [
      "Journey completion rate by stage",
      "Time-to-value",
      "Moment of truth conversion rates",
      "Journey coverage (% of touchpoints mapped)",
    ],
    commonMistakes: [
      "Mapping the journey the company designed, not the journey customers actually experience",
      "Creating beautiful journey maps that sit in a drawer — maps must drive action",
      "Optimising individual touchpoints without seeing the end-to-end experience",
    ],
    quickWin: {
      early: "Draw your customer journey on a whiteboard in 30 minutes — just the 5 big stages and biggest pain point",
      growing: "Interview 3 customers about their actual journey — compare it to what you assumed",
      established: "Run a cross-functional journey mapping workshop with sales, CS, product, and marketing in the same room",
    },
  },
  {
    id: "design_innovation",
    name: "Design, Implementation & Innovation",
    description:
      "How the company designs and implements CX improvements — from quick fixes to structural changes, using human-centred design principles.",
    relevantStageTypes: ["customer"],
    maturityGuidance: {
      early:
        "Fix the broken basics first — don't innovate before the fundamentals work. Focus on 'good enough' onboarding, responsive support, and clear communication. Speed of improvement matters more than perfection.",
      growing:
        "Start designing proactive experiences: anticipate problems before customers report them. Build templates and playbooks so CX quality doesn't depend on individual heroics.",
      established:
        "Invest in experience design: user research, prototyping CX changes, A/B testing interventions. Build a CX innovation pipeline — test small, scale what works.",
    },
    keyMetrics: [
      "CX improvement implementation rate",
      "Time from CX insight to action",
      "Customer effort reduction per quarter",
      "CX experiment win rate",
    ],
    commonMistakes: [
      "Trying to innovate CX when the basics are still broken",
      "Designing CX changes without testing with real customers",
      "Over-engineering solutions — sometimes a better email template beats a new platform",
    ],
    quickWin: {
      early: "Fix the single biggest customer complaint this week — the one you already know about",
      growing: "Build 3 email templates for your most common customer situations (welcome, check-in, risk)",
      established: "Run one CX experiment this month: change one touchpoint and measure the difference",
    },
  },
  {
    id: "metrics_roi",
    name: "Metrics, Measurement & ROI",
    description:
      "How the company measures CX effectiveness and ties it to business outcomes — NPS/CSAT/CES, operational metrics, and financial impact.",
    relevantStageTypes: ["both"],
    maturityGuidance: {
      early:
        "Start with ONE metric. CSAT after onboarding is the simplest and most actionable. Don't measure everything — measure the thing that tells you if onboarding works. Track the trend, not the absolute number.",
      growing:
        "Add a relationship metric (NPS or overall CSAT). Start connecting CX metrics to business outcomes: does CSAT predict renewal? Does onboarding completion correlate with expansion? Build the business case for CX investment.",
      established:
        "Build a CX measurement framework: transactional (CSAT/CES at moments), relationship (NPS quarterly), operational (time-to-value, resolution time), and financial (revenue impact, cost-to-serve). Present CX ROI to the board quarterly.",
    },
    keyMetrics: [
      "NPS / CSAT / CES (at appropriate maturity)",
      "CX-to-revenue correlation",
      "Cost of poor CX (churn × ACV)",
      "CX ROI per initiative",
    ],
    commonMistakes: [
      "Measuring NPS with too few responses — need 100+ for statistical reliability",
      "Tracking CX metrics without connecting them to revenue impact",
      "Measuring satisfaction without measuring effort (CES) — customers can be satisfied but still leave if it's too hard",
    ],
    quickWin: {
      early: "Calculate your cost of churn: lost customers × ACV = the number that justifies CX investment",
      growing: "Add one CES question after your most complex process — 'How easy was this on a scale of 1-7?'",
      established: "Build a CX-to-revenue dashboard: show how CSAT/NPS changes correlate with renewal rates",
    },
  },
];

// ============================================
// Selection Functions
// ============================================

/**
 * Get competencies relevant to a company's maturity stage.
 * Returns all 6 with maturity-appropriate guidance.
 */
export function getCompetenciesForMaturity(
  companyStage: "early" | "growing" | "established"
): { competency: CCXPCompetency; guidance: string; quickWin: string }[] {
  return CCXP_COMPETENCIES.map((c) => ({
    competency: c,
    guidance: c.maturityGuidance[companyStage],
    quickWin: c.quickWin[companyStage],
  }));
}

/**
 * Get the most relevant competencies for a specific stage type.
 */
export function getCompetenciesForStageType(
  stageType: "sales" | "customer"
): CCXPCompetency[] {
  return CCXP_COMPETENCIES.filter(
    (c) =>
      c.relevantStageTypes.includes(stageType) ||
      c.relevantStageTypes.includes("both")
  );
}

/**
 * Build prompt context for CCXP competencies.
 * Injects maturity-appropriate guidance — compact format.
 */
export function buildCCXPPromptContext(
  companyStage: "early" | "growing" | "established"
): string {
  const competencies = getCompetenciesForMaturity(companyStage);

  const entries = competencies
    .map(
      (c) =>
        `- **${c.competency.name}:** ${c.guidance}\n  → Quick win: ${c.quickWin}\n  → Avoid: ${c.competency.commonMistakes[0]}`
    )
    .join("\n\n");

  return `## CCXP Professional Framework (${companyStage}-stage guidance)

These are the 6 competency areas recognised by the CXPA (Customer Experience Professionals Association). Use them to structure your recommendations — each recommendation should map to at least one competency area.

${entries}

**How to reference:** When a recommendation maps to a CCXP competency, note it naturally. Example: "This addresses the VoC competency — you need a structured way to hear what customers aren't telling you directly."`;
}
