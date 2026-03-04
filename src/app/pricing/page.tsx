"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, CaretDown } from "@phosphor-icons/react";

// ── Types ─────────────────────────────────────────────────────────────────────

type PriceKey = "starter_monthly" | "starter_onetime";
type LoadingKey = PriceKey | null;

// ── Checkout helper ───────────────────────────────────────────────────────────

async function startCheckout(priceKey: PriceKey): Promise<string | null> {
  const res = await fetch("/api/billing/create-checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priceKey }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Checkout failed");
  return data.url;
}

// ── Tier configs (only Free + Starter shown) ─────────────────────────────────

const TIERS = [
  {
    name: "Free",
    idealFor: "Try CX Mate with zero commitment",
    price: "$0",
    period: "forever",
    description: "Get your CX foundation in minutes. No signup required.",
    highlight: false,
    features: [
      "Complete journey map generation",
      "CX Intelligence Report",
      "Full playbook with templates",
      "PDF export",
      "Open in NotebookLM",
      "One-time run (no saving)",
    ],
    cta: { label: "Start for free", href: "/onboarding", external: false },
    badge: null,
  },
  {
    name: "Starter",
    idealFor: "For teams ready to track and improve CX",
    price: null,
    period: null,
    description: "Track your CX health over time. Know if you're improving.",
    highlight: true,
    features: [
      "Everything in Free",
      "Save & return to your results",
      "Revenue Protected counter",
      "Monthly CX Score (0–100)",
      "Evidence Wall",
      "Slack nudges + reminders",
    ],
    cta: null,
    badge: "Most popular",
  },
];

// ── FAQ ───────────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: "Do I need to create an account?",
    a: "No. The Free tier works without any signup — just go through the onboarding and get your results instantly. You only need an account if you upgrade to Starter to save your progress.",
  },
  {
    q: "What happens to my data on the Free tier?",
    a: "Your results are generated in real-time and available during your session. Since nothing is saved, you'll need to re-run the analysis if you close your browser. Upgrade to Starter to save everything.",
  },
  {
    q: "Can I cancel the Starter subscription?",
    a: "Yes, anytime. Monthly subscriptions can be cancelled from your account settings. If you chose the one-time payment, there's nothing to cancel — you own it.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We use Stripe for secure payments. All major credit and debit cards are accepted.",
  },
  {
    q: "How is the CX Score calculated?",
    a: "Your CX Score (0–100) is based on journey coverage, risk severity, moment quality, and improvement over time. It gives you a single number to track whether your customer experience is getting better.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
      >
        <span className="text-sm font-medium text-slate-800">{q}</span>
        <CaretDown
          size={16}
          weight="bold"
          className={`text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="text-sm text-slate-500 pb-4 leading-relaxed animate-in fade-in duration-200">
          {a}
        </p>
      )}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<LoadingKey>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout(priceKey: PriceKey) {
    setLoading(priceKey);
    setError(null);
    try {
      const url = await startCheckout(priceKey);
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-20">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
            Pricing
          </p>
          <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Start free. Upgrade when it clicks.
          </h1>
          <p className="text-base text-slate-500 max-w-xl mx-auto">
            CX Mate gives you a complete journey map, CX report, and playbook for free — no account needed.
            Upgrade to track whether you&apos;re actually improving.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        {/* Tier cards — 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start mb-16">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border p-6 flex flex-col ${
                tier.highlight
                  ? "border-primary ring-2 ring-primary/20 bg-white shadow-lg"
                  : "border-slate-200 bg-white"
              }`}
            >
              {/* Badge */}
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold bg-primary text-white">
                  {tier.badge}
                </div>
              )}

              {/* Name + price */}
              <div className="mb-5">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">
                  {tier.name}
                </h2>
                <p className="text-xs text-primary font-medium mb-3">{tier.idealFor}</p>

                {/* Starter: two price options */}
                {tier.name === "Starter" ? (
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-slate-900">$79</span>
                      <span className="text-sm text-slate-400">/month</span>
                    </div>
                    <p className="text-xs text-slate-400">or $149 one-time payment</p>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-slate-900">{tier.price}</span>
                    {tier.period && (
                      <span className="text-sm text-slate-400">{tier.period}</span>
                    )}
                  </div>
                )}

                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {tier.description}
                </p>
              </div>

              {/* CTA */}
              <div className="mb-6">
                {tier.name === "Starter" && (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleCheckout("starter_monthly")}
                      disabled={loading !== null}
                      className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors"
                    >
                      {loading === "starter_monthly" ? "Redirecting…" : "Subscribe monthly — $79/mo"}
                    </button>
                    <button
                      onClick={() => handleCheckout("starter_onetime")}
                      disabled={loading !== null}
                      className="w-full bg-white hover:bg-slate-50 disabled:opacity-60 text-primary border border-primary/30 text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors"
                    >
                      {loading === "starter_onetime" ? "Redirecting…" : "Pay once — $149"}
                    </button>
                    <p className="text-center text-xs text-slate-400 pt-1">
                      Not sure? Monthly includes cancel anytime.
                    </p>
                  </div>
                )}

                {tier.cta && !tier.name.includes("Starter") && (
                  <Link
                    href={tier.cta.href}
                    className="block text-center text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors bg-slate-100 hover:bg-slate-200 text-slate-700"
                  >
                    {tier.cta.label}
                  </Link>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check size={16} weight="bold" className="text-primary mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-xl mx-auto">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 text-center">
            Frequently asked questions
          </h2>
          <div className="rounded-2xl border border-slate-200 bg-white px-6">
            {FAQ_ITEMS.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>

        {/* Reassurance */}
        <div className="mt-12 text-center space-y-4">
          <p className="text-sm text-slate-500">
            Questions?{" "}
            <a href="mailto:hello@cxmate.ai" className="text-primary hover:underline">
              hello@cxmate.ai
            </a>
          </p>
          <p className="text-xs text-slate-400">
            All payments processed securely by Stripe. Cancel monthly anytime from your account.
          </p>
        </div>

        {/* Back */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.back()}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            ← Back
          </button>
        </div>

      </div>
    </div>
  );
}
