// Generate Noam's playbook from his reconstructed onboarding data
const payload = {
  userName: "Noam Dzachov",
  userEmail: "noam.s@orca-ai.io",
  userRole: "Customer Success Director",
  companyName: "Orca AI",
  companyWebsite: "https://orca-ai.io",
  vertical: "Maritime AI / Enterprise SaaS",
  industry: "Maritime Technology",
  companySize: "51-150",
  companyMaturity: "scaling",

  // Customer profile
  customerType: "enterprise",
  customerCount: "51-200",
  salesMotion: "sales_led",
  revenueModel: "hybrid",
  arrRange: "5m_20m",
  dealSize: "100k_500k",
  customerDescription: "Commercial shipping companies and vessel operators — enterprise accounts with multiple vessels, each requiring its own installation and crew training.",
  customerSize: "enterprise",
  mainChannel: "direct_sales",

  // Existing journey
  hasExistingJourney: "yes",
  existingJourneyComponents: [
    "sales_pipeline",
    "sales_playbook",
    "proposal_contract",
    "handoff_process",
    "onboarding_checklist",
    "cs_playbook",
    "qbr_cadence",
  ],
  existingJourneyDescription:
    "Salesforce for CRM. 48 hours for internal onboarding. 7 days to operational kickoff with the client. Target 30 days to first vessel installation. Each vessel requires a separate enablement journey. Customer is considered 'live' the moment the deal is signed — onboarding runs from deal close to first vessel fully operational.",

  // Onboarding process
  preLiveProcess:
    "48 hours internal prep. Then a 7-day operational kickoff with the client. Target: first vessel fully installed and running within 30 days. Each ship can have multiple vessels, and each vessel is a separate installation and enablement effort.",

  // Pain points (scaling stage)
  painPoints: ["handoff_gaps", "onboarding_scale", "inconsistent_cx", "expansion_missed", "no_health_scoring"],
  biggestChallenge: "onboarding_scale",
  customPainPoint: "Each vessel is its own onboarding journey — hard to scale without a structured per-vessel playbook.",

  // Goals (scaling stage)
  primaryGoal: "fix_onboarding_scale",
  secondaryGoals: ["scale_cx", "drive_expansion"],
  timeframe: "6_months",

  // Competitors
  competitors: "Traditional maritime navigation systems; a few emerging AI navigation players",

  // Additional context
  additionalContext:
    "AI-powered collision avoidance and route optimization for commercial vessels. Selling to shipping companies and vessel operators. Each vessel = separate license. B2B enterprise. Every customer has multiple vessels, each requiring its own installation, crew training, and go-live process. Using Salesforce.",

  // Derived
  journeyType: "full_lifecycle",
  hasExistingCustomers: true,
};

console.log("Calling generate-journey API for Orca AI / Noam...");
const res = await fetch("http://localhost:3000/api/onboarding", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

if (!res.ok) {
  const text = await res.text();
  console.error("Error:", res.status, text.slice(0, 500));
  process.exit(1);
}

const data = await res.json();
console.log("Success! Journey ID:", data.journeyId || "(no ID)");
console.log("Keys:", Object.keys(data));

// Save full response
import { writeFileSync } from "fs";
writeFileSync("/tmp/noam-journey.json", JSON.stringify(data, null, 2));
console.log("\nSaved to /tmp/noam-journey.json");
