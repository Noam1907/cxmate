/**
 * CX Architect Knowledge Base: Vertical Configurations
 *
 * Different verticals have different journey characteristics.
 * This data helps the AI customize the journey for the user's industry.
 */

export interface VerticalConfig {
  id: string;
  label: string;
  description: string;
  typicalSalesCycle: string;
  typicalChurnDrivers: string[];
  keyMoments: string[]; // Moments that are especially important for this vertical
}

export const VERTICALS: VerticalConfig[] = [
  {
    id: "b2b_saas",
    label: "B2B SaaS",
    description: "Software sold as a subscription to other businesses",
    typicalSalesCycle: "2-8 weeks",
    typicalChurnDrivers: [
      "Poor onboarding",
      "Low adoption",
      "Champion leaving",
      "Budget cuts",
    ],
    keyMoments: [
      "First value moment",
      "Team adoption",
      "Usage plateau",
      "Renewal risk",
    ],
  },
  {
    id: "professional_services",
    label: "Professional Services",
    description:
      "Consulting, agencies, accounting, legal, or other service businesses",
    typicalSalesCycle: "2-12 weeks",
    typicalChurnDrivers: [
      "Unclear deliverables",
      "Communication gaps",
      "Scope creep",
      "Key person dependency",
    ],
    keyMoments: [
      "Project kickoff",
      "First deliverable",
      "Scope change",
      "Contract renewal",
    ],
  },
  {
    id: "marketplace",
    label: "Marketplace / Platform",
    description: "Two-sided platforms connecting buyers and sellers",
    typicalSalesCycle: "1-4 weeks",
    typicalChurnDrivers: [
      "Low supply quality",
      "Slow time to first match",
      "Platform fees too high",
      "Better alternative found",
    ],
    keyMoments: [
      "First successful transaction",
      "Repeat usage",
      "Supply/demand imbalance",
      "Trust moment",
    ],
  },
  {
    id: "fintech",
    label: "Fintech / Financial Services",
    description: "Financial technology products and services",
    typicalSalesCycle: "4-16 weeks",
    typicalChurnDrivers: [
      "Compliance concerns",
      "Integration complexity",
      "Trust and security worries",
      "Switching costs",
    ],
    keyMoments: [
      "KYC/compliance approval",
      "First transaction",
      "Integration go-live",
      "Audit success",
    ],
  },
  {
    id: "ecommerce_b2b",
    label: "B2B E-commerce",
    description: "Wholesale, distribution, or B2B online retail",
    typicalSalesCycle: "1-6 weeks",
    typicalChurnDrivers: [
      "Price competition",
      "Fulfillment issues",
      "Catalog gaps",
      "Payment terms",
    ],
    keyMoments: [
      "First order",
      "Reorder",
      "Credit approval",
      "Volume discount threshold",
    ],
  },
  {
    id: "healthtech",
    label: "Healthtech",
    description: "Health technology products and digital health services",
    typicalSalesCycle: "8-24 weeks",
    typicalChurnDrivers: [
      "Regulatory changes",
      "Integration with existing systems",
      "Clinical validation concerns",
      "Budget approval cycles",
    ],
    keyMoments: [
      "Pilot success",
      "Clinical validation",
      "IT integration",
      "Contract expansion",
    ],
  },
  {
    id: "other",
    label: "Other",
    description: "Something else — we'll customize based on your description",
    typicalSalesCycle: "varies",
    typicalChurnDrivers: [],
    keyMoments: [],
  },
];

export function getVertical(id: string): VerticalConfig | undefined {
  return VERTICALS.find((v) => v.id === id);
}
