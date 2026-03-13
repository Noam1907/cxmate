# Gate Alert System — Spec & Implementation

## Problem
When a beta tester enters an invite code but the gate fails on OUR side (Supabase unreachable, missing env vars, query exception), they see "Invalid code" and assume their code is wrong. We have zero visibility into these server-side failures.

## Decision: Use Existing Resend Notification Pattern

### Options Evaluated
| Option | Infra Required | Verdict |
|--------|---------------|---------|
| **A: Resend email alert** | Already configured (RESEND_API_KEY + DIGEST_EMAIL) | **CHOSEN** — zero new infra, matches `/api/notify` pattern |
| B: Supabase `gate_errors` table | New migration, new table, needs a way to check it | Overhead for something that should be rare |
| C: PostHog custom event | PostHog analytics is client-side only (`typeof window === "undefined"` guard) | Would need server-side PostHog SDK — not worth it |

### Why Resend
- `/api/notify/route.ts` already uses Resend to email Anat on signups, onboarding starts, and journey completions
- Same env vars: `RESEND_API_KEY`, `DIGEST_EMAIL`
- Same visual style (CX Mate branded HTML email)
- Fire-and-forget pattern — never blocks the user response

## Implementation (Done)

### File Changed
`src/app/api/gate/route.ts`

### What Changed
Added `notifyGateError(reason, details?)` — a fire-and-forget function that emails Anat via Resend when a server-side failure occurs.

### Three Alert Points

| # | Failure | Alert Reason | Details |
|---|---------|-------------|---------|
| 1 | `getAdminClient()` returns null | "Missing env vars" | Which vars are missing |
| 2 | Supabase query error (NOT `PGRST116`) | "Supabase query error" | Error code + message |
| 3 | Catch block (unhandled exception) | "Unhandled exception" | Error message |

### What Does NOT Trigger an Alert
- Invalid codes (PGRST116 = "no rows returned" from `.single()`) — this is expected behavior
- Expired/maxed-out codes — also expected
- Missing input (400 response) — client-side validation issue

### Email Format
- Subject: "Gate failure: {reason}"
- Red header ("Beta Gate -- Server Error")
- Reason + technical details + Israel-timezone timestamp
- Sent from: `CX Mate Alerts <onboarding@resend.dev>`

### Safety Guarantees
- `notifyGateError()` is fire-and-forget (`.catch(() => {})`)
- If Resend env vars are missing, silently returns (no error)
- Never blocks the user response — the 401 "Invalid code" always returns immediately
- User experience is identical whether the alert sends or not
