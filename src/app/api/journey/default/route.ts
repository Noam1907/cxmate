import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { loadJourney } from "@/lib/services/journey-persistence";

/**
 * GET /api/journey/default
 * Returns the authenticated user's default journey.
 * Looks up the org's default journey_template (is_default=true),
 * falls back to most recently created.
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const orgId = user.app_metadata?.org_id as string | undefined;
    if (!orgId) {
      return NextResponse.json(
        { error: "No organization found" },
        { status: 404 }
      );
    }

    // Find the default journey template for this org
    const { data: template, error } = await supabase
      .from("journey_templates")
      .select("id")
      .eq("org_id", orgId)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !template) {
      return NextResponse.json(
        { error: "No journey found" },
        { status: 404 }
      );
    }

    // Load the full journey
    const result = await loadJourney(supabase, template.id);

    if (!result) {
      return NextResponse.json(
        { error: "Failed to load journey data" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      templateId: template.id,
      journey: result.journey,
      vertical: result.vertical,
    });
  } catch (error) {
    console.error("Default journey load error:", error);
    return NextResponse.json(
      { error: "Failed to load journey" },
      { status: 500 }
    );
  }
}
