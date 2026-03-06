# Context Integrity Workflow

> The mandatory pre-build verification gate for CX Mate. Every agent, every code change. This workflow exists because we learned the hard way: an agent that builds without context destroys months of compounded work.

---

## Process Overview

```
[Agent] receives task to modify code
       ↓
[Agent] reads WHAT they're changing
       ↓
[Agent] reads WHAT CONSUMES what they're changing
       ↓
[Agent] verifies: no fabricated fields, routes, props, or tiers
       ↓
[Agent] verifies: existing implementation understood (not replacing blindly)
       ↓
[Agent] builds the change
       ↓
[Agent] verifies: all data flows still work end-to-end
       ↓
[Agent] documents what changed (sprint-log, decisions, learning-log)
       ↓
[QA Gatekeeper] runs Context Integrity Audit (Category 6) if major change
```

---

## The 5 Rules (Non-Negotiable)

### Rule 1: No Building Without Reading the Consumer

Before modifying ANY system, you MUST read both:
- **The files you're changing** (obvious)
- **The files that CONSUME what you're changing** (the ones you'll break if you don't understand them)

| If you're changing... | You MUST also read... |
|----------------------|----------------------|
| Onboarding (wizard or chat) | `src/lib/ai/journey-prompt.ts`, `src/lib/validations/onboarding.ts`, `src/types/onboarding.ts` |
| Journey generation prompt | `src/types/onboarding.ts`, the current onboarding component |
| Recommendations / Playbook | `src/lib/ai/recommendation-prompt.ts`, `src/lib/ai/journey-prompt.ts` |
| Pricing / Billing | `src/lib/freemius.ts`, `M-memory/decisions.md` |
| Auth / Database | `src/lib/supabase/` (all files), `src/middleware.ts` |
| UI design / colors | `src/app/globals.css`, learning-log.md design entries |
| API routes | The frontend component that calls the route AND the AI prompt that uses the route's output |
| Type definitions | Every file that imports or uses those types |

**The chain:** Onboarding → API → Validation → Claude Prompt → Generated Output → Frontend Display. A change at any point can break downstream.

---

### Rule 2: No Fabrication

Agents MUST NOT:

- **Invent field names** that don't exist in `src/types/onboarding.ts` and `src/lib/validations/onboarding.ts`
- **Invent API endpoints** — always check `src/app/api/` for existing routes
- **Invent component props** — always read the component file before passing props
- **Assume step counts, field counts, or UI structure** — always read the current code
- **Guess pricing tiers, plan names, or feature access rules** — always read `M-memory/decisions.md`
- **Assume what Claude model, parameters, or patterns we use** — always read `C-core/tech-stack.md`

**If you don't know something, READ THE FILE. Never guess. Never "make up something reasonable."**

---

### Rule 3: Build On What Exists

Before creating ANYTHING new:

1. **Search for existing implementations** — `Glob` and `Grep` before `Write`
2. **Read what was built before** — understand the WHY, not just the WHAT
3. **Extend, don't replace** — months of iteration are baked into existing code
4. **If the existing approach seems wrong, check `decisions.md`** — there may be a documented reason

**Replacing without understanding destroys compounded value.**

---

### Rule 4: Verify Before Shipping

Before marking any task as complete:

1. **Does the output page still get all the data it needs?** (check the data flow end-to-end)
2. **Did you break any existing functionality?** (run the app, check the flow)
3. **Does the change align with `product-architecture.md`?** (principles, constraints, data flow)
4. **Would this change pass the QA Gatekeeper?** (no dead buttons, no lost data, no placeholders)

---

### Rule 5: Document What You Change

Every significant change must be reflected in:

- `M-memory/sprint-log.md` — what was done
- `M-memory/decisions.md` — if an architectural choice was made
- `M-memory/learning-log.md` — if a pattern was discovered
- The relevant `C-core/` file — if architecture or product scope changed

**If you changed it but didn't log it, the next session will repeat your mistakes or undo your work.**

---

## Pre-Build Verification Checklist

Run this BEFORE writing or modifying any code:

```
1. [ ] Have I read the consumer?
      → If changing a data source: read what consumes that data
      → If changing UI: read where the data comes from

2. [ ] Do I know the current field count / step count / API contract?
      → Don't assume from memory — read the actual file

3. [ ] Does this change maintain all existing data flows?
      → The onboarding → journey prompt → AI output chain is the product
      → Breaking any link breaks the product

4. [ ] Am I inventing anything?
      → Field names, API endpoints, component props, pricing tiers
      → If it doesn't exist in the codebase, don't fabricate it

5. [ ] Am I replacing something that took months to build?
      → If yes, STOP
      → Read the decisions log
      → Understand why it was built that way
      → Extend, don't replace
```

**If any answer is "I'm not sure," READ MORE FILES before writing code.**

---

## The Critical Constraint: Onboarding → Journey Prompt Contract

**The onboarding flow MUST collect all fields that `journey-prompt.ts` consumes.**

- **Source of truth for required fields:** `src/lib/validations/onboarding.ts` (Zod schema) + `src/types/onboarding.ts` (OnboardingData type)
- **Consumer that needs ALL fields:** `src/lib/ai/journey-prompt.ts` (buildJourneyPrompt uses 33+ fields)
- **Current field count:** 33+ structured intelligence fields

The moat is in the inputs, not the model. A raw LLM gets a company name. CX Mate gets 33 structured intelligence fields. That gap IS the product.

---

## When to Run the QA Gatekeeper (Category 6: Context Integrity Audit)

Run the QA Gatekeeper's Context Integrity Audit after:

- Replacing any data collection component (e.g., swapping wizard for chat)
- Modifying the onboarding flow (adding/removing/reordering fields)
- Changing AI prompts (journey generation, recommendations)
- Modifying API route contracts
- Any change that touches 3+ files in the data chain

### What the Gatekeeper Checks

| Check | How |
|-------|-----|
| Onboarding collects ALL fields journey-prompt.ts uses | Compare fields in onboarding flow vs all `input.fieldName` in journey-prompt.ts |
| No invented field names | All field names must exist in `src/types/onboarding.ts` |
| No invented API routes | All fetch/POST calls target routes that exist in `src/app/api/` |
| No invented component props | All props match actual interface |
| decisions.md is up to date | Architectural changes documented |
| learning-log.md is up to date | Patterns captured |

**FAIL if:** Any onboarding field that `journey-prompt.ts` reads is not collected by the current onboarding flow.

---

## The Chat Regression Lesson (Why This Workflow Exists)

On 2026-03-06, a conversational onboarding chat was built collecting ~10 fields instead of the 33+ that `journey-prompt.ts` consumes. Nobody read the journey prompt before deciding what to collect. The AI output quality dropped dramatically — because the prompt lost 70% of its context.

**Three lessons:**
1. Never rebuild a data collection layer without reading what consumes the data
2. "Read first, build second" needs to be task-specific (general "read core files" isn't enough)
3. Critical constraints must be documented as constraints, not just architecture

This workflow is the system-level fix. It applies to every agent, every session, every code change.

---

## Quick Checklist

### Before Any Code Change
- [ ] Read the files you're changing
- [ ] Read the files that CONSUME what you're changing
- [ ] Verified: no fabricated field names, routes, props, or tiers
- [ ] Verified: understand why the existing code was built this way
- [ ] Verified: change maintains all existing data flows

### After Any Code Change
- [ ] End-to-end data flow still works
- [ ] No broken functionality
- [ ] Aligns with product-architecture.md
- [ ] Sprint-log updated
- [ ] Decisions/learning-log updated (if applicable)

### For Major Changes
- [ ] QA Gatekeeper ran Context Integrity Audit (Category 6)
- [ ] All checks passed

---

## Tips for Success

1. **The 2-minute read saves the 2-hour regression.** Every time.
2. **"I think I know what this does" is not the same as reading it.** Read it.
3. **The chain is sacred.** Onboarding → Prompt → Output → Display. Respect every link.
4. **When in doubt, read more files.** The answer is always in the code, not in assumptions.
