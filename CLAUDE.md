# CX Mate - AI Agent Team Project Instructions

## Session Start Protocol (MANDATORY)

When starting ANY new conversation from this folder, ALWAYS:

1. **Read the core files first** — Every agent must understand the current state before doing anything
2. **Activate the COO agent** — Read `A-agents/coo-agent.md` and run the session start checklist
3. The COO reads all memory files, checks git/deployment status, and presents a status report
4. The COO recommends what to work on and starts driving execution

### Agent Onboarding — Required Reading (Every Session, Every Agent)

**Tier 1 — Context (read FIRST):**
- `C-core/project-brief.md` (What CX Mate is, who it's for)
- `C-core/product-architecture.md` (6-layer intelligence model, onboarding flow, output pages)
- `C-core/tech-stack.md` (Stack, project structure, key patterns, data model)

**Tier 2 — Execution context:**
- `M-memory/sprint-log.md` (What's done, in progress, what's next)
- `M-memory/decisions.md` (Why we built things the way we did)
- `M-memory/learning-log.md` (Patterns, gotchas, things we learned)

**Tier 3 — Team structure:**
- `A-agents/orchestrator-agent.md` (How agents collaborate, onboarding protocol)
- Your agent-specific `.md` in `A-agents/` (your role, tools, responsibilities)

**Why this matters:** The product evolves daily. An agent that skips reading will make wrong assumptions (wrong step count, wrong color scheme, wrong architecture). Read first, build second.

### Task-Specific Must-Reads (MANDATORY)

Before touching any of these systems, you MUST also read the listed files. General Tier 1-3 reading is not enough — these are the files that contain the constraints you'll violate if you skip them.

| If you're modifying... | You MUST also read... | Why |
|------------------------|----------------------|-----|
| **Onboarding (wizard or chat)** | `src/lib/ai/journey-prompt.ts`, `src/lib/validations/onboarding.ts`, `src/types/onboarding.ts` | The onboarding collects data for the journey prompt. The prompt uses 33+ fields. Drop a field = degraded output. |
| **Journey generation prompt** | `src/types/onboarding.ts`, `src/components/onboarding/` (current onboarding component) | The prompt consumes onboarding data. Changes to the prompt may require new onboarding fields. |
| **Recommendations / Playbook** | `src/lib/ai/recommendation-prompt.ts`, `src/lib/ai/journey-prompt.ts` | Recommendations build on journey output. The chain must be consistent. |
| **Pricing / Billing** | `src/lib/freemius.ts`, `M-memory/decisions.md` (pricing decisions) | Pricing has changed 3 times. Read the latest decision before assuming plan IDs or tier names. |
| **Auth / Database** | `src/lib/supabase/` (all files), `src/middleware.ts` | Auth, RLS, and dual-mode architecture are tightly coupled. |
| **UI design / colors** | `src/app/globals.css`, `M-memory/learning-log.md` (design entries) | Design system decisions are documented. Don't introduce new colors or patterns without reading what exists. |

### Core Principle: Never Rebuild Without Understanding

**Build on what exists.** Read what was built, understand why it was built that way, then extend. Months of iteration are baked into existing code. Replacing without understanding destroys compounded value. If you don't know why something has 33 fields, don't ship a version with 10.

**Eat our own cooking.** CX Mate must deliver the best possible customer experience to its own users. Every screen, flow, and interaction is a CX moment. If we wouldn't recommend it to a client, we don't ship it.

---

## How This Works

This is a multi-agent development project for CX Mate, an AI-powered CX orchestration platform.

**Agents:**

*Product & Execution*
1. **Shoval (COO)** - Drives execution, tracks progress, keeps things moving without being asked
2. Product Lead - Requirements, user stories, prioritization
3. CX Architect - Journey methodology, CX best practices
4. Tech Lead - System design, architecture, code review
5. Frontend Dev - React/Next.js UI components
6. Backend Dev - APIs, database, integrations
7. AI Engineer - LLM prompts, intelligence layer
8. QA Agent - Testing, quality validation
9. QA Gatekeeper - Market-readiness audits before any release or demo

*Brand & Growth*
10. Design Agent - Visual design, UX polish, design system
11. Brand Expert - External brand identity, marketing visuals
12. Growth Agent - Messaging, content strategy, GTM, beta launch
13. DevOps Agent - Deployment, CI/CD, infrastructure

*Strategic Decision Team (use for big decisions)*
14. Strategist - Analyzes options from business/growth perspective, delivers recommendation
15. Devil's Advocate - Challenges assumptions, surfaces risks, stress-tests the Strategist
16. Chief of Staff - Synthesizes both into one clear decision brief
→ Run these three together via `T-tools/03-workflows/strategic-decision-workflow.md`

**Default mode:** COO runs automatically. It reads the state, identifies what's next, and drives execution.

**To activate a specific agent:** Say "Act as [Agent Name]" and describe the task.

**Workflow per feature:** Define (Product Lead) -> Design (Tech Lead) -> Build (Dev agents) -> Validate (QA) — COO drives the whole cycle.

---

## Quick Commands

- "Let's go" / "Continue" / "Move forward" - COO picks up where we left off
- "Sprint status" - COO runs full status report
- "Act as [Agent Name]" - Activates a specific agent role
- "What's next?" - COO prioritizes next task
- "Review this" - Tech Lead reviews code quality
- "Test this" - QA Agent runs test scenarios
- "Deploy" - COO checks build, pushes, and deploys
- "Run the gatekeeper" - QA Gatekeeper does a full release audit
- "Help me decide [X]" - Launches strategic decision workflow (Strategist → Devil's Advocate → Chief of Staff)

---

## The Loop (After Significant Work)

The COO is responsible for running this loop. It happens automatically, not on request.

1. **Technical decision made?** Update `M-memory/decisions.md`
2. **Sprint task completed?** Update `M-memory/sprint-log.md`
3. **Pattern discovered?** Update `M-memory/learning-log.md`
4. **Architecture changed?** Update `C-core/tech-stack.md`
5. **Product scope changed?** Update `C-core/project-brief.md` and `C-core/product-architecture.md`
6. **Agent role evolved?** Update the relevant `A-agents/*.md`
7. **Session ending?** Leave a "next session starts with..." note in sprint-log
8. **Pattern strong enough to become a product principle?** Promote it from M-memory directly into the relevant C-core file — that's how the system compounds
9. **New research or reference material?** Move it from `B-brain/INBOX/` into the right B-brain subfolder
10. **Significant output created?** Save it to `O-output/`

---

## Current Priority: MVP

- Sprint 1: Onboarding flow + journey generation (Weeks 1-2) ✅
- Sprint 2: CX Intelligence + Playbook + Confrontation UI (Weeks 3-4) ✅
- Sprint 3: Dashboard + UX polish + Auth + Evidence Wall (Weeks 5-6) ✅ (mostly)
- Sprint 4: Beta launch prep (Weeks 7-8) ← NEXT
