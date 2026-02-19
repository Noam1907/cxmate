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

---

## Version History

| Date | Update | By |
|------|--------|-----|
| 2026-02-16 | Project initialized from architecture blueprint | System |

---

*This is a living document. Every session makes us better.*
