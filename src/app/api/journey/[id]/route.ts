import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { loadJourney } from "@/lib/services/journey-persistence";

/**
 * GET /api/journey/[id]
 * Loads a persisted journey by template ID.
 * RLS ensures users can only access their own journeys.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || id === "preview") {
      return NextResponse.json(
        { error: "Preview journeys are stored locally" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Load journey — RLS will enforce ownership
    const result = await loadJourney(supabase, id);

    if (!result) {
      return NextResponse.json(
        { error: "Journey not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      templateId: id,
      journey: result.journey,
    });
  } catch (error) {
    console.error("Journey load error:", error);
    return NextResponse.json(
      { error: "Failed to load journey" },
      { status: 500 }
    );
  }
}
