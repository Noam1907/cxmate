"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ImpactProjection } from "@/lib/ai/journey-prompt";

interface ImpactProjectionsProps {
  projections: ImpactProjection[];
  maturityAssessment?: string;
}

function getEffortBadge(effort: string) {
  switch (effort.toLowerCase()) {
    case "low":
      return "default" as const;
    case "medium":
      return "secondary" as const;
    case "high":
      return "outline" as const;
    default:
      return "secondary" as const;
  }
}

export function ImpactProjections({ projections, maturityAssessment }: ImpactProjectionsProps) {
  if ((!projections || projections.length === 0) && !maturityAssessment) return null;

  return (
    <Card className="border-emerald-200 bg-gradient-to-b from-emerald-50/50 to-transparent">
      <CardHeader>
        <CardTitle className="text-lg text-emerald-900">
          Business impact if you act
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Maturity Assessment */}
        {maturityAssessment && (
          <div className="rounded-lg bg-white/60 border border-emerald-200 p-4">
            <div className="text-xs font-semibold text-emerald-800 mb-1.5">
              Where you are right now:
            </div>
            <div className="text-sm text-emerald-700 leading-relaxed">
              {maturityAssessment}
            </div>
          </div>
        )}

        {/* Impact Cards */}
        {projections && projections.length > 0 && (
          <div className="grid gap-3">
            {projections.map((projection, i) => (
              <div
                key={i}
                className="rounded-lg border border-emerald-200 bg-white/40 p-4"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="font-semibold text-sm text-emerald-900">
                    {projection.area}
                  </div>
                  <Badge variant={getEffortBadge(projection.effort)} className="text-xs shrink-0">
                    {projection.effort} effort
                  </Badge>
                </div>
                <div className="text-lg font-bold text-emerald-700 mb-1">
                  {projection.potentialImpact}
                </div>
                <div className="text-xs text-muted-foreground">
                  Time to realize: {projection.timeToRealize}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
