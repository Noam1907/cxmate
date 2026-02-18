import { NextResponse } from "next/server";
import { z } from "zod";
import { generateRecommendations } from "@/lib/ai/generate-recommendations";
import { onboardingSchema } from "@/lib/validations/onboarding";
import type { GeneratedJourney } from "@/lib/ai/journey-prompt";

const requestSchema = z.object({
  journey: z.custom<GeneratedJourney>((val) => {
    return (
      val &&
      typeof val === "object" &&
      "name" in val &&
      "stages" in val &&
      Array.isArray(val.stages)
    );
  }, "Invalid journey data"),
  onboardingData: onboardingSchema,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { journey, onboardingData } = parsed.data;

    const playbook = await generateRecommendations(
      journey as GeneratedJourney,
      onboardingData
    );

    return NextResponse.json({
      success: true,
      playbook,
    });
  } catch (error) {
    console.error("Recommendation generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
