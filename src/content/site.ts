// No domain is owned yet (.plans/01-prd.md §10), so the public URL comes from
// configuration. Unset in local development.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const site = {
  name: "Timbre AI",
  title: "Hear an AI clone of your own voice | Timbre AI",
  description:
    "Hear a short AI clone of your own voice, see how much of it is public on your YouTube channel, and get steps to protect your family from voice-clone scams.",
  url: siteUrl,
  // Follows the configured domain, so it updates once one is registered.
  contactEmail: `hello@${new URL(siteUrl).hostname.replace(/^www\./, "")}`,
} as const;
