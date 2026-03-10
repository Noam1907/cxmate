import { NextResponse } from "next/server";
import type { GeneratedPlaybook } from "@/lib/ai/recommendation-prompt";
import type { GeneratedJourney } from "@/lib/ai/journey-prompt";
import { buildQBRPrompt, type GeneratedQBR } from "@/lib/ai/qbr-prompt";

// QBR generation is fast (< 60s) — simpler than journey or playbook
export const maxDuration = 120;

// ─── JSON repair helpers (same pattern as generate-journey.ts) ────────────────

function repairJson(raw: string): GeneratedQBR {
  // Strip markdown fences
  raw = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  // Strip any preamble before the first {
  const jsonStart = raw.indexOf("{");
  const jsonEnd = raw.lastIndexOf("}");
  if (jsonStart === -1) {
    throw new Error(`Claude response contained no JSON. First 200 chars: ${raw.slice(0, 200)}`);
  }
  raw = jsonEnd > jsonStart ? raw.slice(jsonStart, jsonEnd + 1) : raw.slice(jsonStart);

  // Progressive repair attempts
  const attempts: Array<() => GeneratedQBR> = [
    () => JSON.parse(raw),
    () => {
      const r = raw
        .replace(/,\s*([}\]])/g, "$1")
        .replace(/[\x00-\x1f]/g, (ch) => (ch === "\n" ? "\\n" : ch === "\t" ? "\\t" : ""));
      return JSON.parse(r);
    },
    () => {
      const r = raw
        .replace(/,\s*([}\]])/g, "$1")
        .replace(/[\x00-\x1f]/g, (ch) => (ch === "\n" ? "\\n" : ch === "\t" ? "\\t" : ""))
        .replace(/:\s*"([^"]*?)(?<!\\)"([^"]*?)"/g, ': "$1\\"$2"');
      return JSON.parse(r);
    },
  ];

  for (const attempt of attempts) {
    try {
      return attempt();
    } catch {
      continue;
    }
  }

  throw new Error(`Failed to parse QBR JSON after all repair attempts. First 300 chars: ${raw.slice(0, 300)}`);
}

// ─── Route handler ────────────────────────────────────────────────────────────

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
      signal: AbortSignal.timeout(110_000), // 110s — under Vercel's 120s limit
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: "You are a JSON generation engine. Always respond with valid JSON only — no prose, no markdown fences, no explanation. Your output must be parseable by JSON.parse().",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.error?.message || `Claude API error ${response.status}`);
    }

    const result = await response.json();
    const rawText: string = result.content?.[0]?.text || "";

    const qbr = repairJson(rawText);

    return NextResponse.json({ qbr });
  } catch (error) {
    console.error("QBR generation error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate QBR";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
