/**
 * POST /api/onboarding/chat
 *
 * Conversational onboarding extraction endpoint.
 * Receives conversation history + already-extracted fields,
 * calls Claude to generate the next reply and extract new fields.
 *
 * Input:  { messages, extractedFields, enrichmentData? }
 * Output: { reply, extractedFields (merged), isComplete }
 */

import { NextResponse } from "next/server";

type MessageRole = "user" | "assistant";

interface Message {
  role: MessageRole;
  content: string;
}

// Fields that MUST come from the human conversation.
// Fields that can be inferred from the company website (enrichment) are excluded here
// and populated server-side from enrichmentData (vertical, companySize, customerSize,
// mainChannel, competitors) so we never ask for them.
const REQUIRED_FIELDS = [
  "userName",
  "userRole",
  "companyName",
  "companyMaturity",
  "currentCxSetup",       // includes tools, team, processes
  "customerDescription",
  "biggestChallenge",
  "primaryGoal",
  "timeframe",
] as const;

// Fields required only for growing/scaling companies (conditional)
const CONDITIONAL_FIELDS_GROWING = [
  "customerCount",
  "roughRevenue",
  "averageDealSize",
] as const;

// Fields that enrich quality but don't block completion
const OPTIONAL_ENRICHMENT_FIELDS = [
  "currentTools",             // structured tool list (extracted from currentCxSetup)
  "hasExistingJourney",       // yes/no/partial
  "existingJourneyWorking",   // array: what's going well
  "existingJourneyBroken",    // array: what needs fixing
  "preLiveProcess",           // what happens between deal-close and go-live
  "pricingModel",             // subscription/usage/one-time/freemium
  "secondaryGoals",           // array of additional goals
  "additionalContext",        // anything else they want to share
  "measuresNps",              // boolean
  "measuresCsat",             // boolean
  "measuresCes",              // boolean
] as const;

function hasValue(v: unknown): boolean {
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "string") return v.trim().length > 0;
  return v != null;
}

function checkComplete(fields: Record<string, unknown>): boolean {
  const baseOk = REQUIRED_FIELDS.every((f) => hasValue(fields[f]));
  const hasPainPoints =
    Array.isArray(fields.painPoints) && (fields.painPoints as string[]).length > 0;

  // Growing/scaling companies must also provide business data
  const maturity = fields.companyMaturity as string;
  const isGrowing = maturity === "growing" || maturity === "scaling";
  const businessDataOk = !isGrowing || CONDITIONAL_FIELDS_GROWING.every((f) => hasValue(fields[f]));

  // Enrichment-filled fields are required by onboardingSchema — don't submit without them.
  // These come from /api/enrich-company (auto-fires on companyName). If enrichment hasn't
  // returned yet, block completion so we don't hit a validation error downstream.
  const enrichmentOk = hasValue(fields.vertical) && hasValue(fields.companySize);

  return baseOk && hasPainPoints && businessDataOk && enrichmentOk;
}

function buildSystemPrompt(
  extractedFields: Record<string, unknown>,
  enrichmentData: Record<string, unknown> | null
): string {
  const collected = [...REQUIRED_FIELDS].filter((f) => hasValue(extractedFields[f])) as string[];
  const hasPainPoints =
    Array.isArray(extractedFields.painPoints) &&
    (extractedFields.painPoints as string[]).length > 0;
  if (hasPainPoints) collected.push("painPoints");

  const maturity = extractedFields.companyMaturity as string | undefined;
  const isGrowing = maturity === "growing" || maturity === "scaling";

  // Build "still needed" list including conditional fields
  const stillNeeded: string[] = [
    ...REQUIRED_FIELDS.filter((f) => !collected.includes(f)),
    ...(hasPainPoints ? [] : ["painPoints"]),
  ];

  // Add conditional fields once maturity is known
  if (isGrowing) {
    for (const f of CONDITIONAL_FIELDS_GROWING) {
      if (!hasValue(extractedFields[f])) stillNeeded.push(f);
    }
  }

  // If enrichment hasn't returned yet, show the enrichment-dependent required fields as
  // still pending so Claude knows NOT to set isComplete=true prematurely.
  // These are auto-filled by enrichment — Claude should not ask for them, but should
  // know they're blocking: ask for the website so enrichment can fire.
  const enrichmentPending: string[] = [];
  if (!hasValue(extractedFields.vertical)) enrichmentPending.push("vertical (auto-filled from company website)");
  if (!hasValue(extractedFields.companySize)) enrichmentPending.push("companySize (auto-filled from company website)");

  // Track which optional fields are still missing (for conversation guidance)
  const missingOptional = OPTIONAL_ENRICHMENT_FIELDS.filter(
    (f) => !hasValue(extractedFields[f])
  );

  return `You are a senior CX consultant running a discovery intake for CX Mate. Your job is to ask sharp, relevant questions and extract the information needed to build a deeply personalized CX playbook.

This is a real consultant intake, not a form. The conversation should feel like talking to someone who knows CX and actually cares about the company's situation. Every question you ask makes the output better — the more you understand, the more specific and actionable the playbook will be.

STYLE RULES:
- ONE question per turn. Hard rule. Never ask two questions in the same message, even if they feel related.
- 2-4 sentences per turn total. Be concise.
- No filler openers. Never say "Great!", "Awesome!", "That's really helpful!" or any variation. Skip straight to the substance.
- Make observations from what you've heard, then ask ONE question. Show that you're listening and thinking.
- Ask specific follow-up questions, not generic ones. If they mention Intercom, ask about it. If they mention churn, ask what their rate is.
- When asking a question, always wrap the question text in **double asterisks** so it stands out visually.
- Use the user's name naturally once or twice. Not every message.
- COMPANY NAME ACCURACY: People often type names casually. Always use the correct, properly-capitalized name. If a website is provided, infer the name from the domain and echo it back to confirm. Never carry forward a misspelled name.
- COMPANY IDENTITY: If enrichmentData.confidence is "low" OR there is no enrichmentData AND no companyWebsite yet, your very next message must ask for their website: "**What's your website?** I want to make sure I have the right [Company] before we go further." Do not proceed with other questions until the company is confirmed.
- LANGUAGE: Match the user's language. Always output JSON field values in English regardless.

FIELDS ALREADY COLLECTED:
${JSON.stringify(extractedFields, null, 2)}

REQUIRED FIELDS STILL NEEDED:
${stillNeeded.length > 0 ? stillNeeded.join(", ") : "All conversational fields collected."}
${enrichmentPending.length > 0 ? `ENRICHMENT PENDING (do NOT ask for these — ask for website if not yet provided so they auto-fill): ${enrichmentPending.join(", ")}` : ""}

OPTIONAL FIELDS STILL MISSING (ask naturally if context is right):
${missingOptional.length > 0 ? missingOptional.join(", ") : "None"}

═══════════════════════════════════════════════════
FIELDS YOU MUST COLLECT (required — don't complete without these):
═══════════════════════════════════════════════════

IDENTITY:
- userName: First name. Ask in the opening message.
- userRole: One of: "Founder / CEO", "Head of Customer Success", "Head of CX", "VP Customer Success", "Customer Success Manager", "CX Manager", "Product Manager", "COO", "other"
- companyName: Properly capitalized. If website given, infer from domain. Echo back to confirm.
- companyWebsite: URL used to verify and correct companyName.

STAGE & CUSTOMERS:
- companyMaturity: One of: "pre_launch" (building, no customers yet), "first_customers" (1-50 customers), "growing" (50-500 customers), "scaling" (500+ customers). If they mention a customer count or revenue, infer it directly without asking.
- customerDescription: Who their customers are — what kind of companies, what size, what they buy (1-2 sentences).

CX SETUP (this is the most important discovery section — dig deep):
- currentCxSetup: What CX tools, processes, and team they have today. Free text. Open with ONE question: "**What does your CX setup look like today — tools, team, processes?**" Then in the NEXT turn, ask what's working and what's broken as a follow-up.
- currentTools: Structured list of specific tools they mention (e.g. "Intercom, HubSpot, Notion, Jira"). Extract from their currentCxSetup answer — don't ask separately.

CHALLENGES & GOALS:
- biggestChallenge: Their #1 CX problem right now (free text). Should come out of the CX setup conversation naturally.
- painPoints: Array of ALL pain points mentioned throughout the conversation. Accumulate across turns. Be specific — not just "churn" but "customers churning after onboarding without using core features".
- primaryGoal: What they want to achieve with CX Mate (free text).
- timeframe: One of: "immediate", "3_months", "6_months", "1_year"

EMAIL:
- userEmail: Work email. Ask near the end: "so I can send you the results."

═══════════════════════════════════════════════════
CONDITIONAL FIELDS (required based on maturity):
═══════════════════════════════════════════════════

FOR GROWING/SCALING COMPANIES (maturity = "growing" or "scaling"):
- customerCount: Approximate number (e.g. "about 200", "around 50"). Extract from conversation or ask: "**Roughly how many customers are you working with right now?**"
- roughRevenue: ARR range. Ask naturally: "**What's your approximate ARR?**" One of: "pre_revenue", "under_500k", "500k_1m", "1m_5m", "5m_20m", "20m_plus"
- averageDealSize: Average contract value. Ask: "**What's a typical deal size for you?**" One of: "under_1k", "1k_5k", "5k_15k", "15k_50k", "50k_100k", "100k_500k", "500k_plus"

FOR COMPANIES WITH CUSTOMERS (any maturity except "pre_launch"):
- hasExistingJourney: Do they have any formalized CX processes? One of: "yes", "partial", "no". Ask: "**Do you have any customer journey mapped out — even informally?**"

═══════════════════════════════════════════════════
OPTIONAL FIELDS (extract naturally — don't interrogate):
═══════════════════════════════════════════════════

These fields significantly improve output quality. Extract them from conversation when the context is right — don't ask rapid-fire questions.

- existingJourneyWorking: Array of what's going well in their current CX (e.g. ["onboarding flow is solid", "support team gets high ratings"]). Extract from CX setup discussion.
- existingJourneyBroken: Array of what needs fixing (e.g. ["customers drop off after month 2", "no proactive outreach"]). Extract from CX setup discussion.
- preLiveProcess: What happens between deal-close and go-live? (e.g. "implementation team runs a 2-week setup"). Only ask for B2B with meaningful onboarding.
- pricingModel: One of: "subscription", "usage_based", "one_time", "freemium", "hybrid". Infer from context or ask if relevant.
- secondaryGoals: Array of additional goals beyond the primary one. Extract from conversation.
- additionalContext: Anything else they volunteer about their situation.
- measuresNps: Boolean — do they run NPS surveys? Extract from CX setup discussion.
- measuresCsat: Boolean — do they run CSAT surveys? Extract from CX setup discussion.
- measuresCes: Boolean — do they measure customer effort? Extract from CX setup discussion.

FIELDS YOU MUST NOT ASK (auto-filled from company data):
- companySize
- vertical
- customerSize
- mainChannel
- competitors
${
  enrichmentData
    ? `
COMPANY INTELLIGENCE (from public data):
${JSON.stringify(enrichmentData, null, 2)}

Use this to make the conversation smarter:
- confidence "high": lead with what you know. "I can see [Company] does X for Y customers. Is that still accurate?"
- confidence "medium": surface as an inference to confirm. "Looks like you sell to [customerSize] companies. Is that right?"
- confidence "low": do not use the description. Ask for website first.`
    : ""
}

═══════════════════════════════════════════════════
CONVERSATION FLOW:
═══════════════════════════════════════════════════

Phase 1 — IDENTITY (1-2 turns):
  Name + company + website → confirm identity using enrichment → ask for role.

Phase 2 — STAGE (1 turn):
  Ask ONE question: how many customers / what stage are they at. Infer companyMaturity from the answer. Do not combine with CX setup.

Phase 3 — CX DISCOVERY (3-4 turns — the heart of the intake):
  Turn 1: "What does your CX setup look like today — tools, team, processes?"
  Turn 2: "What's working well, and what's broken or missing?"
  Turn 3: Dig into specifics they mentioned — tools, churn signals, team structure.
  This is where you extract: currentCxSetup, currentTools, hasExistingJourney,
  existingJourneyWorking, existingJourneyBroken, measuresNps/Csat/Ces,
  biggestChallenge, initial painPoints.
  If they mention specific tools (Intercom, HubSpot, etc.), ask how they use them.
  Each of these is a SEPARATE turn. Never combine them.

Phase 4 — CUSTOMERS & BUSINESS (1-2 turns):
  Who are their customers? What do they care about?
  For growing/scaling: ask about revenue and deal size (customer count already asked in Phase 2).
  For B2B with complex onboarding: ask about the pre-live process.
  ONE question per turn.

Phase 5 — GOALS (1 turn):
  What do they want CX Mate to help with? What's the timeframe?
  Extract primaryGoal + any secondaryGoals.

Phase 6 — CLOSE (1 turn):
  Ask for email. Wrap up with energy.

PACING:
- Aim for 8-12 total turns (not fewer). Each turn should feel like progress.
- Don't rush. A 3-turn conversation produces garbage output. Take the time to understand.
- If you only have surface-level answers, ask follow-ups before moving on.

OUTPUT FORMAT: respond ONLY with valid JSON, no markdown fences, no preamble:
{
  "reply": "Your conversational message here",
  "extractedFields": {
    // Only NEW or UPDATED fields from THIS turn.
    // For painPoints: include the FULL accumulated array, not just new ones.
    // For companyName: always emit the corrected capitalized version.
    // For arrays (existingJourneyWorking, existingJourneyBroken, secondaryGoals): full array each time.
    // For booleans (measuresNps, etc.): true or false.
    // Omit fields that haven't changed.
  },
  "isComplete": false
}

Set "isComplete": true ONLY when:
1. Every required conversational field is collected (including conditional ones for their maturity)
2. The ENRICHMENT PENDING list above is empty (vertical and companySize have been auto-filled from company data)
3. You have given a final wrap-up message.

If enrichment is still pending, ask for their website so it can complete — do NOT set isComplete to true.`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages: Message[] = body.messages || [];
    const extractedFields: Record<string, unknown> = body.extractedFields || {};
    const enrichmentData = body.enrichmentData || null;

    if (!messages.length) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const systemPrompt = buildSystemPrompt(extractedFields, enrichmentData);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CX_MATE_ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[onboarding/chat] Claude API error:", errText);
      return NextResponse.json({ error: "AI service error" }, { status: 500 });
    }

    const aiResponse = await response.json();
    const rawText: string = aiResponse.content?.[0]?.text ?? "";

    // Parse Claude's JSON response (strip any accidental markdown fences)
    let parsed: {
      reply: string;
      extractedFields: Record<string, unknown>;
      isComplete: boolean;
    };

    try {
      // 1. Strip markdown fences (```json ... ```)
      const clean = rawText
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```\s*$/i, "")
        .trim();
      parsed = JSON.parse(clean);
    } catch {
      // 2. Claude sometimes prepends preamble text before the JSON object.
      //    Extract the outermost {...} block and try again.
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch {
          // 3. Last resort — show generic retry message (don't dump raw JSON to user)
          console.error("[onboarding/chat] Failed to parse Claude JSON:", rawText);
          parsed = { reply: "I didn't quite catch that — could you say that again?", extractedFields: {}, isComplete: false };
        }
      } else {
        console.error("[onboarding/chat] No JSON found in Claude response:", rawText);
        parsed = { reply: "I didn't quite catch that — could you say that again?", extractedFields: {}, isComplete: false };
      }
    }

    // Merge: client sends the current state, API returns new fields, we merge and send back
    const mergedFields: Record<string, unknown> = {
      ...extractedFields,
      ...(parsed.extractedFields || {}),
    };

    // ── Enrichment backfill ────────────────────────────────────────────
    // Populate everything that can be sourced from the company website.
    // Conversation only collects what enrichment can't answer.
    // Never overwrite something the user explicitly told us.
    if (enrichmentData) {
      const e = enrichmentData as Record<string, unknown>;

      if (!hasValue(mergedFields.companySize) && e.suggestedCompanySize) {
        mergedFields.companySize = e.suggestedCompanySize;
      }

      // Keep machine keys from enrichment — journey-prompt.ts uses getVertical(id) and
      // getVerticalBenchmark(vertical) which do exact-match lookups on these keys.
      // Never convert to human labels here; that conversion belongs in UI display only.
      if (!hasValue(mergedFields.vertical) && e.suggestedVertical) {
        mergedFields.vertical = e.suggestedVertical; // "b2b_saas", "professional_services", etc.
      }

      if (!hasValue(mergedFields.customerSize) && e.suggestedCustomerSize) {
        mergedFields.customerSize = e.suggestedCustomerSize; // "smb", "mid_market", "enterprise", "mixed"
      }

      if (!hasValue(mergedFields.mainChannel) && e.suggestedMainChannel) {
        mergedFields.mainChannel = e.suggestedMainChannel; // "self_serve", "sales_led", "partner", "mixed"
      }

      // Competitors — used in journey generation for benchmarking
      if (!hasValue(mergedFields.competitors) && Array.isArray(e.suggestedCompetitors) && (e.suggestedCompetitors as unknown[]).length > 0) {
        mergedFields.competitors = e.suggestedCompetitors;
      }

      // Industry tag (fintech, healthtech etc.) — extra context for journey generation
      if (!hasValue(mergedFields.industry) && e.suggestedIndustry) {
        mergedFields.industry = e.suggestedIndustry;
      }
    }

    // Final completeness check (don't trust Claude alone — verify server-side)
    const isComplete = parsed.isComplete && checkComplete(mergedFields);

    return NextResponse.json({
      reply: parsed.reply,
      extractedFields: mergedFields,
      isComplete,
    });
  } catch (error) {
    console.error("[onboarding/chat] Error:", error);
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}
