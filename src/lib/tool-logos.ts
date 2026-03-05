/**
 * Tool logo utilities using Google Favicon API.
 * Pattern from sidebar-building-view.tsx getLogoUrl().
 */

// Fallback domain map for common B2B tools (used when Claude omits domain)
const TOOL_DOMAIN_FALLBACK: Record<string, string> = {
  salesforce: "salesforce.com",
  hubspot: "hubspot.com",
  zendesk: "zendesk.com",
  intercom: "intercom.com",
  jira: "atlassian.com",
  slack: "slack.com",
  gainsight: "gainsight.com",
  churnzero: "churnzero.com",
  mixpanel: "mixpanel.com",
  amplitude: "amplitude.com",
  segment: "segment.com",
  freshdesk: "freshdesk.com",
  monday: "monday.com",
  notion: "notion.so",
  asana: "asana.com",
  pipedrive: "pipedrive.com",
  zoho: "zoho.com",
  drift: "drift.com",
  gong: "gong.io",
  outreach: "outreach.io",
  stripe: "stripe.com",
  typeform: "typeform.com",
  surveymonkey: "surveymonkey.com",
  pendo: "pendo.io",
  fullstory: "fullstory.com",
  hotjar: "hotjar.com",
  chargebee: "chargebee.com",
  braze: "braze.com",
  customerio: "customer.io",
  "customer.io": "customer.io",
  mailchimp: "mailchimp.com",
  sendgrid: "sendgrid.com",
  twilio: "twilio.com",
  delighted: "delighted.com",
  qualtrics: "qualtrics.com",
};

export function getToolLogoUrl(toolName: string, domain?: string): string {
  const effectiveDomain =
    domain ||
    TOOL_DOMAIN_FALLBACK[toolName.toLowerCase().trim()] ||
    `${toolName.toLowerCase().replace(/\s+/g, "")}.com`;

  return `https://www.google.com/s2/favicons?domain=${effectiveDomain}&sz=32`;
}

export function getToolInitial(toolName: string): string {
  return toolName.charAt(0).toUpperCase();
}
