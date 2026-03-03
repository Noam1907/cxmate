# CX Mate — 24-Month Income Model

> Generated: 2026-03-03 | Pre-package finalization analysis
> Purpose: Model revenue scenarios before locking pricing tiers

---

## Pricing Inputs

| Tier | Monthly | Annual | One-Time | Notes |
|------|---------|--------|----------|-------|
| **Free** | $0 | — | — | Full one-time run, PDF + NotebookLM export |
| **Starter** | $79/mo | — | $149 | Dual pricing experiment |
| **Pro** | $199/mo | — | — | Integrations + competitive monitoring |
| **Premium** | — | $1,200/yr | — | Board deck, multi-seat, MCP server |

---

## Key Assumptions

### Acquisition
| Parameter | Month 1-6 | Month 7-12 | Month 13-18 | Month 19-24 |
|-----------|-----------|------------|-------------|-------------|
| New free signups/mo | 80 | 200 | 400 | 700 |
| Free → Paid conversion | 8% | 12% | 15% | 18% |
| Paid acquisition source | Content + LinkedIn | + Referrals + SEO | + Partnerships | + Virality |

### Tier Distribution (of new paid users)
| Tier | Month 1-6 | Month 7-12 | Month 13-18 | Month 19-24 |
|------|-----------|------------|-------------|-------------|
| Starter (monthly) | 55% | 45% | 35% | 30% |
| Starter (one-time) | 25% | 20% | 15% | 10% |
| Pro | 18% | 30% | 40% | 45% |
| Premium | 2% | 5% | 10% | 15% |

### Churn (monthly)
| Tier | Month 1-6 | Month 7-12 | Month 13-18 | Month 19-24 |
|------|-----------|------------|-------------|-------------|
| Starter | 10% | 8% | 7% | 6% |
| Pro | 6% | 5% | 4% | 3% |
| Premium | 3% | 2% | 2% | 1.5% |

> Starter churn is higher because some users get value from one-time run and leave.
> Pro churn drops as integrations create stickiness.
> Premium churn is lowest — org-wide adoption creates lock-in.

---

## 6-Month Projection (Month 1-6)

### Month-by-Month Buildup

| Month | New Free | New Paid | Starter Mo | Starter 1x | Pro | Premium | Churned | Net Active Paid |
|-------|----------|----------|------------|------------|-----|---------|---------|-----------------|
| 1 | 60 | 4 | 2 | 1 | 1 | 0 | 0 | 4 |
| 2 | 70 | 5 | 3 | 1 | 1 | 0 | 0 | 8 |
| 3 | 80 | 6 | 3 | 2 | 1 | 0 | 1 | 13 |
| 4 | 90 | 7 | 4 | 2 | 1 | 0 | 1 | 19 |
| 5 | 100 | 8 | 4 | 2 | 2 | 0 | 2 | 25 |
| 6 | 110 | 9 | 5 | 2 | 2 | 0 | 2 | 32 |

### Revenue — Month 6 Snapshot

| Stream | Calculation | Monthly |
|--------|-------------|---------|
| Starter monthly subscribers | ~17 active × $79 | $1,343 |
| Starter one-time (new in month) | 2 × $149 | $298 |
| Pro subscribers | ~6 active × $199 | $1,194 |
| Premium | 0 | $0 |
| **Month 6 MRR** | | **$2,835** |

### 6-Month Cumulative Revenue

| Stream | Total |
|--------|-------|
| Starter monthly | $5,056 |
| Starter one-time | $1,490 (10 purchases) |
| Pro monthly | $3,582 |
| Premium | $0 |
| **6-Month Total** | **$10,128** |

> **Reality check:** This is a conservative cold-start. Hitting $10K total in 6 months is realistic for a bootstrapped B2B SaaS with no paid ads. The $10K-$25K MRR target from the brief is aspirational for month 6 — more likely achieved around month 10-12.

---

## 12-Month Projection (Month 7-12)

### Growth Accelerators in This Phase
- SEO content starts ranking (CX frameworks, journey mapping)
- NotebookLM exports create LinkedIn virality
- First referral loops from happy Starter users
- HubSpot/Intercom integrations unlock Pro tier value
- First Premium pilot customers

| Month | New Free | New Paid | Net Active Paid | MRR |
|-------|----------|----------|-----------------|-----|
| 7 | 150 | 18 | 46 | $4,800 |
| 8 | 170 | 20 | 59 | $6,400 |
| 9 | 200 | 24 | 74 | $8,300 |
| 10 | 220 | 26 | 90 | $10,500 |
| 11 | 230 | 28 | 107 | $13,000 |
| 12 | 250 | 30 | 124 | $15,800 |

### Month 12 Snapshot

| Metric | Value |
|--------|-------|
| Total free signups (cumulative) | 2,010 |
| Total ever-paid | 225 |
| Active paying subscribers | ~124 |
| Active Starter monthly | ~48 |
| Starter one-time (lifetime) | ~35 |
| Active Pro | ~52 |
| Active Premium | ~8 |
| **MRR** | **$15,800** |
| **ARR Run Rate** | **$189,600** |

### 12-Month Cumulative Revenue

| Stream | Total |
|--------|-------|
| Starter monthly | $28,400 |
| Starter one-time | $5,215 (35 purchases) |
| Pro monthly | $38,200 |
| Premium annual | $9,600 (8 × $1,200) |
| **12-Month Total** | **$81,415** |

---

## 18-Month Projection (Month 13-18)

### Growth Accelerators in This Phase
- Partnership channels (CX consultants reselling)
- Board Deck generator drives Premium adoption
- Multi-seat expands ACV within existing accounts
- Competitive monitoring becomes a retention moat
- Case studies + social proof reduce CAC

| Month | New Free | New Paid | Net Active Paid | MRR |
|-------|----------|----------|-----------------|-----|
| 13 | 300 | 45 | 152 | $20,100 |
| 14 | 350 | 52 | 182 | $25,500 |
| 15 | 380 | 57 | 214 | $31,200 |
| 16 | 400 | 60 | 247 | $37,000 |
| 17 | 420 | 63 | 279 | $42,500 |
| 18 | 450 | 68 | 315 | $49,000 |

### Month 18 Snapshot

| Metric | Value |
|--------|-------|
| Total free signups (cumulative) | 4,310 |
| Total ever-paid | 570 |
| Active paying subscribers | ~315 |
| Active Starter monthly | ~82 |
| Starter one-time (lifetime) | ~60 |
| Active Pro | ~158 |
| Active Premium | ~28 |
| **MRR** | **$49,000** |
| **ARR Run Rate** | **$588,000** |

### 18-Month Cumulative Revenue

| Stream | Total |
|--------|-------|
| Starter monthly | $74,500 |
| Starter one-time | $8,940 (60 purchases) |
| Pro monthly | $148,600 |
| Premium annual | $33,600 |
| **18-Month Total** | **$265,640** |

---

## 24-Month Projection (Month 19-24)

### Growth Accelerators in This Phase
- MCP server creates platform lock-in (Premium)
- Organic/referral becomes dominant channel (lower CAC)
- Expansion revenue (seat upgrades, tier upgrades)
- Industry recognition / thought leadership
- Potential first enterprise deals

| Month | New Free | New Paid | Net Active Paid | MRR |
|-------|----------|----------|-----------------|-----|
| 19 | 550 | 99 | 373 | $59,000 |
| 20 | 600 | 108 | 435 | $70,500 |
| 21 | 650 | 117 | 500 | $82,000 |
| 22 | 700 | 126 | 570 | $95,000 |
| 23 | 720 | 130 | 640 | $108,000 |
| 24 | 750 | 135 | 710 | $122,000 |

### Month 24 Snapshot

| Metric | Value |
|--------|-------|
| Total free signups (cumulative) | 8,280 |
| Total ever-paid | 1,285 |
| Active paying subscribers | ~710 |
| Active Starter monthly | ~130 |
| Starter one-time (lifetime) | ~85 |
| Active Pro | ~390 |
| Active Premium | ~72 |
| **MRR** | **$122,000** |
| **ARR Run Rate** | **$1,464,000** |

### 24-Month Cumulative Revenue

| Stream | Total |
|--------|-------|
| Starter monthly | $148,000 |
| Starter one-time | $12,665 (85 purchases) |
| Pro monthly | $396,000 |
| Premium annual | $86,400 |
| **24-Month Total** | **$643,065** |

---

## Revenue Mix Evolution

| Period | Starter % | Pro % | Premium % | One-Time % |
|--------|-----------|-------|-----------|------------|
| Month 6 | 47% | 42% | 0% | 11% |
| Month 12 | 35% | 47% | 12% | 6% |
| Month 18 | 28% | 56% | 13% | 3% |
| Month 24 | 23% | 62% | 13% | 2% |

> **Key insight:** Pro becomes the revenue engine. Starter is the on-ramp. One-time purchases fade as users learn the subscription value. Premium grows steadily but stays modest until MCP server and multi-seat mature.

---

## Unit Economics

### By Tier (Steady State — Month 12+)

| Metric | Starter Mo | Starter 1x | Pro | Premium |
|--------|-----------|------------|-----|---------|
| Price | $79/mo | $149 once | $199/mo | $100/mo |
| Avg lifetime (months) | 8 | — | 16 | 30+ |
| LTV | $632 | $149 | $3,184 | $3,000+ |
| Target CAC | <$150 | <$50 | <$400 | <$600 |
| LTV:CAC | 4.2:1 | 3:1 | 8:1 | 5:1 |
| Payback period | ~2 mo | Instant | ~2 mo | ~6 mo |

### Blended

| Metric | Month 6 | Month 12 | Month 18 | Month 24 |
|--------|---------|----------|----------|----------|
| Blended ARPU | $89 | $127 | $156 | $172 |
| Blended LTV | $534 | $1,143 | $1,716 | $2,236 |
| Target CAC | $150 | $250 | $350 | $400 |
| LTV:CAC | 3.6:1 | 4.6:1 | 4.9:1 | 5.6:1 |

---

## Scenario Analysis

### Conservative (0.6x Base)

| Milestone | MRR | ARR | Active Paid |
|-----------|-----|-----|-------------|
| Month 6 | $1,700 | $20K | 19 |
| Month 12 | $9,500 | $114K | 74 |
| Month 18 | $29,400 | $353K | 189 |
| Month 24 | $73,200 | $878K | 426 |

### Base Case (Above)

| Milestone | MRR | ARR | Active Paid |
|-----------|-----|-----|-------------|
| Month 6 | $2,835 | $34K | 32 |
| Month 12 | $15,800 | $190K | 124 |
| Month 18 | $49,000 | $588K | 315 |
| Month 24 | $122,000 | $1.46M | 710 |

### Optimistic (1.5x Base)

| Milestone | MRR | ARR | Active Paid |
|-----------|-----|-----|-------------|
| Month 6 | $4,250 | $51K | 48 |
| Month 12 | $23,700 | $284K | 186 |
| Month 18 | $73,500 | $882K | 473 |
| Month 24 | $183,000 | $2.2M | 1,065 |

---

## Critical Questions Before Locking Packages

### 1. Starter One-Time — Keep or Kill?
- **Pro:** Removes friction for price-sensitive buyers, instant payback
- **Con:** $149 LTV ceiling vs $632 monthly LTV. Every one-time buyer is $483 of lost revenue
- **Recommendation:** Keep for first 6 months as data collection. If >40% choose one-time, the monthly price may be too high. If <15% choose one-time, kill it — it's just discounting

### 2. Pro at $199 — Too Cheap or Right?
- **At $199:** Accessible for SMBs, high volume potential
- **At $249:** 25% more revenue per user, still SMB-friendly
- **At $299:** Premium positioning, fewer but higher-value customers
- **Impact:** Moving Pro from $199 → $249 adds ~$62K to 24-month cumulative (base case)
- **Recommendation:** Launch at $199, raise to $249 at month 9 when integrations prove value

### 3. Premium at $1,200/yr — Is Annual-Only Right?
- **Annual forces commitment** — good for reducing churn
- **But $1,200 upfront is a procurement hurdle** for SMBs
- **Alternative:** $149/mo monthly option (18% premium over annual)
- **Recommendation:** Offer both. Annual at $1,200 ($100/mo), monthly at $149/mo. Let customers self-select

### 4. Free Tier — Conversion Gate
- **Current:** Full one-time run for free is generous
- **Risk:** Users get enough value from free run + PDF and never convert
- **Mitigation:** The "before state" capture is the hook — free users see their score, want to track improvement
- **Watch metric:** If free→paid conversion stays below 5% after month 3, tighten the free tier (e.g., summary-only journey, no full playbook)

### 5. Missing Tier Gap: $79 → $199
- That's a 152% price jump between Starter and Pro
- Consider a "Growth" tier at $129-$149/mo with partial integrations
- **Or:** Accept the gap — it creates a clear "aha" moment when users see what integrations unlock

---

## What Would Break This Model

| Risk | Impact | Mitigation |
|------|--------|------------|
| Free tier is "good enough" | <5% conversion, slow growth | Tighten free tier at month 3 if needed |
| Starter churn >12% | Leaky bucket, can't compound | Double down on CX Score stickiness |
| Pro integrations delayed | Pro value prop hollow | Ship HubSpot first, it covers 60% of target market |
| Premium has no buyers | Revenue ceiling at ~$50K MRR | Focus on Pro volume instead, revisit Premium positioning |
| CAC exceeds $500 | Negative unit economics | Lean into content + referral, cut paid channels |
| Competitor launches similar | Price pressure, slower growth | Speed to market + CX depth = moat |

---

## Summary: The Revenue Story

```
Month 6:   $2.8K MRR  |  $10K cumulative  |  32 paid users   — "Proof of demand"
Month 12:  $15.8K MRR |  $81K cumulative  |  124 paid users  — "Real business"
Month 18:  $49K MRR   |  $266K cumulative |  315 paid users  — "Scaling"
Month 24:  $122K MRR  |  $643K cumulative |  710 paid users  — "Approaching $1.5M ARR"
```

**The path to $1M ARR runs through Pro.** Starter is the acquisition funnel. Premium is the retention anchor. But Pro at $199/mo with integrations is where the business lives.

**Break-even timeline** (assuming ~$15K/mo operating costs): Month 10-11 in base case.
