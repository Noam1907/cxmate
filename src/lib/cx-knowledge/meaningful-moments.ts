/**
 * CX Architect Knowledge Base: Meaningful Moments
 *
 * Meaningful moments are the make-or-break points in a customer journey.
 * These are the moments where customers decide to stay, buy, leave, or advocate.
 *
 * Types:
 * - "risk"     → Customer might leave or deal might stall
 * - "delight"  → Opportunity to exceed expectations
 * - "decision" → Customer is making a key choice
 * - "handoff"  → Transition between stages or teams
 */

export interface MomentTemplate {
  name: string;
  type: "risk" | "delight" | "decision" | "handoff";
  stage: string; // Which stage this moment typically appears in
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  triggers: string[]; // What signals that this moment is happening
  defaultRecommendations: string[]; // Starting point recommendations
}

// ============================================
// Sales Meaningful Moments
// ============================================
export const SALES_MOMENTS: MomentTemplate[] = [
  // Awareness
  {
    name: "First impression",
    type: "decision",
    stage: "Awareness",
    description:
      "The prospect's first interaction with your brand. Sets the tone for everything that follows.",
    severity: "high",
    triggers: [
      "Website visit",
      "First email opened",
      "Social media engagement",
      "Referral received",
    ],
    defaultRecommendations: [
      "Ensure your website clearly explains what you do in one sentence",
      "Have a clear, low-friction way to learn more (not just 'book a demo')",
      "Respond to inbound inquiries within 2 hours",
    ],
  },
  // Evaluation
  {
    name: "Competitor comparison",
    type: "risk",
    stage: "Evaluation",
    description:
      "The prospect is actively comparing you to alternatives. You need to stand out on what matters to them.",
    severity: "high",
    triggers: [
      "Prospect asks about competitors",
      "Pricing page visits increase",
      "Multiple stakeholders viewing your site",
    ],
    defaultRecommendations: [
      "Create a comparison page that's honest about trade-offs",
      "Focus on your unique differentiator, not feature lists",
      "Offer a personalized demo showing their specific use case",
    ],
  },
  {
    name: "Stakeholder buy-in",
    type: "risk",
    stage: "Evaluation",
    description:
      "The champion needs to sell internally. If they can't articulate your value, the deal stalls.",
    severity: "critical",
    triggers: [
      "Request for a deck or summary",
      "New contacts from same company",
      "Deal velocity slowing",
    ],
    defaultRecommendations: [
      "Provide a one-pager the champion can share internally",
      "Offer to join a call with other stakeholders",
      "Send a personalized ROI estimate they can forward",
    ],
  },
  // Demo & Trial
  {
    name: "First 'aha!' moment in trial",
    type: "delight",
    stage: "Demo & Trial",
    description:
      "The moment the prospect sees your product solve their specific problem. This is what closes deals.",
    severity: "critical",
    triggers: [
      "Prospect completes key action in trial",
      "Positive reaction during demo",
      "Request for pricing after demo",
    ],
    defaultRecommendations: [
      "Design your demo to reach the aha moment within 10 minutes",
      "For trials, send guided emails pointing to the highest-value feature",
      "Follow up within 24 hours of their first meaningful action",
    ],
  },
  // Negotiation
  {
    name: "Pricing objection",
    type: "risk",
    stage: "Negotiation",
    description:
      "Price pushback is normal, but how you handle it reveals your confidence in your value.",
    severity: "high",
    triggers: [
      "Request for discount",
      "Comparison to cheaper alternative",
      "Budget concerns raised",
    ],
    defaultRecommendations: [
      "Reframe around value and ROI, not cost",
      "Offer flexible payment terms rather than discounts",
      "Show a clear implementation timeline to reduce perceived risk",
    ],
  },
  // Close
  {
    name: "Deal signed → handoff to CS",
    type: "handoff",
    stage: "Close",
    description:
      "The transition from sales to customer success. This is where many companies drop the ball.",
    severity: "critical",
    triggers: [
      "Contract signed",
      "Payment received",
      "Sales marks deal as closed-won",
    ],
    defaultRecommendations: [
      "Send a welcome email within 1 hour of signing",
      "Introduce the CS contact personally (warm handoff, not cold)",
      "Share everything learned during sales with the CS team",
    ],
  },
];

// ============================================
// Customer Meaningful Moments
// ============================================
export const CUSTOMER_MOMENTS: MomentTemplate[] = [
  // Onboarding
  {
    name: "First value moment",
    type: "delight",
    stage: "Onboarding",
    description:
      "The customer achieves their first meaningful result with your product. This cements the relationship.",
    severity: "critical",
    triggers: [
      "Core feature used for first time",
      "First report generated",
      "First integration connected",
    ],
    defaultRecommendations: [
      "Design onboarding to reach first value within 24 hours",
      "Send a congratulations message when they hit their first milestone",
      "Check in personally if they haven't reached first value within 3 days",
    ],
  },
  {
    name: "Setup friction",
    type: "risk",
    stage: "Onboarding",
    description:
      "The customer hits a wall during setup — technical issues, confusion, or lack of documentation.",
    severity: "high",
    triggers: [
      "Support ticket during first week",
      "Incomplete onboarding steps",
      "Login but no meaningful activity",
    ],
    defaultRecommendations: [
      "Proactively reach out if onboarding isn't completed within 48 hours",
      "Offer a 1-on-1 setup call for complex configurations",
      "Create short video walkthroughs for common setup steps",
    ],
  },
  // Adoption
  {
    name: "Usage plateau",
    type: "risk",
    stage: "Adoption",
    description:
      "Usage flatlines. The customer is using your product but not growing — a sign they may not be getting full value.",
    severity: "medium",
    triggers: [
      "Login frequency declining",
      "Only using 1-2 features",
      "No new users added",
    ],
    defaultRecommendations: [
      "Send a 'did you know?' email highlighting underused features",
      "Schedule a quarterly business review to realign on goals",
      "Share a case study from a similar company using advanced features",
    ],
  },
  {
    name: "Team adoption",
    type: "delight",
    stage: "Adoption",
    description:
      "The product spreads beyond the champion to the broader team. This is a strong retention signal.",
    severity: "high",
    triggers: [
      "New user invitations",
      "Multiple active users",
      "Different departments logging in",
    ],
    defaultRecommendations: [
      "Create a team-specific onboarding flow for new users",
      "Offer a training session when 3+ users are added",
      "Celebrate team milestones (e.g., 'Your team just hit 100 actions!')",
    ],
  },
  // Value Realization
  {
    name: "ROI proof point",
    type: "delight",
    stage: "Value Realization",
    description:
      "The customer can now quantify the value your product delivers. This is what drives renewals.",
    severity: "high",
    triggers: [
      "Customer mentions savings or improvement",
      "Usage of reporting features",
      "Request for data export",
    ],
    defaultRecommendations: [
      "Build an automated ROI dashboard they can share internally",
      "Send a quarterly impact summary",
      "Ask for a testimonial or case study when ROI is proven",
    ],
  },
  // Expansion
  {
    name: "Expansion signal",
    type: "decision",
    stage: "Expansion",
    description:
      "The customer is showing signs they need more — more seats, features, or capabilities.",
    severity: "high",
    triggers: [
      "Hitting plan limits",
      "Asking about enterprise features",
      "Requesting API access",
    ],
    defaultRecommendations: [
      "Proactively reach out before they hit hard limits",
      "Show them what the next tier unlocks with a personalized demo",
      "Offer a trial of premium features to demonstrate value",
    ],
  },
  // Renewal & Advocacy
  {
    name: "Renewal risk",
    type: "risk",
    stage: "Renewal & Advocacy",
    description:
      "Signs that the customer may not renew. Act early — by the time they say they're leaving, it's often too late.",
    severity: "critical",
    triggers: [
      "Usage declining 30+ days before renewal",
      "Champion left the company",
      "Support tickets increasing",
      "No login in 2+ weeks",
    ],
    defaultRecommendations: [
      "Set up automated alerts for declining usage 60 days before renewal",
      "Schedule a re-engagement call if the champion changes",
      "Offer a discounted renewal with a commitment to address pain points",
    ],
  },
  {
    name: "Advocacy moment",
    type: "delight",
    stage: "Renewal & Advocacy",
    description:
      "The customer is so happy they're willing to advocate for you. Don't let this moment pass.",
    severity: "medium",
    triggers: [
      "NPS score 9-10",
      "Unprompted positive feedback",
      "Referral to another company",
    ],
    defaultRecommendations: [
      "Ask for a referral within 48 hours of positive feedback",
      "Invite them to your customer advisory board",
      "Feature them in a case study with their permission",
    ],
  },
];

// ============================================
// Get moments by journey type
// ============================================
export function getDefaultMoments(
  journeyType: "sales" | "customer" | "full_lifecycle"
): MomentTemplate[] {
  switch (journeyType) {
    case "sales":
      return SALES_MOMENTS;
    case "customer":
      return CUSTOMER_MOMENTS;
    case "full_lifecycle":
      return [...SALES_MOMENTS, ...CUSTOMER_MOMENTS];
  }
}
