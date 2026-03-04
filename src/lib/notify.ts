/**
 * Fire-and-forget notification to /api/notify.
 * Never throws, never blocks — the user flow is sacred.
 */
export function notifyOwner(
  event: string,
  data?: { email?: string; companyName?: string; details?: string }
): void {
  fetch("/api/notify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, ...data }),
  }).catch(() => {
    // Silently swallow — never break the user experience
  });
}
