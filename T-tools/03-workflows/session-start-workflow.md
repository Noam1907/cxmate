# Session Start Workflow

> How every CX Mate session begins. Every agent, every time. No exceptions.

---

## Process Overview

```
[Session Starts]
       ↓
[Any Agent] reads core state files (memory, decisions, learning log)
       ↓
[Any Agent] checks git status + deployment state
       ↓
[COO] presents status report (Done / In Progress / Blocked / Next Up)
       ↓
[COO] recommends session plan
       ↓
[Any Agent] reads task-specific files before starting work
       ↓
[Work Begins] — with full context loaded
```

---

## Step 1: Read the State

### What Every Agent Does (MANDATORY)

Before doing ANY work, read these files in this order:

**Tier 1 — Context (read FIRST):**
1. `C-core/project-brief.md` — What CX Mate is, who it's for
2. `C-core/product-architecture.md` — 6-layer intelligence model, Critical Constraints
3. `C-core/tech-stack.md` — Stack, patterns, data model

**Tier 2 — Execution context:**
4. `M-memory/sprint-log.md` — What's done, what's in progress, what's next
5. `M-memory/decisions.md` — Why we built things the way we did (including Critical Constraints table)
6. `M-memory/learning-log.md` — Patterns, gotchas, things we learned

**Tier 3 — Your role:**
7. Your agent-specific `.md` in `A-agents/` — your role, tools, responsibilities, skills

### Why This Matters

The product evolves daily. An agent that skips reading will:
- Assume wrong step counts (thinking wizard has 5 steps when it has 7-9)
- Use wrong color schemes (we've changed the palette multiple times)
- Invent field names that don't exist in the type system
- Build replacements for things that took months to develop

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

## Step 5: Begin Work

Only after Steps 1-4 are complete should any agent start building, testing, or modifying code.

---

## Quick Checklist

### Every Session
- [ ] Read core files (project-brief, product-architecture, tech-stack)
- [ ] Read memory files (sprint-log, decisions, learning-log)
- [ ] Read your agent file
- [ ] COO checked git + deployment status
- [ ] COO presented status report
- [ ] Task-specific context loaded before starting work

### Weekly (Monday or first session)
- [ ] Cost tracker reviewed (Vercel, Supabase, Anthropic, Freemius, PostHog)
- [ ] Flag any service >80% of quota

---

## Anti-Patterns

- **Don't start coding without reading.** Even if you "remember" from last session — read the files. They may have changed.
- **Don't skip the task-specific reads.** General context isn't enough. If you're touching onboarding, you MUST read `journey-prompt.ts`.
- **Don't assume git is clean.** Check before recommending what to work on.
- **Don't skip the status report.** Even if the user says "just do X" — the 30-second status check prevents 2 hours of rework.

---

## Tips for Success

1. **Speed comes from context, not from skipping context.** Reading for 2 minutes saves 20 minutes of debugging wrong assumptions.
2. **The status report builds trust.** Anat can see at a glance what happened and what's next.
3. **Update the state at session end.** The Loop (sprint-log, decisions, learning-log) keeps the next session fast.
4. **If something feels wrong, read more files.** The answer is in the codebase, not in your assumptions.
