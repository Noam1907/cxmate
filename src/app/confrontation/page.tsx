"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import type {
  GeneratedJourney,
  ConfrontationInsight,
  ImpactProjection,
} from "@/lib/ai/journey-prompt";

// ============================================
// Animated number counter
// ============================================

function AnimatedValue({ value, delay }: { value: string; delay: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <span
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      {value}
    </span>
  );
}

// ============================================
// Staggered fade-in wrapper
// ============================================

function FadeIn({
  children,
  delay,
  className = "",
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ============================================
// Insight Row
// ============================================

function InsightRow({
  insight,
  index,
}: {
  insight: ConfrontationInsight;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  const likelihoodStyles = {
    high: "border-red-300 bg-red-50",
    medium: "border-orange-300 bg-orange-50",
    low: "border-yellow-300 bg-yellow-50",
  };

  const likelihoodBadge = {
    high: "destructive" as const,
    medium: "secondary" as const,
    low: "outline" as const,
  };

  return (
    <FadeIn delay={800 + index * 200}>
      <div
        className={`rounded-xl border-2 p-5 cursor-pointer transition-all hover:shadow-md ${
          likelihoodStyles[insight.likelihood]
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{insight.pattern}</span>
              <Badge
                variant={likelihoodBadge[insight.likelihood]}
                className="text-xs"
              >
                {insight.likelihood} risk
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {insight.description}
            </p>
          </div>
          <div className="text-muted-foreground text-sm shrink-0">
            {expanded ? "−" : "+"}
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-current/10 grid gap-3">
            <div className="rounded-lg bg-white/80 border p-3">
              <div className="text-xs font-semibold text-red-800 mb-1">
                Business impact
              </div>
              <div className="text-sm">{insight.businessImpact}</div>
            </div>
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
              <div className="text-xs font-semibold text-emerald-800 mb-1">
                Do this now
              </div>
              <div className="text-sm text-emerald-700">
                {insight.immediateAction}
              </div>
            </div>
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
              <div className="text-xs font-semibold text-blue-800 mb-1">
                Measure with
              </div>
              <div className="text-sm text-blue-700">{insight.measureWith}</div>
            </div>
          </div>
        )}
      </div>
    </FadeIn>
  );
}

// ============================================
// Impact Card
// ============================================

function ImpactCard({
  projection,
  index,
}: {
  projection: ImpactProjection;
  index: number;
}) {
  const effortColor = {
    low: "bg-emerald-100 text-emerald-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  return (
    <FadeIn delay={1600 + index * 150}>
      <div className="rounded-xl border bg-white p-5 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="font-semibold text-sm">{projection.area}</div>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              effortColor[projection.effort as keyof typeof effortColor] ||
              effortColor.medium
            }`}
          >
            {projection.effort} effort
          </span>
        </div>
        <div className="text-2xl font-bold text-emerald-700">
          <AnimatedValue value={projection.potentialImpact} delay={1800 + index * 150} />
        </div>
        <div className="text-xs text-muted-foreground">
          {projection.timeToRealize}
        </div>
      </div>
    </FadeIn>
  );
}

// ============================================
// Main Confrontation Content
// ============================================

function ConfrontationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get("id");
  const [journey, setJourney] = useState<GeneratedJourney | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    if (templateId === "preview") {
      const stored = sessionStorage.getItem("cx-mate-journey");
      if (stored) {
        try {
          const data = JSON.parse(stored);
          setJourney(data.journey);
          setCompanyName(data.onboardingData?.companyName || "your company");
        } catch {
          console.error("Failed to parse stored journey");
        }
      }
    }
    setLoading(false);
  }, [templateId]);

  useEffect(() => {
    if (!loading && journey) {
      const timer = setTimeout(() => setHeaderVisible(true), 200);
      return () => clearTimeout(timer);
    }
  }, [loading, journey]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-2xl font-bold">Analyzing your business...</div>
          <p className="text-muted-foreground">
            Running CX intelligence engine
          </p>
        </div>
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">No analysis available</h1>
          <p className="text-muted-foreground">
            Complete the onboarding to get your CX confrontation.
          </p>
          <Link href="/onboarding">
            <Button>Start Onboarding</Button>
          </Link>
        </div>
      </div>
    );
  }

  const insights = journey.confrontationInsights || [];
  const projections = journey.impactProjections || [];
  const highRiskCount = insights.filter((i) => i.likelihood === "high").length;
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header — dramatic reveal */}
        <div
          className={`text-center space-y-4 mb-12 transition-all duration-1000 ${
            headerVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            CX Intelligence Report
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            {companyName}, here&apos;s the truth.
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            We analyzed your business against CX theory, industry benchmarks,
            and patterns from companies at your stage. Here&apos;s what we found.
          </p>
        </div>

        {/* Quick stats bar */}
        <FadeIn delay={400} className="mb-10">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center rounded-xl border bg-white p-4">
              <div className="text-3xl font-bold">
                <AnimatedValue
                  value={String(journey.stages.length)}
                  delay={600}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Journey stages
              </div>
            </div>
            <div className="text-center rounded-xl border bg-white p-4">
              <div className="text-3xl font-bold">
                <AnimatedValue value={String(totalMoments)} delay={700} />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Meaningful moments
              </div>
            </div>
            <div className="text-center rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="text-3xl font-bold text-red-700">
                <AnimatedValue value={String(criticalMoments)} delay={800} />
              </div>
              <div className="text-xs text-red-600 mt-1">Critical risks</div>
            </div>
          </div>
        </FadeIn>

        {/* Maturity Assessment */}
        {journey.maturityAssessment && (
          <FadeIn delay={600} className="mb-10">
            <Card className="border-slate-200 bg-gradient-to-br from-slate-50 to-white">
              <CardHeader>
                <CardTitle className="text-base">
                  Where you are right now
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {journey.maturityAssessment}
                </p>
              </CardContent>
            </Card>
          </FadeIn>
        )}

        {/* Confrontation Insights — the core "aha" section */}
        {insights.length > 0 && (
          <div className="mb-10">
            <FadeIn delay={700}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  What you&apos;re probably getting wrong
                </h2>
                {highRiskCount > 0 && (
                  <Badge variant="destructive">
                    {highRiskCount} high risk
                  </Badge>
                )}
              </div>
            </FadeIn>

            <div className="space-y-3">
              {insights.map((insight, i) => (
                <InsightRow key={i} insight={insight} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Impact Projections — the "what you could gain" section */}
        {projections.length > 0 && (
          <div className="mb-12">
            <FadeIn delay={1500}>
              <h2 className="text-xl font-bold mb-4">
                The upside if you act
              </h2>
            </FadeIn>

            <div className="grid gap-3">
              {projections.map((projection, i) => (
                <ImpactCard key={i} projection={projection} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* CTA — proceed to full journey */}
        <FadeIn delay={2000} className="text-center space-y-4">
          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold mb-2">
              Ready to see the full picture?
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Your complete journey map with stage-by-stage guidance, action
              templates, and CX tool recommendations.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link href={`/journey?id=${templateId}`}>
                <Button size="lg">See Your Full Journey Map</Button>
              </Link>
              <Link href="/playbook">
                <Button size="lg" variant="outline">
                  Get Your Playbook
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

export default function ConfrontationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="text-2xl font-bold">Analyzing...</div>
          </div>
        </div>
      }
    >
      <ConfrontationContent />
    </Suspense>
  );
}
