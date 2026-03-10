# Session Start Workflow

> How every CX Mate session begins. Every agent, every time. No exceptions.
>
> **This workflow follows the ABC-TOM framework.** ABC is the foundation (read first). TOM is the execution (run daily). The loop between them is how the system compounds.
>
> **Brain is what you bring. Memory is what you learn together.** Framework reference: `the-system/@ALL-GUIDES-HERE/04-tom-agent-knowledge/system-guide.md`

---

## Process Overview

```
[Session Starts]
       ↓
[Any Agent] reads ABC — the full foundation (A-agents, B-brain, C-core)
       ↓
[Any Agent] reads M-memory — current execution state
       ↓
[COO] checks git status + deployment state
       ↓
[COO] presents status report (Done / In Progress / Blocked / Next Up)
       ↓
[COO] recommends session plan
       ↓
[Any Agent] reads task-specific files before starting work
       ↓
[Work Begins — using T-tools to create O-output]
       ↓
[After work] Run the ABC-TOM Loop: update M-memory → promote strong patterns to ABC
```

---

## Step 1: Read ABC — The Foundation

### What Every Agent Does (MANDATORY)

Before doing ANY work, read the foundation. **ABC is who you are.**

**A — Agents (your team):**
- `A-agents/orchestrator-agent.md` — How agents collaborate
- Your agent-specific `.md` in `A-agents/` — your role, tools, responsibilities

**B — Brain (domain knowledge):**
- `B-brain/00-architecture/intelligence-stack.md` — 7-layer intelligence architecture
- `B-brain/01-cx-methodology/` — Journey stages, moments taxonomy, CX influencers
- `B-brain/02-market-research/competitive-landscape.md` — Competitive positioning

**C — Core (identity + architecture):**
- `C-core/project-brief.md` — What CX Mate is, who it's for
- `C-core/product-architecture.md` — 6-layer intelligence model, Critical Constraints
- `C-core/tech-stack.md` — Stack, patterns, data model
- `C-core/voice-dna.md` — How CX Mate sounds
- `C-core/icp-profile.md` — Who we build for

### Step 1b: Read M-memory — Execution Context

- `M-memory/sprint-log.md` — What's done, what's in progress, what's next
- `M-memory/decisions.md` — Why we built things the way we did (including Critical Constraints table)
- `M-memory/learning-log.md` — Patterns, gotchas, things we learned
- `M-memory/intel/` — Latest CX intelligence digests

### Why This Matters

The product evolves daily. An agent that skips reading ABC will:
- Assume wrong step counts (thinking wizard has 5 steps when it has 7-9)
- Use wrong color schemes (we've changed the palette multiple times)
- Invent field names that don't exist in the type system
- Build replacements for things that took months to develop
- Miss domain knowledge that makes output specific instead of generic

---

## Step 2: Check System State (COO)

The COO runs this automatically:

```
1. git status — uncommitted changes? unpushed commits?
2. git log --oneline -5 — what shipped recently?
3. Check deployment — is latest code deployed?
4. Check M-memory/cost-tracker.md — services near limits?
```

---

## Step 3: Present Status Report (COO)

### Format

```markdown
## COO Status Report — [Date]

### Shipped (Done)
- [x] Item 1
- [x] Item 2

### In Progress
- [ ] Item 3 — [status detail]

### Blocked
- [ ] Item 4 — Blocked by: [reason]. Proposed solution: [solution]

### Next Up (Prioritized)
1. [Highest impact task] — Why: [reason] — Agent: [who does it]
2. [Second task] — Why: [reason] — Agent: [who does it]

### Deployment Status
- Git: [clean / uncommitted / unpushed]
- Build: [passing / failing]
- Live: [deployed / local only]

### Recommended Session Plan
"This session, I recommend we [X] because [Y]. This gets us to [milestone]."
```

---

## Step 4: Load Task-Specific Context

Before starting any task, check the task-specific must-read table:

| If you're modifying... | You MUST also read... |
|------------------------|----------------------|
| **Onboarding (wizard or chat)** | `src/lib/ai/journey-prompt.ts`, `src/lib/validations/onboarding.ts`, `src/types/onboarding.ts` |
| **Journey generation prompt** | `src/types/onboarding.ts`, current onboarding component |
| **Recommendations / Playbook** | `src/lib/ai/recommendation-prompt.ts`, `src/lib/ai/journey-prompt.ts` |
| **Pricing / Billing** | `src/lib/freemius.ts`, `M-memory/decisions.md` |
| **Auth / Database** | `src/lib/supabase/` (all files), `src/middleware.ts` |
| **UI design / colors** | `src/app/globals.css`, `M-memory/learning-log.md` |

**If you skip this step, you WILL break something downstream.**

---

## Step 5: Sync Agents with Core Files

Run the agent sync check (from `T-tools/02-prompts/03-sync-agents-with-context.md`):

1. Confirm all agents' "Required Reading" sections point to current core files
2. Confirm agents understand the specific business context, not generic placeholders
3. Confirm agents know the current voice, ICP, and positioning
4. If any agent files have stale context or missing references, flag for update

**When to run the full sync:** Every session start (quick check), plus a deep sync whenever core files change significantly (positioning shift, new skill added, architecture update).

---

## Step 6: Begin Work — Use TOM

Only after Steps 1-5 are complete should any agent start building.

- Use **T-tools/** (skills, workflows, prompts) to drive the work
- Save deliverables to **O-output/**
- Log learnings to **M-memory/**

---

## Step 7: Close the ABC-TOM Loop (After Significant Work)

**This is what makes the system compound. Do not skip.**

### Update TOM (what happened):
- `M-memory/sprint-log.md` — task completed
- `M-memory/decisions.md` — decision made
- `M-memory/learning-log.md` — pattern discovered
- `O-output/` — deliverable created

### Promote to ABC (make the foundation stronger):
- Pattern strong enough to be a principle? → Promote to `C-core/`
- New research validated? → Promote to `B-brain/`
- Agent role evolved? → Update `A-agents/`

**The key:** TOM updates capture what happened. ABC promotions make the foundation stronger for next time. Both must happen every session.

---

## Quick Checklist

### Every Session
- [ ] Read ABC (A-agents, B-brain, C-core)
- [ ] Read M-memory (sprint-log, decisions, learning-log, intel)
- [ ] COO checked git + deployment status
- [ ] COO presented status report
- [ ] Agent sync check (ABC files → agents are grounded, not generic)
- [ ] Task-specific context loaded before starting work
- [ ] After work: M-memory updated
- [ ] After work: strong patterns promoted to ABC

### Weekly (Monday or first session)
- [ ] Cost tracker reviewed (Vercel, Supabase, Anthropic, Freemius, PostHog)
- [ ] Flag any service >80% of quota

---

## Anti-Patterns

- **Don't start coding without reading ABC.** Even if you "remember" from last session — read the files. They may have changed.
- **Don't skip the task-specific reads.** General context isn't enough. If you're touching onboarding, you MUST read `journey-prompt.ts`.
- **Don't assume git is clean.** Check before recommending what to work on.
- **Don't skip the status report.** Even if the user says "just do X" — the 30-second status check prevents 2 hours of rework.
- **Don't skip the loop.** Updating M-memory without promoting to ABC means the system never compounds.

---

## Tips for Success

1. **Speed comes from context, not from skipping context.** Reading ABC for 2 minutes saves 20 minutes of debugging wrong assumptions.
2. **The status report builds trust.** Anat can see at a glance what happened and what's next.
3. **The loop is non-negotiable.** Update TOM, promote to ABC. Every session. That's how week 10 is better than week 1.
4. **If something feels wrong, read more ABC files.** The answer is in the foundation, not in your assumptions.
