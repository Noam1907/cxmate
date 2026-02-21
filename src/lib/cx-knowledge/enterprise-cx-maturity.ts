/**
 * Enterprise CX Maturity Benchmarks
 *
 * Source: Qualtrics XM Institute, "State of Customer Experience Management, 2025"
 * Survey: 223 CX practitioners at organizations with 1,000+ employees, Q1 2025
 *
 * Source: Gladly, "Customer Journey Mapping for SMBs: The Complete 2026 Guide"
 * Market data and SMB-specific CX statistics
 *
 * WHY THIS MATTERS FOR CX MATE:
 * If enterprises with unlimited budgets, dedicated CX teams, and mature processes
 * are struggling THIS much with CX — imagine how lost SMBs (5-300 employees) are.
 * This is the gap CX Mate fills: making enterprise-grade CX intelligence accessible
 * to companies that can't afford a CX department.
 */

// ============================================
// CX Maturity Distribution (Enterprise)
// ============================================

/**
 * Qualtrics XM Institute CX Maturity Model (5 stages)
 * Key insight: 65% of 1,000+ employee companies are stuck in the first two stages.
 * For SMBs (our target), the number is almost certainly higher — 80-90%+.
 */
export const CX_MATURITY_STAGES = {
  investigate: {
    label: "Investigate",
    description: "Exploring CX concepts, no formal program",
    enterprisePercent: 29,
    smbEstimate: "40-50%",
    smbContext:
      "Most SMBs don't even know CX is a discipline. They react to complaints.",
  },
  initiate: {
    label: "Initiate",
    description: "Starting to build CX practices, early efforts",
    enterprisePercent: 36,
    smbEstimate: "30-40%",
    smbContext:
      "Some SMBs start tracking NPS or CSAT but don't connect it to action.",
  },
  mobilize: {
    label: "Mobilize",
    description: "CX program gaining momentum, cross-functional alignment",
    enterprisePercent: 21,
    smbEstimate: "10-15%",
    smbContext:
      "A few SMBs have a Head of CS who champions CX, but they lack tools and data.",
  },
  scale: {
    label: "Scale",
    description: "CX embedded in operations, measurable impact",
    enterprisePercent: 11,
    smbEstimate: "3-5%",
    smbContext:
      "Rare for SMBs. These are the ones who figure it out early and win their market.",
  },
  embed: {
    label: "Embed",
    description: "CX is DNA of the organization, self-sustaining",
    enterprisePercent: 3,
    smbEstimate: "<1%",
    smbContext: "Almost nonexistent in SMBs. This is aspirational.",
  },
} as const;

// ============================================
// CX Competency Ratings (Enterprise)
// ============================================

/**
 * Six CX competencies rated by enterprise practitioners.
 * Values are percentages rating each competency as "Very strong".
 * Even the strongest competency (Lead) is only 10% "very strong".
 */
export const CX_COMPETENCY_RATINGS = {
  lead: {
    label: "Lead",
    description: "CX leadership, governance, and strategy",
    veryStrong: 10,
    somewhatStrong: 16,
    neither: 18,
    somewhatWeak: 22,
    veryWeak: 34,
    smbImplication:
      "If enterprise CEOs barely champion CX, SMB founders definitely don't — they're too busy with product and sales.",
  },
  realize: {
    label: "Realize",
    description: "Demonstrating CX ROI and business impact",
    veryStrong: 11,
    somewhatStrong: 11,
    neither: 18,
    somewhatWeak: 17,
    veryWeak: 51,
    smbImplication:
      "51% of enterprises can't prove CX ROI. SMBs have zero chance without tools like CX Mate.",
  },
  activate: {
    label: "Activate",
    description: "Engaging employees in CX delivery",
    veryStrong: 7,
    somewhatStrong: 11,
    neither: 16,
    somewhatWeak: 27,
    veryWeak: 39,
    smbImplication:
      "SMBs have an advantage here — smaller teams = easier alignment. CX Mate makes this actionable.",
  },
  enlighten: {
    label: "Enlighten",
    description: "Generating and sharing CX insights",
    veryStrong: 7,
    somewhatStrong: 12,
    neither: 16,
    somewhatWeak: 29,
    veryWeak: 36,
    smbImplication:
      "Enterprise insight-sharing fails due to silos. SMBs can act on insights immediately — if they have them.",
  },
  respond: {
    label: "Respond",
    description: "Acting on CX insights and closing the loop",
    veryStrong: 6,
    somewhatStrong: 7,
    neither: 15,
    somewhatWeak: 34,
    veryWeak: 38,
    smbImplication:
      "Only 6% of enterprises respond well to CX insights. CX Mate's playbook IS the response mechanism for SMBs.",
  },
  disrupt: {
    label: "Disrupt",
    description: "Innovating CX based on insights",
    veryStrong: 5,
    somewhatStrong: 7,
    neither: 18,
    somewhatWeak: 34,
    veryWeak: 38,
    smbImplication:
      "Disruption requires seeing patterns. CX Mate shows SMBs patterns they'd never see on their own.",
  },
} as const;

// ============================================
// CX Obstacles (Enterprise)
// ============================================

/**
 * Top obstacles to improving CX at enterprise companies.
 * Percentages indicate how many practitioners cited each obstacle.
 */
export const CX_OBSTACLES = {
  competingPriorities: {
    label: "Competing priorities",
    percent: 64,
    smbContext:
      "The #1 obstacle everywhere. For SMBs, CX competes with product, sales, fundraising, hiring. CX Mate must feel like it SAVES time, not costs time.",
  },
  poorIntegration: {
    label: "Poor integration across systems",
    percent: 49,
    smbContext:
      "Enterprises have too many systems that don't talk. SMBs often have NO systems. Both need a single source of CX truth.",
  },
  inconsistentBuyIn: {
    label: "Inconsistent executive buy-in",
    percent: 41,
    smbContext:
      "At SMBs, the exec IS the founder. If they don't see value in 5 minutes, CX is dead.",
  },
  limitedBudget: {
    label: "Limited budget / resources",
    percent: 38,
    smbContext:
      "If enterprises with millions struggle, SMBs need a near-free, self-service solution. That's CX Mate.",
  },
  roiDifficulty: {
    label: "Difficulty proving ROI",
    percent: 34,
    smbContext:
      "Only 17% of enterprises can specify monetary CX benefit. CX Mate must make ROI visible and immediate.",
  },
} as const;

// ============================================
// CX ROI Reality (Enterprise)
// ============================================

export const CX_ROI_DATA = {
  canSpecifyMonetaryBenefit: 17, // % of enterprises
  struggleToJustifyImpact: 57, // % of enterprises
  smbImplication:
    "If 83% of enterprises can't put a dollar figure on CX, SMBs are flying completely blind. CX Mate's impact projections (with transparent calculations) are a market differentiator.",
} as const;

// ============================================
// CX Technology / Skills / Culture (Enterprise)
// ============================================

export const CX_CAPABILITY_RATINGS = {
  technology: {
    veryStrong: 13,
    somewhatStrong: 35,
    neither: 28,
    weak: 24,
    smbContext:
      "Only 13% of enterprises rate their CX tech as 'very strong'. SMBs don't even have CX-specific tech.",
  },
  skills: {
    veryStrong: 13,
    somewhatStrong: 37,
    neither: 31,
    weak: 19,
    smbContext:
      "CX skills are rare and expensive. SMBs can't hire CX specialists. They need an AI co-pilot instead.",
  },
  culture: {
    veryStrong: 18,
    somewhatStrong: 33,
    neither: 26,
    weak: 23,
    smbContext:
      "Culture is actually where SMBs can win. Small teams can align fast — they just need the framework.",
  },
} as const;

// ============================================
// AI in CX (Enterprise Adoption)
// ============================================

export const AI_IN_CX = {
  implementingAI: 88, // % of enterprises
  topActions: {
    dataSecurityPrivacy: 63,
    clearAIStandards: 60,
    experimentingWithAI: 51,
  },
  aiSolutions: {
    chatbots: 47,
    aiAnalytics: 31,
    languageTranslation: 30,
    knowledgeManagement: 30,
    contentGeneration: 19,
    productDevTools: 17,
    recommendationEngines: 13,
  },
  smbImplication:
    "88% of enterprises are experimenting with AI for CX, but only 13% have recommendation engines. CX Mate delivers the recommendation engine that even enterprises don't have — and makes it accessible to a 20-person startup.",
} as const;

// ============================================
// CX Leadership & Governance (Enterprise)
// ============================================

export const CX_LEADERSHIP = {
  ceoChampion: {
    veryStrongly: 23,
    strongly: 49,
    weakly: 21,
    veryWeakly: 4,
    notAtAll: 3,
  },
  leadersVsLaggards: {
    ceoVeryStrongly_leaders: 38,
    ceoVeryStrongly_laggards: 15,
    insight:
      "CX leaders are 2.5x more likely to have strong CEO champions. For SMBs, the founder IS the CEO — if CX Mate can convince the founder in 5 minutes, the whole company aligns.",
  },
  cxCoordination: {
    centralized: 28,
    significantWithCoordination: 25,
    significantMinimalCoordination: 35,
    limited: 12,
  },
} as const;

// ============================================
// SMB-Specific CX Statistics (from Gladly 2026)
// ============================================

export const SMB_CX_STATS = {
  repeatRevenue: {
    stat: "61% of small businesses say over half their revenue comes from repeat customers",
    implication:
      "CX isn't optional for SMBs — it's their revenue engine. Losing existing customers is existential.",
  },
  retentionProfit: {
    stat: "Increasing customer retention by just 5% can boost profits by 25-95%",
    implication:
      "This is the ROI story CX Mate needs to tell. Small improvements in CX → massive profit impact.",
  },
  retentionVsCostCutting: {
    stat: "A 2% increase in customer retention has the same impact as reducing costs by 10%",
    implication: "CX investment > cost-cutting. Frame CX Mate as growth tool, not cost center.",
  },
  badExperienceSwitching: {
    stat: "72% of customers switch to a competitor after just one bad experience",
    implication:
      "For SMBs with 50-200 customers, one bad moment can mean losing 5-10% of revenue. Every moment matters.",
  },
  conversionExistingVsNew: {
    newProspect: "5-20%",
    existingCustomer: "60-70%",
    implication:
      "Selling to existing customers is 3-14x easier. CX Mate helps SMBs maximize their existing customer potential.",
  },
  repurchaseEscalation: {
    afterFirst: 27,
    afterSecond: 49,
    afterThird: 62,
    implication:
      "The first three purchases are the critical CX window. CX Mate should highlight this in journey maps.",
  },
  omnichannel: {
    stat: "75% of customers expect consistent experience across multiple channels",
    implication:
      "Even SMBs can't ignore omnichannel. CX Mate helps them be consistent where it matters most.",
  },
  journeyMappingMarket: {
    market2025: "$16.8 billion",
    market2035: "$76.2 billion projected",
    smbShare: "56.8%",
    implication:
      "SMBs are the majority of the journey mapping market. CX Mate is positioned right in the growth center.",
  },
} as const;

// ============================================
// The CX Mate Thesis (connecting it all)
// ============================================

export const CX_MATE_THESIS = {
  headline: "The Enterprise CX Gap Proves the SMB Opportunity",
  summary: `
    Enterprise companies (1,000+ employees) with dedicated CX teams, millions in budget,
    and mature processes STILL can't get CX right:
    - 65% are stuck in the first two maturity stages
    - Only 17% can prove CX ROI
    - Only 13% have recommendation engines
    - 64% say competing priorities block CX progress

    If enterprises are this far behind, SMBs (5-300 employees) are in an even worse position.
    They have no CX team, no CX budget, no CX tools, and no CX methodology.

    CX Mate is the AI co-pilot that gives SMBs enterprise-grade CX intelligence
    in 5 minutes, for a fraction of the cost, with zero CX expertise required.

    The market validates this: journey mapping software is projected to grow from
    $16.8B to $76.2B by 2035, with SMBs representing 56.8% of the market.
  `,
} as const;
