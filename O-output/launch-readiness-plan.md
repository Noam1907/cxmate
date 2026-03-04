# CX Mate — Launch Readiness Plan
*Shoval, COO · 2026-03-04*

All gaps between "product works" and "real company exists publicly." Organized by priority tier.

---

## Tier 1 — Legal Blockers (Ship Before Any Public Link Goes Out)

These are required by law before you send anyone to the product.

| Gap | Owner | Effort | Notes |
|-----|-------|--------|-------|
| `/privacy` — Privacy Policy | Growth Agent | 2h | Covers: what data collected, Supabase storage, cookie usage, Claude API data handling, right to delete. Use Termly or Iubenda to generate, customize for CX Mate. |
| `/terms` — Terms of Service | Growth Agent | 2h | Covers: acceptable use, AI output disclaimer ("not professional CX advice"), payment terms, refund policy. |
| Cookie consent banner | Frontend Dev | 1h | GDPR-compliant banner on first visit. PostHog has a built-in consent mode. Netlify/Vercel doesn't exempt you from GDPR just because you're in the US. |
| Footer links on landing page | Frontend Dev | 30m | Add Privacy · Terms to footer. Currently footer only shows tagline. |

**Where to add links:** `/privacy` and `/terms` should be linked from:
- Landing page footer
- Auth page (sign-up "I agree to Terms" checkbox)
- Pricing page

---

## Tier 2 — Domain & Email Infrastructure (Day 1 of Beta)

Without this, every email looks like spam and every link looks unprofessional.

| Gap | Owner | Effort | Notes |
|-----|-------|--------|-------|
| **Domain purchase** | Anat (action needed) | 30m | Recommendation: `cxmate.io` (clean, tech-forward). Check: `cxmate.app`, `getcxmate.com`. Register via Namecheap or Google Domains. Avoid `.co` for B2B — looks partial. |
| **Vercel custom domain** | DevOps Agent | 30m | Add domain to Vercel project → verify DNS → auto SSL. Update `NEXT_PUBLIC_APP_URL` env var on Vercel. |
| **Professional email** | Anat (action needed) | 1h | Options: Google Workspace ($6/mo, `hello@cxmate.io`) or Zoho Mail (free tier). Minimum setup: `hello@cxmate.io`, `anat@cxmate.io`. Forward `support@`, `billing@` aliases. |
| **Update auth emails** | Backend Dev | 30m | Supabase sends auth emails from noreply@supabase.io by default. Configure custom SMTP so "Confirm your email" comes from `hello@cxmate.io`. |
| **Update env vars** | DevOps Agent | 15m | `NEXT_PUBLIC_APP_URL=https://cxmate.io` on Vercel. Supabase auth redirect URLs updated from localhost. |

---

## Tier 3 — Brand Presence (Before First External Demo)

What exists when someone Googles you after meeting you.

### About Page `/about`
| Section | Content |
|---------|---------|
| Mission | 2-3 sentences. "CX Mate exists because..." |
| The problem we solve | The gap between gut-feel and enterprise CX. |
| How it works | 3-step diagram (same as landing page) |
| Who built it | Anat — photo, LinkedIn, 2-3 sentences on background. Optional: founding story. |
| CCXP methodology | Brief mention of the methodology backbone — builds trust. |
| CTA | "See what your journey looks like" → /onboarding |

**Owner:** Copywriter + Frontend Dev | **Effort:** 3h total

### LinkedIn Company Page
| Step | Notes |
|------|-------|
| Create page | `linkedin.com/company/cx-mate` or `cxmate` |
| Cover image | 1128×191px. Design: sage background, logo, tagline. |
| Logo | Use existing logomark (export as PNG square) |
| Tagline | "AI-powered CX for B2B companies without a CX team." |
| About section | 2 paragraphs. Mirror landing page subheadline. Include keywords: customer journey, B2B SaaS, CX strategy. |
| First 3 posts | (1) Founding story post, (2) Beta launch post (existing draft), (3) "What is CX Mate" explainer |
| Connect to personal | Anat sets CX Mate as current employer on personal LinkedIn |

**Owner:** Growth Agent (copy) + Anat (creates page — this is an account creation action) | **Effort:** 2h

---

## Tier 4 — SEO & Social Sharing (Before Public ProductHunt Launch)

What happens when someone shares your link.

| Gap | Owner | Effort | Notes |
|-----|-------|--------|-------|
| **OG Image** | Design Agent | 2h | 1200×630px image for when `cxmate.io` is shared on LinkedIn/Slack/Twitter. Should include: logo, headline, sage bg. Currently: no OG image = ugly gray box on share. |
| **Meta tags** | Frontend Dev | 1h | Add `<title>`, `<meta description>`, `<og:title>`, `<og:description>`, `<og:image>`, `<twitter:card>` to all pages. Currently missing on inner pages. |
| **Favicon** | Design Agent | 30m | The logomark should be the favicon. Export as `favicon.ico` (32x32) + `apple-touch-icon.png` (180x180). Add to `/public/`. |
| **Sitemap** | DevOps/Frontend | 30m | `src/app/sitemap.ts` → Next.js auto-generates sitemap. Submit to Google Search Console. |
| **robots.txt** | DevOps/Frontend | 15m | `src/app/robots.ts` → disallow `/api`, `/auth`, `/billing`, `/reset`. Allow all landing + public pages. |

---

## Tier 5 — Product Launch Completeness (Sprint 4 Existing + New)

Existing Sprint 4 gaps already in the log + what's newly identified:

| Gap | Owner | Priority | Status |
|-----|-------|----------|--------|
| PostHog analytics | DevOps Agent | P0 | Pending — nothing tracked in production yet |
| Beta invite system | Growth Agent | P0 | Pending — how do beta users get in? |
| PDF export | Frontend Dev | P0 | Pending — demo differentiator |
| Playbook persistence | Backend Dev | P0 | Pending |
| "Save My Results" banner | Frontend Dev | P0 | Pending |
| Full regression QA | QA Gatekeeper | P0 | Pending |
| **Pricing page audit** | Product Lead | P1 | `/pricing` exists — needs copy review vs voice-dna |
| **Welcome email** | Growth Agent | P1 | What does the first email say after signup? |
| **Beta onboarding email sequence** | Growth Agent | P1 | Day 0, Day 3, Day 7 nudges |
| **Supabase SMTP** (custom email) | Backend Dev | P1 | Currently sends from Supabase domain |
| Demo account / seeded journey | DevOps Agent | P2 | For demos without needing to run 5-min onboarding live |
| Security audit | Tech Lead | P2 | Pending |

---

## Tier 6 — Future (Post-Beta Launch)

Not needed for beta. Plant the flag.

| Item | Notes |
|------|-------|
| Twitter/X `@cxmate_io` | Reserve the handle now even if not posting yet |
| ProductHunt page | Prepare assets. Launch timing: after 10+ beta users with feedback. |
| G2 / Capterra profile | After first 5-10 paying customers |
| YouTube / Loom demo video | 90-second walkthrough. High leverage for async demos. |

---

## The Launch Sequence

**Week 1 (Infrastructure):**
1. Domain purchase → Vercel custom domain → email setup
2. Privacy Policy + Terms pages
3. Cookie consent banner
4. OG image + meta tags

**Week 2 (Brand):**
5. LinkedIn company page
6. About page
7. Favicon + sitemap + robots.txt

**Week 3 (Product completeness — parallel with above):**
8. PostHog live
9. Beta invite system
10. PDF export
11. "Save My Results" CTA
12. Welcome + nurture emails

**Week 4 (QA + Launch):**
13. Full gatekeeper audit
14. Beta launch post
15. ProductHunt prep

---

## What Anat Needs to Do Personally

(These can't be delegated to agents — require account creation / payment)

1. **Buy the domain** — recommend `cxmate.io`. ~$20/yr at Namecheap.
2. **Set up Google Workspace** — for `anat@cxmate.io`, `hello@cxmate.io`. ~$6/mo.
3. **Create LinkedIn company page** — agents write the copy, Anat creates the page.
4. **Configure Supabase custom SMTP** — needs SendGrid/Resend API key (Resend has generous free tier).

---

*Saved to O-output/launch-readiness-plan.md · 2026-03-04*
