# UX Review: Post-Onboarding Experience — "The Overwhelm Problem"

**By:** Product Lead + UX Expert
**Date:** 2026-03-09
**Context:** Gigi Levy-Weiss outcome-based pricing thesis + Anat's observation about overwhelming first load

---

## The Problem

After onboarding completes (~1.5 min generation), the user lands on the Journey page and sees:

1. **50+ touchpoints** across 5-7 stages, each with meaningful moments, risk indicators, evidence annotations
2. A nav bar with **4 equal-weight destinations**: Dashboard | CX Report | Journey | Playbook
3. Content that **echoes across pages**: risks appear in Dashboard AND CX Report, moments appear in Journey AND Playbook, evidence badges appear everywhere

**The feeling:** "I just answered 9 steps of questions, waited 90 seconds... and now I'm staring at a wall of information with 4 tabs I don't understand the difference between."

This violates our own principle #7: *"Co-pilot, not platform — Guide and suggest, don't overwhelm."*

---

## Root Cause: We Built Pages, Not a Deliverable

Right now the architecture is **tool-shaped**: Dashboard, Report, Map, Playbook — four views of one analysis. This is how SaaS products think.

But Gigi's thesis says the future is **deliverable-shaped**: the user pays for an outcome (their CX analysis), and that outcome should feel like ONE thing. EvenUp doesn't give lawyers 4 tabs — it gives them one demand letter.

**We're a replacement for a CX consultant.** When a consultant delivers, they don't hand you 4 separate documents with a nav bar. They walk you through ONE cohesive story:

> "Here's your situation → Here's what we found → Here's what it's costing you → Here's what to do about it"

---

## The Proposal: From 4 Pages to 1 Story

### The CX Analysis — One Scrollable Deliverable

Instead of 4 equal-weight pages, the primary output is **one flowing document** with clear narrative structure:

| Section | Current Source | What It Shows | UX Pattern |
|---------|---------------|---------------|------------|
| **1. Your Snapshot** | Dashboard | Company context, CX score, headline impact number | Hero card, 3-4 key stats |
| **2. Your Journey** | Journey page | Visual timeline + stage cards | Collapsed by default, expand any stage for detail |
| **3. What We Found** | CX Report | Top confrontation insights, evidence | 3-5 cards, severity-sorted, expandable |
| **4. What To Do First** | Playbook | Top 5 prioritized actions, week-one checklist | Actionable cards with status toggles |
| **5. Go Deeper** | All pages | Links to full Journey Map, full Playbook, full CX Report, QBR | "Explore" section at the bottom |

**Key UX decisions:**
- **Start with the story, not the data.** Lead with "here's what matters" not "here's everything we generated"
- **Progressive disclosure.** The summary is the default. Full detail pages still exist but are the "go deeper" layer
- **One scroll, one narrative.** No tab-switching needed to understand the analysis
- **The deliverable IS the product.** This is what you "bought" — your CX analysis, presented like a consultant would present it

### Navigation Simplification

**Current:** `Dashboard | CX Report | Journey | Playbook` (4 tabs, equal weight)

**Proposed:** `My Analysis | Journey Map | Playbook | CX Report` (1 primary + 3 deep-dive)

Or even simpler: `My Analysis` as the main view, with Journey/Playbook/Report as expandable sections or drill-down links within it.

---

## How This Aligns with Outcome Pricing

If we move toward "pay per analysis" (Gigi's thesis):

- **Free tier:** Get your CX Analysis (the one-page story) — snapshot + journey + top 3 insights + top 3 actions
- **Paid:** Unlock the full depth — all insights, full playbook, QBR, PDF export, monthly Pulse re-runs

The "analysis" becomes the atomic unit of value. Not "access to 4 pages" but "your personalized CX strategy document."

This also solves the pricing psychology: "$149 for a comprehensive CX analysis that would cost $10K from a consultant" is cleaner than "$149 for access to a dashboard and some tabs."

---

## What NOT to Change

1. **Keep the full detail pages.** Journey Map, Playbook, CX Report — they're well-built and serve power users. They become the "depth layer" you drill into from the summary.
2. **Keep the cross-linking.** Moment → playbook action → evidence is valuable. It just shouldn't be the FIRST thing you see.
3. **Keep the data architecture.** This is a presentation change, not a data model change. Same JSON, same generation, different front-end flow.
4. **Keep the playbook interactivity.** Status toggles, progress tracking, completion stats — that's the retention hook. It lives in the full Playbook page.

---

## The First-Time vs. Returning User Split

| | First-Time User | Returning User |
|---|---|---|
| **Needs** | Understand what CX Mate found, feel the value, know what to do first | Track progress, see what changed, get next actions |
| **Landing page** | "My Analysis" — the story | Dashboard or Playbook — the action center |
| **Overwhelm risk** | HIGH — never seen this before | LOW — already oriented |
| **Navigation** | Guided, narrative | Free exploration |

The current flow treats both users the same. The fix: first-time users land on the narrative. Returning users land on the dashboard or playbook (where they left off).

---

## Implementation Sketch (Not a Build Plan)

**Phase 1 — Narrative Landing (Sprint 4, before beta)**
- New `/analysis` page that pulls from existing data (journey, confrontation, playbook)
- Sections: Snapshot → Journey Overview (collapsed) → Top Insights → Top Actions → Go Deeper links
- First-time users redirect here after generation (instead of `/journey`)
- Returning users still get dashboard

**Phase 2 — Unified Deliverable (Post-beta)**
- PDF export generates from the analysis page (one document, not 4)
- Outcome pricing tied to the analysis unit
- "Re-run analysis" generates a fresh deliverable with delta comparison

**Phase 3 — Agentic Evolution**
- The analysis page becomes conversational: "Ask me about your journey"
- Proactive nudges: "You haven't started your top action. Here's a quick-start guide."
- Living document that updates as market intelligence changes

---

## The Persona B Connection

From the Gigi analysis — Persona B ("think they can do it alone") doesn't know what they're missing.

The narrative format is PERFECT for them:
1. Show the journey (they've never seen their CX mapped)
2. Show the confrontation ("here's what's costing you money")
3. Show the actions ("here's what to do about it")

This is the wake-up call Anat described. A wall of data doesn't wake anyone up. A story does.

---

## Decision Needed

**Option A: Build the Analysis page before beta** — new narrative landing page, redirect first-time users there. ~2-3 days of work. High impact on first impression.

**Option B: Simplify the Journey page itself** — make it less overwhelming (collapse stages, add a summary header, progressive disclosure within the existing page). ~1 day. Lower impact but faster.

**Option C: Both** — quick Journey page cleanup (Option B) for immediate relief, then Analysis page (Option A) as a Sprint 4 priority.

**Recommendation: Option C.** The Journey page needs to not overwhelm NOW (fix for tomorrow's review). The unified Analysis page is the real solution but needs proper design.

---

*Ready for review with Anat. This analysis should inform Sprint 4 planning alongside the Gigi pricing insights.*
