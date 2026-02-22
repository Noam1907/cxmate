"use client";

import { JourneyStageCard } from "./journey-stage-card";
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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header — name only, no badge cluster */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">{journey.name}</h1>
        <p className="text-sm text-slate-400">
          {journey.stages.length} stages · {journey.stages.reduce((sum, s) => sum + s.meaningfulMoments.length, 0)} moments mapped
        </p>
      </div>

      {/* Sales stages */}
      {salesStages.length > 0 && (
        <div className="space-y-4">
          {salesStages.length > 0 && customerStages.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                Sales Journey
              </span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>
          )}
          <div className="space-y-4">
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
        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-slate-100" />
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest px-3 py-1 rounded-full border border-slate-200 bg-white">
            Handoff
          </span>
          <div className="h-px flex-1 bg-slate-100" />
        </div>
      )}

      {/* Customer stages */}
      {customerStages.length > 0 && (
        <div className="space-y-4">
          {salesStages.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                Customer Journey
              </span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>
          )}
          <div className="space-y-4">
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
    </div>
  );
}
