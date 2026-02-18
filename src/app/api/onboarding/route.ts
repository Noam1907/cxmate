import { NextResponse } from "next/server";
import { onboardingSchema } from "@/lib/validations/onboarding";
import { generateJourney } from "@/lib/ai/generate-journey";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = onboardingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const input = parsed.data;

    // Generate journey using Claude
    const journey = await generateJourney(input);

    // TODO: Once Supabase is connected, persist to database:
    // 1. Create or update organization
    // 2. Create journey template
    // 3. Create journey stages
    // 4. Create meaningful moments
    // 5. Create recommendations

    // For now, return the generated journey directly
    return NextResponse.json({
      success: true,
      templateId: "preview", // Will be a real UUID once DB is connected
      journey,
      onboardingData: input,
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to process onboarding" },
      { status: 500 }
    );
  }
}
