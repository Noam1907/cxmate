import Link from "next/link";
import { Button } from "@/components/ui/button";

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
          <span className="text-xs font-medium text-primary">AI-powered CX for B2B startups</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.08] mb-6">
          Map your customer{" "}
          <span className="text-primary">journey</span>
          <br className="hidden sm:block" />
          in under 5 minutes
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
          Tell us your company name and CX Mate does the rest — analyzes your business,
          maps the entire customer lifecycle, and gives you a playbook
          your team can execute this week.
        </p>

        {/* CTA cluster */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <Link href="/onboarding">
            <Button size="lg" className="rounded-xl px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all">
              Map Your Customer Journey
            </Button>
          </Link>
          <span className="text-sm text-muted-foreground">No account needed</span>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
            Built on real CX methodology
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
            AI-generated in minutes
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
            For companies building CX from scratch
          </span>
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
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
    {
      number: "02",
      title: "AI maps your journey",
      description:
        "CX Mate generates a complete customer journey with stages, meaningful moments, and risk analysis.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Get your playbook",
      description:
        "Receive prioritized actions with templates, timelines, and expected outcomes your team can start executing immediately.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
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

function FeaturesSection() {
  const features = [
    {
      title: "CX Intelligence Report",
      description: "Confrontation-style analysis that shows you what's actually happening in your customer experience — the risks, the gaps, and the opportunities.",
      badge: "Insights",
      badgeColor: "bg-red-50 text-red-700 border-red-200",
    },
    {
      title: "Journey Map",
      description: "A complete stage-by-stage journey with meaningful moments, emotional arcs, and severity ratings tailored to your business model.",
      badge: "Visual",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      title: "Action Playbook",
      description: "Prioritized recommendations with copy-paste templates, effort estimates, and ownership assignments. Not theory — execution.",
      badge: "Actions",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      title: "Maturity Benchmarking",
      description: "See where you stand compared to companies at your stage. Know exactly what to invest in now vs. later.",
      badge: "Benchmark",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
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
            Get Your Free CX Playbook
          </Button>
        </Link>
        <p className="text-xs text-muted-foreground mt-4">
          Takes about 3 minutes. No credit card, no account required.
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
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">CX</span>
          </div>
          <span className="text-sm font-semibold text-foreground">CX Mate</span>
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
          <Link href="/onboarding">
            <Button size="sm" className="rounded-lg">
              Get Started
            </Button>
          </Link>
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
