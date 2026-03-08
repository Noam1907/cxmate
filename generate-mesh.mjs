// Generate full CX journey + playbook for Mesh Payments
// Corporate spend management / T&E — Scaling stage, $20M+ ARR, $40-75K deal size
// V2: Based on REAL onboarding answers (no fabricated ERP/adoption narrative)

const payload = {
  userName: "Eyal Paz",
  userEmail: "eyal@meshpayments.com",
  userRole: "VP Customer Success",
  companyName: "Mesh Payments",
  companyWebsite: "https://meshpayments.com",
  vertical: "B2B FinTech / Corporate Spend & Travel Management",
  industry: "Financial Technology",
  companySize: "300+",
  companyMaturity: "scaling",

  // Customer profile
  customerCount: "200+",
  customerDescription:
    "Mid-market to enterprise companies looking for card, expense, and travel management capabilities. Customers want to consolidate T&E but need agnostic capabilities — offline travel, online travel, etc. They can use Mesh cards but also want to keep their own corporate cards. Evaluation involves comparing consolidation breadth, travel flexibility, and card program options.",
  customerSize: "mixed",
  mainChannel: "sales_led",

  // Existing journey — PARTIAL (not fully documented)
  hasExistingJourney: "partial",
  existingJourneyComponents: [
    "sales_pipeline",
    "onboarding_checklist",
  ],
  existingJourneyDescription: "",

  // What happens between deal close and go-live
  preLiveProcess: "",

  // Pain points (scaling stage) — the REAL ones
  painPoints: [
    "handoff_gaps",
    "onboarding_scale",
    "late_risk_detection",
    "data_silos",
    "no_qbr_process",
  ],
  biggestChallenge: "onboarding_scale",
  customPainPoint:
    "Lead generation is a major pain — not enough leads coming in to feed the pipeline.",

  // Goals (scaling stage)
  primaryGoal: "fix_onboarding_scale",
  secondaryGoals: ["drive_expansion"],
  timeframe: "6_months",

  // Competitors
  competitors: "Ramp, Brex, Navan, SAP Concur, TravelPerk",

  // CX tools currently used
  currentTools: "HubSpot, Salesforce, Zendesk",

  // Business data
  pricingModel: "packages",
  roughRevenue: "20m_plus",
  averageDealSize: "50k_100k",

  // Additional context — keep it factual, no fabrication
  additionalContext: "",

  // Derived
  journeyType: "full_lifecycle",
  hasExistingCustomers: true,
};

console.log("🚀 Starting Mesh Payments V2 generation (real answers)...");
console.log("Company: Mesh Payments | Stage: Scaling | ARR: $20M+ | Deal: $40-75K");
console.log("Pain: handoff, onboarding scale, risk detection, data silos, no QBR");
console.log("Calling /api/onboarding...\n");

const startTime = Date.now();

const res = await fetch("http://localhost:3000/api/onboarding", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

if (!res.ok) {
  const text = await res.text();
  console.error("❌ Error:", res.status, text.slice(0, 500));
  process.exit(1);
}

const data = await res.json();
const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
console.log(`✅ Journey generated in ${elapsed}s`);
console.log("Journey ID:", data.journeyId || "(no ID)");
console.log("Keys returned:", Object.keys(data));

// Save full raw response
import { writeFileSync } from "fs";
writeFileSync("/tmp/mesh-journey-v2.json", JSON.stringify(data, null, 2));
console.log("\nFull response saved to /tmp/mesh-journey-v2.json");
console.log("\n--- JOURNEY STAGES ---");

if (data.journey?.stages) {
  for (const stage of data.journey.stages) {
    console.log(`\n[${stage.name}] — ${stage.moments?.length || 0} moments`);
    if (stage.moments) {
      for (const moment of stage.moments) {
        const risk = moment.riskLevel || moment.severity || "?";
        console.log(`  • ${moment.name} [${risk}]`);
      }
    }
  }
}

console.log("\n--- CONFRONTATION PATTERNS ---");
if (data.confrontation?.patterns) {
  for (const p of data.confrontation.patterns) {
    console.log(`  ⚡ ${p.name || p.pattern}: ${p.description?.slice(0, 100) || ""}...`);
  }
}

console.log("\n--- RECOMMENDATIONS ---");
if (data.recommendations) {
  const recs = Array.isArray(data.recommendations)
    ? data.recommendations
    : data.recommendations?.recommendations || [];
  console.log(`Total: ${recs.length} recommendations`);
  for (const rec of recs.slice(0, 8)) {
    console.log(`  → [${rec.type || "?"}] ${rec.title || rec.name}`);
  }
}
