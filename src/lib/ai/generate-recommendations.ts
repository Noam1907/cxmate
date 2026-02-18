/**
 * AI Engineer: Recommendation Generation Service
 *
 * Calls Claude API to generate playbook recommendations
 * based on a journey map and company context.
 * Server-side only — never expose API keys to the client.
 */

import {
  buildRecommendationPrompt,
  type GeneratedPlaybook,
} from "./recommendation-prompt";
import type { GeneratedJourney } from "./journey-prompt";
import type { OnboardingInput } from "@/lib/validations/onboarding";

export async function generateRecommendations(
  journey: GeneratedJourney,
  input: OnboardingInput
): Promise<GeneratedPlaybook> {
  const apiKey = process.env.CX_MATE_ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "CX_MATE_ANTHROPIC_API_KEY is not set in environment variables"
    );
  }

  const prompt = buildRecommendationPrompt(journey, input);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192,
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

  const textBlock = message.content?.find(
    (block: { type: string }) => block.type === "text"
  );
  if (!textBlock) {
    throw new Error("No text response from Claude");
  }

  try {
    const playbook = JSON.parse(textBlock.text) as GeneratedPlaybook;
    return playbook;
  } catch {
    // Strip markdown fences if present
    const cleaned = textBlock.text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    return JSON.parse(cleaned) as GeneratedPlaybook;
  }
}
