# Analysis Prompt Directives Specification

**Author:** AI Engineer
**Date:** 2026-03-13
**Status:** Design spec — ready for implementation
**Scope:** Directives 1, 2, 3, 5, 6, 7 applied to `journey-prompt.ts` output

---

## Overview

This document specifies exactly how 6 directives should change the journey generation prompt and its output structure. Each directive includes: what currently exists, what needs to change, before/after examples, and any new output fields required.

The recommendation prompt (`recommendation-prompt.ts`) inherits most of these changes via the journey data it consumes. Where the recommendation prompt needs its own changes, those are noted.

---

## Directive 1: "Why" Must Be Visible

### What Currently Exists

The prompt generates insights with `description`, `businessImpact`, and `immediateAction` fields but never requires the model to explain the EVIDENCE or REASONING behind the insight. The `diagnosis` field on `GeneratedMoment` exists but is optional and underspecified — Claude treats it as a restatement of the problem, not an evidence chain.

Current prompt instruction (line 427-429):
```
Generate JSON journey map. ULTRA CONCISE — every field max 12 words. emotionalState max 4 words.
...
Impact projections MUST include calculation (math formula) and dataSource.
```

The `calculation` and `dataSource` fields on `ImpactProjection` are the only evidence mechanism. Moments and confrontation insights have no evidence requirement.

### What Needs to Change

**A. Add `evidence` field to `GeneratedMoment`:**

Each moment's `diagnosis` field must be repurposed (or a new `evidence` field added alongside it) to contain a structured evidence statement. The prompt must instruct Claude to always provide the source of the claim.

**New prompt instruction to add after the pain points MANDATORY block (after line 405):**

```
## Evidence Requirement (MANDATORY)

Every meaningful moment and every confrontation insight MUST include evidence for its claims.
Evidence comes from exactly one of these sources (tag it):
- "user_stated" — the user told us this directly (pain point, challenge, tool, process description)
- "enrichment" — from the AI-enriched company intelligence data
- "benchmark" — from industry/vertical/size benchmarks we have in our knowledge base
- "inferred" — we connected two data points the user gave us (e.g., their deal size + customer count = revenue exposure)

Use the diagnosis field on moments and the new evidenceBasis field on confrontation insights to show WHY we know this. Do NOT restate the problem — explain what data point or benchmark led to this conclusion.

Format: "[source_tag] specific evidence statement"
Example: "[user_stated] User reported 'onboarding is messy and inconsistent' + [benchmark] B2B SaaS companies at Growing stage with inconsistent onboarding see 35-45% activation failure rates"
```

**B. Add `evidenceBasis` field to `ConfrontationInsight`:**

New field that explains WHY this pattern was identified. The existing `description` field stays as-is (what the pattern IS). The new field explains HOW we know.

**C. Update the JSON schema in the prompt** to include `evidenceBasis` on confrontation insights:

Add to the confrontationInsights schema: `"evidenceBasis":"str"`

### New Output Fields

```typescript
// In ConfrontationInsight interface — add:
evidenceBasis?: string; // "[source_tag] explanation of evidence chain"

// GeneratedMoment.diagnosis — no new field, but redefine its purpose:
// diagnosis is now REQUIRED (not optional) and must follow the evidence format:
// "[source_tag] evidence statement"
```

### Before vs After

**BEFORE (current output):**
```json
{
  "name": "Silent Adoption Failure",
  "type": "risk",
  "description": "Accounts complete onboarding but never activate core flows",
  "severity": "critical",
  "diagnosis": "Many accounts stall after initial setup",
  "triggers": ["Day 3 post-signup with no activation"],
  "recommendations": ["Set up activation tracking"]
}
```

**AFTER (with evidence):**
```json
{
  "name": "Silent Adoption Failure",
  "type": "risk",
  "description": "Accounts complete onboarding but never activate core flows",
  "severity": "critical",
  "diagnosis": "[user_stated] User reported 'onboarding is messy and inconsistent' | [benchmark] B2B payment platforms at Growing stage see 35-45% silent churn when activation is unguided",
  "triggers": ["Day 3 post-signup with no activation event"],
  "recommendations": ["Deploy guided activation sequence via Intercom"]
}
```

**Confrontation insight BEFORE:**
```json
{
  "pattern": "Silent churn is your biggest revenue leak",
  "likelihood": "high",
  "description": "Customers leave without warning signals",
  "businessImpact": "$145K annual revenue at risk"
}
```

**Confrontation insight AFTER:**
```json
{
  "pattern": "Silent churn is Vendora's biggest revenue leak",
  "likelihood": "high",
  "description": "Customers leave without warning signals",
  "businessImpact": "$145K annual revenue at risk",
  "evidenceBasis": "[user_stated] User selected 'Customers leaving without warning' as pain point | [benchmark] B2B fintech at 80 employees: avg silent churn 35-45% | [inferred] 145 accounts x 40% x $18K ARR x 22% preventable = $145K"
}
```

---

## Directive 2: Context Must "Scream"

### What Currently Exists

The prompt includes a `## Company Context` section (lines 366-380) with company name, size, maturity, vertical, tools, etc. There is a general instruction: `Use "Companies like yours..." framing` (line 360). But there is NO instruction telling Claude to weave the company name, vertical, tools, and pain points into EVERY field of the output. The model defaults to generic language in moment names, descriptions, and recommendations.

The only personalization enforcement is the pain-points MANDATORY block (line 401-405) which requires pain points to appear in `addressesPainPoints` arrays — but this is metadata tagging, not visible text personalization.

### What Needs to Change

**Add a new instruction block after the Company Context section (after line 380):**

```
## Personalization Rules (MANDATORY — screenshot test)

Every section of the output must pass the "screenshot test": if someone screenshots any single field, it must be obvious this was built for THIS company — not a generic template.

Rules:
1. COMPANY NAME: Use "${input.companyName}" by name in at least:
   - The journey `name` field
   - Every confrontation insight `pattern` field
   - Every confrontation insight `description` field
   - The `maturityAssessment` field
   Do NOT overuse — 1-2 mentions per insight is enough. Never use "your company" when you can use "${input.companyName}".

2. VERTICAL/INDUSTRY: Reference their specific vertical (${input.vertical}${input.industry ? ` / ${input.industry}` : ""}) in:
   - Stage descriptions (not "customers onboard" but "${input.vertical} buyers onboard")
   - Moment descriptions (reference their specific product type, buyer type, or deal structure)
   - Confrontation insight descriptions (why this pattern hits THIS vertical harder)

3. TOOLS: When the user has tools (${input.currentTools || "none specified"}), reference specific tool names in:
   - Moment recommendations ("configure an Intercom product tour" not "set up a product tour")
   - Confrontation insight immediateAction fields ("build a HubSpot workflow" not "create a workflow")
   - cxToolRoadmap entries (connect to their existing stack, not replace it)

4. PAIN POINTS: The user's exact pain point language must echo in moment descriptions and confrontation patterns — not just in addressesPainPoints tags. If they said "onboarding is messy and inconsistent," the moment description should reference that messiness, not use clinical language like "onboarding process lacks structure."

5. CUSTOMER DESCRIPTION: Reference their specific customer type (${input.customerDescription}, ${input.customerSize}) in stage descriptions and moment triggers. "Enterprise procurement committees" not "buyers." "Mid-market SaaS companies" not "customers."
```

### New Output Fields

None — this directive changes prompt instructions, not schema.

### Before vs After

**Journey name BEFORE:**
```json
{ "name": "Full Customer Lifecycle Journey" }
```

**Journey name AFTER:**
```json
{ "name": "Vendora's Customer Lifecycle Journey" }
```

**Stage description BEFORE:**
```json
{ "description": "New users set up their account and learn the product" }
```

**Stage description AFTER:**
```json
{ "description": "New merchants configure Vendora's payment integration and process their first test transaction" }
```

**Moment recommendation BEFORE:**
```json
{ "recommendations": ["Set up an automated onboarding email sequence"] }
```

**Moment recommendation AFTER:**
```json
{ "recommendations": ["Configure an Intercom product tour triggered at day 2 for new merchants"] }
```

---

## Directive 3: Tense Awareness

### What Currently Exists

The prompt has a two-path analysis mode (lines 300-305):
```
Mode: COMPARISON — validate progress, compare vs best practices...
Mode: PRESCRIPTIVE — prescribe optimal journey from day one...
```

But there is NO instruction about verb tense. Claude defaults to present tense universally ("customers experience," "users face"), which is wrong for pre-launch companies that have no customers yet.

The maturity data is available: `companyMaturity` can be `pre_launch`, `first_customers`, `growing`, or `scaling`. The `hasExistingCustomers` boolean is derived from maturity.

### What Needs to Change

**Add a tense instruction block inside `buildAnalysisModeContext()` (the function at lines 301-305), immediately after the mode line:**

```
Tense rule based on maturity:
${TENSE_MATRIX[input.companyMaturity]}
```

Where `TENSE_MATRIX` is a constant defined in the prompt file:

```typescript
const TENSE_MATRIX: Record<CompanyMaturity, string> = {
  pre_launch: `FUTURE TENSE — This company has no customers. Use "will," "would," "can expect."
    - Moments: "Prospects WILL encounter..." not "Prospects encounter..."
    - Risks: "If Vendora doesn't address this, first customers WILL..." not "Customers are experiencing..."
    - Recommendations: "When you launch, SET UP..." not "You should be doing..."
    - Never reference existing customer behavior — it doesn't exist yet.`,

  first_customers: `PRESENT + CONDITIONAL — This company has early customers but patterns are forming, not established.
    - Moments: "Your first customers ARE experiencing..." or "Early signs SUGGEST..."
    - Risks: "If this continues, it WILL become..." not "This is costing you..."
    - Recommendations: "Start doing this NOW before it becomes a pattern..."
    - Revenue impact: use ranges and conditionals ("COULD cost," "risks becoming") — not definitive statements.`,

  growing: `PRESENT TENSE — This company has real customers, real data, real patterns.
    - Moments: "Your customers ARE experiencing..." / "This IS happening..."
    - Risks: "This IS costing Vendora..." not "This could cost..."
    - Recommendations: "Fix this now" / "Your team NEEDS to..."
    - Revenue impact: use definitive statements with stated confidence level.`,

  scaling: `PRESENT + HISTORICAL — This company has enough history to reference trends.
    - Moments: "Your customers HAVE BEEN experiencing..." / "This pattern HAS persisted..."
    - Risks: "This HAS cost Vendora..." / "Over the past year, this trend HAS..."
    - Recommendations: "It's time to formalize..." / "You've outgrown the current approach..."
    - Revenue impact: reference trajectory ("growing from X to Y," "accelerating").`,
};
```

### Tense Matrix (Lookup Table)

| Maturity Stage | Company State | Primary Tense | Risk Language | Recommendation Language | Revenue Impact Language |
|---|---|---|---|---|---|
| `pre_launch` | No customers, building GTM | Future ("will," "would") | "If [Company] doesn't address this, first customers will..." | "When you launch, set up..." / "Before your first customer..." | "Could cost," "risks becoming," "projected" |
| `first_customers` | 1-10 customers, learning | Present + conditional ("are" + "if...will") | "Early signs suggest..." / "If this continues, it will become..." | "Start doing this now..." / "Before this becomes a pattern..." | "Could cost," "early estimates suggest," ranges |
| `growing` | 11-50 customers, patterns exist | Present ("is," "are," "costs") | "This is costing [Company]..." / "Your customers are experiencing..." | "Fix this now" / "Your team needs to..." | Definitive: "is costing," "$X annually" |
| `scaling` | 50+ customers, formalize | Present + historical ("has been," "have") | "This has cost [Company]..." / "This pattern has persisted..." | "It's time to formalize..." / "You've outgrown..." | Trajectory: "growing from X to Y," "accelerating" |

### Example Phrases by Stage

**pre_launch:**
- "When Vendora's first merchants sign up, they WILL encounter..."
- "Without a structured evaluation flow, prospects WILL drop off at..."
- "B2B payment platforms that launch without this TYPICALLY see..."

**first_customers:**
- "Your early merchants ARE likely experiencing friction at..."
- "If this pattern continues as Vendora scales, it WILL become..."
- "Start building this process NOW — companies that wait until 20+ customers find it 3x harder to fix."

**growing:**
- "Vendora's merchants ARE dropping off at day 3 — this IS the activation gap."
- "This pattern IS costing Vendora an estimated $145K annually."
- "Your CS team NEEDS a playbook for this — every week without one compounds the damage."

**scaling:**
- "This pattern HAS persisted across Vendora's last 3 quarters."
- "Your team HAS outgrown the current manual handoff process."
- "It's time to formalize what your top CSMs have been doing intuitively."

### New Output Fields

None — this is a prompt instruction change that affects the text content of existing fields.

---

## Directive 5: "Similar Companies to You"

### What Currently Exists

The prompt uses `"Companies like yours..."` framing (line 360) as a general voice instruction. But this is a tone directive, not a specificity directive. When Claude makes a generic statement it cannot personalize (e.g., a general CX best practice), it currently writes it as a universal truth: "Companies see 25% improvement in activation rates" — with no anchor to the user's context.

### What Needs to Change

**Add the following instruction to the prompt, inside the Task section (after line 427):**

```
## Generic Statement Anchoring Rule

When you make a statement that applies broadly and cannot be personalized with this company's specific data, NEVER leave it generic. Anchor it to their peer group using one of these patterns:

- "B2B [vertical] companies at [Company]'s stage typically see..."
- "Companies similar to [Company] — [size] [vertical] teams with [customer_count] accounts — report..."
- "[Vertical] platforms your size usually find that..."
- "At the [maturity_stage] stage, [vertical] companies like [Company] tend to..."

NEVER write:
- "Companies see..." (too generic)
- "Best practice is..." (sounds like a textbook)
- "Research shows..." (no anchor to their context)
- "It is common to..." (passive, generic)

The goal: every sentence in the output should make the reader think "this was written for us" even when the underlying data is a benchmark.
```

### New Output Fields

None.

### Before vs After

**BEFORE:**
```json
{ "benchmarkContext": "Companies see 25-35% improvement in activation with guided onboarding" }
```

**AFTER:**
```json
{ "benchmarkContext": "B2B payment platforms at Vendora's stage typically see 25-35% improvement in activation with guided onboarding" }
```

**BEFORE (confrontation companionAdvice):**
```json
{ "companionAdvice": "Most companies discover this too late. You're catching it early." }
```

**AFTER:**
```json
{ "companionAdvice": "B2B fintech companies your size usually discover this after losing 3-4 accounts. Vendora's catching it early." }
```

---

## Directive 6: Moat Callout — "How CX Mate Built This"

### What Currently Exists

There is no section anywhere in the journey output that explains HOW CX Mate structured, cross-referenced, and analyzed the data. The `maturityAssessment` field (optional string on `GeneratedJourney`) currently contains a brief maturity summary but nothing about methodology.

The analysis page example (`analysis-page-example.md`) shows a "CCXP Methodology" badge and a "How we calculated these numbers" collapsible, but the journey prompt does not generate any methodology content — it's hardcoded in the UI or absent.

### What Needs to Change

**A. Add a new top-level field to `GeneratedJourney`: `methodologyNote`**

This field contains a structured explanation of how CX Mate analyzed this specific company's data. It is NOT a generic product description — it must reference the specific data layers used for THIS company.

**B. Add a prompt instruction inside the Task section:**

```
## Methodology Note (REQUIRED — generate the "methodologyNote" field)

Generate a "methodologyNote" object that explains HOW CX Mate structured this specific analysis. This is our moat — the thing that makes this output impossible to replicate with a single ChatGPT prompt. Reference the specific layers used for THIS company:

The note must cover:
1. "dataLayersUsed" — which data sources fed this analysis (list all that apply):
   - Company profile data (what they told us)
   - AI-enriched company intelligence (if enrichment data was available)
   - Industry benchmarks (vertical + size-specific)
   - CX maturity assessment (their measurement readiness)
   - Pain point cross-referencing (connecting stated problems to journey moments)
   - Competitive landscape analysis (if competitors were provided)
   - Existing process analysis (if they have existing CX processes)
   - Business data modeling (if revenue/deal-size data was provided)

2. "crossReferences" — specific connections the analysis made across layers. Examples:
   - "Connected your stated pain point 'onboarding is messy' to 3 journey moments and 2 blind spots"
   - "Cross-referenced your HubSpot + Intercom stack against 12 recommended actions"
   - "Mapped your $18K ACV against B2B fintech benchmarks to calculate revenue impact"

3. "frameworksApplied" — which CX frameworks and methodologies were used:
   - CCXP professional standards
   - Industry-specific benchmarks (name the vertical)
   - Stage-appropriate maturity guidance
   - CX influencer frameworks (if applicable)

4. "personalizedTo" — a single sentence: "This analysis was built specifically for [Company], a [size]-employee [vertical] company at [stage] stage with [customer_count] customers."
```

### Moat Section Spec

The `methodologyNote` field should be structured as follows:

```typescript
export interface MethodologyNote {
  dataLayersUsed: string[];       // e.g., ["Company profile", "AI enrichment", "B2B SaaS benchmarks (Growing stage)", "Pain point cross-referencing"]
  crossReferences: string[];      // e.g., ["Connected 'onboarding drop-off' pain point to 3 moments across Onboarding and Adoption stages"]
  frameworksApplied: string[];    // e.g., ["CCXP professional standards", "B2B fintech vertical benchmarks"]
  personalizedTo: string;         // e.g., "Built specifically for Vendora, an 80-employee B2B payment platform at Growing stage with 145 active merchants"
}
```

The UI can render this as:
- A collapsible "How CX Mate built this analysis" section at the bottom of the analysis page
- Inline badges throughout the page ("6 data layers" / "14 cross-references" / "CCXP + fintech benchmarks")
- A methodology card in the export/PDF version

### New Output Fields

```typescript
// Add to GeneratedJourney interface:
methodologyNote?: MethodologyNote;
```

Add to the JSON schema in the prompt:
```
"methodologyNote":{"dataLayersUsed":["str"],"crossReferences":["str"],"frameworksApplied":["str"],"personalizedTo":"str"}
```

### Before vs After

**BEFORE:** No methodology output exists.

**AFTER:**
```json
{
  "methodologyNote": {
    "dataLayersUsed": [
      "Company profile (Vendora, 80 employees, B2B payment platform)",
      "AI-enriched company intelligence (high confidence)",
      "B2B fintech vertical benchmarks (Growing stage)",
      "Company size benchmarks (51-150 employees)",
      "CX maturity assessment (CSAT active, no NPS, mix of data and gut)",
      "Pain point cross-referencing (3 stated pain points mapped)",
      "Competitive landscape (Stripe, Adyen, PayPal Business)",
      "Business data modeling ($18K ACV, $2.6M ARR estimated)"
    ],
    "crossReferences": [
      "Connected 'onboarding drop-off' pain point to 3 moments in Onboarding and Adoption stages and 1 blind spot",
      "Connected 'silent churn' pain point to 2 moments in Adoption and Renewal stages and 2 blind spots",
      "Cross-referenced HubSpot + Intercom stack against 8 recommended actions with tool-specific implementation steps",
      "Mapped $18K ACV against B2B fintech Growing-stage benchmarks to calculate $340K annual revenue at risk",
      "Compared Vendora's renewal process against Stripe and Adyen's published best practices"
    ],
    "frameworksApplied": [
      "CCXP professional standards (6 competency domains)",
      "B2B fintech vertical benchmarks (churn, activation, NRR)",
      "Growing-stage maturity guidance (key focus areas, common mistakes)",
      "CX Influencer frameworks: Effortless Experience (CES at onboarding), Jobs-to-be-Done (activation design)"
    ],
    "personalizedTo": "Built specifically for Vendora, an 80-employee B2B payment platform at Growing stage with approximately 145 active merchants and $2.6M estimated ARR"
  }
}
```

---

## Directive 7: AI-First Suggestions

### What Currently Exists

The journey prompt has a brief mention on line 429: `Prefer AI agents over manual tools.` This is the only AI-first instruction. It produces generic tool recommendations like "Use a CS platform" without specifying AI-native approaches.

The recommendation prompt (lines 308-329) has an extensive agentic instruction block with specific AI agent categories, platform names, and an automation-level taxonomy (fully autonomous / agent-assisted / human-led). However, this richness exists ONLY in the playbook prompt — the journey prompt that generates the initial analysis has almost nothing.

The `cxToolRecommendation` field on `GeneratedMoment` and the `cxToolRoadmap` array on `GeneratedJourney` exist but are underutilized and never specify AI-native approaches.

### What Needs to Change

**A. Add an AI-first instruction block to the journey prompt, replacing the single-line instruction on line 429:**

```
## AI-First Recommendation Rules

For every moment recommendation and every cxToolRoadmap entry, think AI-NATIVE first:

1. AUTOMATION LEVEL: Every recommendation string should start with one of:
   - "[autonomous]" — an AI agent handles this end-to-end
   - "[agent-assisted]" — AI does heavy lifting, human makes final call
   - "[human-led]" — human drives, AI provides context/drafts

2. SPECIFICITY: Name the actual AI tool or agent platform, not just the category:
   - BAD: "Set up automated onboarding"
   - GOOD: "[agent-assisted] Deploy an Intercom Fin-powered onboarding agent that guides merchants through first transaction setup, detects confusion via sentiment analysis, and escalates to CS only when activation stalls past day 5"

3. INTEGRATION: When the user has existing tools, recommend AI layers ON TOP of their stack:
   - If they use HubSpot: "HubSpot AI agent workflows" not "switch to Gainsight"
   - If they use Intercom: "Intercom Fin for autonomous first-response" not "add a chatbot"
   - If no tools specified: recommend full AI-native stack (Intercom Fin, HubSpot AI, Gong)

4. FUTURE-PROOF: Every cxToolRoadmap entry should include AI-native tools:
   - Support: Intercom Fin, Zendesk AI, Ada
   - Sales intelligence: Gong, Fireflies, 11x.ai
   - CS health: Gainsight Staircase AI, ChurnZero AI
   - Workflow automation: Zapier AI agents, Make AI, n8n with LLM nodes
   - Feedback analysis: SentiSum, MonkeyLearn, Qualtrics XM
```

**B. Add `automationLevel` field to `GeneratedMoment` recommendations:**

Currently, recommendations are plain strings. To enable the UI to render automation-level badges, we need a structured format. However, since recommendations is `string[]`, the simplest approach is the prefix convention defined above: `[autonomous]`, `[agent-assisted]`, or `[human-led]` at the start of each recommendation string. The UI can parse these prefixes to render badges.

**C. Add `aiSuggestion` field to the `CxToolRecommendation` interface:**

```typescript
export interface CxToolRecommendation {
  tool: string;
  whenToDeploy: string;
  whyThisTool: string;
  expectedOutcome: string;
  aiCapability?: string;      // NEW: What AI/agent capability this tool provides
  automationLevel?: "autonomous" | "agent_assisted" | "human_led";  // NEW
}
```

**D. Update the JSON schema in the prompt** to include the new fields on cxToolRoadmap:

Add to cxToolRoadmap schema: `"aiCapability":"str","automationLevel":"autonomous|agent_assisted|human_led"`

### AI-First Suggestion Format

Every AI suggestion (whether in moment recommendations, cxToolRoadmap, or techStackRecommendations) should follow this structure:

| Field | Type | Description | Example |
|---|---|---|---|
| Tool/platform name | string | Specific named tool, not category | "Intercom Fin" not "chatbot" |
| What it does autonomously | string | The agent's behavior, not just feature list | "Resolves 60-70% of merchant setup questions without human intervention" |
| What it escalates | string | When/why a human gets involved | "Escalates when merchant sentiment drops or activation stalls past day 5" |
| Integration point | string | How it connects to their existing stack | "Syncs resolution data back to HubSpot contact timeline" |
| Automation level | enum | autonomous / agent_assisted / human_led | "agent_assisted" |

### Before vs After

**Moment recommendation BEFORE:**
```json
{ "recommendations": ["Set up an activation tracking system", "Create onboarding email sequence"] }
```

**Moment recommendation AFTER:**
```json
{
  "recommendations": [
    "[agent-assisted] Deploy Intercom Fin to guide new merchants through first transaction setup — auto-detects confusion and escalates to CS when activation stalls past day 5",
    "[autonomous] Configure a HubSpot AI workflow that monitors activation milestones and auto-sends personalized re-engagement when a merchant hasn't processed a transaction by day 3"
  ]
}
```

**cxToolRoadmap BEFORE:**
```json
{
  "tool": "Customer Success Platform",
  "whenToDeploy": "Month 1",
  "whyThisTool": "Track customer health",
  "expectedOutcome": "Reduce churn"
}
```

**cxToolRoadmap AFTER:**
```json
{
  "tool": "Gainsight Staircase AI",
  "whenToDeploy": "Month 1 — connect to HubSpot + Intercom data",
  "whyThisTool": "AI-powered health scoring that monitors Vendora's merchant signals continuously and auto-flags risk before humans notice",
  "expectedOutcome": "Detect at-risk merchants 2-3 weeks earlier than manual review",
  "aiCapability": "Autonomous health scoring agent that learns from Vendora's churn patterns and improves predictions over time",
  "automationLevel": "agent_assisted"
}
```

---

## Recommendation Prompt Changes

The recommendation prompt (`recommendation-prompt.ts`) already has strong AI-first instructions (lines 308-329). The following changes align it with the journey prompt directives:

1. **Evidence (Directive 1):** The recommendation prompt consumes journey data that now has evidence fields. Add an instruction: "When referencing a journey insight, cite its evidence: 'Based on [evidenceBasis], we recommend...'"

2. **Context screaming (Directive 2):** Add the same personalization rules to the recommendation prompt. The recommendation prompt already references `${input.companyName}` and tools, but should enforce the screenshot test for every `action`, `template`, and `expectedOutcome` field.

3. **Tense (Directive 3):** Add the same tense matrix. The recommendation prompt should match tense with the journey. "Start doing this NOW" for growing companies. "When you launch, SET UP..." for pre-launch.

4. **Generic anchoring (Directive 5):** Add the same "Similar companies to you" anchoring rule. Templates and expected outcomes should use "B2B [vertical] teams at [Company]'s stage" instead of generic claims.

5. **AI-first (Directive 7):** Already covered extensively. No additional changes needed.

6. **Moat (Directive 6):** Not applicable to recommendation prompt — methodology note is a journey-level output.

---

## Summary of New Output Fields

| Interface | Field | Type | Required | Directive |
|---|---|---|---|---|
| `ConfrontationInsight` | `evidenceBasis` | `string` | Yes (new REQUIRED) | 1 |
| `GeneratedMoment` | `diagnosis` | `string` | Yes (upgrade from optional to REQUIRED, new format) | 1 |
| `GeneratedJourney` | `methodologyNote` | `MethodologyNote` | Yes (new) | 6 |
| `CxToolRecommendation` | `aiCapability` | `string` | No (optional) | 7 |
| `CxToolRecommendation` | `automationLevel` | `"autonomous" \| "agent_assisted" \| "human_led"` | No (optional) | 7 |

New interface:

```typescript
export interface MethodologyNote {
  dataLayersUsed: string[];
  crossReferences: string[];
  frameworksApplied: string[];
  personalizedTo: string;
}
```

---

## Token Budget Considerations

The current prompt produces output under 8192 tokens (the `max_tokens` setting). Adding these directives increases output size. Estimated impact:

| Directive | Token Impact | Notes |
|---|---|---|
| 1 (Evidence) | +200-400 tokens | `diagnosis` and `evidenceBasis` add ~20-30 words each across ~15 items |
| 2 (Context) | +100-200 tokens | Slightly longer descriptions, but same field count |
| 3 (Tense) | +0 tokens | Changes word choice, not length |
| 5 (Anchoring) | +50-100 tokens | Slightly longer benchmark references |
| 6 (Moat) | +200-300 tokens | New `methodologyNote` object |
| 7 (AI-first) | +100-200 tokens | Slightly longer recommendations with tool specifics |
| **Total** | **+650-1200 tokens** | Within budget if we stay concise |

**Recommendation:** Keep the "ULTRA CONCISE — every field max 12 words" instruction but add an exception: "Evidence fields (diagnosis, evidenceBasis) and methodologyNote are exempt from the 12-word limit — these should be thorough. All other fields: max 12 words."

If output consistently truncates, consider:
1. Reducing moment count from 2 per stage to 1-2 (allow 1 for smaller journeys)
2. Reducing techStackRecommendations from 2-3 to 2
3. Increasing `max_tokens` from 8192 to 10000 (costs ~$0.003 more per call)

---

## Implementation Checklist

For the developer implementing these changes:

1. [ ] Add `MethodologyNote` interface to `journey-prompt.ts`
2. [ ] Add `evidenceBasis` field to `ConfrontationInsight` interface
3. [ ] Add `aiCapability` and `automationLevel` fields to `CxToolRecommendation` interface
4. [ ] Make `diagnosis` required on `GeneratedMoment` (remove `?`)
5. [ ] Add `TENSE_MATRIX` constant and inject into `buildAnalysisModeContext()`
6. [ ] Add Evidence Requirement instruction block to prompt
7. [ ] Add Personalization Rules instruction block to prompt
8. [ ] Add Generic Statement Anchoring Rule to prompt
9. [ ] Add AI-First Recommendation Rules block (replacing single line 429)
10. [ ] Add Methodology Note instruction block to prompt
11. [ ] Update JSON schema string in the prompt to include all new fields
12. [ ] Update the 12-word exemption for evidence and methodology fields
13. [ ] Add `methodologyNote` to `GeneratedJourney` interface
14. [ ] Update recommendation prompt with evidence citation, tense matrix, personalization, and anchoring rules
15. [ ] Test with a Growing-stage company (present tense) and a Pre-launch company (future tense) to verify tense correctness
16. [ ] Verify output stays under 8192 tokens; if not, adjust counts or raise limit
