"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { GeneratedJourney } from "@/lib/ai/journey-prompt";
import type { GeneratedPlaybook } from "@/lib/ai/recommendation-prompt";
import type { OnboardingInput } from "@/lib/validations/onboarding";
import { buildEvidenceMap, getInsightAnnotations } from "@/lib/evidence-matching";
import { track } from "@/lib/analytics";

// ─── Data loading ─────────────────────────────────────────────────────────────

interface DashboardData {
  journey: GeneratedJourney | null;
  playbook: GeneratedPlaybook | null;
  onboarding: OnboardingInput | null;
  recStatuses: Record<string, string>;
  templateId: string;
}

function loadLocalDashboardData(): DashboardData {
  const data: DashboardData = { journey: null, playbook: null, onboarding: null, recStatuses: {}, templateId: "preview" };
  try {
    const raw = sessionStorage.getItem("cx-mate-journey");
    if (raw) {
      const parsed = JSON.parse(raw);
      data.journey = parsed.journey || null;
      data.onboarding = parsed.onboardingData || null;
      data.templateId = parsed.templateId || "preview";
    }
  } catch { /* ignore */ }
  try {
    const raw = sessionStorage.getItem("cx-mate-playbook");
    if (raw) data.playbook = JSON.parse(raw);
  } catch { /* ignore */ }
  try {
    const raw = localStorage.getItem("cx-mate-rec-status");
    if (raw) data.recStatuses = JSON.parse(raw);
  } catch { /* ignore */ }
  return data;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseDollarValue(impact: string): number | null {
  const match = impact.match(/\$[\d,.]+\s*[KkMmBb]?/);
  if (!match) return null;
  let raw = match[0].replace(/[$,]/g, "");
  let multiplier = 1;
  if (/[Kk]$/.test(raw)) { multiplier = 1000; raw = raw.replace(/[Kk]$/, ""); }
  else if (/[Mm]$/.test(raw)) { multiplier = 1_000_000; raw = raw.replace(/[Mm]$/, ""); }
  const num = parseFloat(raw);
  return isNaN(num) ? null : num * multiplier;
}

function formatDollarCompact(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${Math.round(value)}`;
}

function computeJourneyStats(journey: GeneratedJourney) {
  const totalStages = journey.stages.length;
  const totalMoments = journey.stages.reduce((s, st) => s + st.meaningfulMoments.length, 0);
  const criticalMoments = journey.stages.reduce((s, st) => s + st.meaningfulMoments.filter((m) => m.severity === "critical").length, 0);
  const highRiskInsights = (journey.confrontationInsights || []).filter((i) => i.likelihood === "high").length;
  const projections = journey.impactProjections || [];
  const values = projections.map((p) => parseDollarValue(p.potentialImpact)).filter((v): v is number => v !== null);
  const totalImpact = values.reduce((s, v) => s + v, 0);
  return { totalStages, totalMoments, criticalMoments, highRiskInsights, totalImpact, hasImpactData: values.length > 0 };
}

function computePlaybookStats(playbook: GeneratedPlaybook, statuses: Record<string, string>) {
  const allRecs = playbook.stagePlaybooks.flatMap((s) => s.recommendations);
  const total = allRecs.length;
  const done = Object.values(statuses).filter((s) => s === "done").length;
  const inProgress = Object.values(statuses).filter((s) => s === "in_progress").length;
  const mustDo = allRecs.filter((r) => r.priority === "must_do").length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return { total, done, inProgress, mustDo, pct };
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const loaded = loadLocalDashboardData();
    setData(loaded);
    if (loaded.journey) {
      track("dashboard_viewed", { template_id: loaded.templateId || undefined });
    }
  }, []);

  if (!data) {
    return <main className="min-h-screen flex items-center justify-center"><p className="text-slate-400">Loading...</p></main>;
  }

  if (!data.journey) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center space-y-5 max-w-md">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Dashboard</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome to CX Mate</h1>
          <p className="text-slate-500 leading-relaxed">Tell us about your business. In under 5 minutes, you&apos;ll have a complete CX journey map, intelligence report, and actionable playbook.</p>
          <Link href="/onboarding">
            <Button size="lg" className="mt-2">Start Onboarding</Button>
          </Link>
        </div>
      </main>
    );
  }

  const jStats = computeJourneyStats(data.journey);
  const pStats = data.playbook ? computePlaybookStats(data.playbook, data.recStatuses) : null;
  const companyName = data.onboarding?.companyName || "Your Company";
  const tid = data.templateId || "preview";
  const topInsights = (data.journey.confrontationInsights || []).filter((i) => i.likelihood === "high").slice(0, 3);
  const evidenceMap = data.onboarding ? buildEvidenceMap(data.onboarding, data.journey) : null;

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Dashboard</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">{companyName}</h1>
        </div>

        {/* Hero impact */}
        {jStats.hasImpactData && (
          <div className="rounded-2xl bg-slate-900 text-white p-8 mb-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Estimated Annual CX Impact</p>
            <div className="text-5xl font-bold tracking-tight">
              {formatDollarCompact(Math.round(jStats.totalImpact * 0.7))} – {formatDollarCompact(Math.round(jStats.totalImpact * 1.3))}
            </div>
            <p className="text-sm text-slate-500 mt-1">per year</p>
          </div>
        )}

        {/* Stat grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y border rounded-xl overflow-hidden bg-white mb-10">
          {[
            { label: "Journey Stages", value: jStats.totalStages },
            { label: "Moments Mapped", value: jStats.totalMoments },
            { label: "Critical Risks", value: jStats.criticalMoments },
            { label: "High-Risk Patterns", value: jStats.highRiskInsights },
          ].map(({ label, value }) => (
            <div key={label} className="p-5">
              <div className="text-3xl font-bold tracking-tight text-slate-900">{value}</div>
              <div className="text-xs text-slate-500 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Playbook progress */}
        {pStats ? (
          <div className="rounded-xl border bg-white p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Playbook Progress</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {pStats.done} of {pStats.total} actions complete{pStats.inProgress > 0 ? ` · ${pStats.inProgress} in progress` : ""}
                </p>
              </div>
              <div className="text-3xl font-bold text-slate-900">{pStats.pct}<span className="text-base text-slate-400">%</span></div>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mb-4">
              <div className="h-full bg-slate-800 rounded-full transition-all duration-500" style={{ width: `${pStats.pct}%` }} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-5 text-xs text-slate-500">
                <span><span className="font-semibold text-slate-900">{pStats.mustDo}</span> must-do</span>
                <span><span className="font-semibold text-slate-900">{pStats.done}</span> completed</span>
              </div>
              <Link href="/playbook"><Button variant="outline" size="sm">Go to Playbook</Button></Link>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed bg-white p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Playbook</h2>
                <p className="text-xs text-slate-400 mt-0.5">Step-by-step actions, templates, and timelines.</p>
              </div>
              <Link href="/playbook"><Button>Generate Playbook</Button></Link>
            </div>
          </div>
        )}

        {/* Top risks */}
        {topInsights.length > 0 && (
          <div className="rounded-xl border bg-white p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900">Top Risks</h2>
              <span className="text-xs text-slate-400">{topInsights.length} high priority</span>
            </div>
            <div className="space-y-4">
              {topInsights.map((insight, i) => {
                const ann = evidenceMap ? getInsightAnnotations(insight.pattern, evidenceMap) : null;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-xs font-bold text-slate-400 mt-0.5 w-4 shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">{insight.pattern}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{insight.immediateAction}</p>
                      {ann && ann.painPoints.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {ann.painPoints.map((pp, j) => (
                            <span key={j} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">
                              {pp}
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
                <Button variant="ghost" size="sm" className="text-xs text-slate-500">See full report →</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Quick nav */}
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { href: `/confrontation?id=${tid}`, label: "CX Report", desc: "Intelligence insights and impact projections" },
            { href: `/journey?id=${tid}`, label: "Journey Map", desc: "Stage-by-stage journey with moments of truth" },
            { href: "/onboarding", label: "Re-run Analysis", desc: "Start fresh with updated company information", dashed: true },
          ].map(({ href, label, desc, dashed }) => (
            <Link key={label} href={href}>
              <div className={`group rounded-xl border ${dashed ? "border-dashed" : ""} bg-white p-5 hover:border-slate-300 transition-colors cursor-pointer h-full`}>
                <h3 className="text-sm font-semibold text-slate-900 mb-1 group-hover:text-slate-700">{label}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
