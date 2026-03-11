/** Inject demo journey data into sessionStorage for testing */
export function seedDemoData() {
  const demoJourney = {
    templateId: "preview",
    onboardingData: {
      companyName: "Orca AI",
      userName: "Dor Skuler",
      companyMaturity: "growing",
      industry: "Maritime Technology",
      businessModel: "B2B SaaS",
      avgDealSize: "$150K-$500K",
      annualRevenue: "$5M-$15M",
    },
    journey: {
      name: "Orca AI Enterprise Maritime SaaS Customer Lifecycle",
      stages: [
        {
          name: "Awareness & Problem Recognition",
          stageType: "sales",
          description: "Maritime operators recognize vessel safety, fuel efficiency, or compliance gaps that demand AI-powered solutions.",
          meaningfulMoments: [
            { name: "Incident trigger", description: "A near-miss or compliance violation creates urgency for AI-based monitoring", sentiment: "negative", impactLevel: "high" },
            { name: "Regulation change", description: "New IMO or flag-state regulation requires enhanced situational awareness", sentiment: "neutral", impactLevel: "high" },
          ],
          touchpoints: ["Industry conference", "Maritime publication", "Peer referral", "LinkedIn content"],
          emotionalArc: "Anxiety about gaps → curiosity about AI solutions",
        },
        {
          name: "Evaluation & Proof of Concept",
          stageType: "sales",
          description: "Decision-makers evaluate Orca AI against alternatives through demos, pilot programs, and ROI analysis.",
          meaningfulMoments: [
            { name: "First demo impact", description: "Seeing AI collision avoidance in action creates a breakthrough moment", sentiment: "positive", impactLevel: "high" },
            { name: "Stakeholder alignment gap", description: "Technical vs. commercial stakeholders have different evaluation criteria", sentiment: "negative", impactLevel: "medium" },
          ],
          touchpoints: ["Product demo", "Technical deep-dive", "Pilot proposal", "Reference calls"],
          emotionalArc: "Skepticism → cautious optimism → internal championing",
        },
        {
          name: "Onboarding & Deployment",
          stageType: "post-sale",
          description: "Orca AI system is installed on vessels with crew training and integration into existing bridge systems.",
          meaningfulMoments: [
            { name: "First vessel live", description: "System goes live on first vessel — crew sees AI overlay for the first time", sentiment: "positive", impactLevel: "high" },
            { name: "Integration friction", description: "Connecting with existing navigation and fleet management systems creates delays", sentiment: "negative", impactLevel: "high" },
          ],
          touchpoints: ["Installation team visit", "Crew training sessions", "System integration", "Go-live call"],
          emotionalArc: "Excitement → frustration with integration → relief at go-live",
        },
        {
          name: "Value Realization",
          stageType: "post-sale",
          description: "Fleet operators begin seeing measurable safety improvements, fuel savings, and compliance benefits.",
          meaningfulMoments: [
            { name: "First avoided incident", description: "AI system prevents a near-miss — concrete proof of value", sentiment: "positive", impactLevel: "high" },
            { name: "ROI report delivery", description: "Quarterly review shows measurable fuel savings and insurance premium reduction", sentiment: "positive", impactLevel: "high" },
          ],
          touchpoints: ["Monthly performance review", "QBR with fleet manager", "Dashboard analytics", "Case study request"],
          emotionalArc: "Cautious monitoring → growing confidence → advocacy",
        },
        {
          name: "Expansion & Fleet Rollout",
          stageType: "post-sale",
          description: "Success on initial vessels drives expansion across the fleet and into new vessel classes.",
          meaningfulMoments: [
            { name: "Fleet-wide decision", description: "Board approves full fleet deployment based on pilot results", sentiment: "positive", impactLevel: "high" },
            { name: "Budget approval delay", description: "Capital expenditure approval process stalls fleet-wide rollout", sentiment: "negative", impactLevel: "medium" },
          ],
          touchpoints: ["Executive QBR", "Expansion proposal", "Procurement negotiation", "Implementation planning"],
          emotionalArc: "Enthusiasm for expansion → procurement friction → commitment",
        },
        {
          name: "Retention & Advocacy",
          stageType: "post-sale",
          description: "Long-term customers become advocates, driving referrals and co-development of new features.",
          meaningfulMoments: [
            { name: "Industry reference", description: "Customer agrees to speak at maritime conference about Orca AI impact", sentiment: "positive", impactLevel: "high" },
            { name: "Renewal friction", description: "Contract renewal negotiations surface pricing concerns or competitor alternatives", sentiment: "negative", impactLevel: "high" },
          ],
          touchpoints: ["Annual review", "Contract renewal", "Product advisory board", "Conference co-presentation"],
          emotionalArc: "Loyalty → potential fatigue → renewed commitment or churn risk",
        },
      ],
      confrontationInsights: [
        {
          pattern: "Integration complexity creates 6-8 week onboarding delays",
          description: "Each vessel has unique bridge systems. Integration takes 3x longer than sales promises, eroding initial goodwill and delaying value realization.",
          likelihood: "High",
          businessImpact: "$2.1M annual revenue at risk from delayed deployments and reduced expansion velocity",
        },
        {
          pattern: "Stakeholder misalignment kills 40% of expansion deals",
          description: "Technical champions love the product, but commercial decision-makers see different ROI metrics. Without aligned business cases, fleet-wide deals stall.",
          likelihood: "High",
          businessImpact: "$4.5M in pipeline value stuck in evaluation stage beyond 6 months",
        },
        {
          pattern: "No proactive QBR process — value goes unreported",
          description: "Customers don't realize the full impact Orca AI has on their operations because there's no structured quarterly review cadence. Renewal conversations start from zero.",
          likelihood: "Medium",
          businessImpact: "$1.8M renewal revenue at risk from customers who can't articulate internal ROI",
        },
        {
          pattern: "Crew adoption resistance on 30% of vessels",
          description: "Bridge officers see AI as oversight rather than support. Without proper change management, crew workarounds reduce system effectiveness.",
          likelihood: "Medium",
          businessImpact: "$900K in potential churn from vessels where usage drops below threshold",
        },
        {
          pattern: "Competitive pressure from Chinese maritime AI startups",
          description: "Lower-cost alternatives are emerging in Asian shipping markets. Without clear differentiation narrative, price-sensitive fleet operators may switch.",
          likelihood: "Low",
          businessImpact: "$3.2M in at-risk accounts in APAC region over 18 months",
        },
      ],
      impactProjections: [
        { area: "Revenue at risk from onboarding delays", value: "$2.1M", timeframe: "Annual" },
        { area: "Pipeline stuck in extended evaluation", value: "$4.5M", timeframe: "Current quarter" },
        { area: "Renewal risk from unreported value", value: "$1.8M", timeframe: "Next 12 months" },
      ],
    },
  };

  sessionStorage.setItem("cx-mate-journey", JSON.stringify(demoJourney));
  return demoJourney;
}
