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
| Auth + organization setup (Supabase Auth) | Backend Dev | P0 | Done |
| DB persistence pipeline (org → journey → stages → moments → recs) | Backend Dev | P0 | Done |
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
- 2026-02-19: **Auth + DB Persistence Pipeline — Phases 1-3 COMPLETE.** Built full auth flow: login/signup page (email/password, mode toggle, Suspense-wrapped), auth callback route (code exchange + auto org creation + app_metadata update), admin client (service role, bypasses RLS), auth helpers (getSession/getUser/getOrgId). Built persistence pipeline: journey-persistence service (persistJourney + loadJourney with JSONB backup + normalized tables fallback), updated onboarding API route (auto-persists for authenticated users, falls back to preview), journey loading API route (GET /api/journey/[id] with RLS enforcement). Updated all frontend pages for dual-mode loading (preview=sessionStorage, real UUID=API fetch). Updated nav header for dynamic template IDs. Updated middleware for route protection (public vs app routes, preview mode bypass). Fixed Database types (added Relationships + Views/Functions/Enums/CompositeTypes for Supabase v2 compatibility). Build passes clean.
- 2026-02-19: **Next session should start with:** Full UX walkthrough of both auth flow AND preview flow (verify nothing broke). Then playbook persistence (Phase 4) and "Save My Results" CTA (Phase 5). Then journey editing and health scoring.
- 2026-02-19: **QA Walkthrough (Orca AI) + Bug Fix + Agent Skills Upgrade.** QA walkthrough with Orca AI profile (11-50 employees, B2B SaaS, Full Lifecycle journey, pre-customer): CX Report loaded correctly, journey map and playbook generated successfully. Bug found: pre-customer companies selecting "Full Lifecycle" journey type were getting customer-stage content (onboarding emails, CS handoffs) in both the journey and playbook — even though they have no customers. Fixed in journey-prompt.ts (override effectiveJourneyType to "sales" when !hasExistingCustomers, add ⚠️ CRITICAL constraint in prompt, constrain stageType to "sales" only) and recommendation-prompt.ts (Rule 8: PRE-CUSTOMER CONSTRAINT). Build passes clean. Agent skills upgraded: applied Anthropic's "Complete Guide to Building Skills for Claude" — all 12 agent SKILL.md files now have rich description (when to activate), allowed-tools (specific tools per role), argument-hint, and user-invocable: false for orchestrator. This enables Claude to auto-activate the right agent based on context.
- 2026-02-19: **Next session should start with:** Continue QA with Mesh Payments profile (FinTech, existing customers) and Beam AI (early-stage pre-customer). Then playbook persistence (Phase 4). Then journey health scoring (P1).
- 2026-02-19: **Onboarding Redesign v2 — Conversational Story Flow + Major Feature Additions.** Complete onboarding rewrite: maturity-based branching (pre_launch/first_customers/growing/scaling), ChatBubble persona, dynamic step building, maturity-adaptive pain points and goals, deriveFromMaturity() backward compatibility. QA walkthrough of full Growing path: all 9 steps → journey generation → CX Report → Journey Map → Playbook — all working end-to-end. Then user feedback round with 8 improvements:
  1. ✅ Removed "B2B" from welcome (now "companies" not "B2B companies")
  2. ✅ Created design brief for designer mockups (`P-prds/design-brief-onboarding.md`)
  3. ✅ Added competitor question step (new `step-competitors.tsx`)
  4. ✅ Added assumptions/methodology to CX Report (collapsible section with disclaimer)
  5. ✅ Added tech stack recommendations (CRM, marketing, support, analytics) to prompt + CX Report UI
  6. ✅ AI Engineer owns AI trends / stress-testing (documented in decisions.md)
  7. ✅ Added company website field to Welcome step (future auto-enrichment)
  8. ✅ Added percentages alongside dollar amounts in prompt instructions
  Then additional feedback:
  9. ✅ Added horizontal visual journey view (new `journey-visual.tsx` with toggle on journey page)
  10. ✅ Updated CX Expert skill with Qualtrics/survey platform landscape + survey deployment strategy by maturity
  11. ✅ Added AI-first lens to journey prompt (🤖/🤖+👤/👤 automation labels on recommendations)
  12. ✅ Added AI-first principle to orchestrator agent (all agents must evaluate through AI-first lens)
  13. ✅ AI Engineer agent updated with AI trends ownership + future vision
  Build passes clean.
- 2026-02-19: **Next session should start with:** Full QA re-run (all maturity paths with new competitor + website fields). Test visual journey view. Then playbook persistence (Phase 4). Consider: auto-enrichment from company website (scrape → LLM → pre-fill fields).

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
