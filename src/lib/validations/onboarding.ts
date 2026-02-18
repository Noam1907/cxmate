import { z } from "zod";

export const onboardingSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  vertical: z.string().min(1, "Vertical is required"),
  companySize: z.string().min(1, "Company size is required"),
  customVertical: z.string().optional(),

  journeyType: z.enum(["sales", "customer", "full_lifecycle"]),

  customerDescription: z.string().min(1, "Customer description is required"),
  customerSize: z.string().min(1, "Customer size is required"),
  mainChannel: z.string().min(1, "Main channel is required"),

  biggestChallenge: z.string().min(1, "Biggest challenge is required"),
  painPoints: z.array(z.string()).min(1, "At least one pain point is required"),
  customPainPoint: z.string().optional(),

  primaryGoal: z.string().min(1, "Primary goal is required"),
  timeframe: z.string().min(1, "Timeframe is required"),
  additionalContext: z.string().optional(),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
