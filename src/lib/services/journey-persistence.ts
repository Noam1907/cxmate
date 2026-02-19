import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { GeneratedJourney } from "@/lib/ai/journey-prompt";

/**
 * Persists a generated journey to Supabase.
 * Inserts: journey_template → journey_stages → meaningful_moments
 *
 * The full journey JSON is also stored in journey_templates.stages
 * as a JSONB backup for easy reconstruction.
 *
 * Returns the journey template UUID.
 */
export async function persistJourney(
  supabase: SupabaseClient<Database>,
  orgId: string,
  input: {
    companyName: string;
    vertical: string;
    journeyType: "sales" | "customer" | "full_lifecycle";
  },
  journey: GeneratedJourney
): Promise<string> {
  // 1. Create journey template
  const { data: template, error: templateError } = await supabase
    .from("journey_templates")
    .insert({
      org_id: orgId,
      name: journey.name || `${input.companyName} CX Journey`,
      vertical: input.vertical,
      journey_type: input.journeyType,
      is_default: true,
      stages: journey as unknown as Database["public"]["Tables"]["journey_templates"]["Insert"]["stages"],
      source: "ai_generated",
    })
    .select("id")
    .single();

  if (templateError) {
    console.error("Failed to create journey template:", templateError);
    throw new Error(`Failed to create journey template: ${templateError.message}`);
  }

  const templateId = template.id;

  // 2. Create journey stages + moments
  for (let i = 0; i < journey.stages.length; i++) {
    const stage = journey.stages[i];

    const { data: stageRow, error: stageError } = await supabase
      .from("journey_stages")
      .insert({
        template_id: templateId,
        name: stage.name,
        stage_type: stage.stageType as "sales" | "customer",
        order_index: i,
        description: stage.description || "",
        emotional_state: stage.emotionalState || "",
        meaningful_moments: stage.meaningfulMoments as unknown as Database["public"]["Tables"]["journey_stages"]["Insert"]["meaningful_moments"],
      })
      .select("id")
      .single();

    if (stageError) {
      console.error(`Failed to create stage ${stage.name}:`, stageError);
      // Continue with other stages — partial persistence is better than none
      continue;
    }

    // 3. Create meaningful moments for this stage
    for (const moment of stage.meaningfulMoments) {
      const { error: momentError } = await supabase
        .from("meaningful_moments")
        .insert({
          stage_id: stageRow.id,
          type: moment.type,
          name: moment.name,
          description: moment.description || "",
          severity: moment.severity || "medium",
          triggers: moment.triggers as unknown as Database["public"]["Tables"]["meaningful_moments"]["Insert"]["triggers"],
          recommendations: moment.recommendations as unknown as Database["public"]["Tables"]["meaningful_moments"]["Insert"]["recommendations"],
        });

      if (momentError) {
        console.error(`Failed to create moment ${moment.name}:`, momentError);
        // Continue — partial is better than none
      }
    }
  }

  return templateId;
}

/**
 * Loads a journey from the database by template ID.
 * Reconstructs the GeneratedJourney shape from the JSONB backup.
 *
 * Falls back to reconstructing from normalized tables if JSONB is missing.
 */
export async function loadJourney(
  supabase: SupabaseClient<Database>,
  templateId: string
): Promise<{
  journey: GeneratedJourney;
  orgId: string;
  vertical: string;
} | null> {
  // Load template
  const { data: template, error } = await supabase
    .from("journey_templates")
    .select("*")
    .eq("id", templateId)
    .single();

  if (error || !template) {
    console.error("Failed to load journey template:", error);
    return null;
  }

  // The stages column contains the full GeneratedJourney as JSONB backup
  const journey = template.stages as unknown as GeneratedJourney;

  if (!journey || !journey.stages) {
    // Fallback: reconstruct from normalized tables
    return await reconstructJourneyFromTables(supabase, templateId, template);
  }

  return {
    journey,
    orgId: template.org_id,
    vertical: template.vertical,
  };
}

/**
 * Fallback reconstruction from normalized tables.
 */
async function reconstructJourneyFromTables(
  supabase: SupabaseClient<Database>,
  templateId: string,
  template: Database["public"]["Tables"]["journey_templates"]["Row"]
): Promise<{
  journey: GeneratedJourney;
  orgId: string;
  vertical: string;
} | null> {
  // Load stages ordered by index
  const { data: stages, error: stagesError } = await supabase
    .from("journey_stages")
    .select("*")
    .eq("template_id", templateId)
    .order("order_index");

  if (stagesError || !stages) {
    console.error("Failed to load journey stages:", stagesError);
    return null;
  }

  // Load moments for each stage
  const stageIds = stages.map((s) => s.id);
  const { data: moments } = await supabase
    .from("meaningful_moments")
    .select("*")
    .in("stage_id", stageIds);

  const momentsByStage = new Map<string, typeof moments>();
  for (const m of moments || []) {
    const existing = momentsByStage.get(m.stage_id) || [];
    existing.push(m);
    momentsByStage.set(m.stage_id, existing);
  }

  // Reconstruct GeneratedJourney shape
  const journey: GeneratedJourney = {
    name: template.name,
    stages: stages.map((stage) => ({
      name: stage.name,
      stageType: stage.stage_type,
      description: stage.description,
      emotionalState: stage.emotional_state,
      meaningfulMoments: (momentsByStage.get(stage.id) || []).map((m) => ({
        name: m.name,
        type: m.type as "risk" | "delight" | "decision" | "handoff",
        description: m.description,
        severity: m.severity as "low" | "medium" | "high" | "critical",
        triggers: (m.triggers || []) as string[],
        recommendations: (m.recommendations || []) as string[],
      })),
    })),
  };

  return {
    journey,
    orgId: template.org_id,
    vertical: template.vertical,
  };
}
