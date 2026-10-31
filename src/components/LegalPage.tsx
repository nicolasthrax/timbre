import { FileWarning } from "lucide-react";
import { LEGAL_UPDATED, legalDraftNotice, type LegalSection } from "@/content/legal";

export function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: LegalSection[] }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div role="note" className="flex gap-3 rounded-card border border-warn/40 bg-warn/5 p-4 text-sm">
        <FileWarning aria-hidden className="mt-0.5 size-5 shrink-0 text-warn" />
        <p>
          <strong className="font-medium text-text">Draft. </strong>
          <span className="text-muted">{legalDraftNotice}</span>
        </p>
      </div>
      <h1 className="mt-10 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-2 tabular-nums text-xs text-muted">Last updated {LEGAL_UPDATED}</p>
      <p className="mt-6 leading-relaxed text-muted">{intro}</p>

      <nav aria-label="Contents" className="mt-8 rounded-card border border-border bg-surface p-5">
        <p className="text-sm font-bold">Contents</p>
        <ol className="mt-3 space-y-1.5 text-sm">
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-text hover:text-accent">
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-10 space-y-10">
        {sections.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-24">
            <h2 className="text-xl font-semibold">{s.title}</h2>
            {s.paragraphs.map((p) => (
              <p key={p} className="mt-3 leading-relaxed text-muted">
                {p}
              </p>
            ))}
            {s.bullets && (
              <ul className="mt-3 list-disc space-y-2 pl-5 text-muted marker:text-border">
                {s.bullets.map((b) => (
                  <li key={b} className="leading-relaxed">
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
