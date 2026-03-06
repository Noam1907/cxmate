// Onboarding entry point.
// Production: using OnboardingWizard (stable).
// Chat flow (OnboardingChat) is in preview — swap imports below when ready to ship.

// import { OnboardingChat } from "@/components/onboarding/onboarding-chat";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default function OnboardingPage() {
  return (
    <div className="flex flex-col items-center px-8 py-12 min-h-[calc(100vh-3.5rem)]">
      {/* <OnboardingChat /> */}
      <OnboardingWizard />
    </div>
  );
}
