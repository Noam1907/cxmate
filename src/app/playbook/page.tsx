"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import type {
  GeneratedPlaybook,
  PlaybookRecommendation,
  StagePlaybook,
} from "@/lib/ai/recommendation-prompt";
import type { GeneratedJourney } from "@/lib/ai/journey-prompt";
import type { OnboardingInput } from "@/lib/validations/onboarding";

// ============================================
// Status tracking (local state for now)
// ============================================

type RecStatus = "not_started" | "in_progress" | "done";

function useRecommendationStatus() {
  const [statuses, setStatuses] = useState<Record<string, RecStatus>>({});

  useEffect(() => {
    const stored = sessionStorage.getItem("cx-mate-rec-status");
    if (stored) {
      try {
        setStatuses(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  const setStatus = (key: string, status: RecStatus) => {
    setStatuses((prev) => {
      const next = { ...prev, [key]: status };
      sessionStorage.setItem("cx-mate-rec-status", JSON.stringify(next));
      return next;
    });
  };

  return { statuses, setStatus };
}

function makeKey(rec: PlaybookRecommendation): string {
  return `${rec.stageName}:${rec.momentName}:${rec.action.slice(0, 40)}`;
}

// ============================================
// Priority / type styling
// ============================================

function priorityStyle(priority: string) {
  switch (priority) {
    case "must_do":
      return "bg-red-100 text-red-800 border-red-200";
    case "should_do":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "nice_to_have":
      return "bg-slate-100 text-slate-700 border-slate-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function priorityLabel(priority: string) {
  switch (priority) {
    case "must_do":
      return "Must Do";
    case "should_do":
      return "Should Do";
    case "nice_to_have":
      return "Nice to Have";
    default:
      return priority;
  }
}

function typeIcon(type: string) {
  switch (type) {
    case "email":
      return "@ ";
    case "call":
      return "# ";
    case "internal_process":
      return "> ";
    case "automation":
      return "~ ";
    case "measurement":
      return "% ";
    default:
      return "- ";
  }
}

function effortLabel(effort: string) {
  switch (effort) {
    case "15_min":
      return "15 min";
    case "1_hour":
      return "1 hour";
    case "half_day":
      return "Half day";
    case "multi_day":
      return "Multi-day";
    default:
      return effort;
  }
}

function statusLabel(status: RecStatus) {
  switch (status) {
    case "not_started":
      return "Not Started";
    case "in_progress":
      return "In Progress";
    case "done":
      return "Done";
  }
}

function statusCycle(current: RecStatus): RecStatus {
  switch (current) {
    case "not_started":
      return "in_progress";
    case "in_progress":
      return "done";
    case "done":
      return "not_started";
  }
}

function statusStyle(status: RecStatus) {
  switch (status) {
    case "not_started":
      return "bg-slate-100 text-slate-600 hover:bg-slate-200";
    case "in_progress":
      return "bg-blue-100 text-blue-700 hover:bg-blue-200";
    case "done":
      return "bg-emerald-100 text-emerald-700 hover:bg-emerald-200";
  }
}

// ============================================
// Recommendation Card
// ============================================

function RecommendationCard({
  rec,
  status,
  onStatusChange,
}: {
  rec: PlaybookRecommendation;
  status: RecStatus;
  onStatusChange: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-lg border p-4 transition-all ${
        status === "done" ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Status toggle */}
        <button
          onClick={onStatusChange}
          className={`mt-0.5 shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center text-xs transition-colors ${
            status === "done"
              ? "bg-emerald-500 border-emerald-500 text-white"
              : status === "in_progress"
              ? "bg-blue-100 border-blue-400 text-blue-600"
              : "bg-white border-slate-300"
          }`}
          title={statusLabel(status)}
        >
          {status === "done" ? "v" : status === "in_progress" ? "-" : ""}
        </button>

        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div
              className="font-medium text-sm cursor-pointer"
              onClick={() => setExpanded(!expanded)}
            >
              <span className="opacity-40 font-mono">{typeIcon(rec.type)}</span>
              {rec.action}
            </div>
            <div className="flex gap-1 shrink-0">
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full border ${priorityStyle(
                  rec.priority
                )}`}
              >
                {priorityLabel(rec.priority)}
              </span>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span>{rec.owner}</span>
            <span>-</span>
            <span>{rec.timing}</span>
            <span>-</span>
            <span>{effortLabel(rec.effort)}</span>
          </div>

          {/* Expanded details */}
          {expanded && (
            <div
              className="mt-3 pt-3 border-t space-y-3 cursor-pointer"
              onClick={() => setExpanded(false)}
            >
              {/* Template */}
              {rec.template && (
                <div className="rounded-md bg-slate-50 border p-3">
                  <div className="text-xs font-semibold mb-1.5">Template</div>
                  <div className="text-sm whitespace-pre-line leading-relaxed text-slate-700">
                    {rec.template}
                  </div>
                </div>
              )}

              {/* Expected outcome */}
              <div className="rounded-md bg-emerald-50 border border-emerald-200 p-3">
                <div className="text-xs font-semibold text-emerald-800 mb-1">
                  Expected outcome
                </div>
                <div className="text-xs text-emerald-700">
                  {rec.expectedOutcome}
                </div>
              </div>

              {/* Measure with */}
              <div className="rounded-md bg-blue-50 border border-blue-200 p-3">
                <div className="text-xs font-semibold text-blue-800 mb-1">
                  Measure with
                </div>
                <div className="text-xs text-blue-700">{rec.measureWith}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Stage Section
// ============================================

function StageSection({
  stagePlaybook,
  statuses,
  onStatusChange,
}: {
  stagePlaybook: StagePlaybook;
  statuses: Record<string, RecStatus>;
  onStatusChange: (key: string) => void;
}) {
  const doneCount = stagePlaybook.recommendations.filter(
    (r) => statuses[makeKey(r)] === "done"
  ).length;
  const total = stagePlaybook.recommendations.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-xs ${
                stagePlaybook.stageType === "sales"
                  ? "border-blue-200 text-blue-700"
                  : "border-emerald-200 text-emerald-700"
              }`}
            >
              {stagePlaybook.stageType}
            </Badge>
            <CardTitle className="text-lg">{stagePlaybook.stageName}</CardTitle>
          </div>
          <span className="text-xs text-muted-foreground">
            {doneCount}/{total} done
          </span>
        </div>
        <CardDescription className="text-sm font-medium">
          Top priority: {stagePlaybook.topPriority}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {stagePlaybook.recommendations.map((rec, i) => {
          const key = makeKey(rec);
          const status = statuses[key] || "not_started";
          return (
            <RecommendationCard
              key={i}
              rec={rec}
              status={status}
              onStatusChange={() => onStatusChange(key)}
            />
          );
        })}
      </CardContent>
    </Card>
  );
}

// ============================================
// Filter tabs
// ============================================

type FilterMode = "all" | "must_do" | "quick_wins";

// ============================================
// Main Page
// ============================================

export default function PlaybookPage() {
  const [playbook, setPlaybook] = useState<GeneratedPlaybook | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasJourney, setHasJourney] = useState(false);
  const [filter, setFilter] = useState<FilterMode>("all");
  const { statuses, setStatus } = useRecommendationStatus();

  useEffect(() => {
    // Check if we have journey data
    const stored = sessionStorage.getItem("cx-mate-journey");
    if (stored) {
      setHasJourney(true);

      // Check if we already generated a playbook
      const storedPlaybook = sessionStorage.getItem("cx-mate-playbook");
      if (storedPlaybook) {
        try {
          setPlaybook(JSON.parse(storedPlaybook));
        } catch {
          // ignore, will regenerate
        }
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

      if (!response.ok) {
        throw new Error("Failed to generate recommendations");
      }

      const result = await response.json();
      setPlaybook(result.playbook);
      sessionStorage.setItem(
        "cx-mate-playbook",
        JSON.stringify(result.playbook)
      );
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

  // No journey data
  if (!hasJourney) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-2xl font-bold">No journey map yet</h1>
          <p className="text-muted-foreground">
            Complete the onboarding to generate your journey, then come back
            here for your actionable playbook.
          </p>
          <Link href="/onboarding">
            <Button>Start Onboarding</Button>
          </Link>
        </div>
      </main>
    );
  }

  // Has journey but no playbook yet
  if (!playbook) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-2xl font-bold">Your CX Playbook</h1>
          <p className="text-muted-foreground">
            Turn your journey map into a step-by-step playbook with specific
            actions, templates, and timelines your team can execute this week.
          </p>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          )}
          <Button onClick={handleGenerate} disabled={loading} size="lg">
            {loading ? "Generating playbook..." : "Generate My Playbook"}
          </Button>
        </div>
      </main>
    );
  }

  // Compute stats
  const allRecs = playbook.stagePlaybooks.flatMap((s) => s.recommendations);
  const totalDone = allRecs.filter(
    (r) => statuses[makeKey(r)] === "done"
  ).length;
  const totalInProgress = allRecs.filter(
    (r) => statuses[makeKey(r)] === "in_progress"
  ).length;

  // Filter stagePlaybooks based on mode
  const filteredStages =
    filter === "quick_wins"
      ? [] // Quick wins shown separately
      : playbook.stagePlaybooks.map((sp) => ({
          ...sp,
          recommendations:
            filter === "must_do"
              ? sp.recommendations.filter((r) => r.priority === "must_do")
              : sp.recommendations,
        }));

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            CX Playbook
          </div>
          <h1 className="text-3xl font-bold">{playbook.companyName}</h1>
          <div className="flex items-center justify-center gap-3">
            <Badge variant="outline">
              {playbook.totalRecommendations} actions
            </Badge>
            <Badge variant="destructive">{playbook.mustDoCount} must-do</Badge>
            <Badge variant="secondary">
              {totalDone}/{allRecs.length} done
            </Badge>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Progress</span>
            <span>
              {totalDone} done, {totalInProgress} in progress
            </span>
          </div>
          <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{
                width: `${allRecs.length ? (totalDone / allRecs.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Week One Checklist */}
        {playbook.weekOneChecklist && playbook.weekOneChecklist.length > 0 && (
          <Card className="mb-8 border-amber-200 bg-gradient-to-br from-amber-50/50 to-transparent">
            <CardHeader>
              <CardTitle className="text-base text-amber-900">
                This week&apos;s checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {playbook.weekOneChecklist.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-amber-800"
                  >
                    <span className="text-amber-500 mt-0.5 shrink-0">
                      {i + 1}.
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(["all", "must_do", "quick_wins"] as FilterMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                filter === mode
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {mode === "all"
                ? "All"
                : mode === "must_do"
                ? "Must Do"
                : "Quick Wins"}
            </button>
          ))}
        </div>

        {/* Quick Wins view */}
        {filter === "quick_wins" && playbook.quickWins && (
          <Card className="mb-6 border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-transparent">
            <CardHeader>
              <CardTitle className="text-lg text-emerald-900">
                Quick Wins
              </CardTitle>
              <CardDescription>
                Highest impact, lowest effort. Start here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {playbook.quickWins.map((rec, i) => {
                const key = makeKey(rec);
                const status = statuses[key] || "not_started";
                return (
                  <RecommendationCard
                    key={i}
                    rec={rec}
                    status={status}
                    onStatusChange={() => handleStatusChange(key)}
                  />
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Stage-by-stage playbooks */}
        {filter !== "quick_wins" && (
          <div className="space-y-6">
            {filteredStages
              .filter((s) => s.recommendations.length > 0)
              .map((sp, i) => (
                <StageSection
                  key={i}
                  stagePlaybook={sp}
                  statuses={statuses}
                  onStatusChange={handleStatusChange}
                />
              ))}
          </div>
        )}

        {/* Footer navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t">
          <Link href="/confrontation?id=preview">
            <Button variant="ghost">Back to CX Report</Button>
          </Link>
          <Link href="/journey?id=preview">
            <Button variant="outline">View Journey Map</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
