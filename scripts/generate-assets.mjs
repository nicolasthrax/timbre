// Generates placeholder assets for the mocked build:
//   public/audio/real.wav, public/audio/clone.wav  (synthetic "voice-like" tones)
//   public/thumbnails/thumb-1..6.svg               (abstract video thumbnails)
// Run: npm run assets
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const RATE = 22050;
const SECONDS = 4.5;

function wav(samples) {
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((s, i) => data.writeInt16LE(Math.max(-1, Math.min(1, s)) * 32767, i * 2));
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(RATE, 24);
  header.writeUInt32LE(RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

/** Harmonic buzz with syllable-like envelope — reads as "speech" on a waveform. */
function voice({ f0, detune = 0, watermark = false }) {
  const n = Math.floor(RATE * SECONDS);
  const out = new Float32Array(n);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    const pitch = f0 * (1 + detune) * (1 + 0.04 * Math.sin(2 * Math.PI * 0.7 * t) + 0.015 * Math.sin(2 * Math.PI * 5.5 * t));
    phase += (2 * Math.PI * pitch) / RATE;
    let s = 0;
    for (let h = 1; h <= 8; h++) {
      const formant = Math.exp(-((h * pitch - 600) ** 2) / 2e5) + 0.5 * Math.exp(-((h * pitch - 1200) ** 2) / 3e5);
      s += (Math.sin(h * phase) / h) * (0.3 + formant);
    }
    const syllable = Math.max(0, Math.sin(Math.PI * ((t * 3.6) % 1))) ** 1.5;
    const phrase = t < 0.25 || t > SECONDS - 0.3 ? 0 : t > 2.0 && t < 2.35 ? 0.1 : 1;
    s *= 0.32 * syllable * phrase;
    if (watermark && t % 1 < 0.06) s += 0.05 * Math.sin(2 * Math.PI * 2400 * t);
    out[i] = s;
  }
  return out;
}

mkdirSync(join(root, "public/audio"), { recursive: true });
writeFileSync(join(root, "public/audio/real.wav"), wav(voice({ f0: 132 })));
writeFileSync(join(root, "public/audio/clone.wav"), wav(voice({ f0: 132, detune: 0.012, watermark: true })));

const palettes = [
  ["#1A2A2F", "#2EE6C5"],
  ["#2A2219", "#FFB020"],
  ["#1C2030", "#7C9CFF"],
  ["#2A1C24", "#FF7AA8"],
  ["#1E2A1E", "#8BE37A"],
  ["#22202E", "#B79CFF"],
];
mkdirSync(join(root, "public/thumbnails"), { recursive: true });
palettes.forEach(([bg, fg], i) => {
  const bars = Array.from({ length: 9 }, (_, b) => {
    const h = 10 + ((b * 37 + i * 53) % 40);
    return `<rect x="${14 + b * 8}" y="${50 - h / 2}" width="4" height="${h}" rx="2" fill="${fg}" opacity="0.85"/>`;
  }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="#0B0D10"/></linearGradient></defs><rect width="100" height="100" fill="url(#g)"/>${bars}</svg>\n`;
  writeFileSync(join(root, `public/thumbnails/thumb-${i + 1}.svg`), svg);
});
console.log("Assets generated.");
