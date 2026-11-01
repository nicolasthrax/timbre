import type { Metadata } from "next";
import { SourceDetail } from "./SourceDetail";
import { PageTransition } from "@/components/PageTransition";

export const metadata: Metadata = { title: "Source" };

export default async function SourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PageTransition>
      <SourceDetail sourceId={id} />
    </PageTransition>
  );
}
