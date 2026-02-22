// ============================================
// Journey Templates & Meaningful Moments (existing)
// ============================================
export {
  SALES_STAGES,
  CUSTOMER_STAGES,
  FULL_LIFECYCLE_STAGES,
  getDefaultStages,
  type StageTemplate,
} from "./journey-templates";

export {
  SALES_MOMENTS,
  CUSTOMER_MOMENTS,
  getDefaultMoments,
  type MomentTemplate,
} from "./meaningful-moments";

export { VERTICALS, BUSINESS_MODELS, INDUSTRY_VERTICALS, getVertical, type VerticalConfig, type BusinessModelConfig } from "./verticals";

// ============================================
// CX Theory Engine (Layer 3)
// ============================================
export {
  DECISION_CYCLE,
  DECISION_DIAGNOSES,
  getDecisionStage,
  getPriceRelevance,
  diagnoseSalesProblem,
  type DecisionStage,
  type DecisionStageProfile,
  type DecisionDiagnosis,
} from "./buyer-decision-cycle";

export {
  LIFECYCLE_PHASES,
  LIFECYCLE_ANTI_PATTERNS,
  getLifecyclePhase,
  getAntiPatternsForPhase,
  assessSignal,
  type LifecyclePhase,
  type LifecyclePhaseProfile,
  type LifecycleAntiPattern,
} from "./customer-lifecycle-science";

export {
  ALL_FAILURE_PATTERNS,
  getFailurePatternsByPhase,
  getFailurePatternsByStage,
  getCriticalPatterns,
  getFailurePattern,
  type FailurePattern,
} from "./failure-patterns";

export {
  ALL_SUCCESS_PATTERNS,
  getSuccessPatternsByPhase,
  getSuccessPatternsByStage,
  getQuickWins,
  getHighImpactPatterns,
  getSuccessPattern,
  type SuccessPattern,
} from "./success-patterns";

// ============================================
// CX Tools (Layer 5)
// ============================================
export {
  MEASUREMENT_TOOLS,
  getToolsForStage,
  getMeasurementTool,
  getToolsByEase,
  type MeasurementTool,
  type MeasurementToolType,
  type ToolRecommendation,
} from "./cx-tools/measurement-tools";

// ============================================
// Impact Models (Layer 6)
// ============================================
export {
  VERTICAL_BENCHMARKS,
  SIZE_BENCHMARKS,
  getVerticalBenchmark,
  getSizeBenchmark,
  getBlendedBenchmark,
  type VerticalBenchmark,
  type SizeBenchmark,
  type BenchmarkMetrics,
} from "./impact-models/benchmarks";

export {
  calculateChurnReductionImpact,
  calculateOnboardingImpact,
  calculateConversionImpact,
  calculateExpansionImpact,
  generateQuickImpactEstimates,
  formatCurrency,
  formatImpactRange,
  type CompanyProfile,
  type ImpactEstimate,
} from "./impact-models/impact-calculator";

// ============================================
// Enterprise CX Maturity Benchmarks (Qualtrics 2025 + Gladly 2026)
// ============================================
export {
  CX_MATURITY_STAGES,
  CX_COMPETENCY_RATINGS,
  CX_OBSTACLES,
  CX_ROI_DATA,
  CX_CAPABILITY_RATINGS,
  AI_IN_CX,
  CX_LEADERSHIP,
  SMB_CX_STATS,
  CX_MATE_THESIS,
} from "./enterprise-cx-maturity";

// ============================================
// Best Practice Foundations (Mode A)
// ============================================
export {
  CX_FOUNDATIONS,
  STAGE_GUIDANCE,
  getFoundationsByPriority,
  getFoundationsForStage,
  getStageGuidance,
  getMistakesForStage,
  type FoundationElement,
  type StageGuidance,
  type MaturityStage,
} from "./best-practice-foundations";
