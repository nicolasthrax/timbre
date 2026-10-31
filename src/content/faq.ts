export interface FaqItem {
  q: string;
  a: string;
}

export const faq: FaqItem[] = [
  {
    q: "Can you tell if my voice was cloned?",
    a: "No — and no one can reliably do that today. Timbre measures exposure: how much of your voice is publicly reachable and where. Less public audio means a clone is harder to make and less convincing.",
  },
  {
    q: "Do you stop scam calls?",
    a: "No. Timbre doesn't screen calls. We help you reduce the raw material scammers need, and we suggest simple habits — like a family safe word — that make clone calls easier to spot.",
  },
  {
    q: "What happens to my recording?",
    a: "It's turned into a voiceprint (a list of numbers) and the audio is deleted immediately. We never keep the recording itself, and the voiceprint can't be played back.",
  },
  {
    q: "What is the risk score?",
    a: "It's an exposure estimate based on how many minutes of your voice we found, how many separate sources there are, and how clean the audio is. It's a guide to help you prioritise — not proof that anything has happened.",
  },
  {
    q: "Which platforms do you scan?",
    a: "Instagram, TikTok and YouTube. We check the accounts you give us and search for reposts and tags that mention your name or handles. We don't access private accounts or messages.",
  },
  {
    q: "Why do I have to read random phrases?",
    a: "It proves the voice belongs to the person using the account. Random phrases stop someone from uploading a recording of you to scan — or clone — your voice.",
  },
  {
    q: "Why are source details hidden on the free plan?",
    a: "The free scan shows how exposed you are. Pro unlocks exactly which videos we found, guided steps to fix them, takedown drafts and weekly monitoring.",
  },
  {
    q: "How do I delete my data?",
    a: "Go to Settings → Delete my data. It removes your voiceprint, scans, linked accounts and account in one step. You can export a copy first.",
  },
];
