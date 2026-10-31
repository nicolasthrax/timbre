export const hero = {
  headline: "How much of your voice is out there?",
  subline:
    "AI can copy a voice from a few seconds of audio, and scammers use those copies to call families. Timbre shows where your voice is public on Instagram, TikTok and YouTube, and helps you take it down.",
  // The brief fixes this wording, including the dash.
  cta: "Scan my voice — free",
  reassurance: "Free scan. No card needed. Raw audio is never stored.",
};

/** Example scan shown in the hero. Always labelled as an example. */
export const exampleScan = {
  line: "We found 47 minutes of your voice in 12 public videos.",
  found: [
    { range: [0.08, 0.2] as [number, number], where: "Instagram Reel", detail: "Posted by you, 2 min 10 sec" },
    { range: [0.44, 0.5] as [number, number], where: "TikTok repost", detail: "Posted by a friend, 48 sec" },
    { range: [0.7, 0.9] as [number, number], where: "YouTube vlog", detail: "Posted by you, 6 min 2 sec" },
  ],
};

export const steps = {
  heading: "How a scan works",
  items: [
    {
      title: "Record three phrases",
      body: "Read three short phrases aloud in your browser. We turn them into a voiceprint, which is a list of numbers and not a recording.",
    },
    {
      title: "We check public videos",
      body: "We look at the Instagram, TikTok and YouTube accounts you give us, and search for reposts that mention your name or handles.",
    },
    {
      title: "See where, then fix it",
      body: "You see how many minutes of your voice are public and where. Pro gives step-by-step instructions to make each video private or ask for it to be taken down.",
    },
  ],
};

export const founder = {
  heading: "Why Timbre exists",
  quote:
    "My grandparents got a call from a voice that sounded exactly like me, saying I'd been kidnapped and needed ransom. It was an AI clone. They only avoided paying because they managed to reach me directly.",
  body: [
    "I still don't know which of my videos the scammers used. Most of us have no idea how much of our voice is public, or who could reuse it.",
    "Timbre won't stop every scam call. It shows you where your voice is exposed, so you can shrink it and warn the people you love.",
  ],
  name: "Nicolas Fostier",
  role: "founder of Timbre",
};

export const platformsSection = {
  heading: "What we look for",
  intro: "Public videos where your voice can be heard clearly. That audio is what a voice clone is built from.",
  platforms: [
    { title: "Instagram", body: "Public Reels and videos on your account, plus reposts and tags by other accounts." },
    { title: "TikTok", body: "Your public videos, and duets, stitches or reuploads by other people." },
    { title: "YouTube", body: "Videos and Shorts on your channel, and appearances on other channels." },
  ],
  note: "We only look at public content. We never access private accounts, messages or anything behind a login.",
};

export const privacyPromise = {
  heading: "What we keep, and what we delete",
  points: [
    {
      title: "Your recording is deleted",
      body: "It's processed once to make your voiceprint, then deleted. We never keep the audio itself.",
    },
    {
      title: "We keep a voiceprint",
      body: "A list of numbers used only to match your voice in your own scans. It can't be played back.",
    },
    {
      title: "Delete it all from Settings",
      body: "One button removes your voiceprint, scans and account. There's no email to send and no waiting period.",
    },
    {
      title: "Never used to train AI",
      body: "Your voice data is only used for your own scans.",
    },
  ],
};

export const pricingSection = {
  heading: "Pricing",
  intro: "The first scan is free. Pro shows which videos we found and helps you remove them.",
};

export const finalCta = {
  heading: "See your result in about five minutes.",
  body: "One free scan shows how many minutes of your voice are public and how exposed you are.",
};
