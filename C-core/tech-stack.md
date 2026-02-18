# CX Mate - Tech Stack & Architecture

## Stack (Decided)

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14+ (App Router), React, TypeScript, Tailwind CSS |
| UI Components | shadcn/ui |
| Animations | Framer Motion (minimal, purposeful) |
| Journey Visualization | React Flow or custom SVG |
| Backend | Next.js API Routes (Phase 1), separate service later |
| Database | PostgreSQL via Supabase (auth, storage, realtime) |
| AI/LLM | Claude API (Anthropic) |
| Integrations | REST APIs for HubSpot, Intercom (Phase 3) |
| Hosting | Vercel (frontend) + Supabase (backend/DB) |
| Analytics | PostHog (product analytics) |
| Payments | Stripe (Phase 4) |

## Architecture Principles

1. **Monolith-first:** Start with Next.js full-stack, extract services later
2. **Event-driven core:** All journey state changes emit events
3. **API-first design:** Every feature accessible via API (for Phase 3)
4. **Multi-tenant from day 1:** Proper data isolation per organization
5. **AI as a service layer:** LLM calls abstracted behind service interface

## Core Data Model

### Organization
- id, name, vertical, size, brand_dna (JSON)
- settings, plan_tier, created_at

### JourneyTemplate
- id, org_id, name, vertical, is_default
- stages (JSON array of stage objects)
- source (ai_generated | custom | industry_template)

### JourneyStage
- id, template_id, name, order, description
- emotional_state, typical_duration_days
- meaningful_moments (JSON array)

### MeaningfulMoment
- id, stage_id, type (truth | pain | delight | risk)
- name, description, severity (critical | high | medium | low)
- triggers (JSON), recommendations (JSON array)

### Recommendation
- id, moment_id, action_type (email | call | internal | automation)
- what, when_trigger, how_template, why_principle
- measure_metric, priority

### Customer (Phase 2+)
- id, org_id, name, email, current_stage_id
- health_score, sentiment, last_interaction
- journey_events (JSON array of timestamped events)

## API Structure

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/onboarding | Submit onboarding answers |
| GET | /api/journey | Get current journey map |
| POST | /api/journey/generate | AI-generate journey from inputs |
| PUT | /api/journey/stage/:id | Update a stage |
| GET | /api/moments | List meaningful moments |
| GET | /api/recommendations | Get recommendations for a moment |
| POST | /api/recommendations/gen | AI-generate recommendations |
| GET | /api/dashboard | Dashboard overview metrics |
| POST | /api/integrations/:type | Connect external service (Phase 3) |

## Security

- Supabase RLS: Users only see their org data
- API rate limiting: 100 req/min per org
- LLM calls: Server-side only, never expose API keys
- Input validation: Zod schemas on all endpoints
- Audit log for all data mutations

## UI Structure (Key Pages)

### /onboarding - 5-step wizard
1. Company basics (vertical, size, product type)
2. Customer profile (who they serve, ICP)
3. Current journey (how customers find/buy/use)
4. Known pain points (what breaks, gut feelings)
5. Goals (what success looks like in 90 days)

### /journey - Interactive journey map
- Horizontal timeline with stages
- Color-coded severity (red/orange/yellow/green)
- Expandable moments with recommendations

### /playbook - Recommendations view
- Grouped by journey stage
- Status tracking (not started / in progress / done)

### /dashboard - Health overview
- Journey completion score
- Recommendations status
- Key metrics by stage
