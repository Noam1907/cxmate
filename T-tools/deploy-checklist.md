# CX Mate — Deployment & Verification Checklist

> **Rule: Nothing goes to testers until this checklist passes.**
> This is proactive, not reactive. Every deploy. No exceptions.

---

## Quick Commands

```bash
# After any deploy — run the full verification
npm run verify

# Before deploying — check types compile
npm run build

# Deploy + verify in one command
npm run deploy

# Check local dev environment
npm run verify:local
```

---

## Pre-Deploy Checklist (Before `vercel --prod`)

### 1. Code Quality
- [ ] `npm run build` passes — no TypeScript errors
- [ ] No `console.log` left in committed code (use `console.error` for real errors)
- [ ] New env vars added to BOTH `.env.local` AND Vercel (`vercel env add`)

### 2. Env Var Safety (The #1 Source of Production Bugs)
- [ ] **No trailing newlines** — use `printf 'value' | vercel env add` (NOT `echo`)
- [ ] **NEXT_PUBLIC_ vars require redeploy** — they're baked at build time
- [ ] **Verify character accuracy** — copy-paste tokens, don't retype (O vs 0, l vs 1)
- [ ] All required vars are set:
  - `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
  - `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role
  - `CX_MATE_ANTHROPIC_API_KEY` — Claude API key
  - `NEXT_PUBLIC_POSTHOG_KEY` — PostHog project token (starts with `phc_`)
  - `NEXT_PUBLIC_POSTHOG_HOST` — PostHog host
  - `RESEND_API_KEY` — Resend email API key
  - `DIGEST_EMAIL` — Alert recipient email
  - `NEXT_PUBLIC_APP_URL` — App URL

### 3. Feature Flags
- [ ] New features behind flags if not ready for testers
- [ ] Error boundaries wrap new components

---

## Post-Deploy Verification (After `vercel --prod`)

### Automated — Run `npm run verify`
The script checks:
1. ✅ Homepage loads and contains "CX Mate"
2. ✅ `/api/health` — all 6 services verified (Supabase, DB, Claude, Resend, PostHog, App URL)
3. ✅ Auth page loads
4. ✅ Journey API route responds
5. ✅ Notify API route responds

**If ANY check fails → fix before sharing with testers.**

### Manual Smoke Test (Before Demos)
1. Open `https://cx-mate.vercel.app` in incognito
2. Click "Start free" → verify onboarding loads
3. Log in with test account → verify dashboard loads with data
4. Check PostHog → verify events are flowing

---

## Adding New Env Vars — The Safe Way

```bash
# 1. Add to .env.local for local dev
echo 'NEW_VAR=value' >> .env.local

# 2. Add to Vercel — use printf, NOT echo (avoids newline)
printf 'value' | npx vercel env add NEW_VAR production

# 3. If it's a NEXT_PUBLIC_ var, you MUST force redeploy
npx vercel --prod --force

# 4. Verify
npm run verify
```

---

## What Went Wrong Today (2026-03-04) — Lessons

| Issue | Root Cause | How We Prevent It |
|-------|-----------|-------------------|
| PostHog showing no events | API token had `0` (zero) instead of `O` (letter) | Health check validates token format + connectivity |
| Resend notifications skipped | Env vars not set on Vercel | Health check flags missing env vars |
| PostHog key had trailing newline | Used `echo` instead of `printf` for env var | Documented safe `printf` pattern |
| Login "connection error" | Transient network/Supabase cold start | Added automatic retry (3 attempts with backoff) |
| `NEXT_PUBLIC_` vars not updating | Didn't know they need a rebuild | Deploy script always uses `--force` |

---

## Emergency: Something Broke in Production

```bash
# 1. Check what's wrong
curl https://cx-mate.vercel.app/api/health | jq .

# 2. Check Vercel env vars
npx vercel env ls production

# 3. If an env var is wrong, fix it
npx vercel env rm BAD_VAR production -y
printf 'correct-value' | npx vercel env add BAD_VAR production

# 4. Redeploy with force (needed for NEXT_PUBLIC_ vars)
npx vercel --prod --force

# 5. Verify
npm run verify
```

---

## COO Session End Protocol

Before ending any work session:
1. Run `npm run verify` — confirm production is healthy
2. Update `M-memory/sprint-log.md` with what was done
3. Note any warnings from health check that need follow-up
4. If anything is degraded, fix it or flag it clearly for next session
