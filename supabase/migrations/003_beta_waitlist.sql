-- CX Mate Beta — Waitlist + Invite Codes
-- Sprint 4: Beta launch infrastructure

-- ============================================
-- Waitlist
-- ============================================
-- Stores interested users who submit the waitlist form.
-- No auth required — publicly writable (via service role only in API).

create table public.waitlist (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  company text,
  role text,
  cx_challenge text,              -- "What's your biggest CX challenge?"
  referral_source text,           -- How did they hear about us
  status text not null default 'pending',  -- 'pending', 'invited', 'joined'
  invited_at timestamptz,
  invite_code text,               -- The code sent to this user (if any)
  created_at timestamptz not null default now()
);

-- No RLS needed — this table is ONLY written to via service-role API route.
-- Never exposed to client-side Supabase queries.
alter table public.waitlist enable row level security;

-- No policies = no access from client. Service role bypasses RLS.
-- Admins can query directly in Supabase dashboard.

-- Unique email constraint
create unique index waitlist_email_idx on public.waitlist(email);

-- ============================================
-- Invite Codes
-- ============================================
-- Admin creates codes in Supabase dashboard.
-- Users enter code during signup to gain access.

create table public.invite_codes (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,
  created_for text,               -- Name / email of who this was created for (optional)
  note text,                      -- Admin note (e.g. "LinkedIn beta cohort 1")
  max_uses integer not null default 1,
  use_count integer not null default 0,
  is_active boolean not null default true,
  used_by_org_id uuid references public.organizations(id) on delete set null,
  created_at timestamptz not null default now(),
  used_at timestamptz
);

-- No client access — service role only
alter table public.invite_codes enable row level security;

-- Seed: a few initial beta invite codes for the first cohort
-- Admin can generate more directly in Supabase dashboard
insert into public.invite_codes (code, note, max_uses) values
  ('CXBETA2026', 'General beta cohort — LinkedIn post', 50),
  ('EARLYBIRD', 'Early bird users', 20),
  ('CXFIRST', 'First demo attendees', 10);
