# PRD: Conversational Onboarding Redesign

## 1. Overview

- **Feature name**: Conversational Onboarding with CX Mate Persona
- **Problem statement**: The current onboarding is a clinical form — 7 steps of radio buttons with no personality, no story, and no smart branching. Users don't feel guided; they feel interrogated. The flow asks journey type before knowing if the company has customers, shows generic pain points regardless of maturity, and has zero monetization hooks.
- **Target persona**: All three — Founder (primary), CRO, Head of CS
- **Priority**: P0 (must ship)
- **Sprint**: Sprint 3 (current)
- **Effort estimate**: M (3-5 days)

## 2. Design Principles

1. **Story, not form** — The onboarding reads like a conversation with a smart CX expert, not a survey.
2. **CX Mate persona** — "Hey, I'm CX Mate..." — warm, expert, direct. Like a CCXP-certified friend.
3. **Maturity-first branching** — Company stage determines everything: which questions to ask, which journey to generate, which pain points to surface.
4. **Smart defaults** — Pre-customer companies don't get asked about NPS. Scaling companies don't get asked if they have a journey map (they do).
5. **Monetization awareness** — Free tier sees value, paid tier unlocks depth.

## 3. Conversation Flow (The Story)

### Step 1: Welcome (CX Mate introduces itself)

```
"Hey! 👋 I'm CX Mate — your AI-powered CX co-pilot.

I help B2B companies map their customer journey, find the moments
that matter, and build playbooks their team can actually execute.

Let's figure out where you are and what you need.
This takes about 3 minutes."
```

**Input**: Company name only. One field. Low friction.
**CTA**: "Let's go →"

### Step 2: Company Context (Who are you?)

```
"Nice to meet you, {companyName}!

First — tell me a bit about your company so I can
tailor everything to your world."
```

**Inputs**:
- Vertical (grid of options)
- Company size (pills)

### Step 3: The Maturity Question (This drives everything)

```
"Now the big question — where are you on your customer journey?"
```

**Options** (visual cards with icons):

| Option | Label | Subtitle |
|--------|-------|----------|
| 🚀 | "We're pre-launch or pre-revenue" | "No paying customers yet — building our go-to-market" |
| 🌱 | "We have our first customers" | "1-10 customers — figuring out what works" |
| 📈 | "We're growing" | "11-50 customers — building our first playbook" |
| 🏗️ | "We're scaling" | "50+ customers — formalizing and optimizing" |

**This selection sets `companyMaturity`** which controls all downstream branching.

### Step 4: Journey Existence (Do you have a map?)

**Only shown for "growing" and "scaling" maturity.**

```
"At your stage, many companies have some kind of customer journey
mapped out — even if it's just in someone's head or a Notion doc.

Do you have an existing journey or CX process?"
```

**Options**:
- "Yes, we have something" → Follow-up: "What does it look like?" (textarea)
- "Not really — it's all in people's heads"
- "We've tried but it's outdated/incomplete"

### Step 5: Customer Profile (Adaptive)

**Pre-launch/Pre-revenue**:
```
"Since you're building your go-to-market, let me understand
who you're going after."
```
- Target customer description (textarea)
- Target customer size (pills)
- Go-to-market channel (pills)

**First customers / Growing / Scaling**:
```
"Tell me about your customers."
```
- Customer count (for first customers + growing, auto-set for scaling)
- Customer description (textarea)
- Customer size (pills)
- Main channel (pills)

### Step 6: Business Data (Conditional)

**Only shown for maturity = growing or scaling** (pre-launch and first customers skip this — they don't have meaningful data yet).

```
"Let's ground this in real numbers so your playbook has
actual ROI projections — not hand-wavy estimates."
```
- Pricing model
- Revenue range
- Average deal size

### Step 7: What Hurts? (Maturity-Adaptive Pain Points)

The pain points change based on maturity:

**Pre-launch**:
- "Don't know how to structure our sales process"
- "Can't articulate our value prop clearly"
- "No idea what the buying journey looks like"
- "Losing deals but don't know why"

**First customers**:
- "Onboarding is messy / manual"
- "Not sure if customers are actually getting value"
- "No consistent process — every customer is different"
- "Worried about losing early customers"

**Growing**:
- "Customers leaving without warning"
- "Gaps between sales handoff and CS"
- "No visibility into customer health"
- "Team doesn't have a playbook to follow"

**Scaling**:
- "CX is inconsistent across the team"
- "Can't identify at-risk accounts early enough"
- "Onboarding takes too long / doesn't scale"
- "No unified view of the customer lifecycle"

```
"Now — what's keeping you up at night?
Pick what resonates most."
```

### Step 8: What Does Success Look Like? (Maturity-Adaptive Goals)

Goals also adapt:

**Pre-launch**:
- "Map my sales process end-to-end"
- "Understand my buyer's decision journey"
- "Get a clear go-to-market playbook"

**First customers**:
- "Build a repeatable onboarding process"
- "Make sure early customers succeed"
- "Create my first CX playbook"

**Growing**:
- "Reduce churn"
- "Build a playbook the whole team can follow"
- "Move from reactive to proactive CX"

**Scaling**:
- "Unify sales and CS into one journey"
- "Implement health scoring and early warning"
- "Scale CX without scaling headcount"

```
"Last thing — what does success look like for you?"
```

### Step 9: Generate (The Story Conclusion)

```
"Perfect. Here's what I'm going to do for you:

✅ Map your {journeyType} journey end-to-end
✅ Identify the meaningful moments that make or break your CX
✅ Show you exactly where to focus first
✅ Give you a playbook with templates you can use this week

This takes about 2 minutes. I'm analyzing your company
against patterns from thousands of B2B businesses."
```

**CTA**: "Build My CX Playbook →"

**Loading state**: Animated progress with status messages:
- "Analyzing your company profile..."
- "Mapping your journey stages..."
- "Identifying meaningful moments..."
- "Building your personalized playbook..."

## 4. Maturity → Journey Type Mapping (Auto-determined)

The journey type is NO LONGER asked. It's automatically determined:

| Maturity | Journey Type | Rationale |
|----------|-------------|-----------|
| Pre-launch | `sales` | They only have a sales process to map |
| First customers | `full_lifecycle` | They need to see the whole picture |
| Growing | `full_lifecycle` | Full view with CS emphasis |
| Scaling | `full_lifecycle` | Full view with optimization focus |

Users who pick "scaling" and already have a journey get a different prompt emphasis — audit/improve vs. build from scratch.

## 5. Monetization Gates

### Free Tier (Layer 1 — Mapping, $99/mo value shown free)
- Full onboarding conversation
- AI-generated journey map with stages
- Meaningful moments identification
- CX Report (confrontation page)

### Paid Gate (after seeing results)
- **Playbook** (Layer 2 — $249/mo): "Your journey map identified 12 meaningful moments. Unlock your personalized playbook with ready-to-use templates for each one."
- **Automation** (Layer 3 — $499/mo): Future — connect to HubSpot, Intercom, etc.

**Gate placement**: After the confrontation page (CX Report). User sees their journey + insights for free. Playbook requires account + payment.

This means:
- Onboarding is completely free (no auth required)
- CX Report is free
- Journey Map view is free
- Playbook is the monetization gate

## 6. Data Model Changes

### Updated `OnboardingData` type:

```typescript
interface OnboardingData {
  // Step 1: Welcome
  companyName: string;

  // Step 2: Company Context
  vertical: string;
  customVertical?: string;
  companySize: string;

  // Step 3: Maturity (NEW — replaces hasExistingCustomers + journeyType selection)
  companyMaturity: "pre_launch" | "first_customers" | "growing" | "scaling";

  // Step 4: Journey Existence (NEW — for growing/scaling only)
  hasExistingJourney: "yes" | "no" | "partial" | "";
  existingJourneyDescription?: string;

  // Step 5: Customer Profile (adaptive)
  customerCount: string;
  customerDescription: string;
  customerSize: string;
  mainChannel: string;

  // Step 6: Business Data (growing/scaling only)
  pricingModel: string;
  roughRevenue: string;
  averageDealSize: string;

  // Step 7: Pain Points (maturity-adaptive)
  painPoints: string[];
  biggestChallenge: string;
  customPainPoint?: string;

  // Step 8: Goals (maturity-adaptive)
  primaryGoal: string;
  timeframe: string;
  additionalContext?: string;

  // Derived (computed, not user-input)
  journeyType: JourneyType; // auto-set from maturity
  hasExistingCustomers: boolean; // derived from maturity
}
```

### Removed fields:
- `journeyType` selection (auto-determined)
- `hasExistingCustomers` toggle (derived from maturity)
- `measuresNps`, `measuresCsat`, `measuresCes` (moved to CX Report insights)
- `npsResponseCount` (moved to CX Report)
- `hasJourneyMap` (replaced by `hasExistingJourney`)
- `dataVsGut` (removed — adds no value to journey generation)

### New fields:
- `companyMaturity` — the core branching field
- `hasExistingJourney` — for growing/scaling companies
- `existingJourneyDescription` — optional text about their current journey

## 7. API Impact

### `POST /api/onboarding` changes:
- Accept new `companyMaturity` field
- Auto-derive `journeyType` from maturity
- Auto-derive `hasExistingCustomers` from maturity
- Pass `hasExistingJourney` + description to journey prompt for context
- No new endpoints needed

## 8. UX Notes

- **Conversation bubbles**: Each step opens with a "CX Mate says..." message in a chat-bubble style, followed by the input area
- **Transitions**: Steps slide in from right, out to left (like a conversation progressing)
- **Progress**: Subtle progress dots (not a numbered progress bar) — this is a conversation, not a form
- **Back button**: Still available but styled subtly — "← Back" text link, not a prominent button
- **Mobile**: Full-width cards, stacked vertically, thumb-friendly tap targets
- **Character**: Use emoji sparingly (👋 in welcome, ✅ in summary). Warm but professional.

## 9. Out of Scope

- Auth integration (handled separately in persistence pipeline)
- Stripe payment flow (Phase 4)
- Journey editing after generation
- Importing existing journey maps
- Multi-language support
- A/B testing different conversation flows

## 10. Open Questions

- `[PRODUCT]` Should the "free tier" include the Journey Map view, or just the CX Report? **Decision: Include both. Gate is at Playbook.**
- `[CX]` For "scaling" companies with existing journeys — should we offer an "audit mode" vs "build mode"? **Decision: Defer to v2. For now, use their description as context in the prompt.**
