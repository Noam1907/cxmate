// Onboarding entry point.
// Currently using the conversational chat flow (OnboardingChat).
// The original step-based wizard (OnboardingWizard) is preserved in
// src/components/onboarding/onboarding-wizard.tsx — swap the import below to revert.

import { OnboardingChat } from "@/components/onboarding/onboarding-chat";
// import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default function OnboardingPage() {
  return (
    <div className="flex flex-col items-center px-8 py-12 min-h-[calc(100vh-3.5rem)]">
      <OnboardingChat />
      {/* <OnboardingWizard /> */}
    </div>
  );
}
