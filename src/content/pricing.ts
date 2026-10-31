export const PRICES = {
  month: { amount: 68, label: "HK$68", per: "/month" },
  year: { amount: 588, label: "HK$588", per: "/year", saving: "Save 28%" },
} as const;

export const plans = {
  free: {
    name: "Free",
    price: "HK$0",
    tagline: "See how exposed you are.",
    features: [
      "1 voice scan (up to 50 videos)",
      "Total minutes of your voice found",
      "Exposure risk estimate",
      "Number of sources by platform",
    ],
    excluded: ["Source details are hidden"],
  },
  pro: {
    name: "Pro",
    tagline: "See which videos, and fix them.",
    features: [
      "Full source details and links",
      "Clone test with your own voice",
      "Guided privacy fixes and takedown drafts",
      "Weekly monitoring and email alerts",
      "300 videos scanned per month",
    ],
  },
};

export const paywallCopy = {
  title: "See your full report",
  body: "See every video where your voice was found, and get step-by-step help to remove it.",
  unlocks: plans.pro.features,
  cta: "Upgrade",
  mockNote: "Demo checkout. No card is charged.",
};
