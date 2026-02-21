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
