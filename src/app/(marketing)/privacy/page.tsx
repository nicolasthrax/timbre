import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { privacySections } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Timbre handles your voiceprint and personal data under Hong Kong's PDPO.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="Your voice is biometric data. This policy explains what we collect, why, how long we keep it, and how you can access or delete it."
      sections={privacySections}
    />
  );
}
