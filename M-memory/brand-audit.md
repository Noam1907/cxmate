# CX Mate Brand Audit
**Date:** Feb 2025
**Auditor:** Brand Expert Agent
**Benchmarks:** Linear, Vercel, Vitally, Planhat, Stripe

---

## Overall Brand Score: 6.5/10

CX Mate has solid bones — good information architecture, clean component structure, and a smart content strategy. But it currently looks like a well-built developer prototype, not a product worth $99-499/mo. The gap is in visual polish, typographic hierarchy, and brand personality. Five focused changes can close 80% of this gap.

---

## Top 5 Changes (Biggest Impact)

### 1. Typography Scale & Weight Hierarchy
**Score impact:** +1.5 points
**Effort:** Low (CSS only)
**Affects:** Every page

**Problem:** The app uses one font weight level too few. Headlines on data-heavy pages (confrontation, journey, playbook) are too small relative to body text. There's no clear "display" tier. Headings on `/confrontation` are 16-20px when they should be 28-36px for the emotional weight of that page.

**Fix:**
```
Display:  text-4xl (36px) font-bold — page titles on confrontation, journey
Heading:  text-2xl (24px) font-bold — section headers
Subhead:  text-lg (18px) font-semibold — card titles
Body:     text-sm (14px) font-normal — descriptions, content
Meta:     text-xs (12px) font-medium text-muted-foreground — labels, badges
Micro:    text-[10px] — annotation badges (already used well)
```

**Reference:** Linear uses 5+ distinct type sizes. Vitally uses "Agrandir" display font at 48-60px for hero sections.

---

### 2. The Logo/Wordmark
**Score impact:** +1.0 points
**Effort:** Low
**Affects:** Landing page, nav header, footer

**Problem:** The current logo is a `<div>` with "CX" text in a rounded square. This reads as a placeholder, not a brand. On the nav it's 28x28px — barely visible. No favicon defined.

**Fix:**
- Commission a simple wordmark or logomark (even a custom SVG with the letters styled)
- Minimum: Create a distinctive icon that works at 16px (favicon), 28px (nav), and 64px (landing)
- Use the indigo primary for the mark, with proper contrast
- Add a `<link rel="icon">` favicon

**Reference:** Planhat has a clean geometric "P" mark. Vitally has an abstract "V" shape. Both work at all sizes.

---

### 3. Card & Section Spacing Consistency
**Score impact:** +1.0 points
**Effort:** Low (Tailwind classes)
**Affects:** Confrontation, journey, playbook, evidence wall

**Problem:** Spacing between sections is inconsistent. Some cards use `space-y-4`, others `space-y-6`, some `space-y-8`. Gap between the Evidence Wall and the next section is `mb-10` but the gap above it is `mb-0`. The confrontation page especially feels cramped in the insights area vs generous in the stats area.

**Fix:**
- Standardize on an 8px grid: `gap-2` (8px) within components, `gap-4` (16px) between cards, `gap-8` (32px) between sections, `gap-12` (48px) between major zones
- Every page should follow: `py-12 px-4` or `py-12 px-6` for outer container
- Section headers: always `mb-4` below
- Card internal: always `p-5` or `p-6` (not mixing `p-3`, `p-4`, `p-6`)

**Reference:** Vercel uses an 8px grid religiously. Linear has visible rhythm in their spacing.

---

### 4. Color System — Too Many One-Off Colors
**Score impact:** +0.8 points
**Effort:** Medium (review all color usage)
**Affects:** All pages, especially journey cards and evidence annotations

**Problem:** The app uses 15+ distinct color pairs (red, orange, yellow, green, blue, purple, cyan, emerald, amber, slate, violet, pink, indigo). While each serves a purpose, the overall effect is rainbow noise. The journey stage cards alone use 4 different background tints for severity + 2 for annotations + badge variants.

**Fix:**
- **Primary semantic palette (keep):** Indigo (primary), red (critical/destructive), emerald (success/delight)
- **Reduce to 3 accent colors:** Violet (evidence/pain points — already established), orange (competitors — already established), amber (warnings)
- **Remove/merge:** Cyan, pink, blue-50 variants that don't serve a clear purpose
- **Severity scale:** Use opacity variants of ONE color (e.g., red-100/red-200/red-300) rather than 4 different hues
- **Tech stack categories:** Use the primary indigo with opacity variants instead of 9 different colors

**Reference:** Linear uses 2 colors (purple and white) for 90% of their UI. Stripe uses blue + green + neutral for everything.

---

### 5. Confrontation Page — The Aha Moment Needs Drama
**Score impact:** +0.7 points
**Effort:** Medium
**Affects:** `/confrontation` (most critical conversion page)

**Problem:** This is the page where users first see their AI-generated results after a 3-minute wait. It should feel like opening an envelope with life-changing news. Instead, it feels like scrolling through a settings page. The stats bar at the top is good, but the transition from loading to content is abrupt. The insights cards are visually indistinguishable from each other.

**Fix:**
- **Bigger hero moment:** Company name at 36-48px after the reveal. "Here's what CX Mate found for [Company]" as a 24px subhead.
- **Staggered reveal timing:** Currently using `FadeIn` delays — good start. But delay increments are too small (100ms). Use 200-300ms between major sections for a more deliberate reveal.
- **Insight cards:** Add a subtle left border color per severity (4px solid red/amber/blue). This creates scannable visual hierarchy without adding clutter.
- **Evidence Wall:** Should feel like a "dossier" — add a subtle background treatment (e.g., `bg-gradient-to-b from-violet-50/30 to-transparent` behind the entire section).

**Reference:** Vitally uses dramatic dark backgrounds with bright data overlays for their dashboard previews. The contrast creates visual weight.

---

## Per-Page Scores

| Page | Score | Top Issue |
|------|-------|-----------|
| `/` Landing | 7.5/10 | Solid structure. Logo is placeholder. Hero CTAs could be more prominent. |
| `/onboarding` | 7/10 | Good wizard flow. Step indicators feel generic. Company enrichment is impressive. |
| `/confrontation` | 6/10 | Needs more dramatic reveal. Type hierarchy too flat. Evidence Wall blends in. |
| `/journey` | 6.5/10 | Good card structure. Severity colors overwhelming. View toggle feels small. |
| `/playbook` | 6/10 | Dense but functional. Recommendation cards lack visual differentiation. Filter bar is basic. |
| `/dashboard` | 7/10 | Clean overview. CTA buttons are well-placed. Stats section is clear. |
| Nav header | 7/10 | Clean, functional. Logo too small. Active state is good. |
| Evidence Wall | 6.5/10 | Good content. Coverage bar is nice. Cards feel generic — need more personality. |

---

## Brand Identity Gaps

- [x] Font choice: Plus Jakarta Sans (good — modern, warm, professional)
- [x] Primary color: Indigo (good — stands out from competitor blues)
- [ ] Logo/wordmark — currently a placeholder div
- [ ] Favicon — not set
- [ ] Illustration/icon style — using raw SVGs inconsistently
- [ ] Motion system — FadeIn exists but not standardized
- [ ] Empty state illustrations — text-only currently
- [ ] Loading state design — basic "Loading..." text

---

## Implementation Priority

### Sprint A: This Week (Critical for Beta)
1. **Typography scale** — Increase heading sizes across confrontation, journey, playbook. Add display tier.
2. **Logo placeholder → SVG mark** — Even a styled text treatment is better than a div
3. **Confrontation dramatic reveal** — Bigger company name, staggered delays, insight card left-borders
4. **Spacing standardization** — Pick 4 spacing values and apply consistently

### Sprint B: Next Week (High Impact)
5. **Color reduction** — Audit all color usage, reduce to 5 semantic colors + neutrals
6. **Card component consistency** — Standardize padding, borders, hover states across all card types
7. **Navigation refinement** — Slightly larger logo area, add subtle hover animations
8. **Evidence Wall visual treatment** — Background gradient, bigger section header

### Sprint C: Pre-Launch Polish
9. **Loading states** — Replace "Loading..." with skeleton screens or branded animation
10. **Empty states** — Add illustrations or at minimum styled empty state cards
11. **Favicon + OpenGraph image** — Needed for sharing URLs
12. **Mobile audit** — Test all pages at 375px and 768px

---

## What's Already Good (Don't Change)

- **Plus Jakarta Sans** is a great font choice — warm but professional
- **Indigo primary** differentiates from competitor blues (Gainsight purple, ChurnZero green)
- **Card-based layouts** are the right pattern for this data density
- **FadeIn animations** on confrontation add appropriate drama
- **Evidence annotation badges** (violet pills) are distinctive and well-designed
- **View toggle** on journey page (cards vs visual) is smart UX
- **Progressive disclosure** pattern (click to expand moments) works well
- **Companion voice** in confrontation insights is a unique brand differentiator
- **Backdrop blur on nav** is modern and correct
- **Trust indicators** on landing page (checkmarks) are clean

---

*This audit is designed to be actionable with the current Tailwind + shadcn/ui stack. No framework changes recommended. Estimated total effort for Sprint A: 4-6 hours of focused CSS/component work.*
