"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CxToolRecommendation } from "@/lib/ai/journey-prompt";

interface CxToolRoadmapProps {
  tools: CxToolRecommendation[];
}

export function CxToolRoadmap({ tools }: CxToolRoadmapProps) {
  if (!tools || tools.length === 0) return null;

  return (
    <Card className="border-blue-200 bg-gradient-to-b from-blue-50/50 to-transparent">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-blue-900">
            Your CX measurement roadmap
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {tools.length} tools
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tools.map((tool, i) => (
            <div key={i} className="relative flex gap-4">
              {/* Timeline indicator */}
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-bold shrink-0">
                  {i + 1}
                </div>
                {i < tools.length - 1 && (
                  <div className="w-0.5 flex-1 bg-blue-200 mt-1" />
                )}
              </div>

              {/* Tool content */}
              <div className="pb-4 flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="font-semibold text-sm text-blue-900">
                    {tool.tool}
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {tool.whenToDeploy}
                  </Badge>
                </div>
                <div className="text-xs text-blue-700 mb-1.5">
                  {tool.whyThisTool}
                </div>
                <div className="text-xs text-muted-foreground rounded-md bg-white/60 border border-blue-100 px-2.5 py-1.5">
                  Expected outcome: {tool.expectedOutcome}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
