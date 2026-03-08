# CX Mate — The Intelligence Stack: Enrichment Layer Architecture
**Working Paper** | Created: 2026-03-07 | Last updated: 2026-03-07 (added Enablement + Message Intelligence layer)
*Agents: Shoval (COO), Tech Lead, CX Architect, AI Engineer, Growth Agent*
*Validated by: Gemini (Google) + ChatGPT (OpenAI) external review*
*Extends: `O-output/intelligence-layers-roadmap.md` · Grounded in: `C-core/product-architecture.md`*

---

## This Architecture IS the IP

The 6-layer intelligence stack is not a feature. It is the intellectual property of CX Mate.

Any LLM can take a company name and return generic CX advice. What CX Mate does is structurally different: it cross-references a company's specific situation against 6 layers of enrichment — methodology, market benchmarks, live tool capabilities, user behavior, external signals, and outcome patterns — and produces analysis that could not exist without all 6 layers present.

**This stack is the moat. It should be named, protected, and deepened with every sprint.**

Name: **The CX Intelligence Stack™** — 7 layers, each compounding the one below.

---

## The Three-Tier Moat

Both Gemini and ChatGPT confirmed the same moat structure. Not all layers are equally defensible:

### Tier 1 — Data Moat (strongest, future)
**Layer 4C: aggregate intelligence.** Once CX Mate has 100+ companies, it knows which CX interventions actually move revenue for specific vertical/maturity combinations. This takes years to replicate. You cannot buy it. It requires the same ICP, the same product, the same signals, and the same outcomes tracked over time. This is the Gainsight model. This is the endgame.

### Tier 2 — Workflow Moat (strong today)
**The Sales → CS → CX continuity loop.** Most tools stop at: CRM → deal closed → onboarding. CX Mate does: sales promise (MEDDPICC) → buying context → journey design → playbook → execution → outcome tracking → aggregate intelligence. That is end-to-end context continuity. Almost no product touches the sales promise layer. When a founder stops using CX Mate, they lose the historical thread of *why the customer bought in the first place*.

### Tier 3 — Intelligence Architecture (medium, replicable)
**The 6-layer stack itself can be replicated by a well-funded competitor in 6–12 months.** The framework, the scraper infrastructure, the methodology database — these are engineering problems. What cannot be replicated: the data, the patterns, the embedded workflow gravity.

> **The engine is not the moat. The fuel and the gravity are.**
> Stack = Engine | Data = Fuel | Usage = Gravity

Implication: invest sprint capacity in deepening Tier 1 (aggregate patterns) and Tier 2 (sales-to-CS workflow) before Tier 3 (scraper infrastructure).

---

## The Big Picture

CX Mate operates two parallel architectures:

**Intelligence Architecture (data IN):** 7 layers that make the *analysis* smarter.
**Execution Architecture (guidance OUT):** Makes every playbook action *self-executing* — how-to steps, tool recommendation, copy-paste AI prompt.

---

## Intelligence Architecture: All 7 Layers

```
LAYER 6: Outcome Intelligence      ← what actually worked — the learning loop  ⭐ FUTURE MOAT
LAYER 5: External Signals          ← regulatory, social, company stage signals
LAYER 4: User Intelligence         ← behavior, real CRM/CS + MEDDPICC data, aggregate patterns
LAYER 3: Technology Intelligence   ← what tools + AI can do RIGHT NOW  ⭐ FASTEST MOVING
LAYER 2: Market Intelligence       ← competitor gaps, benchmarks, hiring signals
LAYER 1: Methodology Intelligence  ← CX frameworks, CCXP, EX-CX link, research citations
LAYER 0: Input Foundation          ← 33 onboarding fields + website enrichment
```

---

### Layer 0 — Input Foundation
**What it is:** The structured inputs that define this specific company's context. Everything upstream uses this as the base. Without it, nothing is personalized.

**What it includes:**
- 33 onboarding fields: company name, website, vertical, maturity stage (pre-launch / first customers / growing / scaling), company size, customer description, main channel, NPS/CSAT/CES history, pain points, goals, competitors, tech stack, existing journey components, pricing model, revenue range, deal size, timeframe
- Website enrichment: Claude scrapes company site → extracts description, vertical, competitor detection, channel inference
- Derived fields: `hasExistingJourney`, `journeyType`, `companyMaturityLabel`

**Where the data comes from:** User input (wizard) + Claude API website scraping (once per session)

**Update cadence:** Once per session. Static after onboarding.

**Web enrichment:** Website scraping only. No ongoing enrichment.

**Current status:** ✅ Live. All 33 fields wired to journey generation prompt.

---

### Layer 1 — Methodology Intelligence
**What it is:** The intellectual foundation — CX theory, named expert frameworks, academic research, and the EX-CX link. Makes output sound like a senior domain expert wrote it.

**What it includes:**

*1A — CX Influencer Frameworks*
Named, citable frameworks injected into confrontation insights and playbook:
- Annette Franz: Customer-Centric Culture, 6 Pillars, VoC architecture
- Jeanne Bliss: 5 Competency Model, Chief Customer Officer, Champion Blindspot research
- Ian Golding: CX professional standards, measurement frameworks
- Shep Hyken: Convenience model, customer amazement, loyalty loops
- Nir Eyal: Hook Model (habit formation = product stickiness)
- Matt Dixon: Effortless Experience, Customer Effort Score (CES)
- Fred Reichheld: NPS origin, loyalty economics, Bain research
- **Keren Shaked** *(Israeli CX practitioner — LinkedIn actively monitored)*: Practical CX for B2B startups, speaks in founder language (revenue/churn/growth, not "satisfaction"). Directly relevant to CX Mate ICP. Entry to be enriched continuously from her LinkedIn content.
- LinkedIn CX thought leader RSS: emerging frameworks (weekly)

*1B — CCXP Body of Knowledge*
6 competency blocks with early/growing/established variants:
Customer-Centric Culture · VoC & Insight · Organizational Adoption · CX Strategy · Design & Innovation · Metrics & ROI

*1C — Research & Academic Intelligence*
Forrester CX Index (annual) · Qualtrics XM Institute (annual, wired ✅) · Gartner (quarterly) · KPMG Six Pillars (annual, wired ✅) · Bain loyalty economics · HBR CX articles (monthly RSS)

*1D — Employee Experience Layer*
The EX-CX correlation is well-documented and underused in CX tools. CS team health predicts CX quality degradation 6–9 months before it shows in churn data.
- CS Glassdoor score <3.5 = CX quality risk flag
- CS team median tenure <12 months = knowledge leak risk (LinkedIn signal)
- eNPS <20 = team not invested in customer success
- "Open to Work" surges in CS team (LinkedIn) = imminent attrition signal
- Support response time spikes on public channels (Twitter/X, Slack communities) = team burnout signal
- VP/Head of CS departure = customer program destabilization risk
- Research: Gallup Q12 → 10% higher customer loyalty; XM Institute EX-CX linkage

**Where the data comes from:** Manual curation → `B-brain/01-cx-methodology/`. LinkedIn RSS weekly. Glassdoor on-demand per company.

**Update cadence:** Annual (research). Weekly (LinkedIn feed). On-demand (Glassdoor per company).

**Web enrichment:** ✅ LinkedIn RSS (weekly). Glassdoor scraper (on-demand).

**Current status:** B-brain exists. Influencer frameworks partially wired. CCXP module structured. EX layer not yet built.

---

### Layer 2 — Market Intelligence
**What it is:** What the market is doing — competitor weaknesses, vertical benchmarks, and where companies are in their CX maturity.

**What it includes:**

*2A — Competitive Intelligence*
G2 reviews of Gainsight, ChurnZero, Totango, Intercom, HubSpot (complaints = CX Mate opportunity). Product changelogs weekly. ProductHunt new launches. G2 reviews of CX Mate itself once live.

*2B — Industry Benchmarks by Vertical*
NPS by vertical (Retently annual) · Churn by ARR tier (Baremetrics, OpenView) · CSAT (ACSI, Qualtrics) · CES (Gartner/Dixon) · Time-to-value (UserPilot, Gainsight) · Renewal rates (Gainsight/Totango annual)

*2C — Hiring Signal Intelligence*
"Head of CX" posting = hot ICP. "Onboarding Specialist" = onboarding breaking. Surge in CS roles = scaling pain. Source: LinkedIn Jobs API.

**Where the data comes from:** G2 scraper (monthly), changelog scrapers (weekly), benchmark reports (annual manual curation), LinkedIn Jobs API.

**Update cadence:** Weekly (changelogs). Monthly (G2). Annual (benchmarks).

**Web enrichment:** ✅ Continuous — G2 + changelog scrapers.

**Current status:** Static benchmarks in `src/lib/cx-knowledge/`. Scrapers not yet built.

---

### Layer 3 — Technology Intelligence ⭐
**What it is:** The fastest-moving layer. What 25+ CX tools and AI can actually do *today*. Without this, recommendations go stale within months.

**This is the freshness engine.** CX tools ship meaningful features weekly. AI capabilities shift every 90 days. "Build a custom health score" is wrong if Gainsight shipped native AI health scoring last month.

**What it includes:**

*3A — Tech Stack Capability Intelligence*

| Category | Key Tools | What Changes |
|----------|-----------|--------------|
| CRM | HubSpot, Salesforce, Pipedrive | AI features, CS modules, automation depth |
| Customer Success | Gainsight, ChurnZero, Totango, Vitally | Health scoring, playbook AI, automated nudges |
| Support | Intercom, Zendesk, Freshdesk | AI deflection, copilot, sentiment analysis |
| Survey/Feedback | Delighted, Survicate, AskNicely, Typeform | Event triggers, AI analysis, CS workflow integration |
| Analytics | Mixpanel, Amplitude, PostHog | Cohort models, predictive features |
| Automation | Zapier, Make, Clay | New connectors, AI steps |
| AI Assistants | Notion AI, Claude, ChatGPT, Gemini | Capabilities, context windows, tool integrations |

*3B — AI Capability Intelligence*
Updated quarterly — what AI can actually do for CX today:
- Conversation analysis: real-time transcript processing (GPT-4o, Claude 3.5)
- VoC synthesis: LLM over survey + review data
- QBR prep: Claude/Notion AI saves 4h/quarter
- Predictive churn: time-series + LLM
- NotebookLM: qualitative synthesis (free, privacy-safe)
- Gemini + Workspace: native access to Gmail/Drive/Sheets/Docs

*3C — Gemini Tool Integration Pattern*
Google Gemini has native tool-use capability connecting to Google Workspace. Integration model (validated by both Gemini and ChatGPT): **start with structured export, not a Gemini Extension.**

Why not Extension first: requires Google review, OAuth/privacy approval, ecosystem lock-in, maintenance overhead — slows B2B adoption significantly.

**The right model — CX Mate as Orchestration Layer:**
1. CX Mate exports a structured "Intelligence Package" (JSON + markdown)
2. User drops it into Gemini with Workspace access enabled
3. Gemini cross-references CX Mate journey/playbook against their Gmail CS threads, Drive docs, meeting notes, Sheets data
4. Example prompt: *"Here is my CX Mate journey analysis. Here are my last 6 months of CS emails in Gmail. Where are we failing to execute on the promised MEDDPICC metrics?"*

CX-Mate-Context.json schema (draft):
```json
{
  "company_summary": { "name", "vertical", "maturity", "stage_count" },
  "journey_map": { "stages": [...], "key_risks": [...] },
  "confrontation_insights": [...],
  "playbook": { "priority_actions": [...], "completed": [...] },
  "sales_context": { "meddpicc": {...}, "champion": {...} },
  "customer_segments": [...]
}
```

Future: Gemini Workspace Add-on — highlight a CS email, analyze against CX Mate playbook inline.

**Where the data comes from:**
- Tool changelogs: RSS + HTML scrapers (weekly)
- AI capabilities: quarterly review by AI Engineer
- ProductHunt: weekly
- **Recommended tooling (no custom scrapers):** Use **Browse AI**, **Skyvern**, or **MultiOn** — give them a goal ("visit HubSpot 'What's New' weekly, summarize Service Hub changes, output JSON"), not a CSS selector. Bypasses scraper maintenance entirely. Alternative: **Feedly** (RSS aggregation) + **Zapier/Make** + Claude classification → database.

**Update cadence:** Weekly (tools). Quarterly (AI capabilities).

**Web enrichment:** ✅ CONTINUOUS. Highest urgency to automate.

**Current status:** Static tool data in `src/lib/cx-knowledge/cx-tools/`. No scrapers yet. Quarterly manual update is current process.

---

### Layer 4 — User Intelligence
**What it is:** CX Mate's own user behavior, founders' actual business data (replacing estimates), and the aggregate anonymized patterns that become the proprietary moat.

**What it includes:**

*4A — CX Mate User Behavior*
Playbook action completion rates · journey stage engagement · export rates (PDF/NotebookLM) · generate-again rate · upgrade triggers. Source: PostHog ✅

*4B — Founder's Own Customer Data (Pro tier)*

Standard CRM/CS integrations:
- HubSpot / Salesforce: deal velocity, close rate, NPS, renewal rates, expansion revenue
- Intercom / Zendesk: support volume, CSAT, escalation rate, churn conversation tags
- Delighted / Survicate / AskNicely: NPS verbatims, CSAT scores

**Sales-to-CS Journey Data — Salesforce + MEDDPICC / SPICED:**

The highest-value data source almost no CX tool touches. When a company has Salesforce with structured qualification data, CX Mate can read:

*MEDDPICC fields and their CS relevance:*
| Field | What it captures | CS implication |
|-------|-----------------|----------------|
| **Metrics** | Business outcomes customer measured at purchase | These ARE their success criteria — CS must prove these moved |
| **Economic Buyer** | Who authorized the purchase | Most important stakeholder to protect at renewal |
| **Decision Criteria** | What they evaluated you against | Still measuring you against this post-sale |
| **Decision Process** | How they bought | How they'll approach renewal |
| **Identified Pain** | Specific problem that drove the purchase | CS must prove this was solved — or churn is certain |
| **Champion** | Who internally sold the deal | #1 relationship to protect. **Their departure = churn** |
| **Competition** | What they almost chose instead | Influences competitive displacement risk |

*SPICED as CS-friendlier alternative:*
SPICED (Situation, Pain, Impact, Critical Event, Decision) is often better suited for CS handoff because it captures **Impact** (what business outcome they need) and **Critical Event** (the deadline to see results — the ultimate churn predictor). Consider supporting both frameworks.

**Champion Departure Trigger — highest-value signal:**
- When a Champion's LinkedIn title changes → churn probability triples
- CX Mate should auto-trigger a "Rescue Playbook": executive alignment steps, relationship rebuilding, new champion identification
- Implementation: LinkedIn API or Salesforce native change tracking on Champion field
- "If your Champion moves to a new company, churn probability triples" — Gemini validation

**Other underutilized CRM fields for churn prediction:**
- **Discount percentage**: large discounts correlate with low product conviction or competitive pressure → churn risk regardless of NPS
- **Sales cycle length**: short cycles = insufficient discovery = expectation gap → churn risk
- **Competitor field**: if customer previously used a competitor, switching behavior is normal for them — elevated churn risk
- **Implementation complexity notes**: deals with heavy customization churn more often (custom = dependency on people, not product)

**Expectation Gap Alert — UX pattern for MEDDPICC:**
Surface MEDDPICC data as invisible intelligence by default (recommendations silently aware of the buying context). Surface explicitly only when there's a gap:
```
⚠️ Sales Promise Risk Detected
Your sales team committed to: Integration in 2 weeks · Automated reporting
Your onboarding currently delivers: Integration after 45 days
Risk: Expectation gap → churn. Move automated reporting to Stage 1.
```

*4C — Aggregate Intelligence (proprietary moat — post 100 users)*
"Companies like yours" benchmarks: anonymized patterns by vertical + maturity + intervention. Implementation success rates. Stage-to-stage patterns. Failure pattern frequency. This is the Gainsight model. It requires scale but is impossible to replicate once built.

**Where the data comes from:** PostHog (4A, live ✅), OAuth integrations (4B, Sprint 6), LinkedIn API + Salesforce change tracking (Champion departure), anonymized CX Mate database (4C, post-scale).

**Update cadence:** 4A real-time. 4B on-demand. 4C monthly aggregate.

**Web enrichment:** ❌ Internal only (OAuth integrations, not web scraping).

---

### Layer 5 — External Signal Intelligence
**What it is:** World context — regulatory shifts, social CX conversations, company stage signals.

**What it includes:**

*5A — Regulatory & Compliance Signals*
GDPR enforcement actions · EU AI Act · FTC consent requirements · CCPA/state privacy laws
Source: IAPP newsletter, EU AI Office, FTC — quarterly audit

*5B — LinkedIn & Social CX Signals*
- #cx, #customerexperience, #customersuccess trending topics
- Viral CX failure examples (named for confrontation framing)
- New framework emergence from thought leaders
- The `cx-intel` daily digest skill does this manually — needs automation

*5C — Company Stage Signals*
Just raised Series A → "professionalize CS, 12 months to show board metrics"
Rapid CS hiring → scaling pain
Just hired Head of CX → warm ICP
Source: Crunchbase API + LinkedIn Jobs API

**Update cadence:** Weekly (social, hiring). Quarterly (regulatory).

**Web enrichment:** ✅ Social monitoring + Crunchbase + LinkedIn scraping.

---

### Layer 6 — Outcome Intelligence ⭐ (new — future moat)
**What it is:** The learning loop. What actually worked. Which CX Mate recommendations, when implemented, actually moved metrics. This is what turns CX Mate from a smart report generator into a learning system.

*This was independently identified by ChatGPT as the missing layer and the ultimate AI moat.*

**What it includes:**
- Recommendation → user implemented (playbook status tracking)
- Implementation → metric moved (via integration data: HubSpot NPS before/after, churn rate before/after)
- Metric → quantified impact ("activation +23% after adding onboarding checklist")
- Impact → pattern ("companies at Growing stage in B2B SaaS that implemented onboarding checklist first saw avg +18% activation in 90 days")

**The loop:**
```
RECOMMENDATION issued
      ↓
User marks IMPLEMENTED (playbook tracking)
      ↓
Integration data shows METRIC CHANGE (HubSpot/Intercom delta)
      ↓
CX Mate records OUTCOME (linked to recommendation + company profile)
      ↓
AGGREGATE PATTERN built after N=50+ ("companies like yours")
      ↓
Future RECOMMENDATIONS are now evidence-based, not benchmark-based
```

**Why this is the endgame:**
Once CX Mate knows which CX actions actually move revenue — for specific verticals, maturities, and company sizes — it becomes uniquely hard to compete with. The recommendations stop being "best practice" and start being "proven pattern." No competitor, no LLM, no consultant has this without the same user base tracked over the same time period.

**Where the data comes from:** Playbook status tracking (existing) + integration data (Sprint 6+) + outcome correlation engine (post-scale).

**Update cadence:** Continuous (status tracking). Monthly (outcome correlation analysis).

**Web enrichment:** ❌ Internal only.

**Current status:** Playbook status tracking exists. Outcome correlation engine: planned post-Sprint 6.

---

## Compounding Stack + Update Cadence

```
LAYER 6  Outcome Intelligence (recommendation → implementation → metric → pattern)
    ↑ adds: evidence-based recommendations, the learning moat
LAYER 5  External signals (regulatory, social, company stage)
    ↑ adds: world context, timing, ICP intent signals
LAYER 4  User intelligence (behavior, CRM/MEDDPICC, Champion tracking, aggregate)
    ↑ adds: actual company data, sales promise context, what works in practice
LAYER 3  Technology intelligence (tools + AI capabilities NOW) + Gemini integration
    ↑ adds: current tool recommendations, Gemini Workspace bridge
LAYER 2  Market intelligence (competitors, benchmarks, hiring)
    ↑ adds: vertical benchmarks, competitive positioning
LAYER 1  Methodology + EX layer (frameworks, CCXP, EX-CX signals, research)
    ↑ adds: expert citations, credibility, employee health signals
LAYER 0  Input foundation (33 fields + enrichment)
    ↑ this is the user's company — without this, nothing is personalized
```

| Layer | Cadence | Web Enrichment | Moat Tier |
|-------|---------|----------------|-----------|
| L0 — Input Foundation | Per session | Website scraping (once) | — |
| L1 — Methodology + EX | Annual / Weekly LinkedIn | ✅ LinkedIn RSS, Glassdoor on-demand | Tier 3 |
| L2 — Market | Monthly G2 / Weekly changelogs | ✅ Continuous scrapers | Tier 3 |
| L3 — Technology ⭐ | **Weekly / Quarterly AI** | ✅ **Continuous — Browse AI / Skyvern** | Tier 3 |
| L4 — User + MEDDPICC | Real-time / On-demand | ❌ OAuth integrations | Tier 1+2 |
| L5 — External | Weekly social / Quarterly regulatory | ✅ Social + Crunchbase | Tier 3 |
| L6 — Outcome ⭐ | Continuous / Monthly analysis | ❌ Internal only | **Tier 1** |

---

## Intelligence Bites: Built-In CX Knowledge

### NPS Validity Threshold
Relationship NPS is only statistically meaningful above **100 responses**. Below that, a single detractor or promoter swings the score by 5+ points — too wide a margin of error to act on.

**Default below 100 customers:** event-triggered (transactional) surveys at specific moments:
- Onboarding completion
- 30-day post-go-live
- Support ticket resolution
- QBR completion
- Renewal signature

**Exception cases where relationship NPS still has value at small scale:**
1. **High-value enterprise** (e.g. 20 customers at $500k ACV each) — use NPS as qualitative open-ended tool. Ignore the score; read the comments. The verbatims are the signal.
2. **Founder-led relationships** — when the founder knows every customer personally, the score is a temperature check, not a metric.

**Rule:** Below 100 customers, use the comments not the number. Above 100, use both.

**Survey platform recommendations by stage:**

| Stage | Platform | Why |
|-------|----------|-----|
| First Customers | **Delighted** | Simplest setup, beautiful UX, affordable, Salesforce/HubSpot/Intercom native, 7-day trial |
| Growing | **Survicate** | In-app surveys, event-triggered, NPS + CSAT + CES in one, strong HubSpot integration |
| Scaling | **AskNicely** | Salesforce-native, built for CS workflows, coaching features for CS teams, B2B-specific |
| Qualitative research | **Typeform** | One-off customer interviews, churn exit surveys — not for ongoing tracking |
| Enterprise | **Qualtrics** | Overkill for startups; relevant only if already in their ecosystem |

---

## Execution Architecture: The "How To" Layer

Every playbook action ships with:
1. **Step-by-step instructions** — specific to vertical, maturity, and `currentTools` field
2. **Tool recommendation** — drawn from Layer 3, matched against their stack
3. **Copy-paste AI prompt** — NotebookLM, Claude, or Gemini (with their Workspace data)

**Prompt design pattern:**
1. What to upload (specific)
2. What to ask (written as a CX expert)
3. What to do with the output (how to apply to the action)

**Gemini Workspace execution pattern:**
"Export your CX Mate Intelligence Package. Upload to Gemini. Say: 'Cross-reference my CX Mate journey analysis against my last 6 months of CS emails in Gmail. Show me where we're failing to deliver what sales promised.'"

---

## Enablement + Message Intelligence: Right Action, Right Message, Right Moment

The intelligence layers (L0–L6) tell CX Mate WHAT the situation is.
The execution architecture tells the user HOW to fix it.
The **enablement and message layer** tells them WHAT TO SAY to every stakeholder at every moment — and HOW to train their team to deliver it.

This is the **activation layer** — it takes the intelligence stack and transforms it into ready-to-deploy assets. Three tracks:

---

### Track A — Customer Messages
Outbound communication mapped to each journey stage:
- Moment-triggered email templates: onboarding kickoff, 30-day check-in, milestone alert, QBR invite, renewal sequence, win-back
- **Persona-specific messaging**: same moment, different message for Champion vs. Economic Buyer vs. End User vs. Technical Evaluator
- Tone calibration: enterprise (formal) / growth-stage SaaS (direct) / startup (founder-to-founder)
- Data personalization: L4B champion name, MEDDPICC Metrics, actual usage numbers → templates stop being generic

**Example — Stage: Value Realization:**
```
To Champion: "You've hit 3 of your 4 success metrics from onboarding.
              Here's where we are on #4..."
To Economic Buyer: "ROI update: your team has [X outcome] in 30 days.
                    On track for the [Y metric] target you set at purchase."
```

---

### Track B — Internal CS Enablement
The team training layer — what the CS team needs to know, say, and do at each stage:
- **Talk tracks** for key conversations: kickoff call, business review, churn save, expansion pitch, renewal close
- **Objection handling** by pain point and competitor (maps to L4B competitor field)
- **Escalation scripts**: what to say to leadership when a customer reaches risk status
- **QBR deck skeleton**: auto-populated with their actual MEDDPICC Metrics + journey progress
- CS onboarding for new hires: what to read, who to call first, what the first 30 days look like

---

### Track C — Marketing Alignment
Content and advocacy triggers mapped to journey moments:
- Which **marketing assets** exist for each stage (case studies, product demos, help articles, webinars) — and when to deploy them
- **G2 / Capterra review request** trigger: NPS Promoter (≥9) AND stage milestone hit → send review ask. Not before.
- **Referral program** trigger: first customer success milestone → "Is there someone in your network who has the same problem you had?"
- **Advocacy design**: which touchpoint earns the right to ask for a LinkedIn recommendation or customer story
- **Marketing → CS handoff**: what the marketing team promised, mapped to what CS delivers (closes the awareness ↔ onboarding gap)

---

### The Stage-by-Stage Enablement Pack (target format)

Each CX Mate journey stage will eventually ship with an Enablement Pack:

| Stage | Customer Message | CS Script | Marketing Asset | Trigger Moment |
|-------|-----------------|-----------|----------------|----------------|
| Onboarding | Kickoff email + Day 7 delight | Kickoff call talk track | Getting Started deck | Account created |
| Value Realization | 30-day check-in (data-backed) | Benchmark against MEDDPICC | Customer outcome one-pager | Day 28 |
| Expansion | "You've outgrown your plan" | Expansion pitch + objection handling | Upgrade case study | Usage >80% |
| Renewal | 90/60/30-day renewal sequences | Renewal business case | ROI one-pager | 90 days pre-renewal |
| Churn Risk | Re-engagement sequence | Save call script | "Why customers stay" | Health score drops |
| Advocacy | Referral + review request | Reference call prep | Customer story template | NPS ≥9 + milestone |

---

### Where the Content Lives

- **Templates:** `B-brain/03-templates/` — pre-built by stage + persona + maturity
- **Generation:** each journey stage generates default message + CS script from L1 methodology + L3 tool context
- **Personalization:** L4B data (champion name, their MEDDPICC metrics, actual usage) personalizes templates in Pro tier

### Pricing Map

| Tier | Enablement Depth |
|------|-----------------|
| **Free** | Generic templates by stage (maturity-matched but not personalized) |
| **Starter** | Vertical + maturity personalized templates, tone calibration |
| **Pro** | Personalized with real data — champion name, their metrics, actual usage stats |
| **Premium** | Marketing alignment layer, advocacy design, customer story pipeline |

---

## Implementation Priority (revised post-AI review)

| Priority | What | Why |
|----------|------|-----|
| 1 | Champion departure tracking (L4B) | Triples churn probability when Champion leaves. LinkedIn API or Salesforce trigger. |
| 2 | Expectation Gap Alert UX (L4B) | MEDDPICC data → confrontation insight. Highest-value visible output of the workflow moat. |
| 3 | Layer 6 outcome tracking schema (L6) | Start recording recommendation → status → outcome now. Data compounds over time. Can't backfill. |
| 4 | Enablement Pack — stage templates + CS scripts | Adds immediate tangible value per stage. Free tier differentiation. B2B ICP's most-requested output. |
| 5 | Layer 3 tooling setup (L3) | Browse AI / Skyvern for 5 priority tool changelogs. ~1 day setup. Prevents staleness. |
| 6 | Gemini export schema (L3C) | Define CX-Mate-Context.json. Users can start using this with Gemini immediately — no engineering. |

---

*Related: `O-output/intelligence-layers-roadmap.md` · `C-core/product-architecture.md` · `src/lib/cx-knowledge/` · `B-brain/00-architecture/intelligence-stack.md`*
*External validation: Gemini (Google) + ChatGPT (OpenAI) review — 2026-03-07*
