"use client";

import { Badge } from "@/components/ui/badge";
import { JourneyStageCard } from "./journey-stage-card";
import { ConfrontationPanel } from "./confrontation-panel";
import { CxToolRoadmap } from "./cx-tool-roadmap";
import { ImpactProjections } from "./impact-projections";
import type { GeneratedJourney } from "@/lib/ai/journey-prompt";
import { getMomentAnnotations, type EvidenceMap } from "@/lib/evidence-matching";
import type { MomentAnnotation } from "./journey-stage-card";

interface JourneyMapProps {
  journey: GeneratedJourney;
  evidenceMap?: EvidenceMap | null;
}

export function JourneyMap({ journey, evidenceMap }: JourneyMapProps) {
  const salesStages = journey.stages.filter((s) => s.stageType === "sales");
  const customerStages = journey.stages.filter(
    (s) => s.stageType === "customer"
  );

  const totalMoments = journey.stages.reduce(
    (sum, s) => sum + s.meaningfulMoments.length,
    0
  );
  const criticalMoments = journey.stages.reduce(
    (sum, s) =>
      sum +
      s.meaningfulMoments.filter((m) => m.severity === "critical").length,
    0
  );

  const hasV2Intelligence =
    journey.confrontationInsights ||
    journey.cxToolRoadmap ||
    journey.impactProjections ||
    journey.maturityAssessment;

  // Build per-stage annotation maps for inline evidence badges
  function getStageAnnotations(stageName: string, moments: { name: string }[]): Record<string, MomentAnnotation> | undefined {
    if (!evidenceMap) return undefined;
    const annotations: Record<string, MomentAnnotation> = {};
    let hasAny = false;
    for (const moment of moments) {
      const ann = getMomentAnnotations(stageName, moment.name, evidenceMap);
      if (ann.painPoints.length > 0 || ann.competitorGaps.length > 0) {
        annotations[moment.name] = ann;
        hasAny = true;
      }
    }
    return hasAny ? annotations : undefined;
  }

  // Compute per-stage health (% of critical/high moments)
  const stageHealth = journey.stages.map((stage) => {
    const total = stage.meaningfulMoments.length;
    const critical = stage.meaningfulMoments.filter(
      (m) => m.severity === "critical" || m.severity === "high"
    ).length;
    const pct = total > 0 ? Math.round((critical / total) * 100) : 0;
    return { name: stage.name, stageType: stage.stageType, critical, total, pct };
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">{journey.name}</h1>
        <div className="flex items-center justify-center gap-3">
          <Badge variant="outline">
            {journey.stages.length} stages
          </Badge>
          <Badge variant="outline">
            {totalMoments} moments
          </Badge>
          {criticalMoments > 0 && (
            <Badge variant="destructive">
              {criticalMoments} critical
            </Badge>
          )}
          {hasV2Intelligence && (
            <Badge variant="secondary">
              AI-diagnosed
            </Badge>
          )}
        </div>
      </div>

      {/* Stage health overview bar */}
      <div className="rounded-xl border bg-white p-5">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
          Risk by Stage
        </div>
        <div className="space-y-3">
          {stageHealth.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-28 text-xs text-slate-500 truncate text-right shrink-0">
                {s.name}
              </div>
              <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-slate-800 transition-all duration-700"
                  style={{ width: `${Math.max(s.pct, 4)}%` }}
                />
              </div>
              <div className="w-16 text-xs text-slate-400 shrink-0">
                {s.critical}/{s.total} risky
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* v2: Confrontation Panel — "Here's what you're getting wrong" */}
      {journey.confrontationInsights && journey.confrontationInsights.length > 0 && (
        <ConfrontationPanel insights={journey.confrontationInsights} />
      )}

      {/* Sales stages */}
      {salesStages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-semibold text-slate-400 px-3 uppercase tracking-wide">
              Sales Journey
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          <div className="space-y-6">
            {salesStages.map((stage, i) => (
              <JourneyStageCard
                key={i}
                stage={stage}
                index={i}
                isLast={i === salesStages.length - 1 && customerStages.length === 0}
                momentAnnotations={getStageAnnotations(stage.name, stage.meaningfulMoments)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Handoff indicator */}
      {salesStages.length > 0 && customerStages.length > 0 && (
        <div className="flex items-center gap-2 py-2">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-semibold text-slate-400 px-3 py-1 rounded-full border border-slate-200 bg-white uppercase tracking-wide">
            Handoff
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>
      )}

      {/* Customer stages */}
      {customerStages.length > 0 && (
        <div className="space-y-4">
          {salesStages.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-semibold text-slate-400 px-3 uppercase tracking-wide">
                Customer Journey
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
          )}
          <div className="space-y-6">
            {customerStages.map((stage, i) => (
              <JourneyStageCard
                key={i}
                stage={stage}
                index={salesStages.length + i}
                isLast={i === customerStages.length - 1}
                momentAnnotations={getStageAnnotations(stage.name, stage.meaningfulMoments)}
              />
            ))}
          </div>
        </div>
      )}

      {/* v2: Intelligence panels */}
      {hasV2Intelligence && (
        <>
          {/* Divider */}
          <div className="flex items-center gap-2 py-2">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-semibold text-slate-400 px-3 uppercase tracking-wide">
              CX Intelligence
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Impact Projections + Maturity Assessment */}
          <ImpactProjections
            projections={journey.impactProjections || []}
            maturityAssessment={journey.maturityAssessment}
          />

          {/* CX Tool Roadmap */}
          {journey.cxToolRoadmap && journey.cxToolRoadmap.length > 0 && (
            <CxToolRoadmap tools={journey.cxToolRoadmap} />
          )}
        </>
      )}
    </div>
  );
}
