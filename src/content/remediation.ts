import type { Platform } from "@/lib/api/types";

export interface RemediationOption {
  title: string;
  summary: string;
  steps: string[];
}

/**
 * Guided fixes for videos the user posted themselves.
 * Menu labels change often, so keep these reviewed against each platform's help centre.
 */
export const selfFixes: Record<Platform, { helpUrl: string; options: RemediationOption[] }> = {
  instagram: {
    helpUrl: "https://help.instagram.com/448523408565555",
    options: [
      {
        title: "Make your account private",
        summary: "Only approved followers can see your posts and Reels.",
        steps: [
          "Open Instagram and go to your profile.",
          "Tap the menu (☰) in the top right, then Account privacy.",
          "Turn on Private account and confirm.",
        ],
      },
      {
        title: "Archive the post",
        summary: "Hides it from everyone but you. You can restore it later.",
        steps: [
          "Open the post or Reel.",
          "Tap the ••• menu.",
          "Tap Archive.",
        ],
      },
      {
        title: "Delete the post",
        summary: "Removes it permanently.",
        steps: ["Open the post or Reel.", "Tap the ••• menu.", "Tap Delete, then confirm."],
      },
      {
        title: "Remove the audio",
        summary: "Keep the video but replace your voice with music or silence.",
        steps: [
          "Download your original from your device or archive.",
          "In the Instagram editor (or any video editor), mute the original audio and add music or captions.",
          "Post the new version, then delete or archive the old one.",
        ],
      },
    ],
  },
  tiktok: {
    helpUrl: "https://support.tiktok.com/en/account-and-privacy/account-privacy-settings/making-your-account-public-or-private",
    options: [
      {
        title: "Make your account private",
        summary: "Only followers you approve can watch your videos.",
        steps: [
          "Go to your Profile and tap the menu (☰).",
          "Tap Settings and privacy, then Privacy.",
          "Turn on Private account.",
        ],
      },
      {
        title: "Make the video private",
        summary: "Change who can watch a single video to Only you.",
        steps: [
          "Open the video and tap ••• (or Share).",
          "Tap Privacy settings.",
          "Set Who can watch this video to Only you.",
        ],
      },
      {
        title: "Delete the video",
        summary: "Removes it permanently.",
        steps: ["Open the video and tap ••• (or Share).", "Tap Delete, then confirm."],
      },
      {
        title: "Turn off duets, stitches and downloads",
        summary: "Stops others reusing your audio in new videos.",
        steps: [
          "Go to Settings and privacy → Privacy.",
          "Set Duet, Stitch and Downloads to Only you or Off.",
        ],
      },
    ],
  },
  youtube: {
    helpUrl: "https://support.google.com/youtube/answer/157177",
    options: [
      {
        title: "Make the video private",
        summary: "Only you (and people you invite) can watch it.",
        steps: [
          "Sign in to YouTube Studio.",
          "Select Content from the left menu.",
          "Click the Visibility column for the video and choose Private, then Save.",
        ],
      },
      {
        title: "Make it unlisted",
        summary: "Hidden from search and your channel; only people with the link can watch.",
        steps: [
          "In YouTube Studio, open Content.",
          "Click Visibility for the video and choose Unlisted.",
        ],
      },
      {
        title: "Delete the video",
        summary: "Removes it permanently.",
        steps: [
          "In YouTube Studio, open Content.",
          "Hover over the video, click ⋮ Options, then Delete forever.",
        ],
      },
      {
        title: "Remove or replace the audio",
        summary: "Keep the video but mute your voice.",
        steps: [
          "In YouTube Studio, open the video's Editor.",
          "Use the Audio track to mute sections or replace them with library music.",
          "Save the changes (this can take a while to process).",
        ],
      },
    ],
  },
};

/** Where to report a video someone else posted. */
export const reportLinks: Record<Platform, { label: string; url: string }> = {
  instagram: {
    label: "Instagram privacy violation report",
    url: "https://help.instagram.com/contact/504521742987441",
  },
  tiktok: {
    label: "TikTok privacy report form",
    url: "https://www.tiktok.com/legal/report/privacy",
  },
  youtube: {
    label: "YouTube privacy complaint process",
    url: "https://support.google.com/youtube/answer/142443",
  },
};

export function takedownDraft(params: {
  platformLabel: string;
  url: string;
  author: string | null;
  fullName: string | null;
  matchedSeconds: number;
}): string {
  const name = params.fullName ?? "[your full name]";
  return [
    `Subject: Request to remove content containing my voice without consent`,
    ``,
    `Hello ${params.platformLabel} team,`,
    ``,
    `My name is ${name}. The video below contains about ${Math.round(params.matchedSeconds)} seconds of my voice and was posted${params.author ? ` by ${params.author}` : ""} without my consent:`,
    ``,
    params.url,
    ``,
    `My voice is personal and identifying information. Public recordings of it can be used to create AI voice clones for impersonation and fraud. I ask that you remove this video, or remove the audio in which I can be heard, under your privacy guidelines.`,
    ``,
    `I can verify my identity if needed.`,
    ``,
    `Thank you,`,
    name,
  ].join("\n");
}
