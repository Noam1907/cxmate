/**
 * AI Engineer: Recommendation Generation Service
 *
 * Uses Claude tool use (function calling) to guarantee valid JSON output.
 * Tool use means the API validates the schema — no JSON parsing, no repair logic.
 * Server-side only — never expose API keys to the client.
 */

import {
  buildRecommendationPrompt,
  type GeneratedPlaybook,
} from "./recommendation-prompt";
import type { GeneratedJourney } from "./journey-prompt";
import type { OnboardingInput } from "@/lib/validations/onboarding";
import https from "node:https";

// ─── Tool schema ──────────────────────────────────────────────────────────────
// Mirrors GeneratedPlaybook / PlaybookRecommendation / StagePlaybook interfaces.
// Claude must fill this in — the API validates it, so we get guaranteed JSON.

const RECOMMENDATION_FIELD = {
  type: "object",
  properties: {
    momentName:      { type: "string" },
    stageName:       { type: "string" },
    action:          { type: "string" },
    type:            { type: "string", enum: ["email","call","internal_process","automation","measurement","ai_agent"] },
    priority:        { type: "string", enum: ["must_do","should_do","nice_to_have"] },
    owner:           { type: "string" },
    timing:          { type: "string" },
    template:        { type: "string" },
    expectedOutcome: { type: "string" },
    effort:          { type: "string", enum: ["15_min","1_hour","half_day","multi_day"] },
    measureWith:     { type: "string" },
    addressesRisk:   { type: "string" },
  },
  required: ["momentName","stageName","action","type","priority","owner","timing","expectedOutcome","effort","measureWith"],
} as const;

const PLAYBOOK_TOOL = {
  name: "generate_playbook",
  description: "Generate a complete CX playbook with stage-by-stage recommendations.",
  input_schema: {
    type: "object",
    properties: {
      companyName:          { type: "string" },
      generatedAt:          { type: "string" },
      totalRecommendations: { type: "number" },
      mustDoCount:          { type: "number" },
      stagePlaybooks: {
        type: "array",
        items: {
          type: "object",
          properties: {
            stageName:       { type: "string" },
            stageType:       { type: "string", enum: ["sales","customer"] },
            topPriority:     { type: "string" },
            measurementPlan: { type: "string" },
            recommendations: { type: "array", items: RECOMMENDATION_FIELD },
          },
          required: ["stageName","stageType","topPriority","recommendations"],
        },
      },
      quickWins:        { type: "array", items: RECOMMENDATION_FIELD },
      weekOneChecklist: { type: "array", items: { type: "string" } },
    },
    required: ["companyName","generatedAt","totalRecommendations","mustDoCount","stagePlaybooks","quickWins","weekOneChecklist"],
  },
};

// ─── HTTP helper ──────────────────────────────────────────────────────────────

/** Call Anthropic API via node:https to avoid undici's default 5-min headers timeout */
function anthropicRequest(apiKey: string, body: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "api.anthropic.com",
        path: "/v1/messages",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
          "x-api-key": apiKey.trim(),
          "anthropic-version": "2023-06-01",
        },
        timeout: 9 * 60 * 1000, // 9 minute socket timeout
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf-8");
          if (res.statusCode && res.statusCode >= 400) {
            reject(new Error(`Claude API error ${res.statusCode}: ${text}`));
          } else {
            resolve(text);
          }
        });
        res.on("error", reject);
      }
    );
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Claude API request timed out after 9 minutes"));
    });
    req.write(body);
    req.end();
  });
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function generateRecommendations(
  journey: GeneratedJourney,
  input: OnboardingInput
): Promise<GeneratedPlaybook> {
  const apiKey = process.env.CX_MATE_ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("CX_MATE_ANTHROPIC_API_KEY is not set in environment variables");
  }

  const prompt = buildRecommendationPrompt(journey, input);

  const requestBody = JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 16384,
    // Tool use: Claude MUST call generate_playbook — API validates the JSON schema.
    // No freeform text, no parsing, no repair. This is the permanent fix.
    tools: [PLAYBOOK_TOOL],
    tool_choice: { type: "tool", name: "generate_playbook" },
    messages: [{ role: "user", content: prompt }],
  });

  // Time-aware retry: Vercel kills at 300s. Each Claude call takes ~2-3 min.
  // Only retry if we have enough time budget left (> 120s remaining).
  const startTime = Date.now();
  const VERCEL_BUDGET_MS = 270_000; // 270s — leave 30s margin before 300s kill

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await _extractToolResult(apiKey, requestBody);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const elapsed = Date.now() - startTime;
      const remaining = VERCEL_BUDGET_MS - elapsed;

      if (attempt === 0 && remaining > 120_000) {
        // Enough time for a retry (> 2 min left)
        console.warn(
          `[generate-recommendations] Attempt 1 failed after ${Math.round(elapsed / 1000)}s: ${lastError.message}. ` +
          `${Math.round(remaining / 1000)}s remaining — retrying...`
        );
      } else {
        // Not enough time to retry — throw immediately
        console.error(
          `[generate-recommendations] Attempt ${attempt + 1} failed after ${Math.round(elapsed / 1000)}s: ${lastError.message}. ` +
          `${Math.round(remaining / 1000)}s remaining — no time for retry.`
        );
        break;
      }
    }
  }
  throw lastError!;
}

async function _extractToolResult(
  apiKey: string,
  requestBody: string
): Promise<GeneratedPlaybook> {
  const responseText = await anthropicRequest(apiKey, requestBody);
  const message = JSON.parse(responseText);

  // Tool use response: content block with type "tool_use" holds the validated input
  const toolBlock = message.content?.find(
    (block: { type: string }) => block.type === "tool_use"
  );

  if (!toolBlock) {
    // If max_tokens hit mid-tool, content might be empty — surface a clear error
    const stopReason = message.stop_reason;
    throw new Error(
      `No tool_use block in Claude response (stop_reason: ${stopReason}). ` +
      `Consider reducing journey size or increasing max_tokens.`
    );
  }

  // Detect truncation: stop_reason "max_tokens" means the tool_use was cut off
  // The input may exist but be partially filled (empty arrays, missing fields)
  if (message.stop_reason === "max_tokens") {
    console.warn("[generate-recommendations] Response truncated (max_tokens hit). Tool input may be incomplete.");
  }

  const playbook = toolBlock.input as GeneratedPlaybook;

  // Validate the playbook has actual content — reject empty/truncated results
  const totalRecs = Array.isArray(playbook.stagePlaybooks)
    ? playbook.stagePlaybooks.reduce((sum, sp) => sum + (Array.isArray(sp?.recommendations) ? sp.recommendations.length : 0), 0)
    : 0;

  if (totalRecs === 0) {
    throw new Error(
      `Playbook generated with 0 recommendations (stop_reason: ${message.stop_reason}). ` +
      `Likely truncated by max_tokens. Retrying...`
    );
  }

  // ─── Quick Wins fallback ───────────────────────────────────────────────────
  // If Claude returned empty quickWins (common when token-constrained or confused
  // by "reference" instruction), auto-extract from stagePlaybooks.
  if (!playbook.quickWins || playbook.quickWins.length === 0) {
    console.warn("[generate-recommendations] quickWins is empty — auto-extracting from stagePlaybooks.");
    const allRecs = (playbook.stagePlaybooks || []).flatMap(
      (sp) => Array.isArray(sp?.recommendations) ? sp.recommendations : []
    );
    // Pick low-effort + high-priority recs as quick wins
    const quickWinCandidates = allRecs
      .filter((r) =>
        (r.effort === "15_min" || r.effort === "1_hour") &&
        (r.priority === "must_do" || r.priority === "should_do")
      )
      // Prefer must_do over should_do, then 15_min over 1_hour
      .sort((a, b) => {
        const priorityOrder = { must_do: 0, should_do: 1, nice_to_have: 2 };
        const effortOrder = { "15_min": 0, "1_hour": 1, "half_day": 2, "multi_day": 3 };
        const pDiff = (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2);
        if (pDiff !== 0) return pDiff;
        return (effortOrder[a.effort] ?? 3) - (effortOrder[b.effort] ?? 3);
      })
      .slice(0, 3);

    // If no low-effort recs found, just grab the top 3 must_do items
    if (quickWinCandidates.length === 0) {
      const mustDos = allRecs
        .filter((r) => r.priority === "must_do")
        .slice(0, 3);
      playbook.quickWins = mustDos;
    } else {
      playbook.quickWins = quickWinCandidates;
    }

    if (playbook.quickWins.length > 0) {
      console.log(`[generate-recommendations] Auto-extracted ${playbook.quickWins.length} quick wins.`);
    }
  }

  return playbook;
}
