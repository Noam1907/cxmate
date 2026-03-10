# CX Mate — User Flows Per Use Case

> **Purpose:** Map every screen, every branching path, and every user state so designers and developers can see the full picture. Also flags UI/UX issues and design gaps.
>
> **Last updated:** 2026-02-20

---

## Table of Contents

1. [Overview: All Screens](#1-overview-all-screens)
2. [Use Case 1: Pre-Launch Company (No Customers)](#2-use-case-1-pre-launch-company)
3. [Use Case 2: First Customers (1-10 Customers)](#3-use-case-2-first-customers)
4. [Use Case 3: Growing Company (11-50 Customers)](#4-use-case-3-growing-company)
5. [Use Case 4: Scaling Company (50+ Customers)](#5-use-case-4-scaling-company)
6. [Use Case 5: Returning User (Authenticated)](#6-use-case-5-returning-user)
7. [Use Case 6: Anonymous Preview (Try Before Signup)](#7-use-case-6-anonymous-preview)
8. [Post-Onboarding Flow (All Users)](#8-post-onboarding-flow)
9. [UI/Design Issues & Gaps](#9-uidesign-issues--gaps)
10. [Planned: Auto-Enrichment from Company Name/Website](#10-planned-auto-enrichment)
11. [Planned: Research Pipeline — Real Customer Voices](#11-planned-research-pipeline)
12. [Core Design Principles](#12-core-design-principles)

---

## 1. Overview: All Screens

### Pages

| # | Page | URL | Purpose |
|---|------|-----|---------|
| 1 | **Landing** | `/` | Hero + CTA. No nav header. |
| 2 | **Onboarding Wizard** | `/onboarding` | Multi-step conversational flow. No nav header. |
| 3 | **Auth (Login/Signup)** | `/auth` | Email/password auth. No nav header. |
| 4 | **Auth Callback** | `/auth/callback` | Handles Supabase code exchange (invisible). |
| 5 | **CX Intelligence Report** | `/confrontation?id=...` | The "confrontation" — maturity snapshot, insights, projections. Nav header visible. |
| 6 | **Journey Map** | `/journey?id=...` | Detail view + visual flow view toggle. Nav header visible. |
| 7 | **CX Playbook** | `/playbook` | Actionable recommendations with status tracking. Nav header visible. |
| 8 | **Dashboard** | `/dashboard` | Stats, progress, top risks, quick nav. Nav header visible. |
| 9 | **Reset** | `/reset` | Clears sessionStorage/localStorage (dev tool). |

### Navigation Header
- **Visible on:** Dashboard, CX Report, Journey, Playbook
- **Hidden on:** Landing (`/`), Onboarding (`/onboarding`), Auth (`/auth`)
- **Tabs:** Dashboard | CX Report | Journey | Playbook
- Active tab highlighted with dark pill

---

## 2. Use Case 1: Pre-Launch Company

**Persona:** Founder building a product, no paying customers yet.
**Journey type:** Sales only (derived automatically).
**Onboarding steps:** 7 steps

### Flow

```
Landing (/)
  └─ Click "Let's Map Your Journey"
      └─ Onboarding (/onboarding)

Step 1: Welcome
  ├─ Company name (required)
  ├─ Company website (auto-suggested from name)
  └─ Continue →

Step 2: Company
  ├─ What does your company do? (vertical: B2B SaaS, Services, Marketplace, Fintech, E-commerce, Healthtech, Other)
  ├─ How big is your team? (1-10, 11-50, 51-150, 151-300, 300+)
  └─ Continue →

Step 3: Maturity
  ├─ Select: "Pre-launch / Pre-revenue"
  ├─ [AUTO-DERIVED]: hasExistingCustomers=false, journeyType="sales", dataVsGut="all_gut"
  └─ Continue →

  ⚠ NO "Journey Exists" step (only for growing/scaling)
  ⚠ NO "Business Data" step (only for growing/scaling)

Step 4: Customer Profile
  ├─ ChatBubble says: "who you're going after"
  ├─ Customer count: HIDDEN (pre-launch has no customers)
  ├─ Describe your target customer (required)
  ├─ What size companies? (SMB, mid-market, enterprise, mixed)
  ├─ How will customers find you? (self-serve, sales-led, partner, mixed)
  └─ Continue →

Step 5: Competitors
  ├─ ChatBubble: "Understanding your market helps me map a smarter sales journey"
  ├─ Name 2-3 competitors or alternatives (optional textarea)
  └─ Continue →

Step 6: Challenges (Pain Points)
  ├─ "What's keeping you up at night?"
  ├─ Biggest challenge (free text, required)
  ├─ Select pain points (multi-select, PRE-LAUNCH specific):
  │   - Don't know how to structure our sales process
  │   - Can't articulate our value prop clearly
  │   - No idea what the buying journey looks like
  │   - Losing deals but don't know why
  ├─ Custom pain point (optional)
  └─ Continue →

Step 7: Goals
  ├─ "What does success look like?"
  ├─ Primary goal (PRE-LAUNCH specific):
  │   - Map my sales process end-to-end
  │   - Understand my buyer's decision journey
  │   - Get a clear go-to-market playbook
  ├─ Timeframe: 1 month / 3 months / 6 months / Just exploring
  ├─ Additional context (optional)
  └─ Continue →

Step 8: Generate
  ├─ Summary of what CX Mate will do
  ├─ "Build My CX Playbook" button
  ├─ Loading animation (~2-3 min): Analyzing → Mapping → Identifying → Building
  └─ On success → Redirect to CX Report (/confrontation?id=preview)
```

### Post-Onboarding: See [Section 8](#8-post-onboarding-flow)

---

## 3. Use Case 2: First Customers

**Persona:** Startup with 1-10 customers, figuring out what works.
**Journey type:** Full lifecycle (derived automatically).
**Onboarding steps:** 7 steps (same count as pre-launch, different content)

### Flow

```
Steps 1-2: Same as Pre-Launch (Welcome + Company)

Step 3: Maturity
  ├─ Select: "First customers"
  ├─ [AUTO-DERIVED]: hasExistingCustomers=true, journeyType="full_lifecycle", dataVsGut="mostly_gut"
  └─ Continue →

  ⚠ NO "Journey Exists" step (only for growing/scaling)
  ⚠ NO "Business Data" step (only for growing/scaling)

Step 4: Customer Profile
  ├─ ChatBubble: "Tell me about your customers" (not "target customer")
  ├─ Customer count: VISIBLE (1-10, 11-50, 51-200, 200+)
  ├─ Describe your customers (required)
  ├─ What size companies?
  ├─ How do they find and buy from you?
  └─ Continue →

Step 5: Competitors
  ├─ ChatBubble: "Understanding your market helps me map a smarter sales journey"
  └─ Optional textarea

Step 6: Challenges (Pain Points) — FIRST_CUSTOMERS specific options:
  ├─ Onboarding is messy / manual
  ├─ Not sure if customers are getting value
  ├─ No consistent process — every customer is different
  ├─ Worried about losing early customers
  └─ Continue →

Step 7: Goals — FIRST_CUSTOMERS specific options:
  ├─ Build a repeatable onboarding process
  ├─ Make sure early customers succeed
  ├─ Create my first CX playbook
  └─ Continue →

Step 8: Generate → CX Report
```

---

## 4. Use Case 3: Growing Company

**Persona:** Company with 11-50 customers, building first playbook.
**Journey type:** Full lifecycle (derived automatically).
**Onboarding steps:** 9 steps (adds Journey Exists + Business Data)

### Flow

```
Steps 1-2: Same as above (Welcome + Company)

Step 3: Maturity
  ├─ Select: "Growing"
  ├─ [AUTO-DERIVED]: hasExistingCustomers=true, journeyType="full_lifecycle", measuresCsat=true, dataVsGut="mix"
  └─ Continue →

Step 4: Journey Exists ← NEW (only growing/scaling)
  ├─ "Do you already have a CX journey or process mapped out?"
  ├─ Options: Yes (we have something) / Not really / It's outdated/incomplete
  ├─ If "Yes" → textarea to describe existing journey
  └─ Continue →

Step 5: Customer Profile (same as First Customers, with customer count visible)

Step 6: Competitors (same)

Step 7: Business Data ← NEW (only growing/scaling)
  ├─ "Let's ground your playbook in real numbers"
  ├─ Pricing model: Package tiers / A la carte / Usage-based / Hybrid
  ├─ Annual revenue range: Pre-revenue / Under $100K / $100K-$500K / $500K-$1M / $1M+
  ├─ Average deal size: Under $1K / $1K-$5K / $5K-$20K / $20K-$50K / $50K+
  └─ Continue →

Step 8: Challenges — GROWING specific options:
  ├─ Customers leaving without warning
  ├─ Gaps between sales handoff and CS
  ├─ No visibility into customer health
  ├─ Team doesn't have a playbook to follow
  └─ Continue →

Step 9: Goals — GROWING specific options:
  ├─ Reduce churn
  ├─ Build a playbook the whole team can follow
  ├─ Move from reactive to proactive CX
  └─ Continue →

Step 10: Generate → CX Report
```

---

## 5. Use Case 4: Scaling Company

**Persona:** Company with 50+ customers, formalizing and optimizing.
**Journey type:** Full lifecycle (derived automatically).
**Onboarding steps:** 9 steps (same structure as Growing, different content)

### Flow

```
Steps 1-3: Same structure, select "Scaling" maturity
  ├─ [AUTO-DERIVED]: measuresNps=true, measuresCsat=true, npsResponseCount="50_100", hasJourneyMap=true, dataVsGut="mostly_data"

Step 4: Journey Exists (same as Growing)

Step 5: Customer Profile (same, customer count visible)

Step 6: Competitors (same)

Step 7: Business Data (same structure as Growing)

Step 8: Challenges — SCALING specific options:
  ├─ CX is inconsistent across the team
  ├─ Can't identify at-risk accounts early enough
  ├─ Onboarding takes too long / doesn't scale
  ├─ No unified view of the customer lifecycle
  └─ Continue →

Step 9: Goals — SCALING specific options:
  ├─ Unify sales and CS into one journey
  ├─ Implement health scoring and early warning
  ├─ Scale CX without scaling headcount
  └─ Continue →

Step 10: Generate → CX Report
```

---

## 6. Use Case 5: Returning User (Authenticated)

**Persona:** User who signed up, has persisted data.

### Flow

```
Landing (/)
  └─ (If already authenticated, middleware could redirect to /dashboard)
  └─ Or user clicks "Let's Map Your Journey" → /onboarding
  └─ Or navigates to /auth → Login

Auth (/auth)
  ├─ Login tab: email + password → Supabase signIn → redirect to /dashboard
  ├─ Signup tab: company name + email + password → sends verification email
  └─ "Continue without an account" → /onboarding (preview mode)

Auth Callback (/auth/callback)
  ├─ Exchanges code for session
  ├─ Auto-creates organization (if new signup)
  ├─ Sets org_id in user app_metadata
  └─ Redirects to /dashboard (or specified redirect URL)

Dashboard (/dashboard)
  ├─ If journey data exists → shows stats, playbook progress, top risks
  ├─ If no data → empty state with "Start Your CX Journey" CTA → /onboarding
  └─ Quick nav cards: CX Report, Journey Map, Re-run Onboarding

Navigating the app:
  Dashboard ↔ CX Report ↔ Journey ↔ Playbook (via nav header)
```

---

## 7. Use Case 6: Anonymous Preview (Try Before Signup)

**Persona:** User exploring CX Mate without creating an account.

### Flow

```
Landing → "Let's Map Your Journey" → /onboarding
  └─ Complete all onboarding steps
  └─ Journey generated → stored in sessionStorage (NOT database)
  └─ Redirect to CX Report (/confrontation?id=preview)

Preview mode:
  ├─ All pages work with ?id=preview (loads from sessionStorage)
  ├─ Playbook generates and stores in localStorage
  ├─ Dashboard loads from sessionStorage/localStorage
  └─ Data survives page refreshes but NOT tab close (sessionStorage)

Converting to account:
  ├─ (PLANNED, NOT YET BUILT) "Save My Results" CTA appears
  ├─ User clicks → redirected to /auth?redirect=/dashboard
  ├─ On signup, journey auto-persists to Supabase
  └─ Preview data → persisted data seamlessly
```

---

## 8. Post-Onboarding Flow

After onboarding completes and the journey is generated, ALL users follow this flow:

```
CX Intelligence Report (/confrontation?id=...)
  ├─ Animated stats (stages, moments, priority areas)
  ├─ CX maturity snapshot
  ├─ Confrontation insights (expandable cards)
  │   └─ Each: risk level, companion advice, business impact, action, measurement
  ├─ Impact projections (cards with calculations)
  ├─ Tech stack recommendations
  ├─ Assumptions & methodology (collapsible)
  ├─ CTA: "Explore Your Full Journey" → /journey
  └─ CTA: "Get Your Playbook" → /playbook

Journey Map (/journey?id=...)
  ├─ Toggle: Detail View | Journey Map (visual)
  │
  │ Detail View:
  │   ├─ Journey name + stats badges (stages, moments, critical count)
  │   ├─ "Here's what you're probably getting wrong" section
  │   ├─ Stage-by-stage cards with meaningful moments
  │   └─ Each moment: severity, type, description, recommendations
  │
  │ Journey Map (Visual):
  │   ├─ Horizontal scrolling flow diagram
  │   ├─ Stage cards connected by arrows/pipes
  │   ├─ Moment dots above/below (color-coded by severity)
  │   ├─ Sales→Customer handoff indicator
  │   ├─ Click moment → detail panel slides in
  │   └─ Severity legend + summary bar
  │
  └─ CTA to Playbook

CX Playbook (/playbook)
  ├─ (If no playbook yet) → "Generate Your Playbook" button → API call
  ├─ Week One Checklist (top actions for this week)
  ├─ Filter tabs: All | Must Do | Quick Wins
  ├─ Stage-by-stage sections
  │   └─ Recommendation cards:
  │       ├─ Status toggle (checkbox: not_started → in_progress → done)
  │       ├─ Action name + type icon (email/call/process/automation/measurement)
  │       ├─ Priority badge (must_do / should_do / nice_to_have)
  │       ├─ Owner, timing, effort metadata
  │       └─ Expandable: template (copy button), expected outcome, measurement
  ├─ Progress bar (done / in-progress counts)
  └─ Footer nav: CX Report, Journey Map

Dashboard (/dashboard)
  ├─ Stats grid: stages, moments, critical risks, high-risk patterns
  ├─ Playbook Progress card (or CTA to generate)
  ├─ Top Risks to Address (top 3 high-likelihood insights)
  └─ Quick Navigation: CX Report | Journey Map | Re-run Onboarding
```

---

## 9. UI/Design Issues & Gaps

### Critical Design Problems

| # | Issue | Where | Details |
|---|-------|-------|---------|
| 1 | **No color scheme / brand identity** | Everywhere | App is mostly black/white/gray. No brand colors. Feels generic and cold. Needs a defined palette (primary, secondary, accent, semantic colors). |
| 2 | **Default system font** | Everywhere | No custom typography. The font feels like a raw dev prototype. Needs a proper font pairing (e.g., Inter/Plus Jakarta Sans for body, something with personality for headings). |
| 3 | **No visual hierarchy / spacing system** | Everywhere | Inconsistent spacing, card sizes, and visual weight. Pages feel like lists of data rather than guided experiences. |
| 4 | **Landing page is bare** | `/` | Just a logo, one sentence, and a button. No social proof, no feature highlights, no screenshots. Doesn't sell the product. |
| 5 | **Auth page looks disconnected** | `/auth` | Different background style (gradient) from the rest of the app. Doesn't feel like the same product. |

### Onboarding Flow Issues

| # | Issue | Where | Details |
|---|-------|-------|---------|
| 6 | **Progress dots too subtle** | All onboarding steps | Small dots at the top. User doesn't know how many steps are left or what they are. Consider a labeled progress bar. |
| 7 | **No step titles visible** | All onboarding steps | User doesn't see "Step 3 of 9 — Your Stage". Only dots. |
| 8 | **Radio cards all look the same** | Company, Maturity, Customer Profile | Every selection uses the same bordered card pattern. Gets monotonous. Different question types should feel different. |
| 9 | **Vertical list too long** | Step 2 (Company) | 7 vertical options + company size below = requires scrolling. Could use a 2-column grid (already does) but team size options run off screen. |
| 10 | **No auto-enrichment from company name/website** | Step 1 (Welcome) | PLANNED: When user enters company name or website, auto-fetch company info (vertical, size, what they sell, customer description) to pre-fill later steps. See [Section 10](#10-planned-auto-enrichment). |
| 11 | **Competitors step feels orphaned** | Step 5/6 | Optional step with just a textarea. No context on why this matters or how it'll be used. Could show "we'll use this to differentiate your journey." |

### Post-Onboarding Issues

| # | Issue | Where | Details |
|---|-------|-------|---------|
| 12 | **Journey page title duplicated** | `/journey` | The journey name appears twice — once above the toggle and once below it. |
| 13 | **CX Report is very long** | `/confrontation` | Single long scroll with many sections. No sidebar nav or jump links. Hard to navigate on long reports. |
| 14 | **Playbook has no empty-state guidance** | `/playbook` | When user first arrives, the "Generate" button appears but there's no explanation of what the playbook is or why they should generate it. |
| 15 | **Dashboard stats show old data** | `/dashboard` | Currently showing "Orca AI" data from sessionStorage. No clear "this is demo data" indicator or way to clear/start fresh. |
| 16 | **No "Save My Results" CTA** | All preview pages | Anonymous users can see everything but there's no prompt to sign up and save. Major conversion gap. |
| 17 | **No loading states between pages** | Page transitions | Clicking nav items causes a flash/blank while the new page loads. |
| 18 | **Mobile responsive issues** | All pages | Visual journey map doesn't work well on mobile. Onboarding cards may overflow. Nav header needs hamburger menu. |

### Design System Gaps

| # | Gap | Notes |
|---|-----|-------|
| 19 | No defined color palette | Need: primary, secondary, accent, success, warning, error, neutral scale |
| 20 | No typography scale | Need: heading sizes, body sizes, caption, consistent weights |
| 21 | No component variants | Buttons are all the same. Cards are all the same. Need visual variety. |
| 22 | No illustration / icon style | Using text emojis and basic HTML entities. Need a consistent icon set. |
| 23 | No animation/transition system | Some pages have Framer Motion, others don't. Inconsistent. |
| 24 | No dark mode consideration | Everything assumes light mode. |

---

## 10. Planned: Auto-Enrichment from Company Name/Website

### Concept

When a user enters their **company name** or **website URL** in Step 1 (Welcome), CX Mate should automatically:

1. **Fetch company info from the web** (scrape website, or use an enrichment API)
2. **Pre-fill onboarding fields** with inferred data:
   - Vertical / industry
   - Company size (if detectable)
   - What the company sells / product description
   - Target customer description
   - Pricing model (if public pricing page exists)
3. **Show pre-filled fields** with a "we found this — feel free to edit" indicator
4. **Fall back gracefully** if enrichment fails (user fills in manually, as today)

### Implementation Options

| Approach | Pros | Cons |
|----------|------|------|
| **A. Claude API scrape + infer** | Uses existing infra. Claude can read webpage and extract structured data. | Slow (~10-20s). Requires fetching website content server-side. |
| **B. Enrichment API (Clearbit, Apollo, etc.)** | Fast, structured data. | Costs money. Another dependency. May not cover small/new companies. |
| **C. Hybrid: try enrichment API first, fall back to Claude scrape** | Best coverage. | More complexity. Two API integrations. |

### Recommended: Option A (Claude scrape) for MVP

- We already have the Claude API
- Add a server endpoint: `POST /api/enrich` that takes `{ companyName, website }`
- Server fetches the website HTML (using fetch or a scraper)
- Sends to Claude with a prompt: "Extract: industry, product description, target customer, company size, pricing model"
- Returns structured JSON to pre-fill onboarding
- Show a subtle "Auto-filled from your website — feel free to edit" banner

### UX Flow with Enrichment

```
Step 1: Welcome
  ├─ User types company name
  ├─ Website auto-suggested (e.g., "novatech.com")
  ├─ User clicks Continue →
  ├─ [ENRICHMENT RUNS IN BACKGROUND]
  │   ├─ Spinner or subtle loading indicator: "Learning about your company..."
  │   ├─ If successful: pre-fill fields in Steps 2-5
  │   └─ If fails: proceed normally (manual entry)
  └─ Step 2: Company
      ├─ Vertical: PRE-SELECTED (with "auto-detected" badge)
      ├─ Company size: PRE-SELECTED (if detected)
      └─ User can change any field
```

---

## Appendix: Step Count by Maturity

| Maturity | Steps | Extra Steps |
|----------|-------|-------------|
| Pre-launch | 7 + Generate | — |
| First Customers | 7 + Generate | — |
| Growing | 9 + Generate | + Journey Exists, + Business Data |
| Scaling | 9 + Generate | + Journey Exists, + Business Data |

## Appendix: Data Flow

```
Onboarding Data (client)
  → POST /api/onboarding (server)
    → Claude API: generate journey (server, ~2.8 min)
    → If authenticated: persist to Supabase (journey_templates → journey_stages → meaningful_moments)
    → Return GeneratedJourney JSON
  → Store in sessionStorage (client)
  → Redirect to /confrontation?id={templateId|preview}

Playbook Generation:
  /playbook page → POST /api/recommendations/generate
    → Claude API: generate recommendations
    → Return recommendations JSON
  → Store in localStorage (client)

Status Tracking:
  Playbook status → localStorage (per-recommendation)
  Read on: /playbook, /dashboard
```

---

## 11. Planned: Research Pipeline — Real Customer Voices

### Concept

CX Mate's meaningful moments should be backed by **real customer feedback**, not just AI-generated hypotheses. When we identify a risk like "Silent Onboarding Trap," we should show actual quotes from real users who experienced that exact problem — sourced from Reddit, G2, Trustpilot, Product Hunt, and other public forums.

### What This Looks Like in the Product

**On the CX Report (Confrontation page):**
Each insight card gets a new section: **"What real users are saying"**
```
┌─────────────────────────────────────────┐
│ 🔴 The Silent Onboarding Trap           │
│                                         │
│ [existing insight text...]              │
│                                         │
│ 💬 What real users are saying:          │
│ ┌─────────────────────────────────────┐ │
│ │ "We signed up for [competitor] and  │ │
│ │  never heard from them again. Took  │ │
│ │  us 3 weeks to figure out setup."   │ │
│ │  — r/SaaS, 2026                     │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ "Onboarding was nonexistent. We     │ │
│ │  churned after the first month."    │ │
│ │  — G2 Review, similar company       │ │
│ └─────────────────────────────────────┘ │
│ Source: 12 mentions across 3 platforms  │
└─────────────────────────────────────────┘
```

**On the Journey Map:**
Meaningful moments can show a "social proof" indicator — e.g., a small badge: "Backed by 8 real user mentions"

**On the Playbook:**
Recommendations can reference real feedback: "Users specifically complained about [X] — this action addresses that directly."

### Data Sources (Prioritized)

| Source | What We Get | How |
|--------|------------|-----|
| **Reddit** (r/SaaS, r/startups, r/CustomerSuccess, etc.) | Raw user complaints and praise about specific CX moments | Search API or scrape |
| **G2 Reviews** | Structured pros/cons for similar companies | G2 API or scrape |
| **Trustpilot** | Customer sentiment, common complaint patterns | Trustpilot API |
| **Product Hunt** | Launch feedback, first impressions | PH API |
| **Industry reports** | Benchmark data, churn stats by vertical | Curated knowledge base |

### Implementation Approach

**Phase 1 (MVP — Claude tool_use):**
- During journey generation, Claude uses `tool_use` to search for relevant feedback
- Claude synthesizes findings into the meaningful moments output
- Add `socialProof` field to `GeneratedMoment` type: `{ quotes: string[], source: string, mentionCount: number }`
- Display quotes in CX Report and Journey Map

**Phase 2 (Dedicated pipeline):**
- Background job that runs after journey generation
- Searches multiple sources in parallel
- Caches results per vertical/company-size combo
- Updates journey data with enriched social proof

### Key Principle

> **Show, don't tell.** Instead of CX Mate saying "onboarding is probably a problem," show the user that 15 real people on Reddit complained about onboarding at companies like theirs. Evidence > opinion.

---

## 12. Core Design Principles

These principles should guide ALL design and development decisions:

### Principle 1: Don't Ask What You Can Find

> **If data exists publicly, fetch it. Don't make the user type it.**

- Company name → auto-detect vertical, size, product, customers, competitors
- Website URL → scrape for pricing, features, positioning
- Industry → auto-apply benchmarks, common pain points, typical journey patterns
- Always show what was found with a clear "we detected this — confirm or edit" pattern
- Fall back to manual entry only when auto-detection fails

### Principle 2: Confirm, Don't Interrogate

> **Show the user what you know. Let them correct, not fill from scratch.**

Instead of:
```
What industry are you in? [empty dropdown]
```

Do:
```
We found that NovaTech AI is a B2B SaaS company ✓
in the AI/ML space, selling to mid-market companies.
[Edit] if this isn't right.
```

### Principle 3: Evidence Over Opinion

> **Back every insight with real data — user-provided, scraped, or benchmarked.**

- Meaningful moments should cite real user feedback (Reddit, G2, etc.)
- Impact projections should show their math (already doing this)
- Recommendations should reference what worked for similar companies
- Always label the source: "Based on your numbers" vs "Based on industry benchmarks" vs "Based on real user feedback"

### Principle 4: Progressive Disclosure

> **Show the essential. Let curious users dig deeper.**

- CX Report: summary first, details on expand
- Journey Map: visual overview first, click for moment details
- Playbook: this week's checklist first, full list below
- Don't front-load every data point — layer the information

### Principle 5: The Product Should Feel Warm, Not Clinical

> **CX Mate is a peer advisor, not a dashboard.**

- Conversational tone throughout (ChatBubble persona)
- Color and typography should feel approachable, not enterprise
- Celebrate progress ("You've completed 5 of 17 actions — your CX is getting stronger")
- Avoid jargon: "meaningful moments" not "touchpoint optimization"

---

*This is a living document. Update as flows change.*
