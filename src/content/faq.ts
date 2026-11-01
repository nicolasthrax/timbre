export interface FaqItem {
  q: string;
  a: string;
}

export const faq: FaqItem[] = [
  {
    q: "Can Timbre tell if my voice has been cloned?",
    a: "No, and no one can reliably do that today. Timbre lets you hear how convincing a clone of your voice is, shows how much of your voice is public on YouTube, and helps you reduce it.",
  },
  {
    q: "Do you stop scam calls?",
    a: "No. Timbre doesn't screen calls. It helps you and your family get ready: a code word a clone can't know, and the habit of hanging up and calling back.",
  },
  {
    q: "What happens to my recording?",
    a: "We use it once, to check you read the right sentences in a live voice and to make your clone. Then it's deleted. We don't keep a voiceprint or any copy of your voice.",
  },
  {
    q: "Can I download or share the clone?",
    a: "We don't offer the clip as a download, and it's watermarked. You can share a card saying you tried Timbre. The card has no audio in it.",
  },
  {
    q: "Why do I have to read random sentences?",
    a: "They prove the voice is yours and live. A recording of someone else won't contain the sentences we ask for, so nobody can clone another person through Timbre.",
  },
  {
    q: "What do you check on YouTube?",
    a: "With your permission, we list the public videos on your own channel and how long they are, and you tell us which ones you speak in. We never download your videos or post anything, and you can disconnect at any time.",
  },
  {
    q: "What about TikTok and Instagram?",
    a: "We don't connect to them yet. The checklist shows what to check there yourself.",
  },
  {
    q: "Is it free?",
    a: "Yes. There's no paid plan.",
  },
  {
    q: "How do I delete my data?",
    a: "Go to Settings, then Delete my data. It removes your account, results and YouTube connection in one step. You can export a copy first.",
  },
];
