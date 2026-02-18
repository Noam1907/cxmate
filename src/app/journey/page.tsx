"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { JourneyMap } from "@/components/journey/journey-map";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { GeneratedJourney } from "@/lib/ai/journey-prompt";

function JourneyContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("id");
  const [journey, setJourney] = useState<GeneratedJourney | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (templateId === "preview") {
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
    } else if (templateId) {
      // TODO: Fetch from Supabase by template ID
      setLoading(false);
    } else {
      setLoading(false);
    }
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

  return <JourneyMap journey={journey} />;
}

export default function JourneyPage() {
  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4">
      <Suspense
        fallback={
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold">Loading...</div>
          </div>
        }
      >
        <JourneyContent />
      </Suspense>
    </main>
  );
}
