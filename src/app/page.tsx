import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
          <span className="text-2xl font-bold text-primary">CX</span>
        </div>
        <h1 className="text-5xl font-bold tracking-tight">
          CX Mate
        </h1>
        <p className="text-xl text-muted-foreground">
          Your AI-powered CX co-pilot.
          Map your customer journey, find the moments that matter,
          and get a playbook your team can execute — in under 5 minutes.
        </p>
        <Link href="/onboarding">
          <Button size="lg" className="mt-4">
            Let&apos;s Map Your Journey
          </Button>
        </Link>
        <p className="text-sm text-muted-foreground">
          Free to try. No account required.
        </p>
      </div>
    </main>
  );
}
