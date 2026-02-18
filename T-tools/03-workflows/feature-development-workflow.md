# Feature Development Workflow

## Overview
Every feature in CX Mate follows this 4-step workflow. No shortcuts.

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

**Output:** Approved feature spec

---

## Step 2: DESIGN (Tech Lead)

1. Define data model changes (new tables, columns, migrations)
2. Define API contracts (endpoints, request/response schemas)
3. Define component structure (new components, props, state)
4. Identify security considerations (RLS policies, validation)
5. Flag any architectural decisions needed

**Output:** Technical design document

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

**Output:** Working code

---

## Step 4: VALIDATE (QA Agent + Tech Lead)

### QA Agent:
1. Execute test plan (happy path + edge cases)
2. Test across personas
3. Validate UX against 5-minute-to-value goal
4. Security spot-check

### Tech Lead:
1. Code review (quality, consistency, architecture)
2. Performance check
3. Security review

**Output:** Approved, tested feature

---

## After Completion: Close The Loop

1. Update `M-memory/sprint-log.md` (mark task done)
2. Log any decisions in `M-memory/decisions.md`
3. Log any patterns in `M-memory/learning-log.md`
