# Demo Debrief — March 11, 2026

## Participants
1. **Jonathan Riftin** — Ex-Google, VC, Tabula, Bizabo, Optimove (CS leadership). Co-founded Windward (maritime). Currently exploring next move. Referred by his brother (who knows Shuval).
2. **Keren Shaked** — Certified CCXP, one of Israel's top CX experts. AKT/Qualtrics integrator. Long-time CX industry colleague.

---

## Demo 1: Jonathan Riftin — Key Takeaways

### What Landed Well
- Output quality and company-specific personalization impressed him
- Compared favorably to $2K+ market analysis reports
- Recognized the speed advantage (minutes vs weeks of consulting)

### Strategic Concerns
- **"No longevity"** — feels like a one-time report, not SaaS. No reason to come back.
- **Low barrier to entry** — the know-how/methodology isn't a defensible moat
- **Who's the buyer?** Questioned ownership in companies — CEO for small, CS/Ops for mid-size

### Strategic Suggestions
- **Consultant buyer ICP** — CX consultants, freelancers, consulting firms could be a stronger buyer than companies themselves. They use CX Mate as force-multiplier.
- **Hybrid model** — Anat + tool = consulting offering at 10x speed for fraction of the cost
- **Start with 3-5 companies** to validate, not 20
- **Sales enablement overlap** — product sits at intersection of CX and sales enablement
- Offered to test the product and give more feedback

### Follow-Up Actions
- [ ] Send Jonathan access link
- [ ] Check his LinkedIn for additional context
- [ ] Consider consultant ICP in strategic planning

---

## Demo 2: Keren Shaked — Key Takeaways

### What Landed Well
- Validated the market gap — companies pay $20-40K+ for similar output
- Took two actionable ideas just from looking at the Orca demo
- The ownership/responsibility assignment per action item is valuable
- Maritime-specific language generation without explicit input impressed her
- Generic stages are fine — Keren said most companies operate by standard stages, so generic is acceptable as a starting point

### The Shuval "Aha Moment" (KEY PROOF OF VALUE)
When Shuval (COO of Orca) ran the demo, the confrontation insights triggered a powerful reaction:
1. **First reaction:** "No, this is not right" — immediate rejection
2. **Two minutes later:** "Wait... maybe we're missing things because we're so stuck believing what we want to believe"
3. This is the CORE VALUE PROPOSITION — CX Mate challenges founder/leadership blind spots. People who are deep in their own company can't see what an outside perspective reveals.

This moment should be referenced in marketing, sales conversations, and the product itself. It's the "confrontation" working exactly as designed.

### Keren's Key Product Feedback

| Priority | Issue | Said By | Category |
|----------|-------|---------|----------|
| 🔴 CRITICAL | **"Why" missing** — recommendations need evidence (research, competitor data, benchmarks). Black box = no trust. Need to explain WHY this is the issue to create buy-in. | Keren | AI/Product |
| 🔴 CRITICAL | **Stated pain points must appear in output** — if user says "billing is a problem," the output MUST address billing. This is the #1 proof of personalization. | Keren | AI Quality |
| 🔴 CRITICAL | **Show WHERE user's input maps to output** — visual connection between what the user told us and where it shows up. This validates "this is YOUR analysis, not generic." | Keren | UX/Personalization |
| 🔴 HIGH | **Font size too small** — hard to read generated content | Anat (observed) | UX |
| 🔴 HIGH | **Titles not bolded** — headings don't stand out from body text | Anat (observed) | UX |
| 🔴 HIGH | **Can't correct competitors** — if AI gets them wrong, user is stuck | Anat (observed) | Onboarding UX |
| 🔴 HIGH | **Must-do vs Quick Wins broken** — not rendering correctly in playbook | Anat (known bug) | Bug |
| 🔴 HIGH | **Revenue impact numbers vanished** — data missing from CX report display | Anat (known bug) | Bug |
| 🔴 HIGH | **UI overwhelming** — too much information at once, needs progressive disclosure | Anat (observed) | UX |
| 🟡 MEDIUM | **Missing open text field** — "anything else you want to mention?" | Anat (observed) | Onboarding |
| 🟡 MEDIUM | **Need confirmation touchpoints** — "I understand X, confirm?" at key moments | Keren | Product |

### Strategic Insights from Keren
- The ongoing value play should be actionable outputs: scripts, templates, training materials
- Connect output to NotebookLM, decks for board presentations
- The confrontation/challenge element is THE differentiator — it makes people THINK
- The tool needs more dialogue — ask, confirm, then generate (creates trust)
- Stickiness can come from script generation, review of existing scripts, training material creation — these don't require system integrations

---

## Cross-Demo Strategic Themes

### 1. Personalization Proof (TOP PRIORITY — from Keren)
Two critical requirements that PROVE the output is personalized and not generic:
- **User's stated pain points MUST appear in the output.** If they said "billing" is a problem, the journey and playbook must address billing. Dropping it = the output feels generic.
- **Visual mapping between input → output.** Show the user "you told us X, here's where it appears." This is the difference between "smart AI" and "trusted advisor."

This is bigger than a UX fix — it's a fundamental personalization integrity requirement.

### 2. The "Why" Layer (from Keren)
Raw recommendations without evidence feel like a black box. Every insight needs:
- What competitor data supports this
- What CX research/benchmark backs this up
- Why THIS specific company should care
- Even a simple "we found that in your industry, X% of companies struggle with this" creates buy-in

Keren referenced her experience: when people don't understand the WHY behind a recommendation, they don't act on it. Even advanced churn-prediction tools fail if users don't trust the reasoning.

### 3. One-Time vs Ongoing (from Jonathan)
Jonathan's "no longevity" concern validates our deliverable-shaped pricing:
- Analysis ($149) = entry point, one-time
- Annual Retainer ($499/yr) = quarterly reports, progress tracking
- Connected (TBD/mo) = integrations, real-time alerts

The stickiness comes from: script generation, template updates, progress tracking, integration insights.

### 4. Consultant as Buyer (from Jonathan)
Jonathan surfaced a compelling new buyer persona: CX consultants who use CX Mate as a force-multiplier. Worth exploring alongside the direct-to-company motion.

### 5. UI Overwhelm (from Anat, observed in both demos)
The output is powerful but overwhelming. Needs:
- Better typography (font size, bold titles)
- Progressive disclosure
- Visual hierarchy
- Connection between stated problems and where they appear in output

---

## Immediate Action Items (Post-Demo Sprint)

### This Week (Quick Wins)
1. Fix font sizes across all output pages
2. Bold all section titles/headings
3. Make competitors editable in onboarding
4. Add "anything else?" open text field to onboarding
5. Fix Must-do vs Quick Wins rendering in playbook
6. Fix revenue impact display bug in CX report

### Next Sprint (High Impact)
7. **Personalization integrity:** Ensure ALL user-stated pain points appear in generated output (prompt engineering)
8. **Input → output mapping:** Visual indicators showing where user's input influenced the output
9. **"Why" evidence layer:** Add research citations, competitor references, benchmarks to recommendations
10. Add confirmation touchpoints in onboarding flow
11. Reduce overwhelm with progressive disclosure

### Strategic (Ongoing)
12. Build stickiness features: script generation, template creation
13. Connect to external tools (NotebookLM, slides export)
14. Explore consultant ICP angle
15. Validate with 3-5 more companies before scaling beta

---

## Notable Quotes & Moments

- **Shuval (Orca COO):** "No, this isn't right" → [2 min later] → "Wait, maybe we're so stuck believing what we want that we're missing things" — THE proof that confrontation works
- **Orca Director of CS:** Independently reviewed the output and said she already found two things they're not doing that she thinks are excellent
- **Jonathan:** "This feels like a report you buy once" — the longevity challenge
- **Keren:** "You need to explain the WHY — otherwise it's a black box and people won't act on it"
- **Keren:** Validated that companies pay $20-40K+ for AKT/Qualtrics analysis that CX Mate generates in minutes
