"use client";

import { useState, useRef, type ReactNode } from "react";
import type {
  GeneratedJourney,
  GeneratedStage,
  GeneratedMoment,
} from "@/lib/ai/journey-prompt";
import {
  Warning, Sparkle, Diamond, ArrowRight, Circle,
  X, Check, CaretDown,
} from "@phosphor-icons/react";

interface JourneyVisualProps {
  journey: GeneratedJourney;
}

// ============================================
// Severity — minimal, non-screaming palette
// ============================================

const severityConfig: Record<string, { dot: string; ring: string; text: string; label: string }> = {
  critical: { dot: "bg-rose-400", ring: "ring-rose-200", text: "text-rose-600", label: "Critical" },
  high:     { dot: "bg-amber-400", ring: "ring-amber-200", text: "text-amber-600", label: "High" },
  medium:   { dot: "bg-slate-400", ring: "ring-slate-200", text: "text-slate-500", label: "Medium" },
  low:      { dot: "bg-slate-300", ring: "ring-slate-100", text: "text-slate-400", label: "Low" },
};

const typeIcon: Record<string, ReactNode> = {
  risk:     <Warning size={14} weight="bold" />,
  delight:  <Sparkle size={14} weight="fill" />,
  decision: <Diamond size={14} weight="fill" />,
  handoff:  <ArrowRight size={14} weight="bold" />,
};

function getTypeLabel(type: string): string {
  switch (type) {
    case "risk": return "Risk";
    case "delight": return "Delight";
    case "decision": return "Decision";
    case "handoff": return "Handoff";
    default: return type;
  }
}

// ============================================
// Moment Detail — expanded inline
// ============================================

function MomentDetail({ moment, onClose }: { moment: GeneratedMoment; onClose: () => void }) {
  const sev = severityConfig[moment.severity] ?? severityConfig.medium;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200 ml-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white shadow-sm ${sev.dot}`}>
            {typeIcon[moment.type] ?? <Circle size={12} weight="fill" />}
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 text-sm">{moment.name}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xs font-medium ${sev.text}`}>{sev.label}</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-400 capitalize">{moment.type}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-300 hover:text-slate-500 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Description */}
      {moment.description && (
        <p className="text-sm text-slate-500 leading-relaxed">{moment.description}</p>
      )}

      {/* Insight cards */}
      <div className="grid gap-2.5 sm:grid-cols-2">
        {moment.diagnosis && (
          <div className="rounded-lg bg-slate-50 border border-slate-100 p-3 space-y-1">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Diagnosis</div>
            <div className="text-sm text-slate-700">{moment.diagnosis}</div>
          </div>
        )}
        {moment.actionTemplate && (
          <div className="rounded-lg bg-slate-50 border border-slate-100 p-3 space-y-1">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Action</div>
            <div className="text-sm text-slate-700">{moment.actionTemplate}</div>
          </div>
        )}
        {moment.decisionScienceInsight && (
          <div className="rounded-lg bg-slate-50 border border-slate-100 p-3 space-y-1">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Buyer Psychology</div>
            <div className="text-sm text-slate-700">{moment.decisionScienceInsight}</div>
          </div>
        )}
        {moment.impactIfIgnored && (
          <div className="rounded-lg bg-slate-50 border border-slate-100 p-3 space-y-1">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">If Ignored</div>
            <div className="text-sm text-slate-700">{moment.impactIfIgnored}</div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {moment.recommendations && moment.recommendations.length > 0 && (
        <div className="rounded-lg bg-slate-50 border border-slate-100 p-3 space-y-1.5">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Recommendations</div>
          <ul className="space-y-1.5">
            {moment.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <ArrowRight size={14} weight="bold" className="text-slate-300 mt-1 shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ============================================
// Moment Row — compact inline within stage
// ============================================

function MomentRow({
  moment,
  isSelected,
  onClick,
}: {
  moment: GeneratedMoment;
  isSelected: boolean;
  onClick: () => void;
}) {
  const sev = severityConfig[moment.severity] ?? severityConfig.medium;
  const isAtRisk = moment.severity === "critical" || moment.severity === "high";

  return (
    <div className="space-y-0">
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
          isSelected
            ? "bg-slate-100"
            : "hover:bg-slate-50"
        }`}
      >
        {/* Severity dot with icon */}
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0 ${sev.dot}`}>
          <span className="opacity-90 flex items-center justify-center">
            {typeIcon[moment.type] ?? <Circle size={8} weight="fill" />}
          </span>
        </div>

        {/* Name + type */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-slate-800 truncate">{moment.name}</div>
        </div>

        {/* Type + severity badges */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs text-slate-400">{getTypeLabel(moment.type)}</span>
          {isAtRisk && (
            <span className={`text-xs font-semibold ${sev.text}`}>
              {sev.label}
            </span>
          )}
          <CaretDown
            size={14}
            weight="bold"
            className={`text-slate-300 transition-transform ${isSelected ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Expanded detail inline */}
      {isSelected && (
        <MomentDetail moment={moment} onClose={onClick} />
      )}
    </div>
  );
}

// ============================================
// Stage Card — vertical layout
// ============================================

function VerticalStageCard({
  stage,
  index,
  isLast,
  selectedMoment,
  onSelectMoment,
  stageRef,
}: {
  stage: GeneratedStage;
  index: number;
  isLast: boolean;
  selectedMoment: GeneratedMoment | null;
  onSelectMoment: (m: GeneratedMoment | null) => void;
  stageRef: (el: HTMLDivElement | null) => void;
}) {
  const hasCritical = stage.meaningfulMoments.some((m) => m.severity === "critical");
  const isCustomer = stage.stageType === "customer";

  return (
    <div ref={stageRef} className="relative flex gap-4">
      {/* Timeline rail */}
      <div className="flex flex-col items-center shrink-0">
        {/* Stage number circle */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm z-10 ${
            isCustomer ? "bg-slate-700" : "bg-slate-400"
          }`}
        >
          {index + 1}
        </div>
        {/* Vertical line */}
        {!isLast && (
          <div className="w-px flex-1 bg-slate-200 mt-0" />
        )}
      </div>

      {/* Stage content */}
      <div className={`flex-1 pb-8 ${isLast ? "" : ""}`}>
        <div className={`rounded-2xl border bg-white shadow-sm overflow-hidden ${hasCritical ? "border-rose-200" : "border-slate-200"}`}>
          {/* Stage header */}
          <div className="px-5 pt-4 pb-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-widest font-semibold text-slate-400">
                    {stage.stageType}
                  </span>
                  {hasCritical && (
                    <span className="text-xs text-rose-500 font-medium flex items-center gap-0.5">
                      <Warning size={12} weight="bold" /> risk
                    </span>
                  )}
                </div>
                <h3 className="text-base font-semibold text-slate-900 mt-1">{stage.name}</h3>
                {stage.description && (
                  <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{stage.description}</p>
                )}
              </div>
              {stage.emotionalState && (
                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-400 font-medium">Feels</div>
                  <div className="text-sm font-semibold text-slate-700 capitalize">{stage.emotionalState}</div>
                </div>
              )}
            </div>
          </div>

          {/* Moments list */}
          <div className="border-t border-slate-100 px-2 py-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-3 py-1.5">
              {stage.meaningfulMoments.length} moments
            </div>
            <div className="space-y-0.5">
              {stage.meaningfulMoments.map((moment, i) => (
                <MomentRow
                  key={i}
                  moment={moment}
                  isSelected={selectedMoment?.name === moment.name}
                  onClick={() =>
                    onSelectMoment(
                      selectedMoment?.name === moment.name ? null : moment
                    )
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Handoff Divider
// ============================================

function HandoffDivider() {
  return (
    <div className="relative flex gap-4">
      <div className="flex flex-col items-center shrink-0">
        <div className="w-px flex-1 bg-slate-200" />
        <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center z-10 my-1">
          <ArrowRight size={12} weight="bold" className="text-slate-400" />
        </div>
        <div className="w-px flex-1 bg-slate-200" />
      </div>
      <div className="flex items-center py-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">
          Handoff
        </span>
      </div>
    </div>
  );
}

// ============================================
// Stage Overview Bar — clickable pills
// ============================================

function StageOverviewBar({
  journey,
  onStageClick,
}: {
  journey: GeneratedJourney;
  onStageClick: (index: number) => void;
}) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1 -mx-1 px-1">
      {journey.stages.map((stage, i) => {
        const hasCritical = stage.meaningfulMoments.some(
          (m) => m.severity === "critical"
        );
        const isCustomer = stage.stageType === "customer";

        return (
          <div key={i} className="flex items-center shrink-0">
            <button
              onClick={() => onStageClick(i)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-slate-100 ${
                hasCritical ? "text-rose-600" : "text-slate-600"
              }`}
              title={stage.name}
            >
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                  isCustomer ? "bg-slate-700" : "bg-slate-400"
                }`}
              >
                {i + 1}
              </div>
              <span className="max-w-[100px] truncate">{stage.name}</span>
              {hasCritical && <Warning size={12} weight="bold" className="text-rose-400" />}
            </button>
            {i < journey.stages.length - 1 && (
              <div className="w-3 h-px bg-slate-200 shrink-0" />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// Summary Stats
// ============================================

function JourneySummary({ journey }: { journey: GeneratedJourney }) {
  const totalMoments = journey.stages.reduce((sum, s) => sum + s.meaningfulMoments.length, 0);
  const criticalMoments = journey.stages.reduce(
    (sum, s) => sum + s.meaningfulMoments.filter((m) => m.severity === "critical").length, 0
  );
  const salesStages = journey.stages.filter((s) => s.stageType === "sales").length;
  const csStages = journey.stages.filter((s) => s.stageType === "customer").length;

  return (
    <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-slate-400">
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-slate-400" />
        <span>{salesStages} sales</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-slate-700" />
        <span>{csStages} customer</span>
      </div>
      <span className="text-slate-200">|</span>
      <span>{totalMoments} moments</span>
      {criticalMoments > 0 && (
        <span className="text-rose-400 font-medium">{criticalMoments} critical</span>
      )}
    </div>
  );
}

// ============================================
// Main Export
// ============================================

export function JourneyVisual({ journey }: JourneyVisualProps) {
  const [selectedMoment, setSelectedMoment] = useState<GeneratedMoment | null>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleStageClick = (index: number) => {
    stageRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Find handoff boundary
  const handoffIndex = journey.stages.findIndex(
    (s, i) => i > 0 && s.stageType !== journey.stages[i - 1].stageType
  );

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Summary stats */}
      <JourneySummary journey={journey} />

      {/* Quick-jump overview bar */}
      <div className="rounded-xl border bg-white p-3 shadow-sm">
        <StageOverviewBar journey={journey} onStageClick={handleStageClick} />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 text-xs text-slate-400">
        <span className="font-medium">Severity:</span>
        {Object.entries(severityConfig).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            <span className="capitalize">{cfg.label}</span>
          </div>
        ))}
      </div>

      {/* Vertical timeline */}
      <div className="relative">
        {/* Start indicator */}
        <div className="flex gap-4 mb-2">
          <div className="flex flex-col items-center shrink-0">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold shadow-sm">
              Start
            </div>
            <div className="w-px h-4 bg-slate-200" />
          </div>
        </div>

        {/* Stages */}
        {journey.stages.map((stage, i) => (
          <div key={i}>
            {/* Handoff divider */}
            {i === handoffIndex && <HandoffDivider />}

            <VerticalStageCard
              stage={stage}
              index={i}
              isLast={i === journey.stages.length - 1}
              selectedMoment={selectedMoment}
              onSelectMoment={setSelectedMoment}
              stageRef={(el) => { stageRefs.current[i] = el; }}
            />
          </div>
        ))}

        {/* End indicator */}
        <div className="flex gap-4 mt-2">
          <div className="flex flex-col items-center shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
              <Check size={18} weight="bold" />
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-xs font-medium text-slate-400">Journey complete</span>
          </div>
        </div>
      </div>
    </div>
  );
}
