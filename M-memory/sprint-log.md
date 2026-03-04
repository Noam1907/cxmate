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

### Sprint 4: Beta Launch (Weeks 7-8) ← CURRENT

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
| PostHog analytics integration | DevOps Agent | P0 | Pending |
| Stripe integration + pricing page | Backend Dev | P0 | Done ✅ |
| Beta invite system | Growth Agent | P0 | Pending |
| Full regression QA (gatekeeper audit) | QA Gatekeeper | P0 | Pending |
| Journey health scoring | AI Engineer | P1 | Pending |
| Journey editing | Frontend Dev | P1 | Pending |
| Security audit | Tech Lead | P1 | Pending |
| Load testing | DevOps Agent | P2 | Pending |
| MCP research pipeline spike | AI Engineer | P2 | Sprint 5 |
| Curated email template library | CX Architect | P2 | Deferred |

### Sprint Notes
- 2026-02-27: **Sprint 4 kickoff.** Agent system overhauled (17 agents, Strategic Decision Team added, all C-core files complete). Demo-critical fixes shipped: error boundaries on all routes, vercel.json updated, console.log cleaned. Build passes clean. First beta demo Sunday 2026-03-01.
- 2026-02-27: **Next session should start with:** Full end-to-end demo run-through (anonymous preview flow). Then PDF export. Then "Save My Results" CTA. Keep gatekeeper running before every demo.

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
- Stripe integration (Starter tier first: $79/mo + $149 one-time, two Stripe products)
- Revenue Protected counter on Dashboard (benchmark-based, starts $0, grows with playbook completion)
- "Save My Results" CTA for anonymous users
- Full regression QA (gatekeeper audit)
