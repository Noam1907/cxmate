-- CX Mate Billing Schema
-- Stripe integration: customer ID, subscription tracking, plan tier

-- ============================================
-- Add Stripe fields to organizations
-- ============================================
alter table public.organizations
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists stripe_subscription_status text,
  add column if not exists stripe_price_id text,
  add column if not exists subscription_current_period_end timestamptz;

-- Unique constraint on stripe_customer_id (one customer per org)
create unique index if not exists idx_org_stripe_customer
  on public.organizations(stripe_customer_id)
  where stripe_customer_id is not null;

-- Index for webhook lookups by stripe_customer_id
create index if not exists idx_org_stripe_subscription
  on public.organizations(stripe_subscription_id)
  where stripe_subscription_id is not null;

-- ============================================
-- Plan tier values (for reference):
--   'free'    — no payment required
--   'starter' — $79/mo or $149 one-time
--   'pro'     — $199/mo (future)
--   'premium' — $1200/year (future)
-- ============================================
