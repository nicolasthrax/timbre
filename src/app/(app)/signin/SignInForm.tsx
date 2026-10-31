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

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4">
      <path fill="#E8EAED" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3Z" />
      <path fill="#9AA1AC" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z" />
      <path fill="#6B7280" d="M6.4 14a6 6 0 0 1 0-3.9V7.4H3.1a10 10 0 0 0 0 9.2L6.4 14Z" />
      <path fill="#C4C9D0" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.4L6.4 10C7.2 7.7 9.4 6 12 6Z" />
    </svg>
  );
}

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
        <GoogleGlyph />
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
          className="mt-2 h-12 w-full rounded-lg border border-border bg-surface px-4 text-text placeholder:text-muted/70 focus:border-accent focus:outline-none"
        />
        {error && (
          <p id="email-error" role="alert" className="mt-2 text-sm text-[#ff8a8e]">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" className="mt-4 w-full" disabled={busy !== null}>
          <Mail aria-hidden className="size-4" />
          {busy === "email" ? "Signing in…" : "Email me a sign-in link"}
        </Button>
      </form>

      <p className="mt-6 rounded-lg border border-border bg-surface p-3 text-xs text-muted">
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
