# CX Mate - Product Architecture

## The Intelligence Model

CX Mate is built on a 6-layer intelligence architecture that transforms basic company info into an actionable CX strategy.

### Intelligence Layers

| Layer | What It Does | Key Components |
|-------|-------------|----------------|
| **1. Input** | Collects company context via conversational onboarding | Maturity-adaptive steps, auto-enrichment, persona capture |
| **2. Enrichment** | Auto-researches the company from their website | Claude + website scraping → vertical, competitors, customer profile |
| **3. CX Theory** | Applies structured CX methodology to the input | 8-module knowledge base: lifecycle science, decision science, failure patterns, benchmarks, tools, foundations, stages, verticals |
| **4. Confrontation** | Surfaces hard truths about their CX gaps | 3 modes by maturity: A (Best Practice), B (Research+Theory), C (Optimization). Evidence Wall connects insights to input data |
| **5. Action** | Generates prioritized recommendations | Playbook with AI tool suggestions, email templates, effort estimates, evidence annotations |
| **6. Impact** | Quantifies business value of each action | Revenue impact calculations with transparent formulas, data source badges ("your data" vs "industry benchmarks") |

---

## The Journey Model

CX Mate maps the journey customers take — from first touch to long-term advocacy. The journey type adapts based on company stage.

### Journey Types

| Type | Scope | Example Stages |
|------|-------|----------------|
| **Sales Journey** | First touch → Closed deal | Awareness, Evaluation, Demo/Trial, Negotiation, Close |
| **Customer Journey** | Onboarding → Advocacy | Onboarding, Adoption, Value Realization, Expansion, Renewal |
| **Full Lifecycle** | First touch → Advocacy | All of the above, with sales→customer handoff as key moment |

Pre-customer companies are automatically constrained to sales-only content, even if they select "Full Lifecycle."

### Maturity-Adaptive Analysis

| Maturity Stage | Analysis Mode | Depth |
|---------------|---------------|-------|
| Pre-launch | Prescriptive (Mode A) | Best practices, foundational playbook |
| First Customers | Prescriptive (Mode A) | Early-stage priorities, quick wins |
| Growing | Comparison (Mode B) | Research + theory, competitive context |
| Scaling | Optimization (Mode C) | Data-driven, efficiency focus |

---

## Onboarding Flow

The onboarding is conversational and maturity-adaptive — not a flat form.

### Step Flow (Dynamic)

1. **Welcome** — Company name, website, user name + role → triggers auto-enrichment
2. **Maturity** — Pre-launch / First Customers / Growing / Scaling (determines everything downstream)
3. **Company Details** — Vertical, size, customer description (pre-filled from enrichment with "AI-suggested" badges)
4. **Customer Profile** — Customer size, count, description, main channel (shown only for companies with existing customers)
5. **Business Data** — Deal size, pricing model, revenue range, tech stack (shown only for companies with existing customers)
6. **Competitors** — Chip-based UI with AI-detected competitors from enrichment + manual add
7. **CX Maturity** — NPS/CSAT/CES toggles, existing journey processes, existing journey components
8. **Pains** — Maturity-specific pain points (6-7 options per maturity level, categorized by acquisition/retention/operations)
9. **Goals** — Maturity-specific goals, connected to selected pains via `PAIN_TO_GOAL_MAP`, with timeframe suggestions

Steps 4-5 only appear if the company has existing customers. Total: 7-9 steps depending on path.

### Data Flow

```
Onboarding Input → Auto-Enrichment (Claude + website) → CX Knowledge Base (8 modules)
→ Journey Generation (Claude, ~2.8 min) → CX Intelligence Report + Journey Map
→ Recommendation Generation (Claude) → Playbook
→ Evidence Matching → Evidence Wall + Inline Annotations
```

---

## Output Pages

### CX Intelligence Report (`/confrontation`)
- Evidence Wall (pain point coverage, competitor differentiation)
- Hero Impact Card (aggregate $ annual impact range)
- Impact Breakdown (horizontal bars, effort badges, time-to-realize)
- Maturity Assessment
- Tech Stack Recommendations (9 categories)
- Assumptions & Methodology (transparent calculation details)

### Journey Map (`/journey`)
- Interactive stage cards with meaningful moments
- Risk-by-stage overview bar (critical/high moment percentage)
- Horizontal visual timeline view (toggle)
- Evidence annotations (violet badges: "Addresses: churn", "vs Zendesk")

### Playbook (`/playbook`)
- Prioritized recommendations grouped by stage
- Status tracking (not started / in progress / done)
- Evidence annotations connecting to pain points
- AI tool recommendations per action
- Dark hero progress card with completion stats

### Dashboard (`/dashboard`)
- Hero impact card with aggregate dollar range
- 4-stat overview (stages, moments, critical risks, playbook items)
- Playbook progress with completion bar
- Top risks with action items and evidence annotations
- Quick navigation cards

---

## Dual-Mode Architecture

| Mode | How It Works | When |
|------|-------------|------|
| **Preview (anonymous)** | Data in sessionStorage, `?id=preview` | Before signup — try before you buy |
| **Persisted (authenticated)** | Data in Supabase via API | After signup — saved to account |

All pages support both modes. Pages check `templateId`: `"preview"` → sessionStorage, real UUID → API fetch. Always fall back to sessionStorage if API fails.

---

## Feature Roadmap

### Shipped (Sprint 1-3)
- Conversational onboarding with maturity branching
- Auto-enrichment from company website
- Journey generation with CX theory engine
- CX Intelligence Report with impact projections
- Evidence Wall + inline annotations
- Playbook with AI tool recommendations
- Dashboard with data presentation (Mesh/Ramp pattern)
- Auth + DB persistence pipeline
- Split-screen layout with live CX identity sidebar

### Next (Sprint 4 — Beta Launch)
- Stripe integration
- Analytics (PostHog)
- Beta invite system
- Full regression QA
- Security audit

### Forward Features
1. **CX Pulse** — Monthly re-analysis (retention loop)
2. **Competitive CX Intelligence** — Ongoing competitor CX analysis
3. **CX Simulation** — "What if" scenario modeling
4. **QBR Deck Generator** — Auto-generated board reports
5. **Health Scoring** — Real-time customer health
6. **CRM Integration** — HubSpot, Intercom connectors

---

## Pricing Model (Updated 2026-03-02)

| Tier | Price | Value Layer | Core Unlock |
|------|-------|-------------|-------------|
| **Free** | $0 | Trust-building | Full one-time run · NotebookLM export · PDF export |
| **Starter** | $79/mo or $149 one-time | Progress tracking | Save + return · Revenue Protected counter · Monthly CX Score · Evidence Wall |
| **Pro** | $199/mo | Real data + intelligence | Monthly Pulse delta · HubSpot/Intercom integration · Competitive CX monitoring · AI stack recommendations · Simulations |
| **Premium** | $1,200/year | Org-wide + board-ready | Board Deck generator · Multi-seat · QBR reports · CRM write-back · CX Mate MCP server |

---

## The Impact Proof System (2026-03-02)

CX Mate is the first CX tool that can actually show impact over time because it captures the BEFORE state at onboarding. Three layers:

### Layer 1 — Proxy Impact (no integrations)
Playbook completion triggers benchmark-based impact estimates:
- Each completed action maps to an industry benchmark (e.g. "Add in-app guidance → 15–25% activation churn reduction")
- Dashboard shows a **Revenue Protected counter** — starts $0, grows as playbook items are completed
- All estimates show their methodology transparently ("based on industry benchmarks for SaaS Growing stage")

### Layer 2 — Pulse Delta (monthly subscription value)
Monthly re-run generates a before/after comparison:
- **CX Score** (0–100): single trackable number, broken down by stage, benchmarked against vertical/maturity peers
- Risk level changes since last month
- Which stages improved, which need focus
- Revenue at risk trend over time

### Layer 3 — Real Data Validation (Pro integration unlock)
HubSpot/Intercom data validates whether benchmark estimates held true:
- "Estimated $40K churn risk → Actual HubSpot data shows 12% churn improvement = ~$31K protected"
- Transforms AI opinion into ground truth

---

## The CX Score

A single 0–100 number representing overall CX health. Updated monthly with each Pulse.

- **Breakdown:** by journey stage (Onboarding / Activation / Renewal / Expansion)
- **Benchmark:** vs. vertical + maturity peers (e.g. "SaaS Growing avg: 54. You: 61 ✓")
- **Trend:** line chart over time — compounds in value the longer you subscribe
- **Board-friendly:** founders report this number to investors without needing CX jargon

---

## NotebookLM Export (Free Tier Feature)

Every user gets a "Open in NotebookLM" button alongside Export PDF. CX Mate exports structured markdown (journey + CX report + playbook) that feeds directly into NotebookLM.

**Why free:** Users create infographics, decks, and board summaries from their CX data in minutes. They share those outputs (LinkedIn, investor updates, team wikis) → brand exposure → new users. This is a growth mechanic, not a premium unlock.

---

## Integration Architecture

### Data IN — Replace Estimates with Reality (Pro tier)
- **HubSpot:** Real deal size, conversion rates, churn → validates revenue impact estimates
- **Intercom:** Support volume, CSAT, ticket themes → validates journey risk scores
- **Mixpanel/Amplitude:** Product adoption, feature usage → validates stage-level analysis

### Intelligence OUT — Push CX Mate Everywhere
- **Email digest:** Daily CX Pulse (built ✅, Starter+)
- **NotebookLM:** Full CX report as structured doc (Free)
- **Slack:** Daily nudges, playbook reminders (Starter)
- **Notion:** Journey map + playbook as living page (Starter)
- **Board Deck:** Auto-generated slides (Premium)
- **ChatGPT Action:** CX Mate data as GPT context (Pro)
- **CX Mate MCP Server:** Any AI tool queries journey/report/playbook (Premium)

---

## Core Product Principles

1. **Fast onboarding** — Value in minutes, not months
2. **Journey-first** — Everything builds from the journey map
3. **Evidence-based** — Every insight connects back to user input
4. **Maturity-adaptive** — Map what matters now, at their level
5. **AI-first** — Evaluate every recommendation through an AI-first lens
6. **Transparent methodology** — Show the math, show the sources
7. **Co-pilot, not platform** — Guide and suggest, don't overwhelm
8. **Stage-based targeting** — "No CX expert yet" not "under 300 employees"
9. **Try before you buy** — Anonymous preview, save when ready
