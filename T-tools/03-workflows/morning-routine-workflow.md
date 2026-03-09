# Morning Routine Workflow

> The daily operational rhythm for CX Mate. Runs automatically at the start of every morning session. All agents aligned, all systems checked, all intel fresh.

---

## Process Overview

```
[Morning Session Opens]
       ↓
[ADHD Co-Pilot] Brain Dump Buffer — clear mental backlog before the day starts
       ↓
[COO] Session Start — read state, git status, status report
       ↓
[CX Intel] /cx-intel — daily market scan (articles, competitors, social)
       ↓
[COO] System Health Check — build, deployment, services
       ↓
[COO] Sprint Alignment — where are we vs. sprint goals?
       ↓
[COO + ADHD Co-Pilot] Morning Brief + Session Contract — plan the day, lock it in
       ↓
[Work Begins]
```

---

## Step 0: Brain Dump Buffer (ADHD Co-Pilot)

**Always run this first, before the status report.** The ADHD Co-Pilot clears the mental backlog before the day is set.

Invoke `/adhd` and run Session Open → Step 1 (Brain Dump Buffer):

> "Before we start — what's bouncing around in your head right now? Drop everything, even if it's unrelated. Quick list, no filter."

Capture what Anat says. Then:

> "Good — those are safe here. Now let's figure out what we're actually doing today."

*Why this comes first: unresolved thoughts compete for attention during the status report. Externalizing them takes 60 seconds and makes everything after it land better.*

**Output:** Mental backlog captured. Anat is present and ready to engage.

---

## Step 1: Session Start (COO)

Run the standard session start workflow (`session-start-workflow.md`):

- [ ] Read core state files (sprint-log, decisions, learning-log)
- [ ] Check git status — uncommitted changes? unpushed commits? active branches?
- [ ] Check recent commits — what shipped since last session?
- [ ] Present the standard COO Status Report

**Output:** Status report (Done / In Progress / Blocked / Next Up)

---

## Step 2: CX Intelligence Digest (CX Intel Agent)

Run `/cx-intel` — the daily market intelligence scan.

### What Gets Searched
- CX articles & research (HBR, Forrester, Gartner, CX Today, etc.)
- B2B CX and customer journey trends
- AI + CX for SMBs and startups
- Competitor news (Gainsight, Totango, ChurnZero, emerging players)
- CX Mate brand mentions
- Social signals (X/Twitter, LinkedIn, Reddit)

### Output
- Digest saved to `M-memory/intel/YYYY-MM-DD.md`
- TL;DR + top 3 bullets presented to Anat
- Any actionable signals flagged (competitor moves, messaging angles, feature ideas)

### Curation Standard
- Fresh (7 days preferred, 30 days max)
- Relevant to B2B CX, journey design, onboarding, churn, SMB/startup
- Opinionated — not a news dump, a curated brief

---

## Step 3: System Health Check (COO)

Verify the product is running and stable:

- [ ] **Build check:** `npx next build` passes clean (0 errors, 0 warnings)
- [ ] **Git hygiene:** any stale branches? uncommitted work from previous sessions?
- [ ] **Deployment:** is the latest code on `main` deployed to Vercel?
- [ ] **Health endpoint:** if deployed, hit `/api/health` and confirm services are green
- [ ] **Morning briefing email:** confirm cron is configured (5am UTC daily)

### If Something Is Broken
- Flag it immediately — broken production is always P0
- Fix before starting any new feature work
- Update sprint-log with the fix

**Output:** System status summary (healthy / degraded / action needed)

---

## Step 4: Sprint Alignment (COO)

Check progress against the current sprint goals:

- [ ] Review sprint task table — what % is complete?
- [ ] Identify the gap between promise and reality
- [ ] Check if any tasks are blocked and need escalation
- [ ] Check if priorities have shifted based on new intel or user feedback
- [ ] Identify the highest-impact task for today

### Decision Framework
1. **P0 blockers first** — anything broken or blocking others
2. **Demo-critical items** — if a demo is upcoming, prep for it
3. **Revenue-enabling work** — billing, gating, conversion flows
4. **Product completeness** — features that close gaps for beta users
5. **Polish & debt** — only if P0-P2 are clear

**Output:** Prioritized task list for the day

---

## Step 5: Morning Brief + Session Contract (COO + ADHD Co-Pilot)

Present a consolidated morning brief to Anat. Then immediately convert the Recommended Plan into an ADHD Co-Pilot Session Contract — so the day has a clear anchor from the start.

### Morning Brief Format

```markdown
## Good Morning — [Date]

### System Status
- Build: [passing/failing]
- Deployment: [up to date / behind by N commits]
- Services: [all green / issues noted]

### CX Intel Highlight
[TL;DR from today's intel digest — one sentence]
- [Top signal 1]
- [Top signal 2]
- [Top signal 3]

### Sprint Progress
- Sprint: [name] — [X]% complete
- Done since last session: [list]
- In progress: [list]
- Blocked: [list + reason]

### Today's Recommended Plan
1. [Task 1] — Why: [reason] — Agent: [who]
2. [Task 2] — Why: [reason] — Agent: [who]
3. [Task 3] — Why: [reason] — Agent: [who]

### Decisions Needed
- [Any decisions that need Anat's input before work can proceed]
```

### Session Contract (ADHD Co-Pilot — always follow the brief with this)

After presenting the brief and getting alignment, lock in the day with a Session Contract:

```
📋 SESSION CONTRACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Primary Goal:       [The #1 thing we're finishing today]
🧭 North Star Check:   [One sentence: how does this move the product forward?]
🔬 Exploration Budget: [Optional: X mins on side threads before we return]
🚧 No-Go Zone:         [What we're explicitly NOT touching today]
🛑 Abort Signal:       [What would tell us to stop or pivot?]
⏱ Time Budget:        [Optional: how long is this session?]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Ask Anat to confirm or adjust. This contract is the anchor for the whole session — the ADHD Co-Pilot and COO both reference it during Mid-Session Interventions.

---

## Weekly Add-Ons (Monday or First Session of the Week)

On the first session of each week, the morning routine adds:

- [ ] **Cost tracker review** — Vercel, Supabase, Anthropic, Freemius, PostHog usage vs limits
- [ ] **Sprint retrospective** — What went well? What didn't? What to improve?
- [ ] **Sprint planning** — If entering a new sprint, define goals and task table
- [ ] **CX knowledge base check** — Any intel from the past week worth promoting to `B-brain/`?

---

## How to Trigger

**Automatic:** When Anat starts a morning session with any of these:
- "morning" / "good morning" / "let's go" / "open session"
- "run the morning routine" / "daily routine" / "morning brief"

**Manual:** Any agent can say: "Running the morning routine workflow" and execute Steps 1-5.

**The COO drives the entire flow.** Other agents are invoked as needed (CX Intel for Step 2, specific dev agents if fixes are needed in Step 3).

---

## Anti-Patterns

- **Don't skip the brain dump.** It takes 60 seconds and dramatically improves the quality of everything after it. Skipping it means unresolved thoughts compete with the status report.
- **Don't skip the session contract.** The brief tells Anat what we're doing. The contract is her commitment to it. Without the contract, drift starts immediately.
- **Don't skip the intel scan.** Market context compounds — one day feels small, a month of daily scans builds strategic awareness.
- **Don't skip the health check.** A broken production site is invisible until a tester hits it.
- **Don't present intel without opinion.** The digest must say why each signal matters for CX Mate — otherwise it's just noise.
- **Don't start building before the brief.** The brief takes 5 minutes and prevents working on the wrong thing all day.
- **Don't batch morning routine with deep work.** Present the brief, get alignment, THEN start building.

---

## Tips for Success

1. **The morning routine should take 5-10 minutes.** It's a briefing, not a deep dive. Fast context, clear plan, go.
2. **Intel accumulates value.** Link to the intel archive (`M-memory/intel/`) when making product or messaging decisions — you have a growing evidence base.
3. **The brief builds trust.** Anat sees the system is healthy, the market is tracked, and the plan is clear. That's operational confidence.
4. **Update sprint-log at the end of each day.** Tomorrow's morning routine is only as good as today's log entries.
