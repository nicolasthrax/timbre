export const CONSENT_VERSION = "2026-10-v1";

export const consentCopy = {
  title: "Before we record your voice",
  intro: "Here's exactly what Timbre stores and why. Plain English, no small print.",
  stored: [
    {
      title: "A voiceprint, not a recording",
      body: "We convert your recording into a voiceprint: a list of numbers that describes how your voice sounds. It can't be played back or turned back into audio.",
    },
    {
      title: "Raw audio is deleted",
      body: "Your recording is used once to make the voiceprint, then deleted. In this preview it never even leaves your browser.",
    },
    {
      title: "Used only for your scans",
      body: "Your voiceprint is only compared against public videos in your own scans. It is never used to train AI models or shared.",
    },
    {
      title: "Stored in Singapore",
      body: "Data is stored on servers in Singapore (the nearest region to Hong Kong), encrypted at rest and in transit.",
    },
    {
      title: "Delete anytime",
      body: "You can export or delete everything from Settings. We also delete it after 12 months of inactivity.",
    },
  ],
  checkbox:
    "I agree that Timbre may create and store a voiceprint from my recording to scan public videos for my voice, as described above.",
  cta: "Agree and continue",
};
