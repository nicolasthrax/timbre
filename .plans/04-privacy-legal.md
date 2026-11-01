# 04 Privacy, legal and trust

v0.2, 31 Oct 2026. Not legal advice. A Hong Kong lawyer reviews this before public launch (Cyberport and HKSTP programmes can make introductions).

## 1. Company setup

1. Now: no company. Build the demo under the founder's name.
2. Before signing the first partner (bank, telco, insurer), or earlier if a YC deal needs it: register a Hong Kong limited company, or the structure YC asks for (usually a Delaware C-Corp), with a lawyer's guidance.
3. Payments are paused, so there is no Stripe or billing obligation in v0.

## 2. What v0 collects

| Data | Why | Kept |
|---|---|---|
| Email address | Sign-in, rate limits | Until account deletion |
| Clone-test recording (about 15 s of live speech) | Verify the challenge, make the clone | Seconds: deleted when the clone is generated. Never written to storage on our side |
| Generated clone clip | Play it to the user | Not stored: streamed to the browser and discarded |
| Challenge records (phrases, timestamps, outcome) | Abuse control and audit | 12 months |
| Hashed IP and device token | Rate limits | 30 days |
| YouTube channel ID, title, encrypted refresh token | Scan the user's own channel | Until disconnect or deletion |
| Public video metadata (title, length, privacy status) and the user's "I speak in this" ticks | Exposure result and fixes | 30 days after the last scan (placeholder until the YouTube storage rules are checked, [03](03-tech-spec.md) §5) |
| Checklist progress | Show progress | Until deletion |
| Consent version and time | Proof of consent | As long as the law requires |

There are no voiceprints, embeddings or stored recordings in v0.

## 3. Hong Kong PDPO

A voice recording is biometric personal data, even when it is kept for seconds. Treat the clone test as highly sensitive.

| Principle | What we do |
|---|---|
| DPP1 Purpose and collection | Collect only what the clone test and the YouTube scan need. State the purpose on the consent screen. Disclose cross-border processing (Singapore for Supabase, the Google region for the clone) |
| DPP2 Accuracy and retention | Retention as in §2. Delete the recording as soon as the clone is generated |
| DPP3 Use | No use beyond the user's own test and scan. No model training. Partners never receive personal data (§9) |
| DPP4 Security | Encryption in transit and at rest, RLS, encrypted OAuth tokens, minimal staff access, audit log |
| DPP5 Openness | Plain-English privacy policy, public |
| DPP6 Access and correction | Self-serve export and delete in Settings; email requests answered within 40 days |

Data processors (Google, Supabase, Vercel, PostHog, Sentry, and Modal if used) need contract terms on retention and security under DPP2(3) and DPP4(2).

## 4. Questions for the lawyer (v0)

1. The PCPD's *Guidance on Collection and Use of Biometric Data* (revised; confirm the date): necessity, free and informed choice, less intrusive alternatives, prompt purging. Is a recording held for seconds and never stored treated any differently?
2. Processor contracts with the clone vendor, including where it processes audio and whether it logs the reference audio.
3. Cross-border transfer wording (section 33 is not in force; disclosure under DPP1 and DPP5).
4. YouTube metadata as personal data, alongside Google's API Services User Data Policy.
5. Rate-limit data (hashed IPs and device tokens): purpose and 30-day retention.
6. Whether a privacy impact assessment is needed before launch (the PCPD guidance recommends one for biometric systems).
7. Any 2025 or 2026 PDPO amendment (a quick search found none).
8. Liability if a user records or redistributes the clone clip despite the terms.

## 5. Consent design

- A separate consent screen before the first recording, not buried in the terms.
- It says: what we record, that the recording goes to our server and to the clone provider, that both delete it straight after, that the clone is watermarked and not offered as a download, and that YouTube access is read-only and optional.
- Versioned consent with a timestamp.
- Withdrawing consent deletes the account.

## 6. Platform terms

- YouTube: official Data API only. No downloading or storing of audiovisual content. Follow the YouTube API Services Terms and Developer Policies, including showing a link to the YouTube Terms of Service and explaining how to revoke access. Google OAuth verification is needed before public launch (checklist in [pivot-review.md](pivot-review.md) §2.3).
- TikTok and Instagram: not connected in v0. Post-demo, official APIs only (TikTok Display API; Instagram API with Instagram Login, professional accounts only).
- No scraping of any platform. Meta's terms ban automated collection without permission, and YouTube's policies forbid storing copies of videos.

## 7. Clone-test safeguards

- Only the account holder's own live voice, verified by a server-issued random challenge and a synthetic-speech check.
- A fixed sentence chosen by us; no custom text, so it can't be used as a scam script.
- Audible disclosure in the clip, plus the vendor's watermark if it has one.
- Not offered as a download. The copy never claims it "can't be saved", because screen recording works.
- Rate limits per verified email, device and IP, and a global spend cap ([03](03-tech-spec.md) §4).
- Terms of service ban recording or redistributing the clip and cloning anyone else; accounts are closed on abuse.
- The landing-page example clip uses the voice of the founder or a team member who has given written consent. The vendor quality reference in the spike uses the same voices, never user audio.

## 8. Model and vendor licences

- Keep `LICENSES.md` listing every model, library and vendor with its licence and commercial-use terms.
- Before using any open model (CosyVoice 2, an anti-spoofing model), check the licence of both the code and the weights.
- Check each clone vendor's terms allow a consumer-facing clone feature.

## 9. Partners (post-demo)

Partners get aggregate numbers only (for example, how many of their customers' children took the test). Sharing anything identifiable would be a new purpose under DPP3 and possibly direct marketing under Part VI A, so it needs its own consent and legal review.

## 10. Marketing claims

- Don't claim "we detect if your voice was cloned" or "we stop scams". Say "hear how convincing a clone of your voice is" and "see how much of your voice is public and reduce it".
- The exposure band is an estimate from video length; say so.
- The line "audio never leaves your device" appears only next to the data-export upload feature (post-demo), where it is true. Never in general marketing copy, because the clone test sends the live recording to our server and the clone provider.

## 11. Mainland China

A separate future product, not a follow-on to v0. It needs its own PIPL review, its own platform access (Douyin, Xiaohongshu, Bilibili, WeChat) and its own data residency.

## 12. Documents needed before public launch

- Privacy policy (PDPO, Google API Services User Data Policy, YouTube API terms)
- Terms of service (acceptable use, clone-test rules)
- Consent text for the clone test
- Retention and deletion policy (internal)
- Breach response plan (who to notify, including the PCPD, and how fast)
- `LICENSES.md`
