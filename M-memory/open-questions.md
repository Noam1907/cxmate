# Open Questions — CX Mate

> Last updated: 2026-03-11 (Post-Demo Debrief)
> Source: Jonathan Riftin demo, Keren Shaked demo, Gigi Levy input, internal discussions

---

## 🔴 Strategic / Business Model

### 1. Platform or Not in the AI Era?
**Source:** Gigi Levy (strategic advisor)
**Question:** Is "platform" the right framing when AI changes the game? In the AI era, do platforms still have the same defensibility? Should CX Mate position as an intelligence engine, a deliverable machine, or something else entirely?
**Why it matters:** This affects everything — positioning, pricing, product roadmap, investor narrative.
**Status:** Open — needs Strategic Decision Workflow

### 2. What Creates Longevity / Return Visits?
**Source:** Jonathan Riftin (demo feedback)
**Question:** Jonathan flagged "no longevity" — the product feels like a one-time report. What makes a user come back? Current hypothesis: script generation, template updates, quarterly progress tracking, integration insights. Is that enough?
**Why it matters:** Without retention, it's a consulting deliverable, not a business. The deliverable-shaped pricing (Analysis → Retainer → Connected) is our answer, but it's unvalidated.
**Status:** Open — pricing tiers defined but not battle-tested

### 3. Who Is the Primary Buyer?
**Source:** Jonathan Riftin
**Question:** In small companies → CEO buys. In mid-size → CS/Ops. In enterprise → who? And does the buyer differ from the user? Jonathan also surfaced: maybe the buyer isn't the company at all — it's the **consultant** who serves the company.
**Why it matters:** ICP clarity drives everything: messaging, onboarding, pricing, feature priority.
**Status:** Open — current ICP is B2B startup CS leaders, consultant angle unexplored

### 4. Consultant as Buyer ICP
**Source:** Jonathan Riftin
**Question:** Should CX consultants, freelancers, and consulting firms be a primary (or parallel) ICP? They'd use CX Mate as a force-multiplier: faster analysis, more clients, higher margins. This is a fundamentally different go-to-market motion than direct-to-company.
**Why it matters:** Different buyer = different onboarding, different pricing, different messaging. Could unlock a faster path to revenue.
**Status:** Open — worth exploring alongside direct-to-company

### 5. Defensibility / Moat
**Source:** Jonathan Riftin
**Question:** The know-how/methodology behind CX Mate isn't inherently defensible. What's the moat? Options: data network effects, proprietary benchmarks over time, community, integrations lock-in, speed-to-value.
**Why it matters:** Investors will ask. Competitors will copy. Need a clear answer.
**Status:** Open

---

## 🟡 Product / Positioning

### 6. How Deep Should the "Why" Layer Go?
**Source:** Keren Shaked
**Question:** Every recommendation needs evidence (research, competitor data, benchmarks). But how deep? Full academic citations? Light "companies like yours see X% improvement"? Industry benchmark ranges? Each level has different token cost, prompt complexity, and user trust impact.
**Why it matters:** This is the difference between "AI suggestions" and "trusted advisor." But it also affects generation time and token costs significantly.
**Status:** Open — needs AI Engineer input on token budget + prompt design

### 7. Generic Stages vs. Company-Specific Stages
**Source:** Anat (concern) + Keren (validation that generic is fine)
**Question:** The journey uses standard CX stages (Awareness → Onboarding → Adoption → etc.). Anat worried this feels generic. Keren validated that most companies operate by standard stages, so generic is acceptable as a starting point. Should we invest in custom stages, or is this a non-issue?
**Why it matters:** Custom stages = more complexity, more onboarding friction, more prompt engineering. If generic works, ship it.
**Status:** Leaning toward "generic is fine" per Keren's validation — but watch for feedback from more demos

### 8. Progressive Disclosure Design
**Source:** Anat (observed in both demos)
**Question:** The output is powerful but overwhelming. How should progressive disclosure work? Collapse by default? Summary → detail drill-down? Tab-based? Wizard-style reveal?
**Why it matters:** If users can't absorb the output, the output doesn't matter.
**Status:** Open — needs Design Agent input

### 9. Deliverable-Shaped Pricing Validation
**Source:** Internal decision (2026-03-10)
**Question:** Current pricing: Analysis $149 (one-time), Annual Retainer $499/yr (quarterly reports + progress), Connected TBD/mo (integrations). Is $149 the right entry point? Is $499/yr enough for retention? What's the Connected tier worth?
**Why it matters:** Pricing is untested. Jonathan's "one-time report" concern directly challenges whether $149 buyers convert to $499 retainers.
**Status:** Open — needs validation with 3-5 more prospects

---

## 🟢 Technical / Implementation

### 10. Token Budget for Evidence Layer
**Source:** AI Engineer discussion
**Question:** Adding "why" evidence (research citations, benchmarks, competitor references) to every recommendation will significantly increase prompt and output tokens. How do we add evidence without blowing past token limits or doubling generation time?
**Why it matters:** Current generation is ~1.4 min. Adding evidence could push it back toward 2.8 min or require splitting into multiple API calls.
**Status:** Open — needs prompt engineering exploration

### 11. Input → Output Visual Mapping UX
**Source:** Keren Shaked
**Question:** Users need to see WHERE their stated pain points appear in the output. What's the UX for this? Highlight colors? Sidebar annotations? "Your input" badges? Tooltip on hover?
**Why it matters:** This is the #1 proof of personalization. Without it, output feels generic even when it isn't.
**Status:** Open — needs Design + Frontend solution

### 12. Stickiness Features Roadmap
**Source:** Keren Shaked + Jonathan Riftin
**Question:** Script generation, template creation, training materials, review of existing scripts — these don't require system integrations and create ongoing value. What's the priority order? What ships in beta vs. post-beta?
**Why it matters:** These are the features that make the $499/yr retainer worth it.
**Status:** Open — needs Product Lead prioritization

---

## 📋 Follow-Up Actions (from Demos)

| Action | Owner | Status |
|--------|-------|--------|
| Send Jonathan Riftin access link | Anat | Pending |
| Check Jonathan's LinkedIn for context | Anat | Pending |
| Explore consultant ICP in strategic planning | Shoval/Strategist | Open |
| Validate with 3-5 more companies | Anat | Ongoing |
| Cloudflare email verification (anat@cxmate.io) | Anat | Stuck — verification email not arriving |

---

*This document is a living log. Questions get resolved → moved to `M-memory/decisions.md`. New questions surface → added here.*
