import { expect, type Page } from "@playwright/test";

/** Replaces getUserMedia with a synthetic, speech-like oscillator stream. */
export async function mockMicrophone(page: Page) {
  await page.addInitScript(() => {
    const fake = async () => {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      osc.frequency.value = 180;
      const gain = ctx.createGain();
      gain.gain.value = 0.25;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 3;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.2;
      lfo.connect(lfoGain).connect(gain.gain);
      const dest = ctx.createMediaStreamDestination();
      osc.connect(gain).connect(dest);
      osc.start();
      lfo.start();
      return dest.stream;
    };
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { ...navigator.mediaDevices, getUserMedia: fake },
    });
  });
}

/** Seeds a signed-in demo account via the hidden dev page. */
export async function seed(page: Page, plan: "free" | "pro" | "lapsed") {
  await page.goto("/dev/states");
  const label = { free: "Seed free user", pro: "Seed Pro user", lapsed: "Seed lapsed user" }[plan];
  await page.getByRole("button", { name: label }).click();
  await expect(page.getByText(`Seeded ${plan} account.`)).toBeVisible();
}

export const SOURCE_URL_PATTERN = /(youtube\.com\/watch|instagram\.com\/reel|tiktok\.com\/@)/;
