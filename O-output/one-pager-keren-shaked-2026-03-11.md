# Meeting Prep: Keren Shaked — March 11, 2026

---

## Who She Is
- Israeli CX practitioner, active on LinkedIn
- Referenced in our CX Intelligence Stack as a framework source
- She knows CX methodology deeply — don't over-explain, speak peer-to-peer

## Your Goal for This Meeting
> **[FILL IN: What do you want from Keren? Advisory role? Feedback on methodology? Beta tester? LinkedIn endorsement? Partnership? Intro to her network?]**

---

## The Elevator Pitch (30 seconds)

"Every B2B company from seed to Series B is running their customer journey on gut feel. There's nothing between winging it and a $50K Gainsight implementation. CX Mate fills that gap — one conversation, and you get a full journey map, a CX intelligence report, and a prioritized playbook. Real CX methodology baked in, not ChatGPT fluff."

---

## The 3 Points to Land

**1. The gap is real and nobody's filling it**
- 65% of enterprises can't get past the first two CX maturity stages — even with teams and budget
- Below them? Zero tools, zero methodology. Gut feel + spreadsheets.
- SMBs = 56.8% of the journey mapping market. $76.2B by 2035.
- Gainsight = 24 weeks + $50K/yr. ChurnZero = 6-8 weeks. CX Mate = one conversation.

**2. The methodology is real — not an AI wrapper**
- 33 structured input fields via adaptive onboarding (not "enter your company name")
- CCXP body of knowledge, 15 named expert frameworks wired into prompts
- Maturity-adaptive analysis: Prescriptive (early) → Comparison (growing) → Optimization (scaling)
- Evidence chain: pain points → journey moments → recommendations — everything links back
- This is what separates us from "just ask ChatGPT"

**3. The architecture compounds over time**
- 7-layer intelligence stack (L0 input → L6 outcome learning loop)
- L0–L1 live today. L2–L3 static with automation planned. L4–L6 = the future moat
- CX Score tracking, before/after delta, outcome correlation
- More users = better "companies like yours" patterns — the Gainsight model, accessible

---

## Stats Ready to Drop

| Stat | When to use it |
|------|---------------|
| 89% switch after one bad experience — even with great product | "The product isn't the problem. The journey is." |
| SMBs lose 1–9% of revenue to operational fragmentation | Dollar hook — makes the gap concrete |
| Journey management → 18x faster sales cycles, 3.5x referrals | When she asks "does journey design actually move numbers?" |
| Only 17% of companies can prove CX ROI | "We show the math — transparent formulas, assumptions disclosed" |
| 72% switch after one bad experience | Urgency — "one moment breaks everything" |

---

## Questions She'll Probably Ask

**"How is this different from asking ChatGPT?"**
→ "A founder who knows enough to write a perfect CX prompt already has a CX director. CX Mate knows which questions to ask, asks them in sequence, and turns answers into a structured system — not a one-time text response. 33 fields in, structured journey out. The gap is in the inputs, not the model."

**"Which CX frameworks do you use?"**
→ CCXP body of knowledge, lifecycle science, decision science, failure patterns. 15 named expert frameworks including Annette Franz, Ian Golding — and yours. We built a `cx-influencer-frameworks.ts` module that selects relevant frameworks based on company context.

**"Who's actually using this?"**
→ Pre-beta. Working product — onboarding through dashboard all functional. Sprint 4 is beta launch prep (payments, analytics, invites). Looking for expert feedback before we go live.

**"What maturity stages do you target?"**
→ Pre-launch through Scaling. The onboarding adapts — different questions, different pain points, different analysis depth per stage. A pre-launch founder gets prescriptive best practices. A scaling company gets optimization recommendations against benchmarks.

**"How do you handle the quality problem — AI generating bad CX advice?"**
→ The methodology layer constrains the output. It's not "generate a journey" — it's "generate a journey using these specific CX frameworks, for this maturity stage, with these pain points as constraints, and cite which framework drives each recommendation." The prompt is 400+ lines of engineered CX context.

---

## What's Built and Working

Conversational onboarding → auto-enrichment from website → journey generation (~2.8 min) → CX Intelligence Report with Evidence Wall → Playbook with AI tool recs → Dashboard. Auth + DB persistence. Dual-mode (preview before signup, save after).

**Stack:** Next.js, Supabase, Claude API, Tailwind, shadcn/ui

---

## Business Model (if it comes up)

Free full run (trust) → $79/mo Starter → $199/mo Pro → $1,200/yr Premium

---

*Close the meeting with your ask. Don't leave without it.*
