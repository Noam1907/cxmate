---
name: opportunity-assessment
description: >
  Opportunity Assessment generator (replaces traditional MRDs). Invoke when evaluating whether to
  pursue a market opportunity, analyzing competitive positioning, sizing a market, or when asked
  "should we build this?", "what's the market for...", "who are we competing with?", or "is this
  worth pursuing?". Uses Marty Cagan's Opportunity Assessment framework, competitive analysis,
  and market sizing — specific to the B2B CX/CS tools market.
allowed-tools: Read, Glob, Grep, WebSearch, Edit, Write
argument-hint: "[market opportunity, segment, or competitive question]"
---

# Opportunity Assessment — Market & Competitive Analysis

You evaluate whether CX Mate should pursue an opportunity. Not a 50-page MRD — a focused assessment that answers: **"Is this worth building?"**

Based on Marty Cagan's Product Opportunity Assessment (SVPG) — 10 questions that determine if an opportunity is worth pursuing, before any product work begins.

## Core Philosophy

An opportunity assessment is a **go/no-go gate**. It's fast (hours, not weeks), honest (label what you don't know), and decision-oriented (ends with a clear recommendation).

**Key shifts from traditional MRDs:**
- 10 questions, not 10 sections of analysis
- Decision-focused, not documentation-focused
- Honest about uncertainty — label assumptions explicitly
- Connected to product strategy, not standalone market research
- Web research is expected — use real data, not estimates where possible

## Before Writing

Read these files first:
- `C-core/project-brief.md` — Positioning, target customer, competitive stance
- `C-core/product-architecture.md` — Three-layer model, pricing tiers
- `M-memory/decisions.md` — Past market/product decisions

Then search the web for current market data, competitor pricing, and recent industry reports.

## The 10 Questions (Cagan Framework)

### 1. What problem would this solve? (Value)
- Describe the specific user problem in their words
- Who has this problem? (Role, company size, maturity stage)
- How painful is it? (Quantify: lost revenue, wasted time, missed opportunities)

### 2. For whom? (Target Market)
Define the target segment precisely:

| Dimension | Specification |
|-----------|--------------|
| Company size | [employees] |
| Revenue range | [ARR] |
| Maturity stage | [pre-customer / first customers / growing / scaling] |
| Vertical | [specific or horizontal] |
| Buyer role | [Founder / CRO / Head of CS] |
| Buying trigger | [What event makes them search for this?] |

### 3. How big is the opportunity? (Market Size)
- **TAM**: Total addressable market (all potential buyers globally)
- **SAM**: Serviceable addressable market (buyers we can reach and serve)
- **SOM**: Serviceable obtainable market (realistic Year 1 capture)
- **Methodology**: Show your math. Use bottom-up wherever possible.
- **Data sources**: Cite every source. Label estimates with `[ESTIMATE]`.

### 4. How will we measure success? (Metrics)

| Metric | 90-day target | 6-month target | How we measure |
|--------|--------------|----------------|----------------|
| [Primary metric] | | | |
| [Secondary metric] | | | |
| [Leading indicator] | | | |

### 5. What alternatives exist? (Competitive Landscape)
Map competitors on a 2x2:
- **X-axis**: Complexity (simple → enterprise)
- **Y-axis**: Scope (point solution → platform)

For each key competitor:

| Competitor | Category | Strength | Weakness | Price | Our angle |
|-----------|----------|----------|----------|-------|-----------|
| | | | | | |

CX Mate's competitive categories:

| Category | Examples | Why they win | Why they lose | Our play |
|----------|----------|-------------|--------------|----------|
| Enterprise CX | Qualtrics, Medallia | Deep analytics, trust | $50K+/yr, 6mo setup | On-ramp |
| CS Platforms | Gainsight, Totango | Health scoring, automation | Need data infra, $500+/mo | No-infra-needed |
| Journey Mapping | Smaply, UXPressia | Visual tools | No intelligence | "So what?" layer |
| CRM-adjacent | HubSpot Service Hub | Ecosystem | Not CX-native | CX-first |
| DIY | Spreadsheets, Notion | Free, flexible | No methodology | CCXP brain |

### 6. Why us? (Differentiation)
What's true about CX Mate that's NOT true about alternatives?
- [ ] Is this defensible? (Not easily copied)
- [ ] Is this valued? (Customers would pay more for it)
- [ ] Is this real? (Not aspirational — we can deliver it today)

### 7. Why now? (Timing)
What's changed in the market that makes this urgent?
- Market trends (cite recent data)
- Technology shifts (AI capabilities, platform changes)
- Competitive moves (new entrants, pricing changes)
- Customer behavior changes

### 8. How will we get this to market? (Go-to-Market)
- **Discovery channel**: Where do these buyers look for solutions?
- **Conversion path**: Free trial → paid? Demo → close? PLG?
- **Messaging hook**: One sentence that makes them click
- **Content angle**: What content would reach them?
- **Pricing**: Does current pricing work? Needs new tier?

### 9. What factors are critical to success? (Dependencies & Risks)

Label each:
- `[VALIDATED]` — We have evidence (data, user conversations, usage patterns)
- `[HYPOTHESIS]` — We believe this but haven't proven it
- `[RISK]` — This could invalidate the opportunity
- `[DEPENDENCY]` — This must be true/exist for us to succeed

### 10. Recommendation (Go / No-Go / Need More Data)

```
RECOMMENDATION: [BUILD / DON'T BUILD / NEEDS MORE RESEARCH]

Confidence: [HIGH / MEDIUM / LOW]

Rationale: [2-3 sentences explaining the decision]

If BUILD:
- Recommended appetite: [S / M / L / XL]
- Start with: [MVP scope — the smallest thing that tests the hypothesis]
- Defer: [What to explicitly leave for later]

If NEEDS MORE RESEARCH:
- Key unknowns: [What we need to learn]
- How to learn it: [Specific research actions]
- Timeline: [How long before we can decide]

If DON'T BUILD:
- Why not: [Clear reasoning]
- Revisit when: [What would change this decision]
```

## Quick Assessment (When Full Analysis is Overkill)

For smaller opportunities, use this compressed format:

```markdown
# Quick Assessment: [Opportunity]

**Problem**: [One sentence]
**Who**: [Persona + maturity stage]
**Size**: [Rough SOM estimate]
**Alternatives**: [Top 2-3 competitors and why they fall short]
**Our edge**: [One sentence differentiation]
**Appetite**: [S / M / L]
**Recommendation**: [BUILD / SKIP / RESEARCH] — [One sentence why]
**Assumptions**: [Top 3, labeled VALIDATED/HYPOTHESIS/RISK]
```

## Buyer Personas (CX Mate Reference)

When assessing who would buy:

```
PERSONA: [Title]
Company stage: [Size, funding, revenue]
Reports to: [Boss]
Measured on: [KPIs]
Daily frustration: [The pain]
Current workaround: [How they cope]
Buying trigger: [What makes them search]
Decision criteria: [Top 3 evaluation factors]
Budget authority: [Solo buyer or needs approval?]
Top objection: [Why they'd say no]
Willingness to pay: [Price range]
```

CX Mate's three primary personas:
1. **The Founder** (5-50 employees) — Every hat, no CX budget, needs instant value
2. **The Revenue Leader / CRO** (50-300 employees) — Pipeline to renewal, needs unified view
3. **The Head of CS** (30-150 employees) — Building the function, needs playbooks

## Market Segmentation (CX Mate Reference)

| Segment | Customers | Journey need | WTP | Our approach |
|---------|-----------|-------------|-----|--------------|
| Pre-customer | 0 | Sales only | $0-49/mo | Free tier, prove value |
| First customers | 1-10 | Systematize | $49-99/mo | Don't lose early wins |
| Growing | 11-50 | First playbook | $99-249/mo | Sweet spot |
| Scaling | 50-200+ | Optimize | $249-499/mo | Audit & uplevel |

## Writing Principles

- Use real data. Search the web. Cite sources.
- Label every assumption: `[VALIDATED]` / `[HYPOTHESIS]` / `[RISK]`
- Be honest about what you don't know
- Connect every insight to a decision: "So what? This means we should..."
- Write for a founder — clear, direct, no consulting jargon
- End with a clear recommendation, not a hedge

## Output Location

Save assessments to: `P-prds/opportunity-[name].md`
