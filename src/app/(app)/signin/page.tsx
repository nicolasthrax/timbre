import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { PageTransition } from "@/components/PageTransition";
import { SignInForm } from "./SignInForm";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center px-4 sm:px-6">
        <Logo />
      </header>
      <main id="main" className="flex flex-1 items-start justify-center px-4 pb-16 pt-8 sm:items-center sm:pt-0">
        <PageTransition>
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-semibold tracking-tight">Sign in to Timbre</h1>
            <p className="mt-2 text-sm text-muted">No password. We&apos;ll email you a secure sign-in link.</p>
            <SignInForm />
          </div>
        </PageTransition>
      </main>
    </div>
  );
}
