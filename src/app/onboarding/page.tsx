// Onboarding entry point — three modes, all preserved:
//
//   /onboarding             → OnboardingChatWizard (chat-skinned wizard, current default)
//   /onboarding?mode=classic  → OnboardingWizard (original step-based wizard)
//   /onboarding?mode=chat     → OnboardingChat (old conversational chat — kept for reference)

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

  if (mode === "chat") {
    return (
      <div className="flex flex-col items-center px-8 pt-4 h-[100dvh] overflow-hidden">
        <OnboardingChat />
      </div>
    );
  }

  // Default: chat-skinned wizard (structured data + chat visual identity)
  return (
    <div className="flex flex-col items-center px-8 pt-4 h-[100dvh] overflow-hidden w-full">
      <div className="w-full max-w-5xl flex-1 min-h-0">
        <OnboardingChatWizard />
      </div>
    </div>
  );
}
