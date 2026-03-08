// Onboarding entry point.
// ?mode=wizard2 → new chat-skinned wizard (preview, dev only)
// Default → conversational chat flow (OnboardingChat)
// The original step-based wizard (OnboardingWizard) is preserved in
// src/components/onboarding/onboarding-wizard.tsx

import { OnboardingChat } from "@/components/onboarding/onboarding-chat";
import { OnboardingChatWizard } from "@/components/onboarding/onboarding-chat-wizard";
// import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const params = await searchParams;
  const useNewWizard = params.mode === "wizard2";

  return (
    <div className={`flex flex-col items-center px-8 pt-4 h-[100dvh] overflow-hidden ${useNewWizard ? "w-full" : ""}`}>
      <div className={useNewWizard ? "w-full max-w-4xl flex-1 min-h-0" : "contents"}>
        {useNewWizard ? <OnboardingChatWizard /> : <OnboardingChat />}
      </div>
      {/* <OnboardingWizard /> */}
    </div>
  );
}
