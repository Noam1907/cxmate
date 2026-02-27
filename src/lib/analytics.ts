/**
 * CX Mate Analytics
 * Typed event tracking via PostHog.
 * All events are no-ops on the server — safe to import anywhere.
 */

// ─── Event Definitions ────────────────────────────────────────────────────────

export type AnalyticsEvent =
  // Onboarding funnel
  | { name: "onboarding_started" }
  | { name: "onboarding_step_completed"; step_key: string; step_number: number; company_name?: string }
  | { name: "onboarding_draft_restored"; step_number: number }
  // Journey generation
  | { name: "journey_generation_started"; maturity?: string; journey_type?: string; has_existing_customers?: boolean }
  | { name: "journey_generation_succeeded"; duration_seconds: number; template_id: string }
  | { name: "journey_generation_failed"; error_type: "timeout" | "api_error" | "parse_error" | "unknown"; retry_count: number }
  | { name: "journey_generation_retried" }
  // Output pages
  | { name: "cx_report_viewed"; template_id?: string; company_name?: string; mode?: string }
  | { name: "journey_map_viewed"; template_id?: string; stage_count?: number }
  | { name: "dashboard_viewed"; template_id?: string }
  // Playbook
  | { name: "playbook_generation_started"; template_id?: string }
  | { name: "playbook_generation_succeeded"; recommendation_count?: number }
  | { name: "playbook_generation_failed"; error?: string }
  | { name: "recommendation_status_changed"; status: "in_progress" | "done" | "not_started"; recommendation_key: string; priority?: string }
  // Company enrichment
  | { name: "company_enrichment_succeeded"; confidence?: string; company_name?: string }
  | { name: "company_enrichment_failed"; company_name?: string }
  // Auth
  | { name: "user_signed_up" }
  | { name: "user_logged_in" };

// ─── Track Function ───────────────────────────────────────────────────────────

type EventName = AnalyticsEvent["name"];
type EventProps<T extends EventName> = Omit<Extract<AnalyticsEvent, { name: T }>, "name">;

/**
 * Track a typed analytics event.
 * Safe to call on server — returns silently if PostHog is unavailable.
 */
export function track<T extends EventName>(
  name: T,
  ...args: EventProps<T> extends Record<string, never> ? [] : [EventProps<T>]
): void {
  if (typeof window === "undefined") return;

  try {
    // Dynamic import to avoid SSR issues
    import("posthog-js").then(({ default: posthog }) => {
      posthog.capture(name, args[0] ?? {});
    });
  } catch {
    // Silently fail — analytics should never break the app
  }
}

/**
 * Identify an authenticated user.
 * Call after successful login/signup.
 */
export function identify(userId: string, traits?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    import("posthog-js").then(({ default: posthog }) => {
      posthog.identify(userId, traits);
    });
  } catch { /* silent */ }
}

/**
 * Reset identity on logout.
 */
export function resetIdentity(): void {
  if (typeof window === "undefined") return;
  try {
    import("posthog-js").then(({ default: posthog }) => {
      posthog.reset();
    });
  } catch { /* silent */ }
}
