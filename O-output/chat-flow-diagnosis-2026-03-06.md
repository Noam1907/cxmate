# Chat Onboarding Flow — Diagnosis & Fix Plan
**Date:** 2026-03-06
**Branch:** `preview/onboarding-chat`
**Status:** Diagnosed. Fix ready for next session.

---

## What's Broken

The chat flow collected the right spirit but lost critical structure when converting from wizard steps to conversational turns. The result feels like it's winging it — not following a plan.

---

## Side-by-Side Comparison

### Wizard Steps → Chat Steps (where they diverge)

| Wizard | Chat (current) | Problem |
|--------|---------------|---------|
| Welcome: name, email, role, company, website — all at once | Opening: name + company + website. Then asks role separately. Email is LAST (step 11). | Email at end = lose the lead if user drops off |
| Step Company: enrichment prefill + confirm description | Not asked — relies on enrichment only | If enrichment fails or is low-confidence, `companyDescription` is blank |
| Step Journey Exists: **~15 specific process checkboxes** (ICP, sales pipeline, onboarding checklist, CS playbook, QBR, etc.) → `existingJourneyComponents[]` | "Do you have any journey documented? yes / partial / no" | **Massive data loss.** Journey prompt can't "BUILD ON" what exists because it doesn't know what exists. |
| Journey Exists also has: `WHAT_WORKS_OPTIONS` chips (8 items) + `WHAT_NEEDS_FIXING_OPTIONS` chips (9 items) → `whatWorksSelections[]` + `whatNeedsFixingSelections[]` | **Never collected** | Two structured fields wired to journey + recommendation prompts are completely absent from the chat path |
| Step CX setup: embedded in Journey Exists as checkboxes + chip selectors | **TWO** separate open questions: "What does your setup look like?" then "What's working / broken?" | Repetitive and vague. User answers the first and feels like they just answered the second too. |
| Step Competitors: dedicated step | Not asked — "comes from enrichment automatically" | Enrichment may not return competitors for smaller/newer companies |
| Step Customer Profile: company size (options), channel (options), customer description | One open question: "Who are your customers?" | Doesn't reliably extract structured `companySize` or `mainChannel` |

---

## The Root Problems (ranked by severity)

**🔴 P0 — Journey Exists step is completely degraded**
The wizard's journey-exists step is the richest data collection in the entire flow. It tells Claude exactly which processes exist, what's working, and what's broken — all in structured, prompt-ready format. The chat replaces this with yes/partial/no + two vague open questions. The AI gets almost nothing to "BUILD ON."

**🔴 P0 — `whatWorksSelections` + `whatNeedsFixingSelections` never collected**
Added in Sprint 5 (2026-03-05), wired to both `journey-prompt.ts` and `recommendation-prompt.ts`. The chat path skips these entirely. The prompts expect them; the chat doesn't deliver them.

**🟡 P1 — Steps 4+5 feel repetitive and unfocused**
Two consecutive open-ended questions covering overlapping ground. Users who answer "what does your CX setup look like" don't know what else to say when asked "what's working / broken?" — it's the same question from a different angle.

**🟡 P1 — Company description depends entirely on enrichment**
Works fine when enrichment is high-confidence (common companies). Breaks silently for less well-known companies. Wizard always confirms this explicitly.

**🟢 P2 — Email at the end**
Acceptable UX tradeoff (lower friction upfront) but means we lose the lead if user drops off before step 11. Wizard collects email first.

**🟢 P2 — Competitors not asked**
Low risk if enrichment is solid. Worth watching.

---

## The Fix

**Replace Chat Steps 3-5 with structured chip-based questions that mirror the wizard exactly.**

### New Step 3 — Journey Exists (keep yes/partial/no, then chips)
```
Q: "Do you have any customer journey documented — even informally?"
Options: Yes / Partially / Not yet

→ If yes or partial: show multi-select chips:
  Pre-sale: ICP, Sales pipeline, Sales playbook, Demo process, Proposal flow
  Onboarding: Sales→CS handoff, Onboarding checklist, Kickoff structure, Implementation plan
  Enablement: Training program, Knowledge base, Adoption tracking
  Ongoing: CS playbook, QBR cadence, Renewal process, Health scoring, Support flow, Escalation process

Extract: existingJourneyComponents[] (exact same values as wizard)
```

### New Step 4 — What's Working (chips, not open text)
```
Q: "What parts are actually working well?" (or "Skip if nothing yet")
Show WHAT_WORKS_OPTIONS chips — same 8 as wizard:
  ✅ Customers see value quickly
  ✅ Onboarding is smooth and consistent
  ✅ Clear communication throughout
  ✅ Strong product adoption
  ✅ High NPS / positive feedback
  ✅ CS team stays ahead of issues
  ✅ Renewals and upsells happen naturally
  ✅ Sales → CS handoff is clean

Extract: whatWorksSelections[]
```

### New Step 5 — What's Broken (chips, not open text)
```
Q: "What needs fixing most?" (multi-select)
Show WHAT_NEEDS_FIXING_OPTIONS chips — same 9 as wizard:
  ❌ Too many tickets for basic questions
  ❌ Onboarding takes too long
  ❌ Customers churn without warning
  ❌ No visibility into account health
  ❌ Sales → CS handoff breaks down
  ❌ Team has no consistent playbook
  ❌ Upsell/expansion happens by accident
  ❌ Data is scattered across tools
  ❌ We're always in firefighting mode

Extract: whatNeedsFixingSelections[]
```

**Remove the current open-text Step 4 ("What does your CX setup look like?")** — the tools are better extracted passively from the journey-exists context + what's broken chips, and asked explicitly only if currentTools is still empty after step 3-5.

### Files to update
- `src/app/api/onboarding/chat/route.ts` — update CONVERSATION SCRIPT (steps 3-5), add chip trigger logic for journey-exists + what-works + what-needs-fixing
- `src/components/onboarding/onboarding-chat.tsx` — map steps to correct chip arrays, add journey-process chips

### Chip arrays to import/replicate from wizard
- `WHAT_WORKS_OPTIONS` — defined in `step-journey-exists.tsx`
- `WHAT_NEEDS_FIXING_OPTIONS` — defined in `step-journey-exists.tsx`
- Journey process checkboxes — defined in `step-journey-exists.tsx` (PROCESS_GROUPS array)

---

## What Was Done This Session

| Thing | Commit / Note |
|-------|---------------|
| Base44 ROI Calculator UX analysis | No commit — observations shared |
| Suggestion chips — VIP visual zone + bigger styling | `c3de94f` |
| JSON leak — assistant prefill fix (server + client) | `0fd1e3c` |
| Vercel Preview env vars — added all 10 (were Production-only) | Via Vercel API |
| Chat flow diagnosis | This doc |

---

## Next Session Starts With

1. Fix Steps 3-5 in `route.ts` CONVERSATION SCRIPT (add chips for journey-exists, what-works, what-needs-fixing)
2. Wire chip arrays in `onboarding-chat.tsx` (import from or duplicate the wizard chip definitions)
3. End-to-end test the full chat path — does it feel like a real conversation now?
4. Decide: is the chat version ready to show as an alternative to the wizard?
