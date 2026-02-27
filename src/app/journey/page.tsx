"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { JourneyMap } from "@/components/journey/journey-map";
import { JourneyVisual } from "@/components/journey/journey-visual";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { GeneratedJourney } from "@/lib/ai/journey-prompt";
import type { OnboardingData } from "@/types/onboarding";
import { buildEvidenceMap, type EvidenceMap } from "@/lib/evidence-matching";
import { track } from "@/lib/analytics";

type ViewMode = "cards" | "visual";

function JourneyContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("id");
  const [journey, setJourney] = useState<GeneratedJourney | null>(null);
  const [evidenceMap, setEvidenceMap] = useState<EvidenceMap | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  useEffect(() => {
    if (!loading && journey) {
      track("journey_map_viewed", {
        template_id: templateId ?? undefined,
        stage_count: journey.stages.length,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, journey]);

  useEffect(() => {
    async function load() {
      let loadedJourney: GeneratedJourney | null = null;
      let loadedOnboarding: Partial<OnboardingData> | null = null;

      if (templateId === "preview" || !templateId) {
        const stored = sessionStorage.getItem("cx-mate-journey");
        if (stored) {
          try {
            const data = JSON.parse(stored);
            loadedJourney = data.journey;
            loadedOnboarding = data.onboardingData || null;
            setJourney(data.journey);
            setCompanyName(data.onboardingData?.companyName || "");
          } catch {
            console.error("Failed to parse stored journey");
          }
        }
        setLoading(false);
      } else {
        try {
          const response = await fetch(`/api/journey/${templateId}`);
          if (response.ok) {
            const data = await response.json();
            loadedJourney = data.journey || null;
            setJourney(loadedJourney);
          }
          // Try sessionStorage for onboarding data
          const stored = sessionStorage.getItem("cx-mate-journey");
          if (stored) {
            const parsed = JSON.parse(stored);
            loadedOnboarding = parsed.onboardingData || null;
            setCompanyName(parsed.onboardingData?.companyName || "");
          }
        } catch (err) {
          console.error("Failed to load journey:", err);
        }
        setLoading(false);
      }

      // Build evidence map
      if (loadedJourney && loadedOnboarding) {
        setEvidenceMap(buildEvidenceMap(loadedOnboarding, loadedJourney));
      }
    }
    load();
  }, [templateId]);

  if (loading) {
    return (
      <div className="text-center space-y-2">
        <div className="text-2xl font-bold">Loading your journey...</div>
        <p className="text-muted-foreground">
          Preparing your customer experience map
        </p>
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">No journey map yet</h1>
        <p className="text-muted-foreground">
          Complete the onboarding to generate your personalized journey map.
        </p>
        <Link href="/onboarding">
          <Button>Start Onboarding</Button>
        </Link>
      </div>
    );
  }

  const totalMoments = journey.stages.reduce(
    (sum, stage) => sum + stage.meaningfulMoments.length,
    0
  );

  return (
    <div className="w-full">
      {/* Page header */}
      <div className="mb-10">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
          Journey Map
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          {companyName || "Your Customer Journey"}
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          {journey.stages.length} stages · {totalMoments} meaningful moments
        </p>
      </div>

      {/* View toggle */}
      <div className="text-center mb-6 space-y-4">
        <div className="inline-flex items-center rounded-lg border bg-secondary p-1 text-muted-foreground">
          <button
            onClick={() => setViewMode("cards")}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              viewMode === "cards"
                ? "bg-background text-foreground shadow-sm"
                : "hover:text-foreground"
            }`}
          >
            <span className="text-xs">☰</span> Detail View
          </button>
          <button
            onClick={() => setViewMode("visual")}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              viewMode === "visual"
                ? "bg-background text-foreground shadow-sm"
                : "hover:text-foreground"
            }`}
          >
            <span className="text-xs">🗺</span> Journey Map
          </button>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === "cards" ? (
        <JourneyMap journey={journey} evidenceMap={evidenceMap} />
      ) : (
        <JourneyVisual journey={journey} />
      )}

      {/* CTA → CX Report */}
      <div className="border-t mt-12 pt-10 flex flex-col sm:flex-row items-center gap-3">
        <Link href={`/confrontation?id=${templateId}`}>
          <Button size="lg">See Your CX Intelligence Report</Button>
        </Link>
        <Link href="/playbook">
          <Button size="lg" variant="outline">Get Your Playbook</Button>
        </Link>
      </div>
    </div>
  );
}

export default function JourneyPage() {
  return (
    <main className="min-h-screen py-12 px-4 bg-white">
      <Suspense
        fallback={
          <div className="text-center space-y-2 pt-24">
            <div className="text-2xl font-bold">Loading...</div>
          </div>
        }
      >
        <JourneyContent />
      </Suspense>
    </main>
  );
}
