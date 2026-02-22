"use client";

import { useState } from "react";
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

// 2-tone severity: amber for critical/high, slate for everything else
function getSeverityStyle(severity: string): { dot: string; row: string; label: string } {
  switch (severity) {
    case "critical":
      return { dot: "bg-amber-500", row: "border-amber-200 bg-amber-50/60", label: "text-amber-700" };
    case "high":
      return { dot: "bg-amber-400", row: "border-amber-100 bg-amber-50/40", label: "text-amber-600" };
    default:
      return { dot: "bg-slate-300", row: "border-slate-100 bg-white", label: "text-slate-500" };
  }
}

// Human-readable moment type labels (no cryptic symbols)
function getMomentTypeLabel(type: string): string {
  switch (type) {
    case "risk": return "Risk";
    case "delight": return "Delight";
    case "decision": return "Decision";
    case "handoff": return "Handoff";
    default: return type;
  }
}

function MomentCard({ moment, annotation }: { moment: GeneratedMoment; annotation?: MomentAnnotation }) {
  const [expanded, setExpanded] = useState(false);
  const style = getSeverityStyle(moment.severity);
  const isAtRisk = moment.severity === "critical" || moment.severity === "high";

  return (
    <div
      className={`rounded-xl border px-4 py-3 cursor-pointer transition-all hover:shadow-sm ${style.row}`}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Row: dot + name + type pill + severity */}
      <div className="flex items-start gap-3">
        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${style.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="font-medium text-sm text-slate-800">{moment.name}</div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] text-slate-400 font-medium">{getMomentTypeLabel(moment.type)}</span>
              {isAtRisk && (
                <span className={`text-[11px] font-semibold uppercase tracking-wide ${style.label}`}>
                  {moment.severity}
                </span>
              )}
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{moment.description}</div>

          {/* Evidence annotations — pain point link + competitor gap */}
          {annotation && (annotation.painPoints.length > 0 || annotation.competitorGaps.length > 0) && (
            <div className="flex flex-wrap gap-1 mt-2">
              {annotation.painPoints.map((pp, i) => (
                <span
                  key={`pp-${i}`}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 border border-violet-200 font-medium"
                >
                  ↳ {pp}
                </span>
              ))}
              {annotation.competitorGaps.map((cg, i) => (
                <span
                  key={`cg-${i}`}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 font-medium"
                >
                  {cg}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Expanded detail — clean, no rainbow boxes */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-3 ml-5">
          {/* What they're thinking */}
          {moment.decisionScienceInsight && (
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">What they&apos;re thinking</div>
              <p className="text-xs text-slate-600 leading-relaxed italic">&ldquo;{moment.decisionScienceInsight}&rdquo;</p>
            </div>
          )}

          {/* Diagnosis */}
          {moment.diagnosis && (
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">What&apos;s likely going wrong</div>
              <p className="text-xs text-slate-600 leading-relaxed">{moment.diagnosis}</p>
            </div>
          )}

          {/* Triggers */}
          {moment.triggers.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Triggers</div>
              <ul className="space-y-0.5">
                {moment.triggers.map((trigger, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                    <span className="text-slate-300 mt-0.5">–</span>
                    {trigger}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* What to do */}
          {moment.recommendations.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">What to do</div>
              <ul className="space-y-1">
                {moment.recommendations.map((rec, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                    <span className="text-slate-400 font-semibold shrink-0">{i + 1}.</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action template */}
          {moment.actionTemplate && (
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Action template</div>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                {moment.actionTemplate}
              </p>
            </div>
          )}

          {/* Measure with */}
          {moment.cxToolRecommendation && (
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Measure with</div>
              <p className="text-xs text-slate-600">{moment.cxToolRecommendation}</p>
            </div>
          )}

          {/* If you ignore this */}
          {moment.impactIfIgnored && (
            <div>
              <div className="text-[11px] font-semibold text-amber-600 uppercase tracking-wide mb-1">If ignored</div>
              <p className="text-xs text-amber-700 leading-relaxed">{moment.impactIfIgnored}</p>
            </div>
          )}

          <div className="text-[11px] text-slate-300 text-center pt-1">tap to collapse</div>
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

  const criticalCount = stage.meaningfulMoments.filter(
    (m) => m.severity === "critical" || m.severity === "high"
  ).length;

  return (
    <div className="relative">
      {/* Connection line */}
      {!isLast && (
        <div className="absolute left-6 top-full w-0.5 h-4 bg-slate-100 z-0" />
      )}

      <div className="relative z-10 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Stage header */}
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-start gap-4">
            {/* Index circle — single neutral color */}
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 text-slate-600 text-sm font-bold shrink-0">
              {index + 1}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{stage.name}</h3>
                  <p className="text-sm text-slate-500 mt-0.5 leading-snug">{stage.description}</p>
                </div>
                {/* Customer feels — right-aligned, subtle */}
                {stage.emotionalState && (
                  <div className="text-right shrink-0">
                    <div className="text-[11px] text-slate-400 uppercase tracking-wide font-medium">Customer feels</div>
                    <div className="text-sm font-semibold text-slate-700 capitalize mt-0.5">{stage.emotionalState}</div>
                  </div>
                )}
              </div>

              {/* At-risk count pill */}
              {criticalCount > 0 && (
                <div className="mt-2">
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                    {criticalCount} at-risk {criticalCount === 1 ? "moment" : "moments"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stage insights — single-color, left-bordered */}
        {hasStageInsights && (
          <div className="mx-5 mb-4 space-y-2">
            {stage.topFailureRisk && (
              <div className="flex items-start gap-2.5 text-xs border-l-2 border-amber-400 pl-3 py-1">
                <span className="font-semibold text-slate-600 shrink-0">Top risk:</span>
                <span className="text-slate-600">{stage.topFailureRisk}</span>
              </div>
            )}
            {stage.successPattern && (
              <div className="flex items-start gap-2.5 text-xs border-l-2 border-slate-300 pl-3 py-1">
                <span className="font-semibold text-slate-600 shrink-0">Best move:</span>
                <span className="text-slate-600">{stage.successPattern}</span>
              </div>
            )}
            {stage.benchmarkContext && (
              <div className="flex items-start gap-2.5 text-xs border-l-2 border-slate-200 pl-3 py-1">
                <span className="font-semibold text-slate-500 shrink-0">Benchmark:</span>
                <span className="text-slate-500">{stage.benchmarkContext}</span>
              </div>
            )}
          </div>
        )}

        {/* Moments list */}
        <div className="px-5 pb-5 space-y-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-3">
            {stage.meaningfulMoments.length} moments
          </div>
          {stage.meaningfulMoments.map((moment, i) => (
            <MomentCard
              key={i}
              moment={moment}
              annotation={momentAnnotations?.[moment.name]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
