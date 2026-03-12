"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/ui/logo-mark";
import {
  Check,
  MapTrifold,
  Warning,
  Target,
} from "@phosphor-icons/react";

export default function GatePage() {
  // Access code state
  const [password, setPassword] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const router = useRouter();

  // Waitlist state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [waitlistError, setWaitlistError] = useState("");
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  async function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCodeError("");
    setCodeLoading(true);

    try {
      const res = await fetch("/api/gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setCodeError("Invalid code.");
        setPassword("");
      }
    } catch {
      setCodeError("Something went wrong. Try again.");
    } finally {
      setCodeLoading(false);
    }
  }

  async function handleWaitlistSubmit(e: React.FormEvent) {
    e.preventDefault();
    setWaitlistError("");
    setWaitlistLoading(true);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
          referral_source: "gate_page",
        }),
      });

      if (res.ok) {
        setWaitlistSuccess(true);
      } else {
        const data = await res.json();
        setWaitlistError(data.error || "Something went wrong.");
      }
    } catch {
      setWaitlistError("Something went wrong. Try again.");
    } finally {
      setWaitlistLoading(false);
    }
  }

  const valueBullets = [
    {
      icon: MapTrifold,
      title: "Your full journey, mapped",
      desc: "Every stage from first touch to renewal, built around your actual business",
    },
    {
      icon: Warning,
      title: "Revenue risks, named",
      desc: "The specific moments where customers struggle, with evidence, not guesses",
    },
    {
      icon: Target,
      title: "Monday's action plan",
      desc: "What to fix first, how to fix it, and what it's worth when you do",
    },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12 md:px-12 lg:px-20"
      style={{ backgroundColor: "#E8EDE5" }}
    >
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
        {/* LEFT — Messaging */}
        <div>
          {/* Logo + brand */}
          <div className="flex items-center gap-2.5 mb-8">
            <LogoMark size="lg" />
            <span className="text-xl font-bold tracking-tight text-slate-900">
              CX Mate
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-4">
            Your customers hit friction you can&apos;t see{" "}
            <span style={{ color: "#0D9488" }}>until they leave.</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-base text-slate-600 leading-relaxed mb-6">
            You built the product. You closed the deals. But somewhere between
            signup and renewal, something breaks. And by the time you notice,
            they&apos;re already gone. CX Mate finds those moments before your
            customers do.
          </p>

          {/* Value bullets */}
          <div className="space-y-2.5 mb-5">
            {valueBullets.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 px-3 py-2.5"
              >
                <item.icon
                  size={20}
                  weight="duotone"
                  className="mt-0.5 shrink-0"
                  style={{ color: "#0D9488" }}
                />
                <div>
                  <span className="text-sm font-semibold text-slate-800">
                    {item.title}
                  </span>
                  <span className="text-sm text-slate-500">
                    {" "}
                    {item.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* For whom */}
          <p className="text-xs text-slate-500 px-3">
            For B2B teams doing CX on gut feel and good intentions. Until now.
          </p>
        </div>

        {/* RIGHT — Entry */}
        <div className="md:self-center">
          {/* Private Beta badge */}
          <div className="flex justify-center md:justify-start mb-5">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: "#0D948815", color: "#0D9488" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: "#0D9488" }}
              />
              Private Beta
            </div>
          </div>

          {/* Waitlist form / success */}
          {waitlistSuccess ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#0D948820" }}
              >
                <Check size={22} weight="bold" style={{ color: "#0D9488" }} />
              </div>
              <p className="text-lg font-semibold text-slate-900 mb-1">
                You&apos;re in.
              </p>
              <p className="text-sm text-slate-500">
                We&apos;ll reach out with your invite soon.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleWaitlistSubmit}
              className="bg-white rounded-2xl p-6 shadow-sm space-y-3"
            >
              <p className="text-sm font-semibold text-slate-800 mb-1">
                Be first to see your blind spots
              </p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Work email"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all"
              />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company name"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all"
              />

              {waitlistError && (
                <p className="text-sm text-red-600">{waitlistError}</p>
              )}

              <button
                type="submit"
                disabled={waitlistLoading || !name || !email}
                className="w-full px-6 py-3 rounded-xl text-base font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg cursor-pointer"
                style={{ backgroundColor: "#0D9488" }}
              >
                {waitlistLoading ? "Submitting..." : "Get early access"}
              </button>

              <p className="text-xs text-slate-400 text-center pt-1">
                First 50 teams get priority onboarding.
              </p>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-300/60" />
            <span className="text-xs text-slate-400">or</span>
            <div className="flex-1 h-px bg-slate-300/60" />
          </div>

          {/* Access code (secondary) */}
          {showCodeInput ? (
            <form onSubmit={handleCodeSubmit} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter access code"
                  autoFocus
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm text-center placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  disabled={codeLoading || !password}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md cursor-pointer"
                  style={{ backgroundColor: "#0D9488" }}
                >
                  {codeLoading ? "..." : "Enter"}
                </button>
              </div>
              {codeError && (
                <p className="text-xs text-red-600 text-center">{codeError}</p>
              )}
            </form>
          ) : (
            <button
              onClick={() => setShowCodeInput(true)}
              className="w-full text-center text-sm text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              Already have an access code?
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
