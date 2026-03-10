"use client";

import { Fragment } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/ui/logo-mark";

// ─── Sage background color ─────────────────────────────────────────────────────
const SAGE = "#E8EDE5";

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section style={{ backgroundColor: SAGE }} className="relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-20 text-center">
        {/* Headline — plain language, no jargon */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.04] mb-6">
          Your customers hit friction you never see{" "}
          <span style={{ color: "#0D9488" }}>until they leave.</span>
        </h1>

        {/* Subheadline — one sentence */}
        <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-10 max-w-xl mx-auto">
          One conversation maps your full customer journey and tells you exactly what to fix, before they decide to leave.
        </p>

        {/* CTA */}
        <Link href="/onboarding">
          <Button
            size="lg"
            className="rounded-xl px-8 py-6 text-base font-bold shadow-md hover:shadow-xl transition-all"
            style={{ backgroundColor: "#0D9488", color: "white" }}
          >
            Find Where I&apos;m Losing Them →
          </Button>
        </Link>
        <p className="text-sm text-slate-500 mt-4">
          No setup, no credit card.
        </p>
      </div>
    </section>
  );
}

// ─── Comparison: the key section ─────────────────────────────────────────────

function ComparisonSection() {
  const rows = [
    { label: "Timeline", diy: "Ongoing guesswork", consultant: "4–8 weeks", cxmate: "Under 10 minutes" },
    { label: "Cost", diy: "Free but blind", consultant: "$15,000–$50,000", cxmate: "Start free · $149 full" },
    { label: "What you get", diy: "Gut feelings, NPS score", consultant: "PDF report + presentation", cxmate: "Journey map + playbook + review" },
    { label: "Methodology", diy: "Ad hoc", consultant: "Varies by consultant", cxmate: "Certified, benchmarked to your vertical" },
    { label: "When it makes sense", diy: "Day 1 (but not enough)", consultant: "Series B+ with budget", cxmate: "Day 1 through scale" },
  ];

  return (
    <section className="bg-slate-950">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#2DD4BF" }}>
            Why now, not later
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Most companies wait until Series B{" "}
            <br className="hidden sm:block" />
            to fix the customer experience.{" "}
            <span style={{ color: "#2DD4BF" }}>You don&apos;t have to.</span>
          </h2>
          <p className="text-base text-slate-400 mt-4 max-w-xl mx-auto">
            A great consultant brings deep strategic thinking.
            CX Mate brings that same depth, powered by AI, at startup-friendly speed and cost.
          </p>
        </div>

        {/* 3-column comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {/* Column 1 — DIY */}
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-lg">📋</span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                DIY / Spreadsheets
              </span>
            </div>
            <ul className="space-y-3">
              {rows.map((row) => (
                <li key={row.label} className="text-sm">
                  <span className="text-slate-500 text-xs block mb-0.5">{row.label}</span>
                  <span className="text-slate-300 font-medium">{row.diy}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 — Consultant */}
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-lg">👤</span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Consultant
              </span>
            </div>
            <ul className="space-y-3">
              {rows.map((row) => (
                <li key={row.label} className="text-sm">
                  <span className="text-slate-500 text-xs block mb-0.5">{row.label}</span>
                  <span className="text-slate-300 font-medium">{row.consultant}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — CX Mate (highlighted) */}
          <div className="rounded-2xl border-2 p-5" style={{ borderColor: "#0D9488", backgroundColor: "#0D948815" }}>
            <div className="flex items-center gap-2 mb-5">
              <LogoMark size="sm" />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#2DD4BF" }}>
                CX Mate
              </span>
            </div>
            <ul className="space-y-3">
              {rows.map((row) => (
                <li key={row.label} className="text-sm">
                  <span className="text-xs block mb-0.5" style={{ color: "#5EEAD4" }}>{row.label}</span>
                  <span className="font-bold" style={{ color: "#CCFBF1" }}>{row.cxmate}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-10 max-w-lg mx-auto leading-relaxed">
          When your company grows into needing a customer experience team,
          <span className="font-semibold text-slate-300"> you&apos;ll already have the foundation in place.</span>
        </p>
      </div>
    </section>
  );
}

// ─── How it works ─────────────────────────────────────────────────────────────

function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      label: "Tell us about your business",
      description: "Your product, customers, team, and where things break. In a quick conversation, not a form.",
      detail: "~10 min · No setup",
      accent: "#F0C040",
      accentDark: "#92400E",
    },
    {
      number: 2,
      label: "Get your journey mapped",
      description: "50+ touchpoints across your customer lifecycle, with every friction point and handoff gap identified.",
      detail: "~3 min · Benchmarked to your vertical",
      accent: "#0D9488",
      accentDark: "#134E4A",
    },
    {
      number: 3,
      label: "Know what to fix Monday",
      description: "A prioritized action plan with templates, plus a management-ready review for your next team meeting.",
      detail: "Instant · PDF export · Share with your team",
      accent: "#16A34A",
      accentDark: "#14532D",
    },
  ];

  return (
    <section style={{ backgroundColor: SAGE }}>
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            One conversation. Three deliverables. Zero setup.
          </h2>
        </div>

        {/* Step flow */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr] [grid-auto-rows:1fr] gap-4 sm:gap-0">
          {steps.map((step, i) => (
            <Fragment key={step.number}>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-base font-black text-white mb-4 shrink-0"
                  style={{ backgroundColor: step.accent }}
                >
                  {step.number}
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2">{step.label}</h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">{step.description}</p>
                <p className="text-xs text-slate-400 font-medium mt-4 pt-4 border-t border-slate-100">{step.detail}</p>
              </div>

              {i < steps.length - 1 && (
                <div className="hidden sm:flex items-center justify-center px-4 text-slate-300 text-2xl font-light select-none">
                  →
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Bottom CTA ───────────────────────────────────────────────────────────────

function BottomCTA() {
  return (
    <section className="bg-slate-950 border-t border-white/8">
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Every day without a diagnosis{" "}
          <span style={{ color: "#2DD4BF" }}>is another day of invisible churn.</span>
        </h2>
        <p className="text-slate-400 text-lg mb-10">
          Your full customer journey mapped, the risks identified, and a playbook to fix what matters most.
        </p>
        <Link href="/onboarding">
          <Button
            size="lg"
            className="rounded-xl px-10 py-7 text-base font-bold shadow-lg hover:shadow-xl transition-all"
            style={{ backgroundColor: "#0D9488", color: "white" }}
          >
            Find Where I&apos;m Losing Them →
          </Button>
        </Link>
        <p className="text-xs text-slate-600 mt-4">
          No setup, no credit card.
        </p>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/8 bg-slate-950">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <LogoMark />
          <span className="text-sm font-bold tracking-tight text-white">CX Mate</span>
        </div>
        <p className="text-xs text-slate-500 hidden sm:block">
          Customer intelligence for B2B companies that move fast.
        </p>
        <div className="flex items-center gap-5">
          <Link href="/about" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">About</Link>
          <Link href="/pricing" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Pricing</Link>
          <Link href="/privacy" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Privacy</Link>
          <Link href="/terms" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80" style={{ backgroundColor: SAGE }}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <LogoMark />
            <span className="text-sm font-bold tracking-tight text-slate-900">CX Mate</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
              Log in
            </Link>
            <Link href="/onboarding">
              <Button
                size="sm"
                className="rounded-lg font-semibold"
                style={{ backgroundColor: "#0D9488", color: "white" }}
              >
                Start Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <HeroSection />
      <ComparisonSection />
      <HowItWorksSection />
      <BottomCTA />
      <Footer />
    </main>
  );
}
