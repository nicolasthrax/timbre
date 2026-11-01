import { Logo } from "@/components/Logo";
import { RequireAuth } from "@/components/RequireAuth";
import { OnboardingSteps } from "./OnboardingSteps";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="chrome-onboarding border-b border-border">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo href="/" />
          <OnboardingSteps />
        </div>
      </header>
      <main id="main" className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
          <RequireAuth>{children}</RequireAuth>
        </div>
      </main>
    </div>
  );
}
