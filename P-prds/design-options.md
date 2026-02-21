# CX Mate — Design Options

> 4 design directions for CX Mate's visual identity. Each includes color palette, typography, component style, and how it applies to key screens.
>
> **Last updated:** 2026-02-20

---

## Current State

The app currently has no defined design system:
- Black/white/gray only, default system fonts
- No brand color, no personality
- Functional but feels like a raw prototype
- Inconsistent spacing and visual hierarchy

---

## Option A: Warm & Friendly

**Vibe:** Approachable, trustworthy, like talking to a smart friend. Think Notion meets Loom.
**Best for:** Building trust with non-technical users (founders, CS leaders). Feels safe, not intimidating.

### Color Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary | Warm indigo | `#6366F1` | Buttons, links, active states, progress |
| Primary light | Soft lavender | `#EEF2FF` | Backgrounds, hover states, cards |
| Secondary | Warm coral | `#F97316` | Accents, badges, attention grabbers |
| Success | Soft green | `#22C55E` | Completed states, positive indicators |
| Warning | Warm amber | `#F59E0B` | Medium severity, caution states |
| Error | Soft red | `#EF4444` | Critical risks, errors |
| Background | Warm off-white | `#FAFAF8` | Page background (slightly warm, not pure white) |
| Surface | White | `#FFFFFF` | Cards, panels |
| Text primary | Warm dark | `#1E1B4B` | Headings (dark indigo, not pure black) |
| Text secondary | Warm gray | `#6B7280` | Body text, descriptions |
| Border | Soft gray | `#E5E7EB` | Card borders, dividers |

### Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Headings | **Plus Jakarta Sans** | Bold (700) | 32/24/20/16px |
| Body | Plus Jakarta Sans | Regular (400) | 14-16px |
| Small / Labels | Plus Jakarta Sans | Medium (500) | 12-13px |
| Monospace (formulas) | JetBrains Mono | Regular | 13px |

**Why Plus Jakarta Sans:** Geometric but warm, modern but readable. Has personality without being quirky. Used by Linear, Raycast, and modern SaaS products.

### Component Style

- **Cards:** White background, 1px border `#E5E7EB`, `border-radius: 16px`, subtle shadow `shadow-sm`
- **Buttons (primary):** Solid indigo `#6366F1`, white text, `border-radius: 12px`, padding 12px 24px
- **Buttons (secondary):** White bg, indigo border, indigo text
- **Inputs:** White bg, soft border, `border-radius: 10px`, gentle focus ring in indigo
- **Badges:** Rounded pill shape, pastel backgrounds with darker text (e.g., soft red bg + dark red text for "critical")
- **Progress bar:** Indigo gradient from left to right, rounded
- **ChatBubble:** Light lavender background `#EEF2FF`, soft border, 16px radius
- **Nav header:** White bg, subtle bottom border, indigo active pill

### Applied to Key Screens

**Landing page:**
- Warm off-white background
- Large heading in warm dark indigo: "Map your customer journey in 5 minutes"
- Indigo CTA button with subtle hover animation
- Soft illustration or abstract shapes in lavender/coral

**Onboarding:**
- Progress bar (not just dots) — labeled steps, indigo fill
- ChatBubble in soft lavender
- Selection cards with indigo left border accent on hover/select
- Warm, spacious layout

**CX Report:**
- Stats cards with soft pastel backgrounds (lavender for neutral, soft red for risks)
- Insight cards with left color bar (red/amber/green by severity)
- "CX Mate says" blocks in warm lavender ChatBubble style
- Smooth section transitions

**Dashboard:**
- Clean card grid on warm off-white
- Progress ring or bar in indigo
- Risk items with warm amber/red accents

---

## Option B: Bold & Confident

**Vibe:** Premium, authoritative, data-driven. Think Stripe meets Vercel.
**Best for:** Positioning CX Mate as a serious tool for revenue leaders. Commands respect.

### Color Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary | Electric blue | `#2563EB` | Buttons, links, key actions |
| Primary dark | Deep navy | `#1E3A5F` | Headers, nav, premium sections |
| Accent | Emerald | `#10B981` | Success, growth indicators, positive metrics |
| Warning | Amber | `#F59E0B` | Medium severity |
| Error | Crimson | `#DC2626` | Critical risks, urgent items |
| Background | Pure white | `#FFFFFF` | Clean, no-noise background |
| Surface dark | Near black | `#0F172A` | Hero sections, nav header, contrast panels |
| Text primary | Near black | `#0F172A` | Headings |
| Text secondary | Slate | `#64748B` | Body, descriptions |
| Border | Light slate | `#E2E8F0` | Subtle dividers |
| Gradient | Blue → Emerald | `#2563EB → #10B981` | Premium CTAs, progress bars, accents |

### Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Headings | **Inter** | Bold (700) / Semibold (600) | 36/28/22/18px |
| Body | Inter | Regular (400) | 14-16px |
| Small / Labels | Inter | Medium (500) | 11-13px, uppercase tracking-wide |
| Numbers / Stats | Inter | Bold (700) | 48/36/24px |
| Monospace | Fira Code | Regular | 13px |

**Why Inter:** The industry standard for serious SaaS. Excellent readability, professional, never distracting. Stripe, Vercel, GitHub all use it.

### Component Style

- **Cards:** White bg, very subtle border or no border + `shadow-md`, `border-radius: 12px`
- **Buttons (primary):** Blue `#2563EB`, white text, `border-radius: 8px`, medium shadow
- **Buttons (premium):** Blue→Emerald gradient, white text, glow effect on hover
- **Inputs:** Clean border, `border-radius: 8px`, blue focus ring
- **Badges:** Sharp rounded rect, bold text, high contrast (e.g., white on crimson for "critical")
- **Stats numbers:** Very large (48px+), bold, with small label below
- **Progress bar:** Blue→Emerald gradient, sharp edges
- **Nav header:** Dark navy `#0F172A` background, white text, blue active indicator
- **ChatBubble:** Light blue-gray bg, dark border, professional tone

### Applied to Key Screens

**Landing page:**
- Dark hero section (navy) with white text and blue→emerald gradient on CTA
- Large bold stat: "Map your CX in 5 minutes. Backed by data from 10,000+ companies."
- Clean white sections below with feature highlights
- Social proof bar (logos, testimonials)

**Onboarding:**
- Clean white background, minimal distractions
- Step counter: "Step 2 of 7" in small caps
- Selection cards with blue left border, subtle blue glow on select
- Bold "Continue" button in gradient

**CX Report:**
- Dark header section with company name + animated stat counters
- White card sections below
- Risk badges in high-contrast crimson
- Impact projections with large bold numbers
- Blue→emerald gradient divider lines between sections

**Dashboard:**
- Stats in large bold numbers with tiny labels
- Dark top section with key metric
- Clean white cards below
- Progress bar in gradient

---

## Option C: Clean & Minimal

**Vibe:** Calm, focused, data-forward. Think Supabase meets PostHog meets Linear.
**Best for:** Letting the content shine. Users focus on the insights, not the UI chrome.

### Color Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary | Teal | `#0D9488` | Buttons, links, progress, active states |
| Primary light | Soft teal | `#F0FDFA` | Hover backgrounds, selected states |
| Accent | Violet | `#8B5CF6` | AI-generated badges, special highlights |
| Success | Green | `#16A34A` | Completed, positive |
| Warning | Orange | `#EA580C` | Medium risks |
| Error | Red | `#DC2626` | Critical risks |
| Background | Light gray | `#F9FAFB` | Page background |
| Surface | White | `#FFFFFF` | Cards |
| Text primary | Dark gray | `#111827` | Headings |
| Text secondary | Medium gray | `#6B7280` | Body text |
| Border | Very light | `#F3F4F6` | Subtle borders, almost invisible |

### Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Headings | **Geist** | Semibold (600) | 30/24/20/16px |
| Body | Geist | Regular (400) | 14-15px |
| Small / Labels | Geist | Medium (500) | 12px |
| Monospace | Geist Mono | Regular | 13px |

**Why Geist:** Vercel's own font. Ultra-clean, excellent for data-heavy interfaces. Modern without being cold. Perfect balance of minimal and readable.

### Component Style

- **Cards:** White bg, 1px border `#F3F4F6` (barely visible), `border-radius: 12px`, no shadow or `shadow-xs`
- **Buttons (primary):** Teal `#0D9488`, white text, `border-radius: 8px`, clean and flat
- **Buttons (ghost):** No bg, teal text, hover shows light teal bg
- **Inputs:** Minimal border, `border-radius: 8px`, teal focus ring
- **Badges:** Flat, small, monochrome with subtle color tint
- **Stats:** Medium-large numbers, no decoration, let the data speak
- **Progress bar:** Thin (4px), teal, rounded
- **Nav header:** White bg, no border (or 1px very light), teal active indicator (underline, not pill)
- **ChatBubble:** Very light gray bg `#F9FAFB`, minimal border
- **AI badge:** Violet accent — anything AI-generated gets a subtle violet indicator

### Applied to Key Screens

**Landing page:**
- Lots of white space
- Simple headline, one line of subtext
- Single teal CTA button
- Maybe a subtle screenshot of the product below
- Extremely clean, almost zen

**Onboarding:**
- Thin progress line at top (not dots, not pills — a clean line)
- Step label in small text: "Stage" / "Customers" / "Goals"
- Clean form fields, generous spacing
- Teal accents only where interactive

**CX Report:**
- Data-forward layout: numbers first, text second
- Subtle colored left borders on cards (red/orange/teal)
- Violet "AI-generated" badges on insights
- Clean tables for impact projections
- Collapsible sections with minimal chrome

**Dashboard:**
- Grid of clean stat boxes, thin borders
- Thin teal progress bar
- Minimal text, maximum data visibility

---

## Option D: Playful & Energetic

**Vibe:** Fun, creative, energetic. Think Miro meets Notion meets Canva.
**Best for:** Standing out, making CX feel exciting not boring. Appeals to creative founders.

### Color Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary | Vibrant purple | `#7C3AED` | Main actions, branding |
| Secondary | Hot pink | `#EC4899` | Accents, highlights, notifications |
| Tertiary | Sky blue | `#38BDF8` | Links, secondary actions |
| Success | Lime green | `#84CC16` | Completed, positive vibes |
| Warning | Amber | `#FBBF24` | Caution states |
| Error | Red-orange | `#F43F5E` | Risks (but still feels designed, not alarming) |
| Background | Soft lavender | `#FAF5FF` | Warm purple-tinted background |
| Surface | White | `#FFFFFF` | Cards |
| Text primary | Deep purple | `#3B0764` | Headings (on-brand, not black) |
| Text secondary | Warm gray | `#78716C` | Body text |
| Gradient hero | Purple → Pink → Sky | `#7C3AED → #EC4899 → #38BDF8` | Hero sections, premium CTAs |

### Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Headings | **DM Sans** | Bold (700) | 36/28/22/18px |
| Body | DM Sans | Regular (400) | 14-16px |
| Small / Labels | DM Sans | Medium (500) | 12-13px |
| Accent / Quotes | DM Serif Display | Regular (400) | For CX Mate persona quotes |
| Monospace | JetBrains Mono | Regular | 13px |

**Why DM Sans + DM Serif Display:** DM Sans is geometric and modern with a slight warmth. Paired with DM Serif Display for CX Mate's "voice" moments, it creates a personality contrast — the AI advisor has a different typographic voice from the UI, making it feel alive.

### Component Style

- **Cards:** White bg, colored top border accent (e.g., purple strip at top), `border-radius: 16px`, `shadow-md`
- **Buttons (primary):** Purple `#7C3AED`, white text, `border-radius: 999px` (full pill), playful hover animation
- **Buttons (secondary):** White bg, purple border, pill shape
- **Inputs:** Rounded (12px), purple focus ring, slight purple tint on focus
- **Badges:** Pill-shaped, gradient backgrounds (purple→pink), white text
- **Stats:** Large colorful numbers, each stat in a different accent color
- **Progress bar:** Purple→pink gradient, rounded, with micro-celebration animation at milestones
- **Nav header:** White bg, colored active pill (purple gradient), logo with subtle gradient
- **ChatBubble:** Soft lavender bg with pink accent border, DM Serif for CX Mate's "voice"
- **Illustrations:** Abstract blob shapes, gradient meshes in hero sections

### Applied to Key Screens

**Landing page:**
- Gradient mesh background (purple/pink/sky, subtle)
- Large bold heading in deep purple
- Gradient pill CTA button
- Abstract illustration of a journey/path
- Feels modern and exciting

**Onboarding:**
- Purple progress pills at top (filled = done, outlined = upcoming)
- ChatBubble with serif font for CX Mate's personality
- Selection cards with colorful left accent + hover lift animation
- Playful micro-interactions (card scales on select, check mark animates in)

**CX Report:**
- Gradient header section
- Colorful stat cards (each a different accent)
- Insight cards with pink "high risk" badges
- "CX Mate says" blocks in serif font, lavender ChatBubble
- Celebration moments: "You have 3 quick wins ready to go!"

**Dashboard:**
- Colorful stat grid (purple, pink, sky, lime)
- Animated progress ring (purple→pink gradient)
- Playful empty state: illustration + encouraging copy
- Risk cards with colored accents, not scary-red

---

## Comparison Summary

| Aspect | A: Warm & Friendly | B: Bold & Confident | C: Clean & Minimal | D: Playful & Energetic |
|--------|-------------------|--------------------|--------------------|----------------------|
| **Primary color** | Indigo `#6366F1` | Blue `#2563EB` | Teal `#0D9488` | Purple `#7C3AED` |
| **Font** | Plus Jakarta Sans | Inter | Geist | DM Sans + Serif |
| **Card radius** | 16px | 12px | 12px | 16px |
| **Nav style** | White, indigo pill | Dark navy | White, teal underline | White, gradient pill |
| **Personality** | Trustworthy friend | Authority figure | Quiet confidence | Creative companion |
| **Best for** | Non-technical users | Revenue leaders | Data-oriented users | Creative founders |
| **Risk** | Could feel generic | Could feel cold | Could feel too plain | Could feel unserious |
| **Benchmark** | Notion, Loom | Stripe, Vercel | Supabase, Linear | Miro, Canva |

---

## Recommendation

**For CX Mate specifically**, I'd lean toward **Option A (Warm & Friendly)** or a **hybrid of A + C** because:

1. **Our users are non-CX-experts** — they need to feel safe, not overwhelmed
2. **The CX Mate persona (ChatBubble, "peer advisor")** needs warmth to feel authentic
3. **The data can be dense** (journey maps, impact projections) — warm design makes dense data feel approachable
4. **Differentiation** — most CX tools look clinical and enterprise (Gainsight, Medallia). Warm = our edge.

A possible hybrid: **Take A's warmth + C's data clarity.** Warm colors and font (Plus Jakarta Sans, indigo primary), but C's minimal card styling and data-forward layout.

---

*Pick a direction (or mix elements) and we'll build the design system.*
