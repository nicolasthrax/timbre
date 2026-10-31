export const hero = {
  eyebrow: "Personal voice security",
  headline: "How much of your voice is out there?",
  subline:
    "AI can clone a voice from a few seconds of audio. Scammers use those clones to call your family. Timbre shows where your voice is publicly exposed — and helps you reduce it.",
  cta: "Scan my voice — free",
  secondaryCta: "How it works",
  footnote: "Free scan · No card needed · Raw audio never stored",
};

export const sampleResult = {
  minutes: 47,
  videos: 12,
  caption: "Example result",
  line: "We found 47 minutes of your voice in 12 public videos.",
};

export const steps = [
  {
    title: "Record",
    body: "Read three short phrases aloud in your browser. We turn them into a voiceprint — a set of numbers, not a recording.",
  },
  {
    title: "Scan",
    body: "We check public videos on the Instagram, TikTok and YouTube accounts you give us, plus reposts that mention your name or handles.",
  },
  {
    title: "See & fix",
    body: "See how many minutes of your voice are public and where. Then follow guided steps to make them private or request takedowns.",
  },
];

export const founder = {
  heading: "Why we built this",
  quote:
    "My grandparents got a call from a voice that sounded exactly like me, saying I'd been kidnapped and needed ransom. It was an AI clone. They only avoided paying because they managed to reach me directly.",
  body: [
    "I still don't know which of my videos the scammers used. That's the problem: most of us have no idea how much of our voice is public, or who could reuse it.",
    "Timbre is the tool I wish my family had had. It won't stop every scam call — but it shows you where your voice is exposed, so you can shrink it and warn the people you love.",
  ],
  name: "Nicolas Fostier",
  role: "Founder, Timbre",
};

export const platformsSection = {
  heading: "What we look for",
  intro: "Public videos where your voice can be heard clearly — the raw material for a voice clone.",
  platforms: [
    {
      platform: "instagram" as const,
      title: "Instagram",
      body: "Public Reels and videos on your account, and reposts or tags by other accounts.",
    },
    {
      platform: "tiktok" as const,
      title: "TikTok",
      body: "Your public videos and duets, stitches or reuploads by others.",
    },
    {
      platform: "youtube" as const,
      title: "YouTube",
      body: "Videos and Shorts on your channel, and appearances on other channels.",
    },
  ],
};

export const privacyPromise = {
  heading: "Your voice stays yours",
  intro: "We built Timbre around one rule: hold as little of your voice as possible.",
  points: [
    {
      title: "Raw audio deleted",
      body: "Your recording is processed and deleted straight away. We never keep the audio itself.",
    },
    {
      title: "Only a voiceprint is kept",
      body: "We keep a numeric voiceprint used only to match your voice in your own scans. It can't be played back.",
    },
    {
      title: "Delete anytime",
      body: "One button in Settings deletes your voiceprint, scans and account. No email to send, no waiting.",
    },
    {
      title: "Never used for training",
      body: "Your voice data is never used to train models or for anything beyond your own scans.",
    },
  ],
};

export const finalCta = {
  heading: "Find out in under five minutes.",
  body: "One free scan shows how many minutes of your voice are public and how exposed you are.",
};
