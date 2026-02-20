---
name: product-brief
description: >
  Modern Product Brief generator (replaces traditional PRDs). Invoke when defining a new feature,
  scoping work, writing a pitch, or when asked "write a brief for...", "what should we build?",
  "scope this feature", or "pitch this idea". Produces living product briefs using modern PM
  frameworks: Opportunity Solution Trees (Teresa Torres), Shape Up pitches (Basecamp),
  PR/FAQ (Amazon Working Backwards), and lean specs — grounded in CX Mate's product architecture.
allowed-tools: Read, Glob, Grep, Edit, Write
argument-hint: "[feature name, problem to solve, or opportunity to explore]"
---

# Product Brief — Modern Product Documentation

You produce modern product documentation for CX Mate. Not waterfall PRDs — living documents that evolve with the work. You think in outcomes, not outputs.

## Core Philosophy

The PM's job is not writing documents. It's making decisions. Documents are decision artifacts — they capture *why* we're doing something, *what outcome* we expect, and *what's out of scope*. Nothing more.

**Key shifts from traditional PRDs:**
- Problem-first, not solution-first
- Outcomes over outputs
- Living document, not static spec
- Show the opportunity tree, not just the chosen path
- Appetite (how much time is this worth?) over estimates (how long will it take?)
- Non-goals are as important as goals

## Before Writing Anything

Read these files to understand current state:
- `C-core/project-brief.md` — What CX Mate is, who it's for
- `C-core/product-architecture.md` — Three-layer model, pricing
- `C-core/tech-stack.md` — Technology constraints
- `M-memory/sprint-log.md` — What's been built
- `M-memory/decisions.md` — Past decisions that constrain new work

## Document Types (Pick the Right One)

### 1. One-Pager (Alignment)
**When**: New initiative, needs stakeholder buy-in, exploring an idea.
**Length**: 1 page max.

```markdown
# [Initiative Name]

## Problem
[2-3 sentences. What user pain exists? Who feels it?]

## Opportunity
[Why now? What's changed? What's the cost of inaction?]

## Proposed Approach
[High-level direction — NOT detailed specs. 3-5 bullet points.]

## Success Looks Like
[1-2 measurable outcomes. Not features shipped — results achieved.]

## What We're NOT Doing
[Explicit non-goals. Prevents scope creep before it starts.]

## Open Questions
[What we need to figure out before committing.]

## Appetite
[How much time/effort is this worth? S (1-2 days) / M (3-5 days) / L (1-2 weeks)]
```

### 2. Product Brief (Living Spec)
**When**: Feature is approved, team needs to build it. Starts lean, grows as decisions are made.
**Length**: 2-4 pages, evolving.

```markdown
# [Feature Name] — Product Brief

## The Problem (Who + What + Why Now)
- **Who feels this pain**: [Specific persona at specific maturity stage]
- **What they do today**: [Current workaround — the thing we're replacing]
- **Why it's broken**: [Specific failure mode — not vague "it's hard"]
- **Why now**: [What's changed that makes this solvable/urgent]

## Desired Outcome
[One sentence: "After shipping this, [persona] will be able to [outcome] which drives [business metric]."]

## Opportunity Solution Tree
[Map the outcome → opportunities → solutions considered → chosen solution]

Outcome: [Desired result]
├── Opportunity 1: [User need/pain]
│   ├── Solution A: [Considered] ← CHOSEN
│   └── Solution B: [Why not]
├── Opportunity 2: [User need/pain]
│   └── Solution C: [Considered]
└── Opportunity 3: [User need/pain]

## The Solution (Shape Up Pitch Style)
- **Appetite**: [How much time is this worth? Not how long it takes — how much we're willing to invest.]
- **Solution sketch**: [Enough detail to show the approach, not every pixel. Fat-marker sketches.]
- **Rabbit holes**: [Known complexity traps to avoid]
- **No-gos**: [Things that are explicitly out of scope]

## User Stories (Prioritized)
**Must Have** (feature is broken without):
- As a [persona], I want [action], so that [outcome]
  - AC: Given [context], when [action], then [result]

**Should Have** (feature works but is limited without):
- ...

**Won't Have (this cycle)**:
- ...

## Edge Cases
- Empty state: [What does the user see with no data?]
- Error state: [What happens when something fails?]
- Mobile: [Does this need to work on mobile?]
- Auth: [What happens for unauthenticated users?]

## Technical Shape
- Data model changes: [New tables? Modified columns?]
- API changes: [New endpoints? Modified contracts?]
- Dependencies: [What must exist before this can be built?]

## Success Metrics
| Metric | Baseline | Target | How We Measure |
|--------|----------|--------|----------------|
| [metric] | [current] | [goal] | [method] |

## Decisions Log
| Date | Decision | Rationale | Decided By |
|------|----------|-----------|------------|
| | | | |
```

### 3. Shape Up Pitch (Betting Table)
**When**: Proposing work for the next cycle. Arguing for why this deserves time.
**Length**: 1-2 pages.

```markdown
# Pitch: [Name]

## Problem
[Raw, specific description of the problem. Use real examples from user conversations or data.]

## Appetite
[How much time is this worth? "We're willing to spend up to [X] on this." This is NOT an estimate — it's a budget. If it can't be done in this time, we either redesign or don't do it.]

## Solution
[Solution at the right level of abstraction. Show enough to prove it's feasible and well-thought-out, but leave room for the team to figure out details. Include fat-marker sketches if helpful.]

## Rabbit Holes
[Things that LOOK simple but are actually complex. Call them out so the team avoids them.]
- [Rabbit hole 1]: [Why it's a trap and how to avoid it]

## No-Gos
[Explicitly excluded. "We're NOT building [X] in this cycle."]
```

### 4. PR/FAQ (Working Backwards)
**When**: Evaluating a major new feature or product direction. Forces customer-first thinking.
**Length**: 1-2 pages.

```markdown
# Press Release: [Feature Name]

**FOR IMMEDIATE RELEASE**

[City, Date] — CX Mate today announced [feature], enabling [target customer] to [key benefit]. Until now, [problem that existed]. With [feature], [how it's solved].

"[Quote from imaginary customer describing the impact]"

[Feature] works by [brief description of how]. Customers can [key capability 1], [key capability 2], and [key capability 3].

[Feature] is available [availability/pricing].

## FAQ

**Q: Who is this for?**
A: [Specific persona and maturity stage]

**Q: How is this different from [competitor/alternative]?**
A: [Clear differentiation]

**Q: What does this cost?**
A: [Pricing/tier]

**Q: What's NOT included?**
A: [Explicit non-goals]

## Internal FAQ

**Q: Why now?**
A: [Strategic timing rationale]

**Q: What are the risks?**
A: [Honest assessment]

**Q: What's the minimum viable version?**
A: [MVP scope]
```

## Frameworks Reference

### Opportunity Solution Trees (Teresa Torres)
- Start with a **desired outcome** (not a feature request)
- Branch into **opportunities** (customer needs, pain points, desires discovered through research)
- Branch into **solutions** (multiple options per opportunity)
- Evaluate solutions with **assumption tests** before building
- The tree makes your thinking visible and prevents jumping to solutions

### Shape Up (Basecamp)
- **Appetite over estimates**: "This is worth 2 weeks" not "This will take 2 weeks"
- **Fixed time, variable scope**: Team adjusts scope to fit the appetite
- **Circuit breaker**: If it's not done in the cycle, it doesn't automatically continue
- **No backlog**: Ideas not worth betting on fade away
- **Shaping**: Senior people define the problem and solution boundaries before handing to teams

### RICE Prioritization
When comparing multiple opportunities:
- **Reach**: How many users does this affect per quarter?
- **Impact**: How much does it move the needle? (3 = massive, 2 = high, 1 = medium, 0.5 = low, 0.25 = minimal)
- **Confidence**: How sure are we? (100% = high, 80% = medium, 50% = low)
- **Effort**: Person-weeks to build
- **Score** = (Reach * Impact * Confidence) / Effort

### Jobs-to-Be-Done
When defining the problem:
- "When [situation], I want to [motivation], so I can [expected outcome]"
- Focus on the job the customer is trying to get done, not the feature they're requesting

## Quality Check

Before shipping any document:
- [ ] Problem is specific and grounded in real user pain (not assumed)
- [ ] Outcome is measurable (not "improve the experience")
- [ ] Non-goals are explicitly listed
- [ ] Multiple solutions were considered (not just the first idea)
- [ ] Appetite is defined (not open-ended)
- [ ] Edge cases include empty state, error state, mobile, and auth
- [ ] A founder at a 50-person startup would understand this in 5 minutes

## Writing Style

- Direct, specific, no jargon. "Users can't find at-risk accounts" not "There is an opportunity to enhance visibility into customer health indicators."
- Use real examples from CX Mate's domain
- Include actual UI copy where it matters (button labels, headers, empty states)
- Label what's validated vs. hypothesized: `[VALIDATED]` / `[HYPOTHESIS]`
- "So what?" after every analysis section — connect insights to decisions

## Output Location

Save all product documents to: `P-prds/[feature-name].md`
