# Design Brief: CX Mate Onboarding & Core Experience

## What is CX Mate?
AI-powered CX co-pilot for businesses. Takes 3 minutes of company context → generates a personalized customer journey map, CX intelligence report, and actionable playbook.

---

## Screens to Design (Priority Order)

### 1. Onboarding Flow (10 steps, conversational)
**Vibe:** Friendly AI co-pilot conversation. Each step has a "CX Mate" chat bubble avatar introducing the question.

**Steps:**
1. **Welcome** — CX Mate introduces itself + company name input + optional website
2. **Company** — Vertical (industry) + company size, personalized greeting "Nice to meet you, [Company]!"
3. **Maturity** — 4 visual cards: Pre-launch 🚀, First customers 🌱, Growing 📈, Scaling 🏗️
4. **Journey Exists** — (conditional, growing/scaling only) — 3 options about existing CX journey
5. **Customer Profile** — Customer count, description, size, sales channel
6. **Competitors** — Text area for 2-3 competitor names (optional, low friction)
7. **Business Data** — (conditional, growing/scaling only) — Pricing model, revenue, deal size
8. **Pain Points** — Text area for biggest challenge + multi-select checkboxes (maturity-adaptive)
9. **Goals** — Single select goal + timeframe pills + optional context
10. **Generate** — Story conclusion: "Here's what I'll do for [Company]" + checklist + "Build My CX Playbook" CTA + progressive loading animation

**UI patterns:**
- CX Mate avatar: circle with "CX" text (or designed logo) — always top-left of each chat bubble
- Chat bubble: rounded rectangle, subtle background
- Progress: dots/pills at top, active step is wider
- Radio buttons as cards, checkboxes for multi-select
- Continue/Back navigation at bottom
- Mobile-first responsive

### 2. CX Intelligence Report (Confrontation Page)
**Vibe:** Premium report that builds trust. "Your CX playbook starts here."

**Sections:**
- Header: Company name + badge (Foundation Analysis / Growth Intelligence / Optimization Report)
- Stats bar: 3 cards (Journey stages, Meaningful moments, Priority areas in red)
- Maturity Snapshot: card with assessment text
- Confrontation Insights: expandable cards with risk badges (high/medium/low), colored borders
- Impact Projections: cards with big green dollar amounts + % improvement, effort badges, formula display
- Tech Stack Recommendations: category tags, tool chips, integration notes
- Assumptions: collapsible "Assumptions & methodology" section
- CTAs: "See Your Full Journey Map" + "Get Your Playbook"

### 3. Journey Map Page
**Vibe:** Visual story of the customer journey from left to right.

**Two views needed:**
- **Card view** (current): Vertical scroll, stage cards with meaningful moments inside
- **Visual journey view** (NEW): Horizontal timeline/swim lane — stages flow left-to-right, moments plotted as nodes. Think: Miro/Figma-style journey map visualization

**Stage card anatomy:**
- Stage number + name + type tag (sales/customer)
- Description + "Customer feels" emotional state
- Top risk (red banner) + Best move (green banner) + Benchmark (blue banner)
- Meaningful moments (expandable, with severity badges)

### 4. Playbook Page
**Vibe:** Actionable checklist. "Your team's CX TODO list."

**Sections:**
- Summary: total actions, must-do count, progress bar
- "This week's checklist" (highlighted box)
- Filter tabs: All / Must Do / Quick Wins
- Stage-grouped recommendations with checkboxes, priority badges, owner, timeline, effort
- Survey recommendations: when to deploy which survey (NPS/CSAT/CES) with specific tool suggestions

### 5. Dashboard
**Vibe:** Hub/home after onboarding. Quick access + top risks.

### 6. Landing Page
**Vibe:** Clean, confident. "CX Mate — Your AI-powered CX co-pilot."
- Logo + tagline
- Single CTA: "Free to try. No account required."
- Social proof / key stats when available

---

## Design System Notes

- **Brand:** CX Mate — professional but approachable, not corporate
- **Colors:** Currently using shadcn defaults (neutral base, primary for accent). Open to brand color exploration
- **Typography:** Clean, readable. System fonts for now, open to brand font selection
- **Avatar:** CX Mate needs a proper designed avatar/mascot for the chat bubbles
- **Icons:** Currently using emoji for maturity options — could be replaced with custom icons
- **Mobile:** Must work well on mobile. Onboarding especially needs to be thumb-friendly

---

## What Already Exists (Working Code)
All screens above are functional in code. This brief is for visual polish, layout refinement, and creating a consistent design language. The designer should review the working product at `localhost:3000` before starting mockups.

---

## Key Design Principles
1. **Conversational, not form-like** — the onboarding should feel like talking to a smart friend
2. **Progressive disclosure** — show complexity only when needed (maturity-based branching)
3. **Trust through transparency** — show assumptions, cite sources, explain calculations
4. **Action-oriented** — every screen ends with a clear next action
5. **Fast perceived value** — user gets a personalized CX report within 3 minutes
