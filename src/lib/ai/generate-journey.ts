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

  // Parse the JSON response
  try {
    const journey = JSON.parse(textBlock.text) as GeneratedJourney;
    return journey;
  } catch {
    // If Claude wrapped it in markdown fences, strip them
    const cleaned = textBlock.text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    return JSON.parse(cleaned) as GeneratedJourney;
  }
}
