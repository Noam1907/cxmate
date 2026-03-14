import { NextResponse } from "next/server";
import { z } from "zod";
import { generateRecommendations } from "@/lib/ai/generate-recommendations";
import { onboardingSchema } from "@/lib/validations/onboarding";
import type { GeneratedJourney } from "@/lib/ai/journey-prompt";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// Extend Vercel function timeout to 5 minutes — playbook generation takes 2-3 min
export const maxDuration = 300;

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
  templateId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    // Rate limit: 5 playbook generations per IP per day
    const ip = getClientIp(request);
    const { limited } = checkRateLimit(ip, "recommendations", 5);
    if (limited) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again tomorrow." },
        { status: 429 }
      );
    }

    const body = await request.json();

    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { journey, onboardingData, templateId: passedTemplateId } = parsed.data;

    const playbook = await generateRecommendations(
      journey as GeneratedJourney,
      onboardingData
    );

    // Persist playbook to Supabase if user is authenticated
    let persistedTemplateId: string | null = null;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user?.app_metadata?.org_id) {
        const orgId = user.app_metadata.org_id as string;

        let templateId = passedTemplateId;
        if (!templateId) {
          const { data: template } = await supabase
            .from("journey_templates")
            .select("id")
            .eq("org_id", orgId)
            .order("is_default", { ascending: false })
            .order("created_at", { ascending: false })
            .limit(1)
            .single();
          templateId = template?.id;
        }

        if (templateId) {
          const { error: updateError } = await supabase
            .from("journey_templates")
            .update({ playbook: playbook as unknown as Record<string, unknown> })
            .eq("id", templateId)
            .eq("org_id", orgId);

          if (updateError) {
            console.error("[recommendations/generate] Failed to persist playbook:", updateError.message);
          } else {
            persistedTemplateId = templateId;
          }
        }
      }
    } catch (persistErr) {
      console.error("[recommendations/generate] Persist error (non-fatal):", persistErr);
    }

    return NextResponse.json({
      success: true,
      playbook,
      persistedTemplateId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Recommendation generation error:", message, error);
    return NextResponse.json(
      { error: "Failed to generate recommendations", detail: message },
      { status: 500 }
    );
  }
}
