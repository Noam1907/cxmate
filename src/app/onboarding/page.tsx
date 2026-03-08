// Onboarding entry point — three modes, all preserved:
//
//   /onboarding             → OnboardingChat (conversational, current default)
//   /onboarding?mode=wizard2  → OnboardingChatWizard (new chat-skinned wizard)
//   /onboarding?mode=classic  → OnboardingWizard (original step-based wizard)

import { OnboardingChat } from "@/components/onboarding/onboarding-chat";
import { OnboardingChatWizard } from "@/components/onboarding/onboarding-chat-wizard";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const params = await searchParams;
  const mode = params.mode;

  if (mode === "classic") {
    return (
      <div className="flex flex-col items-center px-8 pt-4 h-[100dvh] overflow-hidden">
        <OnboardingWizard />
      </div>
    );
  }

  if (mode === "wizard2") {
    return (
      <div className="flex flex-col items-center px-8 pt-4 h-[100dvh] overflow-hidden w-full">
        <div className="w-full max-w-4xl flex-1 min-h-0">
          <OnboardingChatWizard />
        </div>
      </div>
    );
  }

  // Default: conversational chat flow
  return (
    <div className="flex flex-col items-center px-8 pt-4 h-[100dvh] overflow-hidden">
      <OnboardingChat />
    </div>
  );
}
