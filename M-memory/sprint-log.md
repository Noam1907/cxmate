# CX Mate - Sprint Log

Track sprint progress and status.

---

## Current Sprint: Sprint 3 - Dashboard + Persistence + Polish (Weeks 5-6)

**Goal:** Dashboard, navigation, UX polish, auth + DB persistence, journey editing

### Tasks

| Task | Agent | Priority | Status |
|------|-------|----------|--------|
| Dashboard page (stats, playbook progress, top risks, nav) | Frontend Dev | P0 | Done |
| Navigation header (CX Mate brand, 4-tab nav, hidden on home/onboarding) | Frontend Dev | P0 | Done |
| UX review — full flow walkthrough | QA Agent | P0 | Done |
| Fix stuck Generate button (error display + 180s timeout) | Frontend Dev | P0 | Done |
| JSON parsing repair (trailing commas, control chars) | AI Engineer | P0 | Done |
| Product evolution: two paths, new tone, grounded math, CX maturity | Full team | P0 | Done |
| Auth + organization setup (Supabase Auth) | Backend Dev | P0 | Pending |
| DB persistence pipeline (org → journey → stages → moments → recs) | Backend Dev | P0 | Pending |
| Journey health scoring | AI Engineer | P1 | Pending |
| Journey editing | Frontend Dev | P1 | Pending |
| Research pipeline prototype (Claude tool_use) | AI Engineer | P2 | Deferred from Sprint 2 |
| Curated email/message template library | CX Architect | P2 | Deferred from Sprint 2 |
| Performance optimization | Tech Lead | P2 | Pending |
| Full regression testing | QA Agent | P2 | Pending |

### Sprint Notes
- 2026-02-19: **Sprint 3 kickoff — Dashboard + UX Polish session.** Built full dashboard page with 4-stat grid, playbook progress card, top risks card, and quick navigation. Added global navigation header (CX Mate brand, Dashboard/CX Report/Journey/Playbook tabs, hidden on home + onboarding). Full UX review walkthrough: tested all 5 onboarding steps, confrontation screen, journey map, playbook generation, dashboard. Found and fixed: stuck Generate button (added error message display + AbortController timeout), JSON parsing failures from Claude (added trailing comma + control character repair), increased client timeout from 90s to 180s (API takes ~2.8min). Build passes clean.
- 2026-02-19: **Next session should start with:** Auth + DB persistence pipeline. This is the biggest remaining blocker — all data currently in sessionStorage/localStorage. Need Supabase Auth → org → journey_template → stages → moments → recommendations chain. Then journey editing and health scoring.
- 2026-02-19: **Product evolution — Two Paths + CX Mate Persona + Grounded Math + CX Maturity.** Major product update based on UX feedback. Extended onboarding: added hasExistingCustomers toggle (branching question), customer count selector, business data step (pricing model, revenue range, deal size — shown only for existing customers), CX maturity step (NPS/CSAT/CES toggles with NPS response count callout, journey map toggle, data vs gut radio). Refactored wizard from hardcoded 5-step to dynamic step array (6 steps pre-customer, 7 with customers). Updated journey prompt v3: CX Mate persona (peer advisor, not judge), two-path analysis (COMPARISON for existing customers, PRESCRIPTIVE for pre-customer), CX maturity context builder (NPS under 100 = unreliable callout), business data context builder (real numbers vs benchmarks), transparent impact projections (calculation formula + dataSource field). Updated recommendation prompt with CX Mate voice. Updated CX Intelligence Report UI: new MODE_CONFIG copy (companion tone), companionAdvice display ("CX Mate says" block), transparent calculation display (monospace formula), data source badges ("Based on your numbers" vs "Based on industry benchmarks"), two-path conditional labels. Added buildProfileFromOnboarding to impact calculator (maps onboarding strings to numeric CompanyProfile). Build passes clean.
- 2026-02-19: **Next session should start with:** UX walkthrough of the new onboarding flow (both paths), then Auth + DB persistence pipeline.

### Sprint 4: Beta Launch (Weeks 7-8)
- Stripe integration
- Landing page
- Analytics setup (PostHog)
- Beta invite system
- Documentation
- Security audit
- Load testing

---

## Sprint History

### Sprint 2: Playbook + CX Intelligence (Weeks 3-4) — COMPLETE
- CX Theory Engine knowledge base (8 files)
- Wired knowledge base into journey prompt v2
- Recommendation engine prompt + API route
- Playbook UI (generate, filter tabs, expandable cards, status tracking)
- Confrontation screen (animated reveal, insights, impact projections)
- Copy-to-clipboard on playbook templates
- Recommendation status tracking (localStorage)
- Confrontation mode detection (A/B/C by company size)
- Deferred: curated email templates, research pipeline, DB persistence

### Sprint 1: Foundation (Weeks 1-2) — COMPLETE
- Next.js 16 + React 19 + Tailwind v4 + shadcn/ui scaffolded
- Supabase client (browser + server + middleware) configured
- Initial DB schema with RLS created
- 5-step onboarding wizard
- Claude-powered journey generation
- Journey map visualization
- CX knowledge base (stages, moments, verticals)
- All using sessionStorage for preview mode (no DB connection yet)

---

*Ship fast, learn faster.*
