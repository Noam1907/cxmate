"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { GeneratedPlaybook, PlaybookRecommendation, StagePlaybook } from "@/lib/ai/recommendation-prompt";
import type { GeneratedJourney } from "@/lib/ai/journey-prompt";
import type { OnboardingInput } from "@/lib/validations/onboarding";
import { buildEvidenceMap, getMomentAnnotations, type EvidenceMap } from "@/lib/evidence-matching";
import { track } from "@/lib/analytics";
import { Check, ChartBar } from "@phosphor-icons/react";
import { ExportPdfButton } from "@/components/ui/export-pdf-button";
import { PrintCover } from "@/components/pdf/print-cover";
import { SaveResultsBanner } from "@/components/ui/save-results-banner";
import { usePlanTier } from "@/hooks/use-plan-tier";

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
    <button onClick={handle} className="text-xs px-2 py-0.5 rounded border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors shrink-0">
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
    ? "bg-primary border-primary text-white"
    : status === "in_progress"
    ? "border-primary/40 bg-white"
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
          {status === "done" && <Check size={12} weight="bold" className="text-white" />}
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
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{priorityLabel(rec.priority)}</span>
              )}
              <span className="text-xs text-slate-400">{effortLabel(rec.effort)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{rec.owner}</span>
            <span className="text-xs text-slate-400">{rec.timing}</span>
          </div>

          {expanded && (
            <div className="mt-3 space-y-2" onClick={() => setExpanded(false)}>
              {rec.template && (
                <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Template</span>
                    <CopyButton text={rec.template} />
                  </div>
                  <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">{rec.template}</p>
                </div>
              )}
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Expected outcome</p>
                <p className="text-xs text-slate-600">{rec.expectedOutcome}</p>
              </div>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Measure with</p>
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
      {/* Measurement plan chip */}
      {stagePlaybook.measurementPlan && (
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-xs font-medium text-primary bg-primary/10 border border-primary/15 px-2 py-0.5 rounded-full flex items-center gap-1">
            <ChartBar size={14} weight="duotone" />
            <span>Measure: {stagePlaybook.measurementPlan}</span>
          </span>
        </div>
      )}
      {/* Thin progress bar */}
      <div className="h-px bg-slate-100 mb-4 overflow-hidden rounded-full">
        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
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
  const { canAccess, loading: tierLoading } = usePlanTier();
  const [playbook, setPlaybook] = useState<GeneratedPlaybook | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasJourney, setHasJourney] = useState(false);
  const [templateId, setTemplateId] = useState("preview");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [evidenceMap, setEvidenceMap] = useState<EvidenceMap | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [currentTools, setCurrentTools] = useState<string>("");
  // true when background pre-generation is in flight (started during onboarding)
  const [preparing, setPreparing] = useState(false);
  const { statuses, setStatus } = useRecommendationStatus();

  // ── Tier gate: playbook is locked for free users ──
  if (!tierLoading && !canAccess("playbook")) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <span className="text-2xl">📋</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900">Your playbook is ready</h1>
            <p className="text-slate-500 leading-relaxed">
              We built a prioritized action plan for your business — with templates, timelines, and measurement checkpoints. Get the full analysis to access it.
            </p>
          </div>
          <Link href="/pricing">
            <Button size="lg" className="w-full sm:w-auto">
              Get My Full Analysis — $149
            </Button>
          </Link>
          <p className="text-xs text-slate-400">
            Includes full CX Report details, playbook, and PDF export
          </p>
        </div>
      </main>
    );
  }

  useEffect(() => {
    async function init() {
      let tid = "preview";
      let hasJourneyData = false;

      // 1. Try sessionStorage first (fastest — same-session data)
      const stored = sessionStorage.getItem("cx-mate-journey");
      if (stored) {
        hasJourneyData = true;
        try {
          const parsed = JSON.parse(stored);
          tid = parsed.templateId || "preview";
          setTemplateId(tid);
          if (parsed.journey && parsed.onboardingData) {
            setEvidenceMap(buildEvidenceMap(parsed.onboardingData, parsed.journey));
            const name = parsed.onboardingData?.userName?.split(" ")[0] || "";
            if (name) setFirstName(name);
            const tools = parsed.onboardingData?.currentTools || "";
            if (tools) setCurrentTools(tools);
          }
        } catch { /* ignore */ }
      }

      // 2. If no sessionStorage, try loading from Supabase (authenticated users returning)
      if (!hasJourneyData) {
        try {
          const res = await fetch("/api/journey/default");
          if (res.ok) {
            const data = await res.json();
            if (data.journey && Array.isArray(data.journey.stages)) {
              hasJourneyData = true;
              tid = data.templateId || "preview";
              setTemplateId(tid);
              // Extract company name from journey name
              const journeyName = (data.journey.name as string) || "";
              const companyName = journeyName.replace(/ CX Journey$/i, "").trim();
              if (companyName) setFirstName(""); // No user name available from DB
              // Cache in sessionStorage for this session
              sessionStorage.setItem("cx-mate-journey", JSON.stringify({
                journey: data.journey,
                templateId: tid,
                onboardingData: companyName ? { companyName } : null,
              }));
            }
          }
        } catch { /* fall through */ }
      }

      if (!hasJourneyData) return;
      setHasJourney(true);

      // 3. Try Supabase-persisted playbook first (authenticated users)
      if (tid !== "preview") {
        try {
          const res = await fetch(`/api/playbook?templateId=${tid}`);
          if (res.ok) {
            const data = await res.json();
            if (data.playbook) {
              // Guard against stale empty playbooks (generated before max_tokens fix)
              const hasRecs = Array.isArray(data.playbook.stagePlaybooks) &&
                data.playbook.stagePlaybooks.some(
                  (s: StagePlaybook) => Array.isArray(s?.recommendations) && s.recommendations.length > 0
                );
              if (hasRecs) {
                setPlaybook(data.playbook);
                return;
              }
              // Empty playbook — fall through to show regeneration UI
            }
          }
        } catch { /* fall through to sessionStorage */ }
      }

      // 4. Fall back to sessionStorage (anonymous / not yet persisted)
      const storedPlaybook = sessionStorage.getItem("cx-mate-playbook");
      if (storedPlaybook) {
        try { setPlaybook(JSON.parse(storedPlaybook)); } catch { /* ignore */ }
      } else {
        // No playbook yet — background pre-generation may still be in flight
        setPreparing(true);
      }
    }
    init();
  }, []);

  // Poll sessionStorage every 2s waiting for pre-generated playbook to land
  useEffect(() => {
    if (!preparing || playbook) return;
    const poll = setInterval(() => {
      const stored = sessionStorage.getItem("cx-mate-playbook");
      if (stored) {
        try {
          setPlaybook(JSON.parse(stored));
          setPreparing(false);
        } catch { /* ignore */ }
      }
    }, 2000);
    // After 30s give up polling — playbook should already be in sessionStorage
    // (generation now happens synchronously during onboarding loading screen)
    const giveUp = setTimeout(() => {
      clearInterval(poll);
      setPreparing(false);
    }, 30 * 1000);
    return () => { clearInterval(poll); clearTimeout(giveUp); };
  }, [preparing, playbook]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    track("playbook_generation_started", { template_id: templateId || undefined });
    try {
      const stored = sessionStorage.getItem("cx-mate-journey");
      if (!stored) throw new Error("No journey data found");
      const data = JSON.parse(stored);
      const journey: GeneratedJourney = data.journey;
      const onboardingData: OnboardingInput = data.onboardingData;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 290_000); // 290s — slightly under Vercel's 300s
      const response = await fetch("/api/recommendations/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ journey, onboardingData }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!response.ok) {
        let errMsg = "Failed to generate recommendations";
        try {
          const errBody = await response.json();
          if (errBody?.details) errMsg = `Validation error: ${JSON.stringify(errBody.details).slice(0, 200)}`;
          else if (errBody?.detail) errMsg = errBody.detail;
          else if (errBody?.error) errMsg = errBody.error;
        } catch { /* ignore parse error */ }
        throw new Error(errMsg);
      }
      const result = await response.json();
      const generatedPlaybook: GeneratedPlaybook = result.playbook;
      setPlaybook(generatedPlaybook);
      sessionStorage.setItem("cx-mate-playbook", JSON.stringify(generatedPlaybook));
      track("playbook_generation_succeeded", {
        recommendation_count: generatedPlaybook.stagePlaybooks?.flatMap((s) => s.recommendations).length,
      });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Something went wrong";
      setError(errMsg);
      track("playbook_generation_failed", { error: errMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (key: string) => {
    const current = statuses[key] || "not_started";
    const next = statusCycle(current);
    setStatus(key, next);
    const allRecs = (Array.isArray(playbook?.stagePlaybooks) ? playbook.stagePlaybooks : []).flatMap((s) => Array.isArray(s?.recommendations) ? s.recommendations : []);
    const rec = allRecs.find((r) => makeKey(r) === key);
    track("recommendation_status_changed", {
      status: next,
      recommendation_key: key,
      priority: rec?.priority,
    });
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
    const isGenerating = loading || preparing;
    return (
      <main className="min-h-screen py-16 px-6">
        <div className="max-w-lg mx-auto space-y-8">
          {isGenerating ? (
            <>
              <div className="text-center space-y-3">
                <h1 className="text-2xl font-bold text-slate-900">Building your playbook</h1>
                <p className="text-slate-500">
                  Turning your journey map into prioritized actions you can start this week.
                </p>
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden max-w-xs mx-auto">
                  <div className="h-full bg-primary rounded-full animate-pulse w-2/3" />
                </div>
              </div>

              {/* What's being built — AI-first framing */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">What&apos;s being built</p>
                  {currentTools && (
                    <span className="text-xs text-primary font-medium bg-primary/8 px-2 py-0.5 rounded-full">
                      Wiring in: {currentTools.split(",")[0].trim()}
                    </span>
                  )}
                </div>
                <div className="space-y-3.5">
                  {[
                    {
                      color: "bg-teal-50 text-teal-600",
                      icon: "⚡",
                      title: "AI-reasoned, not templated",
                      desc: "Every action is derived from the risks and moments we found in your specific journey — nothing generic",
                    },
                    {
                      color: "bg-violet-50 text-violet-600",
                      icon: "🔧",
                      title: "Your stack, extended",
                      desc: "Recommendations built around the tools you already use, plus AI-native additions you should add",
                    },
                    {
                      color: "bg-amber-50 text-amber-600",
                      icon: "📊",
                      title: "Measurement per stage",
                      desc: "NPS, CSAT, and CES checkpoints built in — you'll know what success looks like before you start",
                    },
                    {
                      color: "bg-sky-50 text-sky-600",
                      icon: "🤖",
                      title: "Ready for AI asset creation",
                      desc: "Export to NotebookLM, Claude, or ChatGPT — turn your playbook into board decks, onboarding docs, and QBRs in minutes",
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-lg ${item.color} flex items-center justify-center shrink-0 text-sm`}>
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{item.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center space-y-5">
              <h1 className="text-2xl font-bold text-slate-900">Your CX Playbook</h1>
              <p className="text-slate-500">AI-built action plan, matched to your stack — with measurement checkpoints and assets you can extend with any AI tool.</p>
              {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3 border border-red-100">{error}</p>}
              <Button onClick={handleGenerate} disabled={loading} size="lg">
                Generate My Playbook
              </Button>
            </div>
          )}
        </div>
      </main>
    );
  }

  const stagePlaybooks = Array.isArray(playbook.stagePlaybooks) ? playbook.stagePlaybooks : [];
  const allRecs = stagePlaybooks.flatMap((s) => Array.isArray(s?.recommendations) ? s.recommendations : []);
  const totalDone = allRecs.filter((r) => statuses[makeKey(r)] === "done").length;
  const totalInProgress = allRecs.filter((r) => statuses[makeKey(r)] === "in_progress").length;
  const pct = allRecs.length ? Math.round((totalDone / allRecs.length) * 100) : 0;
  const mustDoCount = allRecs.filter((r) => r.priority === "must_do").length;

  const filteredStages = filter === "quick_wins"
    ? []
    : stagePlaybooks.map((sp) => ({
        ...sp,
        recommendations: filter === "must_do" ? sp.recommendations.filter((r) => r.priority === "must_do") : sp.recommendations,
      }));

  return (
    <main className="min-h-screen">
      {/* PDF cover page — invisible on screen, page 1 of exported PDF */}
      <PrintCover
        firstName={firstName || undefined}
        companyName={playbook.companyName || undefined}
        documentType="CX Playbook"
      />

      <div className="max-w-2xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-10 flex items-start justify-between gap-4">
          <div>
            {firstName && (
              <p className="text-sm text-primary font-medium mb-1">
                {pct > 0 ? `Keep it up, ${firstName}.` : `Let's get started, ${firstName}.`}
              </p>
            )}
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">CX Playbook</p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-800">{playbook.companyName}</h1>
          </div>
          {canAccess("pdf_export") && (
            <ExportPdfButton page="playbook" title={`${playbook.companyName} — CX Playbook`} />
          )}
        </div>

        {/* Save banner — anonymous users only */}
        <SaveResultsBanner isPreview={templateId === "preview"} companyName={playbook.companyName} />

        {/* Progress hero */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-teal-900 text-white p-8 mb-8">
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
                filter === mode ? "bg-primary text-white border-primary" : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
              }`}
            >
              {mode === "all" ? "All" : mode === "must_do" ? "Must do" : "Quick wins"}
            </button>
          ))}
        </div>

        {/* Quick wins */}
        {filter === "quick_wins" && (
          <div className="mb-8">
            {playbook.quickWins && playbook.quickWins.length > 0 ? (
              <>
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
              </>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
                <p className="text-sm font-medium text-slate-500">No quick wins identified yet</p>
                <p className="text-xs text-slate-400 mt-1">Try regenerating your playbook to get quick win recommendations.</p>
              </div>
            )}
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
