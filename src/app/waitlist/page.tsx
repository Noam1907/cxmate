"use client";

import type { Metadata } from "next";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LogoMark } from "@/components/ui/logo-mark";
import { track } from "@/lib/analytics";

const SAGE = "#E8EDE5";

const REFERRAL_OPTIONS = [
  "LinkedIn",
  "Word of mouth",
  "Google search",
  "Twitter / X",
  "Product Hunt",
  "Newsletter",
  "Other",
];

const ROLE_OPTIONS = [
  "Founder / CEO",
  "COO / Head of Operations",
  "Head of Customer Success",
  "VP / Head of Sales",
  "CRO / Revenue Leader",
  "Product Manager",
  "Other",
];

export default function WaitlistPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    cx_challenge: "",
    referral_source: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      track("waitlist_joined", {
        referral_source: form.referral_source,
        role: form.role,
      });

      setSubmitted(true);
    } catch {
      setError("Connection error. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: SAGE }}>
        <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
          <div className="max-w-xl mx-auto px-6 h-14 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <LogoMark />
              <span className="text-sm font-bold tracking-tight text-slate-900">CX Mate</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-teal-100 border-2 border-teal-300 flex items-center justify-center text-3xl mx-auto mb-6">
              ✓
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-3">
              You&rsquo;re on the list
            </h1>
            <p className="text-slate-600 mb-8 leading-relaxed">
              We&rsquo;ll be in touch with your invite as we onboard the first cohort.
              In the meantime, you can still explore the full product — no account needed.
            </p>
            <Link href="/onboarding">
              <Button
                size="lg"
                className="rounded-xl px-8 py-5 font-bold"
                style={{ backgroundColor: "#0D9488", color: "white" }}
              >
                Try CX Mate Now →
              </Button>
            </Link>
            <p className="text-xs text-slate-400 mt-4">
              Your results will be saved once we send your invite.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: SAGE }}>
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <LogoMark />
            <span className="text-sm font-bold tracking-tight text-slate-900">CX Mate</span>
          </Link>
          <Link href="/onboarding" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
            Try without an account →
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-6 py-12">
        <div className="max-w-xl w-full">
          {/* Hero */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-xs font-semibold text-teal-700">Beta · First cohort</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-tight mb-4">
              Get early access to CX Mate
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              We&rsquo;re onboarding the first cohort of B2B founders and CS leaders.
              Tell us about yourself — we&rsquo;ll send you an invite within 24–48 hours.
            </p>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name + Email */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Your name <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Anat Cohen"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Work email <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>
              </div>

              {/* Company + Role */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="company" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Company
                  </Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Acme Inc."
                    value={form.company}
                    onChange={(e) => update("company", e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="role" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Your role
                  </Label>
                  <select
                    id="role"
                    value={form.role}
                    onChange={(e) => update("role", e.target.value)}
                    className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select role...</option>
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* CX Challenge */}
              <div className="space-y-1.5">
                <Label htmlFor="cx_challenge" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  What&rsquo;s your biggest CX challenge right now?
                </Label>
                <Textarea
                  id="cx_challenge"
                  placeholder="e.g. Customers aren't activating after onboarding, high churn at month 3, can't see where the drop-off is..."
                  value={form.cx_challenge}
                  onChange={(e) => update("cx_challenge", e.target.value)}
                  className="rounded-xl resize-none"
                  rows={3}
                />
                <p className="text-xs text-slate-400">
                  This helps us prioritize what we build. No wrong answers.
                </p>
              </div>

              {/* Referral */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  How did you hear about us?
                </Label>
                <div className="flex flex-wrap gap-2">
                  {REFERRAL_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => update("referral_source", opt)}
                      className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                        form.referral_source === opt
                          ? "border-teal-500 bg-teal-50 text-teal-700"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                  {error}
                </p>
              )}

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full rounded-xl py-5 font-bold text-base"
                style={{ backgroundColor: "#0D9488", color: "white" }}
                disabled={loading}
              >
                {loading ? "Joining..." : "Request Early Access →"}
              </Button>

              <p className="text-xs text-center text-slate-400">
                No credit card. No spam. Just a heads-up when your spot is ready.
              </p>
            </form>
          </div>

          {/* Already have invite? */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an invite code?{" "}
            <Link href="/auth" className="text-teal-600 hover:underline font-medium">
              Sign up here →
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
