import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Welcome to CX Mate</h1>
        <p className="text-muted-foreground mt-2">
          Let&apos;s map your customer journey in under 5 minutes.
        </p>
      </div>
      <OnboardingWizard />
    </main>
  );
}
