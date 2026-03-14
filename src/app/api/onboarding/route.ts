import { NextResponse } from "next/server";
import { onboardingSchema } from "@/lib/validations/onboarding";
import { generateJourney } from "@/lib/ai/generate-journey";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { persistJourney } from "@/lib/services/journey-persistence";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// Extend Vercel function timeout to 5 minutes — journey generation takes ~2.8 min
export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    // Rate limit: 3 journey generations per IP per day
    const ip = getClientIp(request);
    const { limited } = checkRateLimit(ip, "onboarding", 3);
    if (limited) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again tomorrow." },
        { status: 429 }
      );
    }

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
          }, journey, input as unknown as Record<string, unknown>);

          // Sync org record with onboarding data (vertical, size, name)
          const admin = createAdminClient();
          await admin
            .from("organizations")
            .update({
              vertical: input.vertical,
              size: input.companySize,
              name: input.companyName,
            })
            .eq("id", orgId);
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
