"use client";

import { Badge } from "@/components/ui/badge";
import { JourneyStageCard } from "./journey-stage-card";
import { ConfrontationPanel } from "./confrontation-panel";
import { CxToolRoadmap } from "./cx-tool-roadmap";
import { ImpactProjections } from "./impact-projections";
import type { GeneratedJourney } from "@/lib/ai/journey-prompt";

interface JourneyMapProps {
  journey: GeneratedJourney;
}

export function JourneyMap({ journey }: JourneyMapProps) {
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

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
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

      {/* v2: Confrontation Panel — "Here's what you're getting wrong" */}
      {journey.confrontationInsights && journey.confrontationInsights.length > 0 && (
        <ConfrontationPanel insights={journey.confrontationInsights} />
      )}

      {/* Sales stages */}
      {salesStages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-blue-200" />
            <span className="text-sm font-semibold text-blue-700 px-3">
              Sales Journey
            </span>
            <div className="h-px flex-1 bg-blue-200" />
          </div>
          <div className="space-y-6">
            {salesStages.map((stage, i) => (
              <JourneyStageCard
                key={i}
                stage={stage}
                index={i}
                isLast={i === salesStages.length - 1 && customerStages.length === 0}
              />
            ))}
          </div>
        </div>
      )}

      {/* Handoff indicator */}
      {salesStages.length > 0 && customerStages.length > 0 && (
        <div className="flex items-center gap-2 py-2">
          <div className="h-px flex-1 bg-gradient-to-r from-blue-200 to-emerald-200" />
          <span className="text-xs font-semibold text-muted-foreground px-3 py-1 rounded-full border bg-background">
            Sales to Customer Handoff
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-emerald-200 to-emerald-200" />
        </div>
      )}

      {/* Customer stages */}
      {customerStages.length > 0 && (
        <div className="space-y-4">
          {salesStages.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-emerald-200" />
              <span className="text-sm font-semibold text-emerald-700 px-3">
                Customer Journey
              </span>
              <div className="h-px flex-1 bg-emerald-200" />
            </div>
          )}
          <div className="space-y-6">
            {customerStages.map((stage, i) => (
              <JourneyStageCard
                key={i}
                stage={stage}
                index={salesStages.length + i}
                isLast={i === customerStages.length - 1}
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
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
            <span className="text-sm font-semibold text-slate-500 px-3">
              CX Intelligence
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
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
