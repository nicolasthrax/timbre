"use client";

import { Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button";
import { useSession } from "@/components/SessionProvider";
import { api, type SignInMethod } from "@/lib/api";
import { resolveHome } from "@/lib/routing";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function SignInForm() {
  const router = useRouter();
  const { setMe } = useSession();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"email" | "google" | null>(null);

  async function signIn(method: SignInMethod) {
    setBusy(method.kind);
    setError(null);
    try {
      // TODO(real): magic link sends an email; the user lands here via the link callback.
      const user = await api.signIn(method);
      setMe(user);
      router.push(await resolveHome(user));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setBusy(null);
    }
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError("Enter a valid email address, like kai@example.com.");
      return;
    }
    void signIn({ kind: "email", email });
  }

  return (
    <div className="mt-8">
      <Button
        variant="secondary"
        size="lg"
        className="w-full"
        onClick={() => signIn({ kind: "google" })}
        disabled={busy !== null}
      >
        {busy === "google" ? "Connecting…" : "Continue with Google"}
      </Button>

      <div className="my-6 flex items-center gap-3 text-xs text-muted" aria-hidden>
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={onSubmit} noValidate>
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "email-error" : undefined}
          placeholder="you@example.com"
          className="mt-2 h-12 w-full rounded-field border border-field bg-surface px-4 text-text placeholder:text-muted focus:border-accent focus:outline-none"
        />
        {error && (
          <p id="email-error" role="alert" className="mt-2 text-sm text-danger">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" className="mt-4 w-full" disabled={busy !== null}>
          <Mail aria-hidden className="size-4" />
          {busy === "email" ? "Signing in…" : "Email me a sign-in link"}
        </Button>
      </form>

      <p className="mt-6 rounded-field border border-border bg-surface p-3 text-xs text-muted">
        Preview build: sign-in is simulated and happens instantly. No email is sent.
      </p>
      <p className="mt-6 text-xs leading-relaxed text-muted">
        By continuing you agree to our{" "}
        <Link href="/terms" className="text-text underline underline-offset-2">Terms</Link> and{" "}
        <Link href="/privacy" className="text-text underline underline-offset-2">Privacy Policy</Link>.
      </p>
    </div>
  );
}
