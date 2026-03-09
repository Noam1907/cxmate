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
import { ExportPdfButton } from "@/components/ui/export-pdf-button";
import { PrintCover } from "@/components/pdf/print-cover";
import { List, MapTrifold } from "@phosphor-icons/react";
import { PageLoading } from "@/components/ui/page-loading";
import { JourneyFeedbackChat } from "@/components/journey/journey-feedback-chat";
import { SaveResultsBanner } from "@/components/ui/save-results-banner";

type ViewMode = "cards" | "visual";

function JourneyContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("id");
  const [journey, setJourney] = useState<GeneratedJourney | null>(null);
  const [evidenceMap, setEvidenceMap] = useState<EvidenceMap | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("visual");
  const [playbookMoments, setPlaybookMoments] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!loading && journey) {
      track("journey_map_viewed", {
        template_id: templateId ?? undefined,
        stage_count: journey.stages.length,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, journey]);

  // Load playbook moments for journey↔playbook cross-linking
  useEffect(() => {
    function extractMoments(): boolean {
      const stored = sessionStorage.getItem("cx-mate-playbook");
      if (!stored) return false;
      try {
        const pb = JSON.parse(stored);
        const moments = new Set<string>();
        if (Array.isArray(pb.stagePlaybooks)) {
          for (const stage of pb.stagePlaybooks) {
            for (const rec of stage.recommendations ?? []) {
              if (rec.stageName && rec.momentName) {
                moments.add(`${rec.stageName}:${rec.momentName}`);
              }
            }
          }
        }
        setPlaybookMoments(moments);
        return moments.size > 0;
      } catch { return false; }
    }
    if (extractMoments()) return;
    // Playbook may still be generating — poll until it arrives
    const interval = setInterval(() => { if (extractMoments()) clearInterval(interval); }, 3000);
    return () => clearInterval(interval);
  }, []);

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
            setFirstName(data.onboardingData?.userName?.split(" ")[0] || "");
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
            setFirstName(parsed.onboardingData?.userName?.split(" ")[0] || "");
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

      // Background playbook pre-generation — fire-and-forget after journey loads.
      // Safe from the journey page: no navigation occurs here, so the fetch won't be cancelled.
      if (loadedJourney && loadedOnboarding && !sessionStorage.getItem("cx-mate-playbook")) {
        track("playbook_pregeneration_started");
        fetch("/api/recommendations/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ journey: loadedJourney, onboardingData: loadedOnboarding }),
        })
          .then(async (res) => {
            if (!res.ok) {
              const body = await res.json().catch(() => ({}));
              track("playbook_pregeneration_failed", { error: body?.detail || body?.error || `HTTP ${res.status}` });
              return null;
            }
            return res.json();
          })
          .then((data) => {
            if (data?.playbook) {
              sessionStorage.setItem("cx-mate-playbook", JSON.stringify(data.playbook));
              track("playbook_pregeneration_succeeded");
            }
          })
          .catch((err) => {
            track("playbook_pregeneration_failed", { error: err?.message || "Network error" });
          });
      }
    }
    load();
  }, [templateId]);

  if (loading) {
    return <PageLoading label="Preparing your journey map..." />;
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
      {/* PDF cover page — invisible on screen, page 1 of exported PDF */}
      <PrintCover
        firstName={firstName || undefined}
        companyName={companyName || undefined}
        documentType="Journey Map"
      />

      {/* Page header */}
      <div className="mb-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
            Journey Map
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            {companyName ? `${companyName}'s Customer Journey` : "Your Customer Journey"}
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            {journey.stages.length} stages with {totalMoments} meaningful moments mapped across your full customer lifecycle
          </p>
        </div>
        <ExportPdfButton page="journey" title={`${companyName || "CX Mate"} - Journey Map`} />
      </div>

      {/* Save banner — anonymous users only */}
      <SaveResultsBanner isPreview={templateId === "preview" || !templateId} companyName={companyName} />

      {/* View toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="inline-flex items-center rounded-lg border bg-secondary p-1 text-muted-foreground">
          <button
            onClick={() => setViewMode("visual")}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              viewMode === "visual"
                ? "bg-background text-foreground shadow-sm"
                : "hover:text-foreground"
            }`}
          >
            <MapTrifold size={16} weight="duotone" /> Visual Timeline
          </button>
          <button
            onClick={() => setViewMode("cards")}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              viewMode === "cards"
                ? "bg-background text-foreground shadow-sm"
                : "hover:text-foreground"
            }`}
          >
            <List size={16} weight="duotone" /> Stage Details
          </button>
        </div>
        {viewMode === "cards" && (
          <p className="text-xs text-slate-400 italic">
            Switch to <button onClick={() => setViewMode("visual")} className="text-primary underline underline-offset-2 hover:no-underline">Visual Timeline</button> to see the full journey flow
          </p>
        )}
      </div>

      {/* Content based on view mode */}
      {viewMode === "cards" ? (
        <JourneyMap journey={journey} evidenceMap={evidenceMap} playbookMoments={playbookMoments} />
      ) : (
        <>
          <div data-print-hide-visual>
            <JourneyVisual journey={journey} />
          </div>
          {/* Print fallback: always render card view for PDF export (visual timeline overflows A4) */}
          <div className="hidden" data-print-show-cards>
            <JourneyMap journey={journey} evidenceMap={evidenceMap} playbookMoments={playbookMoments} />
          </div>
        </>
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

      {/* Feedback chat — floating panel */}
      <JourneyFeedbackChat />
    </div>
  );
}

export default function JourneyPage() {
  return (
    <main className="min-h-screen py-12 px-4">
      <Suspense
        fallback={<PageLoading label="Loading..." />}
      >
        <JourneyContent />
      </Suspense>
    </main>
  );
}
