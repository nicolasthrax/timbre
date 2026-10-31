export const hero = {
  headline: "Hear an AI clone of your own voice",
  subheading: "Your voice can be copied in seconds. Hear it for yourself.",
  subline:
    "Read a few sentences aloud and Timbre makes a short clone of your voice, so you can hear what a scammer could do with the videos you've posted. Then see what's public on your YouTube channel and what to change.",
  cta: "Hear my clone",
  reassurance: "Free. About two minutes. Your recording is deleted as soon as the clone is made.",
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
  heading: "How it works",
  items: [
    {
      title: "Read a few random sentences",
      body: "About 15 seconds, in your browser. The sentences change every time, which proves it's your live voice and stops anyone cloning someone else through Timbre.",
    },
    {
      title: "Hear your clone",
      body: "We play a clone of your voice saying one sentence we chose, next to your real recording. It's watermarked and not offered as a download.",
    },
    {
      title: "Check your YouTube and fix it",
      body: "Connect your channel to see which public videos have your voice, then work through a short checklist that makes you harder to fake.",
    },
  ],
};

export const founder = {
  heading: "Why Timbre exists",
  quote:
    "My grandparents got a call from a voice that sounded exactly like me, saying I'd been kidnapped and needed ransom. It was an AI clone. They only avoided paying because they managed to reach me directly.",
  body: [
    "I still don't know which of my videos the scammers used. Most of us have no idea how much of our voice is public, or who could reuse it.",
    "Timbre won't stop every scam call. It lets you hear how easily your voice can be copied, shows where it's public, and helps you warn the people you love.",
  ],
  name: "Nicolas Fostier",
  role: "founder of Timbre",
};

/** Founder's framing (.plans/pivot-review.md decision 7). Static tips only: no family features in v0. */
export const platformsSection = {
  heading: "Your voice is the weapon. Your parents are the target.",
  intro: "Scammers call parents and grandparents with a clone of their child's voice and a story about an emergency. Three things make that call fail.",
  platforms: [
    { title: "Agree a code word", body: "Pick a word only your family knows. A clone can copy how you sound, but it can't know the word." },
    { title: "Let them hear a clone", body: "Play them yours after you try the test. Once they've heard how real a fake sounds, they know to be suspicious." },
    { title: "Hang up and call back", body: "Tell them to end any urgent call and ring you back on the number they already have." },
  ],
  note: "Timbre doesn't screen calls or detect clones. It helps you and your family get ready for one.",
};

export const privacyPromise = {
  heading: "What we keep, and what we delete",
  points: [
    {
      title: "Your recording is deleted",
      body: "We use it once to check it's a live voice and to make your clone, then delete it. We only use clone providers that delete their copy too.",
    },
    {
      title: "No voiceprint",
      body: "We don't keep a model, fingerprint or copy of your voice. The clone is deleted when you leave the page.",
    },
    {
      title: "YouTube is read-only",
      body: "We see your public videos' titles and lengths. We never download your videos or post anything, and you can disconnect at any time.",
    },
    {
      title: "Delete it all from Settings",
      body: "One button removes your account, results and YouTube connection. Your voice is never used to train AI.",
    },
  ],
};

export const pricingSection = {
  heading: "Pricing",
  intro: "The first scan is free. Pro shows which videos we found and helps you remove them.",
};

export const finalCta = {
  heading: "Hear your clone in about two minutes.",
  body: "Then check what's public on your YouTube channel and make it harder for anyone to fake a call from you.",
};
