import { Logo } from "@/components/Logo";
import { Waveform } from "@/components/Waveform";

/** Shared layout for 404 and error pages. */
export function ErrorScreen({
  code,
  title,
  body,
  actions,
}: {
  code: string;
  title: string;
  body: string;
  actions: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center px-4 sm:px-6">
        <Logo />
      </header>
      <main id="main" className="flex flex-1 items-center justify-center px-4 pb-20">
        <div className="w-full max-w-md text-center">
          <Waveform bars={36} seed={3} className="mx-auto h-16 max-w-xs opacity-60" />
          <p className="mt-8 tabular-nums text-sm text-accent">{code}</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
          <p className="mt-3 text-muted">{body}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">{actions}</div>
        </div>
      </main>
    </div>
  );
}
