import type { Metadata } from "next";
import { ConsentForm } from "./ConsentForm";
import { PageTransition } from "@/components/PageTransition";

export const metadata: Metadata = { title: "Consent" };

export default function ConsentPage() {
  return (
    <PageTransition>
      <ConsentForm />
    </PageTransition>
  );
}
