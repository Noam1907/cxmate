"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GeneratedStage, GeneratedMoment } from "@/lib/ai/journey-prompt";

export interface MomentAnnotation {
  painPoints: string[];
  competitorGaps: string[];
}

interface JourneyStageCardProps {
  stage: GeneratedStage;
  index: number;
  isLast: boolean;
  momentAnnotations?: Record<string, MomentAnnotation>;
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case "critical":
      return "bg-red-100 text-red-800 border-red-200";
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getMomentTypeIcon(type: string) {
  switch (type) {
    case "risk":
      return "!";
    case "delight":
      return "*";
    case "decision":
      return "?";
    case "handoff":
      return "=";
    default:
      return "-";
  }
}

function getMomentTypeBadge(type: string) {
  switch (type) {
    case "risk":
      return "destructive" as const;
    case "delight":
      return "default" as const;
    case "decision":
      return "secondary" as const;
    case "handoff":
      return "outline" as const;
    default:
      return "secondary" as const;
  }
}

function MomentCard({ moment, annotation }: { moment: GeneratedMoment; annotation?: MomentAnnotation }) {
  const [expanded, setExpanded] = useState(false);
  const hasV2Fields =
    moment.diagnosis ||
    moment.actionTemplate ||
    moment.cxToolRecommendation ||
    moment.decisionScienceInsight ||
    moment.impactIfIgnored;

  return (
    <div
      className={`rounded-lg border p-3 cursor-pointer transition-all hover:shadow-sm ${getSeverityColor(moment.severity)}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold opacity-50">
            {getMomentTypeIcon(moment.type)}
          </span>
          <div>
            <div className="font-medium text-sm">{moment.name}</div>
            <div className="text-xs opacity-75">{moment.description}</div>
            {/* Evidence annotations */}
            {annotation && (annotation.painPoints.length > 0 || annotation.competitorGaps.length > 0) && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {annotation.painPoints.map((pp, i) => (
                  <span
                    key={`pp-${i}`}
                    className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200 font-medium"
                  >
                    Addresses: {pp}
                  </span>
                ))}
                {annotation.competitorGaps.map((cg, i) => (
                  <span
                    key={`cg-${i}`}
                    className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200 font-medium"
                  >
                    {cg}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          <Badge variant={getMomentTypeBadge(moment.type)} className="text-xs">
            {moment.type}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {moment.severity}
          </Badge>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-current/10 space-y-3">
          {/* v2: Decision Science Insight — what the buyer/customer is thinking */}
          {moment.decisionScienceInsight && (
            <div className="rounded-md bg-purple-50 border border-purple-200 p-2.5">
              <div className="text-xs font-semibold text-purple-800 mb-1">
                What they're thinking:
              </div>
              <div className="text-xs text-purple-700">
                {moment.decisionScienceInsight}
              </div>
            </div>
          )}

          {/* v2: Diagnosis — what's likely going wrong */}
          {moment.diagnosis && (
            <div className="rounded-md bg-amber-50 border border-amber-200 p-2.5">
              <div className="text-xs font-semibold text-amber-800 mb-1">
                Diagnosis:
              </div>
              <div className="text-xs text-amber-700">
                {moment.diagnosis}
              </div>
            </div>
          )}

          {/* Triggers (v1, preserved) */}
          {moment.triggers.length > 0 && (
            <div>
              <div className="text-xs font-semibold mb-1">Triggers:</div>
              <ul className="text-xs space-y-0.5">
                {moment.triggers.map((trigger, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="opacity-50">-</span> {trigger}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations (v1, preserved) */}
          {moment.recommendations.length > 0 && (
            <div>
              <div className="text-xs font-semibold mb-1">
                What to do:
              </div>
              <ul className="text-xs space-y-0.5">
                {moment.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="opacity-50">{i + 1}.</span> {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* v2: Action Template — specific thing to do/write/send */}
          {moment.actionTemplate && (
            <div className="rounded-md bg-emerald-50 border border-emerald-200 p-2.5">
              <div className="text-xs font-semibold text-emerald-800 mb-1">
                Action template:
              </div>
              <div className="text-xs text-emerald-700 whitespace-pre-line">
                {moment.actionTemplate}
              </div>
            </div>
          )}

          {/* v2: CX Tool Recommendation */}
          {moment.cxToolRecommendation && (
            <div className="rounded-md bg-blue-50 border border-blue-200 p-2.5">
              <div className="text-xs font-semibold text-blue-800 mb-1">
                Measure with:
              </div>
              <div className="text-xs text-blue-700">
                {moment.cxToolRecommendation}
              </div>
            </div>
          )}

          {/* v2: Impact If Ignored */}
          {moment.impactIfIgnored && (
            <div className="rounded-md bg-red-50 border border-red-200 p-2.5">
              <div className="text-xs font-semibold text-red-800 mb-1">
                If you ignore this:
              </div>
              <div className="text-xs text-red-700">
                {moment.impactIfIgnored}
              </div>
            </div>
          )}

          {/* Expand hint for v2 content */}
          {!hasV2Fields && (
            <div className="text-xs text-muted-foreground text-center opacity-50">
              Click to collapse
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function JourneyStageCard({
  stage,
  index,
  isLast,
  momentAnnotations,
}: JourneyStageCardProps) {
  const hasStageInsights =
    stage.topFailureRisk || stage.successPattern || stage.benchmarkContext;

  return (
    <div className="relative">
      {/* Connection line */}
      {!isLast && (
        <div className="absolute left-6 top-full w-0.5 h-6 bg-border z-0" />
      )}

      <Card className="relative z-10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
                stage.stageType === "sales"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{stage.name}</CardTitle>
                <Badge
                  variant="outline"
                  className="text-xs"
                >
                  {stage.stageType}
                </Badge>
              </div>
              <CardDescription>{stage.description}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">
                Customer feels
              </div>
              <div className="text-sm font-medium capitalize">
                {stage.emotionalState}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* v2: Stage-level intelligence bar */}
          {hasStageInsights && (
            <div className="grid gap-2 text-xs">
              {stage.topFailureRisk && (
                <div className="flex items-start gap-2 rounded-md bg-red-50 border border-red-100 px-3 py-2">
                  <span className="font-semibold text-red-700 shrink-0">Top risk:</span>
                  <span className="text-red-600">{stage.topFailureRisk}</span>
                </div>
              )}
              {stage.successPattern && (
                <div className="flex items-start gap-2 rounded-md bg-emerald-50 border border-emerald-100 px-3 py-2">
                  <span className="font-semibold text-emerald-700 shrink-0">Best move:</span>
                  <span className="text-emerald-600">{stage.successPattern}</span>
                </div>
              )}
              {stage.benchmarkContext && (
                <div className="flex items-start gap-2 rounded-md bg-slate-50 border border-slate-200 px-3 py-2">
                  <span className="font-semibold text-slate-700 shrink-0">Benchmark:</span>
                  <span className="text-slate-600">{stage.benchmarkContext}</span>
                </div>
              )}
            </div>
          )}

          {/* Meaningful Moments */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground mb-2">
              Meaningful Moments ({stage.meaningfulMoments.length})
            </div>
            {stage.meaningfulMoments.map((moment, i) => (
              <MomentCard
                key={i}
                moment={moment}
                annotation={momentAnnotations?.[moment.name]}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
