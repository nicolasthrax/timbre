export interface LegalSection {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export const legalDraftNotice =
  "Draft — pending legal review. This placeholder is not yet a binding policy and will be reviewed by a Hong Kong lawyer before launch.";

export const LEGAL_UPDATED = "31 October 2026";

export const privacySections: LegalSection[] = [
  {
    id: "who",
    title: "1. Who we are",
    paragraphs: [
      "Timbre (\"Timbre AI\", \"we\") helps people in Hong Kong see where their voice is publicly exposed online and reduce that exposure. This policy explains how we handle personal data under the Personal Data (Privacy) Ordinance (Cap. 486) (\"PDPO\") and its six Data Protection Principles (DPPs).",
    ],
  },
  {
    id: "purpose",
    title: "2. What we collect and why (DPP1, DPP3)",
    paragraphs: [
      "We collect only what we need to scan public videos for your voice. We will not use your data for any new purpose without your separate, explicit consent.",
    ],
    bullets: [
      "Account details: your email address and sign-in method.",
      "Voiceprint: a numeric representation of your voice, created from a short recording. Voiceprints are biometric data and we treat them as highly sensitive.",
      "Linked accounts: the Instagram, TikTok and YouTube handles and the name you give us for web searches.",
      "Scan results: links to public videos where your voice was found, how many seconds matched and the confidence of each match.",
      "Consent records: the version of the consent you agreed to and when.",
      "Billing status (Pro): handled by our payment provider; we do not store card numbers.",
    ],
  },
  {
    id: "audio",
    title: "3. Raw audio",
    paragraphs: [
      "Recordings you make in Timbre are processed to create a voiceprint and then deleted immediately. Audio fetched from public videos during a scan is processed in memory and deleted after matching. We never use your voice to train AI models.",
      "Other people's voices that appear in scanned videos are analysed only transiently to separate them from yours. We do not store or profile anyone other than you.",
    ],
  },
  {
    id: "retention",
    title: "4. How long we keep data (DPP2)",
    paragraphs: ["We keep personal data only as long as needed for the purpose it was collected."],
    bullets: [
      "Raw audio: deleted immediately after processing.",
      "Voiceprint, linked accounts and scan results: until you delete them, or after 12 months of inactivity.",
      "If a Pro subscription lapses: data is kept for 30 days so you can resume, then deleted unless you renew.",
      "Consent and deletion records: kept as an audit log for as long as required by law.",
    ],
  },
  {
    id: "security",
    title: "5. Security (DPP4)",
    paragraphs: [
      "Data is encrypted in transit and at rest. Access is restricted by row-level security so each user can only read their own records, and staff access is minimal and logged. Clone tests are rate-limited, audit-logged and watermarked.",
    ],
  },
  {
    id: "transfer",
    title: "6. Cross-border transfer",
    paragraphs: [
      "Our database and processing servers are located in Singapore, the nearest available region to Hong Kong. By using Timbre you are informed that your personal data will be transferred to and stored in Singapore. We require our service providers to protect it to a standard comparable to the PDPO.",
    ],
  },
  {
    id: "rights",
    title: "7. Access, correction and deletion (DPP6)",
    paragraphs: [
      "You can export a copy of your data or delete all of it at any time from Settings. Deletion is immediate and covers your voiceprint, linked accounts, scans and account. You can also make a data access or correction request by emailing privacy@timbre.ai; we will respond within 40 days as required by the PDPO.",
    ],
  },
  {
    id: "openness",
    title: "8. Openness and contact (DPP5)",
    paragraphs: [
      "We will keep this policy public and written in plain English, and tell you about material changes before they take effect. Questions or complaints: privacy@timbre.ai. You may also contact the Office of the Privacy Commissioner for Personal Data, Hong Kong.",
    ],
  },
];

export const termsSections: LegalSection[] = [
  {
    id: "service",
    title: "1. The service",
    paragraphs: [
      "Timbre estimates how much of your voice is publicly available on Instagram, TikTok and YouTube and provides guidance to reduce it. Timbre does not detect whether your voice has been cloned, does not screen calls and cannot guarantee that you will not be targeted by scams.",
    ],
  },
  {
    id: "eligibility",
    title: "2. Eligibility and your voice",
    paragraphs: [
      "You must be at least 18 years old. You may only enrol your own voice. Enrolment uses random phrases read live to verify this.",
    ],
  },
  {
    id: "acceptable-use",
    title: "3. Acceptable use",
    paragraphs: ["You agree not to:"],
    bullets: [
      "Enrol, scan or attempt to clone anyone else's voice.",
      "Record, capture or redistribute clone-test audio.",
      "Use takedown drafts to make false or misleading reports.",
      "Attempt to access other users' data or interfere with the service.",
    ],
  },
  {
    id: "clone-test",
    title: "4. Clone test",
    paragraphs: [
      "The clone test is available to Pro users only. It uses a fresh live recording of your own voice and a fixed sentence chosen by us. Generated audio is watermarked, streamed, cannot be downloaded and is deleted at the end of your session. Misuse leads to immediate account termination.",
    ],
  },
  {
    id: "billing",
    title: "5. Subscriptions and billing",
    paragraphs: [
      "Pro costs HK$68 per month or HK$588 per year and renews automatically until cancelled. You can cancel at any time from Settings; access continues until the end of the paid period. If a payment fails, Pro features pause and your data is kept for 30 days.",
    ],
  },
  {
    id: "estimates",
    title: "6. Estimates, not guarantees",
    paragraphs: [
      "Risk scores and matched minutes are estimates produced by automated voice matching and may contain errors. We do not guarantee that we will find every public recording of your voice.",
    ],
  },
  {
    id: "liability",
    title: "7. Liability",
    paragraphs: [
      "To the extent permitted by Hong Kong law, Timbre is not liable for losses arising from scams, impersonation or third-party platforms' decisions on takedown requests.",
    ],
  },
  {
    id: "law",
    title: "8. Governing law",
    paragraphs: ["These terms are governed by the laws of the Hong Kong Special Administrative Region."],
  },
];
