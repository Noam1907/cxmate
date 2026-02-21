import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center py-12 px-4 bg-background">
      <OnboardingWizard />
    </main>
  );
}
