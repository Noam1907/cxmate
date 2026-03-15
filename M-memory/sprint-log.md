# CX Mate - Sprint Log

Track sprint progress and status.

---

## Session: 2026-03-14 (Rate Limiting + Revenue Guardrail + Data Persistence)

### Shipped This Session

**Rate Limiting on All Claude API Routes (deployed — `2d79997`)**
- New in-memory rate limiter (`src/lib/rate-limit.ts`) with sliding window algorithm
- Applied to all 5 Claude-calling routes: onboarding (3/day), chat (30/day), enrich-company (10/day), recommendations (5/day), generate-qbr (5/day)
- Protects against denial-of-wallet attacks on the anonymous "no sign-up" flow
- Pre-beta security blocker — now resolved ✅

**Billing Webhook Pagination Fix (deployed — `2d79997`)**
- `findOrgByEmail()` in billing webhook only searched first 50 users (Supabase `listUsers` default)
- Now paginates through all users — prevents silent billing failures for user #51+

**Revenue Guardrail in Journey Prompt (deployed — `d0e5165`)**
- Cap impact projections at 40% of ARR with stage-appropriate ceilings
- Pre-launch: max $50K, first customers: max $200K
- Prevents inflated projections (e.g., Corneat run showed $825K for a pre-revenue startup)

**Org Vertical Sync from Onboarding (deployed — `d0e5165`)**
- Onboarding route now syncs org record (vertical, size, name) after journey persists
- Fixes orgs showing "general" when enrichment detected the actual vertical

**Onboarding Data Persistence for Returning Users (deployed — `e4e7ff1`)**
- Authenticated users returning to CX Brief were seeing "your company" instead of actual company name
- Evidence wall was empty because onboardingData wasn't persisted
- Now embeds `_onboardingData` inside `journey_templates.stages` JSONB
- Extracts and returns it from `loadJourney()` and both journey API routes
- Backfilled Corneat's existing record with reconstructed onboarding context

**Digest Cron Fix (deployed — `586f1f8`)**
- Vercel crons send GET with Bearer auth, but route only exported POST with x-cron-secret header
- Added GET handler + Bearer token auth — cron was getting 405'd every morning

### Items Resolved from Previous Session's Next Steps
- ✅ Rate limiting on Claude API routes (was #1 priority)
- ✅ Fix `listUsers()` in billing webhook (was #2 priority)
- ✅ Revenue guardrail in prompt (was #4 priority)

### Next Session Should Start With
1. **QA with actual journey data** — only tested empty state on CX Brief; verify full render with real data
2. **Gate page + homepage copy** — second pass presented, awaiting Anat's direction
3. **Keren's remaining criticals** — input→output visual mapping (partially done)
4. **Uncommitted M-memory files** — decisions.md, learning-log.md, sprint-log.md have unstaged changes
5. **Supabase migration** — `20260314210157_add_onboarding_data_column.sql` sitting in migrations, needs to be applied

---

## Session: 2026-03-13 (CX Brief Merge — Unified Intelligence Page)

### Shipped This Session

**Unified CX Brief Page (deployed to production — `283f3cc`, `a880794`)**
- Merged separate Analysis page (540 lines) + CX Report/Confrontation page (787 lines) into a single unified CX Brief (~1100 lines)
- Architecture changed from 4 pages to 3: **CX Brief | Journey Map | Playbook**
- Key components in the new page:
  - `HeroSection` — dark gradient hero with headline dollar range from impactProjections, maturity-adaptive headlines via `detectMode()`/`MODE_CONFIG`
  - `StatRow` — 3 stat cards (high-risk stages, critical moments, total moments mapped)
  - `JourneyDangerMap` — mini journey visualization highlighting risky stages with red circles + "!" badges
  - `InsightCard` — from confrontation, with evidence basis, pain point badges, immediate action steps
  - `ImpactBreakdown` — bar chart of risk areas (gated behind `report_details`)
  - `QuickWinsPreview` — top 3 critical moments with nextStep from journey data
  - `AssumptionsSection` — expandable calculation methodology
  - `MethodologyNote` — data layers, frameworks, cross-references
- Full feature gating with `usePlanTier()` + `canAccess()` for free vs paid tiers
- Evidence matching integrated via `buildEvidenceMap()` + `getInsightAnnotations()`

**Navigation Updates (all deployed)**
- `nav-header.tsx` — changed from 4 nav items (Analysis | CX Report | Journey | Playbook) to 3 (CX Brief | Journey | Playbook)
- `sidebar-complete-view.tsx` — merged separate Analysis + CX Report nav entries into single "CX Brief" entry
- `sidebar-building-view.tsx` — updated "After onboarding" preview list from (Dashboard, CX Report, Journey Map, Playbook) to (CX Brief, Journey Map, Playbook)

**Confrontation Redirect (deployed)**
- Replaced 787-line confrontation page with simple redirect component
- `/confrontation?id=X` now redirects to `/analysis?id=X`, preserving old URLs and bookmarks

**Analytics Type Fix**
- Added `cx_brief_viewed` event type to `src/lib/analytics.ts` AnalyticsEvent union

### Build Fixes During Implementation
- `win.title` → `win.name` (MeaningfulMoment type uses `name` not `title`)
- Added `cx_brief_viewed` to typed AnalyticsEvent union (was causing `Expected 1 arguments, but got 2`)
- Changed `page="cx_brief"` to `page="analysis"` for ExportPdfButton (reuses existing ExportPage type)

### QA Verified
- ✅ Build passes (TypeScript + Next.js)
- ✅ Empty state renders correctly with 3-card layout (CX Brief, Journey Map, CX Playbook)
- ✅ `/confrontation?id=preview` correctly redirects to `/analysis?id=preview`
- ✅ Nav header shows 3 items (CX Brief | Journey | Playbook)
- ✅ Sidebar building view shows updated "After onboarding" list

### Security Audit (same session)
- Full codebase security audit completed
- **Critical finding:** All 5 Claude API routes are unauthenticated — denial-of-wallet risk (scripts can rack up Anthropic costs)
- **Decision:** Add IP-based rate limiting to all Claude-calling routes before beta invites go out
- Other findings: `/api/notify` open endpoint (medium), `listUsers()` in billing webhook only gets first 50 users (medium), PostHog records all non-password inputs (acceptable for beta)
- Full report delivered to Anat — verdict: safe for gated beta, fix rate limiting + billing query before opening up

### M-Memory Updates (same session)
- `decisions.md` — Updated decision #113 (CX Brief merge: 4→3 pages)
- `learning-log.md` — Added 2026-03-13 entry (5 patterns from page merge)
- `B-brain/01-cx-methodology/holistic-cx-scorecard.md` — Saved Keren Shaked's 3-pillar CX framework
- Daily scheduled task updated to include user entry counts in morning briefing

### Next Session Should Start With
1. **🔴 Rate limiting on Claude API routes** — Pre-beta blocker. Add IP-based rate limit (3-5 requests/IP/day) to: `/api/onboarding`, `/api/onboarding/chat`, `/api/enrich-company`, `/api/recommendations/generate`, `/api/generate-qbr`. Protects against denial-of-wallet attacks on the anonymous "no sign-up" flow.
2. **🔴 Fix `listUsers()` in billing webhook** — Only fetches first 50 users. Replace with targeted query. Will silently break billing for user #51+.
3. **QA with actual journey data** — only tested empty state so far; need to verify full CX Brief renders with real journey data
4. **Revenue guardrail in prompt** — cap total risk at 40% of stated ARR
5. **Gate page + homepage copy** — second pass presented, awaiting Anat's direction
6. **Keren's remaining criticals** — pain points in output ✅, input→output visual mapping (partially done)

---

## Session: 2026-03-12 (Beta Gate + Lead Capture + Waitlist)

### Shipped This Session

**Beta Password Gate (deployed to production)**
- Built cookie-based password gateway — middleware redirects all unauthenticated visitors to `/gate`
- `src/middleware.ts` — gate logic with allowed routes (`/gate`, `/api/gate`, `/api/waitlist`, `/api/billing/webhook`)
- `src/app/api/gate/route.ts` — validates password against `SITE_PASSWORD` env, sets `beta_access` httpOnly cookie (30 days)
- `src/app/gate/page.tsx` — two-column lead capture landing page (3 iterations: password-only → single-column → two-column)
- `src/components/nav-header.tsx` — hides nav on `/gate`
- `src/components/layout/app-shell.tsx` — added `/gate` to `SIDEBAR_EXCLUDED_ROUTES`
- Vercel env var `SITE_PASSWORD` set on production

**Gate Page — Lead Capture Landing Page (deployed to production)**
- Left column: Logo, headline, sub-headline, 3 value bullets (MapTrifold, Warning, Target icons), "Built for B2B" line
- Right column: Private Beta badge, waitlist form (name, email, company → "Get on the list"), divider, expandable access code input
- Wires to existing `/api/waitlist` endpoint for signups and `/api/gate` for access codes
- Success state with confirmation message

**Waitlist Pipeline (end-to-end verified)**
- Fixed middleware blocking `/api/waitlist` — was redirecting to `/gate`
- Supabase `waitlist` + `invite_codes` tables created (migration `003_beta_waitlist.sql` applied by Anat manually)
- Waitlist signup tested end-to-end: form → Supabase insert → email notification via Resend to `DIGEST_EMAIL` ✅
- 3 initial invite codes seeded: `CXBETA2026` (50 uses), `EARLYBIRD` (20), `CXFIRST` (10)

**CX Influencers**
- Added Jeannie Walters to `B-brain/01-cx-methodology/cx-influencers-2026.md` — CCXP, Experience Investigators, upcoming book, core frameworks

**Messaging Direction Captured (not yet implemented)**
- Anat's brief: No consultant bashing. CX Mate fills a gap that was empty — making CX expertise accessible at a stage where it didn't exist before
- Themes: accessibility, speed, simplicity, time savings, stickiness, no guesswork
- Key framing: "Consultants serve companies that can afford them. We serve the ones that can't yet."
- Copy review in progress — first pass rejected, second pass presented awaiting feedback

### Bugs Found
- Middleware was blocking `/api/waitlist` calls from gate page (fixed: added to allowed routes)
- Waitlist API returned 500 because migration wasn't applied to production (fixed: Anat ran SQL manually)
- Gate page showed nav header (fixed: added `/gate` to hidden routes)

### Learnings
- Middleware route gating: any API endpoint that the gate page itself calls must be explicitly allowed through
- Supabase JS client cannot run DDL — need psql, Supabase CLI with access token, or dashboard SQL editor
- Copy direction: never position against consultants. We fill the gap before companies can afford one — respect the profession, democratize the expertise

### Uncommitted Files (need git add + commit)
- `src/app/gate/page.tsx` (new)
- `src/app/api/gate/route.ts` (new)
- `src/middleware.ts` (modified)
- `src/components/nav-header.tsx` (modified)
- `src/components/layout/app-shell.tsx` (modified)
- `B-brain/01-cx-methodology/cx-influencers-2026.md` (modified)
- `.env.local.example` (modified)

### Next Session Should Start With
1. **Gate page + homepage copy** — second pass presented, awaiting Anat's direction
2. **Commit + push today's work** — significant uncommitted changes
3. **Create testing workflow** — Anat explicitly asked for automated testing for emails/integrations
4. **Keren's 3 criticals** — still P0: "why" evidence layer, pain points in output, input→output mapping
5. **Fix demo bugs** — Must-do vs Quick Wins rendering, revenue impact numbers

---

## Session: 2026-03-11 (Post-Demo — Debrief + Bug Fixes + UX Polish)

### Shipped This Session

**Demo Debrief — Jonathan Riftin + Keren Shaked**
- Created `M-memory/demo-debrief-2026-03-11.md` — full debrief with both demos
- Created `M-memory/open-questions.md` — 12 strategic/product/technical open questions surfaced from demos
- Shuval (Orca COO) "aha moment" captured — confrontation challenged his blind spots in real-time
- Keren validated $20-40K market gap, took 2 actionable ideas from the demo
- Jonathan flagged "no longevity" concern — validates deliverable-shaped pricing

**Sprint 4 Batch (feat: `d8c83ff`)**
- Enrichment fix — stale data bug resolved
- Sidebar removal — cleaned up for cleaner output pages
- UX polish — em-dashes on homepage, timed auto-advance, scroll fixes
- Evidence matching improvements

**Onboarding UX Fixes (from demo observations)**
- `75b80f6` — Timeframe warning, font sizes increased, free text "anything else" field added
- `cb06fca` — Only auto-scroll when user is near bottom
- `78aeb94` — Canonical revenue labels in insight text
- `dd7a00b` — Insights panel: 1 insight per step, shorter copy, wider layout
- `58ec905` — Larger insight bubbles + content for all steps

**AI/Generation Fixes**
- `05d2d5f` — Increased journey max_tokens to 8192 (was truncating JSON)
- `beb0d9d` — Reverted to claude-sonnet-4 (3.5-sonnet deprecated, returning 404)
- `8c08784` — Attempted Sonnet 3.5 + aggressive prompt compression (rolled back)
- `9dee46f` — Trimmed prompt ~3000 tokens for faster generation
- `69765a7` — Reverted journey model to Sonnet (Haiku can't handle complex JSON)

**Playbook Fixes**
- `832fcc3` — Token budget constraints to prevent max_tokens truncation
- `d69be14` — Friendly timeout error message instead of cryptic abort signal
- `cc56fb1` — Playbook token truncation fix + UUID null string guard

**Security**
- `74f6b86` — Fixed critical secret exposure + 7 high/medium vulnerabilities

**Analysis Page**
- `edb768e` — Rewrote copy + fixed type errors for analysis page

**Domain**
- cxmate.io purchased, DNS configuration in progress
- Cloudflare email verification stuck (anat@cxmate.io — verification email not arriving)

### Learnings (to be promoted)
- Haiku can't handle complex structured JSON output — Sonnet is the minimum for journey generation
- claude-sonnet-3.5 deprecated (404) — always use `claude-sonnet-4-20250514`
- Demo feedback is product gold: Keren's 3 critical items (Why layer, pain point proof, input→output mapping) reshape the priority stack

### Next Session Should Start With
1. **Keren's 3 criticals** — personalization proof, "why" evidence layer, input→output mapping
2. **Fix remaining demo bugs** — Must-do vs Quick Wins rendering, revenue impact numbers
3. **Progressive disclosure** — output is overwhelming
4. **Cloudflare email** — unstick the verification
5. **Unified `/analysis` page** — the deliverable vision

---

## Session: 2026-03-10 (Morning — Pre-demo prep + Loop Audit)

### Shipped This Session

**ABC-TOM Framework Embedding (governance)**
- Updated all 3 governance files to embed ABC-TOM framework: `CLAUDE.md` (Brain vs Memory distinction + canonical reference), `A-agents/coo-agent.md` (full rewrite: Core Mandate, Required Reading, Session Start Checklist all restructured around ABC-TOM sections), `T-tools/03-workflows/session-start-workflow.md` (added system guide reference)
- Canonical reference: `the-system/@ALL-GUIDES-HERE/04-tom-agent-knowledge/system-guide.md` (by Tom Even)
- The Loop is now explicit in all files: "Strong M-memory patterns promote to B-brain/C-core"

**Gigi Levy-Weiss Strategic Analysis (captured from last night's session)**
- Confirmed strategic insights already saved in `O-output/07-research/gigi-levy-weiss-ai-saas-future-2026-03-09.md`
- Key decisions NOW in decisions.md: replacement > assistance positioning, Persona A vs B, compounding intelligence moat

**UX Diagnosis (captured from last night's session)**
- Option C decision NOW in decisions.md: quick Journey fix + unified `/analysis` page
- "4 tabs vs 1 story" insight NOW in learning-log.md

**O-output Reorganization**
- Flat dump → numbered folders: `01-product/`, `02-architecture/`, `03-strategy/`, `04-beta-gtm/`, `05-reference-outputs/`, `06-presale/`, `07-research/`
- New skills created: `/adhd` (ADHD co-pilot), `/ux-journey` (UX journey expert for CX Mate's own product)

**Git Pushes**
- `961c1fc` — feat: cross-linking, homepage simplification, AI generation tweaks (6 files)
- `0868aa8` — chore: ABC-TOM framework embedding, O-output reorg, new skills + research (46 files)

**Concurrency Assessment**
- Platform safe for 1-3 concurrent users (demo is fine)
- HIGH risk at 5+: sequential DB inserts in `persistJourney()` (30+ queries per journey)
- Recommendation: batch inserts before beta invites go wide

**10-Day Loop Audit (M-memory)**
- Audited all 70+ commits from March 1-10 against M-memory files
- Found 12+ decisions never logged in decisions.md — NOW added
- Found 8+ learnings never logged in learning-log.md — NOW added
- Root cause: conversations produce decisions but M-memory doesn't get updated until explicit audit

### Next Session Should Start With
1. **Domain + email** — Anat needs to purchase cxmate.io, set up Google Workspace, configure DNS for Vercel + email
2. **Homepage messaging** — align with Gigi/Persona B positioning (invoke `/copywriter` skill)
3. **Journey page quick fix** — Option C part 1: collapse stages by default, add summary header, progressive disclosure
4. **Batch insert fix** — replace sequential `persistJourney()` with batched inserts before beta
5. **Keren Shaked demo debrief** — capture feedback, update sprint priorities

---

## Session: 2026-03-09 (Morning — Keren Shaked demo prep)

### Shipped This Session

**Foundational — Anticipate Value principle**
- Updated CLAUDE.md, product-architecture.md (principles #13 + #14), orchestrator-agent.md (new "Anticipate Value Principle" section), coo-agent.md ("Plan First" + "Anticipate Value" rules + anti-patterns)
- Updated M-memory/decisions.md with 3 decisions: Anticipate Value, journey↔playbook cross-linking, COO must plan first
- Root cause: CX Mate preaches proactive CX but agent team was reactive. Intelligence layer must be "always on top" — output must be company-specific, never generic. Every page must link to its related context.

**Journey↔Playbook Cross-Link (feat)**
- `journey/page.tsx`: loads playbook from sessionStorage, builds `Set<string>` of `stageName:momentName` keys, polls every 3s until playbook arrives (pre-generation may still be in flight)
- `journey-map.tsx`: passes `playbookMoments` prop down to `JourneyStageCard`
- `journey-stage-card.tsx`: `MomentCard` shows "📋 Playbook has a how-to for this →" badge (inside expanded state, after action template) when `playbookMoments` has a matching key. Links to `/playbook#${stageSlug}`
- `playbook/page.tsx`: `StageSection` gets anchor `id={stageSlug}` for direct linking. `RecommendationCard` shows "← See [momentName] in Journey Map" link inside expanded state.
- Build passes. TypeScript clean. Pushed to main → Vercel deploy in progress.

**Demo prep — Orca AI for Keren Shaked**
- Created `O-output/06-presale/demo-account-orca-ai.md` with full Orca AI onboarding inputs, narrative mapped to Keren's CX philosophy, 4 wow moments to find, pre-demo checklist, and handling for things that might go wrong.

### Next Session Should Start With
1. **Verify Vercel deployment** — confirm cross-link badges appear live at cxmate.app
2. **Run Orca AI onboarding** (use exact inputs in demo-account-orca-ai.md) — BEFORE demo today
3. **Note the 4 wow moments** from the generated output (crew trust moment, multi-stakeholder handoff, revenue number, cross-link badge in action)
4. **Sprint 5 planning** — after demo, debrief what Keren said. Her feedback is product gold.
5. **Specific intelligence layer** — the next real P0: when journey shows a generic action template, the system should auto-enrich it with vertical-specific examples from the web. This is the "intelligence always on top" principle in product form.

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
| Mesh-inspired visual overhaul (all step components + wizard sections) | Frontend Dev | P0 | Done |
| Wire all collected data into Claude prompts (6 missing fields) | AI Engineer | P0 | Done |
| QA Gatekeeper agent skill | QA Agent | P0 | Done |
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
- 2026-02-20: **Design System "Warm & Friendly" implemented.** Plus Jakarta Sans font, indigo primary (#6366F1 / oklch 0.541 0.219 275), warm off-white background, lavender secondary. Applied to: landing page, auth page, onboarding wizard (progress counter), nav header (indigo active pills), chat bubbles. Fixed CSS variables to use oklch format (Tailwind v4 requirement). Fixed journey page duplicate title bug.
- 2026-02-20: **Qualtrics 2025 + Gladly 2026 CX Research Integration.** Created `src/lib/cx-knowledge/enterprise-cx-maturity.ts` — comprehensive structured data module with CX maturity stages, competency ratings, obstacles, ROI data, AI adoption stats, CX leadership, and SMB-specific stats. Updated 4 agent files: CX Architect (industry benchmarks + design principles), Product Lead (market validation + feature evaluation lens), Growth Agent (messaging data table + copy angles + content topics + narrative arc), AI Engineer (AI-in-CX market context + design principles + future opportunities). Updated benchmarks.ts cross-reference and knowledge base index. Build passes clean.
- 2026-02-20: **App-Wide Split-Screen Layout with CX Identity Sidebar.** Major architectural change: added persistent 1/3 + 2/3 split layout across the entire app. New files: CompanyProfileContext (React context for shared CX profile data), AppShell (layout orchestrator with CSS grid + route-based sidebar visibility), CxIdentitySidebar (main container switching between building/complete views), SidebarBuildingView (progressive reveal during onboarding — sections appear as user fills in data), SidebarCompleteView (post-generation view with journey stats, maturity assessment, top risks, quick links), SidebarSection (shared styling component). Modified: layout.tsx (Provider + Shell wrapping), onboarding-wizard.tsx (pushes live data to context), nav-header.tsx (full-width), page widths widened (dashboard/confrontation/playbook/journey). Mobile responsive: sidebar hidden below md, floating CX button opens slide-over drawer. Uses existing --sidebar-* CSS variables (indigo theme). Build passes clean. Visual QA: landing page (no sidebar ✅), onboarding (live building ✅), dashboard (complete view ✅).
- 2026-02-20: **Next session should start with:** Heat Moments feature (user parked this question — real feedback/sentiment data from company or competitors, "reality in your face"). Then playbook persistence (Phase 4). Then full regression QA of all maturity paths with the new sidebar layout.
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
- 2026-02-21: **Company Auto-Enrichment Feature — COMPLETE.** Major product differentiator: when user types company name + website in Step 1 and clicks Continue, CX Mate fetches the website HTML server-side, sends cleaned content to Claude, and returns structured enrichment (vertical, company size, competitors, customer size, main channel, description, confidence level). Onboarding steps arrive pre-filled with "AI-suggested" badges. User confirms or overrides. New files: `src/types/enrichment.ts` (types), `src/app/api/enrich-company/route.ts` (API — fetches website HTML, strips scripts/styles/nav, sends to Claude with extraction prompt, JSON repair, 8s website timeout + 12s Claude timeout), `src/hooks/use-company-enrichment.ts` (client hook with 15s timeout, deduplication, graceful fallback). Modified: `company-profile-context.tsx` (added enrichment state), `onboarding-wizard.tsx` (trigger on welcome→company transition, auto-apply enrichment to empty fields, pass enrichment to submit), `step-company.tsx` (AI-suggested badges on vertical + size, enrichment-aware ChatBubble: "I looked into [company] — [description]"), `step-customer-profile.tsx` (AI-suggested badges on customer size + channel), `step-competitors.tsx` (complete redesign — chip-based UI with removable competitor pills, add input, AI-detected badge), `journey-prompt.ts` (new AI-Enriched Company Intelligence section in prompt), `onboarding.ts` validation (optional enrichmentData field). Build passes clean. TypeScript passes clean.
- 2026-02-21: **Comprehensive UX/Product Review + Forward Vision Plan.** Founder walkthrough generated 13 feedback items across landing page, sidebar, and onboarding flow. Key insight: "CX Mate should feel like talking to a CX expert who did their homework, not filling out a survey." Created full implementation plan (`/Users/anat/.claude/plans/twinkling-percolating-moth.md`) with 6 waves: (1) Landing page copy fixes, (2) Onboarding UX reordering + pain→goal connection, (3) Sidebar redesign, (4) Company enrichment ✅, (5) Journey step upgrade, (6) Forward features (Evidence Wall, Competitive Intelligence, CX Pulse, Simulation, QBR Deck, Health Scoring). Also designed pricing model: Free (one-time journey), Starter $99/mo (Pulse + Evidence Wall), Growth $249/mo (Competitive Intelligence + Simulations + QBR), Scale $499/mo (Health Scoring + CRM).
- 2026-02-21: **Waves 1-3 UX Overhaul — COMPLETE.** All three waves shipped in one session:
  **Wave 1 (Landing Page):** Replaced "Free forever" → "Built on real CX methodology", replaced "Built for 5-300 employees" → "For companies building CX from scratch", updated footer to "Like having a CX expert on your team — powered by AI", updated CTA "Get Your Free CX Playbook" → "Map Your Customer Journey", updated subheadline to emphasize company-name-first flow.
  **Wave 2 (Onboarding UX):** (A) Renamed "Challenges" → "Pains" in wizard step label + sidebar (both placeholder and section). (B) Reordered customer profile: customer size → count → description → channel (quick picks first). Reordered business data: deal size → pricing → revenue. (C) Added descriptions/tooltips to MAIN_CHANNELS ("Customers sign up, onboard, and get value on their own" etc.). (D) Maturity cards enlarged: emoji text-2xl→text-4xl, padding p-5→p-6, label text-sm→text-base, grid gap-3→gap-4. (E) Expanded pain points from 4→6-7 per maturity level, added `onboarding_too_long` + `implementation_fails` for growing/scaling, added category field (acquisition/retention/operations). (F) Built pain→goal connection: new `PAIN_TO_GOAL_MAP` (maps each pain to relevant goals), new `getGoalsForPainAndMaturity()` (returns goals sorted by relevance to selected pains, tagged with `relatedToPain`), added "Something else" option + `customGoal` text input, goals step ChatBubble acknowledges pains ("Based on the pains you mentioned..."), "Related to your pains" badges on connected goals, validation requires customGoal when "something_else" selected.
  **Wave 3 (Sidebar Redesign):** Removed business metrics section (pricing/revenue/deal size), removed customer detail tags (customerSize/mainChannel), removed journey type indicator footer. Kept and upgraded: company name (text-sm→text-lg font-bold), vertical tag (text-xs), maturity stage (text-sm font-semibold + text-xs subtitle), biggest pain as hero quote (text-sm italic with quote marks, max 3 pain chips + overflow count), goal with custom goal support, competitors as chips. More vertical spacing (space-y-4→space-y-5).
  Build passes clean. TypeScript passes clean.
- 2026-02-21: **Major UX Feedback Implementation — 14 Items from Founder Testing.** Founder tested with Orca AI COO and collected 3 rounds of feedback. First fixed two React bugs (setState during render, AbortController abort without reason). Then implemented all 14 feedback items:
  1. ✅ Website domain guessing: handles .ai/.io/.co TLDs ("Orca AI" → "orca.ai")
  2. ✅ Person name + role fields added to welcome step (personalizes entire flow)
  3. ✅ CCXP expert presence throughout — ChatBubbles reference "CCXP-certified AI expert"
  4. ✅ Deal size + ARR scales expanded (added $50K-$100K, $100K-$500K, $500K+, $1M-$5M, $5M-$20M, $20M+)
  5. ✅ Smart timeframe suggestion: GOAL_TIMEFRAME_MAP auto-suggests realistic timeframe per goal with explanation. User confirms or adjusts.
  6. ✅ CX jargon removed: "single biggest CX challenge" → "what's the #1 thing you'd fix about how customers experience your product"
  7. ✅ Why-we-ask context: helper text under key questions explaining their purpose
  8. ✅ Enrichment description as prominent gradient card (not buried in chat) with confidence indicator
  9. ✅ Generation waiting screen: complete redesign — phased progress bar, current analysis card with expert insights, completed phases checklist, maturity-specific stat while waiting. "Gold time" — builds excitement.
  10. ✅ Journey existence step: redesigned with sub-flow. When "yes" or "partial", shows structured checkboxes (Sales pipeline, Onboarding checklist, CS playbook, Support flow, Renewal process, Health scoring) + contextual textarea. "No" gets encouraging message.
  11. ✅ Tech stack question added to business data step (free text, explains "helps me recommend tools that integrate with your stack")
  12. ✅ Sidebar redesigned as company profile card: progressive identity card with progress bar, shows only company name/vertical/maturity + biggest pain quote + goal + competitors. CX Mate expert badge at bottom. Empty state shows "Your CX profile will build here as we talk."
  13. ✅ Wizard initialData updated for new fields (userName, userRole, currentTools, existingJourneyComponents)
  14. ✅ Zod schema updated for all new fields
  Build passes clean. TypeScript passes clean.
- 2026-02-21: **Next session should start with:** Live test full flow (all maturity paths). Then Wave 5 (Evidence Wall + Competitive Intelligence). Then auth/persistence testing.
- 2026-02-21: **Evidence Wall + Inline Annotations + Expanded Tech Stack — COMPLETE.** Wave 5 feature: surfaces raw onboarding data (pain points, competitors, biggest challenge) back to users with clear mapping to journey elements. Three components:
  **(1) Evidence Wall** (new `src/components/evidence/evidence-wall.tsx`): Mounted at top of CX Intelligence Report (/confrontation). Shows "What we know about [Company]" — biggest challenge as hero quote, pain points grid with coverage bar (X/Y addressed in journey, each clickable to show which stages/moments/insights it maps to), competitive intelligence cards (differentiation opportunities per competitor). Uses purple (violet) theme.
  **(2) Inline Annotations** across all pages: Journey map moments now show violet badges ("Addresses: churn", "vs Zendesk"), playbook recommendations show violet badges ("For: Customers leaving without warning"), dashboard Top Risks show "From your input: ..." annotations. All via shared `getMomentAnnotations()` and `getInsightAnnotations()` helpers.
  **(3) Evidence Matching Engine** (new `src/lib/evidence-matching.ts`): Dual-strategy matching — AI-tagged (new `addressesPainPoints`/`competitorGap`/`competitorContext` fields on moments and insights) for future journeys, plus fuzzy keyword fallback for existing journeys. Keyword sets per pain point key (e.g., "churn" matches "attrition", "leaving", "retention").
  **(4) Expanded Tech Stack**: Added 3 new categories to `TechStackRecommendation`: `bi` (Metabase, Looker, Tableau), `survey` (Delighted, Qualtrics, Typeform), `data_infrastructure` (Segment, Snowflake, BigQuery). Prompt updated with stage-appropriate guidance. Confrontation page display updated with per-category colors.
  **(5) AI Prompt v4**: Updated `journey-prompt.ts` — Claude now tags `addressesPainPoints` (exact pain point keys) and `competitorGap`/`competitorContext` on moments and insights. Tech stack expanded from 6→9 categories with 4-7 recommendations.
  Files: types updated in `journey-prompt.ts`, new `evidence-matching.ts`, new `evidence/evidence-wall.tsx`, modified `confrontation/page.tsx`, `journey/page.tsx`, `journey-map.tsx`, `journey-stage-card.tsx`, `playbook/page.tsx`, `dashboard/page.tsx`. Build passes clean. TypeScript passes clean.
- 2026-02-21: **Next session should start with:** Live test full flow with existing sessionStorage data to verify Evidence Wall + annotations render correctly with fuzzy matching. Then generate a NEW journey to test AI-tagged pain point fields. Then external brand expert visual review. Then playbook persistence (Phase 4). Then journey health scoring (P1).
- 2026-02-21: **Brand Polish Sprint C: Onboarding UX Overhaul + Color Shift + Live Sidebar.** Addressed 6 founder feedback items + Mesh ROI Calculator inspiration:
  **(1) JSON Parse Error Fix:** Both `generate-journey.ts` and `generate-recommendations.ts` now strip preamble text before `{` and trailing text after last `}`. Handles Claude outputting "Here is the JSON..." before the actual object.
  **(2) Color Scheme Shift:** Moved from cold indigo/purple (hue 275) to warm teal (hue 195) with amber accents. More professional, warmer feel for a CX platform. Updated both light and dark mode.
  **(3) Enrichment Card:** "What I found about [company]" card made significantly larger — border-2, bigger icon, bold title, text-base body, warm gradient background.
  **(4) Scroll-to-Top:** Replaced unreliable `window.scrollTo` with `useRef` + `useEffect` that fires `scrollIntoView` on step change.
  **(5) "What You'll Get" Section:** Larger icons (w-12 h-12, text-2xl emojis), colorful gradient backgrounds per card, bolder text.
  **(6) Generating State:** All text bumped up — insight quotes text-sm, phase titles text-base font-bold, progress bar h-3, "Did you know" card now warm amber.
  **(7) Live Sidebar During Onboarding (Mesh-inspired):** Removed `/onboarding` from sidebar exclusion list. Sidebar now shows "Your information will appear here as you answer questions" → fills live with company name, logo, vertical, maturity, competitors, pain points, goals. Nav header shows logo-only during onboarding (no nav links). Enhanced sidebar building view with card-based data display (icon + label + value pattern).
  **(8) Step Headers:** All 8 step components bumped from text-xl to text-2xl.
  Build passes clean.
- 2026-02-21: **CX Today Article — Market Validation.** KPMG/PwC/Deloitte research validates CX Mate's core thesis: "orchestrate, don't patch." Key stats: 66% of B2B CX leaders cite data access as #1 obstacle, 58% already using autonomous AI in CX, trusted orgs outperform 4x. Implications: CX Mate helps startups build connected CX foundations before they accumulate legacy fragmentation. Article logged in learning-log.
- 2026-02-21: **Mesh-Inspired Visual Overhaul + Prompt Wiring + QA Gatekeeper.** Three major deliverables:
  **(1) Mesh-Inspired Card Hierarchy:** Applied consistent visual system to ALL 9 step components + 3 wizard sections (IntroHero, StepGenerate, GeneratingExperience). Pattern: `rounded-2xl border border-border/60 bg-white p-6 shadow-sm` for containers, `border-2 rounded-xl` for interactive options, `shadow-md ring-1 ring-primary/20` for selected states. Dark sidebar theme (oklch hue 240 navy). Bold DataCard pattern in sidebar. Chat bubble gradient upgrade.
  **(2) Full Prompt Wiring:** Audited all 33 OnboardingData fields — found 6 fields collected but never sent to Claude (userName, userRole, currentTools, existingJourneyComponents, existingJourneyDescription, customGoal). Added "Who We're Talking To" section (role-based personalization: CEO→strategic, Head of CS→tactical), "Existing CX Processes" section (BUILD ON instruction), currentTools (stack-building guidance) to both journey-prompt.ts and recommendation-prompt.ts. Added Rule 8: mandatory AI tool recommendations (10 specific categories — chatbots, analytics, CS platforms, etc.).
  **(3) QA Gatekeeper Agent:** New agent skill (`A-agents/qa-gatekeeper-agent.md`) for market-readiness reviews. Runs 5 audit categories: Data Completeness (input→prompt + output→UI pipelines), Flow Integrity (all paths, error handling), UX Coherence (consistent design, no placeholders), AI Quality (JSON repair, prompt completeness), Production Readiness (build, types, security). Outputs pass/fail scorecard with specific file references and fixes. Includes "Known Accepted Gaps" section for intentional deferred items.
  Build passes clean.
- 2026-02-21: **Next session should start with:** Full end-to-end QA with the gatekeeper agent. Then playbook persistence (Phase 4). Then journey health scoring (P1). Then Sprint 4 planning (Stripe, landing page, analytics).
- 2026-02-22: **UX Data Presentation Overhaul — Mesh/Ramp ROI + winn.ai inspired.** Customer demo prep day. Applied Mesh ROI calculator data presentation patterns (hero number → breakdown bars → drivers → transparency CTA) across all output pages. Referenced winn.ai for premium feel patterns (generous whitespace, progressive disclosure, quantified value proof).
  **(1) CX Report:** New HeroImpactCard (dark bg, aggregate $X-$Y annual impact range), StatPairCards (icon+label+number for risks/moments/critical), ImpactBreakdown (horizontal bars sorted by value, effort badges, time-to-realize, data source badges), TopDrivers (top 3 high-risk actions as simple bullets), AssumptionsSection (prominent "Review assumptions" CTA with calculation details + key assumptions). Complete information hierarchy overhaul: Value → Evidence → Maturity → Detailed Insights → Tech Stack → CTA.
  **(2) Dashboard:** Hero impact card with aggregate dollar range, 4-col stat cards (icon+label+bold number pattern), playbook progress section with completion bar + must-do/done counters, top risks with numbered circles + action items + evidence annotations, 3-col quick navigation cards.
  **(3) Playbook:** Dark hero progress card (percentage + total/must-do/done counters), per-stage progress bars with completion percentage + risk breakdown.
  **(4) Journey Map:** New "Risk by Stage" overview bar — horizontal bars per stage showing critical/high moment percentage, color-coded (green/amber/red).
  **(5) Landing Page:** Bigger CTA button (py-7 text-lg), quantified value strip (5 min setup / 50+ moments / CCXP methodology), removed scattered trust indicators in favor of single focused strip.
  **(6) Onboarding IntroHero:** Larger type (text-4xl sm:text-5xl), more vertical spacing (space-y-14 py-12), larger CTA button, tighter card descriptions.
  Build passes clean. TypeScript passes clean. All routes return 200.
- 2026-02-22: **Next session should start with:** Run the app end-to-end with a customer watching. All visual changes are shipped. Remaining for Sprint 3: playbook persistence (Phase 4), "Save My Results" CTA (Phase 5), journey health scoring (P1). Then Sprint 4 (beta launch).
- 2026-02-22: **LinkedIn Beta Recruitment Post — READY.** Full team stress test on beta recruitment post. COO drove content strategy, Product Lead validated ICP alignment, CX Architect confirmed messaging integrity, Tech Lead flagged demo readiness (Zoom-first, not self-serve), QA caught edge cases (follow-up message needed, "how many" for beta). Identified gap: no LinkedIn Content Expert agent — created ad-hoc review covering hook strength, format, hashtags, timing. Key decisions: (1) target is stage-based not size-based ("no CX expert yet" not "under 200 employees"), (2) hook uses real COO quote for authenticity, (3) CTA is "write אני" for low friction, (4) targeting founders/COOs/CX owners. Post approved for publish. **Action item:** prepare follow-up DM template for respondents.

### Sprint 5: Context Intelligence + Retention (Weeks 9-10) ← CURRENT

**Goal:** Close data persistence gaps, fix landing page conversion, add context enrichment that makes AI output feel like it truly "knows" the user's world.

| Task | Agent | Priority | Status |
|------|-------|----------|--------|
| Playbook persistence to Supabase | Backend Dev | P0 | ✅ Done |
| "Save My Results" re-POST fix (anon→auth data claim) | Backend + Frontend | P1 | Pending |
| Landing page step boxes visual (numbers/arrows, not pricing plan feel) | Frontend Dev | P1 | ✅ Done |
| Selectable pain options for what-works/what-needs-fixing (step-journey-exists) | Frontend Dev | P1 | ✅ Done |
| Playbook JSON parse failure — permanent fix via Claude tool use | AI Engineer | P0 | ✅ Done |
| Demo account setup doc (demo-account-setup.md) — reorder to match actual wizard | COO | P1 | ✅ Done |
| Context enrichment flywheel — G2/Capterra/X/Reddit review mining + tool stack signals | AI Engineer | P2 | Pending |
| Journey health scoring | AI Engineer | P1 | Pending |
| Journey editing | Frontend Dev | P1 | Pending |
| Security headers (CSP, X-Frame-Options, X-Content-Type-Options) | DevOps | P2 | Pending |
| Weekly service cost + credits monitoring | DevOps + COO | P0 | Ongoing — see M-memory/cost-tracker.md |

### Sprint Notes
- 2026-03-05: **Sprint 5 kickoff.** Three Sprint 4 P0s carried forward: playbook persistence, Save My Results persistence fix. All Sprint 4 code deployed (P0 copy fixes, P1 multi-select goals + multi-file upload, max_tokens 5k→8k fix). Noam (Orca AI) journey manually generated + persisted (template: 0102bea1-d9f1-481d-ab9c-0d585fe8d3d0). Added weekly service cost/credit monitoring — Anat received Vercel credits-running-low email. Created M-memory/cost-tracker.md. Starting with playbook persistence (P0 carryover).
- 2026-03-05: **Playbook persistence — COMPLETE.** Added `playbook JSONB` column to `journey_templates` (migration 004, applied manually in Supabase Dashboard). Updated `database.ts` types. `/api/recommendations/generate` now persists playbook after generation for authenticated users. New `GET /api/playbook` endpoint loads persisted playbook. `playbook/page.tsx` tries Supabase first on load, falls back to sessionStorage for anonymous users. Build passes. Deployed. Next: landing page step boxes visual (P1).
- 2026-03-05: **Landing page equal-height step cards — DONE.** `HowItWorksSection` in `src/app/page.tsx` switched from flex layout to CSS grid (`grid-cols-[1fr_auto_1fr_auto_1fr]`). CSS grid guarantees all cells in the same row are equal height — flex `items-stretch` was unreliable in practice. Also fixed React Fragment key placement: key now on `<Fragment>` import wrapper, not on inner divs. Commit: `443954f`.
- 2026-03-05: **Selectable pain chips in step-journey-exists — DONE.** Added two chip selector groups: `WHAT_WORKS_OPTIONS` (8 emerald green chips for what's working) and `WHAT_NEEDS_FIXING_OPTIONS` (9 red chips for what needs fixing). Wired to new `whatWorksSelections` + `whatNeedsFixingSelections` fields in OnboardingData. Both selections passed through to journey + recommendation prompts. Commit in same session.
- 2026-03-05: **Demo account setup doc (O-output/presale/demo-account-setup.md) — fully rewritten.** Was completely out of order vs actual wizard. Now correct 10-step order (Welcome → Company → Stage → Journey Exists → Customer Profile → Competitors → Business Numbers → Pain Points → Goals → Generate). Added `userEmail: demo@cxmate.app` to Welcome step (was missing). Updated Journey Exists section with new chip UI documentation. Added SQL password reset tip for `demo@cxmate.app` (not a real email — magic link flow won't work). Specific Flowdesk demo story preserved throughout.
- 2026-03-05: **Playbook JSON parse failure — PERMANENT FIX via Claude tool use.** Root cause: `max_tokens: 4000` too small for 18 recommendations + email templates (~5,000–7,000 tokens needed). Secondary bug: `lastIndexOf("}")` truncation detection found stale `}` from earlier completed recommendation objects, bypassing repair branch entirely. Third issue: contradictory system prompt ("10 words max") vs user prompt ("include full templates"). Permanent fix: rewrote `generate-recommendations.ts` to use Claude tool use (function calling). API validates JSON schema internally — `toolBlock.input` arrives as a pre-parsed JS object. Zero `JSON.parse` on our side, zero repair logic, zero truncation bugs. Removed entire `repairTruncatedJson()` function (40 lines). `max_tokens` stays at 8192. Retry logic (2 attempts) preserved for transient API failures. Commit: `8028151`.
- 2026-03-05: **Next session should start with:** Save My Results re-POST fix (P1) — after auth, detect sessionStorage data + re-POST to `/api/onboarding` to claim anonymous journey. Then context enrichment flywheel (P2). Journey health scoring (P1) continues in backlog.
- 2026-03-05: **3-Tier Pricing + Content Gating — COMPLETE.** Full monetization build shipped in one session. Strategic Decision Team (Strategist → Devil's Advocate → Chief of Staff) ran pricing analysis: 3 options evaluated, Option B (one-time purchase + expansion) recommended and approved. New model: Free ($0) → Full Analysis ($149 one-time) → Pro ($99/mo). Pro raised from $49→$99 based on market research. Reverse trial killed — CX Mate delivers a deliverable, not ongoing tool.
  **New files created:** (1) `src/lib/tier-access.ts` — ACCESS_MATRIX mapping 10 features to 3 plan tiers, hasAccess(), upgradeCTA(), isPaid(), requiredTier(). (2) `src/app/api/billing/plan-tier/route.ts` — GET endpoint returning user's current tier from organizations table. (3) `src/hooks/use-plan-tier.ts` — client hook with tier state + canAccess(feature) helper. (4) `src/components/ui/upgrade-gate.tsx` — UpgradeGate (blurred content + overlay CTA) + LockedSection (full replacement CTA).
  **Files modified:** (5) `src/lib/stripe.ts` — price keys remapped from starter_monthly/starter_onetime to full_analysis/pro_monthly, planTierFromPriceId() updated. (6) `src/app/api/billing/create-checkout/route.ts` — isOneTime check updated. (7) `src/app/confrontation/page.tsx` — insights locked (blurred placeholder in InsightCard), Impact Breakdown gated with UpgradeGate, Assumptions hidden, Evidence Wall shows LockedSection, PDF hidden for free. (8) `src/app/playbook/page.tsx` — full-page lock for free users, PDF gated. (9) `src/app/pricing/page.tsx` — full rewrite: 3-column layout, "See it. Fix it. Track it." headline, updated FAQ, trust strip.
  **Pricing strategy brief:** `O-output/pricing-strategy-brief.md` — full analysis of 3 options with revenue models, devil's advocate stress tests, and implementation plan.
  Commit `7d1f04c` (10 files, 781 lines added). TypeScript clean. Deployed to Vercel.
  **BLOCKER:** Stripe account setup stalled — user's existing Stripe is Express (Go Fractional), not standard Dashboard. Israel may not appear in Stripe country list on new account creation. Alternatives discussed: Lemon Squeezy (works from Israel, Merchant of Record). Decision pending.
- 2026-03-05: **Next session should start with:** (1) Resolve Stripe/payment processor — either get Stripe Israel working or pivot to Lemon Squeezy. (2) Set env vars: STRIPE_FULL_ANALYSIS_PRICE_ID + STRIPE_PRO_MONTHLY_PRICE_ID (or equivalent Lemon Squeezy keys). (3) Save My Results re-POST fix (P1). (4) Tool logos on journey map (plan exists in .claude/plans/). (5) Journey health scoring (P1).
- 2026-03-06: **Chat Onboarding Branch (`preview/onboarding-chat`) — Base44 UX analysis, chip polish, JSON prefill fix, chat flow diagnosis.** Commits: `c3de94f` (VIP chips), `0fd1e3c` (assistant prefill JSON fix). Fixed Vercel Preview env (all 10 vars were Production-only → added to Preview). Full flow diagnosis done — see `O-output/chat-flow-diagnosis-2026-03-06.md`.
- 2026-03-06: **Next session should start with:** Fix chat flow Steps 3-5 per diagnosis doc. Then end-to-end test of full chat path.

---

### Sprint 4: Beta Launch (Weeks 7-8) — COMPLETE (shipped core goals)

**Goal:** First beta users in the product, first paid conversions, demo-ready at all times.

**Immediate (before Sunday 2026-03-01 demo):**
- [x] Error boundaries on all output pages (confrontation, journey, playbook, dashboard, global)
- [x] console.log removed from onboarding-wizard.tsx
- [x] vercel.json updated (enrich-company timeout added)
- [x] Agent system upgraded to 17 agents (Strategic Decision Team added)
- [x] C-core completed: voice-dna.md + icp-profile.md created
- [x] MEMORY.md updated to reflect Sprint 4 state
- [x] qa-gatekeeper Claude skill wrapper created

| Task | Agent | Priority | Status |
|------|-------|----------|--------|
| PDF export (playbook + journey map) | Frontend Dev | P0 | Pending |
| "Save My Results" CTA for anonymous users | Frontend Dev | P0 | Pending |
| Playbook persistence to Supabase (Phase 4) | Backend Dev | P0 | Pending |
| PostHog analytics integration | DevOps Agent | P0 | Done ✅ |
| Stripe integration + pricing page | Backend Dev | P0 | Done ✅ |
| Beta invite system | Growth Agent | P0 | Done ✅ |
| Full regression QA (gatekeeper audit) | QA Gatekeeper | P0 | Done ✅ |
| Journey health scoring | AI Engineer | P1 | Pending |
| Journey editing | Frontend Dev | P1 | Pending |
| Security audit | Tech Lead | P1 | Pending |
| Load testing | DevOps Agent | P2 | Pending |
| MCP research pipeline spike | AI Engineer | P2 | Sprint 5 |
| Curated email template library | CX Architect | P2 | Deferred |
| **"Save My Results" data loss** — anonymous users who onboard then sign up never get data persisted to Supabase (journey stays in sessionStorage only). Fix: after auth, detect sessionStorage data + re-POST to /api/onboarding with new session | Backend Dev + Frontend Dev | P1 | Sprint 5 |
| **Context enrichment flywheel** — G2/Capterra/X/Reddit review mining + live tool stack signals from website/job postings | AI Engineer | P2 | Sprint 5 |
| P1: Selectable pain options for what-works/what-needs-fixing (step-journey-exists.tsx) | Frontend Dev | P1 | Sprint 5 |
| P1: Landing page step boxes visual — look like pricing plans, need numbers/arrows treatment | Frontend Dev | P1 | Sprint 5 |
| **Domain purchase + Vercel custom domain** | Anat + DevOps | P0 | Pending (Anat) |
| **Professional email** (Google Workspace or Resend) | Anat + Backend | P0 | Pending (Anat) |
| **Privacy Policy + Terms pages** | Growth + Frontend | P0 | Done ✅ |
| **Cookie consent banner** | Frontend Dev | P0 | Done ✅ |
| **About page** (/about) | Copywriter + Frontend | P1 | Done ✅ |
| **LinkedIn company page** | Growth Agent + Anat | P1 | Pending (Anat) |
| **OG image + meta tags** | Design + Frontend | P1 | Done ✅ |
| **Favicon + sitemap + robots.txt** | Frontend Dev | P1 | Done ✅ |
| **Supabase custom SMTP** (auth emails from cxmate.io) | Backend Dev | P1 | Pending (needs domain) |
| **Welcome + beta nurture emails** | Growth Agent | P1 | Pending |

### Sprint Notes
- 2026-02-27: **Sprint 4 kickoff.** Agent system overhauled (17 agents, Strategic Decision Team added, all C-core files complete). Demo-critical fixes shipped: error boundaries on all routes, vercel.json updated, console.log cleaned. Build passes clean. First beta demo Sunday 2026-03-01.
- 2026-02-27: **Next session should start with:** Full end-to-end demo run-through (anonymous preview flow). Then PDF export. Then "Save My Results" CTA. Keep gatekeeper running before every demo.
- 2026-03-04: **Performance Regression Fix + Background Playbook Architecture + QA Gatekeeper 5/5 PASS.** Three major fixes this session:
  **(1) Journey generation 7-minute regression fix:** Root cause was `max_tokens: 12000` in `generate-journey.ts` (had silently regressed from 8192) and model name `claude-sonnet-4-6` (inconsistent with rest of codebase). Fix: `max_tokens: 5000`, `model: "claude-sonnet-4-20250514"`, system prompt token guidance 8000→4000. Same fix applied to `generate-recommendations.ts`: `max_tokens: 4000`, same model name. Journey should now complete in ~1.4 min target window.
  **(2) Playbook background generation architecture:** Previously onboarding-wizard.tsx was blocking navigation with a synchronous playbook fetch AFTER journey generation (added to avoid browser-cancellation-on-navigation). Fixed with a better pattern: removed blocking playbook call from onboarding wizard entirely, added fire-and-forget fetch trigger in `journey/page.tsx` after journey loads. Key insight: fetches from the destination page (journey) are NOT cancelled on subsequent navigation because no AbortController fires. Playbook page already polls sessionStorage every 2s for up to 30s — unchanged. Net result: user navigates to journey immediately after ~1.4 min, playbook generates in background.
  **(3) QA Gatekeeper Full Audit — SHIP IT:** 5/5 categories passed. One P1 fixed mid-audit: `industry` field was collected in onboarding + validated in schema + filled by enrichment but NEVER forwarded to Claude prompts. Added to both `journey-prompt.ts` and `recommendation-prompt.ts`. P2 deferred: no security headers (CSP/X-Frame-Options) in next.config.ts — acceptable for beta, schedule for Sprint 5. Supabase migration 003 (beta waitlist tables) needs to be applied (`supabase db push` or manual). Build: 0 errors, 0 warnings.
- 2026-03-04: **Launch Readiness Gap Analysis complete.** Full plan saved to `O-output/launch-readiness-plan.md`. 6 tiers identified: (1) Legal blockers — Privacy/Terms/cookie consent, (2) Domain + email infrastructure, (3) Brand presence — About page + LinkedIn, (4) SEO/social — OG image/meta/favicon/sitemap, (5) Product completeness — PostHog/beta invite/PDF/persistence, (6) Future — ProductHunt/Twitter. Added all new gaps to Sprint 4 task table. What Anat must do personally: buy domain (cxmate.io recommended), Google Workspace setup, LinkedIn page creation, Supabase SMTP config (Resend free tier). Design changes this session: dashboard cards redesigned to match homepage hero visual language (colored backgrounds, border-2, badges, stat lines), journey page default changed to visual timeline, toggle relabelled (Visual Timeline / Stage Details).
- 2026-03-04: **Next session should start with:** (1) Commit all recent changes to git. (2) Apply Supabase migration 003: `supabase db push` (creates waitlist + invite_codes tables). (3) Then: PDF export (P0 — highest remaining product task). (4) Then: "Save My Results" CTA for anonymous users (P0). (5) Anat's manual tasks: domain purchase + Vercel custom domain + Google Workspace + LinkedIn company page. P2 deferred: add security headers (CSP, X-Frame-Options, X-Content-Type-Options) to next.config.ts.

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

---

## Session — 2026-02-22

### Completed this session
- **CX Report full redesign** — hero "Revenue at risk", impact breakdown with formula subtitle, collapsible assumptions, evidence wall clarity, competitive insights hidden when empty, maturity snapshot clean, no aggressive language, tech stack grid with pills
- **Journey page full redesign** — removed Risk by Stage bars, ConfrontationPanel, ImpactProjections, CxToolRoadmap; 2-tone color (amber/slate only); readable moment type labels; cleaner stage cards with left-bordered insights
- **Playbook fix** — maxDuration=300 on both API routes, industry field added to Zod schema
- **Sidebar color** — lightened from oklch(0.13) to oklch(0.22)
- **Nav item readability** — text-white/65 for inactive items
- **Onboarding autosave** — useOnboardingAutosave hook, localStorage draft restore with "Welcome back" banner
- **Industry split** — vertical = business model, industry = optional qualifier chips
- **Journey components** — expanded from 6 to 20, lifecycle-ordered (ICP → Sales → Onboard → Enable → Success → Support → Expand), native checkbox replaced with custom checkmark
- **Pain points** — expanded list, lifecycle ordered, maturity-adaptive
- **Pre-generate screen** — simplified to 4-item bullet list
- **Loading screen** — phase list with spinner/check, progress bar, insight line
- **Tech stack question** — renamed from "CX tools" to "What tools does your team use?"
- **"What do you have in place?" step** — now shows for first_customers too (not just growing/scaling)
- **Pre-live process question** — new neutral-language field asking "What happens between deal-close and go-live?" — uses company's own terminology, prevents assumed "pilot" framing

### Next session starts with
- PDF export feature (playbook + journey map with company logo)
- Sprint 4: Beta launch prep — auth, DB persistence pipeline

---

## Session — 2026-03-02

### Completed this session
- **Tester behavior tracking — session recording enabled** in PostHog provider (`posthog-provider.tsx`): `session_recording` block with password-only masking. Testers can now be watched as session replays in PostHog.
- **User identification wired** in `auth/page.tsx`: `identify(userId, { email })` on login, `track("user_logged_in")` on login, `track("user_signed_up")` on signup. Was previously defined in schema but never called.
- **Company enrichment events wired** in `use-company-enrichment.ts`: `company_enrichment_succeeded` (with confidence + company name) and `company_enrichment_failed` called after each enrichment attempt.
- **New analytics event** added to schema: `pdf_exported` with `{ page: "journey" | "cx_report" | "playbook" | "dashboard" }`.
- **PDF export** — browser print-based (no new deps). Print CSS added to `globals.css` (hides nav/sidebar/buttons, formats cards, handles page breaks). New reusable `ExportPdfButton` component (`src/components/ui/export-pdf-button.tsx`). Export buttons added to Journey Map, CX Report, and Playbook headers.
- **Daily digest email system** — built full pipeline: `src/app/api/digest/send/route.ts` (pulls Supabase stats, composes HTML email, sends via Resend), secured with `CRON_SECRET` header. Vercel cron job configured in `vercel.json` to fire daily at 8am UTC. HTML email template with user/journey stats + PostHog session replay link. New env vars documented in `.env.local.example`.
- **Resend** installed (`resend@6.9.3`).
- **Vault files** synced (sprint-log, decisions, learning-log, C-core).

### Open items requiring user action
- Set `RESEND_API_KEY` in `.env.local` and Vercel env vars (get from resend.com — free tier)
- Set `DIGEST_EMAIL` to your inbox
- Set `CRON_SECRET` to any random string (also in Vercel env vars)
- Verify PostHog `NEXT_PUBLIC_POSTHOG_KEY` is set in Vercel (session recording only works with a valid key)

### Next session starts with
- Design review + monetization (Stripe integration: products, pricing, checkout flow, subscription management)
- Journey health scoring (P1)
- Full regression QA before beta launch

---

## Session — 2026-03-02 (Stripe Integration + CX Influencer KB)

### Completed this session

**PDF Export improvement:**
- Created `src/components/pdf/print-cover.tsx` — personalised cover page ("Dear [Name], here is your [Journey Map / CX Report / Playbook]")
- Full print CSS overhaul in `globals.css` — A4 page margins, grid collapse, cover page as page 1 (`break-after: page`)
- `PrintCover` injected into confrontation, journey, and playbook pages
- Added `firstName` state to journey page (was missing)

**CX Influencer Knowledge Base:**
- Created `B-brain/01-cx-methodology/cx-influencers-2026.md` — full reference guide for 12 CX world experts (Bliss, Hyken, Kaufman, Morgan, Van Belleghem, Baer, Golding, Franz, Bova, Gingiss, Swinscoe, Sherman)
- Injected expert frameworks into both `journey-prompt.ts` and `recommendation-prompt.ts` — "Cite naturally when relevant" section with per-expert use cases. AI now cites Ian Golding, Annette Franz, etc. naturally in its output.

**NPS/Measurement mandate:**
- Added Rule 9 (measurement mandate) to `recommendation-prompt.ts` — explicit NPS/CSAT/CES/event-trigger recommendation per stage (Demo→CSAT, Onboarding→CES+milestone, Adoption→NPS Day 30, Renewal→pre-renewal NPS Day -60)
- Added `measurementPlan?: string` field to `StagePlaybook` interface
- Rendered as violet badge (📊 Measure: ...) per stage in playbook page

**Stripe Integration — COMPLETE:**
- `stripe` and `@stripe/stripe-js` installed
- `src/lib/stripe.ts` — lazy singleton + `STRIPE_PRICES` constants + `planTierFromPriceId()`. API version `2026-02-25.clover`
- `supabase/migrations/002_billing.sql` — adds 5 Stripe billing columns to `organizations`
- `POST /api/billing/create-checkout` — creates Stripe Checkout session (subscription for monthly, payment for one-time)
- `POST /api/billing/webhook` — verifies stripe-signature, handles checkout.session.completed + subscription lifecycle events → updates `organizations.plan_tier`
- `POST /api/billing/portal` — creates Stripe Customer Portal session for self-serve billing
- `GET /api/billing/verify-session` — confirms plan activation on success page
- `/pricing` page — 4-tier pricing (Free / Starter / Pro / Premium). Starter has dual CTA: "Subscribe monthly — $79/mo" + "Pay once — $149"
- `/billing/success` page — personalised confirmation ("You're on CX Mate Starter 🎉"), unlocked features list, Go to Dashboard CTA
- Nav header: "Upgrade ✦" pill CTA linking to /pricing (hidden on pricing page itself)
- `.env.local.example` updated with all 5 Stripe env vars

### Stripe task table update

| Task | Status |
|------|--------|
| Stripe integration + pricing page | ✅ Done |

### Open items requiring user action (Stripe)
1. **Create products in Stripe Dashboard** — "CX Mate Starter Monthly" ($79/mo recurring) and "CX Mate Starter One-Time" ($149 one-time). Paste the Price IDs into Vercel env vars.
2. **Register webhook in Stripe Dashboard** → `POST https://[your-domain]/api/billing/webhook` — copy the webhook secret to `STRIPE_WEBHOOK_SECRET`
3. **Run DB migration**: `supabase db push` to apply `002_billing.sql`
4. **Configure Stripe Customer Portal** in Stripe Dashboard (Settings → Billing → Customer Portal) — enable cancellation, invoice download

### Next session starts with
- "Save My Results" CTA for anonymous users (P0 — before first paid beta)
- Run the gatekeeper audit before next demo
- Revenue Protected counter on dashboard
- Journey health scoring (P1)

---

## Session — 2026-03-03

### Completed this session
- **Competitive intelligence agent update** — All 4 priority agents updated with competitive landscape data (Growth Agent: messaging angles + implementation speed comparison table; CX Architect: competitor journey methodology patterns + gaps we fill; Product Lead: competitive feature gap map + anti-patterns; AI Engineer: competitor AI capabilities + where we leapfrog). New central reference file: `B-brain/02-market-research/competitive-landscape.md`.
- **Homepage messaging overhaul** — New headline "Stop building your customer journey by accident." Hero subheadline: "Your customers have a journey — whether you designed it or not." CTA: "Get Your Action Playbook". Removed SocialProofSection. Features heading: "From gut feel to clear direction." Bottom CTA: "Stop guessing. Start mapping." Page height halved. Cross-validated with Gemini + ChatGPT.
- **"Save My Results" CTA** — New `SaveResultsBanner` component (amber, non-intrusive). Wired to all 4 output pages (dashboard, CX report, journey map, playbook). Shows only for anonymous/preview users. Links to /auth with company-aware copy. Build passes clean. Deployed (`96b12d0`).

### Next session starts with
- Revenue Protected counter on Dashboard (benchmark-based, starts $0, grows with playbook completion)
- Playbook persistence to Supabase (Phase 4)
- Full regression QA / gatekeeper audit before next demo
- Journey health scoring (P1)

---

## Session — 2026-03-04 (Production Reliability + Proactive Verification)

### Completed this session
- **PostHog token O vs 0 bug fixed** — Token had number `0` in two positions where the real token has letter `O`. Removed old key from Vercel + `.env.local`, re-added correct one using `printf` (not `echo` — avoids trailing newline). Verified via PostHog MCP: events confirmed flowing (`$pageview`, `$pageleave`, `test_token_fix_verified`). Character confirmed via charCode check: 79 = letter O ✅
- **Auth retry logic (`withRetry()`) added** — Intermittent "Connection error" on login mapped to "Failed to fetch" from `supabase.auth.signInWithPassword` (transient network/cold start). Added `withRetry<T extends { error: any }>()` wrapping both signIn and signUp: up to 2 retries, 800ms/1600ms exponential backoff before surfacing error. TypeScript generic needed `extends { error: any }` to satisfy Supabase's varied return types. Deployed.
- **`/api/health` endpoint created** — `src/app/api/health/route.ts`. Server-side `GET` route that calls all 6 external services with real network requests: Supabase Auth (`/auth/v1/settings`), Supabase DB (live query on `organizations`), Claude API (minimal 1-token message), Resend (list API keys), PostHog (decide endpoint — validates `phc_` format + no newlines), App URL (env var check). Returns `{ status: "healthy"|"degraded"|"unhealthy", timestamp, summary, checks: [{service, status, message, latencyMs}] }`. HTTP 503 on failures, 200 on healthy/degraded. First run: 5/6 pass, `NEXT_PUBLIC_APP_URL` was localhost — fixed.
- **`scripts/verify-deploy.ts` CLI verification script** — `npx tsx scripts/verify-deploy.ts [BASE_URL]`. 5 checks: Homepage loads + contains "CX Mate", Health endpoint (with per-service printout), Auth page loads (200 + Next.js shell — client-rendered, checks for `__next`/`_next`/`CX Mate`), Journey API 401, Notify API responds. Exit code 1 on failures. Last run: `🟢 ALL CHECKS PASSED — 5/5 services verified. Safe to share with testers.`
- **npm scripts added** — `verify` (production check), `verify:local` (localhost check), `deploy` (force deploy + auto-verify).
- **`T-tools/deploy-checklist.md` created** — Pre-deploy checklist (TypeScript, env var safety, required vars list), post-deploy automated + manual smoke test, "safe env var pattern" (printf not echo), lessons table from today's bugs, emergency fix commands, COO session-end protocol.
- **Morning Briefing with system health** — Updated `src/app/api/digest/send/route.ts`: renamed from "Daily Digest" to "Morning Briefing", added System Health section (🟢/🟡/🔴 + per-service table), runs health check + stats in parallel, added Quick Links (PostHog, Supabase, Open App). Cron moved from `0 8 * * *` → `0 5 * * *` (5am UTC = 7am Israel). Committed `be812c2`.
- **`NEXT_PUBLIC_APP_URL` fixed on Vercel** — Was `http://localhost:3000`, changed to `https://cx-mate.vercel.app` using `printf`.

### What's now proactive (not reactive)
- Every deploy: `npm run deploy` auto-runs `verify-deploy.ts` — catches broken services before testers hit them
- Every morning at 7am IL: Morning Briefing email shows system health + stats
- Always-on: `https://cx-mate.vercel.app/api/health` returns live service status in JSON

### Next session starts with
- Revenue Protected counter on Dashboard (starts $0, grows with playbook completion — benchmark-based)
- Playbook persistence to Supabase (Phase 4)
- Full regression QA / gatekeeper audit
- Journey health scoring (P1)

---

## Session — 2026-03-04 (Design Sprint — Sage Background + Logo Mark)

### Completed this session
- **Sage background propagated to all inner pages** — Changed `--background` CSS variable in `globals.css` to sage (`oklch(0.928 0.013 148)` = `#E8EDE5`). Added `--color-sage` token. Removed explicit `bg-white` overrides from all page-level containers: confrontation, playbook, journey, pricing, dashboard. Cards stay white intentionally for depth/lift. Print CSS unchanged — still forces `background: white !important` for PDF export.
- **Nav header updated** — `bg-white` → `bg-background` (picks up sage). Border softened to `border-slate-200/70`. Hover: `hover:bg-slate-100/60`.
- **Shared LogoMark component** (`src/components/ui/logo-mark.tsx`) — Journey arc SVG, white on teal `#0D9488`, 3 size-progressive nodes. Sizes: `sm` (w-6/13px), `md` (w-8/18px), `lg` (w-10/22px). Replaces old "CX" text square everywhere.
- **Dashboard empty state redesigned** — From flat centered text to headline + 3 output preview cards (Journey Map / CX Report / CX Sprint with custom SVG icons) + "Map my customer journey →" CTA.
- **5-agent logo poll** — 3 Nano Banana generated logos reviewed. #3 (bold exponential arc + size-progressive nodes in teal rounded-square) won 4-1. Brand Expert dissented.
- **LogoMark SVG finalized** — Exponential cubic bezier `d="M 4 18 C 4.5 13 13 7.5 18 4"`, nodes r=2.0 / r=2.8 / r=3.8, strokeWidth=2.2. Path first so nodes sit on top. Committed + pushed (`e7909fc`).

### Files changed
- `src/app/globals.css`, `src/components/nav-header.tsx`, `src/components/ui/logo-mark.tsx` (created), `src/app/page.tsx`, `src/app/dashboard/page.tsx`, `src/app/confrontation/page.tsx`, `src/app/playbook/page.tsx`, `src/app/journey/page.tsx`, `src/app/pricing/page.tsx`

### Next session starts with
- Revenue Protected counter on Dashboard (starts $0, grows with playbook completion — benchmark-based)
- Playbook persistence to Supabase (Phase 4)
- Full regression QA / gatekeeper audit before next demo
- Journey health scoring (P1)

---

## Session — 2026-03-02 (Strategic / Design Session)

### Completed this session
- **Light palette nav + sidebar shipped** — Flipped dark navy (`bg-sidebar`) to white/slate/teal across nav-header, cx-identity-sidebar, sidebar-complete-view, sidebar-building-view, app-shell (mobile drawer + toggle). Teal active states, slate text hierarchy. Committed `f8e75d6`, merged to main, deployed to Vercel.
- **Worktree explained** — `claude/festive-kepler` was a git worktree (isolated branch for safe development). Merged to main and worktree can be cleaned up.
- **Monetization model finalized** — Cross-validated with ChatGPT + Gemini. 4-tier hybrid: Free (full one-time run) / Starter $79/mo OR $149 one-time / Pro $199/mo / Premium $1,200/year. Old $99/$249/$499 model retired. Beta experiment: run both monthly + one-time at Starter to see what users prefer.
- **CX Impact Proof Architecture designed** — 3 layers: (1) Proxy Impact (benchmark-based Revenue Protected counter, no integrations), (2) Pulse Delta (monthly before/after CX Score, Starter), (3) Real Data Validation (HubSpot/Intercom validates benchmarks, Pro). CX Mate captures "before state" at onboarding — unique advantage.
- **CX Score (0-100) designed** — Single trackable number. Stage breakdown. Vertical+maturity benchmarks. Monthly update. Board-friendly. Compounds in value the longer you subscribe.
- **NotebookLM positioned as FREE tier** — "Open in NotebookLM" exports structured markdown (journey + report + playbook). Users create infographics, decks, board summaries → share → brand exposure → new users. Growth mechanic, not paywall.
- **Integration roadmap designed** — Data IN (HubSpot, Intercom, Mixpanel) at Pro tier. Intelligence OUT (NotebookLM Free, Slack/Notion Starter, Board Deck/MCP Server Premium). MCP dramatically reduces integration complexity.
- **CX Mate as MCP Server** — Long-term moat. Premium tier. Any AI tool queries journey/report/playbook via MCP protocol.
- **Vault files updated** — O-output/monetization-strategy-2026-03-02.md created. C-core/product-architecture.md updated (CX Score, Impact Proof, NotebookLM, Integration Architecture). C-core/project-brief.md pricing model updated. M-memory/decisions.md updated with all 11 decisions.

### Two new issues raised (need action next session)
1. **Living CX knowledge base** — The 8-module CX theory engine must be continuously updated with latest CX research, not treated as a one-time build. Process needed: CX Intel Digest → B-brain/INBOX/ → quarterly promotion to knowledge base modules.
2. **NPS / event-triggered polls missing** — No suggestions for NPS surveys, CSAT polls, CES measurement, or event-triggered in-app surveys anywhere in playbook output. P0 gap — a CX platform without measurement suggestions is incomplete. Needs to be added to: journey prompt recommendation engine, playbook action templates, and possibly a dedicated "Measure" action category.

### Next session starts with
- Address the measurement gap: add NPS/CSAT/CES/event-triggered poll suggestions to recommendation engine + playbook templates
- ~~Stripe integration~~ → DONE (Freemius, see 2026-03-06 session)
- Revenue Protected counter on Dashboard (benchmark-based, starts $0, grows with playbook completion)
- "Save My Results" CTA for anonymous users
- Full regression QA (gatekeeper audit)

---

## Session — 2026-03-07 (Intelligence Architecture + Orca AI Reference Output)

### Completed this session

**Intelligence Stack Architecture:**
- **COO impact assessment** — Evaluated whether wizard UX changes (conversational identity, enrichment editor, logo fallback, journey checklist) or intelligence stack work affects pricing model or tier gates. Verdict: pricing model unchanged. Pro tier value expands (Champion tracking + Expectation Gap Alert + Layer 6 full loop). Free tier gains Gemini/NotebookLM export. One flag: "AI stack recommendations" copy is ambiguous — Free = static L3, Pro = live-refreshed L3.
- **Enablement + Marketing layer added** to `O-output/cx-mate-enrichment-layer-architecture.md` — Three tracks: Track A (Customer Messages: stage templates, persona-specific), Track B (Internal CS Enablement: talk tracks, objection handling, QBR deck skeleton), Track C (Marketing Alignment: asset mapping, G2 trigger, referral trigger). Stage-by-stage Enablement Pack format table. Pricing map (Free → Starter → Pro → Premium depth levels). Updated Implementation Priority table.
- **`B-brain/00-architecture/intelligence-stack.md` created** — Condensed operational spec (not narrative). All 7 layers + Enablement layer + moat structure + pricing alignment + implementation priorities. Contains the L4B MEDDPICC fields table and the critical L0 constraint (onboarding MUST feed all journey prompt fields). Source of truth for agents working on the intelligence stack.
- **3 decisions logged** in `M-memory/decisions.md`: (1) pricing model unchanged + Pro tier value expansion, (2) Enablement + Marketing layer decision, (3) B-brain as source of truth for intelligence stack.

**Orca AI Reference Output (full quality demonstration):**
- **`O-output/orca-ai-cx-mate-full-output.md` created** — Full CX Mate output for Orca AI (maritime navigation AI, Israeli) demonstrating all 7 intelligence layers active. Previous result with old system: C+. New result: demonstrates what maritime-specific depth produces.
  - 6 confrontation patterns (Safety Culture Wall, Phantom Metric Problem, MEDDPICC Black Hole, Post-Installation Desert, Champion Departure Crisis, Fleet Bottleneck)
  - Full lifecycle journey map (7 stages, 35 moments)
  - 6 playbook actions with AI prompts, tool recommendations, and templates
  - Full enablement pack (Stage 4 + Stage 6 templates: CS talk tracks + customer email templates)
  - Revenue projections (~$339K at risk, ~$1.05M opportunity) with maritime actuarial methodology
  - Champion Departure Trigger: full 30-day protocol with 4 email templates
  - Intelligence Layer Summary table showing exactly what each layer contributed
- **`O-output/orca-ai-coo-report.md` created** — Polished, client-facing, COO-ready version. Removes all internal meta-commentary and architecture references. Executive consulting level language. Maritime-informed. Designed to be shared directly with the Orca AI COO for validation.

### Key insight from this session
The intelligence stack upgrade (all 7 layers active) turned a "C+" Orca AI output into a document the COO reads and says "how did you know this about us?" The gap was not the AI model — it was the specificity of the inputs: knowing bridge officers resist "monitoring" framing (professional identity, not feature confusion), knowing Fleet Safety Directors average 2-3 year tenures, knowing Lloyd's actuarial data is the ROI language their CFO speaks. This validates the core architecture argument: the moat is in the input system and methodology, not the model.

### Files created/modified this session
- `O-output/cx-mate-enrichment-layer-architecture.md` — Enablement layer added
- `B-brain/00-architecture/intelligence-stack.md` — Created (new source of truth file)
- `M-memory/decisions.md` — 3 new entries
- `O-output/orca-ai-cx-mate-full-output.md` — Created
- `O-output/orca-ai-coo-report.md` — Created

### Next session starts with
- **Homepage clarity**: make it clear what you get (journey + report + playbook) — still pending from earlier
- **Chat-skinned wizard**: approved plan in `~/.claude/plans/quiet-meandering-taco.md` — onboarding-chat-wizard.tsx build
- Revenue Protected counter on Dashboard (benchmark-based)
- Playbook persistence to Supabase (Phase 4)
- Full regression QA / gatekeeper audit before next demo

---

## Session — 2026-03-05 / 2026-03-06 (Pricing + Freemius)

### Completed this session
- **3-tier pricing + content gating** — Built complete tier access system. Free/Full Analysis ($149 one-time)/Pro ($99/mo). `tier-access.ts` (ACCESS_MATRIX), `use-plan-tier.ts` (client hook), `upgrade-gate.tsx` (UpgradeGate + LockedSection). Gating applied to: playbook (limited for free), PDF export (pro only), journey editing (paid), API routes check tier. Pricing page with FAQ. Committed `7d1f04c`.
- **Stripe → Freemius swap (COMPLETE)** — Stripe doesn't operate in Israel (no Bank of Israel clearing license). Evaluated Lemon Squeezy, Paddle, PayPal, Stripe-via-US-LLC. Chose **Freemius** — Israeli-founded Merchant of Record, handles global tax/VAT/compliance, 4.7% fees. Complete code swap across 13 files:
  - NEW `src/lib/freemius.ts` (config, HMAC verification, API helpers, plan tier mapping)
  - DELETED `src/lib/stripe.ts` + uninstalled stripe npm package
  - Rewrote: webhook, create-checkout, verify-session, portal API routes
  - Pricing page: Freemius JS overlay checkout (client-side, no redirect)
  - Updated terms/privacy (Stripe → Freemius references)
  - Updated billing success page
  - Freemius plan IDs: Full Analysis = 42170, Pro = 42172
  - Build passes clean, pricing page verified in dev preview. Committed `50d4c33`.

### Remaining setup (Anat needs to do in Freemius Dashboard)
1. Register webhook URL: Integrations → Webhooks → `https://cxmate.io/api/billing/webhook`
2. Add env vars to Vercel: `NEXT_PUBLIC_FREEMIUS_PRODUCT_ID`, `NEXT_PUBLIC_FREEMIUS_PUBLIC_KEY`, `FREEMIUS_SECRET_KEY`
3. Add DB columns to organizations table: `freemius_license_id`, `freemius_plan_id`, `freemius_subscription_id`

- **Pro tier locked as "Coming Soon"** — Pro features (CX Score, review mining, integrations, Slack) aren't built. Card dimmed, grey badge, CTA → "Notify Me" mailto. Full Analysis is now the clear action. Committed `acb864c`.
- **Homepage: Comparison section added** — "Why now, not later" section with side-by-side consultant vs CX Mate cards + company stage timeline (Pre-launch → Enterprise). Respectful positioning: consultants are for Series B+, CX Mate starts from day one. Validates founder instincts. Committed `5389b29`.

### Design tasks (queued, not started)
- **Homepage comparison placement** — "You don't need to wait until Series B" message is too far down the page (below hero + dark section). Design Agent should rethink placement — this is a key differentiator that should hit earlier. Consider: integrating into hero, moving above dark section, or teaser/hook in hero linking down. Also needs to be part of the marketing campaign narrative.

### Next session starts with
- Complete Freemius setup (webhook URL, Vercel env vars, DB migration)
- Revenue Protected counter on Dashboard
- "Save My Results" CTA for anonymous users
- Measurement gap: NPS/CSAT/CES suggestions in recommendations
- Full regression QA (gatekeeper audit)

---

## Session — 2026-03-08 (P0 fixes + Homepage + Beta GTM)

### Completed this session
- **P0-A: QBR JSON repair** — Added system prompt + 3-level progressive repair chain to `generate-qbr/route.ts`. Matches `generate-journey.ts` battle-tested pattern.
- **P0-B: QBR null guards** — All 6 `.map()`/`.length` calls in `qbr/page.tsx` guarded with `?? []`
- **P0-C: QBR error boundary** — Created `/src/app/qbr/error.tsx` (matches `/journey/error.tsx` pattern)
- **P1-A: Chat route timeout** — Added `/api/onboarding/chat` to `vercel.json` (maxDuration: 60s) + `export const maxDuration = 60` in route file
- **Homepage copy rework** — All generic copy replaced: subhead specific, CTAs = "Map My CX Journey", dark section = "When did you last see what customers see?", How It Works = deliverable-focused, Features = 3 real deliverables + Live Intelligence, Bottom CTA = "Your customers already have an experience..."
- **Branch hygiene** — All work committed to `preview/onboarding-chat` + merged to `main` + pushed. Vercel auto-deploys from `main`.
- **Beta GTM output** — 3 documents created in `O-output/`:
  - `beta-icp-target-list.md` — ICP profile, 6 verticals, 20 target company profiles, 5-source research method
  - `beta-tester-outreach-sequence.md` — Full 3-touch cold sequence (LinkedIn + email), warm intro templates, 4-touch post-signup FU, 30-min feedback call script
  - `low-radar-campaign.md` — 3-channel stealth campaign: 6 ready-to-post LinkedIn posts (fully written), 4 community post variants, 45-touch DM outreach plan, 3-week calendar

### New skills registered
- **`prd`** — Modern Product Brief generator. Teresa Torres Opportunity Solution Trees + Shape Up pitches + Amazon PR/FAQ. Invoke: "write a brief for X", "scope this feature", "pitch this idea".
- **`adhd`** — ADHD Co-Pilot. Registered from canonical source at `T-tools/01-skills/ADHD_Co-pilot/adhd-copilot-SKILL.md`. Operational copy at `.claude/skills/adhd/SKILL.md`. Wired into morning routine (Step 0 — Brain Dump Buffer before status report) and Session Contract close (Step 5).

### Morning routine upgraded
- **ADHD Co-Pilot integrated** into `T-tools/03-workflows/morning-routine-workflow.md`: Step 0 (Brain Dump Buffer before COO status report) + Session Contract after Morning Brief (Step 5). COO Session Start Checklist updated in `A-agents/coo-agent.md`: Step 0 + Step 9 reference `/adhd`.
- **Anti-patterns added**: "Don't skip the brain dump" + "Don't skip the session contract".

### Deferred
- Sign-up gate (name + email requirement) — Anat deferred, revisit later

### P0-D still open (decision needed)
- `GATES_DISABLED = true` in `lib/tier-access.ts` — billing gates bypassed in production. Needs Anat's call before demo with paying prospects.

### Next session starts with
- **ADHD Co-Pilot runs first** — Brain Dump Buffer before anything else. That's the new standard.
- Anat executes beta GTM outreach (docs ready in O-output/)
- P0-D decision: enable billing gates for demo or leave open?
- P2-A: Add CX Review (/qbr) to nav header
- Homepage: consider moving comparison section higher (currently buried below dark section)
