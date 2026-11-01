export const hero = {
  headline: "Hear an AI clone of your own voice",
  cta: "Hear my clone",
  reassurance: "Free. About two minutes. Your recording is deleted as soon as the clone is made.",
};

/**
 * Example pair in the hero. Audio paths stay null until the founder records
 * a consented example (.plans/02-design.md §8); the page then shows play buttons.
 */
export const exampleClone = {
  realLabel: "Real",
  cloneLabel: "AI clone",
  realSrc: null as string | null,
  cloneSrc: null as string | null,
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

/**
 * Before-and-after example under "How it works". Illustrative numbers, labelled
 * as an example in the UI. Counts public videos with the user's voice and their
 * total length, the measure the v0 YouTube scan uses (.plans/01-prd.md F4).
 */
export const fixExample = {
  heading: "What fixing looks like",
  before: { label: "Before", minutes: 47, videos: 12 },
  after: { label: "After fixing", minutes: 9, videos: 3 },
  caption:
    "Example. Making old videos private took this channel from 12 public videos with the owner's voice, 47 minutes in total, to 3 videos and 9 minutes.",
};

export const founder = {
  heading: "Why Timbre exists",
  quote:
    "My grandparents got a call from a voice that sounded exactly like me, saying I'd been kidnapped and needed ransom. It was an AI clone. They only avoided paying because they managed to reach me directly.",
  name: "Nicolas Fostier",
  role: "founder of Timbre",
  /** Labels for the two waveforms beside the quote. */
  voices: {
    real: "Nicolas, in a public video",
    copy: "The AI copy on the call",
    caption: "AI can copy a voice from a few seconds of audio. The two are hard to tell apart.",
  },
};

/** Founder's framing (.plans/pivot-review.md decision 7). Static tips only: no family features in v0. */
export const familySection = {
  heading: "Your voice is the weapon. Your parents are the target.",
  intro: "Scammers call parents and grandparents with a clone of their child's voice and a story about an emergency. Three things make that call fail.",
  tips: [
    {
      title: "Agree a code word",
      body: "Pick a word only your family knows. A clone can copy how you sound, but it can't know the word.",
      example: { where: "“What's our word?”", detail: "What your parents ask before doing anything an urgent caller wants.", range: [0.1, 0.32] as [number, number] },
    },
    {
      title: "Let them hear a clone",
      body: "Play them yours after you try the test. Once they've heard how real a fake sounds, they know to be suspicious.",
      example: { where: "Your clone, played once", detail: "On your phone, straight after your clone test.", range: [0.4, 0.62] as [number, number] },
    },
    {
      title: "Hang up and call back",
      body: "Tell them to end any urgent call and ring you back on the number they already have.",
      example: { where: "“I'll call you back.”", detail: "Then they ring the number they already have for you.", range: [0.68, 0.9] as [number, number] },
    },
  ],
  note: "Timbre doesn't screen calls or detect clones. It helps you and your family get ready for one.",
};

export const privacyPromise = {
  heading: "What we keep, and what we delete",
  /** Shown with the waveform that flattens to a line as it scrolls. */
  figure: {
    caption: "Example. Your recording is used once to check it's you and make the clone, then deleted.",
  },
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

export const finalCta = {
  heading: "Hear your clone in about two minutes.",
  body: "Then check what's public on your YouTube channel and make it harder for anyone to fake a call from you.",
};
