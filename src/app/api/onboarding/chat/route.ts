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
// Note: customerCount is collected passively from conversation — not a hard gate
const CONDITIONAL_FIELDS_GROWING = [
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

  // Email is required — needed for magic link auth and journey delivery
  const hasEmail = hasValue(fields.userEmail);

  // Growing/scaling companies must also provide business data
  const maturity = fields.companyMaturity as string;
  const isGrowing = maturity === "growing" || maturity === "scaling";
  const businessDataOk = !isGrowing || CONDITIONAL_FIELDS_GROWING.every((f) => hasValue(fields[f]));

  // Enrichment-filled fields are required by onboardingSchema — don't submit without them.
  // These come from /api/enrich-company (auto-fires on companyName). If enrichment hasn't
  // returned yet, block completion so we don't hit a validation error downstream.
  const enrichmentOk = hasValue(fields.vertical) && hasValue(fields.companySize);

  return baseOk && hasPainPoints && hasEmail && businessDataOk && enrichmentOk;
}

function buildSystemPrompt(
  extractedFields: Record<string, unknown>,
  enrichmentData: Record<string, unknown> | null
): string {
  const maturity = extractedFields.companyMaturity as string | undefined;
  const isGrowing = maturity === "growing" || maturity === "scaling";

  // Enrichment status
  const enrichmentOk = hasValue(extractedFields.vertical) && hasValue(extractedFields.companySize);

  // Dynamic pain point options — injected when maturity is known
  const painOptionsByMaturity: Record<string, string> = {
    pre_launch: `- No structured sales process yet
- Don't know what the buying journey looks like
- Losing deals but don't know why
- Hard to explain what we do in a clear way
- Not sure how to stand out from competitors
- Not confident in our pricing or packaging
- No clear go-to-market plan`,
    first_customers: `- Onboarding is messy and inconsistent
- Takes too long for customers to see value
- Not sure if customers are actually getting value
- Worried about losing early customers
- No way to know if customers are happy or struggling
- Every customer is handled differently
- Spending too much time on support / handholding
- Don't know when or how to upsell`,
    growing: `- Sales-to-CS handoff is broken or incomplete
- Onboarding takes too long — customers lose patience
- Customers leaving without warning
- No visibility into which accounts are at risk
- Always firefighting — can't get ahead of issues
- Team doesn't have a consistent playbook
- Too many manual steps — can't keep up with growth
- Missing upsell and expansion opportunities`,
    scaling: `- Sales-to-CS handoff gaps are hurting retention
- Onboarding doesn't scale — too many manual steps
- Customers churn before fully adopting the product
- Can't identify at-risk accounts early enough
- CX quality is inconsistent across the team
- No unified view of the customer lifecycle
- Customer data is scattered across too many tools
- No health scoring or early warning system
- Missing expansion revenue — no systematic upsell motion
- No structured business review or renewal process`,
  };

  // Dynamic goal options — injected when maturity is known
  const goalOptionsByMaturity: Record<string, string> = {
    pre_launch: `- Map my sales process end-to-end → key: "map_sales_process"
- Understand my buyer's decision journey → key: "understand_buyer"
- Get a clear go-to-market playbook → key: "gtm_playbook"
- Stand out from competitors → key: "differentiate"
- Something else (ask them to describe) → key: "something_else"`,
    first_customers: `- Build a repeatable onboarding process → key: "repeatable_onboarding"
- Make sure early customers succeed → key: "early_success"
- Create my first CX playbook → key: "first_playbook"
- Reduce support burden on the team → key: "reduce_support_load"
- Find upsell / expansion opportunities → key: "find_expansion"
- Something else → key: "something_else"`,
    growing: `- Reduce churn → key: "reduce_churn"
- Build a playbook the whole team can follow → key: "build_playbook"
- Move from reactive to proactive CX → key: "proactive_cx"
- Fix onboarding / implementation → key: "fix_onboarding"
- Close gaps between sales and CS → key: "close_handoff_gaps"
- Something else → key: "something_else"`,
    scaling: `- Unify sales and CS into one journey → key: "unify_journey"
- Implement health scoring and early warning → key: "health_scoring"
- Scale CX without scaling headcount → key: "scale_cx"
- Make onboarding scalable → key: "fix_onboarding_scale"
- Systematize expansion revenue → key: "drive_expansion"
- Something else → key: "something_else"`,
  };

  const painOptions = maturity && painOptionsByMaturity[maturity]
    ? `List these options in your message so the user can pick:\n${painOptionsByMaturity[maturity]}`
    : `Ask openly about their biggest challenge.`;

  const goalOptions = maturity && goalOptionsByMaturity[maturity]
    ? `List these options in your message (show the display label; extract the key value into primaryGoal):\n${goalOptionsByMaturity[maturity]}`
    : `Ask what they want to achieve.`;

  const enrichmentSection = enrichmentData
    ? `\nCOMPANY INTELLIGENCE (from public data):
${JSON.stringify(enrichmentData, null, 2)}

Use this intelligently:
- confidence "high": confirm what you know. "I see [Company] does X — is that still accurate?"
- confidence "medium": surface as an inference. "Looks like you serve [type] companies?"
- confidence "low": ask for website first — don't use the description.`
    : "";

  return `You are CX Mate's intake assistant. Run a structured discovery intake — one question at a time — to collect all the data needed to generate a personalized CX playbook.

RULES — STRICT:
- ONE question per turn. Never combine two questions in one message. Hard rule.
- 2-3 sentences max per turn. Be direct.
- No filler openers. Never start with "Great!", "Awesome!", "That makes sense!" — get straight to substance.
- Wrap the question itself in **double asterisks** so it stands out visually.
- For CLOSED questions: LIST the options on separate lines in your reply so the user can pick.
- For OPEN questions: just ask — no options needed.
- COMPANY NAME: Never add hyphens between words. Properly capitalize. "orca ai" → "Orca AI". "open ai" → "OpenAI". "cx mate" → "CX Mate". Use the domain to infer the canonical name and always echo it back.
- LANGUAGE: Match the user's language. Output JSON field values in English.
- Do NOT ask for companySize, vertical, customerSize, mainChannel, or competitors — these come from enrichment automatically.

FIELDS ALREADY COLLECTED:
${JSON.stringify(extractedFields, null, 2)}

ENRICHMENT STATUS: ${enrichmentOk ? "✓ vertical and companySize populated" : "PENDING — do not set isComplete until these are filled. Ask for website if not yet provided."}
${enrichmentSection}

═══════════════════════════
CONVERSATION SCRIPT
═══════════════════════════

Follow this exact sequence. SKIP any step where the field already appears in FIELDS ALREADY COLLECTED above.

STEP 1 — CONFIRM COMPANY + ROLE
(The opening message already asked for name, company, and website.)
- If companyWebsite is missing → ask ONLY: "**What's your website?** I want to confirm I have the right [Company] before we go further."
- If companyWebsite is known and userRole is missing → ask: "**What's your role at [Company]?**"
  List in your message:
  - Founder / CEO
  - Head of Customer Success
  - Head of CX
  - VP Customer Success
  - Customer Success Manager
  - CX Manager
  - Product Manager
  - COO
  - Other

STEP 2 — COMPANY STAGE
Ask: "**Where are you on your journey with [Company]?**"
List in your message:
- 🚀 Pre-launch / Pre-revenue — building go-to-market, no paying customers yet
- 🌱 First customers — 1-50 customers, figuring out what works
- 📈 Growing — 50-500 customers, building our first playbook
- 🏢 Scaling — 500+ customers, formalizing and optimizing
Extract companyMaturity: "pre_launch" | "first_customers" | "growing" | "scaling"

STEP 3 — EXISTING JOURNEY (skip entirely for pre_launch)
Ask: "**Do you have any customer journey documented — even informally?**"
List in your message:
- Yes — we have documented processes
- Partially — some things are written down, not all
- Not yet — it's all in our heads
Extract hasExistingJourney: "yes" | "partial" | "no"

STEP 4 — CX SETUP (open question — turn 1)
Ask: "**What does your CX setup look like today — tools, team, processes?**"
No options. Let them describe freely.
Extract: currentCxSetup (free text), currentTools (list of tools mentioned)

STEP 5 — WHAT'S WORKING / BROKEN (open question — turn 2)
Ask: "**What's working well, and what's broken or missing?**"
No options. Let them describe.
Extract: existingJourneyWorking (array), existingJourneyBroken (array), initial painPoints entries

STEP 6 — CUSTOMERS (open question)
Ask: "**Who are your customers?** What kind of companies, what size, what do they buy from you?"
No options. Let them describe freely.
Extract: customerDescription, customerCount if mentioned

STEP 7 — PAIN POINTS
Ask: "**What's your biggest CX challenge right now?**"
${painOptions}
Extract: painPoints (FULL accumulated array), biggestChallenge (free text summary)

STEP 8 — BUSINESS DATA (growing and scaling only — skip entirely for pre_launch and first_customers)
Turn 1 — ask: "**What's your approximate ARR?**"
List in your message:
- Pre-revenue
- Under $100K ARR
- $100K - $500K ARR
- $500K - $1M ARR
- $1M - $5M ARR
- $5M - $20M ARR
- $20M+ ARR
Extract roughRevenue: "pre_revenue" | "under_100k" | "100k_500k" | "500k_1m" | "1m_5m" | "5m_20m" | "20m_plus"

Turn 2 (next separate turn) — ask: "**What's a typical deal size for you?**"
List in your message:
- Under $1K / year
- $1K - $5K / year
- $5K - $20K / year
- $20K - $50K / year
- $50K - $100K / year
- $100K - $500K / year
- $500K+ / year
Extract averageDealSize: "under_1k" | "1k_5k" | "5k_20k" | "20k_50k" | "50k_100k" | "100k_500k" | "500k_plus"

STEP 9 — GOAL
Ask: "**What are you hoping CX Mate will help you achieve?**"
${goalOptions}
Extract primaryGoal as the machine key (e.g. "reduce_churn"), NOT the display label.

STEP 10 — TIMEFRAME
Ask: "**What's your timeframe for seeing results?**"
List in your message:
- Within 1 month
- Within 3 months
- Within 6 months
- Just exploring for now
Extract timeframe: "1_month" | "3_months" | "6_months" | "exploring"

STEP 11 — EMAIL (final step)
Ask: "One last thing — **what's your work email?** I'll send your results there."
Extract: userEmail
After they provide the email, give a warm wrap-up — "You're all set, [name]. Sit back — building your playbook usually takes about 5 minutes." — and set isComplete: true.

═══════════════════════════
COMPLETING THE INTAKE:
═══════════════════════════

Set "isComplete": true ONLY when ALL of the following are in FIELDS ALREADY COLLECTED:
- userName, userRole, companyName, companyWebsite
- companyMaturity
- currentCxSetup, customerDescription
- biggestChallenge, painPoints (array with ≥1 entry)
- primaryGoal, timeframe
- userEmail
- roughRevenue + averageDealSize (for growing/scaling only)
- Enrichment has returned (vertical and companySize populated — currently: ${enrichmentOk ? "YES ✓" : "NO — still pending"})
AND you have given the final wrap-up message.

OUTPUT FORMAT — respond ONLY with valid JSON, no markdown fences, no preamble:
{
  "reply": "Your conversational message here",
  "extractedFields": {
    // Only NEW or UPDATED fields from THIS turn.
    // For arrays (painPoints, existingJourneyWorking, etc.): FULL accumulated array each time.
    // For companyName: always emit the corrected, properly-capitalized version.
    // Omit fields that haven't changed.
  },
  "isComplete": false
}`;
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

    // Prefill the assistant turn with "{" — this forces Claude to continue from an
    // opening brace, guaranteeing the response is always valid JSON with no preamble,
    // no markdown fences, and no "here is the JSON:" wrapper text.
    const messagesWithPrefill = [
      ...messages,
      { role: "assistant" as const, content: "{" },
    ];

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
        messages: messagesWithPrefill,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[onboarding/chat] Claude API error:", errText);
      return NextResponse.json({ error: "AI service error" }, { status: 500 });
    }

    const aiResponse = await response.json();
    // Claude's response does NOT include the prefilled "{" — we prepend it to reconstruct valid JSON.
    const rawText: string = "{" + (aiResponse.content?.[0]?.text ?? "");

    // Parse Claude's JSON response.
    // Prefill forces the response to start with "{" so this should almost always succeed.
    // Fallback chain handles any edge cases.
    let parsed: {
      reply: string;
      extractedFields: Record<string, unknown>;
      isComplete: boolean;
    };

    try {
      // Primary: direct parse (prefill guarantees it starts with "{")
      parsed = JSON.parse(rawText);
    } catch {
      // Fallback 1: extract the outermost {...} block (handles rare trailing garbage)
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch {
          // Fallback 2: last resort — don't dump raw JSON to user
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
