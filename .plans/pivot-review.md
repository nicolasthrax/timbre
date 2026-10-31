# Pivot review

Status: review only. Revision 2, 31 Oct 2026, against `main` at `5e04de6`. Waiting for founder approval before implementation. The only code change on this branch is the "can't be downloaded" wording fix (§3.2).

## 0. Decisions recorded

From the founder, 31 Oct 2026:

1. The free exposure scan is a real automated scan. The 5-place checklist is the "what to do next" step after it.
2. Monitoring stays: it re-scans for new exposure and alerts the user.
3. The clone test is English only in v0, with room for Cantonese later.
4. Share format: a share card with no audio, plus a "play it to your family" moment on the same device.
5. Email-only sign-in. Rate limits per device and IP protect the free clone test.
6. The goal is a YC application: a working demo and user growth over revenue. The paywall stays paused.

These answers change §2 points 2, 3, 4 and 9 and most of §3. The biggest change is in §3.3. The platforms' official APIs give metadata, not audio, so a voice-matching scan that stays within their terms only works on audio the user hands us. The scan needs to be redesigned around that.

## 1. What exists today

- Docs: `.plans/00` to `05` describe a paid consumer product. A voiceprint is stored, public Instagram, TikTok and YouTube videos are scanned and matched automatically, a free scan shows a blurred report, and Pro (HK$68/month) unlocks sources, fixes, takedown drafts, the clone test and weekly monitoring. `DESIGN.md` is the token plan (direction C, "Where it was found"). `BUILD_REPORT.md` is the route map and mock/real table.
- Code: a Next.js 16 app with a mocked backend behind one interface (`src/lib/api/client.ts`, implemented by `mock.ts`, with `supabase.ts` stubbed). The landing page is `src/app/(marketing)/page.tsx`, with its copy in `src/content/`. The app flow is sign-in → consent → enrol (voiceprint) → accounts → scan progress → free results or Pro dashboard → source detail → clone test (Pro only) → settings (billing, monitoring, export, delete). Mic recording, level meter and random phrases are real. Everything else is mocked. Playwright smoke tests cover the happy path, upgrade, clone-test locking and deletion.
- With scanning and monitoring kept, more of the existing UI survives than revision 1 assumed: onboarding, scan progress, results and source detail can be adapted. The paywall, the Pro/free split and the precise risk score go.

## 2. Gap analysis

Key: **C** = change, **R** = remove, **A** = add.

### 1. Clone test is the headline and the shareable moment

| Where | What | Action |
|---|---|---|
| `.plans/01-prd.md` §3, §4 F4, §7, §8 | Goals, features, metrics and assumptions centre on the scan. F4 is "paid" | C: F4 becomes the lead feature. Activation metric is "% of signups who hear their clone" |
| `.plans/02-design.md` §1 to §4 | IA starts with the scan. The clone test is a leaf of the paid report | C: Landing → sign in → consent → clone test → result → share / start scan |
| `.plans/05-gtm-roadmap.md` §1, §2.6 | Positioning and share card are built on "47 minutes" | C |
| `DESIGN.md` Subject, Layout | Headline, CTA and waveform hero fixed by the old brief | C: new fixed copy and a new hero direction |
| `src/content/landing.ts` `hero`, `exampleScan`, `steps`, `finalCta`; `site.ts` | Scan-first copy | C |
| `src/app/(marketing)/page.tsx` | Hero figure is the example scan | C: hero becomes a labelled example real/clone pair |
| `src/components/MarketingHeader.tsx` | "Scan free" CTA, Pricing link | C |
| `src/content/cloneTest.ts` `lockedTitle`, `lockedBody`; `CloneTestView.tsx` `LockedCloneTest` | Pro gate | R |
| `src/components/AppShell.tsx`, `src/lib/routing.ts` | Exposure first in nav and routing | C: clone test first |
| Share card, "play it to your family" step | None | A: share card image with no audio and no scan numbers that identify sources; a full-screen replay step on the result screen |
| `tests/smoke.spec.ts` | Landing heading, "clone test is locked" | C |

### 2. Free one-time exposure scan, no precise score

| Where | What | Action |
|---|---|---|
| `.plans/01-prd.md` §4 F2, F3, §5 | Freemium gate table, minute thresholds, "47 minutes" aha | R F3 and §5. C F2 to the scan design in §3.3 |
| `src/lib/risk.ts`, `RiskBadge.tsx` | Low/Medium/High/Critical from matched seconds | C: a coarse band ("a lot", "some", "little") with the facts behind it, never a single precise number |
| `ExposureSummary.tsx` `ExposureHero` | Large minutes number | C: show counts we can actually measure (public videos with speech, rough speaking time) labelled as estimates |
| `results/ResultsView.tsx`, `StateNotices.tsx` `UpgradeCard` | Blurred sources, upgrade card | C: show all sources to everyone. R upgrade card |
| `mock.ts` `present()` redaction, the "no source URLs in free HTML" test | | R (nothing is hidden any more) |
| "One-time" | `mock.ts` refuses a second free scan | Keep one *manual* full scan per account. Monitoring re-scans run on their own (point 4). Confirm (§5 Q1) |
| `faq.ts` risk-score and "hidden on the free plan" answers | | C, R |

### 3. Automated scanning stays (revision 1 cut it)

| Where | What | Action |
|---|---|---|
| `.plans/03-tech-spec.md` §3.2 | Discovery table assumes we can fetch audio from the Instagram, TikTok and YouTube APIs | C: the APIs return metadata, not audio (§3.3). Rewrite around the three tiers there |
| `.plans/03` §3.3, §3.5 | Matching, diarisation, < 2% false-positive target | Keep for tier B (user-provided audio). Move tier C to "later, needs legal sign-off" |
| `.plans/04-privacy-legal.md` §4 | Already says "official APIs and user links, legal view before fetching" | C: make it concrete per platform with §3.3 |
| `onboarding/accounts/AccountsForm.tsx`, `lib/platforms.ts` | Handle text fields | C: "Connect" buttons (OAuth) per platform, plus an "upload your data export or videos" option, plus full name for web search |
| `scan/[id]/ScanProgress.tsx` | "Collecting public videos 32/50, matching your voice" | C: steps per tier ("Reading your public YouTube videos", "Checking your uploaded files", "Searching the web for reposts") |
| `sources/[id]/SourceDetail.tsx`, `SourceCard.tsx` | Per-source detail, "seconds matched", "confidence" | C: show "seconds matched" only for tier B; tier A shows "public video with speech, N min long"; tier C shows "possible repost, check it" |
| `types.ts` `Source` | `matchedSeconds`, `confidence` required | C: add `evidence: "metadata" | "voice-match" | "web-result"` with optional match fields |
| `src/content/remediation.ts` | Per-platform fix steps, takedown draft | Keep. Reused by the checklist (point 6). Help URLs still unverified |
| `ScanIssuesNotice` "platform limited our access" | Implies scraping | C: "not connected", "token expired, reconnect", "export couldn't be read" |

### 4. Monitoring stays, with defined alerts

| Where | What | Action |
|---|---|---|
| `.plans/01` F6, `02` Flow E, `03` scheduler and Resend | Weekly re-scan, email on new matches | C: free for everyone, with the alert list from §3.4 |
| `SettingsView.tsx` monitoring card | Pro only (`disabled={user.plan !== "pro"}`) | C: available to all; one toggle per alert type |
| `DashboardView.tsx` | Pro dashboard with trend and filters | C: becomes the single results view for everyone, merged with `ResultsView.tsx` |
| `types.ts` `User.monitoring`, `emailAlerts`; `client.ts` `setMonitoring` | | Keep; R the Pro check in `mock.ts` |
| Stored OAuth tokens | Not modelled | A: `linked_accounts.oauth_token_enc` already in `03` §4; add revoke-on-delete and reconnect states |
| Alert emails | None | A: templates for each alert in §3.4 |

### 5. Revenue moves to B2B2C

Unchanged from revision 1, plus the YC framing.

| Where | What | Action |
|---|---|---|
| `.plans/01` §6, §7, §8.1; `05` §1, §2.5, §3, §4, §5 | Pricing hypothesis, "charge from day one", MRR | C: partner model later; v0 metrics are activation, clone tests completed, shares, scans, week-over-week growth |
| `.plans/04` §1 | Company before taking payments | C: before the first partner contract, or earlier if YC needs it |
| `.plans/04` | No partner data rule | A: partners get aggregate data only (§3.5) |

### 6. Action checklist after the scan

| Where | What | Action |
|---|---|---|
| `.plans/01` F5 | Remediation is paid and per source | C: free; per-source fixes plus the 5-place checklist |
| `StateNotices.tsx` `LowExposureState` tips | Four tips, numbered like a sequence | C into the checklist, drop the numbering |
| `remediation.ts` | Privatise steps exist. No voicemail or voice-verification content | A: voicemail greeting (per HK carrier), "add a second factor to voice verification", family code word, turn off downloads/duets/stitches, check old accounts |
| Checklist page | None | A: persisted, with progress; items link to the sources the scan found |

### 7. Protect-your-family messaging

Unchanged from revision 1: `.plans/02` §1 tone rule, `landing.ts` `hero.subline` and `founder.body`, the clone-test result banner, `05` §2.3. See §3.6.

### 8. Live verification and abuse limits for the clone test

| Where | What | Action |
|---|---|---|
| `.plans/03` §3.4, §6; `04` §6 | One random phrase, "paid = deterrent" | C: §3.1 design, with the rate limits from decision 5 |
| `clone-test/page.tsx` | `pickPhrases(1)` in page render, no server challenge | C: server-issued challenge with expiry |
| `Recorder.tsx`, `useRecorder.ts` | 3 s minimum | C: about 10 to 20 s across 3 or 4 phrases |
| `phrases.ts` | English | Keep for v0. Add a `locale` field so Cantonese phrases can be added later |
| `client.ts` `requestCloneTest(liveSample)` | No challenge ID | C: `startCloneChallenge()` then `requestCloneTest(challengeId, sample)` |
| Failure states | Generic banner only | A: phrase mismatch, synthetic voice suspected, too short, rate-limited (with when to try again) |

### 9. Data minimisation and PDPO

| Where | What | Action |
|---|---|---|
| `.plans/03` §3.1, §4 | Voiceprint stored in `voiceprints` with pgvector | C: no stored voiceprint by default (§3.7). Separate, encrypted table only if the user opts into repeat voice matching |
| `.plans/04` §2, §3 | DPP table written around a stored voiceprint | C, plus the checklist in §3.8 |
| `src/content/consent.ts` "It can't be played back or turned back into audio" | Overclaims (§3.7) | C |
| `landing.ts` `privacyPromise`, `faq.ts` "What happens to my recording?" | "We keep a voiceprint" | C |
| `legal.ts` privacy §2 to §7, terms §1, §5, §6 | | C |
| `onboarding/enrol/*` | Voiceprint enrolment before scanning | C: the clone-test recording and the enrolment can be one recording, used once for both and then deleted (§3.7) |
| `SettingsView.tsx` delete copy | | C: list exactly what is deleted, including connected-account tokens and vendor-side copies |

### 10. Mainland China is a separate future product

Unchanged from revision 1. `.plans/00` links `../voice-exposure-scanner-spec.md`, which is not in the repo. `.plans/04` §2 and `05` §7 get one line saying Mainland is a separate product with its own PIPL review. No code is Mainland-specific.

### 11. Billing and paywall paused

Unchanged from revision 1. Remove `pricing.ts`, `PricingCards.tsx`, `Paywall.tsx`, `openPaywall`, `PlanBadge`, `UpgradeCard`, `LapsedBanner`, the Settings plan row, `Plan`/`BillingInterval`/`lapsedAt`/`upgrade` in the API layer, terms §5, the landing `#pricing` section, the `/dev/states` plan seeds and the upgrade smoke test. Mark Stripe and `subscriptions` in `.plans/03` as paused.

## 3. Challenges

### 3.1 Live verification and abuse limits

The threat is someone producing a clone of another person's voice through Timbre. The main control is structural: the clone is built only from audio captured live in that session, never from an upload, a stored voiceprint or anything found online. If someone records themselves, they only get a clone of themselves. The remaining attacks are feeding someone else's voice into the microphone:

1. Replaying an existing recording of the victim. A server-issued challenge stops this: 3 or 4 random phrases with a one-use ID and a 2 to 3 minute expiry, a speech-to-text match of at least 80% (the existing spec's threshold), and one continuous capture of plausible length.
2. Live voice conversion or TTS of the victim. The challenge doesn't stop this. Add a synthetic-speech check on the live sample (from the vendor, or an open model such as AASIST after a licence check). The marginal harm is low: the attacker already has a clone, and Timbre adds only one watermarked fixed sentence.
3. A tricked or coerced victim. Rate limits and the fixed sentence limit the value. Not fully preventable.

Abuse limits for a free test with email-only sign-in (decision 5):

- Per verified email: about 3 tests a month. The email must be verified before the challenge is issued. Block known disposable-email domains.
- Per IP: a sliding window, for example 10 tests a day. Hong Kong mobile carriers and campuses put many people behind one IP, so a strict IP limit will block real users at a university talk, which is one of the planned channels. Keep the IP limit loose and lean on the email limit.
- Per device: a signed, first-party cookie token. Avoid browser fingerprinting. It is personal data under the PDPO, needs disclosure, and is easy to get wrong.
- A global daily cap on vendor spend, so a viral spike or an attack can't run up an unbounded bill. The UI says "the clone test is busy, try again after HH:MM".
- Audit log of challenge IDs, outcomes and rate-limit hits, never the audio.

Vendor consent statements (Azure and Google require the speaker to read a fixed statement) can be one of the challenge phrases, so one recording does both jobs.

### 3.2 "Can't be downloaded" (fixed on this branch)

`controlsList="nodownload"` and a blocked context menu remove the easy save paths, but screen recording and the browser's network panel still work. The copy now says the clip is not offered as a download and is watermarked:

- `src/content/cloneTest.ts`: safeguard title "No download, and watermarked"; body "We don't offer the clip as a download, and it carries a watermark. The sentence is fixed by us, so it can't be used as a script."
- `src/content/legal.ts` terms §4: "watermarked and streamed, is not offered as a download, and is deleted at the end of your session. Recording or redistributing it is not allowed."
- `src/components/ClonePlayer.tsx`: comment saying copy must never claim the clip can't be saved.

The share card (decision 4) has no audio, so it doesn't reopen this.

### 3.3 Which platforms we can scan without breaking their terms

None of the three platforms' developer APIs gives us the audio of a user's videos to analyse. That is the constraint the scan has to be designed around.

| Platform | What the official API gives | Audio? | Terms risk |
|---|---|---|---|
| YouTube | YouTube Data API: the user's public uploads, titles, durations, view counts, captions metadata. Owners can authorise caption download | No. The Developer Policies bar API clients from storing copies of audiovisual content without YouTube's written approval, and the API has no media download | Low for metadata. Fetching audio (yt-dlp and similar) is a breach |
| TikTok | Display API `video.list` and `video.query`: metadata of the user's own public videos, for embedding | No. The docs frame it as display and embed | Low for metadata. App review required. The Research API is for academics only |
| Instagram | Basic Display API shut down on 4 Dec 2024. The Instagram API with Instagram Login gives own media (including `media_url`) for professional (business or creator) accounts. Sources disagree on personal accounts; most say professional only | Possibly, for professional accounts' own media, through `media_url`. Not for personal accounts | Medium: check Meta's Platform Terms on processing and storing media. Instagram's terms ban automated collection without permission, and Meta's Automated Data Collection Terms (Oct 2024) cover scrapers |
| Reposts by other people (all three) | A web search API can list candidate URLs mentioning a name or handle | No | Listing is fine under the search API's terms. Fetching audio from those URLs is the platform-ToS breach the current docs already warn about |

So a real automated scan has three tiers:

- **Tier A, automated and within the terms: metadata scan of connected accounts.** The user connects YouTube and TikTok (and Instagram if professional) with OAuth. We list public videos, their length and whether they likely contain speech (from captions where the owner authorises it, otherwise from the user confirming "that's me talking" on a list). This measures exposure without touching audio: "38 public videos, about 2 hours long, 31 with speech". It needs no voiceprint.
- **Tier B, voice matching on audio the user hands us.** The user uploads their platform data export (Instagram and TikTok "Download your data", Google Takeout for YouTube) or individual video files. These are the user's own copies, so platform terms don't apply to our processing. This gives true "minutes of your voice" for their own uploads. Exports can be several GB, so either match in the browser (a small speaker-embedding model in WebAssembly, so audio never leaves the device) or upload in chunks to the worker. In-browser matching is the stronger privacy story and removes server-side audio entirely.
- **Tier C, reposts by others.** Web search lists candidate URLs; we show them as "possible reposts, check these" with the takedown draft. No audio is fetched. Automated voice matching of other people's posts needs either written platform permission or a legal opinion, so it stays out of v0.

What this means for the founder's decisions:

- Decision 1 ("real automated scan") is met by tier A plus tier C, automatically, and tier B gives the "minutes of your voice" number for anyone who uploads. The headline result is less precise than "47 minutes found", which fits pivot point 2 (no precise score).
- It covers the user's own accounts and lists reposts. It cannot confirm the user's voice in other people's videos.
- Personal Instagram accounts can only be checked through tier B (the export) or tier C. Many people in the target group will have personal accounts.
- App review: YouTube needs a verified Google OAuth app (sensitive scopes may need a security assessment), and TikTok needs app review for Display API scopes. Both take weeks. Start applications in stage 1, in parallel with docs.

I could not fetch the platforms' current terms pages from this environment. The table comes from developer docs and secondary sources found by search; check each primary page before building.

### 3.4 Monitoring alerts, defined

Monitoring is only worth keeping if each alert is something we can detect and the user can act on. With the tiers above, these can be detected:

| Alert | Trigger | Source | User action |
|---|---|---|---|
| New public video on your account | A connected account has a new public video longer than 15 s since the last check | Tier A, daily or weekly API poll | Open it in the checklist: keep, make private or remove audio |
| Old video made public again | A video previously marked fixed (private or deleted) is public again | Tier A | Re-fix |
| Possible new repost | A new web-search result mentions the user's name or handle on one of the three platforms | Tier C, weekly | Review; use the takedown draft |
| Account disconnected | OAuth token expired or revoked, so monitoring has stopped | Tier A | Reconnect |
| Monthly summary | Once a month, only if there was activity | All | None |

Not alertable: "your voice was found in someone else's video" (needs tier C matching) and "your voice was cloned" (not detectable, and the copy must keep saying so).

Cost: tier A polling is API quota, not GPU. YouTube Data API's default daily quota is limited, so polling frequency per user needs a budget. Tier C needs a paid search API, so weekly at most.

### 3.5 B2B2C

Unchanged from revision 1, with the YC goal on top:

- Buyer and user don't match. Banks lose money through the parent, not the young adult. That can be the pitch ("we reach your customers' children").
- The checklist item "avoid voice-only verification" clashes with banks that use voice ID. I believe HSBC Hong Kong offers Voice ID for phone banking, but I haven't checked that in this session. Phrase it as "add a second factor".
- Partners get aggregate data only, or a PDPO new-purpose (DPP3) and direct-marketing (Part VI A) review applies.
- For YC, the numbers to show are clone tests completed, shares that turn into signups, scans connected and week-over-week growth. Set up analytics events for those in the clone-test and scan stages, not later.
- Terms say 18+. Campus channels may reach under-18s. Still open (§5 Q4).

### 3.6 Family messaging vs the brand rules

Unchanged. "Your voice is the weapon, your parents are the target" is accurate and not a claim about Timbre, but it is stronger than `02` §1 ("never cheap fear tactics"). Suggested rule: every fear line is followed by a concrete action on the same screen. English only in v0 (decision 3), while parents are reached in Cantonese; the share card and the "play it to your family" step are where that gap shows first.

### 3.7 Voiceprints: storage, deletion and security

With tier B the only place voice matching happens, a stored voiceprint is needed only if the user wants repeat matching on new uploads. Recommendation for v0: **don't store one**.

- One recording, used twice, then deleted. The clone-test challenge recording (about 15 s of verified live speech) can also produce the embedding for tier B matching in the same session. The embedding lives in memory (or in the browser, if matching runs there) for the length of the scan and is then discarded. Raw audio is deleted when the clone is generated.
- If the user later uploads more files, they record a new challenge. That costs 15 s and re-verifies them, which is also good for abuse control.
- If repeat matching is added later (opt-in):
  - Separate `voiceprints` table holding the embedding encrypted with a key held in a KMS (envelope encryption), not plain pgvector rows. Matching decrypts in the worker only.
  - Row-level security that denies all client reads; only the worker's service role can read.
  - Key per user, so deleting the key makes the embedding unrecoverable even in backups (crypto-shredding).
  - Deletion: on account deletion, voiceprint deletion in Settings, consent withdrawal, or 12 months of inactivity. Backups: say in the privacy policy how long Supabase point-in-time recovery keeps data, and rely on the destroyed key for anything in backups.
  - Audit log entry for every create, read by the worker, and delete.
- Copy fix needed: `consent.ts` and `faq.ts` say the voiceprint "can't be played back or turned back into audio". It can't be played back, but speaker embeddings carry enough information that partial reconstruction of voice characteristics has been studied in research. I haven't checked the current state of that research in this session. Say "can't be played back" and drop "can't be turned back into audio" unless the chosen model's documentation supports it.
- Clone-vendor copies: whichever vendor generates the clone may keep the uploaded sample or a speaker model. Use the vendor's delete API immediately after generation, and confirm in writing how long their logs keep audio. This is now the largest stored-voice risk, larger than our own database.
- OAuth tokens for monitoring are also sensitive. Encrypt at rest, request read-only scopes, revoke at the platform on deletion, and show "connected accounts" with a disconnect button in Settings.

### 3.8 PDPO items for a lawyer

1. Biometric data. The PCPD's *Guidance on Collection and Use of Biometric Data* (revised, date to confirm) asks for necessity, free and informed choice, consideration of less intrusive alternatives, and prompt purging. A transient embedding is still biometric data. The "don't store" default in §3.7 is the strongest answer to the necessity test.
2. Vendor as data processor: DPP2(3) and DPP4(2) contractual controls on retention and security, for both the clone vendor and any cloud speech service.
3. Cross-border transfer: vendor and Supabase regions must be disclosed. Section 33 is not in force, but DPP1 and DPP5 disclosure still applies.
4. OAuth data from platforms: the platform metadata we pull is personal data too; retention and deletion rules apply.
5. Web search results about the user can include other people's posts and names. Store only the URL and the matched handle, and only for the requesting user.
6. Partner data sharing (§3.5): DPP3 and Part VI A.
7. Minors, if 18+ is relaxed.
8. Rate-limit data: device tokens and IPs kept for abuse control need a stated retention period (for example 30 days).
9. A privacy impact assessment, which the PCPD guidance recommends for biometric systems.
10. Any 2025 or 2026 PDPO amendment. A quick search found none; ask the lawyer to confirm.

### 3.9 Voice-cloning vendors

Unchanged from revision 1, with Cantonese no longer a v0 requirement. That widens the choice for v0 but the spike should still record Cantonese quality so the later switch is known.

| Option | Consent and verification | Notes |
|---|---|---|
| Microsoft Azure AI Speech, personal voice | Speaker reads a consent statement, which Microsoft uses to check the speaker matches the sample. Limited Access application required | Best consent fit. Approval for a small startup is uncertain. Watermarking not confirmed |
| Google Cloud Chirp 3 Instant Custom Voice | Fixed consent statement up to 10 s, recorded in the same environment as the reference audio. No custom consent script | Possibly allowlisted, not confirmed |
| ElevenLabs | Usage policy bans cloning without consent. Professional cloning has a verification step; instant cloning relies on the account holder's attestation | Timbre carries the consent responsibility. Check that a consumer-facing clone feature is allowed on our plan |
| Resemble AI | Recorded consent clip in the target voice. Neural watermark (PerTh) | The watermark helps our safeguards |
| Self-hosted CosyVoice 2 | None built in | Cantonese supported. Licence reported as Apache-2.0 by third parties: verify code and weights. No watermark: add our own |

For each: does it keep the sample or a speaker model, and can we delete it immediately by API; does it train on customer data; do its terms allow a consumer clone feature; where is processing done.

### 3.10 Smaller points

- 10 to 20 s of clean speech is needed for a convincing zero-shot clone. The current 3 s minimum is too short.
- `DESIGN.md` says the headline, CTA and founder story are fixed by the brief. New fixed copy is needed.
- `.plans/00` links a file that is not in the repo.
- In-browser matching (tier B) adds a model download of a few MB to tens of MB. Check it on a mid-range phone, since most visitors arrive from Instagram on mobile.

## 4. Implementation plan

Each stage is one small PR. Stage 0 is already on this branch.

0. **Done on this branch:** "can't be downloaded" wording (§3.2).
1. **Docs.** `01-prd.md` (clone test first, tiered scan, defined alerts, free everything, YC metrics), `02-design.md` (IA, flows, screens, states for connect / upload / reconnect), `03-tech-spec.md` (tiers A to C, verification design, rate limits, no stored voiceprint, OAuth token handling, Stripe paused), `04-privacy-legal.md` (§3.7 storage rules, §3.8 checklist, per-platform terms from §3.3, partner data rule), `05-gtm-roadmap.md` (B2B2C later, YC metrics, Mainland separate), `00-README.md`, `DESIGN.md` subject. In parallel, outside the repo: start the Google OAuth verification and TikTok app review applications.
2. **Vendor spike, written up only.** `.plans/06-clone-vendor-decision.md`. English quality first, Cantonese recorded for later, plus consent flow, deletion, region and cost.
3. **Landing copy.** `landing.ts`, `faq.ts`, `site.ts`, `cloneTest.ts` intro, `consent.ts` voiceprint claims. `scripts/slop-check.sh`. Update the landing test.
4. **Landing structure and paywall removal.** New hero with a labelled example clip, sections re-ordered, remove `#pricing`, `PricingCards`, `pricing.ts`, header Pricing link. Hero direction in `DESIGN.md` first. Screenshots at 320 px and desktop.
5. **Remove plans and billing from the app.** `Paywall`, `openPaywall`, `PlanBadge`, `UpgradeCard`, `LapsedBanner`, Settings plan row, `Plan`/`upgrade`/redaction, related tests and seeds. All sources visible to everyone.
6. **Clone test flow (mocked).** Unlocked for signed-in users. `startCloneChallenge()` → `requestCloneTest(challengeId, sample)`. 3 or 4 phrases, longer minimum, verification and rate-limit failure states, the "play it to your family" step, share card. New users land here after consent. Analytics events for the YC metrics.
7. **Scan flow (mocked), tiers A and C.** Connect buttons per platform, full name for web search, new progress steps, results showing counts and a coarse band, `Source.evidence` types, reconnect states. Merge `ResultsView` and `DashboardView`.
8. **Scan tier B (mocked).** Upload a data export or files, in-browser or chunked matching (decide in stage 1), reuse the clone-test recording for the embedding.
9. **Checklist.** The 5 places plus per-source fixes from `remediation.ts`, progress saved, linked from results.
10. **Monitoring.** Settings toggles per alert type (§3.4), connected-accounts list with disconnect, mocked alert history.
11. **Legal drafts and Settings.** `legal.ts` for the new data flows, delete copy listing tokens and vendor copies, still marked as drafts.
12. **Tests and report.** Smoke and screenshot specs for the new flow, `BUILD_REPORT.md`, `README.md`.

Real backend work (Supabase, the verification service, the clone vendor, OAuth integrations, the matching worker, alert emails) follows, in the order the YC demo needs: clone test first, then tier A.

## 5. Remaining questions

None of these block stage 1. Q1 and Q2 should be settled before stage 7.

1. **"One-time" scan.** One manual full scan per account, with monitoring re-scans on top? Or should users be able to re-run it manually?
2. **Tier B.** Is "upload your data export" acceptable friction for v0, and do you prefer in-browser matching (stronger privacy, heavier page) or server-side (simpler, audio leaves the device)?
3. **Tier C matching.** Do you want a lawyer's view now on matching voices in other people's public posts, or leave it out until after the YC application?
4. **Age.** Keep 18+?
5. **Partners.** Confirm aggregate data only. Any partner-facing page in v0?
6. **Voice-only verification wording.** OK to phrase it as "add a second factor"?
7. **Copy.** Will you write the new headline and CTA, or should I propose options in stage 3? Is "Your voice is the weapon, your parents are the target" the literal tagline?
8. **Elder-side features.** Anything for parents in v0 beyond the replay step (a code-word card, a message to send them)?
9. **Vendors.** Willing to apply for Azure Limited Access? Is self-hosting a GPU model acceptable for the spike?
10. **Missing file.** Does `voice-exposure-scanner-spec.md` exist, or should the link go?

## Sources

- YouTube, [API Services Developer Policies](https://developers.google.com/youtube/terms/developer-policies); [policies mirror quoting the storage clause](https://www.futo.org/legal/Youtube-Legal-1.pdf)
- TikTok for Developers, [Display API overview](https://developers.tiktok.com/docs/en/display-api-overview?enter_method=left_navigation), [Display API get started](https://developers.tiktok.com/docs/en/display-api-get-started), [Video query](https://developers.tiktok.com/docs/en/tiktok-api-v2-video-query), [Scopes](https://developers.tiktok.com/doc/tiktok-api-scopes)
- Meta, [Basic Display API media reference (deprecation notice)](https://developers.secure.facebook.com/docs/instagram-basic-display-api/reference/media); [developer forum thread on Instagram Login](https://developers.secure.facebook.com/community/threads/550093114183058); secondary: [Phyllo, Instagram API 2026 guide](https://www.getphyllo.com/post/instagram-api-guide), [Zernio, Instagram API 2026](https://zernio.com/blog/instagram-api)
- Scraping law and terms: [Farella Braun + Martel on Meta v. Bright Data](https://www.fbm.com/post/102kqw7/) (N.D. Cal., Jan 2024); [ScrapeOps summary of Instagram and Meta terms](https://scrapeops.io/websites/instagram/)
- Microsoft, [Personal voice overview](https://learn.microsoft.com/azure/ai-services/speech-service/personal-voice-overview), [Create consent](https://learn.microsoft.com/en-my/Azure/ai-services/speech-service/personal-voice-create-consent), [How to use personal voice](https://learn.microsoft.com/fi-fi/azure/ai-services/speech-service/personal-voice-how-to-use), [Code of conduct](https://learn.microsoft.com/ko-kr/legal/cognitive-services/speech-service/text-to-speech/code-of-conduct), [Speaker recognition retirement](https://learn.microsoft.com/hr-hr/azure/cognitive-services/speech-service/speaker-recognition-overview); The Register, [Azure AI Speech updates](https://theregister.com/2025/07/31/microsoft_updates_azure_ai_speech)
- Google Cloud, [Chirp 3: Instant Custom Voice](https://docs.cloud.google.com/text-to-speech/docs/chirp3-instant-custom-voice)
- ElevenLabs policy summaries (secondary): [ConductAtlas safety policy](https://conductatlas.com/platform/elevenlabs/elevenlabs-safety-policy/), [ConductAtlas usage policy](https://conductatlas.com/platform/elevenlabs/elevenlabs-usage-policy/voice-cloning-without-consent-prohibition/), [Terms.law](https://terms.law/ai-output-rights/elevenlabs/)
- Resemble AI, [Ethics](https://www.resemble.ai/ethics/); Zohaib Ahmed, [Senate Judiciary testimony](https://www.judiciary.senate.gov/download/2024-04-16-pm-testimony-ahmed?download=1) (16 Apr 2024)
- Du et al., [CosyVoice](https://arxiv.org/pdf/2407.05407) (2024); [WenetSpeech-Yue](https://arxiv.org/pdf/2509.03959) (2025)
- PCPD, [Biometric data guidance](https://www.pcpd.org.hk/english/whatsnew/biometric_data.html), [Newsletter on biometric data](https://pcpd.org.hk/misc/dpoc/newsletter20.html); Baker McKenzie, [summary of the 2015 guidance](https://www.bakermckenzie.com/-/media/files/insight/publications/2015/07/privacy-commissioner/al_hongkong_cautionsbiometricdata_jul15.pdf?la=en)
