# CX Mate - Learning Log

This is the team's collective memory. Every agent reads this before working.

---

## How This Works

**Before working:** Every agent reads the relevant sections
**After working:** Log patterns from each session
**Periodically:** Consolidate insights into core files

---

## Active Patterns

- **shadcn/ui v4 requires CSS file first**: The `shadcn init` command needs `globals.css` with `@import "tailwindcss"` to exist before running. Create the CSS file before initializing.
- **Supabase SSR pattern**: Three client files needed — `client.ts` (browser), `server.ts` (server components/actions), `middleware.ts` (session refresh). Follow the official `@supabase/ssr` pattern.
- **RLS via JWT claims**: Use `auth.jwt() -> 'app_metadata' ->> 'org_id'` for row-level security policies. Org ID must be set in user's app_metadata on signup.
- **DB persistence requires full chain**: Can't wire any single table to Supabase without the full auth → org → journey_template → stages → moments → recommendations chain. Plan this as one Sprint 3 initiative, not piecemeal.
- **localStorage > sessionStorage for MVP state**: sessionStorage clears on tab close. localStorage persists across sessions. Use localStorage for anything the user would be frustrated to lose (playbook progress, preferences).
- **Claude JSON output needs repair logic**: Claude sometimes returns malformed JSON (trailing commas, unescaped control characters). Always wrap JSON.parse in try/catch with a repair step: strip trailing commas before `}` and `]`, replace control characters with escape sequences.
- **API calls need client-side timeouts + error UX**: Journey generation takes ~2.8min (8192 max tokens). Client-side AbortController timeout must be longer than expected API time. Always show error messages to the user and re-enable the submit button on failure.
- **Nav header: hide on marketing/onboarding, show on app pages**: Use `usePathname()` to conditionally render. The nav adds no value during onboarding but is critical for app navigation after journey is generated.

---

## Iteration Log

*Add entries below after each work session*

### 2026-02-19 — Product Evolution: Two Paths + CX Mate Persona
- Dynamic wizard steps via `useMemo` + computed `steps` array based on `hasExistingCustomers` — no more hardcoded step indices
- Validation map pattern (`Record<StepKey, (data) => boolean>`) scales better than switch/case for growing step counts
- When branching steps change step count, must clamp `step` index to prevent out-of-bounds rendering
- When toggling hasExistingCustomers OFF, reset business data fields (pricingModel, roughRevenue, averageDealSize) to prevent stale data
- `buildProfileFromOnboarding` maps string range values to midpoint numbers (e.g., "1k_5k" → 3000) for impact calculations
- Prompt v3 structure: persona → company context → analysis mode → CX maturity → business data → CX intelligence → task + output format
- Key UX insight: labels should adapt to user state ("your typical customer" vs "your target customer")

### 2026-02-19 — Sprint 3 kickoff: Dashboard + UX Polish
- Built dashboard page from scratch (stats, playbook progress, top risks, quick nav)
- Added global navigation header with active state highlighting
- Full UX review walkthrough uncovered: stuck Generate button, JSON parsing failures, missing navigation
- Fixed all issues: error display, AbortController timeout, JSON repair, nav header
- Key insight: always do a full flow walkthrough before building new features

### 2026-02-19 — Auth + DB Persistence Pipeline
- **Supabase v2 Database type needs `Relationships` + `Views/Functions/Enums/CompositeTypes`**: Without these, `.from("table").insert()` resolves to `never` type. Add `Relationships: []` to each table and empty mapped types for Views/Functions/Enums/CompositeTypes.
- **Admin client uses `@supabase/supabase-js` directly** (not `@supabase/ssr`): The service role client doesn't need cookie handling — it bypasses RLS entirely. Use `createClient<Database>()` from the base package.
- **Org creation must happen server-side with service role**: RLS policies check `org_id` in JWT claims, but during signup the user has no org_id yet. Use admin client to create org and set `app_metadata.org_id`.
- **Dual-mode pattern**: Keep sessionStorage as the "always works" path. API fetch is the "persistent" path. Pages check templateId: `"preview"` → sessionStorage, real UUID → `GET /api/journey/[id]`. Always fall back to sessionStorage if API fails.
- **`useSearchParams()` requires Suspense boundary**: Next.js 16 enforces this during static generation. Wrap components using `useSearchParams()` in a Suspense boundary.
- **Route protection with preview mode**: Middleware can't check sessionStorage (server-side). Instead, check for `?id=preview` query param to allow unauthenticated access. Dashboard and playbook pages always allowed through — they handle their own empty states.
- **JSONB backup + normalized tables**: Store the full `GeneratedJourney` in `journey_templates.stages` as JSONB for easy reconstruction. Also insert into normalized `journey_stages` + `meaningful_moments` for queryability. `loadJourney()` tries JSONB first, falls back to table reconstruction.

### 2026-02-21 — Company Auto-Enrichment + Product Vision

- **Website fetching in Next.js API routes**: Use standard `fetch()` with a short timeout (8s) and abort controller. Strip HTML aggressively: remove `<script>`, `<style>`, `<nav>`, `<footer>`, `<svg>`, `<img>` tags, then all remaining HTML tags. Decode entities. Cap at ~3000 chars for prompt efficiency.
- **Enrichment as "background async" pattern**: Trigger enrichment on step transition (not on every keystroke). Fire `enrich()` when user clicks Continue from welcome step. By the time they reach step 2, results are usually back (~3-5 seconds). If slow, step works normally — enrichment is purely additive.
- **Pre-fill only empty fields**: When enrichment returns, only apply values to fields the user hasn't manually filled. Use a ref (`enrichmentApplied`) to prevent re-applying enrichment on re-renders. Never override user input with AI suggestions.
- **"AI-suggested" badge pattern**: Small inline pill badge (`text-[10px] bg-primary/8 text-primary rounded-full`) next to labels. Show when the current field value matches the enrichment suggestion. Disappears naturally when user changes the value.
- **Competitor chips > textarea**: Chips provide better UX than a textarea for lists of items. Each chip has an × button for removal. An input + "Add" button lets users add their own. Parse/serialize to comma-separated string for backward compatibility with the `competitors: string` field.
- **Pass enrichment to journey prompt**: The enrichment data (description, reasoning, confidence) enriches the journey generation prompt with real company context. But always tell Claude to prefer user-provided data over enrichment data when they conflict.
- **Enrichment API is cheap**: ~300 input tokens for the prompt, ~200 output tokens. Sub-$0.01 per call. No need for caching in MVP — direct Claude call every time. Add caching later if volume justifies it.
- **Product insight: target audience is stage-based, not size-based**: "Companies that haven't hired a CX expert yet" is the real ICP, not "5-300 employees." A 600-person company with no formal CX is a perfect customer.

---

## Version History

| Date | Update | By |
|------|--------|-----|
| 2026-02-16 | Project initialized from architecture blueprint | System |

---

*This is a living document. Every session makes us better.*
