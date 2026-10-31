# 01 Product requirements (PRD)

v0.2, 31 Oct 2026. Rewritten for the clone-test-first pivot and the YC demo scope. The reasoning behind each change is in [pivot-review.md](pivot-review.md).

## 1. Problem

AI voice cloning needs only seconds of audio. Scammers clone a young person's voice from public videos and call their parents or grandparents with a fake emergency (kidnapping, an accident, urgent money). Most people don't know how convincing a clone of their own voice is, or how much of their voice is public.

Founder story: Nicolas's grandparents in Mainland China received a kidnapping-ransom call in an AI clone of his voice. They only avoided paying because they reached him directly. He still doesn't know where the sample came from.

## 2. Who it's for

- "Connected Kai": 18 to 30, Hong Kong, posts on YouTube, TikTok and Instagram, has parents or grandparents who take phone and WeChat calls.
- The person at risk of losing money is usually the parent. The person who can reduce the risk (by hiding their voice and warning the family) is Kai. Timbre talks to Kai.
- Users don't pay. Revenue later comes from banks, telcos and insurers who bundle Timbre for their customers (B2B2C, see [05](05-gtm-roadmap.md)).
- Not in v0: creators and public figures, businesses, Mainland China users (a separate future product, see [04](04-privacy-legal.md) §11), anyone under 18.

## 3. v0 goal

v0 is a demo for a YC application. It has to work end to end with real users and produce growth numbers, not revenue.

- G1. A new visitor hears an AI clone of their own voice within about 3 minutes of arriving.
- G2. They see how much of their voice is public on their own YouTube channel.
- G3. They leave with concrete things to do, for themselves and their family.
- G4. They share the experience without sharing any audio.

## 4. Non-goals for v0

- Detecting whether a voice has actually been cloned (not possible; Timbre shows exposure and lets you hear the risk).
- Screening or blocking scam calls.
- Payments, plans or paywalls (paused until demand is validated).
- TikTok and Instagram connections, matching voice in uploaded files, finding reposts by other people, monitoring alerts. All are designed in §9 and built after the demo.
- Cantonese. The clone test is English only; phrases and copy carry a locale so Cantonese can follow in v1.

## 5. Features in v0

### F1. Email sign-in

- Magic link by email. No password, no social login in v0.
- The email must be verified before a clone test can start, because rate limits key on it (F2).

### F2. Clone test (the headline)

- The user reads 3 or 4 random phrases issued by the server, about 15 seconds of speech in total.
- The server checks the recording matches the phrases, checks it isn't synthetic speech, then generates a clone of the user's voice saying one fixed, harmless sentence chosen by us.
- The clone is built only from that live recording. Never from an upload, a stored voiceprint or anything found online.
- The result shows the real recording and the clone side by side, with a transcript. The clone carries a watermark and is not offered as a download.
- The recording and the clone are deleted after the session. The vendor keeps nothing, or deletes on our request (see [03](03-tech-spec.md) §4).
- Limits: about 3 tests per verified email per month, a loose per-IP and per-device limit, and a global daily spend cap.

### F3. Play it to your family, and share

- After the result, a full-screen "play it to your family" step: hand the phone to a parent, play the clone, then show them the code-word suggestion.
- A share card (an image, no audio, no video titles or links) saying the user heard a clone of their own voice, with a link to try it.

### F4. YouTube exposure scan

- The user connects their YouTube channel with Google sign-in (read-only).
- We list the channel's public videos with titles and lengths. The user ticks the ones where they speak.
- Result: the number of public videos with the user's voice, their total length, and a coarse band (§6). No precise score.
- The user can re-run the scan at most once a day.
- We never download or analyse the videos' audio. YouTube's API doesn't offer it and its developer policies forbid storing copies.

### F5. What to do next

- Per video: how to make it private, unlisted, delete it or remove the audio (existing YouTube steps in `src/content/remediation.ts`).
- The 5-place checklist, as static content in v0:
  1. Public videos where you talk (the scan covers YouTube; check TikTok and Instagram yourself).
  2. Your voicemail greeting (record a generic one or use the carrier's default).
  3. Voice-only verification on your accounts (add a second factor).
  4. A family code word (agree one that a clone can't know).
  5. Downloads, duets and stitches on your videos (turn them off).
- Progress on the checklist is saved per user.

### F6. Your data

- Settings: email, connected YouTube account with a disconnect button, export my data, delete my data.
- Deletion removes the account, scan results and YouTube tokens, and revokes access at Google.

## 6. Exposure band (v0 hypothesis, tune in stage 8)

Based on the total length of public videos the user says they speak in:

| Band | Rule (hypothesis) | What we say |
|---|---|---|
| None found | 0 videos ticked | "We didn't find public videos with your voice on this channel." |
| Some | Under 10 minutes in total | "There's enough of your voice public to make a clone." |
| A lot | 10 minutes or more | "There's plenty of clear audio of your voice in public." |

Modern cloning works from about 10 to 30 seconds of audio, so any public speaking video is enough for a basic clone. The band is about how much there is to fix, not proof of anything. Copy must say it is an estimate based on video length.

## 7. Success metrics for the YC application

- Activation: % of signups who complete a clone test.
- Family moment: % of clone tests followed by the family replay step.
- Sharing: shares per clone test, and signups from shared links.
- Scan: % of clone-test users who connect YouTube.
- Action: % who tick at least one checklist item.
- Growth: week-over-week new users.

## 8. Assumptions to validate

1. Hearing a clone of your own voice is a strong enough moment that people share it.
2. Young HK adults act for their parents' sake more than their own.
3. A meaningful share of the target group has public videos with their voice on YouTube.
4. Banks, telcos or insurers will pay to bundle this once the consumer numbers exist.

## 9. Post-demo features (designed, not built)

- TikTok scan via the Display API (own public videos' metadata; needs app review).
- Instagram: professional accounts via the Instagram API with Instagram Login. Personal accounts can't connect through any official API, so they are covered only by the next item.
- Matching your voice in your own data export (Instagram, TikTok, Google Takeout) or video files. Processed in the browser only; the files' audio never leaves the device.
- Possible reposts by other people, found by web search on name and handles, listed for the user to check, with a takedown draft. No audio fetched.
- Monitoring alerts: new public video on a connected account, a fixed video public again, a possible new repost, account disconnected, monthly summary.
- Cantonese clone test (self-hosted CosyVoice 2 is the noted option).
- Partner entry (codes or co-branded pages) for B2B2C.

## 10. Name and domain

- Name: Timbre, marketed and searched as "Timbre AI". Known overlaps: Gnani AI's "Timbre" speech model, Tuya's "Timbre Clone" service.
- Domain: not owned yet. The app reads it from configuration (`NEXT_PUBLIC_SITE_URL`). Candidates, in order: timbre.ai, gettimbre.ai, timbreai.com, trytimbre.com. Needed by stage 12 (Google OAuth verification).
- Still to do: social handles, HK trademark search (classes 9 and 42).

## 11. Open questions

- How hard can the family message push before it reads as a fear tactic? ([02](02-design.md) §1 has the rule.)
- Is 18+ the right floor given campus channels?
- Exposure band thresholds (§6).
