import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-5xl font-bold tracking-tight">
          CX Mate
        </h1>
        <p className="text-xl text-muted-foreground">
          AI-powered customer experience orchestration for B2B startups.
          Map your journey, find meaningful moments, and get actionable
          recommendations — in under 5 minutes.
        </p>
        <Link href="/onboarding">
          <Button size="lg" className="mt-4">
            Get Started
          </Button>
        </Link>
      </div>
    </main>
  );
}
