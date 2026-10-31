# 02 Design

v0.2, 31 Oct 2026. Flows and screens for the YC demo scope in [01](01-prd.md). Visual tokens, type and layout rules live in [`DESIGN.md`](../DESIGN.md), which wins over this file on anything visual.

## 1. Tone

- A precise, calm security tool. Show real results, one clear action per screen.
- The message is protecting family: your voice can be copied, and the people who'd believe it are your parents.
- Rule for fear: every line about the risk is followed, on the same screen, by something the user can do. Never "Your voice HAS BEEN CLONED". Never claim Timbre stops scams or detects clones.
- The clone test is the proof. Let the clip do the persuading; keep the copy around it short.

## 2. Information architecture (v0)

```
Landing → Sign in (email link) → Consent → Clone test → Result
                                                         ├── Play it to your family
                                                         ├── Share card
                                                         └── Check your YouTube → Connect → Pick your videos → Exposure result
                                                                                                                  ├── Video detail → fix steps
                                                                                                                  └── 5-place checklist
Settings: email, connected YouTube, export, delete
```

The app nav has three items: Clone test, Your exposure, Settings.

## 3. Flows

### Flow A. First visit to clone

1. Landing: the hero plays a labelled example (a real voice and its clone, recorded by the team with consent). CTA "Hear your own clone".
2. Sign in: email, then "Check your email". The link lands on consent.
3. Consent: what we record, what we send to the clone provider, that both are deleted after the session, that YouTube is read-only and optional. One checkbox, "Agree and continue".
4. Clone test intro: what happens, the safeguards (only your live voice, a fixed sentence, a watermark, no download, deleted after).
5. Record: 3 or 4 random phrases, live level meter and quality hint, about 15 seconds.
6. Checking and generating: "Checking it's you" then "Making your clone", 10 to 30 seconds.
7. Result: Real and Clone players with synced waveforms and the transcript. Then three actions: "Play it to your family", "Share", "Check your YouTube".

### Flow B. Play it to your family

- Full-screen, large type, one button: "Play the clone". After it plays: "That wasn't really me. If you ever get a call like this, hang up and call me back." Then the code-word suggestion with a text box to note it (stored only on the device).
- Works without reading English for the parent if the user reads it out; a Cantonese version is v1.

### Flow C. Share card

- An image card: "I heard an AI clone of my own voice. It took 2 minutes." plus the Timbre name and a short link. No audio, no waveform of the user's real voice, no video titles, no numbers from the scan.
- Share via the Web Share API on phones; on desktop, copy link and download image.

### Flow D. YouTube exposure scan

1. "Check your YouTube": explains read-only access and that we never download your videos.
2. Google sign-in with the YouTube read-only scope.
3. Scanning: "Reading your public videos" with a count.
4. Pick your videos: list of public videos (thumbnail, title, length). "Tick the ones where you talk." Select all and none available.
5. Exposure result: number of videos with your voice, total length, the band from [01](01-prd.md) §6, the note that this is an estimate from video length.
6. Video detail: YouTube fix steps (private, unlisted, delete, remove audio), "Mark as fixed".
7. Checklist: the 5 places, each with a short how-to and done / not yet / doesn't apply.
8. "Run again" is available once a day; otherwise it shows when it's next available.

## 4. Screens (v0)

1. Landing
2. Sign in, check your email
3. Consent
4. Clone test: intro, record, generating, result
5. Play it to your family
6. Share card
7. Connect YouTube
8. Scan progress
9. Pick your videos
10. Exposure result
11. Video detail
12. Checklist
13. Settings
14. Privacy, terms, 404, error

## 5. States to design

- Mic denied, no mic, unsupported browser, in-app browser (Instagram's in-app browser often blocks the mic).
- Recording too quiet or noisy; too short.
- Verification failed: the words didn't match ("We couldn't hear all the phrases. Try again in a quieter spot.").
- Verification failed: the voice sounded synthetic ("This recording sounded computer-generated, so we can't use it.").
- Rate limited: "You've used your clone tests for this month. You can try again on DATE."
- Clone service busy (daily spend cap reached): "The clone test is busy. Try again after TIME."
- Clone generation failed.
- Email not verified yet.
- YouTube: no channel on this Google account; no public videos; access denied at consent; token expired (reconnect); API quota hit ("Try again tomorrow").
- Scan re-run already used today.
- Data deletion confirmation.

## 6. Copy rules specific to Timbre

- The clone clip: say "not offered as a download" and "watermarked". Never "can't be saved" or "can't be downloaded".
- The trust line "audio never leaves your device" (or any variant) appears only next to the data-export upload feature (post-demo), where it is true. It never appears in general marketing copy, on the landing page or near the clone test, because the clone test does send the live recording to our server and the clone provider.
- Say "public videos with your voice" for scan results. Don't say "we found your voice", because v0 doesn't match audio.
- Exposure is an estimate. Say so next to the band.

## 7. Accessibility and responsiveness

- Mobile first: most visitors arrive from Instagram on a phone.
- WCAG AA contrast; status never shown by colour alone.
- Every clip has a transcript.
- The family step uses large type and one action per screen.

## 8. Open questions

- Hero example clip: whose voice, and recorded where (needs written consent, see [04](04-privacy-legal.md) §7).
- Share card wording and whether it shows the user's first name.
