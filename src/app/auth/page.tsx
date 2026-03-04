"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PageLoading } from "@/components/ui/page-loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { track, identify } from "@/lib/analytics";
import { notifyOwner } from "@/lib/notify";

/**
 * Retry wrapper — retries on transient "Failed to fetch" errors.
 * Handles Supabase cold starts and brief network hiccups so users
 * never see a "Connection error" on first try.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function withRetry<T extends { error: any }>(
  fn: () => Promise<T>,
  maxRetries = 2,
  delayMs = 800,
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const result = await fn();
    if (!result.error || result.error.message !== "Failed to fetch") {
      return result;
    }
    // Transient network error — wait and retry
    if (attempt < maxRetries) {
      await new Promise((r) => setTimeout(r, delayMs * (attempt + 1)));
    }
  }
  // All retries exhausted — return last result
  return fn();
}

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const urlError = searchParams.get("error");

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(urlError === "auth_failed" ? "Authentication failed. Please try again." : "");
  const [message, setMessage] = useState("");

  // Stable client — don't recreate on every render
  const supabase = useMemo(() => createClient(), []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await withRetry(() =>
      supabase.auth.signInWithPassword({ email, password })
    );

    if (error) {
      setError(
        error.message === "Failed to fetch"
          ? "Connection error — please check your internet and try again."
          : error.message === "Invalid login credentials"
            ? "Incorrect email or password."
            : error.message
      );
      setLoading(false);
      return;
    }

    if (data.user) {
      identify(data.user.id, { email: data.user.email });
      track("user_logged_in");
    }

    router.push(redirectTo);
    router.refresh();
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await withRetry(() =>
      supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            company_name: companyName || "My Company",
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}`,
        },
      })
    );

    if (error) {
      setError(
        error.message === "Failed to fetch"
          ? "Connection error — please check your internet and try again."
          : error.message
      );
      setLoading(false);
      return;
    }

    track("user_signed_up");
    notifyOwner("user_signed_up", { email, companyName: companyName || undefined });
    setMessage("Check your email for a confirmation link.");
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-3">
            <span className="text-lg font-bold text-primary">CX</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">CX Mate</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your AI CX co-pilot
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-6">
          {/* Mode Toggle */}
          <div className="grid grid-cols-2 gap-1 bg-secondary rounded-xl p-1">
            <button
              onClick={() => {
                setMode("login");
                setError("");
                setMessage("");
              }}
              className={`text-sm py-2 rounded-lg font-medium transition-all duration-200 ${
                mode === "login"
                  ? "bg-white shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Log in
            </button>
            <button
              onClick={() => {
                setMode("signup");
                setError("");
                setMessage("");
              }}
              className={`text-sm py-2 rounded-lg font-medium transition-all duration-200 ${
                mode === "signup"
                  ? "bg-white shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign up
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={mode === "login" ? handleLogin : handleSignup}
            className="space-y-4"
          >
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="companyName">Company name</Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Acme Inc."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="rounded-xl"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            {message && (
              <p className="text-sm text-emerald-600 bg-emerald-50 rounded-xl px-3 py-2">
                {message}
              </p>
            )}

            <Button type="submit" className="w-full rounded-xl" disabled={loading}>
              {loading
                ? "Loading..."
                : mode === "login"
                  ? "Log in"
                  : "Create account"}
            </Button>
          </form>
        </div>

        {/* Skip link */}
        <div className="text-center mt-6">
          <Link
            href="/onboarding"
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Continue without an account &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={<PageLoading />}
    >
      <AuthContent />
    </Suspense>
  );
}
