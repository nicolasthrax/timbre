import type { Metadata } from "next";
import { ResultsView } from "./ResultsView";

export const metadata: Metadata = { title: "Your results" };

export default function ResultsPage() {
  return <ResultsView />;
}
