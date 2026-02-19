# CX Mate - Decisions Log

Track key technical and product decisions and why they were made.

---

## Technical Decisions

| Date | Decision | Rationale | Status |
|------|----------|-----------|--------|
| 2026-02-16 | Next.js 14+ (App Router) as framework | Full-stack, fast MVP, monolith-first approach | Active |
| 2026-02-16 | Supabase for backend (PostgreSQL + Auth + Realtime) | All-in-one, RLS built-in, fast setup, scales to Phase 3 | Active |
| 2026-02-16 | Claude API for AI layer | Best structured output, CX domain understanding | Active |
| 2026-02-16 | shadcn/ui for component library | Customizable, Tailwind-native, clean aesthetic | Active |
| 2026-02-16 | JSONB columns for evolving schemas | Flexibility during MVP, avoid migration overhead | Active |
| 2026-02-16 | Monolith-first, extract services later | Speed to MVP over architecture purity | Active |
| 2026-02-16 | Multi-tenant with RLS from day 1 | Security cannot be retrofitted | Active |
| 2026-02-16 | Next.js 16 + React 19 (actual versions) | Latest stable at time of setup | Active |
| 2026-02-16 | Tailwind CSS v4 with @tailwindcss/postcss | Latest major version, native CSS approach | Active |
| 2026-02-16 | src/ directory for app code | Separates app code from project config and doc folders | Active |
| 2026-02-16 | org_id in JWT app_metadata for RLS | Standard Supabase pattern for multi-tenant auth | Active |
| 2026-02-16 | Zod for runtime validation | Type-safe schema validation on all API inputs | Active |
| 2026-02-16 | journey_type field on templates | Supports 'sales', 'customer', 'full_lifecycle' journey types | Active |
| 2026-02-16 | stage_type field on stages | Distinguishes 'sales' vs 'customer' stages within a journey | Active |

## Product Decisions

| Date | Decision | Rationale | Status |
|------|----------|-----------|--------|
| 2026-02-16 | **Vision: AI co-pilot for simple CX architecture** | Not a platform — a co-pilot. Simple, accessible, built for small businesses | Active |
| 2026-02-16 | **Full lifecycle support (sales + customer)** | Companies choose sales journey, customer journey, or both based on their stage | Active |
| 2026-02-16 | CRO / Revenue Leader as key persona | Owns full funnel, wants unified sales-to-advocacy view | Active |
| 2026-02-16 | 3-tier pricing: $99 / $249 / $499 | Maps to Mapping / Playbook / Automation layers | Active |
| 2026-02-16 | 5-minute onboarding as core constraint | Speed-to-value is the #1 differentiator vs enterprise tools | Active |
| 2026-02-16 | Any B2B vertical (SaaS initial focus) | Start with SaaS, expand to services, agencies, etc. | Active |
| 2026-02-16 | Journey-first architecture | Everything builds from the journey map, not from features | Active |

| 2026-02-18 | **6-Layer Intelligence Architecture** | Input → Research → CX Theory → Confrontation (3 modes) → Action → Impact | Active |
| 2026-02-18 | **Research-Enhanced Onboarding** | External research (G2, Reddit, competitors) + CX theory + confrontation moment | Active |
| 2026-02-18 | **3 Confrontation Modes** | Mode A (Early/Best Practice), Mode B (Growing/Research+Theory), Mode C (Established/Optimization) | Active |
| 2026-02-18 | **CX Theory Engine as core differentiator** | Decision science, lifecycle science, failure/success patterns — what makes CX Mate an expert, not just a tool | Active |
| 2026-02-18 | **Action Engine with CX tool recommendations** | Each moment of truth gets: diagnosis → action → template → which CX tool to deploy (NPS/CSAT/CES/events) | Active |
| 2026-02-18 | **Impact Engine with business calculations** | Revenue impact estimation for each CX improvement. Speaks $ not just CX. | Active |
| 2026-02-18 | **Research validated across 5 companies** | Orca AI (niche), Gong, Deel, Freshdesk, Monday.com — LLM knowledge = B+ for known SaaS, C+ for niche | Active |
| 2026-02-18 | **Knowledge base wired into journey prompt** | All 8 knowledge modules injected into Claude prompt context. Prompt includes decision science, lifecycle science, failure/success patterns, CX tools, benchmarks, foundations — all filtered by company maturity stage. | Active |
| 2026-02-18 | **Output interfaces enriched (backward-compatible)** | New fields (diagnosis, actionTemplate, cxToolRecommendation, etc.) added as optional to GeneratedMoment/Stage/Journey. New journey-level arrays: confrontationInsights, cxToolRoadmap, impactProjections. Old UI components still work. | Active |
| 2026-02-18 | **Max tokens increased to 8192** | Richer theory-backed output requires more tokens. Doubled from 4096 to 8192. | Active |
| 2026-02-19 | **localStorage for status tracking (not Supabase yet)** | Full DB persistence requires auth → org → journey → moments → recommendations chain. That's Sprint 3 scope. localStorage survives refresh, good enough for preview mode. | Active |
| 2026-02-19 | **Confrontation mode detection by companySize** | 1-50 = early_stage (Mode A), 51-300 = growing (Mode B), 300+ = established (Mode C). Each mode gets distinct headline, subtitle, section headings. Detection is client-side from onboarding data. | Active |
| 2026-02-19 | **Deferred research pipeline + curated templates to Sprint 3** | Research pipeline (Claude tool_use) and curated template library are valuable but not blocking. Ship Sprint 2 with AI-generated templates and best-practice confrontation first. | Active |
| 2026-02-19 | **Dual-mode architecture (preview + persisted)** | Anonymous users can complete onboarding and see results via sessionStorage (try-before-you-buy). Authenticated users get data persisted to Supabase. Auth happens AFTER value is shown, maximizing conversion. | Active |
| 2026-02-19 | **JSONB backup + normalized tables for journey storage** | Store full GeneratedJourney as JSONB in journey_templates.stages for easy reconstruction. Also insert normalized rows in journey_stages + meaningful_moments for queryability. loadJourney() tries JSONB first, falls back to table reconstruction. | Active |
| 2026-02-19 | **Admin client with service role for org creation** | During signup, user has no org_id yet so RLS would block. Use service role client (bypasses RLS) to create org + set user app_metadata.org_id. Admin client is server-only, never exposed to browser. | Active |
| 2026-02-19 | **Middleware route protection with preview bypass** | Public routes (/, /onboarding, /auth) always accessible. App routes (/dashboard, /confrontation, /journey, /playbook) allow authenticated users or users with ?id=preview. Dashboard/playbook always allowed through — they handle empty state. | Active |

---

*Decisions age. Context helps them age well.*
