---
name: qa-gatekeeper
description: >
  Market-Readiness Gatekeeper for CX Mate. Invoke before any demo, release, or customer-facing
  milestone. Runs a comprehensive 5-category audit: (1) Data completeness — every onboarding field
  reaches Claude prompts and generated output is displayed in UI, (2) Flow integrity — no dead buttons,
  orphaned data, or broken transitions, (3) UX coherence — consistent design language, no placeholders,
  all states handled, (4) AI quality — JSON parsing works, prompt context is complete, output renders
  correctly, (5) Production readiness — build passes, no console errors, env vars configured.
  Reports a pass/fail scorecard with specific file references and fix instructions.
  Invoke when asked to "run the gatekeeper", "audit the app", "is this demo-ready?", "pre-release check",
  or "check if we can ship".
allowed-tools: Read, Glob, Grep, Bash, TodoWrite
argument-hint: "[full | data-flow | ux | ai-quality | production]"
---

# QA Gatekeeper Skill

Run the full market-readiness audit defined in `A-agents/qa-gatekeeper-agent.md`.

## How to Use

1. Read `A-agents/qa-gatekeeper-agent.md` — this is the full audit specification
2. Read the required files listed in that agent's "Required Reading" section
3. Run all 5 audit categories (or the one specified in the argument)
4. Output the scorecard + specific fixes for every FAIL

## Audit Categories (quick reference)

1. **Data Completeness** — every field collected → used in prompt → shown in UI
2. **Flow Integrity** — all paths work, no dead ends, errors handled
3. **UX Coherence** — consistent design, no placeholders, all states covered
4. **AI Quality** — JSON repair works, prompts complete, output renders
5. **Production Readiness** — build passes, no leaks, error boundaries present

## Output

```
╔══════════════════════════════════════════╗
║         CX MATE RELEASE SCORECARD       ║
╠══════════════════════════════════════════╣
║ 1. Data Completeness    ✅ PASS / ❌ FAIL ║
║ 2. Flow Integrity       ✅ PASS / ❌ FAIL ║
║ 3. UX Coherence         ✅ PASS / ❌ FAIL ║
║ 4. AI Quality           ✅ PASS / ❌ FAIL ║
║ 5. Production Readiness ✅ PASS / ❌ FAIL ║
╠══════════════════════════════════════════╣
║ VERDICT:  🚢 SHIP IT / 🚫 BLOCK        ║
╚══════════════════════════════════════════╝
```

For each FAIL: file path, problem, exact fix, severity (P0/P1/P2).

## When to Run

- Before any customer demo
- Before deploying a feature wave
- After significant prompt changes
- After adding/removing onboarding fields
- Weekly during active development
