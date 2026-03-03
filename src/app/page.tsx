"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Sparkle, Lightning, GraduationCap, ShieldCheck, Users } from "@phosphor-icons/react";

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />

      <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-primary">AI-powered CX intelligence</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.08] mb-6">
          Map your customer{" "}
          <span className="text-primary">journey</span>
          <br className="hidden sm:block" />
          in minutes, not months
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12">
          Tell us your company name and CX Mate does the rest — analyzes your business,
          maps the entire customer lifecycle, and gives you a playbook
          your team can execute this week.
        </p>

        {/* CTA cluster */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link href="/onboarding">
            <Button size="lg" className="rounded-xl px-10 py-7 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
              Map Your Customer Journey
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mb-10">
          One conversation. No setup required.
        </p>

        {/* Quantified value strip */}
        <div className="flex items-center justify-center gap-8 sm:gap-12 py-6 px-8 rounded-2xl bg-slate-50 border max-w-lg mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">Minutes</div>
            <div className="text-xs text-muted-foreground mt-0.5">Not months</div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">50+</div>
            <div className="text-xs text-muted-foreground mt-0.5">Moments mapped</div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">CCXP</div>
            <div className="text-xs text-muted-foreground mt-0.5">Expert methodology</div>
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
      description:
        "Answer a few questions about your company, customers, and goals. Our AI adapts to your maturity stage.",
      icon: <FileText size={24} weight="duotone" />,
    },
    {
      number: "02",
      title: "AI maps your journey",
      description:
        "CX Mate generates a complete customer journey with stages, meaningful moments, and risk analysis.",
      icon: <Sparkle size={24} weight="duotone" />,
    },
    {
      number: "03",
      title: "Get your playbook",
      description:
        "Receive prioritized actions with templates, timelines, and expected outcomes your team can start executing immediately.",
      icon: <Lightning size={24} weight="duotone" />,
    },
  ];

  return (
    <section className="bg-white border-y border-border/50">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Three steps to better CX
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 sm:gap-12">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              {/* Step card */}
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/8 text-primary">
                  {step.icon}
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-xs font-bold text-primary/40 tracking-wider">{step.number}</span>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialProofSection() {
  const proofs = [
    {
      icon: <GraduationCap size={20} weight="duotone" />,
      title: "CCXP methodology",
      description: "Built on frameworks used by certified CX professionals worldwide.",
    },
    {
      icon: <ShieldCheck size={20} weight="duotone" />,
      title: "Industry benchmarks",
      description: "Every recommendation is grounded in real performance data from your vertical.",
    },
    {
      icon: <Users size={20} weight="duotone" />,
      title: "Made for lean teams",
      description: "Designed for startups and SMBs without a dedicated CX department.",
    },
  ];

  return (
    <section className="bg-background">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-3 gap-8">
          {proofs.map((proof) => (
            <div key={proof.title} className="flex items-start gap-3">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/8 text-primary flex items-center justify-center">
                {proof.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{proof.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{proof.description}</p>
              </div>
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
      title: "CX Intelligence Report",
      description: "Honest gap analysis that shows what's really happening in your customer experience — the risks, the gaps, and the opportunities.",
      badge: "Insights",
      badgeColor: "bg-primary/8 text-primary border-primary/15",
    },
    {
      title: "Journey Map",
      description: "A complete stage-by-stage journey with meaningful moments, emotional arcs, and severity ratings tailored to your business model.",
      badge: "Visual",
      badgeColor: "bg-primary/8 text-primary border-primary/15",
    },
    {
      title: "Action Playbook",
      description: "Prioritized recommendations with copy-paste templates, effort estimates, and ownership assignments. Not theory — execution.",
      badge: "Actions",
      badgeColor: "bg-primary/8 text-primary border-primary/15",
    },
    {
      title: "Maturity Benchmarking",
      description: "See where you stand compared to companies at your stage. Know exactly what to invest in now vs. later.",
      badge: "Benchmark",
      badgeColor: "bg-primary/8 text-primary border-primary/15",
    },
  ];

  return (
    <section className="bg-background">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">What you get</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Everything you need to own your CX
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Most startups fly blind on customer experience. CX Mate gives you
            the analysis and actions that usually require a dedicated CX team.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border bg-white p-6 sm:p-8 hover:shadow-md transition-all duration-200"
            >
              <span className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full border mb-4 ${feature.badgeColor}`}>
                {feature.badge}
              </span>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
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
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Stop guessing. Start mapping.
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Your customers have a journey — whether you designed it or not.
          Find out what it looks like and where to improve it.
        </p>
        <Link href="/onboarding">
          <Button size="lg" className="rounded-xl px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all">
            Map Your Customer Journey
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
          Like having a CX expert on your team — powered by AI
        </p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Top nav bar for landing page */}
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
      <SocialProofSection />
      <FeaturesSection />
      <BottomCTA />
      <Footer />
    </main>
  );
}
