# CX Intelligence Stack™ — Source of Truth

**Version:** 1.0 | **Created:** 2026-03-07 | **Owner:** Shoval (COO) + AI Engineer
**Full working paper:** `O-output/cx-mate-enrichment-layer-architecture.md`
**Wired into:** `src/lib/cx-knowledge/` · `src/lib/ai/journey-prompt.ts`

---

## What This Is

The CX Intelligence Stack is the intellectual property of CX Mate. It is the structured set of knowledge sources that make CX Mate's output fundamentally different from an LLM asked a question.

Any LLM can take a company name and return generic CX advice. CX Mate cross-references a specific company's situation against 7 compounding layers — and produces analysis that could not exist without all layers present.

**This document is the operational spec. Read it before touching any intelligence layer.**

---

## Architecture Overview

```
LAYER 6: Outcome Intelligence      ← what actually worked — the learning loop   [FUTURE MOAT]
LAYER 5: External Signals          ← regulatory, social, company stage signals
LAYER 4: User Intelligence         ← behavior, real CRM/CS + MEDDPICC, aggregate patterns
LAYER 3: Technology Intelligence   ← what tools + AI can do RIGHT NOW            [FRESHNESS ENGINE]
LAYER 2: Market Intelligence       ← competitor gaps, benchmarks, hiring signals
LAYER 1: Methodology Intelligence  ← CX frameworks, CCXP, EX-CX link, research citations
LAYER 0: Input Foundation          ← 33 onboarding fields + website enrichment

+ ENABLEMENT LAYER: Right action + right message at every journey moment (output layer)
```

Two parallel architectures:
- **Intelligence IN** (Layers 0–6): makes the analysis smarter
- **Enablement OUT** (Execution + Message): makes every action self-executing, every moment covered

---

## Layer Reference

### L0 — Input Foundation
**Status:** ✅ Live

**What it is:** The structured context for this specific company. Without it, nothing is personalized.

**What it includes:**
- 33 onboarding fields (company name, website, vertical, maturity, size, customer description, channel, NPS/CSAT/CES, pain points, goals, competitors, tech stack, existing journey components, pricing model, revenue, deal size, timeframe)
- Website enrichment: Claude scrapes company site → description, vertical, competitors, channel
- Derived: `hasExistingJourney`, `journeyType`, `companyMaturityLabel`

**Source of truth for required fields:** `src/lib/validations/onboarding.ts` + `src/types/onboarding.ts`
**Consumer:** `src/lib/ai/journey-prompt.ts` (uses 33+ fields)
**⚠️ Critical constraint:** Onboarding MUST collect all fields that `journey-prompt.ts` consumes. Dropping fields = degraded output.

---

### L1 — Methodology Intelligence
**Status:** Partially wired. B-brain exists. EX layer not yet built.

**Sub-layers:**
- **1A — CX Influencer Frameworks** → `src/lib/cx-knowledge/cx-influencer-frameworks.ts` · `B-brain/01-cx-methodology/cx-influencers-2026.md`
  - 15 named expert frameworks. Injected into journey + recommendation prompts.
  - ⚠️ Keren Shaked: Israeli CX practitioner — monitor LinkedIn actively for new frameworks
  - Selection functions: `getFrameworksByContext()`, `getRelevantFrameworks()`, `buildInfluencerPromptContext()`
- **1B — CCXP Body of Knowledge** → `B-brain/01-cx-methodology/`
  - 6 competency blocks with maturity variants
- **1C — Research + Academic** → Qualtrics XM Institute (annual ✅), KPMG Six Pillars (annual ✅), Forrester, Gartner, HBR
- **1D — Employee Experience Layer** → NOT YET BUILT
  - CS Glassdoor <3.5 = CX quality risk; CS median tenure <12 months = knowledge leak; LinkedIn "Open to Work" surge = attrition signal
  - EX predicts CX degradation 6–9 months before churn data shows it

**Update cadence:** Annual (research). Weekly (LinkedIn RSS). On-demand (Glassdoor per company).
**Web enrichment:** ✅ LinkedIn RSS. Glassdoor on-demand.

---

### L2 — Market Intelligence
**Status:** Static benchmarks live. Scrapers not built.

**Sub-layers:**
- **2A — Competitive Intelligence:** G2 reviews of Gainsight, ChurnZero, Totango, Intercom, HubSpot. Changelog scrapers.
- **2B — Industry Benchmarks by Vertical:** NPS (Retently), churn (Baremetrics/OpenView), CSAT (ACSI), CES (Gartner), TTV (UserPilot), renewal rates (Gainsight)
- **2C — Hiring Signal Intelligence:** LinkedIn Jobs — "Head of CX" = hot ICP, "Onboarding Specialist" = onboarding breaking

**Update cadence:** Weekly (changelogs). Monthly (G2). Annual (benchmarks).
**Web enrichment:** ✅ Continuous scrapers planned.

---

### L3 — Technology Intelligence ⭐ (fastest-moving layer)
**Status:** Static tool data live in `src/lib/cx-knowledge/cx-tools/`. No automation yet.

**Why it matters:** CX tools ship features weekly. AI capabilities shift quarterly. Stale tool recommendations destroy credibility.

**Sub-layers:**
- **3A — Tech Stack Capability Intelligence:** 25+ tools across 7 categories (CRM, CS platforms, Support, Survey, Analytics, Automation, AI Assistants). What changes = AI features, automation depth, workflow integration.
- **3B — AI Capability Intelligence:** Updated quarterly. What AI can do for CX NOW (conversation analysis, VoC synthesis, predictive churn, QBR prep, NotebookLM qualitative synthesis, Gemini Workspace)
- **3C — Gemini Export Pattern:** CX-Mate-Context.json → user drops into Gemini → cross-references against Gmail/Drive/Sheets. Start with structured export, NOT a Gemini Extension.

**Tooling for automation (no custom scrapers):** Browse AI / Skyvern / MultiOn — give them a goal ("summarize HubSpot 'What's New' weekly"). Alternative: Feedly + Zapier/Make + Claude classification.

**Update cadence:** Weekly (tools). Quarterly (AI capabilities).
**Web enrichment:** ✅ Continuous. Highest urgency to automate.

---

### L4 — User Intelligence
**Status:** 4A (PostHog behavior) live ✅. 4B integrations: Sprint 6. 4C: post-scale.

**Sub-layers:**
- **4A — CX Mate User Behavior (PostHog):** Playbook completion rates, journey engagement, export rates, upgrade triggers
- **4B — Founder's Own Customer Data (Pro tier, OAuth):**
  - Standard: HubSpot / Salesforce / Intercom / Zendesk / survey platforms
  - **MEDDPICC / SPICED sales-to-CS bridge** — highest-value data almost no CX tool touches:
    - Metrics field = customer's success criteria CS must prove
    - Champion field = #1 relationship to protect. **Departure = churn triples**
    - Discount % + sales cycle length = churn predictors
  - **Champion Departure Trigger:** LinkedIn API or Salesforce change tracking → auto-trigger Rescue Playbook
  - **Expectation Gap Alert:** surface when sales promise ≠ onboarding delivery
- **4C — Aggregate Intelligence (post-100 users):** "companies like yours" patterns. The Gainsight model. The endgame.

**Update cadence:** 4A real-time. 4B on-demand OAuth. 4C monthly aggregate.
**Web enrichment:** ❌ Internal only (OAuth, not scraping).

---

### L5 — External Signal Intelligence
**Status:** Not yet built.

**Sub-layers:**
- **5A — Regulatory:** GDPR, EU AI Act, FTC, CCPA. Quarterly audit.
- **5B — Social CX Signals:** #cx, #customersuccess trending. Viral CX examples. Thought leader frameworks.
- **5C — Company Stage Signals:** Crunchbase (funding rounds = ICP timing). LinkedIn Jobs (CS hiring surge = scaling pain). Just raised Series A = 12-month board metric window.

**Update cadence:** Weekly (social, hiring). Quarterly (regulatory).
**Web enrichment:** ✅ Social + Crunchbase + LinkedIn.

---

### L6 — Outcome Intelligence ⭐ (future moat)
**Status:** Playbook status tracking exists. Outcome correlation engine: planned post-Sprint 6.

**What it is:** The learning loop. Which CX Mate recommendations, when implemented, actually moved metrics.

**The loop:**
```
RECOMMENDATION → user marks IMPLEMENTED → integration shows METRIC CHANGE → OUTCOME recorded → AGGREGATE PATTERN built
```

**Why to start now:** Cannot backfill. Every day without tracking is a day of lost pattern data.

**Current hooks:** Playbook status tracking (existing) → Revenue Protected counter (Starter)
**Full loop requires:** Integration data (Sprint 6+) + outcome correlation engine

**Update cadence:** Continuous (status). Monthly (correlation analysis).
**Web enrichment:** ❌ Internal only.

---

## Enablement + Message Intelligence (Activation Layer)

The intelligence layers determine WHAT the situation is. The execution layer says HOW to fix it. The enablement layer says WHAT TO SAY and WHAT TO SEND — to the customer, to the team, and via marketing assets — at every journey moment.

**Three tracks:**

**Track A — Customer Messages:**
- Moment-triggered templates per stage: kickoff, 30-day check-in, QBR invite, renewal, win-back
- Persona-specific: Champion vs. Economic Buyer vs. End User vs. Technical Evaluator
- Personalized in Pro tier using L4B data (champion name, their MEDDPICC metrics, usage stats)

**Track B — Internal CS Enablement:**
- Talk tracks per stage: kickoff call, business review, churn save, expansion pitch, renewal close
- Objection handling by pain point and competitor
- QBR deck skeleton (auto-populated with their metrics)
- CS team onboarding materials

**Track C — Marketing Alignment:**
- Marketing asset mapping by stage (which content to deploy when)
- G2/Capterra review trigger: NPS ≥9 AND milestone hit — not before
- Referral trigger: first customer success milestone
- Advocacy design: what touchpoint earns the right to ask for a customer story

**Where templates live:** `B-brain/03-templates/` (to be built)

**Pricing:**
| Tier | Enablement Depth |
|------|-----------------|
| Free | Generic stage templates (maturity-matched) |
| Starter | Vertical + maturity personalized, tone calibration |
| Pro | Personalized with real data (L4B: champion name, their metrics) |
| Premium | Marketing alignment, advocacy design, customer story pipeline |

---

## Three-Tier Moat

| Tier | What | Status |
|------|------|--------|
| **Tier 1 — Data Moat** | L4C aggregate patterns. Companies × outcomes × interventions. Impossible to replicate without the same users tracked over the same time. | Future |
| **Tier 2 — Workflow Moat** | Sales promise → CS handoff → journey → outcome tracking. When a founder leaves CX Mate, they lose the thread of WHY the customer bought. | Strong today |
| **Tier 3 — Intelligence Architecture** | The 6-layer stack itself. Can be replicated in 6–12 months by a well-funded competitor. | Replicable |

> **The engine is not the moat. The fuel (data) and gravity (workflow dependency) are.**

---

## Pricing Alignment (updated 2026-03-07)

| Tier | Intelligence Layers Active |
|------|---------------------------|
| **Free** | L0 + L1 (static) + L2 (static benchmarks) + L3 (static tool recs) → full one-time run |
| **Starter** | + L4A behavior tracking + L6 basic (Revenue Protected, playbook status) |
| **Pro** | + L4B real CRM/CS data + L3 live (weekly-refreshed) + Champion tracking + Expectation Gap Alert + Layer 6 full loop + Enablement Track A+B personalized |
| **Premium** | + L4C aggregate intelligence (when available) + Enablement Track C (marketing alignment) + multi-seat |

**Flag (for next pricing copy update):** Free tier tool recommendations use *static* Layer 3 data. Pro tier uses *live-refreshed* Layer 3. This distinction should be explicit in pricing copy.

---

## Implementation Priority

| Priority | What | Layer | Why |
|----------|------|-------|-----|
| 1 | Champion departure tracking | L4B | Triples churn probability. Most valuable single signal. |
| 2 | Expectation Gap Alert UX | L4B | MEDDPICC → confrontation insight. Highest-value visible Pro feature. |
| 3 | Layer 6 outcome schema | L6 | Start now. Can't backfill. The future moat starts here. |
| 4 | Enablement Pack (stage templates + CS scripts) | Enablement | Immediate Free/Starter value. B2B ICP's most-requested output. |
| 5 | Layer 3 tooling (Browse AI / Skyvern) | L3 | 5 changelogs, ~1 day setup. Prevents staleness. |
| 6 | Gemini export schema | L3C | Define CX-Mate-Context.json. No-engineering Free tier win. |

---

*Full working paper: `O-output/cx-mate-enrichment-layer-architecture.md`*
*Related: `C-core/product-architecture.md` · `O-output/intelligence-layers-roadmap.md` · `src/lib/cx-knowledge/`*
*Last updated: 2026-03-07*
