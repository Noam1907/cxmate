# Two-Pass Onboarding — Product Brief

## The Problem (Who + What + Why Now)

- **Who feels this pain**: Founders and CX/CS leads at B2B startups (10-200 employees) — companies without a dedicated CX strategist. They landed on CX Mate because they know their customer experience is broken but don't know where to start.
- **What they do today**: They hit the current onboarding wizard — 7-9 steps, 11-13 questions — and drop off before seeing any output. The ones who finish wait ~90 seconds for journey generation. The ones who don't finish never see the value.
- **Why it's broken**: The wizard front-loads ALL data collection before showing ANY value. Users invest 5-8 minutes answering detailed questions with no proof that the output will be worth it. That's a trust deficit — they're doing the work without seeing the reward.
- **Why now**: Beta launch is imminent (Sprint 4). The chat onboarding branch (`preview/onboarding-chat`) exposed that trying to collect all 33+ fields conversationally feels even longer. Feedback from review: "the wizard is too long before getting value." We need to solve time-to-value before beta users hit it.

## Desired Outcome

**After shipping this, a founder who's never heard of CX Mate will go from landing page to a personalized CX journey, report, and playbook in under 10 minutes — and feel compelled to go deeper.**

Business metrics this drives:
- Onboarding completion rate (currently unmeasured — target: >60%)
- Journey generation rate (% of signups who see output — target: >50%)
- Deep dive conversion (% who choose to enrich — target: >30%)

## Opportunity Solution Tree

```
Outcome: First-time user sees personalized CX value in <10 minutes
├── Opportunity 1: Users drop off during long intake
│   ├── Solution A: Shorten to 5 questions, use enrichment heavily ← CHOSEN (Pass 1)
│   ├── Solution B: Keep all questions but add progress incentives (rejected: still long)
│   └── Solution C: Skip intake entirely, infer from website (rejected: too low quality)
├── Opportunity 2: Users who finish don't come back to improve
│   ├── Solution D: Optional deep dive with structured chips ← CHOSEN (Pass 2)
│   └── Solution E: Follow-up email sequence (rejected: delayed, lower conversion)
├── Opportunity 3: Output feels generic without enough context
│   ├── Solution F: Regenerate with enriched data ← CHOSEN (Regeneration)
│   └── Solution G: Let users edit the journey directly (rejected: too complex for v1)
```

## The Solution

### Appetite
**Medium (3-5 days).** This is the highest-impact change before beta. Worth investing a focused sprint.

### Solution Shape: Two-Pass + Regenerate

**Pass 1 — Fast Intake (~2 minutes, 5 turns)**

| Turn | Question | What We Get | Chips/Format |
|------|----------|-------------|--------------|
| 1 | "What's your name and company?" + website field | userName, companyName, website → triggers enrichment | Open text + URL field |
| 2 | "Where is [company] in its customer journey?" | companyMaturity | 4 chips: Pre-revenue / Early customers / Growing / Scaling |
| 3 | "What's the biggest CX challenge you're facing?" | biggestChallenge + painPoints[] | Maturity-adaptive chips (4-5 options) + open text fallback |
| 4 | "What do you want to fix first?" | primaryGoal + timeframe | Goal chips (3-4 options) + timeframe chips |
| 5 | "Where should we send your CX plan?" | userEmail + userRole | Email field + role chips |

**Enrichment runs in parallel from Turn 1.** By Turn 5, we have company description, vertical, industry, competitors, approximate size — all auto-filled. The journey prompt gets ~15-18 fields from 5 questions.

**Loading Screen — Expectation Setting**

While the journey generates (~90 seconds):

> **Building your personalized CX plan...**
>
> Companies without a CX strategy lose up to 20% of revenue to silent churn.
> In the next 60 seconds, you'll get what usually takes weeks to figure out:
>
> - Your complete customer journey — mapped stage by stage
> - A CX health report with specific gaps identified
> - An actionable playbook with your first 3 moves
>
> _Average time from start to plan: under 10 minutes._

**No consultant comparison.** The framing is business impact of inaction, not service replacement.

**Full Output — Journey + Report + Playbook**

All three outputs are generated and displayed. This is NOT a degraded preview. The user sees real, personalized value:
- **Journey**: Full lifecycle map with stages, actions, moments, KPIs
- **CX Report**: Health assessment, gap analysis, maturity evaluation
- **Playbook**: Prioritized recommendations with 90-day action plan

**Deep Dive Hook**

After output renders, a prompt appears:

> **Want a more accurate plan?**
> Your plan is built on what we know so far. Answer a few more questions and we'll regenerate it with deeper insight.
> _Takes about 3 minutes. Most users see significant improvements._
>
> [Go Deeper] [I'm Good For Now]

**Pass 2 — Deep Dive (~3 minutes, structured chips)**

| Step | Question | What We Collect | Format |
|------|----------|----------------|--------|
| 1 | "Do you have any customer journey documented?" | hasExistingJourney | Yes / Partially / Not yet |
| 1b | (If yes/partial) "Which parts exist?" | existingJourneyComponents[] | Multi-select chips: 15 process checkboxes grouped by Pre-sale / Onboarding / Enablement / Ongoing |
| 2 | "What's actually working well?" | whatWorksSelections[] | Multi-select chips (8 options from WHAT_WORKS_OPTIONS) |
| 3 | "What needs fixing most?" | whatNeedsFixingSelections[] | Multi-select chips (9 options from WHAT_NEEDS_FIXING_OPTIONS) |
| 4 | "Quick business context" | companySize, mainChannel, currentTools, roughRevenue, customerCount | Mixed: chips for size/channel, open text for tools/revenue |

**Regeneration**

After Pass 2, the system regenerates the complete journey, report, and playbook with the enriched dataset. This is a full rebuild, not a patch. Wait time: ~90 seconds again.

Loading screen v2:

> **Rebuilding your CX plan with deeper insight...**
> We're incorporating your team's real processes, what's working, and what's broken.
> This version will be significantly more specific to [companyName].

### Rabbit Holes
- **Don't try to diff/patch the journey.** Full regeneration is simpler, more reliable, and the user expects a fresh output. The prompt handles the full context every time.
- **Don't gate Pass 2 behind auth.** The deep dive IS the conversion moment. Gating it kills the loop.
- **Don't show an "accuracy score."** Users will fixate on the number instead of the content. The "want more accuracy?" framing works without quantifying it.

### No-Gos (This Cycle)
- No inline editing of the generated journey (future feature)
- No partial regeneration (always full rebuild)
- No auto-save between Pass 1 and Pass 2 (session state only until auth)
- No A/B testing of Pass 1 vs current wizard (ship and measure, don't split)

## User Stories (Prioritized)

### Must Have
- As a **first-time visitor**, I want to answer 5 quick questions and see a personalized CX journey, so that I know CX Mate understands my business before I invest more time.
  - AC: Given a new user, when they complete 5 turns, then journey + report + playbook generate and display within 120 seconds.
- As a **user who completed Pass 1**, I want to optionally provide deeper context, so that my output becomes more specific to my actual situation.
  - AC: Given output is displayed, when user clicks "Go Deeper", then structured chip-based questions appear collecting existingJourneyComponents[], whatWorksSelections[], whatNeedsFixingSelections[], and business context.
- As a **user who completed Pass 2**, I want to see a regenerated journey that reflects my additional input, so that I trust the output enough to act on it.
  - AC: Given deep dive is complete, when regeneration finishes, then output reflects the new data (journey BUILD ON existing components, recommendations address what's broken).

### Should Have
- As a **user on the loading screen**, I want to understand what I'm about to receive and why it matters, so that I stay engaged during the wait.
  - AC: Loading screen shows business impact framing + expected deliverables + time estimate.
- As a **returning user**, I want to see my previously generated journey when I log in, so that I don't lose my work.
  - AC: Authenticated users see their last generated journey on the dashboard (existing functionality, confirm it works with two-pass data).

### Won't Have (This Cycle)
- Journey editing UI
- Multiple saved versions / version history
- A/B testing of onboarding variants
- PDF export of pre-regeneration output (only final version exports)

## Edge Cases

- **Empty enrichment**: If company enrichment returns nothing (unknown startup), Pass 1 still works — journey prompt handles missing enrichment gracefully. Pass 2 becomes more important.
- **User skips deep dive**: Output from Pass 1 stands on its own. It uses enrichment data + 5 answered questions. Quality is "good enough to demonstrate value" — not the full 33-field depth.
- **User drops off at email (Turn 5)**: We have 4 turns of data but no email. Journey can still generate for anonymous preview mode. Email collection moves to a softer ask post-output if skipped.
- **Enrichment is slow**: Enrichment has a 10-second timeout. If it hasn't returned by Turn 5, we proceed with what we have and backfill async.
- **Second regeneration**: Free tier gets one regeneration. Attempting a second triggers the paywall: "Want to keep refining? Unlock unlimited iterations with Full Analysis."

## Technical Shape

### Data Model Changes
None. The existing `onboarding_data` JSONB column and `journey_templates` table handle all fields. Two-pass just means the same fields get populated in two batches.

### API Changes
- **`/api/onboarding/chat/route.ts`**: Restructure CONVERSATION SCRIPT from 11 steps to two phases (fast-5 + deep-dive). Add phase tracking. Modify `checkComplete()` to have two completion states: `pass1_complete` and `pass2_complete`.
- **`/api/onboarding/generate-journey/route.ts`**: No changes needed. It already accepts the full OnboardingInput — Pass 1 just sends it with fewer fields populated, Pass 2 sends the enriched version.

### Component Changes
- **`onboarding-chat.tsx`**: Add phase state management. After Pass 1 completion, trigger journey generation. After output display, show deep-dive prompt. After Pass 2, trigger regeneration.
- **New: deep-dive chip components**: Import WHAT_WORKS_OPTIONS, WHAT_NEEDS_FIXING_OPTIONS, PROCESS_GROUPS from wizard step definitions (or duplicate the arrays).
- **Loading screen component**: New component with business-impact messaging and progress indicators.

### Dependencies
- Enrichment API must work (already does — `/api/onboarding/enrich-company`)
- Journey generation must handle partial input gracefully (verify — likely already works since many fields are optional in the prompt)

## Pricing Alignment

| Action | Free | Full Analysis ($149) | Pro ($99/mo) |
|--------|------|---------------------|--------------|
| Pass 1 (fast intake) | Yes | Yes | Yes |
| Full output (journey + report + playbook) | Yes | Yes | Yes |
| Deep dive (Pass 2) | Yes | Yes | Yes |
| One regeneration | Yes | Yes | Yes |
| Additional regenerations | No | Yes (3 total) | Unlimited |
| Edit journey | No | Yes | Yes |
| Export PDF | No | Yes | Yes |
| Team sharing | No | No | Yes |

**The free experience is complete.** Users get the full two-pass loop including one regeneration. The paywall activates when they want to iterate further, edit, or export.

## Success Metrics

| Metric | Baseline | Target | How We Measure |
|--------|----------|--------|----------------|
| Onboarding completion (Pass 1) | Unknown | >60% | PostHog: started_onboarding → completed_pass1 |
| Journey generation rate | Unknown | >50% | PostHog: completed_pass1 → journey_generated |
| Deep dive conversion | N/A | >30% | PostHog: journey_generated → started_deep_dive |
| Regeneration rate | N/A | >20% | PostHog: completed_deep_dive → journey_regenerated |
| Time to first output | ~8 min (wizard) | <5 min | PostHog: started_onboarding → journey_generated timestamp delta |
| Drop-off rate (Pass 1) | Unknown | <40% | PostHog: started_onboarding - completed_pass1 / started_onboarding |

## Decisions Log

| Date | Decision | Rationale | Decided By |
|------|----------|-----------|------------|
| 2026-03-07 | Two-pass over single-pass | Users need to see value before investing time in detailed questions | Anat + COO |
| 2026-03-07 | Full output on Pass 1, not preview | A degraded preview feels like a bait-and-switch. Show real value to earn trust. | Anat |
| 2026-03-07 | Business impact framing, not consultant comparison | Most SMBs don't consider hiring CX consultants — the comparison doesn't land | Anat |
| 2026-03-07 | Free tier includes both passes + one regen | The full loop IS the conversion experience. Gating any part of it kills adoption. | Anat + COO |
| 2026-03-07 | Full regeneration, not patch | Simpler technically, more predictable output quality, avoids diff complexity | COO |
| 2026-03-07 | No accuracy score display | Users fixate on numbers. "Want more accuracy?" framing works without quantifying. | COO |

---

*Document type: Product Brief (Living Spec)*
*Status: Draft — pending team review*
*Appetite: M (3-5 days)*
*Author: COO (Shoval) + Anat*
