"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ConfrontationInsight } from "@/lib/ai/journey-prompt";

interface ConfrontationPanelProps {
  insights: ConfrontationInsight[];
}

function getLikelihoodColor(likelihood: string) {
  switch (likelihood) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "low":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getLikelihoodBadge(likelihood: string) {
  switch (likelihood) {
    case "high":
      return "destructive" as const;
    case "medium":
      return "secondary" as const;
    case "low":
      return "outline" as const;
    default:
      return "secondary" as const;
  }
}

function InsightCard({ insight }: { insight: ConfrontationInsight }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-lg border p-4 cursor-pointer transition-all hover:shadow-sm ${getLikelihoodColor(insight.likelihood)}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="font-semibold text-sm">{insight.pattern}</div>
          <div className="text-xs opacity-80">{insight.description}</div>
        </div>
        <Badge variant={getLikelihoodBadge(insight.likelihood)} className="text-xs shrink-0">
          {insight.likelihood} risk
        </Badge>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-current/10 space-y-2.5">
          <div className="rounded-md bg-white/60 border border-current/10 p-2.5">
            <div className="text-xs font-semibold mb-1">Business impact:</div>
            <div className="text-xs">{insight.businessImpact}</div>
          </div>
          <div className="rounded-md bg-emerald-50 border border-emerald-200 p-2.5">
            <div className="text-xs font-semibold text-emerald-800 mb-1">Do this now:</div>
            <div className="text-xs text-emerald-700">{insight.immediateAction}</div>
          </div>
          <div className="rounded-md bg-blue-50 border border-blue-200 p-2.5">
            <div className="text-xs font-semibold text-blue-800 mb-1">Measure with:</div>
            <div className="text-xs text-blue-700">{insight.measureWith}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ConfrontationPanel({ insights }: ConfrontationPanelProps) {
  if (!insights || insights.length === 0) return null;

  const highCount = insights.filter((i) => i.likelihood === "high").length;

  return (
    <Card className="border-red-200 bg-gradient-to-b from-red-50/50 to-transparent">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-red-900">
            Here's what you're probably getting wrong
          </CardTitle>
          <div className="flex gap-1.5">
            {highCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {highCount} high risk
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {insights.length} findings
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight, i) => (
          <InsightCard key={i} insight={insight} />
        ))}
      </CardContent>
    </Card>
  );
}
