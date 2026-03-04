# Strategic Decision Workflow

> A collaborative workflow between the Strategist, Devil's Advocate, Chief of Staff, and Gatekeeper for creating a multi-perspective strategic decision brief.

---

## Process Overview

```
[You] describe the decision and options
          ↓
[Strategist] analyzes options from business/growth perspective
          ↓
[Devil's Advocate] challenges assumptions and surfaces risks
          ↓
[Chief of Staff] synthesizes into one clear decision brief
          ↓
[Gatekeeper] reviews for quality and completeness
          ↓
[Chief of Staff] revises (if needed)
          ↓
[Gatekeeper] final approval
          ↓
[You] use the brief to make your decision
```

---

## Step 1: Preparation

### Before Starting

All agents must read:
- `C-core/project-brief.md` - What we do and who we serve
- `C-core/voice-dna.md` - How the brand communicates
- `C-core/icp-profile.md` - Who the target audience is
- `M-memory/decisions.md` - Past strategic choices
- `M-memory/learning-log.md` - What we learned from previous rounds

### Project Setup

Create a new folder in `O-output/` with a clear name:
```
O-output/
└── 01-strategy-[decision-topic]/
    ├── strategist-analysis.md       ← Strategist's perspective
    ├── devils-advocate-review.md    ← Devil's Advocate's challenges
    ├── chief-of-staff-brief.md      ← Synthesized decision brief
    ├── gatekeeper-review.md         ← Quality review
    └── final-decision-brief.md      ← Approved final version
```

---

## Step 2: Strategist Analyzes

### What the Strategist Does

1. **Reads C-core documents** - Understands the business context
2. **Reads `T-tools/01-skills/strategic-decision-skill/`** - Learns the decision brief format
3. **Reads `A-agents/strategist-agent.md`** - Understands the role
4. **Analyzes each option** - Evaluates from business/growth perspective with numbers
5. **Delivers a clear recommendation** - Takes a stand, doesn't hedge

### File Format: `strategist-analysis.md`

```markdown
# Strategic Analysis: [Decision Topic]

**Date:** [Date]
**Version:** v1

---

## Recommendation

[Clear recommendation in 1-2 sentences]

---

## Options Evaluated

### Option A: [Name]
- **What:** [Description]
- **Upside:** [Best case with numbers]
- **Downside:** [Worst case with numbers]
- **Resource cost:** [Time, money, people]
- **Timeline:** [When we'd see results]

### Option B: [Name]
[Same structure]

### Option C: Do Nothing
[Status quo trajectory and cost of inaction]

---

## Key Assumptions

1. [Assumption] — [What happens if wrong]
2. [Assumption] — [What happens if wrong]

---

## Strategist Notes

### Why I Recommend This
- [Reasoning]

### Questions for the Devil's Advocate
- [What should they challenge?]
```

---

## Step 3: Devil's Advocate Challenges

### What the Devil's Advocate Does

1. **Reads the Strategist's analysis** - Understands what's being proposed
2. **Reads `A-agents/devils-advocate-agent.md`** - Understands the role
3. **Tests every major assumption** - What if the opposite is true?
4. **Identifies underweighted risks** - What could go wrong that the Strategist missed?
5. **Proposes a missing option** - The alternative nobody mentioned
6. **Runs a pre-mortem** - If this fails in 12 months, what went wrong?

### File Format: `devils-advocate-review.md`

```markdown
# Devil's Advocate Review: [Decision Topic]

**Date:** [Date]
**Reviewing:** Strategist's analysis

---

## Assumption Stress-Test

| # | Assumption | Risk If Wrong | Confidence |
|---|-----------|---------------|-----------|
| 1 | [Assumption] | [Impact] | Low/Med/High |

---

## Risks Underweighted

1. **[Risk]** — [Why it's bigger than the analysis suggests]

---

## The Missing Option

[Alternative approach not considered]

---

## Pre-Mortem: If This Fails

[12-month failure scenario]

---

## The Hard Question

[The question the decision-maker needs to answer honestly]

---

## Summary

**Where I agree:** [Points of consensus]
**Where I see more risk:** [Points of disagreement]
**Biggest concern:** [One sentence]
```

---

## Step 4: Chief of Staff Synthesizes

### What the Chief of Staff Does

1. **Reads both the Strategist and Devil's Advocate** - Understands both perspectives
2. **Reads `A-agents/chief-of-staff-agent.md`** - Understands the role
3. **Reads `T-tools/01-skills/strategic-decision-skill/`** - Uses the decision brief format
4. **Resolves conflicts** - Where they agree = high confidence. Where they disagree = CEO judgment needed.
5. **Produces the decision brief** - One page, scannable in 2 minutes

### File Format: `chief-of-staff-brief.md`

```markdown
# Decision Brief: [Topic]

**Date:** [Date]
**Prepared by:** Strategist, Devil's Advocate, Chief of Staff

---

## Decision Required
[One sentence]

## Context
[2-3 sentences]

## Options
[Each with pros, cons, numbers, confidence]

## Risk Assessment
[Table: risk, likelihood, impact, mitigation]

## Where Advisors Agree / Disagree
[Consensus and tensions]

## Recommendation
[Clear recommendation with confidence level]

## What We Don't Know
[Explicit uncertainties]

## Next Steps
[Who, what, by when]
```

---

## Step 5: Gatekeeper Reviews

### What the Gatekeeper Does

1. **Reads the decision brief** - Is the decision clearly framed?
2. **Checks completeness** - All options explored? Risks quantified?
3. **Checks quality** - Numbers real? Recommendation justified?
4. **Decision** - Approved / Revisions Needed / Escalate

### File Format: `gatekeeper-review.md`

```markdown
# Gatekeeper Review: [Decision Topic]

**Date:** [Date]
**Version reviewed:** v1

---

## Status: [APPROVED / REVISIONS NEEDED / ESCALATE]

## What Works Well
- [Strength]

## What Needs Improvement
1. **[Issue]** - [How to fix]

## Next Step
[What the Chief of Staff should do now]
```

---

## Step 6: Revision (If Needed)

If the Gatekeeper requested revisions:

1. **Chief of Staff reads the notes** - Understands what to fix
2. **Updates `chief-of-staff-brief.md`** - Bumps version to v2
3. **Gatekeeper reviews again** - Updates `gatekeeper-review.md`

---

## Step 7: Final Version

When the Gatekeeper approves, the Chief of Staff creates `final-decision-brief.md` — the approved version ready for the decision-maker.

---

## Step 8: Update Learning Log

After the process is complete, update `M-memory/learning-log.md`:

```markdown
## [Date] - Strategic Decision: [Topic]

### What Worked
- [Insight about the process]

### What We Learned
- [Lesson for next time]
```

And update `M-memory/decisions.md`:

```markdown
## [Date] - [Decision Topic]

**Decision:** [What was decided]
**Why:** [Core reasoning]
**What we expected:** [Predicted outcome]
**Review date:** [When to check if it worked]
```

---

## Quick Checklist

### Before Starting
- [ ] New folder created in O-output
- [ ] All agents read C-core documents
- [ ] Decision and options are clear

### Strategist
- [ ] Read business context
- [ ] Analyzed all options with numbers
- [ ] Clear recommendation stated
- [ ] Saved to `strategist-analysis.md`

### Devil's Advocate
- [ ] Read Strategist's full analysis
- [ ] Challenged specific assumptions
- [ ] Proposed missing option
- [ ] Ran pre-mortem
- [ ] Saved to `devils-advocate-review.md`

### Chief of Staff
- [ ] Read both perspectives
- [ ] Resolved conflicts (not just listed them)
- [ ] Clear recommendation with confidence
- [ ] Next steps are actionable
- [ ] Saved to `chief-of-staff-brief.md`

### Gatekeeper
- [ ] Decision clearly framed
- [ ] All options have numbers
- [ ] Recommendation justified
- [ ] Saved to `gatekeeper-review.md`

### Wrap-Up
- [ ] Final version saved to `final-decision-brief.md`
- [ ] Learning log updated
- [ ] Decisions log updated
- [ ] Ready to act on

---

## Tips for Success

1. **The Strategist takes a stand** - Don't hedge. Recommend something.
2. **The Devil's Advocate is constructive** - Challenge, don't destroy.
3. **The Chief of Staff resolves** - Synthesize, don't summarize.
4. **The Gatekeeper checks rigor** - Is this good enough to decide on?
5. **Everyone uses numbers** - "Significant" is not a number.

---

*This workflow shows how a team of agents can debate, challenge, and synthesize — producing better decisions than any single perspective.*

---

> **© Tom Even**
> Workshops & future dates: [www.getagents.today](https://www.getagents.today)
> Newsletter: [www.agentsandme.com](https://www.agentsandme.com)
