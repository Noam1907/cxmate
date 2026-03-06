# Feature Development Workflow

> The end-to-end process for building features in CX Mate. Every feature follows this 5-step workflow with mandatory context integrity gates. No shortcuts.

---

## Process Overview

```
[COO] identifies next feature from sprint plan
       ↓
[Product Lead + CX Architect] DEFINE — user story, acceptance criteria, CX alignment
       ↓
  ⛔ CONTEXT GATE: Read consumer files before designing
       ↓
[Tech Lead] DESIGN — data model, API contracts, component structure
       ↓
  ⛔ CONTEXT GATE: Verify no fabricated fields/routes/props
       ↓
[Frontend + Backend + AI Dev] BUILD — code the feature
       ↓
  ⛔ CONTEXT GATE: Verify data chain intact end-to-end
       ↓
[QA Agent + Tech Lead] VALIDATE — test plan, code review, context integrity audit
       ↓
[COO] SHIP — push, deploy, update logs
```

---

## Step 0: DRIVE (COO — Shoval)

- COO identifies what's next from sprint plan
- COO activates the right agents in the right order
- COO tracks progress and updates memory files
- COO ensures every step passes its context gate

---

## Step 1: DEFINE (Product Lead + CX Architect)

### Product Lead:
1. Write user story: "As a [persona], I want [action], so that [outcome]"
2. Define acceptance criteria (bullet list, testable)
3. Set priority: P0 (must have) / P1 (should have) / P2 (nice to have)
4. Estimate effort: S (1-2 days) / M (3-5 days) / L (1-2 weeks)
5. List dependencies

### CX Architect:
1. Validate: Does this align with CX methodology?
2. Check: Which meaningful moments does this serve?
3. Confirm: Is the recommendation framework applied correctly?

### Available Skills:
- `/prd` — Generate a modern Product Brief for the feature
- `/mrd` — Run an Opportunity Assessment if evaluating whether to build this
- `/cx-expert` — Validate CX methodology alignment

**Output:** Approved feature spec

---

## ⛔ Context Gate 1: Pre-Design Verification

Before the Tech Lead designs anything:

- [ ] Read the files that will be affected by this feature
- [ ] Read the files that CONSUME what will be affected
- [ ] Check `M-memory/decisions.md` for relevant past decisions
- [ ] Verify: does this feature touch the onboarding → journey prompt → output chain?
  - If yes: read `src/lib/ai/journey-prompt.ts`, `src/types/onboarding.ts`, `src/lib/validations/onboarding.ts`

**Reference:** `T-tools/03-workflows/context-integrity-workflow.md`

---

## Step 2: DESIGN (Tech Lead)

1. Define data model changes (new tables, columns, migrations)
2. Define API contracts (endpoints, request/response schemas)
3. Define component structure (new components, props, state)
4. Identify security considerations (RLS policies, validation)
5. Flag any architectural decisions needed
6. **Verify:** all field names, API routes, and props reference existing types — no fabrication

### Available Skills:
- `/qa-gatekeeper` — Pre-check design against market-readiness standards

**Output:** Technical design document

---

## ⛔ Context Gate 2: Pre-Build Verification

Before any dev agent starts coding:

- [ ] Tech Lead design references only existing field names from `src/types/onboarding.ts`
- [ ] Tech Lead design references only existing API routes from `src/app/api/`
- [ ] No invented component props — existing interfaces checked
- [ ] If replacing existing code: original implementation has been read and understood
- [ ] If touching data collection: journey-prompt.ts consumption verified

---

## Step 3: BUILD (Frontend Dev + Backend Dev + AI Engineer)

### Backend Dev:
1. Create database migrations
2. Implement API endpoints
3. Write Zod validation schemas
4. Add RLS policies

### AI Engineer (if AI-powered feature):
1. Design and test prompts
2. Implement AI service functions
3. Add structured output parsing
4. Test edge cases

### Frontend Dev:
1. Build UI components
2. Integrate with API
3. Add loading/empty/error states
4. Ensure responsive design

**All agents follow Tech Lead's architecture from Step 2.**
**All agents follow Context Integrity Rules from their agent file.**

### Available Skills:
- `/copywriter` — Write product copy for any new UI (microcopy, empty states, CTAs)
- `/cx-expert` — Validate that AI-generated output follows CX methodology

**Output:** Working code

---

## ⛔ Context Gate 3: Post-Build Verification

Before marking the build as complete:

- [ ] End-to-end data flow still works (onboarding → API → prompt → output → display)
- [ ] No broken existing functionality
- [ ] All new field names exist in type definitions
- [ ] All new API calls target routes that exist
- [ ] Change aligns with `product-architecture.md` principles and constraints

---

## Step 4: VALIDATE (QA Agent + Tech Lead)

### QA Agent:
1. Execute test plan (happy path + edge cases)
2. Test across personas
3. Validate UX against 5-minute-to-value goal
4. Security spot-check
5. **Run Context Integrity Audit** (if feature touches data chain)

### Tech Lead:
1. Code review (quality, consistency, architecture)
2. Performance check
3. Security review
4. **Verify no fabricated fields, routes, or props**

### Available Skills:
- `/qa-gatekeeper` — Full market-readiness audit (6 categories including Context Integrity)

**Output:** Approved, tested feature

---

## Step 5: SHIP (COO — Shoval)

1. Verify build passes
2. Push code and confirm deployment
3. Smoke test critical paths in production
4. Update sprint log

---

## After Completion: Close The Loop

1. Update `M-memory/sprint-log.md` (mark task done)
2. Log any decisions in `M-memory/decisions.md`
3. Log any patterns in `M-memory/learning-log.md`
4. **Pattern strong enough to become a product principle?** Promote it directly into the relevant `C-core/` file
5. **New research or reference material?** Move from `B-brain/INBOX/` into the right B-brain subfolder
6. **Significant output created?** Save to `O-output/`

---

## Quick Checklist

### DEFINE
- [ ] User story written with acceptance criteria
- [ ] CX methodology alignment validated
- [ ] Priority and effort estimated
- [ ] Context Gate 1 passed

### DESIGN
- [ ] Data model, API contracts, component structure defined
- [ ] No fabricated fields, routes, or props
- [ ] Context Gate 2 passed

### BUILD
- [ ] Code follows Tech Lead architecture
- [ ] Context Integrity Rules followed
- [ ] Context Gate 3 passed

### VALIDATE
- [ ] Test plan executed (happy path + edge cases)
- [ ] Context Integrity Audit passed (if data chain touched)
- [ ] Code review passed

### SHIP
- [ ] Build passes
- [ ] Deployed and smoke tested
- [ ] Memory files updated (The Loop)

---

## Tips for Success

1. **Context gates are not optional.** They take 2 minutes and prevent 2-day regressions.
2. **Use the skills.** `/prd` for scoping, `/cx-expert` for methodology, `/qa-gatekeeper` for audits, `/copywriter` for copy.
3. **The data chain is sacred.** Onboarding → Prompt → Output → Display. Every feature must respect it.
4. **Document as you go.** The Loop happens after every step, not just at the end.
