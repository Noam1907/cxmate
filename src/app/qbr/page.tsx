"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Copy, Check, ArrowSquareOut, DownloadSimple, Sparkle } from "@phosphor-icons/react";
import type { GeneratedPlaybook } from "@/lib/ai/recommendation-prompt";
import type { GeneratedJourney } from "@/lib/ai/journey-prompt";
import type { GeneratedQBR } from "@/lib/ai/qbr-prompt";
import { generateQBRText } from "@/lib/ai/qbr-prompt";
import { track } from "@/lib/analytics";
import { ExportPdfButton } from "@/components/ui/export-pdf-button";
import { PrintCover } from "@/components/pdf/print-cover";

// ─── Health Score styling ─────────────────────────────────────────────────────

function getHealthStyle(label: string) {
  switch (label) {
    case "Leading":  return { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", score: "text-emerald-600" };
    case "Healthy":  return { bg: "bg-teal-50",    border: "border-teal-200",    text: "text-teal-700",    score: "text-teal-600" };
    case "Developing": return { bg: "bg-amber-50", border: "border-amber-200",   text: "text-amber-700",   score: "text-amber-600" };
    case "At Risk":  return { bg: "bg-red-50",     border: "border-red-200",     text: "text-red-700",     score: "text-red-600" };
    default:         return { bg: "bg-slate-50",   border: "border-slate-200",   text: "text-slate-700",   score: "text-slate-600" };
  }
}

function getRiskStyle(impact: string) {
  switch (impact) {
    case "high":   return "bg-red-50 border-red-200 text-red-700";
    case "medium": return "bg-amber-50 border-amber-200 text-amber-700";
    case "low":    return "bg-slate-50 border-slate-200 text-slate-600";
    default:       return "bg-slate-50 border-slate-200 text-slate-600";
  }
}

// ─── Copy button with confirmation ───────────────────────────────────────────

function CopyConfirmButton({ getText, label }: { getText: () => string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* ignore */ }
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
    >
      {copied ? <Check size={13} className="text-emerald-500" weight="bold" /> : <Copy size={13} />}
      {copied ? "Copied!" : label}
    </button>
  );
}

// ─── Export row ───────────────────────────────────────────────────────────────

function ExportRow({ qbr }: { qbr: GeneratedQBR }) {
  const qbrText = generateQBRText(qbr);
  const claudePrompt = `Here is my ${qbr.quarter} CX QBR for ${qbr.companyName}. Help me prepare for the presentation, identify gaps, and suggest what to add:\n\n${qbrText}`;

  const openWith = (url: string, label: string) => {
    navigator.clipboard.writeText(qbrText).catch(() => {});
    window.open(url, "_blank");
    track("qbr_exported", { destination: label });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-wrap items-center gap-3">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide shrink-0">Export & extend</span>
      <div className="flex flex-wrap items-center gap-2 ml-auto">
        <CopyConfirmButton getText={() => qbrText} label="Copy for NotebookLM" />
        <span className="text-slate-200">|</span>
        <button
          onClick={() => openWith("https://notebooklm.google.com", "notebooklm")}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowSquareOut size={13} />
          Open NotebookLM
        </button>
        <span className="text-slate-200">|</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(claudePrompt).catch(() => {});
            window.open("https://claude.ai/new", "_blank");
            track("qbr_exported", { destination: "claude" });
          }}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowSquareOut size={13} />
          Open in Claude
        </button>
        <span className="text-slate-200">|</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(claudePrompt).catch(() => {});
            window.open("https://chatgpt.com", "_blank");
            track("qbr_exported", { destination: "chatgpt" });
          }}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowSquareOut size={13} />
          Open in ChatGPT
        </button>
        <span className="text-slate-200">|</span>
        <ExportPdfButton page="qbr" title={`${qbr.companyName} — ${qbr.quarter} CX Review`} />
      </div>
    </div>
  );
}

// ─── Loading state ────────────────────────────────────────────────────────────

function QBRLoading({ companyName }: { companyName: string }) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const steps = [
    { label: "Reading journey map and playbook", at: 0 },
    { label: "Identifying top risks for the quarter", at: 8 },
    { label: "Scoring CX health", at: 16 },
    { label: "Building quarter priorities", at: 24 },
    { label: "Writing your QBR document", at: 32 },
  ];

  const activeStep = [...steps].reverse().find((s) => seconds >= s.at) || steps[0];

  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 rounded-full px-4 py-1.5">
          <Sparkle size={14} className="text-primary animate-pulse" weight="fill" />
          <span className="text-xs font-semibold text-primary">Generating QBR</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          Building {companyName}&apos;s QBR
        </h1>
        <p className="text-sm text-slate-500">
          Turning your journey map and playbook into a board-ready quarterly review
        </p>
      </div>

      <div className="space-y-3 text-left max-w-sm mx-auto">
        {steps.map((step) => {
          const isDone = seconds > step.at + 7;
          const isActive = activeStep === step && !isDone;
          return (
            <div key={step.label} className={`flex items-center gap-3 transition-all duration-500 ${isDone || isActive ? "opacity-100" : "opacity-25"}`}>
              <div className="shrink-0">
                {isDone ? (
                  <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center">
                    <Check size={10} weight="bold" className="text-slate-500" />
                  </div>
                ) : isActive ? (
                  <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-200" />
                )}
              </div>
              <p className={`text-sm ${isActive ? "text-slate-800 font-medium" : "text-slate-400"}`}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-400 tabular-nums">
        {seconds}s elapsed
      </p>
    </div>
  );
}

// ─── Main QBR page ────────────────────────────────────────────────────────────

export default function QBRPage() {
  const [qbr, setQBR] = useState<GeneratedQBR | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("your company");
  const [templateId, setTemplateId] = useState<string | null>(null);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    track("qbr_generation_started");

    try {
      const stored = sessionStorage.getItem("cx-mate-journey");
      const playbookStored = sessionStorage.getItem("cx-mate-playbook");

      if (!stored || !playbookStored) {
        throw new Error("Journey and playbook data required. Please complete onboarding first.");
      }

      const journeyData = JSON.parse(stored);
      const playbook: GeneratedPlaybook = JSON.parse(playbookStored);
      const journey: GeneratedJourney | null = journeyData.journey || null;
      const onboardingData: Record<string, unknown> = journeyData.onboardingData || {};

      if (journeyData.templateId) setTemplateId(journeyData.templateId);
      if (playbook.companyName) setCompanyName(playbook.companyName);

      const response = await fetch("/api/generate-qbr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playbook, journey, onboardingData }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.error || "Failed to generate QBR");
      }

      const result = await response.json();
      const generatedQBR: GeneratedQBR = result.qbr;

      setQBR(generatedQBR);
      sessionStorage.setItem("cx-mate-qbr", JSON.stringify(generatedQBR));

      track("qbr_generation_succeeded", { company: generatedQBR.companyName, quarter: generatedQBR.quarter });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      track("qbr_generation_failed", { error: msg });
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-start generation or load cached QBR
  useEffect(() => {
    const cached = sessionStorage.getItem("cx-mate-qbr");
    if (cached) {
      try {
        const parsed: GeneratedQBR = JSON.parse(cached);
        setQBR(parsed);
        if (parsed.companyName) setCompanyName(parsed.companyName);
        const stored = sessionStorage.getItem("cx-mate-journey");
        if (stored) {
          const d = JSON.parse(stored);
          if (d.templateId) setTemplateId(d.templateId);
        }
        return;
      } catch { /* ignore */ }
    }

    // Get company name for loading state
    const stored = sessionStorage.getItem("cx-mate-journey");
    if (stored) {
      try {
        const d = JSON.parse(stored);
        if (d.onboardingData?.companyName) setCompanyName(d.onboardingData.companyName as string);
        if (d.templateId) setTemplateId(d.templateId);
      } catch { /* ignore */ }
    }

    generate();
  }, [generate]);

  if (loading) return <QBRLoading companyName={companyName} />;

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-xl font-bold text-slate-900">Couldn&apos;t generate QBR</h1>
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={generate} size="sm">Try again</Button>
            {templateId && (
              <Link href={`/playbook?id=${templateId}`}>
                <Button variant="outline" size="sm">← Back to Playbook</Button>
              </Link>
            )}
          </div>
        </div>
      </main>
    );
  }

  if (!qbr) return null;

  const healthStyle = getHealthStyle(qbr.cxHealthScore.label);

  return (
    <main className="min-h-screen">
      {/* PDF cover page — print only */}
      <PrintCover
        companyName={qbr.companyName}
        documentType="CX Quarterly Review"
      />

      <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center justify-between mb-4">
            <Link href={templateId ? `/playbook?id=${templateId}` : "/playbook"}>
              <button className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors">
                <ArrowLeft size={14} />
                Back to Playbook
              </button>
            </Link>
            <button
              onClick={() => {
                sessionStorage.removeItem("cx-mate-qbr");
                setQBR(null);
                generate();
              }}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              Regenerate
            </button>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
                {qbr.quarter} Quarterly Business Review
              </p>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{qbr.companyName}</h1>
            </div>
            <ExportPdfButton page="qbr" title={`${qbr.companyName} — ${qbr.quarter} CX Review`} />
          </div>
        </div>

        {/* CX Health Score */}
        <div className={`rounded-2xl border ${healthStyle.border} ${healthStyle.bg} p-6 flex items-start gap-6`}>
          <div className="text-center shrink-0">
            <p className={`text-6xl font-black ${healthStyle.score} leading-none`}>{qbr.cxHealthScore.score}</p>
            <p className="text-xs text-slate-400 mt-1">/10</p>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${healthStyle.text}`}>{qbr.cxHealthScore.label}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${healthStyle.border} ${healthStyle.text} ${healthStyle.bg}`}>
                CX Health
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{qbr.cxHealthScore.rationale}</p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Executive Summary</p>
          <p className="text-sm text-slate-700 leading-relaxed">{qbr.executiveSummary}</p>
        </div>

        {/* Key Findings */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Key Findings</p>
          <ul className="space-y-2.5">
            {qbr.keyFindings.map((f, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <p className="text-sm text-slate-700 leading-relaxed">{f}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Top Risks */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Top Risks</p>
          {qbr.topRisks.map((risk, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-slate-800">{risk.risk}</p>
                <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${getRiskStyle(risk.impact)}`}>
                  {risk.impact}
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{risk.description}</p>
              <div className="pt-1 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-400 mb-0.5">Mitigation</p>
                <p className="text-xs text-slate-600">{risk.mitigation}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quarter Priorities */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{qbr.quarter} Priorities</p>
          {qbr.quarterPriorities.map((p, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm font-semibold text-slate-800">{p.initiative}</p>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed ml-9">{p.rationale}</p>
              <div className="ml-9 flex flex-wrap gap-2">
                <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">{p.owner}</span>
                <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">By: {p.timeline}</span>
                <span className="text-xs font-medium text-primary bg-primary/8 px-2 py-1 rounded-lg border border-primary/15">✓ {p.successMetric}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Measurement Framework */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Measurement Framework</p>
          <p className="text-sm text-slate-600 leading-relaxed">{qbr.measurementFramework.summary}</p>
          <div className="space-y-2">
            {qbr.measurementFramework.checkpoints.map((c, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b last:border-b-0 border-slate-100">
                <span className="text-xs font-semibold text-primary bg-primary/8 border border-primary/15 px-2 py-0.5 rounded-full shrink-0 mt-0.5">
                  {c.stage}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-800">{c.metric}</p>
                  <p className="text-xs text-slate-400">{c.frequency} · Target: {c.target}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ask of the Quarter */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Ask of the Quarter</p>
          <ul className="space-y-2.5">
            {qbr.askOfTheQuarter.map((ask, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <DownloadSimple size={14} className="text-primary mt-0.5 shrink-0" weight="bold" />
                <p className="text-sm text-slate-700">{ask}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Open Items */}
        {qbr.openItems?.length > 0 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 space-y-2">
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest">Open Items</p>
            <ul className="space-y-1.5">
              {qbr.openItems.map((item, i) => (
                <li key={i} className="text-sm text-amber-800">· {item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Closing Statement */}
        <div className="rounded-2xl bg-primary/5 border border-primary/15 p-6">
          <p className="text-sm font-medium text-primary leading-relaxed italic">&ldquo;{qbr.closingStatement}&rdquo;</p>
        </div>

        {/* Export row */}
        <ExportRow qbr={qbr} />

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <Link href={templateId ? `/playbook?id=${templateId}` : "/playbook"}>
            <Button variant="ghost" size="sm" className="text-slate-400">← Playbook</Button>
          </Link>
          <Link href={templateId ? `/journey?id=${templateId}` : "/journey"}>
            <Button variant="outline" size="sm">Journey Map</Button>
          </Link>
        </div>

      </div>
    </main>
  );
}
