"use client";

import { Fragment } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/ui/logo-mark";

// ─── Sage background color ─────────────────────────────────────────────────────
const SAGE = "#E8EDE5";

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroCards() {
  return (
    <div className="relative w-full max-w-sm mx-auto lg:mx-0 grid gap-3 lg:gap-4 [grid-auto-rows:1fr]">
      {/* Card 1 — Input: Pain Identified */}
      <div
        className="rounded-2xl border-2 p-5 shadow-lg flex flex-col"
        style={{ backgroundColor: "#FFF8E6", borderColor: "#F0C040" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🔍</span>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
            Input
          </span>
        </div>
        <p className="text-sm font-bold text-slate-800 mb-2">Your Business</p>
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Stage</span>
            <span className="font-semibold text-slate-700">Growing · B2B SaaS</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Biggest pain</span>
            <span className="font-semibold text-slate-700">Onboarding drop-off</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Revenue at risk</span>
            <span className="font-bold text-amber-600">~$48K / yr</span>
          </div>
        </div>
        <div
          className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full self-start"
          style={{ backgroundColor: "#FDE68A", color: "#78350F" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
          Analyzing now
        </div>
      </div>

      {/* Card 2 — Process: Journey Mapped */}
      <div
        className="rounded-2xl border-2 p-5 shadow-lg flex flex-col"
        style={{ backgroundColor: "#E0F7F4", borderColor: "#0D9488" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🗺️</span>
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700">
            Analysis
          </span>
        </div>
        <p className="text-sm font-bold text-slate-800 mb-2">Journey Mapped</p>
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Moments analyzed</span>
            <span className="font-semibold text-slate-700">52 touchpoints</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Critical gaps</span>
            <span className="font-bold text-teal-700">6 found</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Benchmarked against</span>
            <span className="font-semibold text-slate-700">Your stage + vertical</span>
          </div>
        </div>
        <div
          className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full self-start"
          style={{ backgroundColor: "#99F6E4", color: "#134E4A" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
          Complete
        </div>
      </div>

      {/* Card 3 — Output: Sprint Ready */}
      <div
        className="rounded-2xl border-2 p-5 shadow-lg flex flex-col"
        style={{ backgroundColor: "#DCFCE7", borderColor: "#16A34A" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">⚡</span>
          <span className="text-xs font-bold uppercase tracking-widest text-green-700">
            Output
          </span>
        </div>
        <p className="text-sm font-bold text-slate-800 mb-2">Sprint Ready</p>
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Actions prioritized</span>
            <span className="font-semibold text-slate-700">12 total</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Week 1 quick wins</span>
            <span className="font-bold text-green-700">3 ready to ship</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Templates included</span>
            <span className="font-semibold text-slate-700">Email + process</span>
          </div>
        </div>
        <div
          className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full self-start"
          style={{ backgroundColor: "#BBF7D0", color: "#14532D" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
          Generated for you
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section style={{ backgroundColor: SAGE }} className="relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 lg:pb-24">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-16">

          {/* Left — text */}
          <div className="flex-1 max-w-xl">
            {/* Pill badges */}
            <div className="flex flex-wrap gap-2 mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-teal-200 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                <span className="text-xs font-semibold text-teal-700">Live AI · Generates fresh for every business</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
                <span className="text-xs font-semibold text-slate-500">CCXP Certified Methodology</span>
              </div>
            </div>

            {/* Headline — big, confrontational */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.04] mb-6">
              Your customer journey is either{" "}
              <span style={{ color: "#0D9488" }}>designed or discovered.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-10 max-w-md">
              Most B2B startups find out what their customers actually experience from a churn conversation they didn&apos;t see coming.
              One conversation with CX Mate maps 50+ moments across your customer lifecycle —
              and tells you exactly what to fix before they decide to leave.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link href="/onboarding">
                <Button
                  size="lg"
                  className="rounded-xl px-8 py-6 text-base font-bold shadow-md hover:shadow-xl transition-all"
                  style={{ backgroundColor: "#0D9488", color: "white" }}
                >
                  Map My CX Journey →
                </Button>
              </Link>
              <p className="text-sm text-slate-500">
                One conversation. No setup, no credit card.
              </p>
            </div>

            {/* Stats strip */}
            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-slate-200">
              <div>
                <div className="text-2xl font-extrabold text-slate-900">50+</div>
                <div className="text-xs text-slate-500 mt-0.5">Moments mapped</div>
              </div>
              <div className="w-px h-8 bg-slate-300" />
              <div>
                <div className="text-2xl font-extrabold text-slate-900">3</div>
                <div className="text-xs text-slate-500 mt-0.5">Deliverables: Map · Playbook · Review</div>
              </div>
              <div className="w-px h-8 bg-slate-300" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                  <div className="text-2xl font-extrabold text-slate-900">Live AI</div>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Specific to your business, always</div>
              </div>
            </div>
          </div>

          {/* Right — workflow cards */}
          <div className="flex-shrink-0 w-full lg:w-auto lg:max-w-xs xl:max-w-sm">
            <HeroCards />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Dark confrontation section ───────────────────────────────────────────────

function DarkSection() {
  return (
    <section className="bg-slate-950 py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: "#2DD4BF" }}>
          The question nobody wants to answer
        </p>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
          When did you last experience your product{" "}
          <br className="hidden sm:block" />
          <span style={{ color: "#2DD4BF" }}>the way your customers do?</span>
        </h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
          Not during a demo. Not during onboarding with you on the call.
          The real experience — when they&apos;re stuck, when support is slow, when the renewal conversation catches them off guard.
          CX Mate maps what actually happens.
        </p>
        <Link href="/onboarding">
          <Button
            size="lg"
            className="rounded-xl px-8 py-6 text-base font-bold"
            style={{ backgroundColor: "#0D9488", color: "white" }}
          >
            See My Customer&apos;s Journey →
          </Button>
        </Link>
      </div>
    </section>
  );
}

// ─── Comparison: Expert vs CX Mate ───────────────────────────────────────────

function ComparisonSection() {
  const stages = [
    { label: "Pre-launch", active: true },
    { label: "First customers", active: true },
    { label: "Growing", active: true },
    { label: "Scaling", active: true },
    { label: "Enterprise", active: true },
  ];

  return (
    <section style={{ backgroundColor: SAGE }} className="border-b border-slate-200/60">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-3">
            Why now, not later
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            You don&apos;t need to wait until Series B <br className="hidden sm:block" />
            to get your CX right
          </h2>
          <p className="text-base text-slate-500 mt-3 max-w-xl mx-auto">
            CX consultants are great — for larger companies with complex operations.
            But your first customers deserve a designed journey too.
          </p>
        </div>

        {/* Side-by-side comparison cards */}
        <div className="grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {/* Consultant — respectful framing */}
          <div className="rounded-2xl border border-slate-300 bg-white p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-lg">👤</span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                CX Consultant (Series B+)
              </span>
            </div>
            <ul className="space-y-3">
              {[
                { label: "Timeline", value: "4–6 weeks" },
                { label: "Cost", value: "$15,000–$50,000" },
                { label: "Requires", value: "Team interviews, stakeholder workshops" },
                { label: "Deliverable", value: "PDF report + presentation" },
                { label: "Methodology", value: "Varies by consultant" },
              ].map((row) => (
                <li key={row.label} className="flex justify-between text-sm gap-3">
                  <span className="text-slate-400 shrink-0">{row.label}</span>
                  <span className="text-slate-600 font-medium text-right">{row.value}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CX Mate — early stage positioning */}
          <div className="rounded-2xl border-2 p-6" style={{ borderColor: "#0D9488", backgroundColor: "#E0F7F4" }}>
            <div className="flex items-center gap-2 mb-5">
              <LogoMark size="sm" />
              <span className="text-xs font-bold uppercase tracking-widest text-teal-700">
                CX Mate (Day One →)
              </span>
            </div>
            <ul className="space-y-3">
              {[
                { label: "Timeline", value: "Under 10 minutes", bold: true },
                { label: "Cost", value: "Free preview · $149 full analysis", bold: true },
                { label: "Requires", value: "One conversation about your business" },
                { label: "Deliverable", value: "Journey map + report + sprint playbook" },
                { label: "Methodology", value: "CCXP-certified, benchmarked to your stage" },
              ].map((row) => (
                <li key={row.label} className="flex justify-between text-sm gap-3">
                  <span className="text-teal-600 shrink-0">{row.label}</span>
                  <span className={`text-right ${row.bold ? "font-bold text-teal-800" : "font-medium text-teal-700"}`}>
                    {row.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* When you start — stage timeline */}
        <div className="mt-14 max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-center text-slate-400 mb-6">
            When companies typically start thinking about CX
          </p>

          {/* Timeline bar */}
          <div className="relative">
            {/* Stage labels + dots */}
            <div className="flex justify-between items-end mb-3">
              {stages.map((stage) => (
                <div key={stage.label} className="flex flex-col items-center gap-1.5 flex-1">
                  <span className="text-[10px] sm:text-xs text-slate-500 font-medium text-center leading-tight">
                    {stage.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Track */}
            <div className="relative h-3 rounded-full bg-slate-200 overflow-hidden">
              {/* CX Mate range — full bar, starts from the beginning */}
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: "100%", backgroundColor: "#0D9488" }}
              />
            </div>

            {/* Consultant range — only the last 40% */}
            <div className="relative h-3 rounded-full bg-slate-200 overflow-hidden mt-2">
              <div
                className="absolute inset-y-0 right-0 rounded-full bg-slate-400"
                style={{ width: "40%" }}
              />
            </div>

            {/* Labels for the bars */}
            <div className="flex justify-between mt-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: "#0D9488" }} />
                <span className="text-xs font-semibold text-teal-700">CX Mate — start from day one</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-500">Consultant — typically Series B+</span>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-slate-500 mt-8 max-w-lg mx-auto leading-relaxed">
            You probably already have strong instincts about what your customers need.
            <span className="font-semibold text-slate-700"> CX Mate turns those instincts into a structured plan </span>
            — so you can start doing CX right from day one, not after you can afford a consultant.
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-8 max-w-lg mx-auto">
          When your company grows into needing a CX team or a consultant, you&apos;ll have the foundation already in place. CX Mate makes the first steps easier, cheaper, and more precise.
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
      label: "The Conversation",
      title: "Tell us about your business",
      description: "Your product, your customers, your team, and where things break. CX Mate adapts to your answers — not a form, a real conversation.",
      detail: "15–20 questions · No setup, no credit card",
      accent: "#F0C040",
      accentDark: "#92400E",
    },
    {
      number: 2,
      label: "Journey Map",
      title: "Every stage, every moment",
      description: "50+ touchpoints mapped across your customer lifecycle — with the friction points, emotional dips, and handoff gaps your team doesn't see.",
      detail: "~3 minutes · Benchmarked to your stage + vertical",
      accent: "#0D9488",
      accentDark: "#134E4A",
    },
    {
      number: 3,
      label: "Playbook + CX Review",
      title: "Know exactly what to do Monday",
      description: "A prioritized action plan with copy-paste templates. Plus a management-ready CX Review to present at your next team meeting.",
      detail: "Instant · PDF export · Share with your team",
      accent: "#16A34A",
      accentDark: "#14532D",
    },
  ];

  return (
    <section style={{ backgroundColor: SAGE }} className="border-y border-slate-200/60">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            One conversation. Three deliverables. Zero setup.
          </h2>
        </div>

        {/* Step flow — CSS grid ensures all cards are equal height */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr] [grid-auto-rows:1fr] gap-4 sm:gap-0">
          {steps.map((step, i) => (
            <Fragment key={step.number}>
              {/* Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
                {/* Number circle */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-base font-black text-white mb-4 shrink-0"
                  style={{ backgroundColor: step.accent }}
                >
                  {step.number}
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full self-start mb-3"
                  style={{ backgroundColor: step.accent + "22", color: step.accentDark }}
                >
                  {step.label}
                </span>
                <h3 className="text-base font-bold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">{step.description}</p>
                <p className="text-xs text-slate-400 font-medium mt-4 pt-4 border-t border-slate-100">{step.detail}</p>
              </div>

              {/* Arrow between steps */}
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

// ─── Features ─────────────────────────────────────────────────────────────────

function FeaturesSection() {
  const features = [
    {
      badge: "Journey Map",
      title: "Your customer lifecycle, end to end",
      description: "Every stage mapped — from first contact to renewal. The handoffs, the friction points, the moments of delight, and the 2–3 places where customers quietly decide whether to stay.",
      emoji: "🗺️",
    },
    {
      badge: "CX Playbook",
      title: "A plan you can actually execute",
      description: "Prioritized actions specific to your stage and vertical. Not 'improve communication' — actual initiatives ranked by impact, with templates to ship them this week.",
      emoji: "⚡",
    },
    {
      badge: "CX Review",
      title: "Ready for your next management meeting",
      description: "A clear document that tells the story of your customer experience — health score, top risks, quarter priorities, and what you need from the team to fix it.",
      emoji: "📋",
    },
    {
      badge: "Live Intelligence",
      title: "Specific to you. Never generic.",
      description: "No templates. No copy-paste frameworks. Every analysis is generated live — calibrated to your company stage, vertical, and the actual answers you give.",
      emoji: "🧠",
    },
  ];

  return (
    <section style={{ backgroundColor: SAGE }}>
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-3">What you walk away with</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Not a report. A plan you act on Monday.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 [grid-auto-rows:1fr]">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-md transition-all duration-200 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{feature.emoji}</span>
                <span className="inline-flex text-xs font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                  {feature.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1.5">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed flex-1">
                {feature.description}
              </p>
            </div>
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
          Your customers already have an experience with your product.{" "}
          <span style={{ color: "#2DD4BF" }}>Time to find out what it actually is.</span>
        </h2>
        <p className="text-slate-400 text-lg mb-10">
          One conversation. Journey Map, CX Playbook, and CX Review — delivered in minutes.
        </p>
        <Link href="/onboarding">
          <Button
            size="lg"
            className="rounded-xl px-10 py-7 text-base font-bold shadow-lg hover:shadow-xl transition-all"
            style={{ backgroundColor: "#0D9488", color: "white" }}
          >
            Map My CX Journey →
          </Button>
        </Link>
        <p className="text-xs text-slate-600 mt-4">
          One conversation. No setup, no credit card.
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
          The CX foundation every B2B company needs.
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
                Map My Journey
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <HeroSection />
      <DarkSection />
      <ComparisonSection />
      <HowItWorksSection />
      <FeaturesSection />
      <BottomCTA />
      <Footer />
    </main>
  );
}
