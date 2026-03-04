import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/ui/logo-mark";

export const metadata: Metadata = {
  title: "About — CX Mate",
  description:
    "CX Mate gives B2B startups a CX expert on call — powered by AI, grounded in CCXP methodology.",
};

const SAGE = "#E8EDE5";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 sticky top-0 z-50" style={{ backgroundColor: SAGE }}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <LogoMark />
            <span className="text-sm font-bold tracking-tight text-slate-900">CX Mate</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm text-slate-500 hover:text-slate-800 transition-colors hidden sm:block">
              Pricing
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

      {/* Hero */}
      <section style={{ backgroundColor: SAGE }} className="border-b border-slate-200/60">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-4">About CX Mate</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight mb-6">
            Every B2B startup deserves{" "}
            <span style={{ color: "#0D9488" }}>a CX expert.</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Most startups lose 15–30% of revenue to customer experience gaps they never mapped.
            CX Mate gives founders and revenue teams the CX intelligence that enterprise companies
            pay consultants $200/hour for — in one conversation, in minutes.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">The gap we&rsquo;re closing</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
                <div className="text-xs font-bold uppercase tracking-widest text-rose-600 mb-2">The problem</div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Enterprise CX platforms (Gainsight, Qualtrics, Medallia) cost six figures and require
                  a dedicated CX team to run. Most startups can&rsquo;t afford them and can&rsquo;t use them anyway.
                </p>
                <p className="text-sm text-slate-700 leading-relaxed mt-2">
                  So companies wing it — gut feel, spreadsheets, and founder memory — until customers
                  quietly leave and the team still doesn&rsquo;t know why.
                </p>
              </div>
              <div className="rounded-2xl border border-teal-200 bg-teal-50 p-5">
                <div className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-2">Our answer</div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  CX Mate is the CX foundation every B2B startup needs — without the headcount, the
                  consulting fees, or the 6-month implementation.
                </p>
                <p className="text-sm text-slate-700 leading-relaxed mt-2">
                  One conversation. A complete journey map, CX intelligence report, and prioritized playbook.
                  Grounded in CCXP methodology. Specific to your stage, vertical, and the moment you&rsquo;re in.
                </p>
              </div>
            </div>
          </div>

          {/* What we built */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">What we built</h2>
            <div className="space-y-4">
              {[
                {
                  number: "01",
                  title: "A live AI intelligence engine",
                  description:
                    "No templates. No generic frameworks. Every journey is generated fresh for your specific company — your stage, your vertical, your pain points, your competitors. The output changes because your context changes.",
                  color: "#FFF8E6",
                  border: "#F0C040",
                  badge: "#FDE68A",
                  badgeText: "#78350F",
                },
                {
                  number: "02",
                  title: "CX methodology as infrastructure",
                  description:
                    "CCXP-certified journey mapping. Lifecycle science. Decision science. Failure pattern libraries. 8 modules of structured CX theory sit underneath every recommendation — so the output isn't just AI opinion, it's CX expertise.",
                  color: "#E0F7F4",
                  border: "#0D9488",
                  badge: "#99F6E4",
                  badgeText: "#134E4A",
                },
                {
                  number: "03",
                  title: "Evidence that connects to your reality",
                  description:
                    "Every insight links back to your actual input — your pain points, your competitors, your stage. Impact projections come with transparent formulas and explicit assumptions. We show the math.",
                  color: "#DCFCE7",
                  border: "#16A34A",
                  badge: "#BBF7D0",
                  badgeText: "#14532D",
                },
              ].map((item) => (
                <div
                  key={item.number}
                  className="rounded-2xl border-2 p-5"
                  style={{ backgroundColor: item.color, borderColor: item.border }}
                >
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-3xl font-black text-slate-200">{item.number}</span>
                    <h3 className="text-base font-bold text-slate-800">{item.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Principles */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">How we think</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { principle: "Journey-first", detail: "Everything starts from mapping the lifecycle. Before tools. Before tactics." },
                { principle: "Evidence-based", detail: "Every insight traces back to your actual input data. No generic outputs." },
                { principle: "Maturity-adaptive", detail: "Pre-launch advice is different from scaling advice. We know the difference." },
                { principle: "AI-first lens", detail: "Every recommendation is evaluated for how AI can accelerate it." },
                { principle: "Try before you buy", detail: "Full value before signup. No credit card to see your journey." },
                { principle: "Transparent methodology", detail: "We show the math. Impact projections include their formulas and assumptions." },
              ].map(({ principle, detail }) => (
                <div key={principle} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-1">{principle}</div>
                  <p className="text-sm text-slate-600">{detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Who it's for */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Who this is for</h2>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              CX Mate is built for B2B companies that haven&rsquo;t hired a dedicated CX expert yet.
              That&rsquo;s a stage, not a size. You might have 5 customers or 500.
            </p>
            <div className="space-y-3">
              {[
                {
                  role: "The Founder",
                  stage: "Pre-launch → First Customers",
                  pain: "Building without a CX playbook. Losing early customers without knowing why.",
                  goal: "Get a CX foundation in place before bad habits form.",
                },
                {
                  role: "The Revenue Leader",
                  stage: "Growing",
                  pain: "Sales and CS are disconnected. Revenue leaking at handoff points.",
                  goal: "One map from first touch to advocacy. Quantified impact projections.",
                },
                {
                  role: "The Head of CS",
                  stage: "Growing → Scaling",
                  pain: "Managing customer health reactively. Team growing faster than processes.",
                  goal: "Proactive playbook. Standardized approach. Evidence-backed recommendations.",
                },
              ].map((persona) => (
                <div key={persona.role} className="rounded-xl border border-slate-200 p-4 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-base shrink-0">
                    {persona.role === "The Founder" ? "🚀" : persona.role === "The Revenue Leader" ? "📈" : "🤝"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-slate-800">{persona.role}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{persona.stage}</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-1"><strong className="text-slate-600">Pain:</strong> {persona.pain}</p>
                    <p className="text-xs text-slate-600"><strong>Goal:</strong> {persona.goal}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-950 border-t border-white/8">
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            See what your customer experience{" "}
            <span style={{ color: "#2DD4BF" }}>actually looks like.</span>
          </h2>
          <p className="text-slate-400 text-base mb-10">
            One conversation. No setup required.
          </p>
          <Link href="/onboarding">
            <Button
              size="lg"
              className="rounded-xl px-8 py-6 text-base font-bold"
              style={{ backgroundColor: "#0D9488", color: "white" }}
            >
              Get Your CX Journey Map →
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 bg-slate-950">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <LogoMark />
            <span className="text-sm font-bold tracking-tight text-white">CX Mate</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/pricing" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Pricing</Link>
            <Link href="/privacy" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
