import type { Metadata } from "next";
import { ScanProgress } from "./ScanProgress";
import { PageTransition } from "@/components/PageTransition";

export const metadata: Metadata = { title: "Scanning" };

export default async function ScanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PageTransition>
      <ScanProgress scanId={id} />
    </PageTransition>
  );
}
