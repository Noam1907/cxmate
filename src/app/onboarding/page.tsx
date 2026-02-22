import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default function OnboardingPage() {
  return (
    <div className="flex flex-col items-center px-8 py-12 min-h-[calc(100vh-3.5rem)]">
      <OnboardingWizard />
    </div>
  );
}
