/**
 * CX Influencer Frameworks — Layer 1A: Methodology Intelligence
 *
 * Structured citation library of proven CX frameworks from recognized
 * industry experts. Injected into journey + recommendation prompts so
 * Claude can cite specific frameworks by name.
 *
 * Source: B-brain/01-cx-methodology/cx-influencers-2026.md
 * Wired into prompts: 2026-03-05
 */

// ============================================
// Types
// ============================================

export interface InfluencerFramework {
  id: string;
  expert: string;
  framework: string;
  /** 1-sentence core principle */
  principle: string;
  /** Contexts where this framework applies */
  applyWhen: FrameworkContext[];
  /** Which journey stages it's most relevant to */
  stageRelevance: ("sales" | "customer" | "both")[];
  /** How the AI should cite this in output */
  citationExample: string;
}

export type FrameworkContext =
  | "journey_mapping"
  | "measurement"
  | "advocacy"
  | "onboarding"
  | "retention"
  | "churn_prevention"
  | "service_culture"
  | "leadership"
  | "automation"
  | "delight_moments"
  | "voc"
  | "employee_experience"
  | "simplification"
  | "support"
  | "handoff"
  | "expansion"
  | "decision_science"
  | "startup_cx";

// ============================================
// Framework Library
// ============================================

export const CX_FRAMEWORKS: InfluencerFramework[] = [
  // ── Pioneers ────────────────────────────────────────────
  {
    id: "bliss_five_competencies",
    expert: "Jeanne Bliss",
    framework: "Five Competencies of Customer-Centric Leadership",
    principle:
      "Earn the right to grow by improving customers' lives. CX must be owned at the C-suite, not delegated to support.",
    applyWhen: ["leadership", "retention", "churn_prevention", "measurement"],
    stageRelevance: ["both"],
    citationExample:
      'Jeanne Bliss\'s "Five Competencies" model shows that companies where the CEO personally reviews customer loss patterns reduce churn 2x faster.',
  },
  {
    id: "hyken_moments_of_magic",
    expert: "Shep Hyken",
    framework: "Moments of Magic vs Moments of Misery",
    principle:
      "Every touchpoint is a chance to deliver. Consistency beats sporadic delight — the goal is reliable amazement, not occasional wow.",
    applyWhen: ["delight_moments", "service_culture", "onboarding", "support"],
    stageRelevance: ["customer"],
    citationExample:
      'This is what Shep Hyken calls a "Moment of Magic" — a touchpoint where consistent, small excellence creates lasting loyalty.',
  },
  {
    id: "kaufman_uplifting_service",
    expert: "Ron Kaufman",
    framework: "Uplifting Service",
    principle:
      "Service culture scales when the entire organisation adopts a service mindset, not just the frontline team.",
    applyWhen: ["service_culture", "employee_experience", "expansion"],
    stageRelevance: ["customer"],
    citationExample:
      "Ron Kaufman's Uplifting Service framework suggests aligning every team — not just CS — around the customer's success definition.",
  },

  // ── Futurists ────────────────────────────────────────────
  {
    id: "morgan_ai_balance",
    expert: "Blake Morgan",
    framework: "Human-AI CX Balance",
    principle:
      "The companies that win use AI to handle transactions while freeing humans to handle relationships. The wrong balance destroys trust.",
    applyWhen: ["automation", "support", "onboarding", "decision_science"],
    stageRelevance: ["both"],
    citationExample:
      "Blake Morgan's AI-CX framework flags this as a risk: automating a high-emotion moment removes the human touch customers need most.",
  },
  {
    id: "vanbelleghem_partners",
    expert: "Steven Van Belleghem",
    framework: "Partners in Life / AI+Human Balance",
    principle:
      "AI handles the convenience; humans handle the complexity. Brands stay human in an automated world by knowing which is which.",
    applyWhen: ["automation", "support", "onboarding"],
    stageRelevance: ["customer"],
    citationExample:
      'Steven Van Belleghem\'s "Partners in Life" model recommends: automate the routine, humanise the complex. This moment needs the human side.',
  },
  {
    id: "baer_hug_haters",
    expert: "Jay Baer",
    framework: "Experience IS Marketing / Hug Your Haters",
    principle:
      "Response speed and complaint handling are growth levers, not cost centres. Every complaint answered publicly turns 1 detractor into 10 advocates.",
    applyWhen: ["advocacy", "support", "churn_prevention"],
    stageRelevance: ["customer"],
    citationExample:
      "Jay Baer's research shows that responding to complaints within 1 hour increases customer advocacy by 25%. Speed is a CX strategy.",
  },

  // ── Practitioners ────────────────────────────────────────
  {
    id: "golding_measurement",
    expert: "Ian Golding",
    framework: "Measurable CX Strategy",
    principle:
      "CX strategy without measurement is just good intentions. Every initiative needs a metric, a baseline, and a target.",
    applyWhen: ["measurement", "journey_mapping", "leadership"],
    stageRelevance: ["both"],
    citationExample:
      'Ian Golding (CCXP) identifies this as a critical moment of truth — the point where measurement discipline separates good CX from great.',
  },
  {
    id: "franz_journey_why",
    expert: "Annette Franz",
    framework: "Journey Mapping Reveals the WHY",
    principle:
      "Don't just map what customers do — understand WHY they do it. Root cause analysis behind journey behaviour drives real change.",
    applyWhen: ["journey_mapping", "voc", "churn_prevention", "onboarding"],
    stageRelevance: ["both"],
    citationExample:
      "Annette Franz's journey mapping approach asks: why does the customer behave this way at this moment? The map is not the insight — the WHY is.",
  },
  {
    id: "bova_ex_cx",
    expert: "Tiffani Bova",
    framework: "The EX↔CX Link",
    principle:
      "Employee experience directly drives customer experience. CS teams that are burnt out deliver burnt-out experiences.",
    applyWhen: ["employee_experience", "service_culture", "retention"],
    stageRelevance: ["customer"],
    citationExample:
      "Tiffani Bova's research proves the EX↔CX link: if your CS team is overwhelmed, your customers feel it. Fix the team before fixing the process.",
  },
  {
    id: "dixon_effortless",
    expert: "Matt Dixon",
    framework: "Effortless Experience / CES",
    principle:
      "Reducing effort beats increasing delight. Customers don't want to be wowed — they want things to be easy.",
    applyWhen: ["measurement", "onboarding", "support", "simplification"],
    stageRelevance: ["customer"],
    citationExample:
      'Matt Dixon\'s "Effortless Experience" research shows that reducing customer effort is 4x more predictive of loyalty than delight.',
  },
  {
    id: "reichheld_loyalty",
    expert: "Fred Reichheld",
    framework: "NPS & Loyalty Loops",
    principle:
      "Net Promoter Score works only as a system, not a number. The loop — ask, categorise, close — is what drives growth.",
    applyWhen: ["measurement", "advocacy", "retention", "voc"],
    stageRelevance: ["customer"],
    citationExample:
      "Fred Reichheld, who created NPS, emphasises: the score is meaningless without closing the loop. Every detractor response needs a human follow-up.",
  },

  // ── Israeli & Regional Practitioners ─────────────────────
  {
    id: "shaked_startup_cx",
    expert: "Keren Shaked",
    framework: "Practical CX for Startups",
    principle:
      "CX doesn't require a CX team to start. Founders who speak the language of revenue, churn, and growth — not 'satisfaction' — build better customer journeys from day one.",
    applyWhen: ["startup_cx", "onboarding", "simplification", "journey_mapping", "churn_prevention"],
    stageRelevance: ["both"],
    citationExample:
      "Keren Shaked's approach: before building a CX process, ask what the customer actually needs to succeed — not what you think looks like good service.",
  },

  // ── Disruptors ────────────────────────────────────────────
  {
    id: "gingiss_experience_maker",
    expert: "Dan Gingiss",
    framework: "The Experience Maker",
    principle:
      "Small things done remarkably well create fans. Delight doesn't require grand gestures — it requires consistent, thoughtful details.",
    applyWhen: ["delight_moments", "advocacy", "onboarding"],
    stageRelevance: ["customer"],
    citationExample:
      "Dan Gingiss's Experience Maker philosophy: the shareable moment here isn't expensive — it's a small, thoughtful detail that customers talk about.",
  },
  {
    id: "swinscoe_punk_cx",
    expert: "Adrian Swinscoe",
    framework: "Punk CX / Simplification",
    principle:
      "Cut the noise, focus on human-to-human basics. More process doesn't mean better CX — sometimes less is dramatically more.",
    applyWhen: ["simplification", "onboarding", "service_culture"],
    stageRelevance: ["both"],
    citationExample:
      'Adrian Swinscoe\'s "Punk CX" approach would say: strip this back. You don\'t need a 12-step process — you need 3 things done brilliantly.',
  },
  {
    id: "nir_eyal_hook",
    expert: "Nir Eyal",
    framework: "Hook Model (Habit Formation)",
    principle:
      "Product stickiness comes from trigger → action → variable reward → investment loops. Build habits, not just features.",
    applyWhen: ["onboarding", "retention", "decision_science", "expansion"],
    stageRelevance: ["customer"],
    citationExample:
      "Nir Eyal's Hook Model applies here: the trigger is set, but there's no variable reward. Without it, the habit loop breaks and churn follows.",
  },
];

// ============================================
// Selection Functions
// ============================================

/**
 * Get frameworks relevant to specific contexts.
 * Used to inject only the most relevant frameworks into prompts,
 * keeping token count manageable.
 */
export function getFrameworksByContext(
  contexts: FrameworkContext[]
): InfluencerFramework[] {
  return CX_FRAMEWORKS.filter((f) =>
    f.applyWhen.some((ctx) => contexts.includes(ctx))
  );
}

/**
 * Get frameworks relevant to a specific stage type.
 */
export function getFrameworksByStage(
  stageType: "sales" | "customer"
): InfluencerFramework[] {
  return CX_FRAMEWORKS.filter(
    (f) =>
      f.stageRelevance.includes(stageType) ||
      f.stageRelevance.includes("both")
  );
}

/**
 * Get the most relevant frameworks for a company's context.
 * Selects based on their pain points + maturity + stage.
 * Returns max 6 to keep prompt size reasonable.
 */
export function getRelevantFrameworks(
  painPoints: string[],
  companyStage: "early" | "growing" | "established",
  journeyType: "sales" | "customer" | "full_lifecycle"
): InfluencerFramework[] {
  // Map pain points to framework contexts
  const contextMap: Record<string, FrameworkContext[]> = {
    churn: ["churn_prevention", "retention", "measurement"],
    onboarding: ["onboarding", "simplification"],
    sales_handoff: ["handoff", "journey_mapping"],
    support_quality: ["support", "service_culture"],
    no_measurement: ["measurement", "voc"],
    scaling_cx: ["leadership", "employee_experience", "service_culture"],
    customer_feedback: ["voc", "measurement"],
    expansion: ["expansion", "advocacy", "decision_science"],
    advocacy: ["advocacy", "delight_moments"],
    automation: ["automation"],
    journey_gaps: ["journey_mapping"],
  };

  const contexts: FrameworkContext[] = [];
  for (const pain of painPoints) {
    const mapped = contextMap[pain];
    if (mapped) contexts.push(...mapped);
  }

  // Always include measurement and journey_mapping — universally relevant
  if (!contexts.includes("measurement")) contexts.push("measurement");
  if (!contexts.includes("journey_mapping")) contexts.push("journey_mapping");

  // Early-stage → add simplification + onboarding + startup_cx
  if (companyStage === "early") {
    contexts.push("simplification", "onboarding", "startup_cx");
  }

  // Growing → add leadership + employee_experience
  if (companyStage === "growing") {
    contexts.push("leadership", "employee_experience");
  }

  // Established → add automation + voc
  if (companyStage === "established") {
    contexts.push("automation", "voc");
  }

  // Get matching frameworks
  const matching = getFrameworksByContext([...new Set(contexts)]);

  // Filter by stage relevance
  const stageFilter = journeyType === "sales" ? "sales" : "customer";
  const stageFiltered =
    journeyType === "full_lifecycle"
      ? matching
      : matching.filter(
          (f) =>
            f.stageRelevance.includes(stageFilter) ||
            f.stageRelevance.includes("both")
        );

  // Deduplicate and limit to 8
  const seen = new Set<string>();
  const unique: InfluencerFramework[] = [];
  for (const f of stageFiltered) {
    if (!seen.has(f.id)) {
      seen.add(f.id);
      unique.push(f);
    }
  }

  return unique.slice(0, 8);
}

/**
 * Build prompt context string for injection into Claude prompt.
 * Compact format — each framework is 2-3 lines.
 */
export function buildInfluencerPromptContext(
  frameworks: InfluencerFramework[]
): string {
  if (frameworks.length === 0) return "";

  const entries = frameworks
    .map(
      (f) =>
        `- **${f.expert} — ${f.framework}:** ${f.principle}\n  → Citation: "${f.citationExample}"`
    )
    .join("\n\n");

  return `## CX Expert Frameworks (Cite by Name)

You have access to these proven CX frameworks from recognised industry experts. When your analysis matches a framework, CITE the expert by name. This makes your insights more credible and actionable.

${entries}

**How to cite:** Weave expert names naturally into your insights and recommendations. Example: "Following Annette Franz's approach, the root cause here isn't the process — it's that no one asked WHY customers drop off at this stage." Don't force citations — only cite when genuinely relevant.`;
}
