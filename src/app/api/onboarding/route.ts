import { NextResponse } from "next/server";
import { onboardingSchema } from "@/lib/validations/onboarding";
import { generateJourney } from "@/lib/ai/generate-journey";
import { createClient } from "@/lib/supabase/server";
import { persistJourney } from "@/lib/services/journey-persistence";

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

    // Check if user is authenticated
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let templateId = "preview";

    if (user) {
      const orgId = user.app_metadata?.org_id as string | undefined;

      if (orgId) {
        try {
          templateId = await persistJourney(supabase, orgId, {
            companyName: input.companyName,
            vertical: input.vertical,
            journeyType: input.journeyType,
          }, journey);
        } catch (err) {
          console.error("Failed to persist journey:", err);
          // Fall back to preview mode — don't block the user
          templateId = "preview";
        }
      }
    }

    return NextResponse.json({
      success: true,
      templateId,
      journey,
      onboardingData: input,
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to process onboarding", details: message },
      { status: 500 }
    );
  }
}
