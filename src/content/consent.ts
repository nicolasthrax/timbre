export const CONSENT_VERSION = "2026-10-v2";

export const consentCopy = {
  title: "Before you record your voice",
  intro: "Here's exactly what happens to your recording. Plain English, no small print.",
  stored: [
    {
      title: "What we record",
      body: "About 15 seconds of you reading random sentences aloud in this browser.",
    },
    {
      title: "What it's used for",
      body: "To check it's a live voice reading the right sentences, then to make one clone of your voice saying a sentence we chose.",
    },
    {
      title: "Who handles it, and for how long",
      body: "Our servers and our clone provider. Your recording is deleted as soon as the clone is made, and the clone is deleted when you leave the page.",
    },
    {
      title: "No voiceprint",
      body: "We don't keep a model, fingerprint or copy of your voice, and it's never used to train AI.",
    },
    {
      title: "YouTube is optional",
      body: "If you connect your channel later, we read your public videos' titles and lengths only. You can disconnect at any time.",
    },
    {
      title: "Delete anytime",
      body: "Your account details are stored in Singapore, encrypted. You can export or delete everything from Settings.",
    },
  ],
  checkbox:
    "I agree that Timbre may record my voice to make a clone as described above, and delete the recording and the clone afterwards.",
  cta: "Agree and continue",
};
