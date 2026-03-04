"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

// ─── Sage background color (from Customerscore.io design pattern) ─────────────
const SAGE = "#E8EDE5";

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroCards() {
  return (
    <div className="relative w-full max-w-sm mx-auto lg:mx-0 flex flex-col gap-3 lg:gap-4">
      {/* Card 1 — Input: Pain Identified */}
      <div
        className="rounded-2xl border-2 p-5 shadow-lg"
        style={{ backgroundColor: "#FFF8E6", borderColor: "#F0C040" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🔍</span>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
            Input
          </span>
        </div>
        <p className="text-sm font-bold text-slate-800 mb-2">Your Business</p>
        <div className="flex flex-col gap-1.5">
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
          className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full"
          style={{ backgroundColor: "#FDE68A", color: "#78350F" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Analyzing now
        </div>
      </div>

      {/* Card 2 — Process: Journey Mapped */}
      <div
        className="rounded-2xl border-2 p-5 shadow-lg ml-4 lg:ml-8"
        style={{ backgroundColor: "#E0F7F4", borderColor: "#0D9488" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🗺️</span>
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700">
            Analysis
          </span>
        </div>
        <p className="text-sm font-bold text-slate-800 mb-2">Journey Mapped</p>
        <div className="flex flex-col gap-1.5">
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
          className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full"
          style={{ backgroundColor: "#99F6E4", color: "#134E4A" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
          Complete
        </div>
      </div>

      {/* Card 3 — Output: Sprint Ready */}
      <div
        className="rounded-2xl border-2 p-5 shadow-lg"
        style={{ backgroundColor: "#DCFCE7", borderColor: "#16A34A" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">⚡</span>
          <span className="text-xs font-bold uppercase tracking-widest text-green-700">
            Output
          </span>
        </div>
        <p className="text-sm font-bold text-slate-800 mb-2">Sprint Ready</p>
        <div className="flex flex-col gap-1.5">
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
          className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full"
          style={{ backgroundColor: "#BBF7D0", color: "#14532D" }}
        >
          ✓ Generated for you
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
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-teal-200 mb-8 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-xs font-semibold text-teal-700">Built on certified CX methodology</span>
            </div>

            {/* Headline — big, confrontational */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.04] mb-6">
              Stop running your CX{" "}
              <span style={{ color: "#0D9488" }}>on gut feel.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-10 max-w-md">
              Most B2B founders set their customer journey from instinct and templates — not data.
              CX Mate maps 50+ meaningful moments against your exact stage and vertical.
              One conversation. Evidence you can act on. This week.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link href="/onboarding">
                <Button
                  size="lg"
                  className="rounded-xl px-8 py-6 text-base font-bold shadow-md hover:shadow-xl transition-all"
                  style={{ backgroundColor: "#0D9488", color: "white" }}
                >
                  Get Your Week 1 CX Sprint →
                </Button>
              </Link>
              <p className="text-sm text-slate-500">
                One conversation. No setup required.
              </p>
            </div>

            {/* Stats strip */}
            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-slate-200">
              <div>
                <div className="text-2xl font-extrabold text-slate-900">Minutes</div>
                <div className="text-xs text-slate-500 mt-0.5">Not months</div>
              </div>
              <div className="w-px h-8 bg-slate-300" />
              <div>
                <div className="text-2xl font-extrabold text-slate-900">50+</div>
                <div className="text-xs text-slate-500 mt-0.5">Moments mapped</div>
              </div>
              <div className="w-px h-8 bg-slate-300" />
              <div>
                <div className="text-2xl font-extrabold text-slate-900">CCXP</div>
                <div className="text-xs text-slate-500 mt-0.5">Methodology</div>
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
          The truth about your CX
        </p>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
          The journey exists whether{" "}
          <br className="hidden sm:block" />
          <span style={{ color: "#2DD4BF" }}>you designed it or not.</span>
        </h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
          Most B2B companies lose 15–30% of revenue to CX gaps they never mapped.
          Customers don't tell you they're leaving. They just stop responding.
        </p>
        <Link href="/onboarding">
          <Button
            size="lg"
            className="rounded-xl px-8 py-6 text-base font-bold"
            style={{ backgroundColor: "#0D9488", color: "white" }}
          >
            Get Your Week 1 CX Sprint →
          </Button>
        </Link>
      </div>
    </section>
  );
}

// ─── How it works ─────────────────────────────────────────────────────────────

function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      label: "Conversation",
      title: "Tell us about your business",
      description: "Your stage, your customers, your biggest pain. CX Mate adapts to where you are — not a generic template.",
      trigger: "Your inputs",
      action: "AI builds your profile",
      result: "Personalized context ready",
      bg: "#FFF8E6",
      border: "#F0C040",
      badgeBg: "#FDE68A",
      badgeText: "#78350F",
    },
    {
      number: "02",
      label: "Analysis",
      title: "We map everything",
      description: "50+ meaningful moments across your lifecycle, benchmarked against companies at your exact stage and vertical.",
      trigger: "Your context",
      action: "52 moments analyzed",
      result: "Critical gaps identified",
      bg: "#E0F7F4",
      border: "#0D9488",
      badgeBg: "#99F6E4",
      badgeText: "#134E4A",
    },
    {
      number: "03",
      label: "Sprint",
      title: "You get a sprint plan",
      description: "Prioritized actions with copy-paste templates and expected outcomes. Not advice. What to ship this week.",
      trigger: "Gap analysis",
      action: "12 actions ranked",
      result: "Week 1: 3 quick wins",
      bg: "#DCFCE7",
      border: "#16A34A",
      badgeBg: "#BBF7D0",
      badgeText: "#14532D",
    },
  ];

  return (
    <section style={{ backgroundColor: SAGE }} className="border-y border-slate-200/60">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            One conversation. Your whole journey.
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border-2 p-6 shadow-sm"
              style={{ backgroundColor: step.bg, borderColor: step.border }}
            >
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-black text-slate-200">{step.number}</span>
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: step.badgeBg, color: step.badgeText }}
                >
                  {step.label}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">{step.description}</p>
              <div className="space-y-1.5 pt-3 border-t border-black/8">
                {[
                  { pill: "TRIGGER", text: step.trigger },
                  { pill: "ACTION", text: step.action },
                  { pill: "RESULT", text: step.result },
                ].map(({ pill, text }) => (
                  <div key={pill} className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-[10px] tracking-wider text-slate-400 w-12 shrink-0">{pill}</span>
                    <span className="text-slate-700 font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>
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
      badge: "CX Intelligence",
      title: "Where the real risks are hiding",
      description: "The gaps your team doesn't see, quantified by revenue impact. Not opinions — methodology.",
      emoji: "🔍",
    },
    {
      badge: "Journey Map",
      title: "Your whole lifecycle, visualized",
      description: "Every stage, every meaningful moment, mapped to your business model and maturity stage.",
      emoji: "🗺️",
    },
    {
      badge: "CX Sprint",
      title: "What to ship this week",
      description: "Prioritized actions with copy-paste templates and expected outcomes. Not theory. Execution. Starting Monday.",
      emoji: "⚡",
    },
    {
      badge: "Benchmarking",
      title: "How you compare to companies like you",
      description: "Benchmarked against companies at your exact stage. Invest in what moves the needle now.",
      emoji: "📊",
    },
  ];

  return (
    <section style={{ backgroundColor: SAGE }}>
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-3">What you get</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            From gut feel to clear direction.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{feature.emoji}</span>
                <span className="inline-flex text-xs font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                  {feature.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1.5">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
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
          Stop guessing.{" "}
          <span style={{ color: "#2DD4BF" }}>Start mapping.</span>
        </h2>
        <p className="text-slate-400 text-lg mb-10">
          Find out what your customers actually experience — and exactly what to fix first.
        </p>
        <Link href="/onboarding">
          <Button
            size="lg"
            className="rounded-xl px-10 py-7 text-base font-bold shadow-lg hover:shadow-xl transition-all"
            style={{ backgroundColor: "#0D9488", color: "white" }}
          >
            Get Your Week 1 CX Sprint →
          </Button>
        </Link>
        <p className="text-xs text-slate-600 mt-4">
          One conversation. No setup required.
        </p>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/8 bg-slate-950">
      <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#0D9488" }}>
            <span className="text-sm font-bold text-white">CX</span>
          </div>
          <span className="text-sm font-bold tracking-tight text-white">CX Mate</span>
        </div>
        <p className="text-xs text-slate-500">
          The CX foundation every B2B company needs.
        </p>
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
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#0D9488" }}>
              <span className="text-sm font-bold text-white">CX</span>
            </div>
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
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <HeroSection />
      <DarkSection />
      <HowItWorksSection />
      <FeaturesSection />
      <BottomCTA />
      <Footer />
    </main>
  );
}
