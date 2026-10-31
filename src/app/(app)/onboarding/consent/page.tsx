import type { Metadata } from "next";
import { ConsentForm } from "./ConsentForm";

export const metadata: Metadata = { title: "Consent" };

export default function ConsentPage() {
  return <ConsentForm />;
}
