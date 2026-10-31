# 06 Clone vendor decision

v0.1, 31 Oct 2026. Stage 2 of [pivot-review.md](pivot-review.md) §5.

Status: **protocol and budget ready; spike not run yet.** It can't run from the build session: its network policy blocks Hugging Face, Modal and ElevenLabs, it has no Google Cloud credentials, and the GPU budget below needs the founder's approval first. No results in this doc are measured yet. The results table (§7) stays empty until the spike runs.

## 1. Question

Which provider generates the clone in the v0 demo? The default is Google voice replication in key-only mode. Self-hosted CosyVoice 2 replaces it only if it is clearly better in a blind test (§6).

## 2. Candidates

| Role | Option | Why it's in the spike |
|---|---|---|
| Default | Google Cloud voice replication, key-only mode (Chirp 3 Instant Custom Voice) | Best retention among hosted vendors: no voice profile kept, a key we discard ([pivot-review.md](pivot-review.md) §2.2) |
| Challenger | Self-hosted CosyVoice 2 (0.5B) on a rented GPU | Nothing leaves our infrastructure. Also the noted option for Cantonese in v1 |
| Quality reference only | ElevenLabs instant voice cloning | Widely seen as the realism benchmark. Fed only with the founder's or team's voices, never user audio |

## 3. New risk found while planning

Two pricing aggregators say Google's Instant Custom Voice is limited to allow-listed customers who contact sales. Google's own docs pages I could reach didn't confirm or deny this. If access needs approval, request it now, because it gates the default choice. If it isn't granted in time for the demo, the fallback is CosyVoice 2 (better retention), not ElevenLabs.

## 4. Protocol

### 4.1 Voices

- 4 speakers: the founder and 3 team members or friends, each giving written consent for use in the spike only.
- Mix if possible: 2 men, 2 women; at least 2 with a Hong Kong English accent, since that is the target user.
- Each records the real clone-test flow: 3 or 4 phrases from `src/content/phrases.ts`, about 15 seconds, on a phone browser in a normal room. Same recording goes to all three providers, so the comparison is fair.
- Each also records the fixed sentence ("Every voice has a timbre, a colour that makes it yours and no one else's.") in their own voice, as the "real" reference for listeners.

### 4.2 Generation

For each speaker and provider, generate the fixed sentence plus 2 other neutral sentences (to avoid tuning on one line). 4 speakers × 3 providers × 3 sentences = 36 clips.

Record for each provider:

- Time from upload to first audio byte, and total time.
- Cost per clone test (reference-audio processing plus about 80 characters).
- Whether the output carries a watermark (vendor documentation or detection tool).
- Region where processing happened.
- Exactly what was stored afterwards, and the deletion call used (key discarded for Google; files and process removed for CosyVoice; voice deleted via API for ElevenLabs).

### 4.3 Blind listening test

- 8 or more listeners who know at least one speaker.
- For each clip, played after the speaker's real recording: "How much does this sound like them?" (1 to 5) and "How natural does it sound?" (1 to 5). Then, for a random half of the trials, a real-or-clone question with the real recording mixed in.
- Clips shuffled, providers hidden. A simple shared form or spreadsheet is enough.

### 4.4 Retention confirmation (in writing)

- Google: confirm that key-only mode keeps no voice profile, and ask in writing whether the reference audio is logged, for how long, and whether it is used for training. Confirm processing region.
- CosyVoice 2: confirm the code and weights licences on the official repository (third-party copies say Apache-2.0). Confirm nothing is written to disk in our worker except the model.
- ElevenLabs: delete every voice after the spike and keep the deletion confirmations.

## 5. Budget (needs approval before starting)

| Item | Expected | Notes |
|---|---|---|
| GPU for CosyVoice 2 | About 3 hours on one NVIDIA L4 (24 GB). RunPod about US$0.39/hour, Modal about US$0.80/hour: **US$1 to 3** | Hourly rental, shut down when done. Cap at US$10; stop and report if it would go over. Sources: price aggregators dated Jul to Aug 2026, check before renting |
| Google voice replication | 36 clips at about 80 characters = under 5,000 characters. At the listed US$60 per million characters: **under US$1** | Plus a few minutes of Speech-to-Text. New Google Cloud accounts usually get free credit |
| ElevenLabs | One month of the cheapest plan that includes instant voice cloning: **about US$5 to 25** | Check the current plan page; cancel after the spike |
| Total | **About US$10 to 30** | |

## 6. Decision rule

1. Drop any option whose retention can't be confirmed in writing.
2. Default to Google key-only.
3. Switch to CosyVoice 2 only if it is clearly better: a mean similarity score at least 0.5 higher than Google's, with naturalness no lower, across all 4 speakers.
4. If Google access isn't granted in time, use CosyVoice 2.
5. ElevenLabs is never chosen for v0. Its scores only show how far the chosen option is from the best available.
6. Record the cost per test of the chosen option; it sets the daily spend cap in [03](03-tech-spec.md) §4.1.

## 7. Results

Not run yet.

| Provider | Similarity (mean, 1 to 5) | Naturalness (mean, 1 to 5) | Real-or-clone accuracy | Time to audio | Cost per test | Watermark | Retention confirmed |
|---|---|---|---|---|---|---|---|
| Google key-only | | | | | | | |
| CosyVoice 2 | | | | | | | |
| ElevenLabs (reference) | | | | | | | |

## 8. What the founder needs to provide

1. Approval of the budget in §5 (or a lower cap).
2. A Google Cloud project with billing, Text-to-Speech and Speech-to-Text enabled, and Instant Custom Voice access requested (§3).
3. A GPU account (RunPod or Modal) with the cap set.
4. An ElevenLabs account on the cheapest cloning plan.
5. The 4 speakers' consent and recordings (§4.1). I can prepare the consent text and a recording page from the existing `Recorder` component.
6. Somewhere the spike can run with access to those services. Either the build session's network policy is changed to allow `huggingface.co`, `modal.com` (or `runpod.io`), `api.elevenlabs.io` and the Google APIs, with credentials added as environment secrets, or the founder runs the spike scripts locally.

## 9. Sources

- Google Cloud, [Text-to-Speech pricing](https://cloud.google.com/text-to-speech/pricing/?authuser=2), [Chirp 3: Instant Custom Voice](https://docs.cloud.google.com/text-to-speech/docs/chirp3-instant-custom-voice), [Replicate voices](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/text-to-speech/voice-replication); allow-list claim (secondary): [CostBench, Google TTS](https://www.costbench.com/software/voice-apis/google-tts-api/), [DeveloperDigest, Google Cloud speech](https://www.developersdigest.tech/models/speech/google-cloud)
- GPU prices (secondary): [ComputePrices, Modal L4](https://computeprices.com/providers/modal/gpus/l4), [Spheron, Modal GPU pricing 2026](https://www.spheron.network/blog/modal-gpu-pricing-2026-per-second-billing/), [CostBench, Modal](https://costbench.com/software/ai-gpu-cloud/modal/)
- CosyVoice 2 licence and memory (secondary): [vokra/cosyvoice2-0.5b model card](https://huggingface.co/vokra/cosyvoice2-0.5b), [vox-cosyvoice package](https://pypi.org/project/vox-cosyvoice/)
- ElevenLabs, [Zero Retention Mode](https://elevenlabs.io/docs/eleven-api/resources/zero-retention-mode)
