import { NextResponse } from "next/server";
import type { GeneratedPlaybook } from "@/lib/ai/recommendation-prompt";
import type { GeneratedJourney } from "@/lib/ai/journey-prompt";
import { buildQBRPrompt, type GeneratedQBR } from "@/lib/ai/qbr-prompt";

// QBR generation is fast (< 60s) — simpler than journey or playbook
export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { playbook, journey, onboardingData } = body as {
      playbook: GeneratedPlaybook;
      journey: GeneratedJourney | null;
      onboardingData: Record<string, unknown>;
    };

    if (!playbook) {
      return NextResponse.json({ error: "Playbook data required" }, { status: 400 });
    }

    const apiKey = process.env.CX_MATE_ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("CX_MATE_ANTHROPIC_API_KEY is not set");
    }

    const prompt = buildQBRPrompt(playbook, journey, onboardingData);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.error?.message || `Claude API error ${response.status}`);
    }

    const result = await response.json();
    let raw: string = result.content?.[0]?.text || "";

    // Strip markdown fences if Claude wraps the JSON
    raw = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/, "").trim();

    // Strip any preamble before the first {
    const jsonStart = raw.indexOf("{");
    if (jsonStart > 0) raw = raw.slice(jsonStart);

    const qbr: GeneratedQBR = JSON.parse(raw);

    return NextResponse.json({ qbr });
  } catch (error) {
    console.error("QBR generation error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate QBR";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
