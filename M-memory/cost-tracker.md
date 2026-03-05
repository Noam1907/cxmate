# CX Mate — Service Cost & Credits Tracker

Updated weekly (every Monday or first session of the week).
**Flag to Anat immediately if any service hits 80% of quota or shows unexpected spike.**

---

## Current Plan Summary

| Service | Plan | Monthly Cost | Limit / Quota |
|---------|------|-------------|---------------|
| Vercel | Pro (assumed) | ~$20/mo | Check dashboard |
| Supabase | Free / Pro | $0–$25/mo | 500MB DB, 50k MAU (free) |
| Anthropic API | Pay-per-use | Variable | No hard limit — monitor spend |
| Stripe | Pay-per-use | 2.9% + 30¢ per txn | N/A |
| PostHog | Free / Scale | $0–$450/mo | 1M events/mo (free) |
| Resend / SendGrid | Free | $0 | 100 emails/day (Resend free) |

---

## Weekly Log

### Week of 2026-03-03 (first entry)

| Service | Status | Usage | Notes |
|---------|--------|-------|-------|
| Vercel | ⚠️ LOW CREDITS | Unknown | Anat received credits-running-low email 2026-03-05. **Check dashboard immediately.** |
| Supabase | Unknown | Unknown | First check pending |
| Anthropic API | Unknown | Unknown | Each journey ~4k–8k tokens in + ~8k tokens out. ~$0.05–$0.15 per generation |
| Stripe | OK | 0 txns | Beta — no paid conversions yet |
| PostHog | Unknown | Unknown | First check pending |
| Resend | Unknown | Unknown | First check pending |

---

## Action Items

- [ ] **Anat: Check Vercel dashboard NOW** — credits running low (email received 2026-03-05)
- [ ] COO: Run first full cost check next session start
- [ ] DevOps: Set up Vercel spend alert at 80% threshold
- [ ] DevOps: Set up Anthropic API spend alert (Anthropic dashboard → Limits)

---

## Cost Benchmarks (per CX Mate operation)

| Operation | Model | Approx tokens | Approx cost |
|-----------|-------|--------------|-------------|
| Journey generation | claude-sonnet-4-20250514 | ~12k in + 8k out | ~$0.10 |
| Playbook generation | claude-sonnet-4-20250514 | ~10k in + 4k out | ~$0.07 |
| Company enrichment | claude-sonnet-4-20250514 | ~3k in + 0.5k out | ~$0.01 |
| Full onboarding (journey + playbook + enrichment) | — | — | ~$0.18 total |

*Prices based on Sonnet 4 at $3/M input, $15/M output tokens.*
