"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Recorder } from "@/components/Recorder";
import { useSession } from "@/components/SessionProvider";
import { api } from "@/lib/api";

const MIN_ENROL_SECONDS = 15;

export function EnrolClient({ phrases }: { phrases: string[] }) {
  const router = useRouter();
  const { me } = useSession();

  useEffect(() => {
    if (me && !me.consentAt) router.replace("/onboarding/consent");
  }, [me, router]);

  async function enrol(audio: Blob) {
    await api.enrolVoice(audio);
    router.push("/onboarding/accounts", { transitionTypes: ["nav-forward"] });
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Record your voice</h1>
      <p className="mt-2 text-muted">
        Read the three phrases below out loud. They&apos;re random each time, which proves the voice is yours.
        Find a quiet spot. It takes about 20 seconds.
      </p>
      <div className="mt-8">
        <Recorder phrases={phrases} minSeconds={MIN_ENROL_SECONDS} submitLabel="Create voiceprint" onComplete={enrol} />
      </div>
    </div>
  );
}
