# CX Mate — Demo Account Setup

**Demo account:** demo@cxmate.app
**Demo company:** Flowdesk (fictional B2B project management SaaS)

This guide covers: (1) creating the demo account, (2) running onboarding with the exact calibrated inputs, (3) resetting when needed.

---

## Why Flowdesk?

- **Universally relatable** — everyone knows project management tools, no niche knowledge required
- **Growing stage** — 80 employees, ~$3M ARR, real customers → triggers the richest journey path (business data + existing journey questions + full lifecycle)
- **Pain is obvious and recognizable** — trial-to-paid drop-off, Day 30 churn → generates high-impact recommendations the audience immediately understands
- **Competitors are household names** — Asana, Monday.com, ClickUp → audience nods along, understands differentiation
- **Revenue impact will be compelling** — ~300 customers × $4K average = $1.2M ARR. Journey fixing 20% churn = $240K recovered. That number lands.

---

## Step 1 — Create the Demo Account

1. Go to `https://[your-domain]/auth`
2. Switch to **Sign Up** mode
3. Enter:
   - Email: `demo@cxmate.app`
   - Password: *(choose a strong password — store it in 1Password or your password manager)*
4. Click **Sign Up**

> **Tip:** If you need to reset the password and the email isn't real, go to **Supabase Dashboard → SQL Editor** and run:
> ```sql
> UPDATE auth.users
> SET encrypted_password = crypt('YourNewPassword!', gen_salt('bf'))
> WHERE email = 'demo@cxmate.app';
> ```

---

## Step 2 — Run the Onboarding (Exact Inputs)

Log in as demo@cxmate.app, go to `/onboarding`, click **Map my journey →**, then fill in **exactly** the following. Every field is calibrated for maximum demo output quality.

---

### Step 1 — Welcome

| Field | Value |
|---|---|
| Your name | Alex Rivera |
| Your email | demo@cxmate.app |
| Your role | Head of Product |
| Company name | **Flowdesk** |
| Company website | flowdesk.io |

> *Why "Head of Product"?* → generates strategic language, not CS-ops language. More founder-adjacent.

---

### Step 2 — Company

| Field | Value |
|---|---|
| Vertical | B2B SaaS |
| Company size | 51–200 employees |
| Industry | Project Management / Productivity |

---

### Step 3 — Stage (Maturity)

**Select:** Growing

> *Why?* → Unlocks the business data step, journey existence step, and full lifecycle path. Generates the richest, most impressive output.

---

### Step 4 — Existing Journey

**Has an existing journey?** → **We have some pieces, but it's not complete**

**What do you have in place? (check these):**

*Pre-sale:*
- ✅ Sales pipeline / CRM stages
- ✅ Demo or trial process

*Onboarding:*
- ✅ Onboarding checklist / milestones

*Ongoing Success:*
- ✅ Support / escalation flow

*Leave all others unchecked.*

**What's working well? (green chips — select these):**
- ✅ Sales → CS handoff is smooth
- ✅ Onboarding is self-serve / low-touch
- ✅ Support is fast and responsive

**What needs fixing? (red chips — select these):**
- ✅ Customers don't reach 'aha moment'
- ✅ Low product adoption after onboarding
- ✅ Churn spikes at month 3–6
- ✅ No early warning on at-risk accounts

*(Skip file upload — not needed for demo)*

---

### Step 5 — Customer Profile

| Field                | Value                                                                                                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Customer size        | SMBs (10–200 employees)                                                                                                                                                                    |
| Customer count       | 201–500 customers                                                                                                                                                                          |
| Customer description | "Teams and companies that manage client work, product delivery, or internal operations. They come in on a free trial, activate on Day 1, and we lose them before they hit the aha moment." |
| Main channel         | Product-led growth (self-serve + sales assist)                                                                                                                                             |
| Pre-live process     | "Free trial → onboarding email sequence → optional sales call for teams 20+ → upgrade prompt at Day 14"                                                                                    |

---

### Step 6 — Competitors

Enter one by one or comma-separated:
> `Asana, Monday.com, ClickUp, Notion, Linear`

---

### Step 7 — Business Numbers

| Field | Value |
|---|---|
| Average deal size | $2,000–$10,000/year |
| Pricing model | Freemium + subscription tiers |
| Rough ARR | $1M–$5M |
| Current tools | HubSpot, Intercom, Mixpanel, Stripe, Notion |

---

### Step 8 — Pain Points

**Biggest challenge** (free text):
> "We're losing ~40% of trial users before converting, and another 20% in the first 60 days after they pay. We know the problem is in the activation window but we don't know exactly where it breaks."

**Select pain points:**
- ✅ Trial-to-paid conversion is too low
- ✅ Customers leaving without warning (invisible churn)
- ✅ Onboarding takes too long before customers see value
- ✅ High support volume in the first 90 days

---

### Step 9 — Goals

**Primary goal:**
> Reduce first-90-day churn by 30%

**Timeframe:**
> 3–6 months

**Additional context:**
> "We have a good product — NPS from users past 90 days is 42. The problem is people never getting there. If we can fix the first 90 days, everything compounds."

---

### Step 10 — Generate

Click **Build My CX Playbook →** and wait ~2–5 minutes.

---

## Step 3 — Verify the Output

1. Verify the CX Report shows:
   - Revenue impact number in the **$100K–$500K range** ✅
   - At least 3 high-risk patterns ✅
   - "Trial activation" or "Day 30" moments visible ✅
2. Navigate to **Journey Map** → verify stages load, moments visible
3. Go to **Playbook** → click **Generate Playbook** → wait for recommendations
4. Verify playbook has action items across multiple stages

> **If the revenue number looks too low:** Re-run with `roughRevenue: $3M-$5M` selected and `customerCount: 501-1000`. This gives more weight to the impact calculator.

---

## Step 4 — The "Wow Moments" to Find

After generation, note these specific outputs to reference in the demo:

1. **Revenue impact headline** — the `$X–$Y annual impact` number on the CX Report hero card. Write this down — mention it by name during the demo.
2. **The activation moment** — look for a moment tagged "Trial → Activation" or "Day 1 login" in the Journey Map. This is the crux of Flowdesk's problem.
3. **The 48-hour nudge** — look for a specific recommendation about a 48-hour re-engagement email. If it appears, highlight it — it's a specific, named, evidence-backed recommendation. That specificity is the demo wow.
4. **The competitor insight** — look for a differentiation note about Monday.com or Asana. Read it aloud — the fact that the AI knows their competitors' weaknesses and uses that to design the journey is memorable.

---

## Resetting the Demo Account

When you need to regenerate (after a product update, or if the output feels stale):

1. Log in as demo@cxmate.app
2. Go to `/onboarding`
3. Re-run with the same inputs above
4. The new journey will overwrite the previous one in Supabase

> **Note:** Currently, running onboarding again creates a NEW journey_template record. The old one is not deleted. The app will load the most recent one. This is fine for demo purposes.

---

## Demo Account Credentials — Store Safely

| Item | Value |
|---|---|
| Email | demo@cxmate.app |
| Password | *(set by you — do not write here — store in 1Password)* |
| Account type | Supabase Auth |
| Journey company | Flowdesk |
| Last regenerated | 2026-03-05 |

---

## Pre-Demo Checklist (Specific to This Account)

- [ ] Log in as demo@cxmate.app on the device you'll use for the demo
- [ ] Navigate to Dashboard — verify company name "Flowdesk" shows
- [ ] Navigate to CX Report — note the exact revenue impact number
- [ ] Navigate to Journey Map — verify at least 5 stages loaded
- [ ] Navigate to Playbook — verify recommendations are generated (not in "generate" state)
- [ ] Write down the 4 "wow moments" above so you can navigate to them smoothly
- [ ] Keep all 4 tabs open in the browser (Dashboard, CX Report, Journey, Playbook)
- [ ] Do NOT have DevTools open during the demo
- [ ] Do NOT be logged into any other account in the same browser session
