# Pivot review

Status: approved 31 Oct 2026 (revision 4). Implementation in progress: stage 1 (docs) done. Stage 2 (vendor spike): free protocol written in `06-clone-vendor-decision.md`; the founder runs it (§8 there). Stage 3 (landing copy) done and confirmed. Stage 4 (landing structure) done. Stage 5 (plans and billing removed) done; stopped for founder review. Earlier copy fixes on this branch: the "can't be downloaded" wording (§4.2) and the voiceprint "can't be turned back into audio" claim (§4.4).

## 0. Decisions recorded

Revision 2 (31 Oct 2026):

1. The free exposure scan is a real automated scan. The 5-place checklist is the "what to do next" step after it.
2. Monitoring stays (now post-demo, see decision 9).
3. The clone test is English only in v0, with room for Cantonese later.
4. Share format: a share card with no audio, plus a "play it to your family" moment on the same device.
5. Email-only sign-in. Rate limits per device and IP protect the free clone test.
6. The goal is a YC application. Demo and user growth over revenue. The paywall stays paused.

Revision 3 (31 Oct 2026):

7. Manual scan re-run is allowed, at most once per day per user.
8. Data-export upload (tier B) is processed in the browser only. Audio from uploads never leaves the user's device, and this becomes a trust line in marketing copy.
9. v0 is a YC demo with four parts: the clone test, a tier A scan for YouTube only, the share card, and email sign-in. TikTok, Instagram, tier B, tier C and monitoring alerts move to the post-demo section (§6). Their designs stay; they aren't built yet.

Revision 4 (31 Oct 2026, plan approved):

10. The 5-place checklist is in the demo as static content.
11. No domain is owned yet. The site URL is a config value (`NEXT_PUBLIC_SITE_URL`). Candidates, in order: timbre.ai, gettimbre.ai, timbreai.com, trytimbre.com. Needed only at stage 12.
12. A cloud GPU is allowed for the CosyVoice spike only: hourly rental, shut down when done, expected cost reported to the founder before starting. The demo defaults to Google key-only unless CosyVoice is clearly better. CosyVoice stays noted for Cantonese in v1.
13. ElevenLabs is a quality reference only, using the founder's or team's own voices. Never user audio. (Superseded by 16.)
14. "Audio never leaves your device" appears only next to the data-export upload feature, never in general marketing copy.
15. Still open: age floor (default stays 18+). Headline, CTA and family heading confirmed (decision 17).
16. The spike is free: Google on free trial credit, CosyVoice 2 on free Google Colab, ElevenLabs dropped entirely. Decision 12's paid GPU is no longer needed.
17. Confirmed copy: headline "Hear an AI clone of your own voice", subheading "Your voice can be copied in seconds. Hear it for yourself.", CTA "Hear my clone", family heading "Your voice is the weapon. Your parents are the target." with three static tips and no family features. Contact email is hello@ plus the configured domain.
18. The "play it to your family" replay screen stays; the code-word box is cut. The founder records the hero example during the spike (instructions in `scripts/spike/clone-vendors/README.md` §6).

## 1. v0 demo scope

| In v0 | Out of v0 (designs kept in §6) |
|---|---|
| Email sign-in (magic link) | Instagram and TikTok connections |
| Clone test: English, live-session audio only, random challenge phrases, rate limits from §4.1 | Tier B: matching voice in uploaded exports, in the browser |
| "Play it to your family" replay step | Tier C: web search for reposts |
| Share card with no audio | Monitoring and alerts |
| Tier A scan of the user's own YouTube channel, metadata only, manual re-run once a day | Partner (B2B2C) features |
| Results with a coarse band and the facts behind it | Paywall and billing (paused) |
| Settings: email, connected YouTube account with disconnect, export, delete | Cantonese |

One trust-line caveat for decision 8: the clone test does send the live recording off the device (to our server and the clone vendor). The marketing line has to be scoped to uploads, for example "Videos you upload for a scan are checked on your phone and never leave it." A plain "your audio never leaves your device" would be false for the clone test. In the v0 demo there is no upload at all, so the line belongs on the landing page only once tier B ships.

With no voice matching in v0, **the demo stores no voiceprint and creates no embedding**. The only voice data is the clone-test recording, deleted after generation.

## 2. Research findings

I couldn't open most primary policy pages from this environment. Each point says where it came from; check the primary pages before relying on them.

### 2.1 Instagram personal accounts: no

**A normal personal Instagram account cannot connect through any official Meta API today.** Meta's Instagram Platform docs say the Instagram API with Instagram Login gives access to data in Instagram Business and Creator accounts and that app users "must have an Instagram professional account". The only API that served personal accounts, the Basic Display API, returns errors for all requests since 4 Dec 2024.

What this means for tier A:

- For most of the target users (18 to 30, posting from personal accounts), tier A can't cover Instagram. Switching to a professional account is free, but it changes how the account works (it can't be private), so we can't ask users to do it.
- Instagram coverage for personal accounts would need tier B (the user's own data export, checked in the browser) or tier C (web search). Both are post-demo.
- YouTube is the best fit for the demo: the official API covers every channel, personal or not. TikTok's Display API also covers personal accounts but needs app review, so it is post-demo.

### 2.2 Clone vendors ranked on data retention first

Retention ranking (1 = keeps least):

| Rank | Vendor | Zero-retention option | Deletion | How long the sample or voice is kept | Source |
|---|---|---|---|---|---|
| 1 | Self-hosted CosyVoice 2 | Not needed: nothing leaves our infrastructure | We delete it ourselves, immediately | As long as our own code keeps it (target: seconds) | Our design. Licence reported as Apache-2.0 by third parties; verify code and weights |
| 2 | Google Cloud voice replication (Chirp 3 Instant Custom Voice / Gemini voice replication) | Yes: "key-only" mode. Google keeps no voice profile and returns an encrypted key that we store | Key-only: we drop the key. Stored mode: Voices API delete | Key-only keys are valid 7 days. Stored voices expire one year after last use. Retention of the uploaded reference audio itself not confirmed | Google Cloud and Gemini API docs (recent) |
| 3 | Microsoft Azure personal voice | No | `DELETE .../customvoice/personalvoices/{id}` removes the voice. Training (prompt) audio can be deleted by API | Microsoft says it "may independently retain a copy of personal voice models for as long as necessary". Consent and speaker-verification data are kept only as long as verification needs | Microsoft Learn (REST reference 2026-01-01, data and privacy note) |
| 4 | Resemble AI | Not found | `DELETE /api/v2/voices/:voice_uuid` and per-recording delete | Retention period not stated; governed by its retention policy. Destruction on request at contract end | Resemble API docs and terms of service |
| 4 | Cartesia | "Zero data retention" for Enterprise on eligible services; not confirmed for instant clones | Delete endpoint documented for Pro Voice Clones; not confirmed for instant clones | Not found | Cartesia marketing and docs |
| 6 | ElevenLabs | Zero Retention Mode exists (Enterprise) but its docs list Instant and Professional Voice Cloning as not eligible | Voice deletion is available | A secondary summary of the privacy policy says voice data is kept for up to three years. Not confirmed on the primary page | ElevenLabs docs; ConductAtlas summary |

Then English quality and cost. These come from editorial comparisons, not measured benchmarks, and the pricing figures conflict between sources:

| Vendor | English quality (editorial view) | Cost per clone test |
|---|---|---|
| ElevenLabs | Widely treated as the realism benchmark | One fixed sentence is about 80 characters. At the reported US$0.04 to 0.10 per 1,000 characters, under US$0.01 per test plus a plan minimum |
| Google | Good; not ranked in the sources found | Not found; check the pricing page |
| Azure personal voice | Good; Microsoft's own examples | Billed per profile until deleted, plus characters. Deleting right away keeps this low |
| Cartesia | Strong, best known for low latency | Instant cloning reported from the US$5 Pro plan |
| Resemble | Sources disagree on whether it still focuses on TTS | Reported US$0.0005 per second |
| CosyVoice 2 (self-hosted) | Open model; expect lower than the commercial leaders. Measure it | GPU time: a fixed cost while the server is up, near zero per test |

Recommendation for the spike (stage 2): test **Google key-only mode** and **self-hosted CosyVoice 2**, the top two on retention, judged against an absolute quality bar (ElevenLabs was dropped from the spike, decision 16). If neither convinces listeners in a blind test, revisit Azure (needs Limited Access approval).

For any vendor: get written confirmation of whether the uploaded reference audio (not just the voice) is logged, for how long, and whether it's used for training.

### 2.3 Google OAuth verification for the YouTube scope

Scope: `https://www.googleapis.com/auth/youtube.readonly`, which lists the user's own channel and uploads. Google treats YouTube scopes as sensitive (a third-party guide says all of them are; confirm the label in Cloud Console). Sensitive scopes need verification, but not the paid security assessment that restricted scopes (Gmail, Drive) need.

**The demo doesn't need to wait for verification.** An app in "Testing" status works for the test users you add. Refresh tokens expire after 7 days in Testing, which is fine for a demo. Newly created OAuth clients are also capped at 100 users until verified. Verification is needed before public launch.

What you need to submit:

1. **Google Cloud project** with the YouTube Data API v3 enabled, and a Google account that is owner or editor on it.
2. **A live domain you own** (for example `timbre.ai`, already in `src/content/site.ts`; confirm you own it), verified in Google Search Console by an account that is owner or editor on the Cloud project.
3. **Branding (consent screen) details**, which must be verified and published before data-access verification can be requested:
   - App name ("Timbre"), matching the name on the homepage
   - App logo
   - User support email and developer contact email
   - Homepage URL on the verified domain
   - Privacy policy URL and terms of service URL on the same domain
   - Authorised domains
4. **Homepage**: public without sign-in, describes what the app does, links to the privacy policy, uses the same app name.
5. **Privacy policy** that says what Google user data the app reads (YouTube channel and video metadata), how it's used, stored, shared and deleted, and how a user revokes access. It must follow the Google API Services User Data Policy. The YouTube API Services Developer Policies add their own privacy-policy requirements: check them, but they include referencing Google's privacy policy and explaining revocation. The current `/privacy` page is a draft with a "pending legal review" banner and describes the old product, so it must be rewritten first (stage 1 docs, then stage 9 copy).
6. **Terms of service** on the domain. The YouTube API Services Terms also require apps to show users a link to the YouTube Terms of Service. Check the current wording.
7. **Scope justification**: one short paragraph per scope on why it's needed and why a narrower scope won't do. Draft: "Timbre lists the public videos on the user's own YouTube channel, with their titles and durations, to show the user how much of their voice is publicly available and which videos to make private. We read nothing else and never upload, edit or delete anything."
8. **Demo video**, uploaded to YouTube as Unlisted: the full sign-in flow in English, the consent screen showing exactly the requested scopes, the OAuth client ID visible (in the URL), how the data appears in the app, and every OAuth client in the project.
9. **Quota**: the default daily YouTube Data API quota is enough for a demo. More needs a separate YouTube API compliance audit, which isn't needed now.

Order of work: domain and Search Console first, then the rewritten privacy policy and terms published on the domain, then branding verification, then data-access verification with the demo video. The demo video needs a working connect flow, so it comes after stage 8 (YouTube connect).

## 3. Gap analysis for the demo scope

Key: **C** = change, **R** = remove, **A** = add, **P** = post-demo (leave the code alone for now, or hide it).

| Area | Files | Action |
|---|---|---|
| Docs | `.plans/01-prd.md`, `02-design.md`, `03-tech-spec.md`, `04-privacy-legal.md`, `05-gtm-roadmap.md`, `00-README.md`, `DESIGN.md`, `README.md`, `BUILD_REPORT.md` | C: v0 demo scope and a post-demo section, per §1 and §6 |
| Landing copy | `src/content/landing.ts`, `faq.ts`, `site.ts`, `cloneTest.ts` | C: clone test first, YouTube scan second, family message. FAQ answers about voiceprints, risk score, platforms and hidden sources rewritten |
| Landing page | `src/app/(marketing)/page.tsx`, `MarketingHeader.tsx` | C: hero is a labelled example real/clone pair. R `#pricing`, header Pricing link |
| Pricing and paywall | `pricing.ts`, `PricingCards.tsx`, `Paywall.tsx`, `SessionProvider.tsx` `openPaywall`, `AppShell.tsx` upgrade button and `PlanBadge`, `StateNotices.tsx` `UpgradeCard` and `LapsedBanner`, `SettingsView.tsx` plan row, `types.ts` `Plan`/`BillingInterval`/`lapsedAt`, `client.ts` `upgrade`, `mock.ts` `present()` | R |
| Clone test | `clone-test/page.tsx`, `CloneTestView.tsx`, `Recorder.tsx`, `useRecorder.ts`, `phrases.ts`, `client.ts` `requestCloneTest` | C: no lock; server-issued challenge (`startCloneChallenge` then `requestCloneTest(challengeId, sample)`); 3 or 4 phrases and a longer minimum; `locale` on phrases; failure states for mismatch, synthetic voice, too short and rate limit |
| Family step and share card | None | A: replay step on the result screen; share card image and Web Share API with download fallback |
| Onboarding | `onboarding/consent`, `onboarding/enrol`, `onboarding/accounts`, `OnboardingSteps.tsx`, `routing.ts` | C: consent → clone test. R enrol (no voiceprint). C accounts into "Connect YouTube" |
| Scan | `scan/[id]/ScanProgress.tsx`, `results/ResultsView.tsx`, `dashboard/DashboardView.tsx`, `ExposureSummary.tsx`, `risk.ts`, `RiskBadge.tsx`, `SourceCard.tsx`, `sources/[id]/SourceDetail.tsx` | C: YouTube-only steps, merge results and dashboard, coarse band from video count and speaking time, "Run again" with once-a-day limit. Source detail keeps the YouTube fix steps. R `Sparkline` and trend |
| Checklist | `remediation.ts`, `StateNotices.tsx` `LowExposureState` | C: see §7 Q1 on how much checklist goes into the demo |
| Settings | `SettingsView.tsx` | C: email, connected YouTube account with disconnect, export, delete. P monitoring toggles (hide) |
| API layer | `types.ts`, `client.ts`, `mock.ts`, `mock-data.ts`, `supabase.ts` | C: `Platform` narrowed for v0 or flagged, `Source.evidence`, scan rate limit. R `Voiceprint`, `enrolVoice`, `getVoiceprint` |
| Consent and legal | `consent.ts`, `legal.ts` | C: no voiceprint, clone-test data flow, YouTube data use, Google API policy wording, vendor and region |
| Dev and tests | `dev/states/StatesGallery.tsx`, `tests/smoke.spec.ts`, `tests/screenshots.spec.ts`, `tests/helpers.ts` | C, R plan seeds |
| Instagram and TikTok handles | `lib/platforms.ts`, `remediation.ts` Instagram and TikTok steps | P: keep the content, don't show it in v0 |

## 4. Challenges and design notes

### 4.1 Live verification and abuse limits

The clone is built only from audio captured live in that session, never from an upload, a stored voiceprint or anything found online. If someone records themselves, they only get a clone of themselves. Remaining attacks and controls:

1. Replay of an existing recording: a server-issued challenge of 3 or 4 random phrases, a one-use ID with a 2 to 3 minute expiry, a speech-to-text match of at least 80%, and one continuous capture of plausible length.
2. Live voice conversion or TTS: a synthetic-speech check on the sample (vendor-provided, or an open model such as AASIST after a licence check). Low marginal harm: the attacker already has a clone, and Timbre adds one watermarked fixed sentence.
3. A tricked or coerced victim: rate limits and the fixed sentence limit the value.

Rate limits (decision 5):

- Per verified email: about 3 tests a month. Verify email before issuing a challenge. Block disposable-email domains.
- Per IP: a loose sliding window, for example 10 a day. Mobile carriers and campuses in Hong Kong share IPs, and a strict limit would block a whole lecture hall at a campus talk.
- Per device: a signed first-party cookie token, not browser fingerprinting (personal data under the PDPO, needs disclosure).
- A global daily cap on vendor spend, with a "the clone test is busy, try again after HH:MM" state.
- Audit log of challenge IDs, outcomes and rate-limit hits, never audio. Device tokens and IPs kept 30 days.

Where the vendor needs a consent statement (Google), it becomes one of the challenge phrases.

### 4.2 "Can't be downloaded" (fixed on this branch)

`src/content/cloneTest.ts` now says "No download, and watermarked": the clip isn't offered as a download and carries a watermark. Terms §4 in `src/content/legal.ts` says it is "not offered as a download" and that recording or redistributing it isn't allowed. A comment in `ClonePlayer.tsx` says copy must never claim the clip can't be saved, because screen recording still works.

### 4.3 What each platform allows

| Platform | Official API | Audio? | v0 |
|---|---|---|---|
| YouTube | Data API: own channel's public uploads, titles, durations | No. The Developer Policies bar storing copies of audiovisual content without written approval | Tier A, in v0 |
| TikTok | Display API: own public videos' metadata, for embedding. App review needed | No | Post-demo |
| Instagram | Professional accounts only (§2.1) | Own media for professional accounts only | Post-demo, mostly via tier B |
| Others' reposts | Web search API lists URLs | No; fetching audio would breach platform terms | Post-demo (tier C) |

The v0 YouTube scan measures exposure from metadata: public videos, their total length, and which ones the user confirms they speak in. The result reads like "24 public videos on your channel, about 3 hours in total. You said you speak in 19 of them." That fits "no precise exposure score": we show facts and a coarse band, not a computed number of minutes of matched voice.

### 4.4 Voice data in v0

- No voiceprint and no embedding in v0.
- The clone-test recording is held in memory or temporary storage only until the clone is generated, then deleted. The vendor-side copy is deleted through its API, or never kept (key-only or self-hosted, §2.2).
- YouTube OAuth tokens: encrypted at rest, read-only scope, revoked at Google when the user disconnects or deletes their account.
- Fixed on this branch: `src/content/consent.ts` no longer says the voiceprint "can't be turned back into audio". It now says "It isn't a recording and can't be played back." The whole consent screen is rewritten in the demo (no voiceprint at all), but the overclaim is gone now.
- For tier B later, the storage rules from revision 2 still apply: no stored voiceprint by default, embedding computed in the browser, per-user keys if repeat matching is ever added.

### 4.5 PDPO items for a lawyer (v0)

1. Biometric data in the clone-test recording, even though it's transient: the PCPD's *Guidance on Collection and Use of Biometric Data* (revised, date to confirm) on necessity, informed choice and purging.
2. The clone vendor as data processor: DPP2(3) and DPP4(2) contract terms on retention and security.
3. Cross-border transfer: vendor and hosting regions disclosed under DPP1 and DPP5.
4. YouTube metadata pulled through OAuth is personal data; retention and deletion rules apply, alongside Google's own user-data policy.
5. Rate-limit data (IPs and device tokens): stated purpose and 30-day retention.
6. Privacy impact assessment for the clone test.
7. Any 2025 or 2026 PDPO amendment. A quick search found none.
8. Post-demo: partner data sharing (DPP3, Part VI A), minors, web-search results that name other people.

### 4.6 Other notes carried over

- B2B2C: banks lose money through the parent, not the young adult; that can be the pitch. Partners get aggregate data only. Not built in v0.
- YC numbers to instrument from the first build: clone tests completed, family replays, shares, signups from shares, YouTube scans connected, week-over-week growth.
- "Your voice is the weapon, your parents are the target": pair every fear line with an action on the same screen (`02` §1 tone rule).
- `.plans/00` links `../voice-exposure-scanner-spec.md`, which isn't in the repo.
- Mainland China: one line in `04` and `05` saying it's a separate product with its own PIPL review.

## 5. Implementation plan (v0 demo)

Each stage is one small PR. Stages 1 to 9 use the mock backend; stages 10 to 12 make the demo real.

0. **Done on this branch.** Clone-test download wording and the voiceprint consent claim.
1. **Docs.** Rewrite `01` to `05`, `00-README.md` and `DESIGN.md` for the demo scope, with a post-demo section. Include the privacy and terms content needed for Google verification (§2.3 items 5 and 6). In parallel, outside the repo, you set up the domain, Search Console and Cloud project.
2. **Vendor spike.** `.plans/06-clone-vendor-decision.md`: Google key-only (free trial credit) and CosyVoice 2 (free Colab), blind listening test with an absolute quality bar, retention confirmed in writing, production cost per test. Run by the founder in their own accounts.
3. **Landing copy.** `landing.ts`, `faq.ts`, `site.ts` (site URL read from `NEXT_PUBLIC_SITE_URL`), `cloneTest.ts`, `consent.ts`. Headline and CTA options for the founder. Run `scripts/slop-check.sh`.
4. **Landing structure.** New hero with a labelled example clip, sections re-ordered, pricing removed. Hero direction in `DESIGN.md` first. Screenshots at 320 px and desktop.
5. **Remove plans and billing.** Everything in the "Pricing and paywall" row of §3.
6. **Clone test flow.** Challenge API shape, phrases, rate-limit and verification states, family replay step. Consent → clone test routing. Remove enrol.
7. **Share card.** Image with no audio and no source details, Web Share API with fallback, analytics events.
8. **YouTube scan.** "Connect YouTube" (mocked OAuth), video list with "I speak in this" confirmations, results with the coarse band, YouTube fix steps on source detail, once-a-day re-run. Merge results and dashboard.
9. **Settings, legal and tests.** Settings trimmed to v0, `legal.ts` rewritten (still marked draft until the lawyer reviews), smoke and screenshot tests, `BUILD_REPORT.md`.
10. **Real auth.** Supabase email magic link, server-side route protection.
11. **Real clone test.** Challenge service (speech-to-text check, synthetic-speech check), vendor from stage 2, rate limits and spend cap, deletion after generation, audit log.
12. **Real YouTube connection.** Google OAuth in Testing status with your test users, YouTube Data API listing, token encryption and revocation. Record the verification demo video from this build and submit (§2.3).

## 6. Post-demo (designed, not built)

Designs from revision 2, kept for after the demo:

- **TikTok tier A.** Display API `video.list` metadata of the user's own public videos. Needs app review; start the application when the demo is done.
- **Instagram.** Professional accounts through the Instagram API with Instagram Login. Personal accounts only through tier B or C (§2.1).
- **Tier B: voice matching on the user's own exports.** Instagram and TikTok "Download your data", Google Takeout, or individual files. Processed in the browser only (decision 8): a small speaker-embedding model in WebAssembly, audio never uploaded. The embedding comes from the clone-test recording in the same session and is discarded after the scan. Check model size and speed on a mid-range phone. Marketing trust line, scoped to uploads (§1).
- **Tier C: possible reposts.** Web search for the user's name and handles on the three platforms, listed as "check these" with the takedown draft. No audio fetched. Matching voices in other people's posts needs platform permission or a legal opinion.
- **Monitoring alerts.** All detectable without audio:

  | Alert | Trigger | Source |
  |---|---|---|
  | New public video on your account | A connected account has a new public video longer than 15 s | Tier A poll |
  | Old video public again | A video marked fixed is public again | Tier A |
  | Possible new repost | A new web result mentions the user's name or handle | Tier C, weekly |
  | Account disconnected | Token expired or revoked | Tier A |
  | Monthly summary | Once a month, only if there was activity | All |

  Not alertable: "your voice was found in someone else's video" and "your voice was cloned".
- **Full checklist.** The 5 places: voicemail greeting (per HK carrier), a second factor on voice verification, family code word, downloads/duets/stitches off, old accounts.
- **B2B2C partner entry**, Cantonese clone test and phrases, and any repeat voice matching (per-user encrypted embeddings with crypto-shredding).

## 7. Questions before starting

None block stage 1 or 2.

1. **Checklist in the demo.** Your v0 list doesn't mention it. Should the demo results show only the YouTube fix steps per video (already written in `remediation.ts`), or the full 5-place checklist as static content? I'd include both as static content, since it costs little and gives the demo a clear "what to do next".
2. **Domain.** Do you own `timbre.ai`? Google verification needs a verified domain hosting the homepage, privacy policy and terms.
3. **Clone vendor spike.** Is a GPU for self-hosting CosyVoice 2 acceptable for the spike (a few hours of a cloud GPU), and do you have or can you create a Google Cloud account for the key-only test?
4. **Age.** Keep 18+?
5. **Copy.** Will you write the new headline and CTA, or should I propose options in stage 3? Is "Your voice is the weapon, your parents are the target" the literal tagline?
6. **Missing file.** Does `voice-exposure-scanner-spec.md` exist, or should the link in `.plans/00` go?

## Sources

- Instagram: Meta, [Instagram Platform overview](https://developers.facebook.com/documentation/instagram-platform/overview), [Instagram API with Instagram Login, get started](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-instagram-login/get-started), [Instagram docs](https://developers.facebook.com/docs/instagram), [Basic Display API media reference (deprecation notice)](https://developers.secure.facebook.com/docs/instagram-basic-display-api/reference/media); secondary: [Instagram official APIs reference gist (Apr 2026)](https://gist.github.com/jameschapman2c/65eff9f54a2d350b17a6ce5127b9fe42), [Phyllo, Instagram API 2026](https://www.getphyllo.com/post/instagram-api-guide)
- Google voice replication: [Replicate voices (Google Cloud)](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/text-to-speech/voice-replication), [Voice replication (Gemini API)](https://ai.google.dev/gemini-api/docs/voice-replication), [Chirp 3: Instant Custom Voice](https://docs.cloud.google.com/text-to-speech/docs/chirp3-instant-custom-voice)
- Microsoft: [Personal Voices - Delete (REST 2026-01-01)](https://learn.microsoft.com/nl-nl/rest/api/aiservices/speechapi/personal-voices/delete?view=rest-aiservices-speechapi-2026-01-01), [Data, privacy and security for text to speech](https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/speech-service/text-to-speech/data-privacy-security), [Personal voice overview](https://learn.microsoft.com/azure/ai-services/speech-service/personal-voice-overview), [Create consent](https://learn.microsoft.com/en-my/Azure/ai-services/speech-service/personal-voice-create-consent)
- Resemble AI: [Delete a voice](https://docs.resemble.ai/api-reference/voices/delete-voice), [Delete a recording](https://docs.app.resemble.ai/docs/resource_recording/delete), [Terms of service](https://www.resemble.ai/terms-of-service), [Privacy policy](https://www.resemble.ai/privacy-policy), [Ethics](https://www.resemble.ai/ethics/)
- Cartesia: [Voice cloning](https://www.cartesia.ai/product/voice-cloning), [Pro Voice Clone docs](https://docs.cartesia.ai/build-with-cartesia/capability-guides/clone-voices-pro)
- ElevenLabs: [Zero Retention Mode](https://elevenlabs.io/docs/eleven-api/resources/zero-retention-mode); secondary: [ConductAtlas, privacy policy retention provision](https://conductatlas.com/platform/elevenlabs/elevenlabs-privacy-policy/provision/CA-P-064733/voice-data-retained-maximum-three-years/), [ConductAtlas, usage policy](https://conductatlas.com/platform/elevenlabs/elevenlabs-usage-policy/voice-cloning-without-consent-prohibition/)
- Pricing and quality (editorial, conflicting): [invideo TTS pricing (Aug 2026)](https://invideo.io/blog/ai-voice-model-pricing/), [Dupple, best voice cloning tools 2026](https://dupple.com/learn/best-ai-voice-cloning-tools), [Dupple, ElevenLabs alternatives](https://dupple.com/learn/elevenlabs-alternatives), [Costbench, Cartesia vs Resemble](https://www.costbench.com/compare/cartesia-vs-resemble-ai/)
- CosyVoice: Du et al., [CosyVoice](https://arxiv.org/pdf/2407.05407) (2024)
- Google OAuth: [Sensitive scope verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification), [OAuth 2.0 scopes](https://developers.google.com/identity/protocols/oauth2/scopes), [Manage app data access](https://support.google.com/cloud/answer/15549135?hl=en), [Testing-status refresh token expiry (Google Ads API docs)](https://developers.GOOGLE.com/google-ads/api/docs/get-started/common-errors), [Unverified-client 100-user cap (Google Health setup)](https://developers.google.com/health/setup?authuser=4); secondary: [Phyllo, YouTube OAuth scopes](https://www.getphyllo.com/post/youtube-oauth-scopes)
- YouTube: [API Services Developer Policies](https://developers.google.com/youtube/terms/developer-policies)
- TikTok: [Display API overview](https://developers.tiktok.com/docs/en/display-api-overview?enter_method=left_navigation), [Scopes](https://developers.tiktok.com/doc/tiktok-api-scopes)
- PCPD: [Biometric data guidance](https://www.pcpd.org.hk/english/whatsnew/biometric_data.html), [Newsletter on biometric data](https://pcpd.org.hk/misc/dpoc/newsletter20.html)
