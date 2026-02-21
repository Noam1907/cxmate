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
import type { GeneratedJourney } from "@/lib/ai/journey-prompt";
import type { GeneratedPlaybook } from "@/lib/ai/recommendation-prompt";
import type { OnboardingInput } from "@/lib/validations/onboarding";
import { buildEvidenceMap, getInsightAnnotations, type EvidenceMap } from "@/lib/evidence-matching";

// ============================================
// Data loading from local/session storage
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
      sum + s.meaningfulMoments.filter((m) => m.severity === "critical").length,
    0
  );
  const highRiskInsights = (journey.confrontationInsights || []).filter(
    (i) => i.likelihood === "high"
  ).length;

  return { totalStages, totalMoments, criticalMoments, highRiskInsights };
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
// Stat Card
// ============================================

function StatCard({
  label,
  value,
  detail,
  accent,
}: {
  label: string;
  value: string | number;
  detail?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 transition-all ${
        accent
          ? "border-red-200 bg-red-50/80"
          : "bg-white hover:shadow-sm"
      }`}
    >
      <div
        className={`text-3xl font-bold tracking-tight ${accent ? "text-red-700" : "text-foreground"}`}
      >
        {value}
      </div>
      <div
        className={`text-xs font-medium mt-1.5 ${
          accent ? "text-red-600" : "text-muted-foreground"
        }`}
      >
        {label}
      </div>
      {detail && (
        <div className="text-xs text-muted-foreground mt-0.5">{detail}</div>
      )}
    </div>
  );
}

// ============================================
// Navigation Card
// ============================================

function NavCard({
  href,
  title,
  description,
  badge,
  badgeColor,
  dashed,
}: {
  href: string;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: string;
  dashed?: boolean;
}) {
  return (
    <Link href={href}>
      <div className={`group rounded-2xl border p-5 bg-white hover:shadow-md transition-all duration-200 cursor-pointer h-full ${dashed ? "border-dashed" : ""}`}>
        {badge && (
          <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full border mb-3 ${badgeColor || "bg-slate-50 text-slate-600 border-slate-200"}`}>
            {badge}
          </span>
        )}
        <h3 className="text-base font-semibold mb-1 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
}

// ============================================
// Main Dashboard
// ============================================

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    setData(loadLocalDashboardData());
  }, []);

  // Still loading from storage
  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </main>
    );
  }

  const hasJourney = !!data.journey;
  const hasPlaybook = !!data.playbook;

  // Empty state — no data at all
  if (!hasJourney) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center space-y-6 max-w-lg">
          {/* Icon */}
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

          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-2">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
              Free to use
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
              AI-powered analysis
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
              Ready in minutes
            </span>
          </div>
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

  // Evidence map for inline annotations
  const evidenceMap = data.onboarding
    ? buildEvidenceMap(data.onboarding, data.journey!)
    : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="space-y-2 mb-12">
          <p className="text-sm font-medium text-primary uppercase tracking-widest">
            Dashboard
          </p>
          <h1 className="text-4xl font-bold tracking-tight">{companyName}</h1>
          <p className="text-lg text-muted-foreground">
            Your CX overview at a glance.
          </p>
        </div>

        {/* Journey Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <StatCard label="Journey stages" value={journeyStats.totalStages} />
          <StatCard
            label="Meaningful moments"
            value={journeyStats.totalMoments}
          />
          <StatCard
            label="Critical risks"
            value={journeyStats.criticalMoments}
            accent={journeyStats.criticalMoments > 0}
          />
          <StatCard
            label="High-risk patterns"
            value={journeyStats.highRiskInsights}
            accent={journeyStats.highRiskInsights > 0}
          />
        </div>

        {/* Playbook Progress */}
        {playbookStats ? (
          <Card className="mb-12 rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Playbook Progress</CardTitle>
                <Badge
                  variant={playbookStats.pct === 100 ? "default" : "secondary"}
                  className="text-xs"
                >
                  {playbookStats.pct}%
                </Badge>
              </div>
              <CardDescription>
                {playbookStats.done} of {playbookStats.total} actions complete
                {playbookStats.inProgress > 0 &&
                  ` / ${playbookStats.inProgress} in progress`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Progress bar */}
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden mb-5">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${playbookStats.pct}%` }}
                />
              </div>

              <div className="flex gap-6 text-sm">
                <div>
                  <span className="font-bold text-red-700">
                    {playbookStats.mustDo}
                  </span>{" "}
                  <span className="text-muted-foreground">must-do items</span>
                </div>
                <div>
                  <span className="font-bold text-emerald-700">
                    {playbookStats.done}
                  </span>{" "}
                  <span className="text-muted-foreground">completed</span>
                </div>
              </div>

              <div className="mt-5">
                <Link href="/playbook">
                  <Button variant="outline" size="sm" className="rounded-lg">
                    Go to Playbook
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-12 border-dashed rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl">Playbook</CardTitle>
              <CardDescription>
                Generate your playbook to get step-by-step actions, templates,
                and timelines for every moment in your journey.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/playbook">
                <Button className="rounded-lg">Generate Playbook</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Top Risks */}
        {topInsights.length > 0 && (
          <Card className="mb-12 border-red-200 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl text-red-900">
                Top Risks to Address
              </CardTitle>
              <CardDescription>
                High-likelihood patterns from your CX intelligence report.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {topInsights.map((insight, i) => {
                const ann = evidenceMap
                  ? getInsightAnnotations(insight.pattern, evidenceMap)
                  : null;
                return (
                  <div
                    key={i}
                    className="rounded-xl border border-red-100 bg-red-50/50 p-4"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-semibold text-sm">
                        {insight.pattern}
                      </span>
                      <Badge variant="destructive" className="text-xs">
                        high risk
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {insight.immediateAction}
                    </p>
                    {ann && ann.painPoints.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {ann.painPoints.map((pp, j) => (
                          <span
                            key={j}
                            className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200 font-medium"
                          >
                            From your input: {pp}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <Link href={`/confrontation?id=${tid}`}>
                <Button variant="ghost" size="sm" className="mt-1">
                  See full report
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Quick Navigation */}
        <div className="grid sm:grid-cols-3 gap-4">
          <NavCard
            href={`/confrontation?id=${tid}`}
            title="CX Report"
            description="Your confrontation insights and impact projections."
            badge="Insights"
            badgeColor="bg-red-50 text-red-700 border-red-200"
          />
          <NavCard
            href={`/journey?id=${tid}`}
            title="Journey Map"
            description="Full stage-by-stage journey with moments of truth."
            badge="Visual"
            badgeColor="bg-blue-50 text-blue-700 border-blue-200"
          />
          <NavCard
            href="/onboarding"
            title="Re-run Onboarding"
            description="Start fresh with updated company information."
            dashed
          />
        </div>
      </div>
    </main>
  );
}
