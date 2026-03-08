"use client";

/**
 * PrintCover — PDF document cover page
 *
 * Invisible on screen. Renders as the first page of the PDF when printing.
 * Each exported document gets a personalised "Dear [Name], here is your..."
 * opening so the output reads like a professional deliverable, not a screen dump.
 */

export type PrintDocumentType =
  | "CX Intelligence Report"
  | "Journey Map"
  | "CX Playbook"
  | "CX Review";

const DOCUMENT_DESCRIPTIONS: Record<PrintDocumentType, string> = {
  "CX Intelligence Report":
    "A complete analysis of your customer experience — including revenue impact projections, risk assessment, maturity benchmarks, and evidence-backed insights grounded in real CX methodology.",
  "Journey Map":
    "Your complete customer journey from first touch to advocacy, with meaningful moments mapped by severity, stage risk overview, and evidence annotations tied to your specific pain points.",
  "CX Playbook":
    "Your prioritised action plan — specific recommendations with ready-to-use templates, effort estimates, measurement guidance, and AI tool suggestions for every stage of your journey.",
  "CX Review":
    "Your AI-generated CX Review — CX health score, key findings, top risks, priorities, measurement framework, and action plan, built from your journey map and playbook data.",
};

interface PrintCoverProps {
  firstName?: string;
  companyName?: string;
  documentType: PrintDocumentType;
}

export function PrintCover({ firstName, companyName, documentType }: PrintCoverProps) {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const description = DOCUMENT_DESCRIPTIONS[documentType];

  return (
    <div className="print-cover" aria-hidden="true">
      {/* CX Mate brand mark */}
      <div className="print-cover-logo">
        <div className="print-cover-badge">CX</div>
        <span className="print-cover-brand">CX Mate</span>
      </div>

      {/* Teal rule */}
      <div className="print-cover-rule" />

      {/* Greeting */}
      <p className="print-cover-greeting">
        {firstName ? `Dear ${firstName},` : "Hello,"}
      </p>

      {/* Title */}
      <h1 className="print-cover-title">
        Here is your{" "}
        <span className="print-cover-title-accent">{documentType}</span>
        {companyName ? ` for ${companyName}.` : "."}
      </h1>

      {/* Description */}
      <p className="print-cover-description">{description}</p>

      {/* Meta */}
      <div className="print-cover-meta">
        {companyName && (
          <div className="print-cover-meta-row">
            <span className="print-cover-meta-label">Company</span>
            <span className="print-cover-meta-value">{companyName}</span>
          </div>
        )}
        <div className="print-cover-meta-row">
          <span className="print-cover-meta-label">Generated</span>
          <span className="print-cover-meta-value">{date}</span>
        </div>
        <div className="print-cover-meta-row">
          <span className="print-cover-meta-label">Powered by</span>
          <span className="print-cover-meta-value">CX Mate — AI-Powered CX Orchestration</span>
        </div>
      </div>
    </div>
  );
}
