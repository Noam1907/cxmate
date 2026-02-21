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
      model: "claude-sonnet-4-5-20251001",
      max_tokens: 16000,
      system: "You are a CX expert API. You MUST respond with ONLY a valid JSON object. No preamble, no explanation, no markdown fences, no text before or after the JSON. The very first character of your response must be { and the very last must be }. CRITICAL: Be concise — max 8000 tokens total. Every string field: 1 sentence only. No elaboration. No lists inside strings. Short and punchy.",
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

  // Check for truncation — if stop_reason is max_tokens, response was cut off
  const stopReason = message.stop_reason;

  // Extract text content from response
  const textBlock = message.content?.find(
    (block: { type: string }) => block.type === "text"
  );
  if (!textBlock) {
    throw new Error("No text response from Claude");
  }

  // Parse the JSON response
  let raw = textBlock.text.trim();

  // Strip markdown code fences
  raw = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  // Extract the JSON object — find the outermost { ... }
  const jsonStart = raw.indexOf("{");
  const jsonEnd = raw.lastIndexOf("}");
  if (jsonStart === -1) {
    throw new Error(`Claude response did not contain JSON. First 200 chars: ${raw.slice(0, 200)}`);
  }

  // If truncated (max_tokens), try to repair the incomplete JSON
  if (stopReason === "max_tokens" || jsonEnd <= jsonStart) {
    console.warn("[generate-journey] Response was truncated (stop_reason: max_tokens). Attempting repair...");
    raw = repairTruncatedJson(raw.slice(jsonStart));
  } else {
    raw = raw.slice(jsonStart, jsonEnd + 1);
  }

  // Attempt parsing with progressive repair
  const attempts = [
    () => JSON.parse(raw),
    () => {
      // Fix trailing commas and control chars
      const repaired = raw
        .replace(/,\s*([}\]])/g, "$1")
        .replace(/[\x00-\x1f]/g, (ch: string) =>
          ch === "\n" ? "\\n" : ch === "\t" ? "\\t" : ""
        );
      return JSON.parse(repaired);
    },
    () => {
      // Also fix unescaped quotes inside string values
      const repaired = raw
        .replace(/,\s*([}\]])/g, "$1")
        .replace(/[\x00-\x1f]/g, (ch: string) =>
          ch === "\n" ? "\\n" : ch === "\t" ? "\\t" : ""
        )
        .replace(/:\s*"([^"]*?)(?<!\\)"([^"]*?)"/g, ': "$1\\"$2"');
      return JSON.parse(repaired);
    },
  ];

  for (const attempt of attempts) {
    try {
      return attempt() as GeneratedJourney;
    } catch {
      continue;
    }
  }

  throw new Error(`Failed to parse journey JSON after all repair attempts. First 300 chars: ${raw.slice(0, 300)}`);
}

/**
 * Attempt to repair truncated JSON by closing open brackets/braces.
 * When Claude hits max_tokens, the JSON is cut mid-stream.
 * This function tries to close it gracefully.
 */
function repairTruncatedJson(raw: string): string {
  // Remove any trailing incomplete string value (cut mid-string)
  // Look for the last complete key-value pair
  let cleaned = raw;

  // If we're in the middle of a string value, close it
  const quoteCount = (cleaned.match(/(?<!\\)"/g) || []).length;
  if (quoteCount % 2 !== 0) {
    // Odd number of quotes — we're inside a string. Close it.
    cleaned += '"';
  }

  // Remove trailing comma if present
  cleaned = cleaned.replace(/,\s*$/, "");

  // Count open vs close brackets/braces
  let openBraces = 0;
  let openBrackets = 0;
  let inString = false;
  let prevChar = "";

  for (const char of cleaned) {
    if (char === '"' && prevChar !== "\\") {
      inString = !inString;
    } else if (!inString) {
      if (char === "{") openBraces++;
      else if (char === "}") openBraces--;
      else if (char === "[") openBrackets++;
      else if (char === "]") openBrackets--;
    }
    prevChar = char;
  }

  // Close any open brackets then braces
  for (let i = 0; i < openBrackets; i++) {
    cleaned += "]";
  }
  for (let i = 0; i < openBraces; i++) {
    cleaned += "}";
  }

  return cleaned;
}
