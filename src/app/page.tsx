"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Sparkle, Lightning } from "@phosphor-icons/react";

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />

      <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-primary">Built on certified customer experience methodology</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.08] mb-6">
          Stop building your customer{" "}
          <span className="text-primary">journey</span>
          <br className="hidden sm:block" />
          by accident.
        </h1>

        {/* Subheadline — the copy the user loves, now in the hero */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed mb-10">
          Your customers have a journey, whether you designed it or not.
          Find out what it looks like and where to improve it.
        </p>

        {/* CTA */}
        <Link href="/onboarding">
          <Button size="lg" className="rounded-xl px-10 py-7 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
            Get Your Action Playbook
          </Button>
        </Link>
        <p className="text-sm text-muted-foreground mt-4 mb-10">
          One conversation. No setup required.
        </p>

        {/* Value strip */}
        <div className="flex items-center justify-center gap-8 sm:gap-12 py-5 px-8 rounded-2xl bg-slate-50 border max-w-md mx-auto">
          <div className="text-center">
            <div className="text-xl font-bold text-foreground">Minutes</div>
            <div className="text-xs text-muted-foreground mt-0.5">Not months</div>
          </div>
          <div className="w-px h-7 bg-border" />
          <div className="text-center">
            <div className="text-xl font-bold text-foreground">50+</div>
            <div className="text-xs text-muted-foreground mt-0.5">Moments mapped</div>
          </div>
          <div className="w-px h-7 bg-border" />
          <div className="text-center">
            <div className="text-xl font-bold text-foreground">Expert</div>
            <div className="text-xs text-muted-foreground mt-0.5">Methodology</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Tell us about your business",
      description: "One conversation: your stage, your customers, your biggest challenges. CX Mate adapts to where you are.",
      icon: <FileText size={24} weight="duotone" />,
    },
    {
      number: "02",
      title: "We map everything",
      description: "50+ meaningful moments across your customer lifecycle, analyzed against real CX methodology.",
      icon: <Sparkle size={24} weight="duotone" />,
    },
    {
      number: "03",
      title: "You get a playbook",
      description: "Prioritized actions with templates and expected outcomes. Not theory. What to do this week.",
      icon: <Lightning size={24} weight="duotone" />,
    },
  ];

  return (
    <section className="bg-white border-y border-border/50">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            One conversation. Your whole journey.
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 sm:gap-12">
          {steps.map((step) => (
            <div key={step.number} className="space-y-3">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary/8 text-primary">
                {step.icon}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-bold text-primary/40 tracking-wider">{step.number}</span>
                <h3 className="text-base font-semibold">{step.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      title: "Where the real risks are hiding",
      description: "The gaps your team doesn't see, quantified by revenue impact.",
      badge: "CX Intelligence",
    },
    {
      title: "Your whole journey, visualized",
      description: "Every stage, every meaningful moment, mapped to your business model and maturity stage.",
      badge: "Journey Map",
    },
    {
      title: "What to do about it, this week",
      description: "Prioritized actions with copy-paste templates. Not advice. Execution.",
      badge: "Action Playbook",
    },
    {
      title: "How you compare to companies like you",
      description: "Benchmarked against companies at your exact stage. Invest in what matters now.",
      badge: "Benchmarking",
    },
  ];

  return (
    <section className="bg-background">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">What you get</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            From gut feel to clear direction.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border bg-white p-6 hover:shadow-md transition-all duration-200"
            >
              <span className="inline-flex text-xs font-medium px-2.5 py-1 rounded-full border bg-primary/8 text-primary border-primary/15 mb-3">
                {feature.badge}
              </span>
              <h3 className="text-base font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BottomCTA() {
  return (
    <section className="bg-white border-t border-border/50">
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Stop guessing. Start mapping.
        </h2>
        <p className="text-muted-foreground mb-8">
          Find out what your customers actually experience, and exactly what to fix first.
        </p>
        <Link href="/onboarding">
          <Button size="lg" className="rounded-xl px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all">
            Get Your Action Playbook
          </Button>
        </Link>
        <p className="text-xs text-muted-foreground mt-4">
          One conversation. No setup required.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">CX</span>
          </div>
          <span className="text-sm font-bold tracking-tight text-foreground">CX Mate</span>
        </div>
        <p className="text-xs text-muted-foreground">
          The customer experience foundation every B2B company needs.
        </p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/60">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">CX</span>
            </div>
            <span className="text-sm font-bold tracking-tight text-foreground">CX Mate</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Log in
            </Link>
            <Link href="/onboarding">
              <Button size="sm" className="rounded-lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <BottomCTA />
      <Footer />
    </main>
  );
}
