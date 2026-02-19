/**
 * AI Engineer: Journey Generation Service
 *
 * Calls Claude API to generate a customized journey map.
 * Server-side only — never expose API keys to the client.
 * Uses direct fetch to avoid SDK env detection issues.
 */

import { buildJourneyPrompt, type GeneratedJourney } from "./journey-prompt";
import type { OnboardingInput } from "@/lib/validations/onboarding";

export async function generateJourney(
  input: OnboardingInput
): Promise<GeneratedJourney> {
  const apiKey = process.env.CX_MATE_ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("CX_MATE_ANTHROPIC_API_KEY is not set in environment variables");
  }

  const prompt = buildJourneyPrompt(input);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192, // v2: Increased for theory-backed output with confrontation insights, CX tool roadmap, and impact projections
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Claude API error ${response.status}: ${errorBody}`);
  }

  const message = await response.json();

  // Extract text content from response
  const textBlock = message.content?.find(
    (block: { type: string }) => block.type === "text"
  );
  if (!textBlock) {
    throw new Error("No text response from Claude");
  }

  // Parse the JSON response — Claude sometimes returns malformed JSON
  const raw = textBlock.text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  try {
    return JSON.parse(raw) as GeneratedJourney;
  } catch {
    // Attempt to repair common Claude JSON issues:
    // - trailing commas before } or ]
    // - unescaped control characters in strings
    const repaired = raw
      .replace(/,\s*([}\]])/g, "$1")
      .replace(/[\x00-\x1f]/g, (ch: string) =>
        ch === "\n" ? "\\n" : ch === "\t" ? "\\t" : ""
      );
    return JSON.parse(repaired) as GeneratedJourney;
  }
}
