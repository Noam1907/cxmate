// Step 2: Generate Mesh Payments Playbook/Recommendations
// Reads the journey from /tmp/mesh-journey.json and calls /api/recommendations/generate

import { readFileSync, writeFileSync } from "fs";

const raw = readFileSync("/tmp/mesh-journey.json", "utf-8");
const data = JSON.parse(raw);

const payload = {
  journey: data.journey,
  onboardingData: data.onboardingData,
  templateId: "preview",
};

console.log("🎯 Generating Mesh Payments Playbook...");
console.log(`Journey stages: ${data.journey.stages.length}`);

const startTime = Date.now();

const res = await fetch("http://localhost:3000/api/recommendations/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

if (!res.ok) {
  const text = await res.text();
  console.error("❌ Error:", res.status, text.slice(0, 1000));
  process.exit(1);
}

const recs = await res.json();
const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
console.log(`✅ Playbook generated in ${elapsed}s`);
console.log("Keys:", Object.keys(recs));

writeFileSync("/tmp/mesh-recommendations.json", JSON.stringify(recs, null, 2));
console.log("Saved to /tmp/mesh-recommendations.json");

// Print preview
const recommendations = recs.recommendations || recs || [];
const recArray = Array.isArray(recommendations) ? recommendations : [];
console.log(`\nTotal recommendations: ${recArray.length}`);
for (const rec of recArray) {
  console.log(`  [${rec.type || "?"}] ${rec.title || rec.name} — Stage: ${rec.stage || "?"} | Priority: ${rec.priority || "?"}`);
}
