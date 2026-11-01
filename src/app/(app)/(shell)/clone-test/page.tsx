import type { Metadata } from "next";
import { connection } from "next/server";
import { pickPhrases } from "@/content/phrases";
import { CloneTestView } from "./CloneTestView";
import { PageTransition } from "@/components/PageTransition";

export const metadata: Metadata = { title: "Clone test" };

export default async function CloneTestPage() {
  await connection();
  return (
    <PageTransition>
      <CloneTestView phrase={pickPhrases(1)[0]} />
    </PageTransition>
  );
}
