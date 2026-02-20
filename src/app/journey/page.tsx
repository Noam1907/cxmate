"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { JourneyMap } from "@/components/journey/journey-map";
import { JourneyVisual } from "@/components/journey/journey-visual";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { GeneratedJourney } from "@/lib/ai/journey-prompt";

type ViewMode = "cards" | "visual";

function JourneyContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("id");
  const [journey, setJourney] = useState<GeneratedJourney | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  useEffect(() => {
    async function load() {
      if (templateId === "preview" || !templateId) {
        const stored = sessionStorage.getItem("cx-mate-journey");
        if (stored) {
          try {
            const data = JSON.parse(stored);
            setJourney(data.journey);
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
            setJourney(data.journey || null);
          }
        } catch (err) {
          console.error("Failed to load journey:", err);
        }
        setLoading(false);
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

  return (
    <div className="w-full">
      {/* Header + View toggle */}
      <div className="text-center mb-6 space-y-4">
        <h1 className="text-3xl font-bold">{journey.name}</h1>
        <div className="inline-flex items-center rounded-lg border bg-muted p-1 text-muted-foreground">
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
        <JourneyMap journey={journey} />
      ) : (
        <JourneyVisual journey={journey} />
      )}
    </div>
  );
}

export default function JourneyPage() {
  return (
    <main className="min-h-screen py-12 px-4">
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
