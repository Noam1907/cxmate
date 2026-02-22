"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { GeneratedPlaybook, PlaybookRecommendation, StagePlaybook } from "@/lib/ai/recommendation-prompt";
import type { GeneratedJourney } from "@/lib/ai/journey-prompt";
import type { OnboardingInput } from "@/lib/validations/onboarding";
import { buildEvidenceMap, getMomentAnnotations, type EvidenceMap } from "@/lib/evidence-matching";

// ─── Status ───────────────────────────────────────────────────────────────────

type RecStatus = "not_started" | "in_progress" | "done";

function useRecommendationStatus() {
  const [statuses, setStatuses] = useState<Record<string, RecStatus>>({});
  useEffect(() => {
    const stored = localStorage.getItem("cx-mate-rec-status");
    if (stored) { try { setStatuses(JSON.parse(stored)); } catch { /* ignore */ } }
  }, []);
  const setStatus = (key: string, status: RecStatus) => {
    setStatuses((prev) => {
      const next = { ...prev, [key]: status };
      localStorage.setItem("cx-mate-rec-status", JSON.stringify(next));
      return next;
    });
  };
  return { statuses, setStatus };
}

function makeKey(rec: PlaybookRecommendation): string {
  return `${rec.stageName}:${rec.momentName}:${rec.action.slice(0, 40)}`;
}

function statusCycle(s: RecStatus): RecStatus {
  return s === "not_started" ? "in_progress" : s === "in_progress" ? "done" : "not_started";
}

function priorityLabel(priority: string) {
  return priority === "must_do" ? "Must do" : priority === "should_do" ? "Should do" : "Nice to have";
}

function effortLabel(effort: string) {
  return effort === "15_min" ? "15 min" : effort === "1_hour" ? "1 hr" : effort === "half_day" ? "½ day" : "Multi-day";
}

// ─── Copy Button ──────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }, [text]);
  return (
    <button onClick={handle} className="text-[10px] px-2 py-0.5 rounded border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors shrink-0">
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// ─── Recommendation Card ──────────────────────────────────────────────────────

function RecommendationCard({
  rec, status, onStatusChange,
}: {
  rec: PlaybookRecommendation;
  status: RecStatus;
  onStatusChange: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const checkboxStyle = status === "done"
    ? "bg-slate-800 border-slate-800 text-white"
    : status === "in_progress"
    ? "border-slate-400 bg-white"
    : "border-slate-300 bg-white";

  const isPriority = rec.priority === "must_do";

  return (
    <div className={`py-3 border-b last:border-b-0 transition-opacity ${status === "done" ? "opacity-50" : ""}`}>
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={onStatusChange}
          className={`mt-0.5 shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${checkboxStyle}`}
        >
          {status === "done" && <span className="text-white text-[10px] font-bold">✓</span>}
          {status === "in_progress" && <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <button
              className="text-sm font-medium text-slate-800 text-left hover:text-slate-600 transition-colors"
              onClick={() => setExpanded(!expanded)}
            >
              {rec.action}
            </button>
            <div className="flex items-center gap-1.5 shrink-0">
              {isPriority && (
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{priorityLabel(rec.priority)}</span>
              )}
              <span className="text-[10px] text-slate-400">{effortLabel(rec.effort)}</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{rec.owner} · {rec.timing}</p>

          {expanded && (
            <div className="mt-3 space-y-2" onClick={() => setExpanded(false)}>
              {rec.template && (
                <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Template</span>
                    <CopyButton text={rec.template} />
                  </div>
                  <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">{rec.template}</p>
                </div>
              )}
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Expected outcome</p>
                <p className="text-xs text-slate-600">{rec.expectedOutcome}</p>
              </div>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Measure with</p>
                <p className="text-xs text-slate-600">{rec.measureWith}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Stage Section ────────────────────────────────────────────────────────────

function StageSection({
  stagePlaybook, statuses, onStatusChange, evidenceMap,
}: {
  stagePlaybook: StagePlaybook;
  statuses: Record<string, RecStatus>;
  onStatusChange: (key: string) => void;
  evidenceMap?: EvidenceMap | null;
}) {
  const doneCount = stagePlaybook.recommendations.filter((r) => statuses[makeKey(r)] === "done").length;
  const total = stagePlaybook.recommendations.length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div className="mb-8">
      {/* Stage header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-semibold text-slate-900">{stagePlaybook.stageName}</h3>
        <span className="text-xs text-slate-400">{doneCount}/{total} done</span>
      </div>
      {/* Thin progress bar */}
      <div className="h-px bg-slate-100 mb-4 overflow-hidden rounded-full">
        <div className="h-full bg-slate-800 transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      {/* Recommendations */}
      <div>
        {stagePlaybook.recommendations.map((rec, i) => {
          const key = makeKey(rec);
          const status = statuses[key] || "not_started";
          const ann = evidenceMap ? getMomentAnnotations(rec.stageName, rec.momentName, evidenceMap) : undefined;
          void ann; // annotations available but we keep UI clean
          return (
            <RecommendationCard
              key={i}
              rec={rec}
              status={status}
              onStatusChange={() => onStatusChange(key)}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── Filter ───────────────────────────────────────────────────────────────────

type FilterMode = "all" | "must_do" | "quick_wins";

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PlaybookPage() {
  const [playbook, setPlaybook] = useState<GeneratedPlaybook | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasJourney, setHasJourney] = useState(false);
  const [templateId, setTemplateId] = useState("preview");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [evidenceMap, setEvidenceMap] = useState<EvidenceMap | null>(null);
  const { statuses, setStatus } = useRecommendationStatus();

  useEffect(() => {
    const stored = sessionStorage.getItem("cx-mate-journey");
    if (stored) {
      setHasJourney(true);
      try {
        const parsed = JSON.parse(stored);
        setTemplateId(parsed.templateId || "preview");
        if (parsed.journey && parsed.onboardingData) {
          setEvidenceMap(buildEvidenceMap(parsed.onboardingData, parsed.journey));
        }
      } catch { /* ignore */ }
      const storedPlaybook = sessionStorage.getItem("cx-mate-playbook");
      if (storedPlaybook) {
        try { setPlaybook(JSON.parse(storedPlaybook)); } catch { /* ignore */ }
      }
    }
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const stored = sessionStorage.getItem("cx-mate-journey");
      if (!stored) throw new Error("No journey data found");
      const data = JSON.parse(stored);
      const journey: GeneratedJourney = data.journey;
      const onboardingData: OnboardingInput = data.onboardingData;
      const response = await fetch("/api/recommendations/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ journey, onboardingData }),
      });
      if (!response.ok) throw new Error("Failed to generate recommendations");
      const result = await response.json();
      setPlaybook(result.playbook);
      sessionStorage.setItem("cx-mate-playbook", JSON.stringify(result.playbook));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (key: string) => {
    const current = statuses[key] || "not_started";
    setStatus(key, statusCycle(current));
  };

  if (!hasJourney) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-2xl font-bold text-slate-900">No journey map yet</h1>
          <p className="text-slate-500">Complete onboarding first to generate your journey and playbook.</p>
          <Link href="/onboarding"><Button>Start Onboarding</Button></Link>
        </div>
      </main>
    );
  }

  if (!playbook) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-2xl font-bold text-slate-900">Your CX Playbook</h1>
          <p className="text-slate-500">Turn your journey map into a step-by-step action plan with templates and timelines.</p>
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3 border border-red-100">{error}</p>}
          <Button onClick={handleGenerate} disabled={loading} size="lg">
            {loading ? "Generating..." : "Generate My Playbook"}
          </Button>
        </div>
      </main>
    );
  }

  const allRecs = playbook.stagePlaybooks.flatMap((s) => s.recommendations);
  const totalDone = allRecs.filter((r) => statuses[makeKey(r)] === "done").length;
  const totalInProgress = allRecs.filter((r) => statuses[makeKey(r)] === "in_progress").length;
  const pct = allRecs.length ? Math.round((totalDone / allRecs.length) * 100) : 0;
  const mustDoCount = allRecs.filter((r) => r.priority === "must_do").length;

  const filteredStages = filter === "quick_wins"
    ? []
    : playbook.stagePlaybooks.map((sp) => ({
        ...sp,
        recommendations: filter === "must_do" ? sp.recommendations.filter((r) => r.priority === "must_do") : sp.recommendations,
      }));

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">CX Playbook</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">{playbook.companyName}</h1>
        </div>

        {/* Progress hero */}
        <div className="rounded-2xl bg-slate-900 text-white p-8 mb-8">
          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Progress</p>
              <div className="text-5xl font-bold">{pct}%</div>
            </div>
            <div className="grid grid-cols-3 gap-6 text-right">
              <div>
                <div className="text-xl font-bold">{allRecs.length}</div>
                <div className="text-xs text-slate-400">Total</div>
              </div>
              <div>
                <div className="text-xl font-bold">{mustDoCount}</div>
                <div className="text-xs text-slate-400">Must-do</div>
              </div>
              <div>
                <div className="text-xl font-bold">{totalDone}</div>
                <div className="text-xs text-slate-400">Done</div>
              </div>
            </div>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          {totalInProgress > 0 && (
            <p className="text-xs text-slate-500 mt-2">{totalInProgress} in progress</p>
          )}
        </div>

        {/* Week one checklist */}
        {playbook.weekOneChecklist && playbook.weekOneChecklist.length > 0 && (
          <div className="rounded-xl border bg-white p-5 mb-8">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">This week</h3>
            <ol className="space-y-2">
              {playbook.weekOneChecklist.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-slate-400 shrink-0 font-medium">{i + 1}.</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Filter */}
        <div className="flex gap-2 mb-8">
          {(["all", "must_do", "quick_wins"] as FilterMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                filter === mode ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
              }`}
            >
              {mode === "all" ? "All" : mode === "must_do" ? "Must do" : "Quick wins"}
            </button>
          ))}
        </div>

        {/* Quick wins */}
        {filter === "quick_wins" && playbook.quickWins && (
          <div className="mb-8">
            <p className="text-xs text-slate-400 mb-4">Highest impact, lowest effort. Start here.</p>
            <div>
              {playbook.quickWins.map((rec, i) => {
                const key = makeKey(rec);
                return (
                  <RecommendationCard
                    key={i}
                    rec={rec}
                    status={statuses[key] || "not_started"}
                    onStatusChange={() => handleStatusChange(key)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Stage playbooks */}
        {filter !== "quick_wins" && filteredStages.filter((s) => s.recommendations.length > 0).map((sp, i) => (
          <StageSection
            key={i}
            stagePlaybook={sp}
            statuses={statuses}
            onStatusChange={handleStatusChange}
            evidenceMap={evidenceMap}
          />
        ))}

        {/* Footer */}
        <div className="flex items-center justify-between pt-8 border-t mt-4">
          <Link href={`/confrontation?id=${templateId}`}>
            <Button variant="ghost" size="sm" className="text-slate-400">← CX Report</Button>
          </Link>
          <Link href={`/journey?id=${templateId}`}>
            <Button variant="outline" size="sm">Journey Map</Button>
          </Link>
        </div>

      </div>
    </main>
  );
}
