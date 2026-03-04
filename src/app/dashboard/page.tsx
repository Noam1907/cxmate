"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { GeneratedJourney } from "@/lib/ai/journey-prompt";
import type { GeneratedPlaybook } from "@/lib/ai/recommendation-prompt";
import type { OnboardingInput } from "@/lib/validations/onboarding";
import { track } from "@/lib/analytics";
import { PageLoading } from "@/components/ui/page-loading";
import { SaveResultsBanner } from "@/components/ui/save-results-banner";

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

/** Try to load the user's persisted journey from Supabase via API. */
async function loadPersistedDashboardData(): Promise<DashboardData | null> {
  try {
    const res = await fetch("/api/journey/default");
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success || !json.journey) return null;

    // Also try to load playbook and rec statuses from local storage
    let playbook: GeneratedPlaybook | null = null;
    let recStatuses: Record<string, string> = {};
    try {
      const raw = sessionStorage.getItem("cx-mate-playbook");
      if (raw) playbook = JSON.parse(raw);
    } catch { /* ignore */ }
    try {
      const raw = localStorage.getItem("cx-mate-rec-status");
      if (raw) recStatuses = JSON.parse(raw);
    } catch { /* ignore */ }

    return {
      journey: json.journey,
      playbook,
      onboarding: json.onboardingData || null,
      recStatuses,
      templateId: json.templateId,
    };
  } catch {
    return null;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeJourneyStats(journey: GeneratedJourney) {
  const totalStages = journey.stages.length;
  const totalMoments = journey.stages.reduce((s, st) => s + st.meaningfulMoments.length, 0);
  const criticalMoments = journey.stages.reduce((s, st) => s + st.meaningfulMoments.filter((m) => m.severity === "critical").length, 0);
  return { totalStages, totalMoments, criticalMoments };
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
    async function load() {
      // 1. Try loading persisted journey from Supabase (authenticated users)
      const persisted = await loadPersistedDashboardData();
      if (persisted?.journey) {
        setData(persisted);
        track("dashboard_viewed", { template_id: persisted.templateId || undefined });
        return;
      }

      // 2. Fall back to sessionStorage (anonymous preview mode)
      const local = loadLocalDashboardData();
      setData(local);
      if (local.journey) {
        track("dashboard_viewed", { template_id: local.templateId || undefined });
      }
    }
    load();
  }, []);

  if (!data) {
    return <main className="min-h-screen"><PageLoading label="Loading your dashboard..." /></main>;
  }

  if (!data.journey) {
    return (
      <main className="min-h-screen">
        <div className="max-w-2xl mx-auto px-6 pt-20 pb-24">
          {/* Headline */}
          <div className="mb-12">
            <p className="text-xs font-semibold text-primary/70 uppercase tracking-widest mb-3">Your CX architecture</p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 leading-tight mb-4">
              One conversation.<br />Your entire customer journey, mapped.
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed max-w-lg">
              Tell us about your business. CX Mate generates a complete picture — every stage, every risk, every action to take on Monday.
            </p>
          </div>

          {/* Output preview cards */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
                  <circle cx="3" cy="16" r="2" fill="#0D9488" />
                  <circle cx="10" cy="10" r="2" fill="#0D9488" />
                  <circle cx="17" cy="4"  r="2" fill="#0D9488" />
                  <path d="M3 16 C5.5 13.5 7.5 11.5 10 10 C12.5 8.5 14.5 6 17 4" stroke="#0D9488" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-900 mb-1">Journey Map</p>
              <p className="text-xs text-slate-500 leading-relaxed">Your full lifecycle, stage by stage — every moment that makes or breaks a customer</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center mb-3">
                <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
                  <rect x="3" y="10" width="3" height="8" rx="1.5" fill="#F43F5E" />
                  <rect x="8.5" y="6" width="3" height="12" rx="1.5" fill="#F43F5E" />
                  <rect x="14" y="2" width="3" height="16" rx="1.5" fill="#F43F5E" opacity="0.4" />
                  <path d="M4 7 L9.5 4 L15 6" stroke="#F43F5E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-900 mb-1">CX Report</p>
              <p className="text-xs text-slate-500 leading-relaxed">Revenue at risk, failure patterns, and the 3 things most likely to kill your growth</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
                <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
                  <rect x="3" y="2" width="14" height="16" rx="2" stroke="#D97706" strokeWidth="1.6" />
                  <path d="M7 7h6M7 10h6M7 13h4" stroke="#D97706" strokeWidth="1.4" strokeLinecap="round" />
                  <circle cx="15" cy="15" r="3.5" fill="#D97706" />
                  <path d="M13.5 15l1 1 2-1.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-900 mb-1">CX Sprint</p>
              <p className="text-xs text-slate-500 leading-relaxed">A prioritized action plan — what to fix first and exactly how to fix it</p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link href="/onboarding">
              <Button size="lg" className="font-semibold px-8">
                Map my customer journey →
              </Button>
            </Link>
            <p className="text-xs text-slate-400">Takes about 5 minutes</p>
          </div>
        </div>
      </main>
    );
  }

  const jStats = computeJourneyStats(data.journey);
  const pStats = data.playbook ? computePlaybookStats(data.playbook, data.recStatuses) : null;
  const companyName = data.onboarding?.companyName || "Your Company";
  const firstName = data.onboarding?.userName?.split(" ")[0] || "";
  const tid = data.templateId || "preview";
  const topInsights = (data.journey.confrontationInsights || []).filter((i) => i.likelihood === "high").slice(0, 3);

  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-10">
          {firstName && (
            <p className="text-sm text-primary font-medium mb-1">
              Welcome back, {firstName}.
            </p>
          )}
          <h1 className="text-4xl font-bold tracking-tight text-slate-800">{companyName}</h1>
          <p className="text-sm text-slate-500 mt-2">
            {jStats.totalStages} stages mapped · {jStats.totalMoments} moments identified · {jStats.criticalMoments > 0 ? `${jStats.criticalMoments} critical` : "no critical risks"}
          </p>
        </div>

        {/* Save banner — anonymous users only */}
        <SaveResultsBanner isPreview={tid === "preview"} companyName={companyName} />

        {/* Playbook progress — the primary action center */}
        {pStats ? (
          <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Your Playbook</h2>
                <p className="text-sm text-slate-600 mt-0.5">
                  {pStats.done} of {pStats.total} actions complete{pStats.inProgress > 0 ? ` · ${pStats.inProgress} in progress` : ""}
                </p>
              </div>
              <div className="text-3xl font-bold text-slate-900">{pStats.pct}<span className="text-base text-slate-400">%</span></div>
            </div>
            <div className="h-2 rounded-full bg-white overflow-hidden mb-4">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pStats.pct}%` }} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-5 text-sm text-slate-600">
                <span><span className="font-semibold text-slate-900">{pStats.mustDo}</span> must-do</span>
                <span><span className="font-semibold text-slate-900">{pStats.done}</span> completed</span>
              </div>
              <Link href="/playbook"><Button size="sm">Continue Playbook</Button></Link>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Your Playbook</h2>
                <p className="text-sm text-slate-600 mt-0.5">Step-by-step actions with templates and timelines based on your journey.</p>
              </div>
              <Link href="/playbook"><Button>Generate Playbook</Button></Link>
            </div>
          </div>
        )}

        {/* What needs attention */}
        {topInsights.length > 0 && (
          <div className="rounded-xl border bg-white p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">What needs attention</h2>
                <p className="text-sm text-slate-500 mt-0.5">Your highest-priority risks</p>
              </div>
              <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded-full">{topInsights.length} urgent</span>
            </div>
            <div className="space-y-4">
              {topInsights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-rose-600">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{insight.pattern}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{insight.immediateAction}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t">
              <Link href={`/confrontation?id=${tid}`}>
                <Button variant="ghost" size="sm" className="text-sm text-slate-600 hover:text-slate-900">See full CX Report →</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Your pages — clear differentiation */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Explore your results</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link href={`/journey?id=${tid}`}>
              <div className="group rounded-xl border bg-white p-5 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer h-full">
                <h3 className="text-sm font-semibold text-slate-900 mb-1 group-hover:text-primary">Journey Map</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Your full customer lifecycle visualized stage by stage, with meaningful moments and risk areas.
                </p>
              </div>
            </Link>
            <Link href={`/confrontation?id=${tid}`}>
              <div className="group rounded-xl border bg-white p-5 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer h-full">
                <h3 className="text-sm font-semibold text-slate-900 mb-1 group-hover:text-primary">CX Report</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Revenue impact analysis, risk patterns, and intelligence insights based on your business data.
                </p>
              </div>
            </Link>
          </div>
          <Link href="/onboarding">
            <div className="group rounded-xl border border-dashed bg-white p-4 hover:border-slate-300 transition-colors cursor-pointer text-center mt-1">
              <span className="text-sm text-slate-500 group-hover:text-slate-700">Re-run analysis with updated information</span>
            </div>
          </Link>
        </div>

      </div>
    </main>
  );
}
