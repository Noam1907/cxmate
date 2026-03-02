"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

// ── Tier configs ──────────────────────────────────────────────────────────────

const TIERS = [
  {
    name: "Free",
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
    price: null, // renders two options
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
    cta: null, // rendered separately as two buttons
    badge: "Most popular",
  },
  {
    name: "Pro",
    price: "$199",
    period: "/month",
    description: "Real data, competitive intelligence, and board-ready reporting.",
    highlight: false,
    features: [
      "Everything in Starter",
      "Monthly Pulse delta (before/after)",
      "HubSpot + Intercom integration",
      "Competitive CX monitoring",
      "AI stack recommendations",
      "CX Simulations",
    ],
    cta: { label: "Join waitlist →", href: "mailto:hello@cxmate.ai?subject=Pro waitlist", external: true },
    badge: "Coming soon",
  },
  {
    name: "Premium",
    price: "$1,200",
    period: "/year",
    description: "Organisation-wide CX intelligence with board-ready deliverables.",
    highlight: false,
    features: [
      "Everything in Pro",
      "Board Deck generator",
      "Multi-seat access",
      "QBR reports",
      "CRM write-back",
      "CX Mate MCP Server",
    ],
    cta: { label: "Contact us →", href: "mailto:hello@cxmate.ai?subject=Premium inquiry", external: true },
    badge: null,
  },
];

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
        window.location.href = url; // redirect to Stripe Checkout
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-20">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-3">
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

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border p-6 flex flex-col ${
                tier.highlight
                  ? "border-teal-500 ring-2 ring-teal-500/20 bg-white shadow-lg"
                  : "border-slate-200 bg-white"
              }`}
            >
              {/* Badge */}
              {tier.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[11px] font-semibold ${
                  tier.highlight
                    ? "bg-teal-600 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}>
                  {tier.badge}
                </div>
              )}

              {/* Name + price */}
              <div className="mb-5">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  {tier.name}
                </h2>

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
                {/* Starter: two buttons */}
                {tier.name === "Starter" && (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleCheckout("starter_monthly")}
                      disabled={loading !== null}
                      className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors"
                    >
                      {loading === "starter_monthly" ? "Redirecting…" : "Subscribe monthly — $79/mo"}
                    </button>
                    <button
                      onClick={() => handleCheckout("starter_onetime")}
                      disabled={loading !== null}
                      className="w-full bg-white hover:bg-slate-50 disabled:opacity-60 text-teal-700 border border-teal-300 text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors"
                    >
                      {loading === "starter_onetime" ? "Redirecting…" : "Pay once — $149"}
                    </button>
                    <p className="text-center text-[10px] text-slate-400 pt-1">
                      Not sure? Monthly includes cancel anytime.
                    </p>
                  </div>
                )}

                {/* Other tiers: single CTA */}
                {tier.cta && !tier.name.includes("Starter") && (
                  tier.cta.external ? (
                    <a
                      href={tier.cta.href}
                      className={`block text-center text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors ${
                        tier.highlight
                          ? "bg-teal-600 hover:bg-teal-700 text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      {tier.cta.label}
                    </a>
                  ) : (
                    <Link
                      href={tier.cta.href}
                      className={`block text-center text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors ${
                        tier.highlight
                          ? "bg-teal-600 hover:bg-teal-700 text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      {tier.cta.label}
                    </Link>
                  )
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-teal-500 mt-0.5 shrink-0">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ / reassurance */}
        <div className="mt-16 text-center space-y-4">
          <p className="text-sm text-slate-500">
            Questions?{" "}
            <a href="mailto:hello@cxmate.ai" className="text-teal-600 hover:underline">
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
