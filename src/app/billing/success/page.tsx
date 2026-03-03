"use client";

import { useEffect, useState, Suspense, type ReactNode } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FloppyDisk, ChartBar, Shield, SquaresFour, Bell,
  Confetti, Warning,
} from "@phosphor-icons/react";

// ── What's unlocked per plan ───────────────────────────────────────────────

const STARTER_FEATURES: { icon: ReactNode; title: string; description: string }[] = [
  {
    icon: <FloppyDisk size={22} weight="duotone" className="text-primary" />,
    title: "Save & return to your results",
    description: "Your journey map, report, and playbook are saved. Come back any time.",
  },
  {
    icon: <ChartBar size={22} weight="duotone" className="text-primary" />,
    title: "Monthly CX Score (0–100)",
    description: "Track whether your customer experience is actually improving month over month.",
  },
  {
    icon: <Shield size={22} weight="duotone" className="text-primary" />,
    title: "Revenue Protected counter",
    description: "See the revenue at risk — and the revenue you're protecting as you improve.",
  },
  {
    icon: <SquaresFour size={22} weight="duotone" className="text-primary" />,
    title: "Evidence Wall",
    description: "Collect and organise real customer signals that back every recommendation.",
  },
  {
    icon: <Bell size={22} weight="duotone" className="text-primary" />,
    title: "Slack nudges & reminders",
    description: "We'll remind you when it's time to re-run your CX Pulse. No more \"we'll do this later.\"",
  },
];

// ── Component ─────────────────────────────────────────────────────────────

function BillingSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [planLabel, setPlanLabel] = useState("Starter");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    // Verify the session and activate the plan via our webhook
    // (webhook already updated the DB; this just confirms the UI state)
    const verify = async () => {
      try {
        const res = await fetch(`/api/billing/verify-session?session_id=${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.planTier) {
            setPlanLabel(
              data.planTier.charAt(0).toUpperCase() + data.planTier.slice(1)
            );
          }
          setStatus("success");
        } else {
          // Even if verify fails, show success — webhook handled the DB update
          setStatus("success");
        }
      } catch {
        // Network error — still show success (webhook is the source of truth)
        setStatus("success");
      }
    };

    verify();
  }, [sessionId]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500">Activating your plan…</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-4">
          <Warning size={48} weight="duotone" className="text-amber-500 mx-auto" />
          <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
          <p className="text-sm text-slate-500">
            We couldn&apos;t confirm your payment. If you were charged, don&apos;t worry —{" "}
            <a
              href="mailto:hello@cxmate.ai?subject=Billing issue"
              className="text-primary hover:underline"
            >
              contact us
            </a>{" "}
            and we&apos;ll sort it out immediately.
          </p>
          <Link
            href="/pricing"
            className="inline-block text-sm text-slate-400 hover:text-slate-600"
          >
            ← Back to pricing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-20">

        {/* Hero */}
        <div className="text-center mb-14">
          <Confetti size={56} weight="duotone" className="text-primary mx-auto mb-6" />
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-5">
            <span className="w-2 h-2 rounded-full bg-primary/100 inline-block" />
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">
              {planLabel} activated
            </span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            You&apos;re on CX Mate {planLabel}.
          </h1>
          <p className="text-base text-slate-500 max-w-md mx-auto">
            Your results are now saved. You can come back, track your progress,
            and see your CX Score improve over time.
          </p>
        </div>

        {/* What's unlocked */}
        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-7 mb-10">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">
            What&apos;s now unlocked
          </p>
          <ul className="space-y-4">
            {STARTER_FEATURES.map((feature) => (
              <li key={feature.title} className="flex items-start gap-3.5">
                <span className="shrink-0 mt-0.5">{feature.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{feature.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-3">
          <Link
            href="/dashboard"
            className="w-full max-w-xs bg-primary hover:bg-primary/90 text-white text-sm font-semibold py-3 px-6 rounded-xl transition-colors text-center"
          >
            Go to Dashboard →
          </Link>
          <button
            onClick={() => router.back()}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            ← Back
          </button>
        </div>

        {/* Reassurance footer */}
        <div className="mt-14 text-center space-y-2">
          <p className="text-xs text-slate-400">
            A receipt has been sent to your email by Stripe.
          </p>
          <p className="text-xs text-slate-400">
            Questions?{" "}
            <a
              href="mailto:hello@cxmate.ai"
              className="text-primary hover:underline"
            >
              hello@cxmate.ai
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}

// ── Page export (Suspense required for useSearchParams) ────────────────────

export default function BillingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <BillingSuccessContent />
    </Suspense>
  );
}
