# CX Mate — Monetization Strategy
*Decided: 2026-03-02 | Sources: Internal team + ChatGPT + Gemini cross-validation*

---

## Strategic Foundation

**Core thesis:** CX is a discipline, not a snapshot. The free tier earns trust by showing full value immediately. Paid tiers earn retention by making improvement visible and provable over time.

**The fundamental problem we're solving in monetization:**
CX impact is notoriously hard to prove. Companies invest in CX then can't answer "did it work?" CX Mate solves this by:
1. Capturing the baseline at onboarding (the "before")
2. Tracking what changes over time (the "after")
3. Connecting actions to benchmarked outcomes (the "proof")

---

## Tier Structure (Locked)

| Tier | Price | Core Unlock | Upgrade Trigger |
|------|-------|-------------|-----------------|
| **Free** | $0 | Full one-time run (journey + CX report + playbook) + NotebookLM export | "I want to come back and track progress" |
| **Starter** | $79/mo or $149 one-time | Save + return · Progress tracking · Revenue Protected counter · Monthly CX Score · Evidence Wall | "I want to see if my CX is improving" |
| **Pro** | $199/mo | Monthly Pulse delta · Tech stack integrations (HubSpot, Intercom) · Competitive CX monitoring · CX Simulations · AI stack recommendations | "I want real data, not estimates / what are competitors doing?" |
| **Premium** | $1,200/year | Board Deck generator · Multi-seat · QBR reports · CRM write-back · CX Mate as MCP server | "I need to present this to my board / whole team needs this" |

**Note on Starter:** Offer BOTH monthly ($79/mo) and one-time ($149) options. Answers Gemini's "inertia" insight — some buyers want to "unlock" not "rent". Track which option beta users prefer.

---

## The Impact Proof Architecture

### Why This Is The Core Retention Mechanic

CX Mate has something no competitor has: it captures the BEFORE state. Every user who completes onboarding generates a timestamped baseline (journey risks, revenue exposure, playbook priorities). This is what makes tracking possible.

### Layer 1 — Proxy Impact (Free + Starter, no integrations needed)
When a playbook item is completed, CX Mate maps it to benchmark impact:

| Playbook Item | Benchmark | What CX Mate Shows |
|---------------|-----------|-------------------|
| Add in-app onboarding guidance | Reduces activation churn 15–25% | "Est. $12K churn risk reduced" |
| Proactive Day 30 check-in | Increases renewal likelihood 18% | "Est. $8K renewal protection" |
| Reduce time-to-first-value | Increases 90-day retention 22% | "Est. $15K annual improvement" |

**Deliverable: "Revenue Protected" counter on Dashboard** — starts $0, grows as playbook items completed, benchmarked transparently.

### Layer 2 — Pulse Delta (Starter subscription retention hook)
Each monthly re-run is a comparison, not a refresh:
- CX Score this month vs last month
- Revenue at risk: was $104K → now $81K (after 2 playbook items completed)
- Which stages improved, which need focus

### Layer 3 — Real Data Validation (Pro unlock)
HubSpot/Intercom integration validates whether benchmark estimates held:
- "Estimate was $40K churn risk reduction"
- "Actual HubSpot data: 90-day churn improved 18% → 12% = ~$31K protected"

---

## The CX Score

**The single number that makes CX reportable to leadership.**

- Scale: 0–100
- Updates: monthly with each Pulse
- Breakdown: by journey stage (Onboarding / Activation / Renewal / Expansion)
- Benchmark: against vertical + maturity peers ("SaaS Growing stage avg: 54. You: 61 ✓")
- Trend: shown as a line chart over time

Why it matters:
- Founders can tell investors: "Our CX Score went from 48 to 61 in Q1"
- Board-friendly — no CX jargon needed
- Creates clear North Star for the team
- Compounds over time — longer subscription = richer trend line
- Makes monthly subscription obviously worth $79: "I pay to track and improve this number"

---

## NotebookLM as a Free Tier Feature (Not Premium)

**Decision: NotebookLM export is a FREE tier feature — it amplifies the free experience.**

Rationale:
- Every free user who exports to NotebookLM gets MORE value from CX Mate immediately
- They create infographics, decks, and summaries from their CX data in minutes
- They SHARE those outputs — LinkedIn posts, investor updates, team wikis
- Shared outputs = CX Mate brand exposure = new users
- This is a growth mechanic, not a premium unlock

**The flow:**
1. User finishes CX Report
2. "Open in NotebookLM" button (alongside Export PDF)
3. CX Mate exports structured markdown: journey stages + CX report + playbook
4. NotebookLM opens with the document ready
5. User can ask: "Create a 5-slide deck", "Make an infographic of my top risks", "Summarize for my board"

**Build complexity:** Low (2 days). NotebookLM accepts document uploads. Export structured markdown → open NotebookLM URL.

---

## Integration Roadmap

### Data IN (Replace Estimates with Reality)
| Integration | What It Adds | Tier | Timeline |
|-------------|-------------|------|----------|
| HubSpot | Real deal size, conversion, churn | Pro | Sprint 6 |
| Intercom | Support volume, CSAT, ticket themes | Pro | Sprint 6 |
| Mixpanel | Product adoption, feature usage | Pro | Sprint 7 |

### Intelligence OUT (Push CX Mate Everywhere)
| Destination | What Gets Sent | Tier | Timeline |
|-------------|---------------|------|----------|
| Email digest | Daily CX Pulse + nudges | Free (already built ✅) | Done |
| NotebookLM | Full CX report as structured doc | Free | Sprint 5 |
| Slack | Daily nudges, playbook reminders | Starter | Sprint 5 |
| Notion | Journey map + playbook as living page | Starter | Sprint 6 |
| Board Deck | Auto-generated slides | Premium | Sprint 7 |

### CX Mate as AI Platform
| Integration | What It Enables | Tier | Timeline |
|-------------|----------------|------|----------|
| ChatGPT Action | CX Mate data as GPT context | Pro | Sprint 7 |
| CX Mate MCP Server | Any AI tool can query journey/report/playbook | Premium | Sprint 8 |

---

## Beta Launch Plan (Sprint 4)

**Wire Stripe for Starter only.** Two buttons on the pricing page:
- "Start monthly — $79/mo" → Stripe monthly subscription
- "Get full access — $149 once" → Stripe one-time payment

Both unlock the same Starter features. Track which converts better in the first 30 days to decide whether to keep both or double down on one model.

---

## Competitive Positioning

- **Against one-time report tools:** "You got the map. We help you prove it worked."
- **Against enterprise tools (Gainsight, Qualtrics):** "All the intelligence, none of the implementation team required."
- **Against generic AI tools:** "Not ChatGPT with a CX prompt. CCXP methodology, your data, revenue language."
- **The CX Score moat:** No competitor tracks a single CX health score over time at this price point.

---

## Key Sources
- Internal team analysis (Claude COO session)
- ChatGPT strategic review: recommended $49–$199/mo Pro tier, "Board Mode" as premium, "AI CX Co-Founder" positioning
- Gemini strategic review: "Bridge Strategy" (one-time hook → subscription), "inertia is the real competitor", insurance policy framing ($200/mo vs $500K at risk)
- Cross-validation consensus: free tier is right, revenue quantification drives purchase, CX Score is the retention anchor
