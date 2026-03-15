# Unified `/analysis` Page — Rendered Example

**Example company:** Vendora (B2B SaaS payment platform, 80 employees, Growing stage, uses HubSpot + Intercom)
**Page context:** This is the FIRST page users land on after onboarding completes. It replaces the current post-onboarding landing that sends users to 4 separate tabs.
**Design principle:** One scrollable deliverable. The 2-page executive summary stapled to the front of a 40-page report.

---

## Section 1: Hero / Health Snapshot

[Full-width section. White background. Left-aligned. Generous vertical padding (py-16). Max-width 2xl centered.]

[Top-left: small teal "CCXP Methodology" badge + "March 13, 2026" date stamp]

### Vendora's CX Analysis

[Below the heading, a single-line subhead in muted slate-500:]
**Payment Platform** | **Growing Stage (Mode B)** | **80 employees**

[Below the subhead, the CX Health Score gauge:]

[Horizontal gauge bar, full width. Gradient from red (left) through amber to green (right). A teal marker sits at 62%. Below the gauge: "62 / 100" in large 5xl bold text. Below that, in smaller muted text: "B2B SaaS Growing average: 58"]

[Below the gauge, a single confrontation headline in a rose-50 rounded-xl card with rose-500 left border:]

> **Your customer journey has 4 critical blind spots costing Vendora an estimated $340K annually.**
> Three of these trace directly back to the pain points you told us about: onboarding drop-off, silent churn, and expansion friction.

[Design note: This card replaces the old HeroImpactCard. Same visual language (dark gradient) but now the score gauge leads, and the dollar amount appears as supporting evidence inside the narrative card, not as the hero number. The health score is the anchor; the dollar amount is the "why it matters."]

---

## Section 2: Your Journey at a Glance

[Section heading: "Vendora's Journey Overview" in xl bold. Subtitle in slate-500: "7 stages, 52 moments mapped across your full customer lifecycle"]

[Horizontal timeline strip. Each stage is a compact pill/card in a row. On mobile, this scrolls horizontally. On desktop, all 7 stages fit in one line.]

| Stage | Health | Moments | Top Risk |
|-------|--------|---------|----------|
| [green dot] **Awareness** | Healthy | 6 moments | Low organic discoverability for payment-platform buyers |
| [green dot] **Evaluation** | Healthy | 7 moments | No competitor comparison asset for procurement committees |
| [amber dot] **Onboarding** | At Risk | 9 moments | **Integration setup abandonment at day 3** |
| [red dot] **Adoption** | Critical | 8 moments | **Silent churn — 40% of accounts never activate payment flows** |
| [amber dot] **Renewal** | At Risk | 7 moments | No proactive renewal outreach before contract expiry |
| [red dot] **Expansion** | Critical | 8 moments | **No upsell motion — Vendora waits for inbound expansion requests** |
| [green dot] **Advocacy** | Healthy | 7 moments | No referral program despite high NPS among active users |

[Design notes:
- Each stage is a rounded-lg card (h-auto, min-w-[140px]) with the stage name bold at top, a colored health dot (green/amber/red), moment count as a small badge, and the top risk as 2-line truncated text below.
- Red stages have a subtle rose-50 background and rose-200 border.
- Amber stages have amber-50 background and amber-200 border.
- Green stages have white background and slate-200 border.
- The timeline strip sits inside a horizontally scrollable container with snap-x on mobile.]

[Below the timeline, a single line:]
**See your full journey map with all 52 moments** [teal link arrow] /journey

---

## Section 3: Top 3 Blind Spots

[Section heading: "What Vendora is missing" in 2xl bold. Subtitle in slate-500: "From Vendora's CX Intelligence Report — the patterns most likely to cost you revenue"]

---

### Blind Spot 1: Silent Adoption Failure

[Card: rose-50 background, rose-500 left border (4px), rounded-xl]

[Top row: [red "URGENT" badge in rose-100 pill] + [right-aligned: "$145K annual revenue at risk" in rose-600 semibold]]

**40% of Vendora's accounts complete onboarding but never activate their core payment flows. Your Intercom data shows these users receive 2 onboarding emails and then... silence.**

[Evidence annotation badges below the description:]
- [teal pill] "Addresses: Onboarding drop-off" (links to user's stated pain point)
- [slate pill] "vs. Stripe, Adyen" (competitor context)
- [violet pill] "HubSpot lifecycle stage data available" (tool-specific)

**Why this matters for a payment platform:** Unlike SaaS tools where partial adoption still generates some value, payment platforms have a binary activation threshold. A merchant that sets up the dashboard but never processes a transaction generates zero revenue and maximum support cost. At Vendora's average deal size of $18K ARR, every 10 silently churned accounts represent $180K in wasted acquisition spend.

[Rose-50 inner card: "Do this now" label]
**Configure an Intercom product tour triggered on day 2 that walks new merchants through their first test transaction. B2B payment platforms that add guided activation see 25-35% improvement in time-to-first-transaction.** (Source: B2B fintech onboarding benchmarks)

---

### Blind Spot 2: Expansion Is Entirely Reactive

[Card: rose-50 background, rose-500 left border, rounded-xl]

[Top row: [red "URGENT" badge] + [right-aligned: "$120K annual revenue at risk" in rose-600]]

**Vendora has no systematic expansion motion. Your CX data shows expansion happens only when customers proactively request additional payment methods or geographies — never through Vendora-initiated upsell.**

[Evidence badges:]
- [teal pill] "Addresses: Expansion friction"
- [violet pill] "HubSpot deal data can trigger expansion signals"

**Why this matters for Vendora specifically:** Payment platforms have natural expansion triggers that are highly predictable: transaction volume thresholds, new geography launches, new payment method requests, and seasonal volume spikes. Vendora has access to ALL of these signals through its own platform data, but none are wired into an expansion playbook.

[Rose-50 inner card: "Do this now" label]
**Create a HubSpot workflow that triggers a CS touchpoint when any Vendora merchant crosses 80% of their contracted transaction volume. This is the single highest-signal expansion trigger for payment platforms — and you already have the data.**

---

### Blind Spot 3: Renewal Is a Calendar Event, Not a Value Conversation

[Card: amber-50 background, amber-400 left border, rounded-xl]

[Top row: [amber "IMPORTANT" badge] + [right-aligned: "$75K annual revenue at risk" in amber-700]]

**Vendora's renewal process starts 30 days before contract expiry with a standard email. No health assessment, no value recap, no proactive risk identification. For an 80-person company with growing accounts, this is the difference between 85% and 95% net retention.**

[Evidence badges:]
- [teal pill] "Addresses: Silent churn"
- [slate pill] "No NPS/CSAT measurement in renewal stage"

**What best-in-class payment platforms do differently:** Companies like Adyen and Stripe send quarterly business reviews showing transaction growth, uptime stats, and cost savings BEFORE the renewal conversation starts. The renewal email becomes a formality, not the first touchpoint.

[Amber-50 inner card: "Next action" label]
**Build a quarterly "Vendora Impact Report" email template in HubSpot that auto-pulls each merchant's transaction volume growth, uptime percentage, and support ticket resolution time. Send it at month 3, 6, 9 — so by renewal at month 12, the value conversation has already happened three times.**

---

[Below all 3 blind spots:]
**See all 8 insights in your full CX Intelligence Report** [teal link arrow] /confrontation

---

## Section 4: Top 3 Actions

[Section heading: "Where Vendora should start" in 2xl bold. Subtitle in slate-500: "From your prioritized CX Playbook — actions matched to your stack"]

---

### Action 1: Build an Intercom-Powered Activation Sequence

[Card: white background, slate-200 border, rounded-xl. Left side has a teal "MUST DO" pill.]

| | |
|---|---|
| **What** | Create a 5-touch Intercom product tour + email sequence for days 1-7 that guides new merchants through account setup, test transaction, and first live payment |
| **Effort** | Half day (3-4 hours with Intercom's visual builder) |
| **Expected impact** | 25-35% improvement in activation rate within 60 days |
| **Owner** | Customer Success lead + Product |
| **Tools** | Intercom (product tours + targeted messages), HubSpot (lifecycle stage sync) |

[Violet tool badge: "Intercom Product Tours"] [Violet tool badge: "HubSpot Workflows"]

[Evidence link: "From journey moment: First Value Realization in Adoption stage" → /journey]

---

### Action 2: Wire HubSpot Expansion Triggers

[Card: white background, slate-200 border, rounded-xl. Left side has a teal "MUST DO" pill.]

| | |
|---|---|
| **What** | Create 3 HubSpot workflows: (1) transaction volume >80% of cap, (2) new geography/currency request logged, (3) 3+ support tickets about features in higher tier. Each triggers a CS Slack alert + expansion email template |
| **Effort** | 1 hour per workflow (3 hours total) |
| **Expected impact** | 15-20% increase in expansion revenue within one quarter |
| **Owner** | RevOps + CS Lead |
| **Tools** | HubSpot (workflows + deal pipeline), Slack (alerts) |

[Violet tool badge: "HubSpot Workflows"] [Violet tool badge: "Slack Alerts"]

[Evidence link: "From journey moment: Expansion Signal Detection in Expansion stage" → /journey]

---

### Action 3: Launch a Quarterly Merchant Impact Report

[Card: white background, slate-200 border, rounded-xl. Left side has an amber "SHOULD DO" pill.]

| | |
|---|---|
| **What** | Build an automated email report in HubSpot showing each merchant their transaction volume growth, uptime %, avg response time, and cost-per-transaction trend. Send quarterly at months 3, 6, 9. |
| **Effort** | Multi-day (template design + HubSpot data integration) |
| **Expected impact** | Improved net retention by 5-10% through proactive value reinforcement |
| **Owner** | Marketing + CS |
| **Tools** | HubSpot (email templates + reporting), Vendora platform data (transaction metrics) |

[Violet tool badge: "HubSpot Email Templates"] [Violet tool badge: "Custom Reporting"]

[Evidence link: "From journey moment: Renewal Value Demonstration in Renewal stage" → /journey]

---

[Below all 3 actions:]
**See your full playbook with 28 prioritized actions, templates, and measurement plans** [teal link arrow] /playbook

---

## Section 5: Revenue Impact Summary

[Section heading: "What this is costing Vendora" in 2xl bold]

[Dark gradient card (from-slate-800 to-teal-900), rounded-2xl, white text. Same visual language as the existing HeroImpactCard but restructured as a summary table.]

### $340K estimated annual revenue at risk

[Breakdown table inside the dark card:]

| Category | Annual Impact | Source | Fix Difficulty |
|----------|--------------|--------|----------------|
| Silent churn (adoption failure) | $145K | Benchmark estimate | Medium |
| Missed expansion revenue | $120K | Benchmark estimate | Low |
| Preventable renewal churn | $75K | Benchmark estimate | Medium |

[Below the table, still inside the dark card:]

**What happens if Vendora fixes this:**
- Activation rate improves from ~60% to ~80%: **recover $90-110K**
- Expansion becomes proactive: **capture $70-95K in new revenue**
- Net retention moves from ~85% to ~92%: **protect $50-65K**

**Total recoverable: $210K - $270K annually** (conservative estimate)

[Muted slate-400 footnote inside the card:]
Based on B2B SaaS benchmarks for payment platforms at Growing stage (51-200 employees). Revenue calculations use Vendora's stated deal size ($18K ARR avg) and customer count. All numbers are directional estimates — connect Vendora's HubSpot data for validated projections.

[Below the dark card, a collapsible "How we calculated these numbers" section:]

[Collapsed by default. When expanded, shows:]

**Silent churn calculation:**
`145 active accounts x 40% silent churn rate x $18K ARR x 22% that would have renewed = $145K`

**Expansion revenue calculation:**
`145 accounts x 30% expansion-eligible x $28K avg expansion value x 29% missed conversion = $120K`

**Renewal churn calculation:**
`145 accounts x 15% annual churn x $18K ARR x 19% preventable = $75K`

*Key assumptions:*
- Vendora's 40% silent churn rate estimated from B2B fintech activation benchmarks (industry avg: 35-45%)
- Expansion eligibility based on typical payment platform account maturity curves
- Churn preventability percentage from companies that implemented proactive renewal processes
- All estimates use industry benchmarks — connect HubSpot for Vendora-specific numbers

[Design note: methodology badge shows "CCXP Framework + B2B SaaS Benchmarks" with a small info icon]

---

## Section 6: What's Next

[Section heading: "Go deeper" in xl bold. White background. Three cards in a row (grid-cols-3 on desktop, stack on mobile).]

---

### Card 1: Dive Into Your Journey Map

[Rounded-xl card, white bg, teal-500 top border (4px), hover shadow]

[Icon: MapTrifold in teal]

**Explore all 52 moments across Vendora's 7 journey stages.** See which moments are critical, which connect to playbook actions, and where Vendora's competitors are doing it differently.

[Button: "See Journey Map" → /journey] [teal, full-width within card]

---

### Card 2: Start Your Action Playbook

[Rounded-xl card, white bg, primary top border (4px), hover shadow]

[Icon: Checklist in primary]

**28 prioritized actions with templates, timelines, and measurement checkpoints.** Track progress, mark items done, and export to your project management tool.

[Button: "Open Playbook" → /playbook] [primary, full-width within card]

---

### Card 3: Export for Your Team

[Rounded-xl card, white bg, slate-400 top border (4px), hover shadow]

[Icon: Export in slate]

**Share Vendora's CX analysis with your leadership team.** Export as PDF for your next board meeting, or open in NotebookLM to generate custom presentations.

[Two buttons stacked:]
- [Button: "Export PDF" → triggers PDF generation] [outline, full-width]
- [Button: "Open in NotebookLM" → copies structured markdown + opens NotebookLM] [ghost, full-width]

---

## Design Notes for Implementation

### Visual Hierarchy
1. **Health Score gauge** is the anchor — it is the first thing the eye hits
2. **Dollar impact** is the emotional hook — but lives inside the narrative card, not as a standalone hero number
3. **Journey timeline strip** gives spatial orientation before the detail sections
4. **Blind spots** use the existing InsightCard visual language (rose/amber left borders, severity badges)
5. **Actions** use the existing RecommendationCard structure (owner badges, tool badges, effort labels)
6. **Revenue summary** uses the existing dark gradient card pattern

### Personalization Checkpoints
Every section MUST reference Vendora by name at least once. Specific personalization signals:
- Section 1: Company name in heading, maturity stage, employee count, health score benchmarked against peers
- Section 2: Stage-specific risks that reference Vendora's vertical (payment platform)
- Section 3: Tool-specific references (Intercom, HubSpot), pain point connections, competitor names
- Section 4: Actions use Vendora's actual tools, reference their specific data signals
- Section 5: Revenue calculations use Vendora's stated deal size and customer count
- Section 6: Company name in every CTA card description

### Data Flow
This page consumes the same data as the existing 4 pages:
- `GeneratedJourney` (stages, moments, confrontationInsights, impactProjections)
- `OnboardingData` (companyName, tools, maturity, pain points)
- `EvidenceMap` (pain point to insight/moment connections)
- `GeneratedPlaybook` (stagePlaybooks, quickWins, weekOneChecklist)

No new AI generation needed. The analysis page is a PRESENTATION layer on top of existing data.

### Progressive Disclosure
- Section 2 (Journey): overview strip only — full detail on /journey
- Section 3 (Blind Spots): top 3 only — full list on /confrontation
- Section 4 (Actions): top 3 only — full playbook on /playbook
- Section 5 (Revenue): summary + collapsible methodology

### Navigation Behavior
- **First-time users** (just completed onboarding): land on /analysis
- **Returning users** (have an existing analysis): land on /dashboard (which becomes the progress-tracking home)
- **Deep-dive links** from /analysis go to /journey, /confrontation, /playbook with `?id=` param preserved

### Free vs Paid Gating
- **Free users see:** Section 1 (health score + headline), Section 2 (journey overview), Section 3 (blind spot titles + severity only, details blurred with $149 CTA), Section 5 (total revenue at risk number only, breakdown blurred), Section 6 (journey link only, playbook + export locked)
- **Paid users see:** Everything, fully expanded

### Mobile Behavior
- Journey timeline strip scrolls horizontally with snap-x
- Blind spot and action cards stack vertically (full-width)
- Revenue summary table becomes a vertical list
- What's Next cards stack in a single column

---

## How This Connects to the Product Architecture

This page implements Product Principle 15 from `C-core/product-architecture.md`:

> **Deliverable, not dashboard** — CX Mate's primary output is ONE cohesive analysis, not 4 separate pages with a nav bar. A CX consultant doesn't hand you 4 documents — they walk you through one story: "Here's your situation -> Here's what we found -> Here's what it's costing you -> Here's what to do about it."

The narrative flow:
1. **Here's your situation** (Health Score + Journey Overview)
2. **Here's what we found** (Top 3 Blind Spots)
3. **Here's what it's costing you** (Revenue Impact)
4. **Here's what to do about it** (Top 3 Actions + Playbook link)

The 4 existing detail pages (Journey, Confrontation, Playbook, QBR) remain as the "go deeper" layer. This page is the executive summary that makes the whole product feel like ONE deliverable worth $149.
