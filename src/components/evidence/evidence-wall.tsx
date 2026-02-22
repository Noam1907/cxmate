"use client";

import { useState } from "react";
import type { EvidenceMap, PainPointMapping, CompetitorMapping } from "@/lib/evidence-matching";

// ============================================
// Pain Point Card
// ============================================

function PainPointCard({ mapping }: { mapping: PainPointMapping }) {
  const [expanded, setExpanded] = useState(false);
  const totalMatches = mapping.matchedInsights.length + mapping.matchedMoments.length;
  const isMatched = totalMatches > 0;

  const categoryColors: Record<string, string> = {
    retention: "bg-violet-50 text-violet-700 border-violet-200",
    acquisition: "bg-violet-50 text-violet-600 border-violet-200",
    operations: "bg-violet-50 text-violet-600 border-violet-200",
  };

  return (
    <div
      className={`rounded-lg border p-3 cursor-pointer transition-all hover:shadow-sm ${
        isMatched ? "border-violet-200 bg-violet-50/50" : "border-slate-200 bg-slate-50/50"
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">{mapping.painPointLabel}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${
                categoryColors[mapping.category] || "bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              {mapping.category}
            </span>
          </div>
          {isMatched ? (
            <p className="text-xs text-violet-600 mt-1">
              Found in your journey map
              {mapping.matchedMoments.length > 0 && ` — ${mapping.matchedMoments.length} touchpoint${mapping.matchedMoments.length !== 1 ? "s" : ""}`}
              {mapping.matchedInsights.length > 0 && `, ${mapping.matchedInsights.length} action${mapping.matchedInsights.length !== 1 ? "s" : ""} recommended`}
              {" ↓ tap to see"}
            </p>
          ) : (
            <p className="text-xs text-slate-400 mt-1">Not directly mapped — mention in your biggest challenge for better coverage</p>
          )}
        </div>
        {isMatched && (
          <span className="text-xs text-muted-foreground shrink-0">
            {expanded ? "\u2212" : "+"}
          </span>
        )}
      </div>

      {expanded && isMatched && (
        <div className="mt-3 pt-2 border-t border-violet-200/50 space-y-2">
          {mapping.matchedMoments.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-violet-700 uppercase tracking-wide mb-1">
                Journey moments
              </div>
              <div className="space-y-1">
                {mapping.matchedMoments.map((m, i) => (
                  <div key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-violet-400 shrink-0" />
                    <span className="font-medium">{m.stage}</span>
                    <span className="text-slate-400">&rarr;</span>
                    <span>{m.moment}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {mapping.matchedInsights.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-violet-700 uppercase tracking-wide mb-1">
                Related insights
              </div>
              <div className="space-y-1">
                {mapping.matchedInsights.map((ins, i) => (
                  <div key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                    <span>{ins}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {mapping.matchedImpact.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-violet-700 uppercase tracking-wide mb-1">
                Impact areas
              </div>
              <div className="space-y-1">
                {mapping.matchedImpact.map((area, i) => (
                  <div key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// Competitor Card
// ============================================

function CompetitorCard({ mapping }: { mapping: CompetitorMapping }) {
  const [expanded, setExpanded] = useState(false);
  const totalMentions = mapping.mentionedInInsights.length + mapping.differentiationMoments.length;

  return (
    <div
      className={`rounded-lg border p-3 cursor-pointer transition-all hover:shadow-sm ${
        totalMentions > 0 ? "border-orange-200 bg-orange-50/50" : "border-slate-200 bg-slate-50/50"
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <span className="text-sm font-medium">{mapping.competitor}</span>
          {totalMentions > 0 ? (
            <p className="text-xs text-orange-600 mt-1">
              {mapping.differentiationMoments.length} differentiation opportunity
              {mapping.differentiationMoments.length !== 1 ? "s" : ""}
            </p>
          ) : (
            <p className="text-xs text-slate-400 mt-1">Used as context for journey analysis</p>
          )}
        </div>
        {totalMentions > 0 && (
          <span className="text-xs text-muted-foreground shrink-0">
            {expanded ? "\u2212" : "+"}
          </span>
        )}
      </div>

      {expanded && mapping.differentiationMoments.length > 0 && (
        <div className="mt-3 pt-2 border-t border-orange-200/50">
          <div className="text-[10px] font-semibold text-orange-700 uppercase tracking-wide mb-1">
            Where you can win
          </div>
          <div className="space-y-1.5">
            {mapping.differentiationMoments.map((m, i) => (
              <div key={i} className="text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-orange-400 shrink-0" />
                  <span className="font-medium">{m.stage}</span>
                  <span className="text-slate-400">&rarr;</span>
                  <span>{m.moment}</span>
                </div>
                {m.context && (
                  <p className="text-[11px] text-slate-500 ml-3 mt-0.5 italic">{m.context}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// Evidence Wall
// ============================================

export function EvidenceWall({
  evidenceMap,
  companyName,
  biggestChallenge,
}: {
  evidenceMap: EvidenceMap;
  companyName: string;
  biggestChallenge?: string;
}) {
  const { painPointMappings, competitorMappings, biggestChallengeMapping, coverage } = evidenceMap;
  const hasPainPoints = painPointMappings.length > 0;
  const hasCompetitors = competitorMappings.length > 0;

  if (!hasPainPoints && !hasCompetitors && !biggestChallenge) {
    return null;
  }

  return (
    <div className="space-y-8 bg-gradient-to-b from-violet-50/30 to-transparent rounded-2xl p-6">
      {/* Section header */}
      <div>
        <h2 className="text-2xl font-bold mb-1">What we know about {companyName}</h2>
        <p className="text-sm text-muted-foreground">
          Here&apos;s how your input shaped your journey analysis
        </p>
      </div>

      {/* Biggest challenge callout */}
      {biggestChallenge && (
        <div className="rounded-xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Your #1 challenge
          </div>
          <p className="text-sm font-medium italic text-slate-700">
            &ldquo;{biggestChallenge}&rdquo;
          </p>
          {biggestChallengeMapping.relatedMoments.length > 0 && (
            <p className="text-xs text-violet-600 mt-2">
              This is reflected in {biggestChallengeMapping.relatedMoments.length} touchpoint{biggestChallengeMapping.relatedMoments.length !== 1 ? "s" : ""} in your journey map
              {biggestChallengeMapping.relatedInsights.length > 0 &&
                ` and ${biggestChallengeMapping.relatedInsights.length} prioritized action${biggestChallengeMapping.relatedInsights.length !== 1 ? "s" : ""} in your playbook`}
            </p>
          )}
        </div>
      )}

      {/* Pain points grid */}
      {hasPainPoints && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Your challenges</h3>
            <span className="text-xs text-muted-foreground">
              {coverage.painPointsCovered}/{coverage.painPointsTotal} addressed in journey
            </span>
          </div>
          {/* Coverage bar */}
          <div className="h-1.5 rounded-full bg-slate-100 mb-3 overflow-hidden">
            <div
              className="h-full rounded-full bg-violet-500 transition-all duration-1000"
              style={{
                width: `${coverage.painPointsTotal > 0 ? (coverage.painPointsCovered / coverage.painPointsTotal) * 100 : 0}%`,
              }}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {painPointMappings.map((mapping) => (
              <PainPointCard key={mapping.painPointKey} mapping={mapping} />
            ))}
          </div>
        </div>
      )}

      {/* Competitive intelligence — only show if actual insights exist */}
      {hasCompetitors && coverage.competitorMentions > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Competitive intelligence</h3>
            <span className="text-xs text-orange-600">
              {coverage.competitorMentions} insight{coverage.competitorMentions !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {competitorMappings
              .filter((m) => m.mentionedInInsights.length > 0 || m.differentiationMoments.length > 0)
              .map((mapping) => (
                <CompetitorCard key={mapping.competitor} mapping={mapping} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
