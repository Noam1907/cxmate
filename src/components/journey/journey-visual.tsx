"use client";

import { useState } from "react";
import type {
  GeneratedJourney,
  GeneratedStage,
  GeneratedMoment,
} from "@/lib/ai/journey-prompt";

interface JourneyVisualProps {
  journey: GeneratedJourney;
}

// ============================================
// Severity — minimal, non-screaming palette
// ============================================

const severityConfig = {
  critical: { dot: "bg-rose-400", ring: "ring-rose-200", text: "text-rose-600", label: "Critical" },
  high:     { dot: "bg-amber-400", ring: "ring-amber-200", text: "text-amber-600", label: "High" },
  medium:   { dot: "bg-slate-400", ring: "ring-slate-200", text: "text-slate-500", label: "Medium" },
  low:      { dot: "bg-slate-300", ring: "ring-slate-100", text: "text-slate-400", label: "Low" },
};

const typeIcon: Record<string, string> = {
  risk:     "⚠",
  delight:  "★",
  decision: "◆",
  handoff:  "→",
};

// ============================================
// Moment Node — minimal dot
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
  const sev = severityConfig[moment.severity] ?? severityConfig.medium;

  return (
    <div className={`flex flex-col items-center ${position === "top" ? "flex-col-reverse" : ""}`}>
      {/* Stem */}
      <div className={`w-px h-6 ${isSelected ? "bg-slate-400" : "bg-slate-200"}`} />

      {/* Dot */}
      <button
        onClick={onClick}
        title={moment.name}
        className={`relative group transition-all duration-200 ${isSelected ? "scale-125 z-10" : "hover:scale-110"}`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] transition-all border border-white shadow-sm ${sev.dot} ${isSelected ? `ring-2 ring-offset-2 ${sev.ring} shadow-md` : ""}`}
        >
          <span className="text-white opacity-80">{typeIcon[moment.type] ?? "•"}</span>
        </div>
        {/* Tooltip */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[11px] px-2.5 py-1.5 rounded-lg whitespace-nowrap z-30 shadow-lg mt-1.5">
          {moment.name}
          <div className={`text-[10px] mt-0.5 ${sev.text} font-medium`}>{sev.label}</div>
        </div>
      </button>

      {/* Label */}
      <span className={`mt-1.5 text-[11px] max-w-[80px] text-center leading-tight line-clamp-2 ${isSelected ? "text-slate-700 font-medium" : "text-slate-400"}`}>
        {moment.name}
      </span>
    </div>
  );
}

// ============================================
// Stage Node — clean white card
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
  const moments = stage.meaningfulMoments;
  const hasCritical = moments.some((m) => m.severity === "critical");
  const isCustomer = stage.stageType === "customer";

  return (
    <div className="flex flex-col items-center gap-0 min-w-[180px]">
      {/* Top moments */}
      <div className="flex items-end gap-4 min-h-[110px] pb-0">
        {moments
          .filter((_, i) => i % 2 === 0)
          .map((moment, i) => (
            <MomentNode
              key={i}
              moment={moment}
              isSelected={selectedMoment?.name === moment.name}
              onClick={() => onSelectMoment(selectedMoment?.name === moment.name ? null : moment)}
              position="top"
            />
          ))}
      </div>

      {/* Stage card */}
      <div className="relative w-full">
        {/* Pipe */}
        <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-slate-200" />

        {/* Card */}
        <div className={`relative mx-auto w-[160px] rounded-2xl border bg-white p-4 text-center shadow-sm z-10 ${hasCritical ? "border-rose-200" : "border-slate-200"}`}>
          {/* Stage number */}
          <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm text-white ${isCustomer ? "bg-slate-600" : "bg-slate-400"}`}>
            {index + 1}
          </div>

          {/* Type label */}
          <div className={`text-[9px] uppercase tracking-widest font-semibold mb-1 ${isCustomer ? "text-slate-500" : "text-slate-400"}`}>
            {stage.stageType}
          </div>

          <h3 className="text-sm font-semibold text-slate-800 leading-tight">{stage.name}</h3>

          <p className="text-[10px] text-slate-400 italic mt-1 leading-tight line-clamp-1">
            &ldquo;{stage.emotionalState}&rdquo;
          </p>

          {hasCritical && (
            <div className="mt-2 text-[10px] text-rose-500 font-medium">
              ⚠ risk
            </div>
          )}
        </div>
      </div>

      {/* Bottom moments */}
      <div className="flex items-start gap-4 min-h-[110px] pt-0">
        {moments
          .filter((_, i) => i % 2 === 1)
          .map((moment, i) => (
            <MomentNode
              key={i}
              moment={moment}
              isSelected={selectedMoment?.name === moment.name}
              onClick={() => onSelectMoment(selectedMoment?.name === moment.name ? null : moment)}
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

function StageConnector({ fromType, toType }: { fromType: string; toType: string }) {
  const isHandoff = fromType !== toType;

  return (
    <div className="flex flex-col items-center justify-center self-center -mx-1 z-0">
      {isHandoff ? (
        <div className="flex flex-col items-center gap-1">
          <div className="text-[9px] font-semibold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm">
            Handoff
          </div>
          <svg width="36" height="14" viewBox="0 0 36 14">
            <line x1="2" y1="7" x2="28" y2="7" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
            <polygon points="25,4 33,7 25,10" fill="#cbd5e1" />
          </svg>
        </div>
      ) : (
        <svg width="28" height="14" viewBox="0 0 28 14">
          <line x1="2" y1="7" x2="20" y2="7" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="3 3" strokeLinecap="round" />
          <polygon points="18,4 26,7 18,10" fill="#e2e8f0" />
        </svg>
      )}
    </div>
  );
}

// ============================================
// Moment Detail Panel
// ============================================

function MomentDetail({ moment, onClose }: { moment: GeneratedMoment; onClose: () => void }) {
  const sev = severityConfig[moment.severity] ?? severityConfig.medium;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm animate-in fade-in slide-in-from-bottom-3 duration-300 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm text-white shadow-sm ${sev.dot}`}>
            {typeIcon[moment.type] ?? "•"}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-base">{moment.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xs font-medium ${sev.text}`}>{sev.label} severity</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-400 capitalize">{moment.type} moment</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-300 hover:text-slate-500 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Description */}
      {moment.description && (
        <p className="text-sm text-slate-500 leading-relaxed">{moment.description}</p>
      )}

      {/* Insight cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {moment.diagnosis && (
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Diagnosis</div>
            <div className="text-sm text-slate-700">{moment.diagnosis}</div>
          </div>
        )}
        {moment.actionTemplate && (
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Recommended Action</div>
            <div className="text-sm text-slate-700">{moment.actionTemplate}</div>
          </div>
        )}
        {moment.decisionScienceInsight && (
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Buyer Psychology</div>
            <div className="text-sm text-slate-700">{moment.decisionScienceInsight}</div>
          </div>
        )}
        {moment.impactIfIgnored && (
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">If Ignored</div>
            <div className="text-sm text-slate-700">{moment.impactIfIgnored}</div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {moment.recommendations && moment.recommendations.length > 0 && (
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Recommendations</div>
          <ul className="space-y-2">
            {moment.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-slate-300 font-bold mt-0.5 shrink-0">→</span>
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
// Summary Bar
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
        <span>{salesStages} sales stages</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-slate-600" />
        <span>{csStages} customer stages</span>
      </div>
      <span className="text-slate-200">|</span>
      <span>{totalMoments} moments mapped</span>
      {criticalMoments > 0 && (
        <span className="text-rose-400 font-medium">{criticalMoments} critical</span>
      )}
      <span className="text-slate-300 italic">Click any dot to explore</span>
    </div>
  );
}

// ============================================
// Main Export
// ============================================

export function JourneyVisual({ journey }: JourneyVisualProps) {
  const [selectedMoment, setSelectedMoment] = useState<GeneratedMoment | null>(null);

  return (
    <div className="w-full space-y-6">
      <JourneySummary journey={journey} />

      {/* Flow — horizontal scroll */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4">
        <div className="flex items-center min-w-max py-4 px-8 gap-0">

          {/* Start */}
          <div className="flex flex-col items-center mr-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow-sm">
              Start
            </div>
          </div>

          {/* Arrow */}
          <svg width="20" height="14" viewBox="0 0 20 14" className="-mr-1">
            <line x1="0" y1="7" x2="14" y2="7" stroke="#e2e8f0" strokeWidth="1.5" />
            <polygon points="12,4 20,7 12,10" fill="#e2e8f0" />
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

          {/* Arrow */}
          <svg width="20" height="14" viewBox="0 0 20 14" className="-ml-1">
            <line x1="0" y1="7" x2="14" y2="7" stroke="#e2e8f0" strokeWidth="1.5" />
            <polygon points="12,4 20,7 12,10" fill="#e2e8f0" />
          </svg>

          {/* End */}
          <div className="flex flex-col items-center ml-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
              <span className="text-base">✓</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1">Live</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 text-[11px] text-slate-400">
        <span className="font-medium">Severity:</span>
        {Object.entries(severityConfig).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            <span className="capitalize">{cfg.label}</span>
          </div>
        ))}
      </div>

      {/* Selected detail */}
      {selectedMoment && (
        <MomentDetail moment={selectedMoment} onClose={() => setSelectedMoment(null)} />
      )}
    </div>
  );
}
