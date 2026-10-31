"use client";

import { useSearchParams } from "next/navigation";
import { Banner } from "@/components/Banner";

/** Shown on the landing page after "Delete my data" completes. */
export function DeletedNotice() {
  const params = useSearchParams();
  if (params.get("deleted") !== "1") return null;
  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
      <DeletedBanner />
    </div>
  );
}

export function DeletedBanner() {
  return (
    <Banner tone="success" title="Your data has been deleted">
      Your voiceprint, linked accounts, scans and account are gone. Nothing was kept. You can start again any time.
    </Banner>
  );
}
