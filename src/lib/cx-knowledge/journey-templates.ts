/**
 * CX Architect Knowledge Base: Journey Templates
 *
 * These templates define the standard journey stages for different journey types.
 * The AI uses these as a foundation, then customizes based on the company's
 * vertical, size, and specific context from onboarding.
 */

import type { StageType } from "@/types/database";

export interface StageTemplate {
  name: string;
  stageType: StageType;
  description: string;
  emotionalState: string;
  typicalDuration: string;
  keyQuestion: string; // The question the customer is asking themselves at this stage
}

// ============================================
// Sales Journey Stages
// ============================================
export const SALES_STAGES: StageTemplate[] = [
  {
    name: "Awareness",
    stageType: "sales",
    description:
      "The prospect first becomes aware of a problem they have and starts looking for solutions.",
    emotionalState: "curious",
    typicalDuration: "1-4 weeks",
    keyQuestion: "Do I actually have this problem?",
  },
  {
    name: "Evaluation",
    stageType: "sales",
    description:
      "The prospect is actively comparing solutions, reading reviews, and building a shortlist.",
    emotionalState: "analytical",
    typicalDuration: "1-3 weeks",
    keyQuestion: "Which solution fits my needs best?",
  },
  {
    name: "Demo & Trial",
    stageType: "sales",
    description:
      "The prospect is hands-on with your product — testing, asking questions, involving stakeholders.",
    emotionalState: "hopeful",
    typicalDuration: "1-2 weeks",
    keyQuestion: "Does this actually work for us?",
  },
  {
    name: "Negotiation",
    stageType: "sales",
    description:
      "Terms, pricing, and logistics are being discussed. Internal buy-in is being secured.",
    emotionalState: "cautious",
    typicalDuration: "1-3 weeks",
    keyQuestion: "Can we make this work within our budget and constraints?",
  },
  {
    name: "Close",
    stageType: "sales",
    description:
      "The deal is signed. This is the transition point from prospect to customer.",
    emotionalState: "excited",
    typicalDuration: "1-3 days",
    keyQuestion: "Did I make the right choice?",
  },
];

// ============================================
// Customer Journey Stages
// ============================================
export const CUSTOMER_STAGES: StageTemplate[] = [
  {
    name: "Onboarding",
    stageType: "customer",
    description:
      "The customer is setting up your product, learning the basics, and getting their first win.",
    emotionalState: "eager",
    typicalDuration: "1-4 weeks",
    keyQuestion: "How do I get started and see value quickly?",
  },
  {
    name: "Adoption",
    stageType: "customer",
    description:
      "The customer is integrating your product into their daily workflow. Usage is growing.",
    emotionalState: "focused",
    typicalDuration: "1-3 months",
    keyQuestion: "Is this becoming essential to how we work?",
  },
  {
    name: "Value Realization",
    stageType: "customer",
    description:
      "The customer is seeing measurable results. They can articulate the ROI of your product.",
    emotionalState: "confident",
    typicalDuration: "2-6 months",
    keyQuestion: "Is this actually delivering on the promise?",
  },
  {
    name: "Expansion",
    stageType: "customer",
    description:
      "The customer is exploring more features, adding users, or upgrading their plan.",
    emotionalState: "ambitious",
    typicalDuration: "3-12 months",
    keyQuestion: "What else can this do for us?",
  },
  {
    name: "Renewal & Advocacy",
    stageType: "customer",
    description:
      "The customer is renewing, referring others, and becoming a champion for your product.",
    emotionalState: "loyal",
    typicalDuration: "ongoing",
    keyQuestion: "Should I keep investing in this? Would I recommend it?",
  },
];

// ============================================
// Full Lifecycle = Sales + Customer
// ============================================
export const FULL_LIFECYCLE_STAGES: StageTemplate[] = [
  ...SALES_STAGES,
  ...CUSTOMER_STAGES,
];

// ============================================
// Get stages by journey type
// ============================================
export function getDefaultStages(
  journeyType: "sales" | "customer" | "full_lifecycle"
): StageTemplate[] {
  switch (journeyType) {
    case "sales":
      return SALES_STAGES;
    case "customer":
      return CUSTOMER_STAGES;
    case "full_lifecycle":
      return FULL_LIFECYCLE_STAGES;
  }
}
