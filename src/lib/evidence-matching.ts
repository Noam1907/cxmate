/**
 * Evidence Matching Engine
 *
 * Connects onboarding input (pain points, competitors, biggest challenge)
 * to generated journey elements (insights, moments, impact projections).
 *
 * Strategy:
 * 1. AI-tagged matches (new journeys with addressesPainPoints fields)
 * 2. Fuzzy keyword fallback (existing journeys without explicit tags)
 * 3. Competitor name matching (string includes)
 */

import type { OnboardingData, CompanyMaturity } from "@/types/onboarding";
import { getPainPointsForMaturity } from "@/types/onboarding";
import type {
  GeneratedJourney,
  ConfrontationInsight,
  GeneratedMoment,
  GeneratedStage,
} from "@/lib/ai/journey-prompt";

// ============================================
// Types
// ============================================

export interface PainPointMapping {
  painPointKey: string;
  painPointLabel: string;
  category: string;
  matchedInsights: string[]; // insight pattern names
  matchedMoments: { stage: string; moment: string }[];
  matchedImpact: string[]; // impact area names
}

export interface CompetitorMapping {
  competitor: string;
  mentionedInInsights: string[];
  differentiationMoments: { stage: string; moment: string; context: string }[];
}

export interface BiggestChallengeMapping {
  challenge: string;
  relatedInsights: string[];
  relatedMoments: { stage: string; moment: string }[];
}

export interface EvidenceMap {
  painPointMappings: PainPointMapping[];
  competitorMappings: CompetitorMapping[];
  biggestChallengeMapping: BiggestChallengeMapping;
  unmatchedPainPoints: string[];
  coverage: {
    painPointsCovered: number;
    painPointsTotal: number;
    competitorMentions: number;
    totalMomentLinks: number;
  };
}

// ============================================
// Keyword Sets for Fuzzy Matching
// ============================================

const PAIN_POINT_KEYWORDS: Record<string, string[]> = {
  // Pre-launch
  no_sales_process: ["sales process", "sales pipeline", "sales structure", "deal flow"],
  unclear_value_prop: ["value prop", "value proposition", "messaging", "positioning", "differentiat"],
  unknown_buyer_journey: ["buyer journey", "buying journey", "decision process", "evaluation"],
  losing_deals: ["losing deals", "lost deals", "win rate", "close rate", "competitive loss"],
  no_competitive_edge: ["competitive", "competitor", "differentiat", "stand out", "unique"],
  pricing_uncertainty: ["pricing", "price", "package", "tier", "monetiz"],
  // First customers
  messy_onboarding: ["onboarding", "onboard", "setup", "getting started", "welcome"],
  unclear_value: ["value realization", "time to value", "getting value", "adoption", "activation"],
  inconsistent_process: ["inconsistent", "ad hoc", "different every time", "no process", "manual"],
  worried_about_losing: ["losing customers", "churn", "cancel", "at-risk", "retention"],
  no_feedback_loop: ["feedback", "satisfaction", "happy", "struggling", "survey", "nps", "csat"],
  support_overwhelm: ["support", "ticket", "handholding", "overwhelm", "reactive"],
  expansion_unknown: ["upsell", "expansion", "cross-sell", "grow revenue", "upgrade"],
  // Growing
  churn: ["churn", "attrition", "leaving", "cancel", "retention", "at-risk", "lost customer"],
  handoff_gaps: ["handoff", "hand-off", "transition", "sales to cs", "sales to customer success"],
  onboarding_too_long: ["onboarding time", "onboarding duration", "slow onboarding", "lose interest"],
  implementation_fails: ["implementation", "never fully", "adoption", "not using", "underutiliz"],
  no_visibility: ["visibility", "health score", "no insight", "blind spot", "can't see"],
  no_playbook: ["playbook", "documented process", "team follows", "standardiz", "best practice"],
  reactive_support: ["reactive", "firefight", "proactive", "ahead of problems", "early warning"],
  // Scaling
  inconsistent_cx: ["inconsistent", "across the team", "varies by", "standardiz", "quality"],
  late_risk_detection: ["risk detection", "early warning", "at-risk", "identify risk", "predict"],
  onboarding_scale: ["scale onboarding", "onboarding doesn't scale", "manual steps", "automat"],
  no_unified_view: ["unified view", "single view", "lifecycle view", "customer 360", "scattered"],
  expansion_missed: ["expansion", "upsell", "cross-sell", "revenue growth", "systematic"],
  data_silos: ["data silo", "scattered", "disconnected", "fragmented", "multiple tools"],
};

// ============================================
// Core Matching Functions
// ============================================

function textContainsKeywords(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw.toLowerCase()));
}

function getMomentPainPoints(
  moment: GeneratedMoment,
  painPointKeys: string[],
  painLabelToKey?: Map<string, string>,
): string[] {
  // 1. AI-tagged matches (preferred)
  if (moment.addressesPainPoints && moment.addressesPainPoints.length > 0) {
    const matched: string[] = [];
    for (const pp of moment.addressesPainPoints) {
      // Check direct key match (backward compat)
      if (painPointKeys.includes(pp)) {
        matched.push(pp);
      }
      // Check label → key resolution (new prompt format)
      else if (painLabelToKey) {
        const resolvedKey = painLabelToKey.get(pp.toLowerCase());
        if (resolvedKey && painPointKeys.includes(resolvedKey)) {
          matched.push(resolvedKey);
        } else {
          // Fuzzy: check if AI tag contains any label substring
          for (const [label, key] of painLabelToKey.entries()) {
            if (pp.toLowerCase().includes(label) || label.includes(pp.toLowerCase())) {
              if (painPointKeys.includes(key) && !matched.includes(key)) {
                matched.push(key);
              }
            }
          }
        }
      }
    }
    if (matched.length > 0) return matched;
  }

  // 2. Fuzzy keyword fallback
  const searchText = [
    moment.name,
    moment.description,
    moment.diagnosis || "",
    moment.impactIfIgnored || "",
    ...(moment.recommendations || []),
  ].join(" ");

  return painPointKeys.filter((key) => {
    const keywords = PAIN_POINT_KEYWORDS[key];
    return keywords && textContainsKeywords(searchText, keywords);
  });
}

function getInsightPainPoints(
  insight: ConfrontationInsight,
  painPointKeys: string[],
  painLabelToKey?: Map<string, string>,
): string[] {
  // 1. AI-tagged matches
  if (insight.addressesPainPoints && insight.addressesPainPoints.length > 0) {
    const matched: string[] = [];
    for (const pp of insight.addressesPainPoints) {
      if (painPointKeys.includes(pp)) {
        matched.push(pp);
      } else if (painLabelToKey) {
        const resolvedKey = painLabelToKey.get(pp.toLowerCase());
        if (resolvedKey && painPointKeys.includes(resolvedKey)) {
          matched.push(resolvedKey);
        } else {
          for (const [label, key] of painLabelToKey.entries()) {
            if (pp.toLowerCase().includes(label) || label.includes(pp.toLowerCase())) {
              if (painPointKeys.includes(key) && !matched.includes(key)) {
                matched.push(key);
              }
            }
          }
        }
      }
    }
    if (matched.length > 0) return matched;
  }

  // 2. Fuzzy fallback
  const searchText = [
    insight.pattern,
    insight.description,
    insight.businessImpact,
    insight.immediateAction,
    insight.companionAdvice || "",
  ].join(" ");

  return painPointKeys.filter((key) => {
    const keywords = PAIN_POINT_KEYWORDS[key];
    return keywords && textContainsKeywords(searchText, keywords);
  });
}

function getMomentCompetitorContext(
  moment: GeneratedMoment,
  competitors: string[],
): { competitor: string; context: string } | null {
  // 1. AI-tagged
  if (moment.competitorGap) {
    const matchedComp = competitors.find((c) =>
      moment.competitorGap!.toLowerCase().includes(c.toLowerCase())
    );
    if (matchedComp) {
      return { competitor: matchedComp, context: moment.competitorGap };
    }
    // competitorGap exists but doesn't name a specific competitor from the list
    return { competitor: competitors[0] || "competitor", context: moment.competitorGap };
  }

  // 2. Fuzzy: check if any competitor name appears in moment text
  const searchText = [
    moment.name,
    moment.description,
    moment.diagnosis || "",
    moment.actionTemplate || "",
  ].join(" ");

  for (const comp of competitors) {
    if (searchText.toLowerCase().includes(comp.toLowerCase())) {
      return { competitor: comp, context: `Mentioned in context of "${moment.name}"` };
    }
  }

  return null;
}

function getInsightCompetitorContext(
  insight: ConfrontationInsight,
  competitors: string[],
): string | null {
  // 1. AI-tagged
  if (insight.competitorContext) return insight.competitorContext;

  // 2. Fuzzy
  const searchText = [
    insight.pattern,
    insight.description,
    insight.businessImpact,
    insight.companionAdvice || "",
  ].join(" ");

  for (const comp of competitors) {
    if (searchText.toLowerCase().includes(comp.toLowerCase())) {
      return `${comp} mentioned in "${insight.pattern}"`;
    }
  }

  return null;
}

// ============================================
// Main Builder
// ============================================

export function buildEvidenceMap(
  onboardingData: Partial<OnboardingData>,
  journey: GeneratedJourney,
): EvidenceMap {
  let painPointKeys = onboardingData.painPoints || [];
  const maturity = onboardingData.companyMaturity || "growing";
  const allPainOptions = getPainPointsForMaturity(maturity);
  const competitors = (onboardingData.competitors || "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  // Build pain point label/category lookup
  const painPointInfo = new Map(
    allPainOptions.map((pp) => [pp.value, { label: pp.label, category: pp.category }])
  );

  // Build label → key reverse lookup (for matching AI-generated label tags back to keys)
  const painLabelToKey = new Map<string, string>(
    allPainOptions.map((pp) => [pp.label.toLowerCase(), pp.value])
  );

  // Initialize pain point mappings
  const painMap = new Map<string, PainPointMapping>();
  for (const key of painPointKeys) {
    const info = painPointInfo.get(key) || { label: key, category: "unknown" };
    painMap.set(key, {
      painPointKey: key,
      painPointLabel: info.label,
      category: info.category,
      matchedInsights: [],
      matchedMoments: [],
      matchedImpact: [],
    });
  }

  // Add custom pain point as its own entry (user-typed free text)
  const customPain = onboardingData.customPainPoint?.trim();
  const CUSTOM_PAIN_KEY = "_custom";
  if (customPain) {
    painMap.set(CUSTOM_PAIN_KEY, {
      painPointKey: CUSTOM_PAIN_KEY,
      painPointLabel: customPain,
      category: "custom",
      matchedInsights: [],
      matchedMoments: [],
      matchedImpact: [],
    });
    // Also add custom pain text to the label→key reverse lookup so AI tags can match
    painLabelToKey.set(customPain.toLowerCase(), CUSTOM_PAIN_KEY);
    // Add the custom key to painPointKeys so matching functions include it
    painPointKeys = [...painPointKeys, CUSTOM_PAIN_KEY];
    // Build custom keywords from the user's text (words > 3 chars)
    const customKeywords = customPain.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    if (customKeywords.length > 0) {
      PAIN_POINT_KEYWORDS[CUSTOM_PAIN_KEY] = customKeywords;
    }
  }

  // Initialize competitor mappings
  const compMap = new Map<string, CompetitorMapping>();
  for (const comp of competitors) {
    compMap.set(comp, {
      competitor: comp,
      mentionedInInsights: [],
      differentiationMoments: [],
    });
  }

  // Match insights
  for (const insight of journey.confrontationInsights || []) {
    const matchedPains = getInsightPainPoints(insight, painPointKeys, painLabelToKey);
    for (const painKey of matchedPains) {
      painMap.get(painKey)?.matchedInsights.push(insight.pattern);
    }

    // Competitor matching
    const compContext = getInsightCompetitorContext(insight, competitors);
    if (compContext) {
      for (const comp of competitors) {
        if (compContext.toLowerCase().includes(comp.toLowerCase())) {
          compMap.get(comp)?.mentionedInInsights.push(insight.pattern);
        }
      }
    }
  }

  // Match moments across stages
  for (const stage of journey.stages || []) {
    for (const moment of stage.meaningfulMoments || []) {
      const matchedPains = getMomentPainPoints(moment, painPointKeys, painLabelToKey);
      for (const painKey of matchedPains) {
        painMap.get(painKey)?.matchedMoments.push({
          stage: stage.name,
          moment: moment.name,
        });
      }

      // Competitor matching
      const compMatch = getMomentCompetitorContext(moment, competitors);
      if (compMatch) {
        compMap.get(compMatch.competitor)?.differentiationMoments.push({
          stage: stage.name,
          moment: moment.name,
          context: compMatch.context,
        });
      }
    }
  }

  // Match impact projections
  for (const impact of journey.impactProjections || []) {
    const searchText = [impact.area, impact.potentialImpact, impact.calculation || ""].join(" ");
    for (const key of painPointKeys) {
      const keywords = PAIN_POINT_KEYWORDS[key];
      if (keywords && textContainsKeywords(searchText, keywords)) {
        painMap.get(key)?.matchedImpact.push(impact.area);
      }
    }
  }

  // Build biggest challenge mapping
  const challenge = onboardingData.biggestChallenge || "";
  const challengeMapping: BiggestChallengeMapping = {
    challenge,
    relatedInsights: [],
    relatedMoments: [],
  };

  if (challenge) {
    const challengeWords = challenge.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    for (const insight of journey.confrontationInsights || []) {
      const text = `${insight.pattern} ${insight.description}`.toLowerCase();
      if (challengeWords.some((w) => text.includes(w))) {
        challengeMapping.relatedInsights.push(insight.pattern);
      }
    }
    for (const stage of journey.stages || []) {
      for (const moment of stage.meaningfulMoments || []) {
        const text = `${moment.name} ${moment.description}`.toLowerCase();
        if (challengeWords.some((w) => text.includes(w))) {
          challengeMapping.relatedMoments.push({
            stage: stage.name,
            moment: moment.name,
          });
        }
      }
    }
  }

  // Clean up temporary custom pain keyword entry from global map
  if (customPain && PAIN_POINT_KEYWORDS[CUSTOM_PAIN_KEY]) {
    delete PAIN_POINT_KEYWORDS[CUSTOM_PAIN_KEY];
  }

  // Compute coverage
  const painMappings = Array.from(painMap.values());
  const compMappings = Array.from(compMap.values());
  const covered = painMappings.filter(
    (p) => p.matchedInsights.length > 0 || p.matchedMoments.length > 0
  );
  const totalMomentLinks = painMappings.reduce(
    (sum, p) => sum + p.matchedMoments.length,
    0
  );
  const competitorMentions = compMappings.reduce(
    (sum, c) => sum + c.mentionedInInsights.length + c.differentiationMoments.length,
    0
  );

  return {
    painPointMappings: painMappings,
    competitorMappings: compMappings,
    biggestChallengeMapping: challengeMapping,
    unmatchedPainPoints: painMappings
      .filter((p) => p.matchedInsights.length === 0 && p.matchedMoments.length === 0)
      .map((p) => p.painPointKey),
    coverage: {
      painPointsCovered: covered.length,
      painPointsTotal: painPointKeys.length,
      competitorMentions,
      totalMomentLinks,
    },
  };
}

// ============================================
// Helpers for inline annotations
// ============================================

/**
 * Get pain point labels that a specific moment addresses.
 * Used for inline badges on journey map and playbook.
 */
export function getMomentAnnotations(
  stageName: string,
  momentName: string,
  evidenceMap: EvidenceMap,
): { painPoints: string[]; competitorGaps: string[] } {
  const painPoints: string[] = [];
  const competitorGaps: string[] = [];

  for (const mapping of evidenceMap.painPointMappings) {
    if (mapping.matchedMoments.some((m) => m.stage === stageName && m.moment === momentName)) {
      painPoints.push(mapping.painPointLabel);
    }
  }

  for (const mapping of evidenceMap.competitorMappings) {
    const match = mapping.differentiationMoments.find(
      (m) => m.stage === stageName && m.moment === momentName
    );
    if (match) {
      competitorGaps.push(`vs ${mapping.competitor}`);
    }
  }

  return { painPoints, competitorGaps };
}

/**
 * Get pain point labels that a specific insight addresses.
 * Used for inline badges on confrontation/dashboard.
 */
export function getInsightAnnotations(
  insightPattern: string,
  evidenceMap: EvidenceMap,
): { painPoints: string[]; competitorContext: string | null } {
  const painPoints: string[] = [];
  let competitorContext: string | null = null;

  for (const mapping of evidenceMap.painPointMappings) {
    if (mapping.matchedInsights.includes(insightPattern)) {
      painPoints.push(mapping.painPointLabel);
    }
  }

  for (const mapping of evidenceMap.competitorMappings) {
    if (mapping.mentionedInInsights.includes(insightPattern)) {
      competitorContext = `vs ${mapping.competitor}`;
      break;
    }
  }

  return { painPoints, competitorContext };
}
