"use client";

import { AtSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button";
import { useSession } from "@/components/SessionProvider";
import { api, type Platform } from "@/lib/api";
import { PLATFORMS, handleHint, handlePattern, normaliseHandle, platformLabel } from "@/lib/platforms";

type Values = Record<Platform | "fullName", string>;

export function AccountsForm() {
  const router = useRouter();
  const { refresh } = useSession();
  const [values, setValues] = useState<Values>({ instagram: "", tiktok: "", youtube: "", fullName: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Values | "form", string>>>({});
  const [busy, setBusy] = useState(false);

  function validate(): boolean {
    const next: typeof errors = {};
    for (const p of PLATFORMS) {
      const handle = normaliseHandle(values[p]);
      if (handle && !handlePattern[p].test(handle)) next[p] = `That doesn't look like a ${platformLabel[p]} handle. ${handleHint[p]}`;
    }
    const name = values.fullName.trim();
    if (name && (name.length < 2 || name.length > 80)) next.fullName = "Enter your name as it appears online (2–80 characters).";
    const anything = PLATFORMS.some((p) => normaliseHandle(values[p])) || name;
    if (!anything) next.form = "Add at least one account or your full name so we know where to look.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;
    setBusy(true);
    try {
      await api.setAccounts({
        fullName: values.fullName.trim() || null,
        accounts: PLATFORMS.filter((p) => normaliseHandle(values[p])).map((p) => ({
          platform: p,
          handle: normaliseHandle(values[p]),
        })),
      });
      await refresh();
      const scan = await api.startScan();
      router.push(`/scan/${scan.id}`);
    } catch (e) {
      setErrors({ form: e instanceof Error ? e.message : "Something went wrong." });
      setBusy(false);
    }
  }

  const field = (key: keyof Values, label: string, placeholder: string, hint: string) => (
    <div>
      <label htmlFor={key} className="flex items-center gap-2 text-sm font-medium">
        {label}
        <span className="font-normal text-muted">(optional)</span>
      </label>
      <div className="relative mt-2">
        {key !== "fullName" && (
          <AtSign aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
        )}
        <input
          id={key}
          name={key}
          value={values[key]}
          onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
          autoComplete={key === "fullName" ? "name" : "off"}
          autoCapitalize={key === "fullName" ? "words" : "none"}
          spellCheck={false}
          placeholder={placeholder}
          aria-invalid={errors[key] ? true : undefined}
          aria-describedby={`${key}-hint`}
          className={`h-12 w-full rounded-field border bg-surface pr-4 text-text placeholder:text-muted focus:border-accent focus:outline-none ${key === "fullName" ? "pl-4" : "pl-9"} ${errors[key] ? "border-danger/60" : "border-field"}`}
        />
      </div>
      <p id={`${key}-hint`} className={`mt-1.5 text-xs ${errors[key] ? "text-danger" : "text-muted"}`}>
        {errors[key] ?? hint}
      </p>
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Where should we look?</h1>
      <p className="mt-2 text-muted">
        Add your public accounts. We also search for reposts and tags that mention your name. Fill in at least one.
      </p>

      <div className="mt-8 space-y-5 rounded-card border border-border bg-surface p-5 sm:p-6">
        {field("instagram", "Instagram", "yourhandle", handleHint.instagram)}
        {field("tiktok", "TikTok", "yourhandle", handleHint.tiktok)}
        {field("youtube", "YouTube", "yourchannel", handleHint.youtube)}
        <div className="border-t border-border pt-5">
          {field("fullName", "Full name", "Kai Chan", "Used only to search for public reposts and tags of you.")}
        </div>
      </div>

      {errors.form && (
        <p role="alert" className="mt-4 text-sm text-danger">
          {errors.form}
        </p>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">We only read public content. Private accounts stay private.</p>
        <Button type="submit" size="lg" disabled={busy}>
          {busy ? "Starting scan…" : "Start my scan"}
        </Button>
      </div>
    </form>
  );
}
