/**
 * Company Enrichment Types
 *
 * Used by the auto-enrichment feature that analyzes a company's website
 * and Claude's training knowledge to pre-fill onboarding data.
 */

export interface EnrichedCompanyData {
  /** Mapped to BUSINESS_MODELS ids: b2b_saas, professional_services, marketplace, ecommerce_b2b, other */
  suggestedVertical: string;
  /** Optional industry tag: fintech, healthtech, hrtech, etc. Maps to INDUSTRY_VERTICALS */
  suggestedIndustry?: string | null;
  /** Mapped to COMPANY_SIZES values: 1-10, 11-50, etc. */
  suggestedCompanySize: string;
  /** One-line description of what the company does */
  description: string;
  /** 2-5 competitor company names */
  suggestedCompetitors: string[];
  /** Mapped to CUSTOMER_SIZES: smb, mid_market, enterprise, mixed */
  suggestedCustomerSize: string;
  /** Mapped to MAIN_CHANNELS: self_serve, sales_led, partner, mixed */
  suggestedMainChannel: string;
  /** How confident Claude is about the data */
  confidence: "high" | "medium" | "low";
  /** Brief explanation of how Claude determined this */
  reasoning: string;
}

export interface EnrichmentResponse {
  success: boolean;
  enrichedData: EnrichedCompanyData | null;
  error?: string;
}
