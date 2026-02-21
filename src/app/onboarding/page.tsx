import Link from "next/link";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-white">
      {/* Minimal branded header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/40">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">CX</span>
            </div>
            <span className="text-sm font-bold tracking-tight text-foreground">CX Mate</span>
          </Link>
        </div>
      </header>

      <div className="flex flex-col items-center px-4 py-12">
        <OnboardingWizard />
      </div>
    </main>
  );
}
