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

// ============================================
// Data loading from local/session storage
// ============================================

interface DashboardData {
  journey: GeneratedJourney | null;
  playbook: GeneratedPlaybook | null;
  onboarding: OnboardingInput | null;
  recStatuses: Record<string, string>;
}

function loadDashboardData(): DashboardData {
  const data: DashboardData = {
    journey: null,
    playbook: null,
    onboarding: null,
    recStatuses: {},
  };

  try {
    const journeyRaw = sessionStorage.getItem("cx-mate-journey");
    if (journeyRaw) {
      const parsed = JSON.parse(journeyRaw);
      data.journey = parsed.journey || null;
      data.onboarding = parsed.onboardingData || null;
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
      className={`rounded-xl border p-4 ${
        accent ? "border-red-200 bg-red-50" : "bg-white"
      }`}
    >
      <div
        className={`text-2xl font-bold ${accent ? "text-red-700" : ""}`}
      >
        {value}
      </div>
      <div
        className={`text-xs mt-1 ${
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
// Main Dashboard
// ============================================

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    setData(loadDashboardData());
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
        <div className="text-center space-y-4 max-w-md">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Dashboard
          </div>
          <h1 className="text-3xl font-bold">Welcome to CX Mate</h1>
          <p className="text-muted-foreground">
            Start by telling us about your business. In under 5 minutes,
            you&apos;ll have a complete CX journey map, intelligence report, and
            actionable playbook.
          </p>
          <Link href="/onboarding">
            <Button size="lg">Start Onboarding</Button>
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
  const topInsights = (data.journey!.confrontationInsights || [])
    .filter((i) => i.likelihood === "high")
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="space-y-2 mb-10">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Dashboard
          </div>
          <h1 className="text-3xl font-bold">{companyName}</h1>
          <p className="text-muted-foreground">
            Your CX overview at a glance.
          </p>
        </div>

        {/* Journey Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
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
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Playbook Progress</CardTitle>
                <Badge
                  variant={playbookStats.pct === 100 ? "default" : "secondary"}
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
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden mb-4">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${playbookStats.pct}%` }}
                />
              </div>

              <div className="flex gap-4 text-sm">
                <div>
                  <span className="font-semibold text-red-700">
                    {playbookStats.mustDo}
                  </span>{" "}
                  <span className="text-muted-foreground">must-do items</span>
                </div>
                <div>
                  <span className="font-semibold text-emerald-700">
                    {playbookStats.done}
                  </span>{" "}
                  <span className="text-muted-foreground">completed</span>
                </div>
              </div>

              <div className="mt-4">
                <Link href="/playbook">
                  <Button variant="outline" size="sm">
                    Go to Playbook
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8 border-dashed">
            <CardHeader>
              <CardTitle className="text-lg">Playbook</CardTitle>
              <CardDescription>
                Generate your playbook to get step-by-step actions, templates,
                and timelines for every moment in your journey.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/playbook">
                <Button>Generate Playbook</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Top Risks */}
        {topInsights.length > 0 && (
          <Card className="mb-8 border-red-200">
            <CardHeader>
              <CardTitle className="text-lg text-red-900">
                Top Risks to Address
              </CardTitle>
              <CardDescription>
                High-likelihood patterns from your CX intelligence report.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {topInsights.map((insight, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-red-100 bg-red-50/50 p-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">
                      {insight.pattern}
                    </span>
                    <Badge variant="destructive" className="text-xs">
                      high risk
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {insight.immediateAction}
                  </p>
                </div>
              ))}
              <Link href="/confrontation?id=preview">
                <Button variant="ghost" size="sm" className="mt-1">
                  See full report
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Quick Navigation */}
        <div className="grid sm:grid-cols-3 gap-3">
          <Link href="/confrontation?id=preview">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-base">CX Report</CardTitle>
                <CardDescription className="text-xs">
                  Your confrontation insights and impact projections.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/journey?id=preview">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-base">Journey Map</CardTitle>
                <CardDescription className="text-xs">
                  Full stage-by-stage journey with moments of truth.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/onboarding">
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed h-full">
              <CardHeader>
                <CardTitle className="text-base">Re-run Onboarding</CardTitle>
                <CardDescription className="text-xs">
                  Start fresh with updated company information.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  );
}
