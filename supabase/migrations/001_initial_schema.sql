-- CX Mate Initial Schema
-- Multi-tenant with Row Level Security from day 1

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- Organizations
-- ============================================
create table public.organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  vertical text not null,
  size text not null,
  brand_dna jsonb default '{}',
  settings jsonb default '{}',
  plan_tier text not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organizations enable row level security;

create policy "Users can view their own organization"
  on public.organizations for select
  using (id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::uuid);

create policy "Users can update their own organization"
  on public.organizations for update
  using (id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::uuid);

-- ============================================
-- Journey Templates
-- ============================================
create table public.journey_templates (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  vertical text not null,
  journey_type text not null default 'customer', -- 'sales', 'customer', or 'full_lifecycle'
  is_default boolean not null default false,
  stages jsonb default '[]',
  source text not null default 'ai_generated',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.journey_templates enable row level security;

create policy "Users can view their org journey templates"
  on public.journey_templates for select
  using (org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::uuid);

create policy "Users can insert journey templates for their org"
  on public.journey_templates for insert
  with check (org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::uuid);

create policy "Users can update their org journey templates"
  on public.journey_templates for update
  using (org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::uuid);

-- ============================================
-- Journey Stages
-- ============================================
create table public.journey_stages (
  id uuid primary key default uuid_generate_v4(),
  template_id uuid not null references public.journey_templates(id) on delete cascade,
  name text not null,
  stage_type text not null default 'customer', -- 'sales' or 'customer' (indicates which side of the lifecycle)
  order_index integer not null,
  description text default '',
  emotional_state text default 'neutral',
  meaningful_moments jsonb default '[]',
  created_at timestamptz not null default now()
);

alter table public.journey_stages enable row level security;

create policy "Users can view stages of their org templates"
  on public.journey_stages for select
  using (
    template_id in (
      select id from public.journey_templates
      where org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::uuid
    )
  );

create policy "Users can insert stages for their org templates"
  on public.journey_stages for insert
  with check (
    template_id in (
      select id from public.journey_templates
      where org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::uuid
    )
  );

create policy "Users can update stages of their org templates"
  on public.journey_stages for update
  using (
    template_id in (
      select id from public.journey_templates
      where org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::uuid
    )
  );

-- ============================================
-- Meaningful Moments
-- ============================================
create table public.meaningful_moments (
  id uuid primary key default uuid_generate_v4(),
  stage_id uuid not null references public.journey_stages(id) on delete cascade,
  type text not null,
  name text not null,
  description text default '',
  severity text default 'medium',
  triggers jsonb default '[]',
  recommendations jsonb default '[]',
  created_at timestamptz not null default now()
);

alter table public.meaningful_moments enable row level security;

create policy "Users can view moments of their org stages"
  on public.meaningful_moments for select
  using (
    stage_id in (
      select js.id from public.journey_stages js
      join public.journey_templates jt on js.template_id = jt.id
      where jt.org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::uuid
    )
  );

create policy "Users can insert moments for their org stages"
  on public.meaningful_moments for insert
  with check (
    stage_id in (
      select js.id from public.journey_stages js
      join public.journey_templates jt on js.template_id = jt.id
      where jt.org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::uuid
    )
  );

-- ============================================
-- Recommendations
-- ============================================
create table public.recommendations (
  id uuid primary key default uuid_generate_v4(),
  moment_id uuid not null references public.meaningful_moments(id) on delete cascade,
  action_type text not null,
  what text not null,
  when_trigger text default '',
  how_template text default '',
  why_principle text default '',
  measure_metric text default '',
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.recommendations enable row level security;

create policy "Users can view recommendations for their org"
  on public.recommendations for select
  using (
    moment_id in (
      select mm.id from public.meaningful_moments mm
      join public.journey_stages js on mm.stage_id = js.id
      join public.journey_templates jt on js.template_id = jt.id
      where jt.org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::uuid
    )
  );

create policy "Users can insert recommendations for their org"
  on public.recommendations for insert
  with check (
    moment_id in (
      select mm.id from public.meaningful_moments mm
      join public.journey_stages js on mm.stage_id = js.id
      join public.journey_templates jt on js.template_id = jt.id
      where jt.org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::uuid
    )
  );

create policy "Users can update recommendations for their org"
  on public.recommendations for update
  using (
    moment_id in (
      select mm.id from public.meaningful_moments mm
      join public.journey_stages js on mm.stage_id = js.id
      join public.journey_templates jt on js.template_id = jt.id
      where jt.org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::uuid
    )
  );

-- ============================================
-- Indexes
-- ============================================
create index idx_journey_templates_org_id on public.journey_templates(org_id);
create index idx_journey_stages_template_id on public.journey_stages(template_id);
create index idx_meaningful_moments_stage_id on public.meaningful_moments(stage_id);
create index idx_recommendations_moment_id on public.recommendations(moment_id);

-- ============================================
-- Updated_at trigger
-- ============================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_organizations_updated
  before update on public.organizations
  for each row execute function public.handle_updated_at();

create trigger on_journey_templates_updated
  before update on public.journey_templates
  for each row execute function public.handle_updated_at();
