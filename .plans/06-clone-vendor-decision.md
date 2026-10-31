# 06 Clone vendor decision

v0.2, 31 Oct 2026. Stage 2 of [pivot-review.md](pivot-review.md) §5.

Status: **protocol ready; spike not run yet.** The spike costs nothing: Google runs on free trial credit, CosyVoice 2 runs on free Google Colab, and ElevenLabs is out. It can't run from the build session (its network policy blocks Hugging Face, and it has no Google Cloud credentials), so the founder or a teammate runs it in their own Google account using §4. No results in this doc are measured yet; the results table (§7) stays empty until then.

## 1. Question

Which provider generates the clone in the v0 demo? The default is Google voice replication in key-only mode. Self-hosted CosyVoice 2 replaces it only if it is clearly better in a blind test (§6).

## 2. Candidates

| Role | Option | Runs on | Why it's in the spike |
|---|---|---|---|
| Default | Google Cloud voice replication, key-only mode (Chirp 3 Instant Custom Voice) | Google Cloud free trial credit | Best retention among hosted vendors: no voice profile kept, a key we discard ([pivot-review.md](pivot-review.md) §2.2) |
| Challenger | CosyVoice 2 (0.5B), open model | Free Google Colab with a GPU runtime | Nothing goes to a voice vendor. Also the noted option for Cantonese in v1 |

ElevenLabs is dropped from the spike. Without a commercial quality reference, the spike uses an absolute quality bar instead (§6 rule 4).

## 3. Risks before starting

- Google access: two pricing aggregators say Instant Custom Voice is limited to allow-listed customers who contact sales. Google's own pages I could reach didn't settle it. Check access in the console first; if it needs a request, send it now, because a free-trial account may wait longer. If access isn't granted in time, the demo uses CosyVoice 2.
- Free trial: Google's new-account trial normally gives credit for a limited period and asks for a card to verify identity, without charging unless the account is upgraded to paid. Check the current offer terms when signing up, and don't upgrade the account during the spike.
- Free Colab: a GPU runtime isn't guaranteed, sessions disconnect when idle or after some hours, and usage limits vary. Budget for one or two sessions and save outputs as you go.
- Colab is a Google service, so the test recordings go to Google in both arms. The speakers' consent must say so (§4.1).

## 4. Protocol

### 4.1 Voices

- 4 speakers: the founder and 3 team members or friends, each giving written consent that covers this spike, Google Cloud and Google Colab processing, and deletion afterwards.
- Mix if possible: 2 men, 2 women; at least 2 with a Hong Kong English accent, since that is the target user.
- Each records the real clone-test flow: 3 or 4 phrases from `src/content/phrases.ts`, about 15 seconds, on a phone browser in a normal room. The same recording goes to both providers.
- Each also records the fixed sentence ("Every voice has a timbre, a colour that makes it yours and no one else's.") in their own voice, as the real reference for listeners.

### 4.2 Generation

For each speaker and provider, generate the fixed sentence plus 2 other neutral sentences. 4 speakers × 2 providers × 3 sentences = 24 clips.

Google (free trial):

1. New Google Cloud project on the trial, Text-to-Speech and Speech-to-Text APIs enabled.
2. Create a key-only voice replication key from each speaker's recording (plus the consent statement if Google requires it), synthesise the 3 sentences, then discard the key.
3. Set a budget alert at a small amount (for example US$5 of credit) so nothing runs away.

CosyVoice 2 (free Colab):

1. A Colab notebook with a GPU runtime. Install CosyVoice 2 from its official repository and load the 0.5B model.
2. Zero-shot clone from each speaker's recording, synthesise the same 3 sentences.
3. At the end: download the outputs, delete the uploaded recordings and outputs from the runtime and Google Drive, and disconnect and delete the runtime.

Record for each provider:

- Time from upload to first audio, and total time. (Colab's free GPU is slower than a production GPU; note the GPU type and treat CosyVoice timings as an upper bound.)
- Expected production cost per clone test: Google from its pricing page (listed at US$60 per million characters, so about US$0.005 for an 80-character sentence plus speech-to-text); CosyVoice from the GPU time per clip at a production GPU's hourly rate.
- Whether the output carries a watermark.
- Region where processing happened.
- What was stored afterwards, and how it was deleted.

### 4.3 Blind listening test

- 8 or more listeners who know at least one speaker.
- For each clip, played after the speaker's real recording: "How much does this sound like them?" (1 to 5) and "How natural does it sound?" (1 to 5). Then, for a random half of the trials, a real-or-clone question with the real recording mixed in.
- Clips shuffled, providers hidden. A shared form or spreadsheet is enough.

### 4.4 Retention and licence checks (in writing)

- Google: confirm that key-only mode keeps no voice profile, and ask whether the reference audio is logged, for how long, and whether it is used for training. Confirm the processing region. Note any trial-account differences.
- CosyVoice 2: confirm the code and weights licences on the official repository (third-party copies say Apache-2.0). In production it would run on our own GPU, not Colab.

## 5. Cost

| Item | Spike cost | Notes |
|---|---|---|
| Google voice replication | US$0, from trial credit | 24 clips at about 80 characters each is under 2,000 characters |
| Google Speech-to-Text | US$0, from trial credit | A few minutes of audio |
| CosyVoice 2 on Colab | US$0, free tier | One or two GPU sessions |
| ElevenLabs | Not used | Dropped |
| Total | **US$0** | Don't upgrade the Google account or buy Colab compute units |

## 6. Decision rule

1. Drop any option whose retention can't be confirmed in writing.
2. Default to Google key-only.
3. Switch to CosyVoice 2 only if it is clearly better: a mean similarity score at least 0.5 higher than Google's, with naturalness no lower, across all 4 speakers.
4. The chosen option must also pass an absolute bar: mean similarity of at least 3.5 out of 5. If neither passes, the demo isn't convincing enough; revisit Azure personal voice (needs Limited Access approval) before building stage 11.
5. If Google access isn't granted in time, use CosyVoice 2 (it still has to pass rule 4).
6. Record the production cost per test of the chosen option; it sets the daily spend cap in [03](03-tech-spec.md) §4.1.

## 7. Results

Not run yet.

| Provider | Similarity (mean, 1 to 5) | Naturalness (mean, 1 to 5) | Real-or-clone accuracy | Time to audio | Production cost per test | Watermark | Retention confirmed |
|---|---|---|---|---|---|---|---|
| Google key-only | | | | | | | |
| CosyVoice 2 | | | | | | | |

## 8. What the founder needs to do

1. Sign up for the Google Cloud free trial, create a project, enable Text-to-Speech and Speech-to-Text, set a budget alert, and check Instant Custom Voice access (§3).
2. Collect consent and recordings from the 4 speakers (§4.1). I can prepare the consent text and a recording page from the existing `Recorder` component.
3. Run the generation steps (§4.2) with the tools in `scripts/spike/clone-vendors/` (README there): `google_clone.py` for Google, `cosyvoice_colab.ipynb` for Colab. The dry run and the listening-test builder were checked with synthetic audio; the live Google calls couldn't be tested from the build session, so if one fails, compare its request body with Google's current docs.
4. Build the listening test with `make_listening_test.py`, run it (§4.3), and send me the filled sheets and both `timings.json` files; I'll fill in §7 and write up the decision.

## 9. Sources

- Google Cloud, [Text-to-Speech pricing](https://cloud.google.com/text-to-speech/pricing/?authuser=2), [Chirp 3: Instant Custom Voice](https://docs.cloud.google.com/text-to-speech/docs/chirp3-instant-custom-voice), [Replicate voices](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/text-to-speech/voice-replication); allow-list claim (secondary): [CostBench, Google TTS](https://www.costbench.com/software/voice-apis/google-tts-api/), [DeveloperDigest, Google Cloud speech](https://www.developersdigest.tech/models/speech/google-cloud)
- CosyVoice 2 licence and memory (secondary): [vokra/cosyvoice2-0.5b model card](https://huggingface.co/vokra/cosyvoice2-0.5b), [vox-cosyvoice package](https://pypi.org/project/vox-cosyvoice/); Du et al., [CosyVoice](https://arxiv.org/pdf/2407.05407) (2024)
