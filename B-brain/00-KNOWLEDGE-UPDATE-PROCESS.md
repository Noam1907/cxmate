# CX Knowledge Base — Living Update Process

## Why This Matters

CX Mate's defensibility is the **structured CX knowledge underneath**, not the AI layer on top.
The 8 knowledge modules (`src/lib/cx-knowledge/`) are what make CX Mate a domain expert — not just
a generic AI wrapper. If those modules go stale, the platform becomes generic.

This document defines the process for keeping the knowledge base current.

---

## The 8 Knowledge Modules (What Needs Updating)

| File | What It Contains | Update Trigger |
|------|-----------------|----------------|
| `buyer-decision-cycle.ts` | B2B buying psychology, decision stages, price relevance | New B2B buying research, pipeline data |
| `customer-lifecycle-science.ts` | Lifecycle phases, anti-patterns, signals | New retention/churn research |
| `failure-patterns.ts` | What goes wrong at each stage, fixes | New failure mode research, user interviews |
| `success-patterns.ts` | What works at each stage, templates | New success case studies, customer data |
| `cx-tools/measurement-tools.ts` | NPS/CSAT/CES/event trigger guidance | New measurement benchmarks, tool updates |
| `impact-models/benchmarks.ts` | Revenue impact percentages by vertical | New ROI studies, industry reports |
| `best-practice-foundations.ts` | Stage guidance, what to do now vs. later | New CX maturity research |
| `enterprise-cx-maturity.ts` | Qualtrics/Gladly research data | Annual CX state reports |

---

## Update Cadence

| Cadence | What | Who |
|---------|------|-----|
| **Daily** | CX Intel Digest (`/cx-intel` skill) → saved to `M-memory/intel/YYYY-MM-DD.md` | CX Intel skill (automated) |
| **Weekly** | Scan inbox for promoted intel → add to B-brain topic folders | COO at session start |
| **Quarterly** | Full knowledge base review — update benchmarks, add new patterns, retire outdated ones | CX Architect agent |
| **On trigger** | New research report, major industry event, product interview reveals knowledge gap | CX Architect agent |

---

## The Update Flow

```
Signal arrives → INBOX → Review → Promote → Update code file
```

### Step 1 — Signal arrives
Sources:
- `/cx-intel` daily digest → `M-memory/intel/YYYY-MM-DD.md`
- New research report (Qualtrics, Forrester, Gartner, HBR, McKinsey)
- CX Mate user interview reveals assumption that was wrong
- New AI tool changes what's possible in a recommendation
- Competitor releases new feature that changes the benchmark

### Step 2 — Drop in INBOX
Copy the article/finding/insight to `B-brain/INBOX/` with a filename like:
`2026-03-forrester-cx-roi-report.md`

### Step 3 — Review (weekly)
At start of each session, COO scans `B-brain/INBOX/` and routes items:
- CX methodology → `B-brain/01-cx-methodology/`
- Market research → `B-brain/02-market-research/`
- Templates → `B-brain/03-templates/`
- Or: directly triggers a knowledge base update if actionable

### Step 4 — Promote to knowledge base (quarterly or on trigger)
CX Architect agent:
1. Reads the new research from B-brain
2. Identifies which `src/lib/cx-knowledge/` file it updates
3. Makes the code change (new benchmark, updated pattern, new tool guidance)
4. Documents the update in `M-memory/decisions.md`

---

## What "Updated" Looks Like in Practice

**Example 1: New NPS benchmark data**
> Qualtrics 2026 report: SaaS Growing stage NPS average moved from 32 to 28.
> → Update `benchmarks.ts` NPS good/excellent thresholds for SaaS vertical.

**Example 2: New failure pattern from user interview**
> Beta user says "we had no idea our champion changed until renewal" — 3 users said this.
> → Add "champion blind spot" as a new failure pattern in `failure-patterns.ts`.

**Example 3: New AI tool changes a recommendation**
> Intercom Fin now handles 70% of support questions autonomously (2026 data).
> → Update `measurement-tools.ts` post_interaction_survey to mention Fin's built-in CSAT.

**Example 4: New research validates/invalidates a benchmark**
> Study: Day 30 NPS is actually less predictive than Day 14 for PLG products.
> → Update `measurement-tools.ts` NPS frequency guidance for PLG companies.

---

## The Standard for What Gets Promoted

A finding gets promoted to the knowledge base if:
1. It contradicts or strengthens a current assumption
2. It gives a new specific number (benchmark, statistic, percentage)
3. It defines a new failure mode or success pattern we haven't modeled
4. It describes a new tool or approach that changes a recommendation

**Does NOT get promoted:**
- Generic think-pieces without data
- Marketing content (vendor bias)
- One anecdote (needs 3+ data points)

---

## Prioritization: Which Modules Matter Most

1. **`benchmarks.ts`** — Revenue impact numbers are what customers see in their CX Report. If these are wrong, trust breaks. Update whenever new ROI data exists.
2. **`measurement-tools.ts`** — What tools to deploy at what stage. NPS/CSAT/CES guidance is evergreen but thresholds and tool suggestions evolve.
3. **`failure-patterns.ts`** — Real-world failure modes. Keep updated from user interviews + research.
4. **`enterprise-cx-maturity.ts`** — Annual Qualtrics/Gladly report data. Update annually when new reports drop.
5. All others — Update when clearly wrong or when new research has strong signal.

---

## Ownership

- **Day-to-day:** COO (Shoval) routes INBOX items during session start
- **Knowledge base code changes:** CX Architect agent executes updates
- **Benchmark validation:** AI Engineer cross-checks against latest AI/product research
- **Sprint 5+:** Consider automating — CX Intel Digest → extract structured data → flag for review

---

*The knowledge base compounds. Every update makes CX Mate smarter — not just for new users, but for every re-analysis (Pulse) a subscriber runs.*
