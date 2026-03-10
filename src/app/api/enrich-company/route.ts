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
/** Block SSRF: reject private/internal IPs and localhost */
function isBlockedHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (["localhost", "127.0.0.1", "0.0.0.0", "[::1]"].includes(lower)) return true;
  // Block private IP ranges: 10.x, 172.16-31.x, 192.168.x, 169.254.x (link-local/metadata)
  if (/^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|169\.254\.)/.test(lower)) return true;
  // Block cloud metadata endpoints
  if (lower === "metadata.google.internal") return true;
  return false;
}

async function fetchWebsiteContent(url: string): Promise<string | null> {
  try {
    // Normalize URL
    let fullUrl = url.trim();
    if (!fullUrl.startsWith("http://") && !fullUrl.startsWith("https://")) {
      fullUrl = `https://${fullUrl}`;
    }

    // SSRF protection: reject internal/private hosts
    const parsed = new URL(fullUrl);
    if (isBlockedHost(parsed.hostname)) {
      console.warn(`[enrich-company] Blocked SSRF attempt: ${parsed.hostname}`);
      return null;
    }
    // Only allow http/https
    if (!["http:", "https:"].includes(parsed.protocol)) return null;

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
// Website Auto-Discovery
// ============================================

/**
 * When no website is explicitly provided, try common domain patterns
 * derived from the company name. Returns the first one that yields content.
 * This prevents Claude from hallucinating from training knowledge alone.
 */
async function tryDiscoverWebsite(companyName: string): Promise<{ url: string; content: string } | null> {
  // Build a slug: lowercase, strip punctuation, spaces → hyphens
  const slug = companyName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")   // strip punctuation
    .trim()
    .replace(/\s+/g, "-");          // spaces → hyphens

  // Also try a no-hyphen version (e.g. "meshpayments")
  const slugNoHyphen = slug.replace(/-/g, "");

  const candidates = [
    `${slug}.com`,
    `${slug}.io`,
    `${slug}.ai`,
    `${slug}.co`,
    `${slugNoHyphen}.com`,
    `${slugNoHyphen}.io`,
  ];

  for (const domain of candidates) {
    const content = await fetchWebsiteContent(`https://${domain}`);
    // Require at least 200 chars — avoids domain-squatter pages
    if (content && content.length > 200) {
      return { url: domain, content };
    }
  }
  return null;
}

// ============================================
// Claude Enrichment Prompt
// ============================================

function buildEnrichmentPrompt(
  companyName: string,
  websiteContent: string | null,
  discoveredUrl?: string | null
): string {
  // Business model — HOW the company sells (must match BUSINESS_MODELS in the UI)
  const verticalOptions = [
    "b2b_saas",
    "professional_services",
    "marketplace",
    "ecommerce_b2b",
    "other",
  ];

  // Industry — WHAT space they operate in (optional, null if none apply well)
  const industryOptions = [
    "fintech",
    "healthtech",
    "hrtech",
    "legaltech",
    "proptech",
    "edtech",
    "securitytech",
    "logisticstech",
    "martech",
    "devtools",
    "foodtech",
    "other_vertical",
  ];

  const companySizeOptions = ["1-10", "11-50", "51-150", "151-300", "300+"];
  const customerSizeOptions = ["smb", "mid_market", "enterprise", "mixed"];
  const channelOptions = ["self_serve", "sales_led", "partner", "mixed"];

  const websiteContext = websiteContent
    ? discoveredUrl
      ? `\n## Website Content (auto-discovered from ${discoveredUrl})\nNote: This URL was inferred from the company name, not provided by the user. Use it as a strong signal but set confidence to "medium" unless other signals confirm it.\n\n${websiteContent}`
      : `\n## Website Content (from their official site)\n${websiteContent}`
    : "\nNo website content available. Do NOT guess or hallucinate facts. Set confidence to \"low\" and only extract what is clearly observable from the company name itself.";

  return `You are a business research assistant for CX Mate, an AI-powered CX platform. Your job is to analyze a company and return structured data about them.

## Company to Analyze
Name: ${companyName}
${websiteContext}

## Task
Analyze this company and return a JSON object with these fields. Use the website content AND your training knowledge. If you recognize the company, use what you know. If you don't recognize them, make reasonable inferences from the website content and company name.

## Required Output Fields

- **officialCompanyName**: The official, properly-capitalized company name as used on their website (e.g. "Orca Security", not "orca" or "orca ai"). This is the ground truth that corrects what the user may have typed. Include this whenever website content is available. If you're not confident, use the name as provided.

- **suggestedVertical**: One of: ${JSON.stringify(verticalOptions)}
  This is the BUSINESS MODEL — HOW they sell, not what industry they're in.
  "b2b_saas" = software subscription for businesses (most common for tech companies).
  "professional_services" = consulting, agencies, implementation, managed services.
  "marketplace" = two-sided platform connecting buyers and sellers.
  "ecommerce_b2b" = B2B wholesale, distribution, or online retail.
  "other" = only if none of the above fit.
  IMPORTANT: Do NOT put fintech, healthtech, etc. here — those are industries, not business models.

- **suggestedIndustry**: One of: ${JSON.stringify(industryOptions)}, or null if none apply clearly.
  This is the INDUSTRY VERTICAL — WHAT space they're in (e.g., "healthtech" for medical devices).
  Set to null if the company is a generic B2B SaaS or services company without a specific industry focus.

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
- suggestedVertical and suggestedIndustry must match the exact options listed above (or null for suggestedIndustry)`;
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

    // 1. Try the explicitly provided website first
    // 2. If none given, auto-discover from company name (prevents hallucination)
    // 3. Only fall back to training knowledge as last resort (confidence = "low")
    let websiteContent: string | null = null;
    let discoveredUrl: string | null = null;

    if (companyWebsite) {
      websiteContent = await fetchWebsiteContent(companyWebsite);
    } else {
      const discovered = await tryDiscoverWebsite(companyName);
      if (discovered) {
        websiteContent = discovered.content;
        discoveredUrl = discovered.url;
      }
    }

    // Build prompt and call Claude
    const prompt = buildEnrichmentPrompt(companyName, websiteContent, discoveredUrl);

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

    // Attach the discovered URL so the client can use it for logos / display
    if (discoveredUrl) {
      enrichedData.discoveredWebsite = discoveredUrl;
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
