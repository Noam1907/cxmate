"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { GeneratedJourney } from "@/lib/ai/journey-prompt";
import type { GeneratedPlaybook } from "@/lib/ai/recommendation-prompt";
import type { OnboardingInput } from "@/lib/validations/onboarding";
import {
  buildEvidenceMap,
  getInsightAnnotations,
  type EvidenceMap,
} from "@/lib/evidence-matching";

// ============================================
// Data loading
// ============================================

interface DashboardData {
  journey: GeneratedJourney | null;
  playbook: GeneratedPlaybook | null;
  onboarding: OnboardingInput | null;
  recStatuses: Record<string, string>;
  templateId: string;
}

function loadLocalDashboardData(): DashboardData {
  const data: DashboardData = {
    journey: null,
    playbook: null,
    onboarding: null,
    recStatuses: {},
    templateId: "preview",
  };

  try {
    const journeyRaw = sessionStorage.getItem("cx-mate-journey");
    if (journeyRaw) {
      const parsed = JSON.parse(journeyRaw);
      data.journey = parsed.journey || null;
      data.onboarding = parsed.onboardingData || null;
      data.templateId = parsed.templateId || "preview";
    }
  } catch {
    // ignore
  }

  try {
    const playbookRaw = sessionStorage.getItem("cx-mate-playbook");
    if (playbookRaw) {
      data.playbook = JSON.parse(playbookRaw);
    }
  } catch {
    // ignore
  }

  try {
    const statusRaw = localStorage.getItem("cx-mate-rec-status");
    if (statusRaw) {
      data.recStatuses = JSON.parse(statusRaw);
    }
  } catch {
    // ignore
  }

  return data;
}

// ============================================
// Dollar parsing
// ============================================

function parseDollarValue(impact: string): number | null {
  const match = impact.match(/\$[\d,.]+\s*[KkMmBb]?/);
  if (!match) return null;
  let raw = match[0].replace(/[$,]/g, "");
  let multiplier = 1;
  if (/[Kk]$/.test(raw)) {
    multiplier = 1000;
    raw = raw.replace(/[Kk]$/, "");
  } else if (/[Mm]$/.test(raw)) {
    multiplier = 1_000_000;
    raw = raw.replace(/[Mm]$/, "");
  }
  const num = parseFloat(raw);
  return isNaN(num) ? null : num * multiplier;
}

function formatDollarCompact(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${Math.round(value)}`;
}

// ============================================
// Stats helpers
// ============================================

function computeJourneyStats(journey: GeneratedJourney) {
  const totalStages = journey.stages.length;
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
  const highRiskInsights = (journey.confrontationInsights || []).filter(
    (i) => i.likelihood === "high"
  ).length;

  const projections = journey.impactProjections || [];
  const values = projections
    .map((p) => parseDollarValue(p.potentialImpact))
    .filter((v): v is number => v !== null);
  const totalImpact = values.reduce((sum, v) => sum + v, 0);

  return {
    totalStages,
    totalMoments,
    criticalMoments,
    highRiskInsights,
    totalImpact,
    hasImpactData: values.length > 0,
  };
}

function computePlaybookStats(
  playbook: GeneratedPlaybook,
  statuses: Record<string, string>
) {
  const allRecs = playbook.stagePlaybooks.flatMap((s) => s.recommendations);
  const total = allRecs.length;
  const done = Object.values(statuses).filter((s) => s === "done").length;
  const inProgress = Object.values(statuses).filter(
    (s) => s === "in_progress"
  ).length;
  const mustDo = allRecs.filter((r) => r.priority === "must_do").length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return { total, done, inProgress, mustDo, pct };
}

// ============================================
// Main Dashboard
// ============================================

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    setData(loadLocalDashboardData());
  }, []);

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </main>
    );
  }

  const hasJourney = !!data.journey;
  const hasPlaybook = !!data.playbook;

  // Empty state
  if (!hasJourney) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center space-y-6 max-w-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/8 mx-auto">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary uppercase tracking-widest">Dashboard</p>
            <h1 className="text-3xl font-bold tracking-tight">Welcome to CX Mate</h1>
            <p className="text-muted-foreground leading-relaxed">
              Start by telling us about your business. In under 5 minutes,
              you&apos;ll have a complete CX journey map, intelligence report, and
              actionable playbook.
            </p>
          </div>
          <Link href="/onboarding">
            <Button size="lg" className="rounded-xl px-8 py-6 text-base font-semibold shadow-md hover:shadow-lg transition-all">
              Start Onboarding
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const journeyStats = computeJourneyStats(data.journey!);
  const playbookStats = hasPlaybook
    ? computePlaybookStats(data.playbook!, data.recStatuses)
    : null;

  const companyName = data.onboarding?.companyName || "Your Company";
  const tid = data.templateId || "preview";
  const topInsights = (data.journey!.confrontationInsights || [])
    .filter((i) => i.likelihood === "high")
    .slice(0, 3);

  const evidenceMap = data.onboarding
    ? buildEvidenceMap(data.onboarding, data.journey!)
    : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="space-y-2 mb-10">
          <p className="text-sm font-medium text-primary uppercase tracking-widest">
            Dashboard
          </p>
          <h1 className="text-4xl font-bold tracking-tight">{companyName}</h1>
          <p className="text-lg text-muted-foreground">
            Your CX overview at a glance.
          </p>
        </div>

        {/* Hero Impact Card */}
        {journeyStats.hasImpactData && (
          <div className="rounded-2xl bg-slate-900 text-white p-8 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                Estimated Annual CX Impact
              </span>
            </div>
            <div className="text-5xl font-bold tracking-tight mb-1">
              {formatDollarCompact(Math.round(journeyStats.totalImpact * 0.7))} &ndash;{" "}
              {formatDollarCompact(Math.round(journeyStats.totalImpact * 1.3))}
            </div>
            <div className="text-sm text-slate-400">per year</div>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="rounded-xl border bg-white p-5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
              </svg>
            </div>
            <div className="text-xs text-muted-foreground mb-1">Journey Stages</div>
            <div className="text-3xl font-bold">{journeyStats.totalStages}</div>
          </div>
          <div className="rounded-xl border bg-white p-5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center mb-3">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <div className="text-xs text-muted-foreground mb-1">Moments Mapped</div>
            <div className="text-3xl font-bold">{journeyStats.totalMoments}</div>
          </div>
          <div className="rounded-xl border bg-white p-5">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center mb-3">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div className="text-xs text-muted-foreground mb-1">Critical Risks</div>
            <div className={`text-3xl font-bold ${journeyStats.criticalMoments > 0 ? "text-red-700" : ""}`}>
              {journeyStats.criticalMoments}
            </div>
          </div>
          <div className="rounded-xl border bg-white p-5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center mb-3">
              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div className="text-xs text-muted-foreground mb-1">High-Risk Patterns</div>
            <div className={`text-3xl font-bold ${journeyStats.highRiskInsights > 0 ? "text-amber-700" : ""}`}>
              {journeyStats.highRiskInsights}
            </div>
          </div>
        </div>

        {/* Playbook Progress */}
        {playbookStats ? (
          <div className="rounded-2xl border bg-white p-6 mb-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold">Playbook Progress</h2>
                <p className="text-sm text-muted-foreground">
                  {playbookStats.done} of {playbookStats.total} actions complete
                  {playbookStats.inProgress > 0 &&
                    ` \u00B7 ${playbookStats.inProgress} in progress`}
                </p>
              </div>
              <div className="text-3xl font-bold">
                {playbookStats.pct}
                <span className="text-lg text-muted-foreground">%</span>
              </div>
            </div>
            <div className="h-3 rounded-full bg-slate-100 overflow-hidden mb-4">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${playbookStats.pct}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="font-bold text-red-700">{playbookStats.mustDo}</span>{" "}
                  <span className="text-muted-foreground">must-do</span>
                </div>
                <div>
                  <span className="font-bold text-emerald-700">{playbookStats.done}</span>{" "}
                  <span className="text-muted-foreground">completed</span>
                </div>
              </div>
              <Link href="/playbook">
                <Button variant="outline" size="sm">Go to Playbook</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed bg-white p-6 mb-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Playbook</h2>
                <p className="text-sm text-muted-foreground">
                  Generate your playbook to get step-by-step actions, templates, and timelines.
                </p>
              </div>
              <Link href="/playbook">
                <Button>Generate Playbook</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Top Risks */}
        {topInsights.length > 0 && (
          <div className="rounded-2xl border border-red-200 bg-white p-6 mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-red-900">Top Risks</h2>
              <Badge variant="destructive" className="text-xs">
                {topInsights.length} high priority
              </Badge>
            </div>
            <div className="space-y-3">
              {topInsights.map((insight, i) => {
                const ann = evidenceMap
                  ? getInsightAnnotations(insight.pattern, evidenceMap)
                  : null;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-red-700">{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold">{insight.pattern}</div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {insight.immediateAction}
                      </p>
                      {ann && ann.painPoints.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {ann.painPoints.map((pp, j) => (
                            <span key={j} className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200 font-medium">
                              From your input: {pp}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t">
              <Link href={`/confrontation?id=${tid}`}>
                <Button variant="ghost" size="sm">See full report</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Quick Navigation */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Link href={`/confrontation?id=${tid}`}>
            <div className="group rounded-2xl border bg-white p-5 hover:shadow-md transition-all cursor-pointer h-full">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center mb-3">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                </svg>
              </div>
              <h3 className="text-base font-semibold mb-1 group-hover:text-primary transition-colors">CX Report</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Intelligence insights and impact projections</p>
            </div>
          </Link>
          <Link href={`/journey?id=${tid}`}>
            <div className="group rounded-2xl border bg-white p-5 hover:shadow-md transition-all cursor-pointer h-full">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold mb-1 group-hover:text-primary transition-colors">Journey Map</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Full stage-by-stage journey with moments of truth</p>
            </div>
          </Link>
          <Link href="/onboarding">
            <div className="group rounded-2xl border border-dashed bg-white p-5 hover:shadow-md transition-all cursor-pointer h-full">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center mb-3">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                </svg>
              </div>
              <h3 className="text-base font-semibold mb-1 group-hover:text-primary transition-colors">Re-run Analysis</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Start fresh with updated company information</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
