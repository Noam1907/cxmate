# CX Mate — Intelligence Layers Roadmap
*Shoval, COO · 2026-03-04*

How CX Mate's brain grows. Every layer stacks on top of the last. The moat compounds.

---

## The Core Idea

CX Mate is not a prompt wrapped around GPT. It's an intelligence system where each data layer makes every other layer more powerful. A founder who types "churn" into Gemini gets a generic checklist. CX Mate cross-references their pain against influencer frameworks, current benchmark data, their competitors' G2 reviews, their tech stack's actual capabilities, and what 200 similar companies did — then names the specific pattern killing their business.

The layers are the moat.

---

## Current State — Layer 0 (What Exists Now)

| Source | Status | How It Feeds CX Mate |
|--------|--------|---------------------|
| CX Theory Engine (`src/lib/cx-knowledge/`) | ✅ Live | TypeScript modules baked into journey + recommendation prompts |
| Company auto-enrichment | ✅ Live | Website scraping → Claude extraction → pre-fills onboarding |
| User onboarding data (33 fields) | ✅ Live | Full context: maturity, pains, goals, stack, competitors |
| CCXP methodology | ✅ Partially wired | Referenced in prompts, not fully structured as modules |
| Qualtrics 2025 + KPMG research | ✅ In B-brain, wired into `enterprise-cx-maturity.ts` | Benchmarks in confrontation insights |
| CX Influencers 2026 | ✅ In B-brain, **NOT yet wired into prompts** | Sits in `B-brain/01-cx-methodology/cx-influencers-2026.md` |
| Competitive landscape | ✅ In B-brain, **NOT yet wired into prompts** | Sits in `B-brain/02-market-research/competitive-landscape.md` |

**Gap:** B-brain content exists as documents but doesn't flow live into AI analysis. First near-term priority: wire existing brain content into prompts.

---

## Layer 1 — Methodology Intelligence
*Who the great CX thinkers are and what they've proven.*

### 1A. CX Influencer Frameworks
**What it provides:** Named, citable frameworks that make CX Mate sound like a peer, not a search engine. When CX Mate says "This is the 'Champion Blindspot' pattern that Jeanne Bliss documents in her renewal research" — that lands differently than a generic warning.

| Source | Frameworks | Collection | Feed Mechanism |
|--------|-----------|------------|----------------|
| Annette Franz | Customer-Centric Culture, 6 Pillars, VoC architecture | Manual curation → B-brain | Injected into journey prompts as citation authority |
| Jeanne Bliss | 5 Competency Model, Chief Customer Officer role definition | Manual curation | Playbook recommendations |
| Ian Golding | CX professional standards, measurement frameworks | Manual curation | Confrontation insights |
| Shep Hyken | Convenience, loyalty, customer amazement model | Manual curation | Quick-win recommendations |
| Nir Eyal | Hook Model (habit formation = product stickiness) | Manual curation | Decision science layer |
| Matt Dixon | Effortless Experience, CES concept | Manual curation | Measurement recommendations |
| Fred Reichheld | NPS origin, loyalty loops | Manual curation | Impact models |
| LinkedIn CX Influencer Feed | Current conversations, emerging frameworks | RSS/scraper (weekly) | Weekly B-brain update → prompt refresh |

**Status:** B-brain exists. **Next action:** wire `cx-influencers-2026.md` into the journey prompt as a citation library. When AI generates confrontation insights, it references the matching framework.

---

### 1B. CCXP Body of Knowledge
**What it provides:** The formal exam body of knowledge (CXPA) — structured competencies, standards, measurement frameworks. This is what gives CX Mate its "CCXP-certified" credibility claim.

| Section | Content | Status |
|---------|---------|--------|
| Customer-Centric Culture | How companies build CX into DNA | Partially in prompts |
| VoC, Customer Insight & Understanding | Survey methodology, feedback loops | Partially in `cx-knowledge/` |
| Organizational Adoption & Accountability | Governance, CX roles | Not wired |
| Customer Experience Strategy | Journey mapping standards | Partially wired |
| Design, Implementation & Innovation | CX design principles | Not wired |
| Metrics, Measurement & ROI | NPS/CSAT/CES standards, business case math | Partially wired in impact models |

**Next action:** Structure CCXP competency blocks as a `src/lib/cx-knowledge/ccxp-framework.ts` module. Inject relevant block per journey stage + maturity level.

---

### 1C. Research & Academic Intelligence
**What it provides:** Citable stats that make impact projections credible. "Companies with strong CX outperform by 4x (Forrester 2025)" > "companies with strong CX do better."

| Source | Cadence | Collection |
|--------|---------|------------|
| Forrester CX Index (annual) | Yearly | Manual → B-brain |
| Qualtrics XM Institute (annual) | Yearly | Already in B-brain |
| Gartner CX reports | Quarterly | Manual → B-brain |
| Harvard Business Review CX articles | Monthly | RSS → B-brain INBOX |
| KPMG Six Pillars (annual) | Yearly | Already in B-brain |
| Bain & Company loyalty research | As published | Manual → B-brain |
| Journal of Service Research | Quarterly scan | Manual → B-brain |

**Feed mechanism:** Stats become the data layer in impact projections. When CX Mate says "onboarding drop-off costs B2B SaaS companies an average of 23% of ACV" — it cites the source.

---

## Layer 2 — Market Intelligence
*What the market is doing, what competitors are missing, where the gaps are.*

### 2A. Competitive Intelligence — CX Platform Scraping
**What it provides:** Real-time awareness of what Gainsight, ChurnZero, Totango, Intercom, HubSpot are shipping. Recommendations can say "HubSpot just launched X — this is your fastest path to fixing this."

| Target | What to Scrape | Cadence | Feed |
|--------|---------------|---------|------|
| G2 reviews of Gainsight/ChurnZero/Totango | What users complain about (= CX Mate opportunity) | Monthly | Competitive positioning in confrontation |
| Gainsight Pulse blog | New features, market positioning | Weekly | Stack recommendations update |
| HubSpot product changelog | New CX-relevant features | Weekly | Stack recommendation layer |
| Intercom changelog | AI + automation features | Weekly | Stack recommendation layer |
| ProductHunt CX/CS tools | New entrant signals | Weekly | Competitive landscape update |
| G2 reviews of CX Mate itself | Once we have them | Ongoing | Product improvement + testimonial |

**Next action:** Build a weekly scraper (lightweight Python/Node script or Apify actor) that pushes changelogs + G2 review summaries into `B-brain/02-market-research/`. The CX Intel skill (`cx-intel`) already does manual version of this — automate it.

---

### 2B. Industry Benchmarks by Vertical
**What it provides:** "Your NPS of 28 is below the B2B SaaS average of 41 at your ARR range" is a confrontation that lands. Verticals have vastly different NPS/churn benchmarks.

| Benchmark | Source | Vertical Coverage |
|-----------|--------|------------------|
| NPS by vertical | Retently annual benchmark | SaaS, FinTech, Healthcare, Services |
| Churn rate by ARR | Baremetrics, OpenView | SaaS tiers |
| CSAT benchmarks | ACSI, Qualtrics | All B2B |
| CES (Customer Effort Score) | Gartner, Dixon/CEB research | SaaS, services |
| Time-to-value benchmarks | UserPilot, Gainsight | SaaS |
| Renewal rates | Gainsight/Totango annual reports | B2B SaaS |

**Status:** Static benchmarks already in `src/lib/cx-knowledge/` — need annual refresh and vertical expansion.

**Feed mechanism:** When user enters their NPS/CSAT in onboarding → compare against vertical benchmark → confrontation insight.

---

### 2C. Hiring Signal Intelligence
**What it provides:** When a company is hiring for "Head of Customer Experience" or "VP of Customer Success" — that's a CX maturity inflection point. This tells CX Mate where a prospect is in their journey.

| Signal | What it means | Source |
|--------|--------------|--------|
| Hiring "Head of CX" | Just realized they need CX — HOT ICP | LinkedIn Jobs API |
| Hiring "Customer Success Manager" | Scaling CS team | LinkedIn Jobs API |
| Hiring "Onboarding Specialist" | Onboarding is breaking | LinkedIn Jobs API |
| Lots of CS openings | Scaling pain — high churn or rapid growth | LinkedIn Jobs API |

**Application:** Future growth feature — identify ICP prospects before they know they need CX Mate.

---

## Layer 3 — Technology Intelligence
*What the tools can do, what AI can do, so recommendations stay current.*

### 3A. Tech Stack Capability Intelligence
**What it provides:** Recommendations that say "use HubSpot's new AI-powered playbooks feature for this" instead of recommending something the tool did 2 years ago or doesn't do yet.

| Tool Category | Key Players | Tracking Method |
|---------------|-------------|-----------------|
| CRM | HubSpot, Salesforce, Pipedrive | Changelog scraper + monthly manual review |
| Customer Success | Gainsight, ChurnZero, Totango, Vitally | Product release notes |
| Support | Intercom, Zendesk, Freshdesk | Changelog + G2 |
| Survey/Feedback | Delighted, Typeform, Qualtrics, Survicate | Feature announcements |
| Analytics | Mixpanel, Amplitude, PostHog | Release notes |
| Automation | Zapier, Make, Clay | New integration announcements |
| AI assistants | Notion AI, ChatGPT plugins, Claude integrations | Product launches |

**Feed mechanism:** Monthly update to `src/lib/cx-knowledge/cx-tools/` — adds new capabilities, deprecates old ones. Recommendation engine pulls current capabilities.

---

### 3B. AI Capability Intelligence
**What it provides:** When CX Mate recommends "use AI for X" — it should recommend what AI can actually do *now*, not what it could do 18 months ago. AI capabilities are moving faster than any static knowledge base.

| Capability | Current State | CX Application |
|-----------|--------------|----------------|
| Conversation analysis | GPT-4o, Claude — real-time transcripts | Flag at-risk customers from support calls |
| Sentiment analysis | Whisper + LLM pipelines | Proactive churn detection |
| Personalization | Fine-tuned models, RAG | Personalized onboarding sequences |
| Automated QBR preparation | Claude, Notion AI | Save CS managers 4h/quarter |
| Voice of Customer synthesis | LLM over survey data | Replace manual CSAT analysis |
| Predictive churn | Time-series + LLM | Health scoring |
| AI SDR/outreach | Outreach AI, Apollo AI | Sales-to-CS handoff automation |

**Cadence:** Quarterly AI landscape review → update `cx-tools` recommendations. Flag when a category jumps (e.g., "voice AI for CX just became viable").

---

## Layer 4 — User Intelligence
*What real users do, what their customers say, what breaks vs. what works.*

### 4A. CX Mate User Behavior
**What it provides:** Which recommendations actually get implemented. Which insights generate the most "aha." Which journey stages founders click on first. This feedback loop makes the AI smarter with every user.

| Signal | What to Measure | How |
|--------|----------------|-----|
| Playbook status tracking | Which recs get marked Done vs. ignored | Already built (localStorage) |
| Journey stage click patterns | Which stages founders explore first | PostHog events |
| Recommendation rating | Future: 👍👎 on each rec | To build |
| Time-in-product | Which sections get the most time | PostHog |
| "Generate again" rate | Dissatisfied vs. satisfied with output | PostHog |
| PDF export rate | Signals "this is worth saving" | PostHog |
| Upgrade triggers | Which moment drives conversion | PostHog + Stripe webhook |

**Feed mechanism:** Monthly analysis by AI Engineer → update priority weighting in recommendation prompt. "Recs tagged 'quick_win' get implemented 3x more than 'strategic' — reweight outputs."

---

### 4B. Founder's Own Customer Data (Integration Layer)
**What it provides:** Instead of benchmarks and guesses, actual data from their HubSpot/Intercom. "Your average onboarding takes 47 days. Industry benchmark: 14 days. That's 33 days of value destruction per customer."

| Integration | Data Available | CX Mate Use |
|-------------|---------------|-------------|
| HubSpot | Deal velocity, close rate, NPS, email open rates | Feed into impact projections, identify specific gaps |
| Intercom | Support ticket volume, CSAT, resolution time, churn conversations | Feed into failure pattern detection |
| Zendesk | Ticket tags, escalation rate, time-to-resolve | CX health signals |
| Salesforce | Pipeline data, renewal rates, expansion revenue | Revenue impact calculations |
| Delighted/Survicate | NPS scores, verbatim feedback | Real confrontation data |

**Architecture:** OAuth integration → read-only data pull → inject as "Live Company Data" block in prompts. The experience: "I pulled your HubSpot. Here's what the data actually says." This is the Pro tier feature.

**Status:** Planned for Sprint 5. API integration architecture defined.

---

### 4C. Aggregate Intelligence — The Proprietary Moat
**What it provides:** After 100+ CX Mate users, CX Mate has something no competitor has: real anonymized data on what B2B founders fix first, what actually reduces churn, what correlates with NPS improvement.

"Companies like yours — B2B SaaS, Growing, primary pain: onboarding drop-off — who implemented the welcome sequence recommendation saw an average 18% improvement in 30-day activation within 90 days."

This is not possible from a Gemini prompt. This is the compound moat.

| Aggregate Signal | How Built | When |
|-----------------|-----------|------|
| "Companies like you" benchmarks | Anonymized journey data across users | After 100 users |
| Implementation success rates | Playbook status × outcome correlation | After 6mo of tracking |
| Stage-to-stage maturity patterns | What moves companies from First Customers → Growing | After 50 users per maturity |
| Failure pattern frequency | Which patterns appear most by vertical + maturity | After 200 journeys |
| Quick win success rate | Which recs get implemented fastest with best results | Ongoing |

**Feed mechanism:** New `src/lib/aggregate-intelligence/` module. Anonymized, aggregated, never personal. Shown as "Based on X companies like yours" badges in confrontation insights.

---

## Layer 5 — External Signal Intelligence
*What's happening in the world that changes what CX advice is relevant.*

### 5A. Regulatory & Compliance Signals
**What it provides:** When GDPR enforcement changes, that changes onboarding flows. When AI regulation lands, that changes data collection recommendations. CX Mate should surface relevant compliance signals.

| Signal | CX Impact | Tracking |
|--------|----------|----------|
| GDPR enforcement actions | Cookie consent, data handling recs | EU privacy newsletter |
| CCPA/state privacy laws (US) | Data retention policies | IAPP newsletter |
| AI Act (EU) | AI-in-CX tool recommendations | EU AI Office |
| FTC consent requirements | Email opt-in flows | FTC newsletter |

**Feed mechanism:** Quarterly audit → update `B-brain` → surface in playbook as compliance notes when relevant.

---

### 5B. LinkedIn & Social CX Signals
**What it provides:** Real-time pulse of what CX practitioners are talking about. When "AI for onboarding" is trending, surface it in recommendations. When "churn is up in SaaS" is the conversation, name it in confrontation.

| Signal | Source | Use |
|--------|--------|-----|
| CX trending topics | LinkedIn hashtags: #cx, #customerexperience, #customersuccess | Monthly digest |
| Viral CX failure examples | Twitter/LinkedIn posts | Confrontation examples |
| New framework emergence | CX thought leader posts | B-brain update |
| Tool launches/shutdowns | ProductHunt, TechCrunch | Stack recommendations |

**Collection:** The `cx-intel` daily digest skill already does this manually. Automate with RSS + LinkedIn scraper. Save to `B-brain/INBOX/` → weekly review → promote to active intelligence.

---

### 5C. Company Stage Signals (Funding / Hiring / Growth)
**What it provides:** A company that just raised Series A has 12 months to show metrics — different CX priorities than a bootstrapped company at the same size.

| Signal | CX Implication |
|--------|---------------|
| Just raised Seed | Build CX foundation before habits form |
| Just raised Series A | Professionalize CS, reduce churn before board scrutiny |
| Rapid hiring (10+ CS roles) | Scaling pain — processes breaking at volume |
| Just hired Head of CX | They're ready to invest — warm ICP |
| Executive departure | Customer confidence risk — CX stability needed |

**Feed mechanism:** Enrichment layer. Crunchbase API + LinkedIn job posting signals → additional context in company profile → adapts confrontation framing.

---

## The Compounding Architecture

```
LAYER 0: Raw input (33 onboarding fields + website enrichment)
    ↓
LAYER 1: Methodology filter (CCXP + influencer frameworks + research citations)
    ↓
LAYER 2: Market context (competitor gaps + vertical benchmarks + hiring signals)
    ↓
LAYER 3: Technology lens (current stack capabilities + AI-possible-now)
    ↓
LAYER 4: Real data (user integrations + aggregate patterns from past users)
    ↓
LAYER 5: External signals (regulatory + social + company stage)
    ↓
OUTPUT: The only CX analysis that couldn't exist without all 5 layers.
        A Gemini prompt reaches Layer 0. Maybe Layer 1 with effort.
        Layers 2-5 are the moat.
```

---

## Priority Roadmap

| Phase | Layers | Key Actions |
|-------|--------|-------------|
| **Now (Sprint 4)** | L0 + L1 partial | Wire `cx-influencers-2026.md` into prompts as citation library. Structure CCXP competency blocks. |
| **Sprint 5** | L2A + L3A | Competitive G2 scraper (monthly). Tech stack changelog tracking. Stack recommendations freshness cadence. |
| **Sprint 6** | L4B | HubSpot OAuth integration (Pro tier). Inject live deal + NPS data into analysis. First "real data" confrontation. |
| **Sprint 7** | L4C + L2B | Aggregate intelligence module after 50+ users. Vertical benchmark refresh. "Companies like yours" framing. |
| **Sprint 8+** | L5 + L4A | Funding signal integration. Full behavior analytics loop. Compliance monitoring. |

---

## New Layers to Add (User's "Add More")

| Layer | What It Provides |
|-------|-----------------|
| **Podcast intelligence** | CX-specific podcasts (Jeannie Walters, CX Files, Doing CX Right) — extract frameworks and trends. Quarterly digest. |
| **Conference signals** | Pulse (Gainsight), Zendesk Relate, CCW — what's the CX community focused on right now? Annual digest → confrontation themes. |
| **Customer review mining** | G2/Capterra reviews of the *user's own product* — "Your G2 reviews mention 'confusing onboarding' 8 times. That's a journey gap." (Future: OAuth to G2 API) |
| **Employee feedback signals** | Glassdoor for the user's company — CS team dissatisfaction = CX quality risk. |
| **Support ticket themes** | If Intercom connected, cluster support tickets by theme → map to journey moments → "Your biggest support category matches your highest-risk moment." |
| **Cohort churn patterns** | If HubSpot connected: which cohorts churn fastest → trace back to onboarding failure moment. |
| **Competitive pricing signals** | When Gainsight drops price or offers freemium → affects ICP willingness to pay → CX Mate pricing context. |
| **Product review analytics** | App store reviews, Capterra, GetApp — semantic analysis of what users love vs. hate about *similar products*. |
| **Investor/board signals** | When a company's investors publicly discuss churn/NPS → validation that this ICP has the problem. |

---

*Full plan saved to O-output/intelligence-layers-roadmap.md · 2026-03-04*
*Update product-architecture.md with intelligence layers summary → next action*
