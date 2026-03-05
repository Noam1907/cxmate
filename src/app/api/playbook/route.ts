import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { GeneratedPlaybook } from "@/lib/ai/recommendation-prompt";

/**
 * GET /api/playbook?templateId=[id]
 * Returns the persisted playbook for the given template.
 * Falls back to the org's default template if no templateId provided.
 * RLS enforces ownership.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get("templateId");

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.app_metadata?.org_id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const orgId = user.app_metadata.org_id as string;

    let query = supabase
      .from("journey_templates")
      .select("id, playbook")
      .eq("org_id", orgId);

    if (templateId) {
      query = query.eq("id", templateId);
    } else {
      query = query
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });
    }

    const { data: template, error } = await query.limit(1).single();

    if (error || !template?.playbook) {
      return NextResponse.json({ error: "No playbook found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      templateId: template.id,
      playbook: template.playbook as unknown as GeneratedPlaybook,
    });
  } catch (error) {
    console.error("Playbook load error:", error);
    return NextResponse.json({ error: "Failed to load playbook" }, { status: 500 });
  }
}
