# CX Mate Skills Index

Skills are reusable capabilities that agents can invoke. Each skill has two copies:

1. **`.claude/skills/`** — Claude Code native skills (invoked with `/skillname` in chat)
2. **`T-tools/01-skills/`** — Full skill documentation (referenced in agent files and workflows)

Both locations stay in sync. The `.claude/skills/` version is what Claude Code uses for slash commands. The `T-tools/01-skills/` version is the canonical reference for agents and workflows.

---

## All Skills

| Skill | Slash Command | Location | Description | Primary Agents |
|-------|--------------|----------|-------------|----------------|
| **Copywriter** | `/copywriter` | `T-tools/01-skills/copywriter-skill/` | In-app storyteller. Product copy, microcopy, CTAs, empty states, email templates. | Frontend Dev, Growth, Design, Brand Expert |
| **CX Expert** | `/cx-expert` | `T-tools/01-skills/cx-expert-skill/` | CX domain expertise. Journey review, methodology validation, CX strategy, journey building. | CX Architect, AI Engineer, Product Lead, QA Agent |
| **CX Intel** | `/cx-intel` | `T-tools/01-skills/cx-intel-skill/` | Daily CX Intelligence Digest. Fresh articles, trends, competitive signals. | CX Architect, Growth, COO |
| **MRD** | `/mrd` | `T-tools/01-skills/mrd-skill/` | Opportunity Assessment. Market sizing, competitive positioning, "should we build this?" | Product Lead, Growth, Strategist |
| **PRD** | `/prd` | `T-tools/01-skills/prd-skill/` | Modern Product Brief generator. Feature scoping, lean specs, pitch documents. | Product Lead, COO |
| **QA Gatekeeper** | `/qa-gatekeeper` | `T-tools/01-skills/qa-gatekeeper-skill/` | Market-readiness audit. 6-category pass/fail scorecard before any demo or release. | QA Agent, Tech Lead, COO, Beta Tester CEO |
| **Strategic Decision** | — | `T-tools/01-skills/strategic-decision-skill/` | Multi-perspective decision analysis framework. | Strategist, Devil's Advocate, Chief of Staff |

---

## Agent → Skill Map

| Agent | Skills Available |
|-------|----------------|
| **COO (Shoval)** | All skills — drives execution, coordinates team |
| **Product Lead** | `/prd`, `/mrd`, `/cx-expert` |
| **CX Architect** | `/cx-expert`, `/cx-intel` |
| **Tech Lead** | `/qa-gatekeeper` |
| **Frontend Dev** | `/copywriter` (for microcopy, empty states) |
| **Backend Dev** | — (no specific skills, uses workflows) |
| **AI Engineer** | `/cx-expert` (for prompt quality validation) |
| **QA Agent** | `/qa-gatekeeper`, `/cx-expert` |
| **QA Gatekeeper** | IS the `/qa-gatekeeper` skill |
| **Growth Agent** | `/copywriter`, `/cx-intel`, `/mrd` |
| **Design Agent** | `/copywriter` (for UX copy review) |
| **Brand Expert** | `/copywriter` |
| **DevOps Agent** | — (uses deployment workflows) |
| **Strategist** | `/mrd`, strategic-decision-skill |
| **Devil's Advocate** | strategic-decision-skill |
| **Chief of Staff** | strategic-decision-skill |
| **Beta Tester CEO** | `/qa-gatekeeper` (post-test validation) |

---

## Workflows That Use Skills

| Workflow | Skills Used |
|----------|------------|
| `feature-development-workflow.md` | `/prd`, `/mrd`, `/cx-expert`, `/copywriter`, `/qa-gatekeeper` |
| `strategic-decision-workflow.md` | strategic-decision-skill |
| `session-start-workflow.md` | — (process workflow, no skills) |
| `morning-routine-workflow.md` | `/cx-intel`, session-start-workflow (composes both + system health + sprint alignment) |
| `context-integrity-workflow.md` | `/qa-gatekeeper` (Category 6 audit) |
