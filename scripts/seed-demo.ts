/**
 * CX Mate — Demo Account Seed Script
 *
 * Creates or resets the demo@cxmate.app account with a pre-loaded
 * Flowdesk journey. Run this before any new demo or product release.
 *
 * Usage:
 *   npx tsx scripts/seed-demo.ts
 *
 * Requirements:
 *   - NEXT_PUBLIC_SUPABASE_URL in .env.local
 *   - SUPABASE_SERVICE_ROLE_KEY in .env.local
 *   - App running locally (http://localhost:3000) OR set DEMO_BASE_URL for production
 *
 * What it does:
 *   1. Creates demo@cxmate.app in Supabase Auth (if doesn't exist)
 *   2. Signs in as demo user to get a session token
 *   3. Posts the Flowdesk onboarding data to /api/onboarding
 *   4. Waits for journey generation (up to 3 min)
 *   5. Prints the journey URL for verification
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// ─── Config ──────────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BASE_URL = process.env.DEMO_BASE_URL || "http://localhost:3000";

const DEMO_EMAIL = "demo@cxmate.app";
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || "CxMateDemo2026!"; // override via env

// ─── Flowdesk Profile ─────────────────────────────────────────────────────────
// Every field calibrated for maximum demo output quality.
// See O-output/presale/demo-account-setup.md for rationale.

const FLOWDESK_ONBOARDING = {
  userName: "Alex Rivera",
  userRole: "Head of Product",
  companyName: "Flowdesk",
  companyWebsite: "flowdesk.io",
  vertical: "b2b_saas",
  companySize: "51-200",
  industry: "Project Management / Productivity",
  companyMaturity: "growing" as const,
  journeyType: "full_lifecycle" as const,
  hasExistingCustomers: true,

  // Customer profile
  customerCount: "201-500",
  customerDescription:
    "Teams and companies that manage client work, product delivery, or internal operations. They start a free trial, activate on Day 1, but we lose ~40% before they convert and another 20% in the first 60 days after paying.",
  customerSize: "11-50",
  mainChannel: "product_led",
  preLiveProcess:
    "Free trial → onboarding email sequence → optional sales call for teams 20+ → upgrade prompt at Day 14",

  // Business data
  pricingModel: "freemium_subscription",
  roughRevenue: "$1M-$5M",
  averageDealSize: "$2,000-$10,000",
  currentTools: "HubSpot, Intercom, Mixpanel, Stripe, Notion",

  // Existing journey
  hasExistingJourney: "partial" as const,
  existingJourneyComponents: ["sales_pipeline", "onboarding_checklist", "support_flow"],
  existingJourneyDescription:
    "We have a 5-email onboarding sequence and an in-app checklist, but they're disconnected. Trial-to-paid is ~18% and we think the aha moment isn't landing fast enough.",

  // CX Maturity
  measuresNps: false,
  measuresCsat: false,
  measuresCes: false,
  npsResponseCount: "",
  hasJourneyMap: false,
  dataVsGut: "mostly_gut",

  // Pain points — chosen to generate the richest journey
  biggestChallenge:
    "We're losing ~40% of trial users before converting, and another 20% in the first 60 days after they pay. We know the problem is in the activation window but we don't know exactly where it breaks.",
  painPoints: [
    "low_trial_conversion",
    "invisible_churn",
    "slow_onboarding",
    "high_support_volume",
  ],
  customPainPoint: "",

  // Goals — ambitious but realistic for the stage
  primaryGoal: "reduce_churn",
  customGoal: "",
  timeframe: "3-6_months",
  additionalContext:
    "We have a good product — NPS from users past 90 days is 42. The problem is people never getting there. If we can fix the first 90 days, everything compounds.",

  // Competitors — household names, generates differentiation angles
  competitors: "Asana, Monday.com, ClickUp, Notion, Linear",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function log(msg: string) {
  console.log(`[seed-demo] ${msg}`);
}

function err(msg: string) {
  console.error(`[seed-demo] ERROR: ${msg}`);
  process.exit(1);
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    err("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  }

  const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // ── Step 1: Create or verify demo user ──────────────────────────────────────
  log(`Checking for existing demo user: ${DEMO_EMAIL}`);

  const { data: existingUsers } = await adminClient.auth.admin.listUsers();
  const existingUser = existingUsers?.users?.find((u) => u.email === DEMO_EMAIL);

  if (existingUser) {
    log(`Demo user already exists (id: ${existingUser.id})`);
  } else {
    log("Creating demo user...");
    const { data: created, error } = await adminClient.auth.admin.createUser({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      email_confirm: true, // skip email verification
    });
    if (error) err(`Failed to create demo user: ${error.message}`);
    log(`Demo user created (id: ${created?.user?.id})`);
  }

  // ── Step 2: Sign in as demo user ─────────────────────────────────────────────
  log("Signing in as demo user...");
  const anonClient = createClient(SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: session, error: signInError } = await anonClient.auth.signInWithPassword({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  });

  if (signInError || !session?.session?.access_token) {
    err(`Sign in failed: ${signInError?.message || "no session returned"}`);
  }

  const token = session!.session!.access_token;
  log("Signed in. Session token acquired.");

  // ── Step 3: POST to /api/onboarding ──────────────────────────────────────────
  log(`Posting Flowdesk onboarding data to ${BASE_URL}/api/onboarding...`);
  log("This triggers journey generation via Claude API (~60-120 seconds). Please wait...");

  const response = await fetch(`${BASE_URL}/api/onboarding`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(FLOWDESK_ONBOARDING),
  });

  if (!response.ok) {
    const text = await response.text();
    err(`Onboarding API failed (${response.status}): ${text.slice(0, 500)}`);
  }

  // ── Step 4: Parse response ────────────────────────────────────────────────────
  const result = await response.json();
  const templateId = result?.templateId || result?.id;

  if (!templateId) {
    err("No templateId returned from onboarding API. Check the response: " + JSON.stringify(result).slice(0, 500));
  }

  // ── Step 5: Done ──────────────────────────────────────────────────────────────
  log("✅ Demo account ready!");
  log("");
  log("─────────────────────────────────────────────────────────");
  log(`  Login:       ${DEMO_EMAIL}`);
  log(`  Password:    ${DEMO_PASSWORD}`);
  log(`  Company:     Flowdesk`);
  log(`  Template ID: ${templateId}`);
  log("");
  log("  Verify:");
  log(`  CX Report → ${BASE_URL}/confrontation?id=${templateId}`);
  log(`  Journey   → ${BASE_URL}/journey?id=${templateId}`);
  log(`  Dashboard → ${BASE_URL}/dashboard`);
  log("─────────────────────────────────────────────────────────");
  log("");
  log("Next: open the CX Report link and note the revenue impact number for your demo script.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
