# CX Mate - Tech Stack & Architecture

## Stack

| Layer | Technology | Version/Notes |
|-------|-----------|---------------|
| Frontend | Next.js (App Router), React, TypeScript, Tailwind CSS | Next.js 16, React 19, Tailwind v4 (oklch colors) |
| UI Components | shadcn/ui | Customized with warm teal theme (hue 195) |
| Fonts | Plus Jakarta Sans | Warm, professional feel |
| Backend | Next.js API Routes | Monolith-first, extract later |
| Database | PostgreSQL via Supabase | Auth, RLS, JSONB + normalized tables |
| AI/LLM | Claude API (Anthropic) | Direct fetch (not SDK), `claude-sonnet-4-20250514`, 8192 max tokens |
| Hosting | Vercel (frontend) + Supabase (backend/DB) | Production deployed |
| Analytics | PostHog | Planned for Sprint 4 |
| Payments | Stripe | Planned for Sprint 4 |

## Architecture Principles

1. **Monolith-first:** Next.js full-stack, extract services later
2. **Journey-first data model:** Everything builds from the journey map
3. **Multi-tenant from day 1:** RLS via JWT `app_metadata.org_id`
4. **AI as service layer:** LLM calls abstracted behind `src/lib/ai/`
5. **Dual-mode:** Anonymous preview (sessionStorage) + authenticated persistence (Supabase)
6. **CX knowledge base as the moat:** 8-module structured knowledge, not just prompts

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── enrich-company/      # Website scraping + Claude extraction
│   │   ├── journey/             # Journey generation + loading (GET/POST)
│   │   ├── moments/             # Moment details
│   │   ├── onboarding/          # Submit onboarding data + persist
│   │   ├── recommendations/     # Playbook generation
│   │   └── dashboard/           # Dashboard metrics
│   ├── auth/                    # Login/signup + callback
│   ├── confrontation/           # CX Intelligence Report
│   ├── dashboard/               # Dashboard overview
│   ├── journey/                 # Journey map visualization
│   ├── onboarding/              # Onboarding wizard
│   └── playbook/                # Recommendations playbook
├── components/
│   ├── dashboard/               # Dashboard cards
│   ├── evidence/                # Evidence Wall
│   ├── journey/                 # Journey map, stage cards, visual timeline
│   ├── layout/                  # AppShell, CxIdentitySidebar, CompanyProfileContext
│   ├── onboarding/              # Wizard + 9 step components
│   ├── playbook/                # Playbook cards
│   ├── ui/                      # shadcn/ui primitives
│   └── nav-header.tsx           # Global navigation (hidden on / and /onboarding)
├── lib/
│   ├── ai/
│   │   ├── generate-journey.ts  # Journey prompt v4 + Claude call + JSON repair
│   │   ├── generate-recommendations.ts  # Recommendation prompt + Claude call
│   │   ├── journey-prompt.ts    # Journey prompt template (persona, maturity, enrichment)
│   │   └── recommendation-prompt.ts  # Recommendation prompt template
│   ├── cx-knowledge/            # 8-module CX theory engine
│   │   ├── benchmarks.ts        # Industry benchmarks
│   │   ├── cx-tools.ts          # CX measurement tools
│   │   ├── decision-science.ts  # Decision-making patterns
│   │   ├── enterprise-cx-maturity.ts  # Qualtrics/Gladly research data
│   │   ├── failure-patterns.ts  # CX failure modes
│   │   ├── foundations.ts       # CX fundamentals
│   │   ├── lifecycle-science.ts # Lifecycle stage science
│   │   ├── stages.ts            # Stage definitions
│   │   └── verticals.ts         # Vertical-specific knowledge
│   ├── evidence-matching.ts     # Pain point → moment/insight matching (AI-tagged + fuzzy)
│   ├── services/
│   │   └── journey-persistence.ts  # persistJourney + loadJourney (JSONB + normalized)
│   ├── supabase/
│   │   ├── admin.ts             # Service role client (bypasses RLS)
│   │   ├── client.ts            # Browser client
│   │   ├── middleware.ts        # Session refresh
│   │   └── server.ts            # Server component client
│   ├── hooks/
│   │   └── use-company-enrichment.ts  # Auto-enrichment hook
│   └── validations/
│       └── onboarding.ts        # Zod schema (33+ fields)
├── types/
│   ├── database.ts              # Supabase Database type
│   └── enrichment.ts            # Enrichment response types
└── middleware.ts                 # Route protection (public vs app, preview bypass)
```

## Core Data Model

### Organization
- id, name, vertical, size, created_at
- Created via admin client on signup (service role bypasses RLS)

### JourneyTemplate
- id, org_id, name, vertical, journey_type, is_default
- stages (JSONB — full GeneratedJourney backup for easy loading)
- source (ai_generated | custom | industry_template)

### JourneyStage
- id, template_id, name, order, description, stage_type (sales | customer)
- emotional_state, typical_duration_days

### MeaningfulMoment
- id, stage_id, type (truth | pain | delight | risk)
- name, description, severity (critical | high | medium | low)
- triggers, recommendations (JSON)
- addressesPainPoints (JSON array — links to user's pain points)
- competitorGap, competitorContext (competitor evidence fields)

### Recommendation
- id, moment_id, action_type (email | call | internal | automation)
- what, when_trigger, how_template, why_principle
- measure_metric, priority

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/onboarding | Submit onboarding data, persist for auth users |
| POST | /api/journey | Generate journey (Claude, ~2.8 min, 8192 tokens) |
| GET | /api/journey/[id] | Load persisted journey (RLS enforced) |
| POST | /api/recommendations | Generate playbook recommendations |
| POST | /api/enrich-company | Fetch website + Claude extraction (8s+12s timeout) |
| GET | /api/dashboard | Dashboard metrics |

## Key Technical Patterns

### Claude API Integration
- Direct `fetch()` to `https://api.anthropic.com/v1/messages` (no SDK)
- System message for JSON-only output (more reliable than in-prompt instructions)
- 3-level JSON repair: raw parse → strip trailing commas → strip preamble/trailer text
- API key from `CX_MATE_ANTHROPIC_API_KEY` env var
- Journey generation: ~2.8 min, client timeout must be >3min (AbortController at 180s)

### Auth Flow
- Supabase Auth (email/password)
- Signup → callback route → admin client creates org → sets `app_metadata.org_id`
- RLS policies use `auth.jwt() -> 'app_metadata' ->> 'org_id'`
- Preview mode bypasses auth via `?id=preview` query param

### Data Persistence
- JSONB backup + normalized tables for journey storage
- `persistJourney()` writes both, `loadJourney()` reads JSONB first, falls back to tables
- All frontend pages support dual-mode loading (preview=sessionStorage, UUID=API)

### Evidence Matching
- Dual-strategy: AI-tagged fields (`addressesPainPoints`) for new journeys + fuzzy keyword fallback for existing
- Evidence annotations appear across all output pages (violet badges)

### Design System
- Warm teal theme (oklch hue 195) with amber accents
- Plus Jakarta Sans font
- Card hierarchy: `rounded-2xl border border-border/60 bg-white p-6 shadow-sm`
- Dark sidebar (oklch hue 240 navy)
- Data presentation: Mesh/Ramp ROI Calculator pattern (hero number → breakdown → drivers)

## Security

- Supabase RLS: Users only see their org data
- Admin client (service role) is server-only, never exposed to browser
- LLM calls: Server-side only, API keys never in client bundle
- Input validation: Zod schemas on all API endpoints
- Middleware route protection with public/app/preview segmentation
