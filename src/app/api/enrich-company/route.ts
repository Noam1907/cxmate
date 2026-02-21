/**
 * AI Engineer: Company Enrichment API
 *
 * Fetches a company's website, sends cleaned content + company name to Claude,
 * and returns structured enrichment data (vertical, size, competitors, etc.)
 * for pre-filling onboarding steps.
 *
 * Uses the same direct-fetch Claude API pattern as generate-journey.ts.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import type { EnrichedCompanyData } from "@/types/enrichment";

// ============================================
// Input Validation
// ============================================

const enrichSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyWebsite: z.string().default(""),
});

// ============================================
// Website Fetching & Cleaning
// ============================================

/**
 * Fetch a website and extract core text content.
 * Strips scripts, styles, nav, footer, and HTML tags.
 * Returns cleaned text capped at ~3000 chars.
 */
async function fetchWebsiteContent(url: string): Promise<string | null> {
  try {
    // Normalize URL
    let fullUrl = url.trim();
    if (!fullUrl.startsWith("http://") && !fullUrl.startsWith("https://")) {
      fullUrl = `https://${fullUrl}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout for fetch

    const response = await fetch(fullUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "CXMate/1.0 (company-analysis)",
        Accept: "text/html",
      },
    });
    clearTimeout(timeout);

    if (!response.ok) return null;

    const html = await response.text();

    // Strip everything we don't need
    const cleaned = html
      // Remove scripts and styles
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      // Remove nav, footer, header elements
      .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
      .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
      // Remove SVGs and images
      .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
      .replace(/<img[^>]*>/gi, " ")
      // Remove all remaining HTML tags
      .replace(/<[^>]+>/g, " ")
      // Decode common HTML entities
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")
      // Collapse whitespace
      .replace(/\s+/g, " ")
      .trim();

    // Cap at ~3000 chars to keep prompt small
    return cleaned.slice(0, 3000);
  } catch {
    return null;
  }
}

// ============================================
// Claude Enrichment Prompt
// ============================================

function buildEnrichmentPrompt(
  companyName: string,
  websiteContent: string | null
): string {
  const verticalOptions = [
    "b2b_saas",
    "professional_services",
    "marketplace",
    "fintech",
    "ecommerce_b2b",
    "healthtech",
    "other",
  ];

  const companySizeOptions = ["1-10", "11-50", "51-150", "151-300", "300+"];
  const customerSizeOptions = ["smb", "mid_market", "enterprise", "mixed"];
  const channelOptions = ["self_serve", "sales_led", "partner", "mixed"];

  return `You are a business research assistant for CX Mate, an AI-powered CX platform. Your job is to analyze a company and return structured data about them.

## Company to Analyze
Name: ${companyName}
${websiteContent ? `\n## Website Content (extracted from their site)\n${websiteContent}` : "\nNo website content available — use your training knowledge only."}

## Task
Analyze this company and return a JSON object with these fields. Use the website content AND your training knowledge. If you recognize the company, use what you know. If you don't recognize them, make reasonable inferences from the website content and company name.

## Required Output Fields

- **suggestedVertical**: One of: ${JSON.stringify(verticalOptions)}
  Choose the BEST match. "b2b_saas" = software subscription for businesses. "other" only as last resort.

- **suggestedCompanySize**: One of: ${JSON.stringify(companySizeOptions)}
  Estimate based on any signals: team page, job listings, LinkedIn mentions, about page.

- **description**: One sentence describing what the company does and who they serve. Be specific.

- **suggestedCompetitors**: Array of 3-5 competitor company names. These should be real companies that compete in the same space. If you know the market well, name specific competitors. If not, name the type of competition (e.g., "spreadsheets and manual processes").

- **suggestedCustomerSize**: One of: ${JSON.stringify(customerSizeOptions)}
  What size companies does this company typically sell to?

- **suggestedMainChannel**: One of: ${JSON.stringify(channelOptions)}
  How do their customers typically find and buy from them?

- **confidence**: "high" if you recognize the company or the website is very clear, "medium" if you're inferring from good signals, "low" if you're mostly guessing.

- **reasoning**: 1-2 sentences explaining how you determined the key fields. Mention if you recognized the company.

## Rules
- Return ONLY the JSON object, no markdown fences, no explanation outside the JSON
- Be specific and opinionated — vague answers are worse than slightly wrong ones
- If the company is well-known, use your knowledge confidently
- If the company name suggests an industry (e.g., "ShipTech"), use that signal
- All field values must match the exact options listed above`;
}

// ============================================
// Route Handler
// ============================================

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = enrichSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, enrichedData: null, error: "Invalid input" },
        { status: 400 }
      );
    }

    const { companyName, companyWebsite } = parsed.data;

    const apiKey = process.env.CX_MATE_ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          enrichedData: null,
          error: "API key not configured",
        },
        { status: 500 }
      );
    }

    // Fetch website content (non-blocking failure)
    const websiteContent = companyWebsite
      ? await fetchWebsiteContent(companyWebsite)
      : null;

    // Build prompt and call Claude
    const prompt = buildEnrichmentPrompt(companyName, websiteContent);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000); // 12s for Claude call

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Enrichment Claude API error ${response.status}:`, errorBody);
      return NextResponse.json(
        { success: false, enrichedData: null, error: "AI analysis failed" },
        { status: 500 }
      );
    }

    const message = await response.json();
    const textBlock = message.content?.find(
      (block: { type: string }) => block.type === "text"
    );

    if (!textBlock) {
      return NextResponse.json(
        { success: false, enrichedData: null, error: "No response from AI" },
        { status: 500 }
      );
    }

    // Parse JSON — same repair pattern as generate-journey.ts
    const raw = textBlock.text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    let enrichedData: EnrichedCompanyData;
    try {
      enrichedData = JSON.parse(raw);
    } catch {
      const repaired = raw
        .replace(/,\s*([}\]])/g, "$1")
        .replace(/[\x00-\x1f]/g, (ch: string) =>
          ch === "\n" ? "\\n" : ch === "\t" ? "\\t" : ""
        );
      enrichedData = JSON.parse(repaired);
    }

    return NextResponse.json({
      success: true,
      enrichedData,
    });
  } catch (error) {
    console.error("Enrichment error:", error);
    const isTimeout =
      error instanceof DOMException && error.name === "AbortError";
    return NextResponse.json(
      {
        success: false,
        enrichedData: null,
        error: isTimeout ? "Analysis timed out" : "Enrichment failed",
      },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
