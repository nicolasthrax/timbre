# Clone vendor spike

Tools for the free spike in `.plans/06-clone-vendor-decision.md`: Google Instant Custom Voice (key-only) on free trial credit, and CosyVoice 2 on free Google Colab. Run them in your own accounts.

Recordings, outputs and the listening test are git-ignored. Never commit voice audio.

## 1. Recordings

Each of the 4 consenting speakers records three files on a phone (a voice memo app is fine), in a normal room:

- `prompt`: 3 or 4 phrases from `src/content/phrases.ts`, read aloud, about 15 seconds in total.
- `consent`: Google's consent statement, read aloud: "I am the owner of this voice and I consent to Google using this voice to create a synthetic voice model."
- `real`: the fixed sentence in their own voice: "Every voice has a timbre, a colour that makes it yours and no one else's."

Lay them out like this (any of .wav, .m4a, .mp3, .webm, .ogg, .aac, .flac):

```
recordings/
  speaker1/
    prompt.m4a
    prompt.txt     the exact phrases read in prompt.m4a, as one line of text
    consent.m4a
    real.m4a
  speaker2/
    ...
```

Use neutral folder names (speaker1, speaker2), not real names.

## 2. Google (free trial credit)

1. Sign up for the Google Cloud free trial, create a project, enable the Cloud Text-to-Speech API, and set a budget alert (for example US$5). Don't upgrade the account to paid.
2. Install the gcloud CLI and ffmpeg, then run `gcloud auth login`.
3. Check the recordings convert: `python3 google_clone.py --project YOUR_PROJECT_ID --dry-run`
4. Generate: `python3 google_clone.py --project YOUR_PROJECT_ID`

Clips go to `outputs/google/`, with timings in `outputs/google/timings.json`. The voice cloning key is held in memory and never saved. A 403 error usually means Instant Custom Voice isn't enabled for the project yet; request access from Google.

## 3. CosyVoice 2 (free Colab)

1. Zip the `recordings/` folder as `recordings.zip`.
2. Open `cosyvoice_colab.ipynb` in Google Colab (File, Upload notebook), choose a T4 GPU runtime, and run the cells in order.
3. Unzip the downloaded `cosyvoice-outputs.zip` here, so the clips land in `outputs/cosyvoice/`.
4. Run the last cell, then disconnect and delete the runtime.

## 4. Listening test

`python3 make_listening_test.py` shuffles all clips with the real recordings into `listening-test/clips/`, plus `sheet.csv` for listeners and `key.csv`, which says which provider made each clip. Keep `key.csv` away from listeners. Send me the filled sheets and the two `timings.json` files.

## 5. Clean up

When the decision is written up, delete `recordings/`, `outputs/` and `listening-test/`, and delete any copies in Google Drive.

## 6. Landing-page example (founder only)

The hero on the landing page plays a real recording and its clone. Use your own spike files:

- Real: `recordings/<your folder>/real.*`, the fixed sentence "Every voice has a timbre, a colour that makes it yours and no one else's."
- Clone: `outputs/<chosen provider>/<your folder>_1.wav`, the same sentence from the provider the spike picks.

Convert both to MP3 (mono, 44.1 kHz, 128 kbps, about 4 to 6 seconds, at most 0.3 s of silence at each end, similar loudness):

```
ffmpeg -i recordings/speaker1/real.m4a -af "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,loudnorm" -ac 1 -ar 44100 -b:a 128k example-real.mp3
ffmpeg -i outputs/google/speaker1_1.wav -af "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,loudnorm" -ac 1 -ar 44100 -b:a 128k example-clone.mp3
```

Put them in `public/audio/` as `example-real.mp3` and `example-clone.mp3`, then set `realSrc` and `cloneSrc` in `exampleClone` (`src/content/landing.ts`) to `/audio/example-real.mp3` and `/audio/example-clone.mp3`. These two files are the only voice audio that may be committed, and only with your written consent.
