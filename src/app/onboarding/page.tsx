import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default function OnboardingPage() {
  return (
    <div className="flex flex-col items-center px-4 py-12 min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-background via-white to-background/50">
      <OnboardingWizard />
    </div>
  );
}
