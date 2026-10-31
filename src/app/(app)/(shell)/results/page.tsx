import type { Metadata } from "next";
import { ResultsView } from "./ResultsView";
import { PageTransition } from "@/components/PageTransition";

export const metadata: Metadata = { title: "Your results" };

export default function ResultsPage() {
  return (
    <PageTransition>
      <ResultsView />
    </PageTransition>
  );
}
