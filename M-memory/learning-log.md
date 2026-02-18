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

---

## Iteration Log

*Add entries below after each work session*

---

## Version History

| Date | Update | By |
|------|--------|-----|
| 2026-02-16 | Project initialized from architecture blueprint | System |

---

*This is a living document. Every session makes us better.*
