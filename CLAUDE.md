# CX Mate - AI Agent Team Project Instructions

## The Operating Model: ABC-TOM

This project runs on the **ABC-TOM framework**. Every agent, every session, no exceptions.

```
ABC-TOM
├── ABC = The Foundation (set up once, evolve through promotions)
│   ├── A-agents/    → Your AI team definitions
│   ├── B-brain/     → Knowledge, research, references
│   └── C-core/      → Brand DNA, identity, ICP, product architecture
│
└── TOM = The Execution (run daily)
    ├── T-tools/     → Skills, workflows, prompts
    ├── O-output/    → Everything the team creates
    └── M-memory/    → What the system learns
```

**The Mantra:** "Set up ABC once. Run TOM daily."
**The Distinction:** "ABC is who you are. TOM is what you do."
**Brain vs Memory:** "Brain is what you bring. Memory is what you learn together."

> Canonical framework reference: `/Users/anat/Documents/Anat-workspace/the-system/@ALL-GUIDES-HERE/04-tom-agent-knowledge/system-guide.md`

**The Loop (how the system compounds):**
```
You give direction → Agent reads ABC → Agent uses T-tools → O-output created → You review → M-memory updated
        ↑                                                                                          |
        └── Strong patterns from M-memory get promoted into B-brain and C-core ←───────────────────┘
```

Every cycle makes the foundation stronger. Week 10 is better than week 1 because the loop ran 50 times.

---

## Session Start Protocol (MANDATORY)

When starting ANY new conversation from this folder, ALWAYS:

1. **Read ABC** — the foundation. Every agent must load the full context before doing anything.
2. **Activate the COO agent** — Read `A-agents/coo-agent.md` and run the session start checklist
3. The COO reads all M-memory files, checks git/deployment status, and presents a status report
4. The COO recommends what to work on and starts driving execution

### Agent Onboarding — Required Reading (Every Session, Every Agent)

**ABC = The Foundation — read ALL of this first:**

**A — Agents (your team):**
- `A-agents/orchestrator-agent.md` (How agents collaborate, onboarding protocol)
- Your agent-specific `.md` in `A-agents/` (your role, tools, responsibilities)

**B — Brain (domain knowledge):**
- `B-brain/00-architecture/intelligence-stack.md` (7-layer intelligence architecture)
- `B-brain/01-cx-methodology/` (Journey stages, moments taxonomy, CX influencers)
- `B-brain/02-market-research/competitive-landscape.md` (Competitive positioning)

**C — Core (identity + architecture):**
- `C-core/project-brief.md` (What CX Mate is, who it's for)
- `C-core/product-architecture.md` (6-layer intelligence model, onboarding flow, output pages)
- `C-core/tech-stack.md` (Stack, project structure, key patterns, data model)
- `C-core/voice-dna.md` (How CX Mate sounds)
- `C-core/icp-profile.md` (Who we build for)

**M — Memory (execution context — read to know where we are):**
- `M-memory/sprint-log.md` (What's done, in progress, what's next)
- `M-memory/decisions.md` (Why we built things the way we did)
- `M-memory/learning-log.md` (Patterns, gotchas, things we learned)
- `M-memory/intel/` (Latest CX intelligence digests)

**Why this matters:** The product evolves daily. An agent that skips reading ABC will make wrong assumptions (wrong step count, wrong color scheme, wrong architecture). ABC first, TOM second. Always.

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

### Core Principle: Anticipate Value, Don't React

**CX Mate is a CX product — we must practice what we preach.** This principle applies to both the PRODUCT and the AGENT TEAM:

**For the product:**
- Every output must be specific to the company, not generic. "Gather buyer scenarios" is a failure. "For B2B payment platforms, demo with e-commerce marketplaces, SaaS invoicing, wholesale credit lines" is the standard.
- Every page must connect to its related pages. Journey moments link to playbook how-tos. Playbook actions link back to journey context. No dead ends, no silos.
- The intelligence layer sits ON TOP of all output — enriching with real-world, company-specific context. Not a one-time onboarding enrichment, but a living layer.

**For the agent team:**
- Don't wait to be asked. Come to sessions with insights, not just status reports.
- Connect dots proactively. If two systems should link but don't, flag it before the user notices.
- Push for specificity. Generic output from any agent is a failure state.
- Plan before building. The COO presents a sequenced plan, gets confirmation, THEN drives execution. No reactive building.
- The agents must model the behavior CX Mate sells to customers: proactive, intelligent, always one step ahead.

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

## The ABC-TOM Loop (After Significant Work)

The COO is responsible for running this loop. It happens automatically, not on request. **This is how the system compounds.**

### Step 1: Update TOM (execution layer)
1. **Technical decision made?** Update `M-memory/decisions.md`
2. **Sprint task completed?** Update `M-memory/sprint-log.md`
3. **Pattern discovered?** Update `M-memory/learning-log.md`
4. **Significant output created?** Save it to `O-output/`
5. **Session ending?** Leave a "next session starts with..." note in sprint-log

### Step 2: Promote to ABC (foundation layer) — this is what makes the system smarter
6. **Architecture changed?** Promote to `C-core/tech-stack.md`
7. **Product scope changed?** Promote to `C-core/project-brief.md` and `C-core/product-architecture.md`
8. **Agent role evolved?** Promote to the relevant `A-agents/*.md`
9. **Pattern strong enough to become a product principle?** Promote from M-memory into the relevant C-core file
10. **New research or reference material?** Promote from `B-brain/INBOX/` into the right B-brain subfolder
11. **CX methodology insight validated?** Promote to `B-brain/01-cx-methodology/`

**The key distinction:** TOM updates capture what happened. ABC promotions make the foundation stronger for next time. Both must happen. Skipping Step 2 means the system never compounds.

---

## Current Priority: MVP

- Sprint 1: Onboarding flow + journey generation (Weeks 1-2) ✅
- Sprint 2: CX Intelligence + Playbook + Confrontation UI (Weeks 3-4) ✅
- Sprint 3: Dashboard + UX polish + Auth + Evidence Wall (Weeks 5-6) ✅ (mostly)
- Sprint 4: Beta launch prep (Weeks 7-8) ← NEXT
