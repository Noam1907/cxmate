"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { Check, CaretDown, Lightning, ArrowRight } from "@phosphor-icons/react";

// ── Freemius config (public, safe for client) ────────────────────────────────

const FS_PRODUCT_ID =
  process.env.NEXT_PUBLIC_FREEMIUS_PRODUCT_ID ?? "25475";
const FS_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_FREEMIUS_PUBLIC_KEY ?? "pk_5c190a759e3cae05ddc73d9ab0610";

const PLANS = {
  full_analysis: { planId: 42170, billingCycle: "lifetime" },
  pro_monthly: { planId: 42172, billingCycle: "monthly" },
} as const;

type PriceKey = keyof typeof PLANS;

// ── Tier configs ──────────────────────────────────────────────────────────────

interface TierConfig {
  name: string;
  tagline: string;
  price: string;
  period: string | null;
  description: string;
  highlight: boolean;
  features: string[];
  badge: string | null;
  priceKey: PriceKey | null;
  ctaLabel: string;
  ctaHref: string | null; // null = checkout, string = nav link
  ctaStyle: "primary" | "outline" | "subtle";
}

const TIERS: TierConfig[] = [
  {
    name: "Free",
    tagline: "See it",
    price: "$0",
    period: "no account needed",
    description:
      "Map your entire customer journey and see where you're losing them. One conversation, zero commitment.",
    highlight: false,
    features: [
      "Complete journey map generation",
      "CX Report — pattern names + severity",
      "Revenue-at-risk estimate",
      "Shareable journey visualization",
    ],
    badge: null,
    priceKey: null,
    ctaLabel: "Map Your Journey",
    ctaHref: "/onboarding",
    ctaStyle: "subtle",
  },
  {
    name: "Full Analysis",
    tagline: "Fix it",
    price: "$149",
    period: "one-time",
    description:
      "The full CX diagnosis — every detail, every recommendation, ready to act on Monday morning.",
    highlight: true,
    features: [
      "Everything in Free",
      "Full CX Report with detailed analysis",
      "Prioritized action playbook",
      "Evidence Wall — quotes & proof",
      "PDF & NotebookLM export",
      "Results saved permanently",
    ],
    badge: "Best value",
    priceKey: "full_analysis",
    ctaLabel: "Get My Full Analysis",
    ctaHref: null,
    ctaStyle: "primary",
  },
  {
    name: "Pro",
    tagline: "Track it",
    price: "$99",
    period: "/month",
    description:
      "Ongoing CX intelligence. Know if you're improving — every month, automatically.",
    highlight: false,
    features: [
      "Everything in Full Analysis",
      "Monthly CX Score (0–100)",
      "Unlimited journey re-runs",
      "G2 & Capterra review mining",
      "HubSpot / Intercom integration",
      "Slack nudges & reminders",
    ],
    badge: null,
    priceKey: "pro_monthly",
    ctaLabel: "Go Pro",
    ctaHref: null,
    ctaStyle: "outline",
  },
];

// ── FAQ ───────────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: "Do I need an account to try CX Mate?",
    a: "No. The free tier works instantly — go through the onboarding conversation and get your journey map and CX report without signing up. You only need an account when you purchase the Full Analysis or go Pro.",
  },
  {
    q: "What do I get on the free tier?",
    a: "You get your complete journey map (20+ stages with meaningful moments and risk flags) plus the CX Report headlines — pattern names, severity levels, and your revenue-at-risk estimate. The full report details, playbook, and PDF export are part of the Full Analysis.",
  },
  {
    q: "Why a one-time purchase instead of a subscription?",
    a: "Because CX Mate delivers a complete analysis — like hiring a CX consultant for one intensive session. You get the full report, the playbook, and the PDF. It's yours forever. No monthly fee for something you might use once a quarter.",
  },
  {
    q: "What does the Pro subscription add?",
    a: "Pro is for teams that want to track whether their CX is improving. You get a monthly CX Score (0–100), unlimited re-runs as your product evolves, review mining from G2 and Capterra, and integrations with your existing tools.",
  },
  {
    q: "Can I upgrade from Full Analysis to Pro later?",
    a: "Yes. If you start with the Full Analysis and decide you want ongoing tracking, you can upgrade to Pro anytime. Your existing analysis and data carry over.",
  },
  {
    q: "What payment methods do you accept?",
    a: "All major credit and debit cards, plus PayPal. Payments are processed securely through Freemius, our certified payment partner.",
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

// ── Freemius checkout type declarations ──────────────────────────────────────

declare global {
  interface Window {
    FS?: {
      Checkout: {
        configure(opts: Record<string, unknown>): {
          open(opts: Record<string, unknown>): void;
          close(): void;
        };
      };
    };
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<PriceKey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fsReady, setFsReady] = useState(false);

  // Initialize Freemius checkout handler
  const openCheckout = useCallback(
    (priceKey: PriceKey) => {
      if (!window.FS) {
        // Fallback: redirect to hosted checkout via our API
        fallbackCheckout(priceKey);
        return;
      }

      const plan = PLANS[priceKey];

      const handler = window.FS.Checkout.configure({
        product_id: FS_PRODUCT_ID,
        plan_id: plan.planId,
        public_key: FS_PUBLIC_KEY,
      });

      setLoading(priceKey);
      setError(null);

      handler.open({
        billing_cycle: plan.billingCycle,
        // Success: user completed purchase
        purchaseCompleted: (data: {
          user?: { email?: string };
          purchase?: {
            license_id?: number;
            plan_id?: number;
            subscription_id?: number;
          };
        }) => {
          // Store purchase info server-side
          fetch("/api/billing/verify-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              license_id: data.purchase?.license_id,
              plan_id: data.purchase?.plan_id,
              subscription_id: data.purchase?.subscription_id,
            }),
          })
            .then(() => {
              router.push("/billing/success");
            })
            .catch(() => {
              // Webhook will handle it — just redirect
              router.push("/billing/success");
            });
        },
        success: () => {
          // Confirmation dialog closed — redirect
          setLoading(null);
          router.push("/billing/success");
        },
        cancel: () => {
          setLoading(null);
        },
      });
    },
    [router]
  );

  async function fallbackCheckout(priceKey: PriceKey) {
    setLoading(priceKey);
    setError(null);
    try {
      const res = await fetch("/api/billing/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceKey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen">
      {/* Load Freemius Checkout JS */}
      <Script
        src="https://checkout.freemius.com/checkout.min.js"
        strategy="afterInteractive"
        onLoad={() => setFsReady(true)}
      />

      <div className="max-w-5xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
            Pricing
          </p>
          <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            See it. Fix it. Track it.
          </h1>
          <p className="text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
            One conversation reveals where you&apos;re losing customers.
            Go deeper when you&apos;re ready — no subscription required.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        {/* Tier cards — 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start mb-20">
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
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold bg-primary text-white whitespace-nowrap">
                  {tier.badge}
                </div>
              )}

              {/* Name + tagline */}
              <div className="mb-5">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-0.5">
                  {tier.name}
                </h2>
                <p className="text-xs text-primary font-medium mb-4">{tier.tagline}</p>

                {/* Price */}
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-900">{tier.price}</span>
                  {tier.period && (
                    <span className="text-sm text-slate-400">{tier.period}</span>
                  )}
                </div>

                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {tier.description}
                </p>
              </div>

              {/* CTA */}
              <div className="mb-6">
                {tier.ctaHref ? (
                  <Link
                    href={tier.ctaHref}
                    className={`flex items-center justify-center gap-2 w-full text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors ${
                      tier.ctaStyle === "subtle"
                        ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        : "bg-primary hover:bg-primary/90 text-white"
                    }`}
                  >
                    {tier.ctaLabel}
                    <ArrowRight size={14} weight="bold" />
                  </Link>
                ) : (
                  <button
                    onClick={() => openCheckout(tier.priceKey!)}
                    disabled={loading !== null}
                    className={`flex items-center justify-center gap-2 w-full disabled:opacity-60 text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors ${
                      tier.ctaStyle === "primary"
                        ? "bg-primary hover:bg-primary/90 text-white"
                        : "bg-white hover:bg-slate-50 text-primary border border-primary/30"
                    }`}
                  >
                    {loading === tier.priceKey ? (
                      "Opening checkout…"
                    ) : (
                      <>
                        {tier.ctaStyle === "primary" && (
                          <Lightning size={14} weight="fill" />
                        )}
                        {tier.ctaLabel}
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2.5 flex-1">
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

        {/* Social proof / trust strip */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Lightning size={14} weight="fill" className="text-primary" />
              Results in minutes, not months
            </span>
            <span className="hidden sm:inline text-slate-200">|</span>
            <span className="hidden sm:flex items-center gap-1.5">
              No implementation required
            </span>
            <span className="hidden sm:inline text-slate-200">|</span>
            <span className="hidden sm:flex items-center gap-1.5">
              Built for B2B startups
            </span>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-xl mx-auto">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 text-center">
            Common questions
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
            Secure payments by Freemius · Cancel Pro anytime · Full Analysis is yours forever
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
