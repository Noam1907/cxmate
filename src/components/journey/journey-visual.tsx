"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type {
  GeneratedJourney,
  GeneratedStage,
  GeneratedMoment,
} from "@/lib/ai/journey-prompt";

interface JourneyVisualProps {
  journey: GeneratedJourney;
}

// ============================================
// Colors & Icons
// ============================================

const severityConfig = {
  critical: { bg: "bg-red-500", ring: "ring-red-300", text: "text-red-700", lightBg: "bg-red-50", border: "border-red-200" },
  high: { bg: "bg-orange-500", ring: "ring-orange-300", text: "text-orange-700", lightBg: "bg-orange-50", border: "border-orange-200" },
  medium: { bg: "bg-yellow-500", ring: "ring-yellow-300", text: "text-yellow-700", lightBg: "bg-yellow-50", border: "border-yellow-200" },
  low: { bg: "bg-emerald-500", ring: "ring-emerald-300", text: "text-emerald-700", lightBg: "bg-emerald-50", border: "border-emerald-200" },
};

const typeConfig = {
  risk: { icon: "⚠️", label: "Risk" },
  delight: { icon: "✨", label: "Delight" },
  decision: { icon: "🔀", label: "Decision" },
  handoff: { icon: "🤝", label: "Handoff" },
};

const stageTypeConfig = {
  sales: {
    gradient: "from-blue-500 to-blue-600",
    lightBg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    pipeColor: "bg-blue-200",
    dot: "bg-blue-400",
  },
  customer: {
    gradient: "from-emerald-500 to-emerald-600",
    lightBg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    pipeColor: "bg-emerald-200",
    dot: "bg-emerald-400",
  },
};

// ============================================
// Moment Node — Circle on the flow line
// ============================================

function MomentNode({
  moment,
  isSelected,
  onClick,
  position,
}: {
  moment: GeneratedMoment;
  isSelected: boolean;
  onClick: () => void;
  position: "top" | "bottom";
}) {
  const sev = severityConfig[moment.severity];
  const type = typeConfig[moment.type];

  return (
    <div
      className={`flex flex-col items-center ${
        position === "top" ? "flex-col-reverse" : ""
      }`}
    >
      {/* Stem line */}
      <div className={`w-px h-5 ${isSelected ? "bg-primary" : "bg-slate-300"}`} />

      {/* The dot */}
      <button
        onClick={onClick}
        className={`relative group transition-all duration-200 ${
          isSelected ? "scale-125 z-10" : "hover:scale-110"
        }`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm text-white shadow-md transition-all ${
            sev.bg
          } ${isSelected ? "ring-3 ring-offset-2 ring-primary shadow-lg" : "hover:shadow-lg"}`}
        >
          {type.icon}
        </div>
        {/* Tooltip on hover */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] px-2 py-1 rounded-md whitespace-nowrap z-20 mt-1">
          {moment.name}
        </div>
      </button>

      {/* Label */}
      <span
        className={`mt-1 text-[11px] max-w-[90px] text-center leading-tight line-clamp-2 ${
          isSelected ? "text-foreground font-medium" : "text-muted-foreground"
        }`}
      >
        {moment.name}
      </span>
    </div>
  );
}

// ============================================
// Stage Node — The main "card" on the journey
// ============================================

function StageNode({
  stage,
  index,
  onSelectMoment,
  selectedMoment,
}: {
  stage: GeneratedStage;
  index: number;
  onSelectMoment: (m: GeneratedMoment | null) => void;
  selectedMoment: GeneratedMoment | null;
}) {
  const config = stageTypeConfig[stage.stageType] || stageTypeConfig.customer;
  const moments = stage.meaningfulMoments;
  const criticalCount = moments.filter(
    (m) => m.severity === "critical" || m.severity === "high"
  ).length;

  return (
    <div className="flex flex-col items-center gap-0 min-w-[200px]">
      {/* Top moments (alternate: odd-indexed moments go top) */}
      <div className="flex items-end gap-3 min-h-[100px] pb-0">
        {moments
          .filter((_, i) => i % 2 === 0)
          .map((moment, i) => (
            <MomentNode
              key={i}
              moment={moment}
              isSelected={selectedMoment?.name === moment.name}
              onClick={() =>
                onSelectMoment(
                  selectedMoment?.name === moment.name ? null : moment
                )
              }
              position="top"
            />
          ))}
      </div>

      {/* The flow pipe / stage card */}
      <div className="relative w-full">
        {/* Pipe line behind */}
        <div
          className={`absolute top-1/2 left-0 right-0 h-1.5 -translate-y-1/2 ${config.pipeColor} rounded-full`}
        />

        {/* Stage card */}
        <div
          className={`relative mx-auto w-[180px] rounded-2xl border-2 ${config.border} ${config.lightBg} p-4 text-center shadow-sm z-10`}
        >
          {/* Stage number badge */}
          <div
            className={`absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-b ${config.gradient} text-white text-xs font-bold flex items-center justify-center shadow-sm`}
          >
            {index + 1}
          </div>

          <h3 className="text-sm font-bold mt-1 leading-tight">{stage.name}</h3>

          <p className="text-[10px] text-muted-foreground italic mt-1">
            &ldquo;{stage.emotionalState}&rdquo;
          </p>

          <div className="flex items-center justify-center gap-1.5 mt-2">
            <Badge variant="outline" className={`text-[10px] ${config.text}`}>
              {stage.stageType}
            </Badge>
            {criticalCount > 0 && (
              <Badge variant="destructive" className="text-[10px]">
                {criticalCount} risk{criticalCount > 1 ? "s" : ""}
              </Badge>
            )}
          </div>

          {/* Failure risk hint */}
          {stage.topFailureRisk && (
            <div className="text-[10px] text-red-600/70 mt-1.5 leading-tight line-clamp-1">
              ⚠ {stage.topFailureRisk}
            </div>
          )}
        </div>
      </div>

      {/* Bottom moments (even-indexed moments go bottom) */}
      <div className="flex items-start gap-3 min-h-[100px] pt-0">
        {moments
          .filter((_, i) => i % 2 === 1)
          .map((moment, i) => (
            <MomentNode
              key={i}
              moment={moment}
              isSelected={selectedMoment?.name === moment.name}
              onClick={() =>
                onSelectMoment(
                  selectedMoment?.name === moment.name ? null : moment
                )
              }
              position="bottom"
            />
          ))}
      </div>
    </div>
  );
}

// ============================================
// Connector between stages
// ============================================

function StageConnector({
  fromType,
  toType,
}: {
  fromType: string;
  toType: string;
}) {
  const isHandoff = fromType !== toType;

  return (
    <div className="flex flex-col items-center justify-center self-center -mx-2 z-0">
      {isHandoff ? (
        <div className="flex flex-col items-center gap-1">
          <div className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border shadow-sm whitespace-nowrap">
            Handoff
          </div>
          <svg width="40" height="16" viewBox="0 0 40 16" className="text-slate-400">
            <defs>
              <linearGradient id="handoffGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#93c5fd" />
                <stop offset="100%" stopColor="#6ee7b7" />
              </linearGradient>
            </defs>
            <path
              d="M 2 8 Q 20 2 38 8"
              fill="none"
              stroke="url(#handoffGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <polygon points="34,5 40,8 34,11" fill="#6ee7b7" />
          </svg>
        </div>
      ) : (
        <svg width="32" height="16" viewBox="0 0 32 16" className="text-slate-300">
          <line
            x1="2"
            y1="8"
            x2="26"
            y2="8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="4 3"
          />
          <polygon points="24,4 32,8 24,12" fill="currentColor" />
        </svg>
      )}
    </div>
  );
}

// ============================================
// Detail Panel for selected moment
// ============================================

function MomentDetail({
  moment,
  onClose,
}: {
  moment: GeneratedMoment;
  onClose: () => void;
}) {
  const sev = severityConfig[moment.severity];
  const type = typeConfig[moment.type];

  return (
    <div className={`rounded-2xl border-2 ${sev.border} ${sev.lightBg} p-6 space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300 max-w-4xl mx-auto`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm text-white ${sev.bg}`}
          >
            {type.icon}
          </div>
          <div>
            <h3 className="font-bold text-lg">{moment.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant={moment.severity === "critical" ? "destructive" : "secondary"}>
                {moment.severity}
              </Badge>
              <span className="text-xs text-muted-foreground">{type.label} moment</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-white/50"
        >
          ✕
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground">{moment.description}</p>

      {/* Insight cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {moment.diagnosis && (
          <div className="rounded-xl bg-white border p-4 space-y-1.5">
            <div className="text-xs font-bold text-orange-600 uppercase tracking-wide">
              Diagnosis
            </div>
            <div className="text-sm">{moment.diagnosis}</div>
          </div>
        )}
        {moment.actionTemplate && (
          <div className="rounded-xl bg-white border border-emerald-200 p-4 space-y-1.5">
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wide">
              Recommended Action
            </div>
            <div className="text-sm">{moment.actionTemplate}</div>
          </div>
        )}
        {moment.decisionScienceInsight && (
          <div className="rounded-xl bg-white border border-blue-200 p-4 space-y-1.5">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wide">
              Buyer Psychology
            </div>
            <div className="text-sm">{moment.decisionScienceInsight}</div>
          </div>
        )}
        {moment.impactIfIgnored && (
          <div className="rounded-xl bg-white border border-red-200 p-4 space-y-1.5">
            <div className="text-xs font-bold text-red-600 uppercase tracking-wide">
              If Ignored
            </div>
            <div className="text-sm">{moment.impactIfIgnored}</div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {moment.recommendations && moment.recommendations.length > 0 && (
        <div className="rounded-xl bg-white border p-4 space-y-2">
          <div className="text-xs font-bold text-primary uppercase tracking-wide">
            Recommendations
          </div>
          <ul className="space-y-1.5">
            {moment.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-primary font-bold mt-0.5">→</span>
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
// Journey Summary Bar
// ============================================

function JourneySummary({ journey }: { journey: GeneratedJourney }) {
  const totalMoments = journey.stages.reduce(
    (sum, s) => sum + s.meaningfulMoments.length,
    0
  );
  const criticalMoments = journey.stages.reduce(
    (sum, s) =>
      sum + s.meaningfulMoments.filter((m) => m.severity === "critical").length,
    0
  );
  const salesStages = journey.stages.filter((s) => s.stageType === "sales").length;
  const csStages = journey.stages.filter((s) => s.stageType === "customer").length;

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-blue-500" />
        <span className="text-muted-foreground">{salesStages} Sales</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-emerald-500" />
        <span className="text-muted-foreground">{csStages} Customer</span>
      </div>
      <span className="text-muted-foreground">|</span>
      <span className="text-muted-foreground">{totalMoments} moments</span>
      {criticalMoments > 0 && (
        <Badge variant="destructive" className="text-xs">
          {criticalMoments} critical
        </Badge>
      )}
      <span className="text-[11px] text-muted-foreground italic">
        Click any moment to explore
      </span>
    </div>
  );
}

// ============================================
// Main Visual Journey Component
// ============================================

export function JourneyVisual({ journey }: JourneyVisualProps) {
  const [selectedMoment, setSelectedMoment] =
    useState<GeneratedMoment | null>(null);

  return (
    <div className="w-full space-y-6">
      {/* Summary bar */}
      <JourneySummary journey={journey} />

      {/* The visual flow — horizontal scroll */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4">
        <div className="flex items-center min-w-max py-4 px-8">
          {/* Start marker */}
          <div className="flex flex-col items-center mr-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-md">
              Start
            </div>
          </div>

          {/* Arrow from start */}
          <svg width="24" height="16" viewBox="0 0 24 16" className="text-slate-300 -mx-1">
            <line x1="0" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="2" />
            <polygon points="16,4 24,8 16,12" fill="currentColor" />
          </svg>

          {/* Stages */}
          {journey.stages.map((stage, i) => (
            <div key={i} className="flex items-center">
              <StageNode
                stage={stage}
                index={i}
                onSelectMoment={setSelectedMoment}
                selectedMoment={selectedMoment}
              />
              {i < journey.stages.length - 1 && (
                <StageConnector
                  fromType={stage.stageType}
                  toType={journey.stages[i + 1].stageType}
                />
              )}
            </div>
          ))}

          {/* Arrow to end */}
          <svg width="24" height="16" viewBox="0 0 24 16" className="text-slate-300 -mx-1">
            <line x1="0" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="2" />
            <polygon points="16,4 24,8 16,12" fill="currentColor" />
          </svg>

          {/* End marker */}
          <div className="flex flex-col items-center ml-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-md">
              <span className="text-lg">🎯</span>
            </div>
            <span className="text-[10px] text-muted-foreground mt-1">Success</span>
          </div>
        </div>
      </div>

      {/* Severity legend */}
      <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
        <span className="font-medium">Severity:</span>
        {Object.entries(severityConfig).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1">
            <div className={`w-2.5 h-2.5 rounded-full ${cfg.bg}`} />
            <span className="capitalize">{key}</span>
          </div>
        ))}
      </div>

      {/* Selected moment detail */}
      {selectedMoment && (
        <MomentDetail
          moment={selectedMoment}
          onClose={() => setSelectedMoment(null)}
        />
      )}
    </div>
  );
}
