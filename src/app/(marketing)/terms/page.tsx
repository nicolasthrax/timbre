import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { termsSections } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms for using Timbre, including acceptable use and clone-test safeguards.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="These terms explain what Timbre does and doesn't do, and the rules that keep the service safe for everyone."
      sections={termsSections}
    />
  );
}
