# Pivot review

Status: review only, nothing implemented. Written 31 Oct 2026 against `main` at `5e04de6`. Waiting for founder approval before any change.

## 1. What exists today

- Docs: `.plans/00` to `05` describe a paid consumer product. A voiceprint is stored, public Instagram, TikTok and YouTube videos are scanned and matched automatically, a free scan shows a blurred report, and Pro (HK$68/month) unlocks sources, fixes, takedown drafts, the clone test and weekly monitoring. `DESIGN.md` is the token plan (direction C, "Where it was found"). `BUILD_REPORT.md` is the route map and mock/real table.
- Code: a Next.js 16 app with a mocked backend behind one interface (`src/lib/api/client.ts`, implemented by `mock.ts`, with `supabase.ts` stubbed). The landing page is `src/app/(marketing)/page.tsx`, with its copy in `src/content/`. The app flow is sign-in → consent → enrol (voiceprint) → accounts → scan progress → free results or Pro dashboard → source detail → clone test (Pro only) → settings (billing, monitoring, export, delete). Mic recording, level meter and random phrases are real. Everything else is mocked. Playwright smoke tests cover the happy path, upgrade, clone-test locking and deletion.
- The current product depends on three things the pivot removes: the voiceprint, automated scanning and the paywall. Most of the app UI is built on them.

## 2. Gap analysis

Key: **C** = change, **R** = remove, **A** = add.

### 1. Clone test is the headline and the shareable moment

| Where | What | Action |
|---|---|---|
| `.plans/01-prd.md` §3, §4 F4, §7, §8 | Goals, feature list, metrics and assumptions centre on the scan. F4 is "paid" | C: make F4 the primary feature and the activation metric ("% of signups who hear their clone") |
| `.plans/02-design.md` §1, §2, §3 Flow A/C, §4 | The IA starts with the scan. The clone test is a leaf reached from the paid report | C: new IA, Landing → sign in → consent → clone test → result → share / checklist |
| `.plans/05-gtm-roadmap.md` §1, §2.6 | Positioning and share card are built on "47 minutes" | C |
| `DESIGN.md` Subject, Layout | The headline "How much of your voice is out there?", the CTA and the waveform hero are fixed by the old brief | C: new fixed copy and a new hero direction. Direction C is about *where the voice was found*, which no longer exists |
| `src/content/landing.ts` `hero`, `exampleScan`, `steps`, `finalCta` | Everything is scan copy | C |
| `src/content/site.ts` | Title and description | C |
| `src/app/(marketing)/page.tsx` | Hero figure with the example scan waveform | C: hero becomes a real/clone listen-and-compare demo |
| `src/components/MarketingHeader.tsx` | "Scan free" CTA, Pricing link | C |
| `src/content/cloneTest.ts` | `lockedTitle` and `lockedBody` | C, R |
| `clone-test/CloneTestView.tsx` | `LockedCloneTest` and the Pro gate | R gate, C flow |
| `src/components/AppShell.tsx` | Nav order: Exposure first | C: clone test first |
| `src/lib/routing.ts` `resolveHome` | Sends users to enrol → accounts → scan | C |
| Share | None exists | A: share asset (see §3.2 for what it can safely contain) |
| `tests/smoke.spec.ts` | Landing heading, "clone test is locked" test | C |

### 2. Exposure scan becomes a free, one-time wake-up call with no precise score

| Where | What | Action |
|---|---|---|
| `.plans/01-prd.md` §3 G1, §4 F2, F3, §5 | Freemium gate table, risk-score thresholds, "47 minutes" aha | R F3 and §5. C F2 |
| `src/lib/risk.ts`, `RiskBadge.tsx` | Low/Medium/High/Critical from matched seconds | R or C to a coarse qualitative band from self-audit answers |
| `ExposureSummary.tsx` `ExposureHero` | Large minutes number, risk badge | R |
| `results/ResultsView.tsx`, `StateNotices.tsx` `UpgradeCard` | Blurred sources, upgrade card | C into the audit result, R the upgrade card |
| `dashboard/DashboardView.tsx`, `Sparkline.tsx` | Repeat scans, trend | R |
| `src/content/faq.ts` "What is the risk score?", "Why are source details hidden" | | R, C |

### 3. No automated cross-platform scanning in v0; replace with a guided self-audit

| Where | What | Action |
|---|---|---|
| `.plans/03-tech-spec.md` §2, §3.2, §3.3, §3.5, §7, §8 | Discovery, matching, diarisation, accuracy gate, search API, cost model | R from v0 (move to an appendix as "later") |
| `.plans/04-privacy-legal.md` §4, §5 | Platform ToS and third-party voices exist because of scanning | Mostly moot. Keep a short note |
| `.plans/05` Phase 1 gate (false positives < 2%) | | R |
| `onboarding/accounts/AccountsForm.tsx`, `lib/platforms.ts` | Handles and full name for search | R or C into self-audit questions |
| `scan/[id]/ScanProgress.tsx` | Progress steps | R |
| `sources/[id]/SourceDetail.tsx`, `SourceCard.tsx` | Per-source detail, fixed/ignored state | R. Reuse the fix steps inside the audit |
| `src/content/remediation.ts` | Per-platform fix steps and takedown draft | Keep and C: this becomes most of the self-audit content. Help URLs are still unverified (BUILD_REPORT §7) |
| `src/content/landing.ts` `platformsSection` | "What we look for" | C into "the 5 places to check" |
| Self-audit | None exists | A: `/check` flow with 5 steps, each with "how to check", "how to fix" and done/not yet/not applicable |
| `lib/api/types.ts` `Scan`, `Source`, `ScanIssue`, `LinkedAccount`; `mock.ts`, `mock-data.ts` | | R, A audit types |
| `public/thumbnails/*` | | R |

### 4. Replace or cut monitoring

There is nothing to monitor once scanning is gone (see §3.4). I recommend cutting it.

| Where | What | Action |
|---|---|---|
| `.plans/01` F6, §8.4; `02` Flow E; `03` scheduler, Resend; `05` §7 | | R |
| `SettingsView.tsx` "Monitoring" card | Weekly scans and email alert toggles | R |
| `DashboardView.tsx` `nextScanIn` | | R |
| `types.ts` `User.monitoring`, `User.emailAlerts`; `client.ts` `setMonitoring`, `setEmailAlerts` | | R |
| `faq.ts`, `pricing.ts` | Mentions weekly monitoring | R |

### 5. Revenue moves to B2B2C (banks, telcos, insurers)

| Where | What | Action |
|---|---|---|
| `.plans/01` §6, §7, §8.1; `05` §1, §2.5, §3, §4 Phase 2/4, §5 | Pricing hypothesis, funnel, "charge from day one", MRR | C: partner model, consumer activation metrics, partner pipeline |
| `.plans/04` §1 | "Register a company before taking payments" | C: register before signing the first partner contract |
| Partner entry | None | A later: partner codes or co-branded landing. Not needed for v0 |
| `.plans/04` | No section on sharing data with partners | A: what a partner gets back (recommend aggregate only, see §3.5) |

### 6. Concrete action checklist after the scan

| Where | What | Action |
|---|---|---|
| `.plans/01` F5 | Remediation is paid and per source | C into a free checklist |
| `StateNotices.tsx` `LowExposureState` tips | Four tips, numbered like a sequence | C into the checklist and drop the numbering (it is not a sequence) |
| `remediation.ts` | Privatise steps exist per platform. No voicemail or voice-verification content | A: voicemail greeting (per HK carrier), voice-only verification, family code word |
| Checklist page | None | A: persisted checklist with progress |

### 7. Messaging: protect your family

| Where | What | Action |
|---|---|---|
| `.plans/02` §1 | "Calm confidence, never cheap fear tactics" | C: decide how hard to push (see §3.6) |
| `.plans/01` §3 non-goals | Elder-side features are out | Decide whether a "share with your parents" message is in v0 |
| `landing.ts` `hero.subline`, `founder.body` | Already mention families, but secondary | C |
| `cloneTest.ts` result banner ("Why this matters") | | C |
| `05` §2.3 | "Protect your parents" is channel 3 | C: becomes the main message |

### 8. Strong live verification for the clone test

| Where | What | Action |
|---|---|---|
| `.plans/03` §3.4, §6; `04` §6 | One random phrase, "paid = deterrent" | C: the deterrent is gone, so verification must carry more weight (see §3.1) |
| `clone-test/page.tsx` | `pickPhrases(1)` picked in the page render, not tied to a server-issued challenge | C: server-issued challenge with expiry |
| `Recorder.tsx`, `useRecorder.ts` | 3 s minimum for the clone test | C: a longer sample is needed for clone quality |
| `phrases.ts` | English only | C: Cantonese phrases if the clone is in Cantonese |
| `client.ts` `requestCloneTest(liveSample)` | No challenge ID | C: `startCloneChallenge()` then `requestCloneTest(challengeId, sample)` |
| Verification failure states | None (only a generic error banner) | A: phrase mismatch, replay suspected, too short, rate-limited |

### 9. Data minimisation and PDPO

| Where | What | Action |
|---|---|---|
| `.plans/03` §3.1, §4 | ECAPA voiceprint, `voiceprints` table, pgvector | R: without matching there is no reason to keep a voiceprint |
| `.plans/04` §2 DPP table, §3 | Written around a stored voiceprint | C, plus a PDPO checklist (§3.7) |
| `src/content/consent.ts` | "A voiceprint, not a recording", "We keep a voiceprint" | C |
| `landing.ts` `privacyPromise`, `faq.ts` "What happens to my recording?" | | C |
| `legal.ts` privacy §2, §3, §4, §7; terms §1, §4, §5, §6 | | C |
| `onboarding/enrol/*` | Voiceprint enrolment | R (the live recording moves into the clone test) |
| `types.ts` `Voiceprint`, `getVoiceprint`, `enrolVoice` | | R |
| `SettingsView.tsx` delete copy | "voiceprint, linked accounts, scans" | C |

### 10. Mainland China is a separate future product

| Where | What | Action |
|---|---|---|
| `.plans/00` | Mentions `../voice-exposure-scanner-spec.md` (not in the repo) | C: drop or add the file |
| `.plans/04` §2 last line, `05` §7 | "If later serving Mainland users", "Future expansion: Mainland China" | C: one line saying it is a separate product with its own PIPL review, not a follow-on |
| Code | Nothing Mainland-specific | No change |

### 11. Billing and paywall paused

| Where | What | Action |
|---|---|---|
| `.plans/01` §6, `03` Stripe, webhook, `subscriptions` table, `04` §1 | | C: mark as paused |
| `src/content/pricing.ts`, `PricingCards.tsx`, `Paywall.tsx` | | R |
| `SessionProvider.tsx` `openPaywall` and the mounted `<Paywall>` | | R |
| `AppShell.tsx` upgrade button, `PlanBadge` | | R |
| `StateNotices.tsx` `LapsedBanner`, `UpgradeCard` | | R |
| `SettingsView.tsx` Plan row, Manage billing | | R |
| `types.ts` `Plan`, `BillingInterval`, `lapsedAt`; `client.ts` `upgrade`; mock redaction (`present`) | | R |
| `legal.ts` terms §5 "Subscriptions and billing" | | R |
| Landing `#pricing` section | | R |
| `dev/states/StatesGallery.tsx`, `tests/helpers.ts` `seed(plan)`, `screenshots.spec.ts` paywall shot, smoke "upgrade" test | | C, R |

## 3. Challenges to the pivot

### 3.1 How live verification would work, and what it does not stop

The threat is someone producing a clone of *another person's* voice through Timbre. The strongest control is structural: **the clone is built only from audio captured live in that session**, never from an upload, a stored voiceprint or anything found online. If someone records themselves, they only get a clone of themselves. So the attacks that matter are feeding someone else's voice into the microphone during the session:

1. Replaying an existing recording of the victim. A random, server-issued challenge stops this. The server issues 3 to 4 phrases with a one-use ID and a 2 to 3 minute expiry. Speech-to-text must match the phrases (the current tech spec says at least 80%). The audio must be one continuous capture of plausible length. Old recordings do not contain the phrases.
2. Live voice conversion or TTS of the victim saying the phrases. The challenge does not stop this, because an attacker who already has a clone can make it say anything. Add an anti-spoofing (synthetic speech) check on the live sample, from the vendor or an open model such as AASIST (check its licence). The marginal harm is low here: the attacker already has a working clone, and Timbre adds only a watermarked clip of one fixed sentence.
3. A coerced or tricked victim (a "read this aloud for me" prank). Rate limits and the fixed sentence limit the value. This cannot be fully prevented.

Supporting controls: sign-in with a verified email or HK phone number, one account per phone number, about 3 tests per account per month, a fixed harmless output sentence, audible plus inaudible watermarking, and an audit log of challenge IDs and outcomes (not the audio).

What the pivot loses: `04` §6 relied on "paid accounts only (payment identity = deterrent)". A free, viral clone test removes that. Phone verification is the cheapest replacement, but it adds friction at the moment you want sharing.

**The current "can't be downloaded" promise is not true.** `controlsList="nodownload"` and a blocked context menu do not stop screen recording or the browser's network tab. `cloneTest.ts` and terms §4 should say "not offered as a download, watermarked, deleted after the session" instead.

Vendor consent recordings fit well here. Azure and Google both require the speaker to read a fixed consent statement (below). That statement can be part of the live challenge, so one recording does both jobs.

### 3.2 "Shareable moment" contradicts the safeguards

Point 1 wants the clone to be shareable. The existing safeguards (and point 9) say the clip is not downloadable and is deleted after the session. Sharing the audio would also put a clean sample of the user's real voice, plus a clone of it, onto Instagram, which is the exposure Timbre warns about. Options:

- Share an outcome card with no audio ("I heard an AI clone of my voice. Took 2 minutes. Try yours") and a link. Recommended.
- Share a short watermarked clone-only clip. It spreads the user's voice and conflicts with the product's own advice. I'd avoid it.
- Let the user replay the result to a family member on the same device ("play it to your mum"). This fits point 7 and needs no file.

### 3.3 If there is no automated scan, what is the "exposure scan"?

Points 2 and 3 conflict. Point 2 keeps a free one-time "exposure scan", and point 3 removes automated scanning. Without scanning, the "scan" is the self-audit questionnaire. Two readings:

- (a) The scan *is* the 5-place self-audit, and the result is a qualitative band ("a lot of your voice is public") from the answers. Simplest, and no audio processing beyond the clone test.
- (b) A thin automated check of links the user pastes, or their own YouTube channel through the official API. This brings back the voiceprint, matching, accuracy targets and platform ToS questions.

I recommend (a) for v0. It also means **no voiceprint is needed at all**, which settles most of point 9.

### 3.4 Monitoring has nothing to alert on

Without scanning, Timbre has no new exposure to detect. The alerts that could be defined are "new HK voice-scam pattern reported by the police" (content, not monitoring) or a periodic "re-check your 5 places" reminder. Neither justifies a subscription. Recommend: cut monitoring from v0 and the PRD, and keep "re-check reminder" as an opt-in email in the backlog.

### 3.5 B2B2C questions

- Buyer and user don't match. Banks lose money when the *parent* (their account holder) transfers funds. Timbre's user is the young adult. That can be a strength ("we reach your customers' children") but it needs to be the pitch, and banks may want the parent-side features that the PRD lists as non-goals.
- Tension with point 6. HSBC Hong Kong has offered Voice ID for phone banking. Telling users to "avoid voice-only verification" while pitching banks is awkward if the partner uses voice biometrics. The checklist wording needs care ("add a second factor" rather than "don't use your bank's voice ID").
- Data back to partners. If a partner gets anything identifiable (who took the test, their results), that is a new purpose under DPP3, and possibly direct marketing under PDPO Part VI A if the partner uses it for marketing. Recommend: partners get aggregate counts only, written into the consent copy and the partner contract.
- Validation order. Banks will ask for consumer traction first. With billing paused and no partner revenue, v0 is a pure demand test. The success metric should be stated as activation and sharing numbers that a partner would care about.
- Age. The terms say 18+. "Young consumers" and campus channels may reach under-18s. Decide whether 18+ stays.

### 3.6 Family messaging vs the brand rules

"Your voice is the weapon, your parents are the target" is stronger than `02` §1 ("never cheap fear tactics") and `04` §8 (no claims that Timbre stops scams). The line itself is accurate and not a claim about Timbre, so it can work. It needs one rule: every fear line is followed by a concrete action. Also confirm whether the tagline is English, Cantonese or both. Parents in HK are reached in Cantonese.

### 3.7 Clone-test language

The scam call to a HK parent would be in Cantonese. An English clone is a weaker wake-up call, and Cantonese support among cloning vendors is uneven. This affects vendor choice more than anything else. The PRD currently lists non-English UI as a non-goal.

### 3.8 Voice-cloning vendors

I could not fetch primary terms pages from this environment. The points below come from vendor docs and secondary summaries found by web search, and must be checked against each vendor's current terms before choosing.

| Option | Consent and verification | Cantonese | Data and region | Notes |
|---|---|---|---|---|
| Microsoft Azure AI Speech, personal voice | A verbal consent statement read by the speaker is required. Microsoft uses it to check the speaker matches the sample. Access is Limited Access (application, approved use cases only) | The docs show a personal voice switching to zh-HK via SSML. Locale table not confirmed | Azure regions include East Asia (Hong Kong) for Speech in general. Check which regions host personal voice | Best consent fit. Risk: a tiny startup may not be approved, or "consumer clone demo" may not be an approved use case. Watermarking not confirmed |
| Google Cloud Chirp 3 Instant Custom Voice | A fixed consent statement (no custom script) up to 10 s, recorded in the same environment as the reference audio | Not confirmed. Consent sentence is per locale, so check that a zh-HK / yue locale exists | Check region and model retention | Rate limit noted in docs: 10 voice-cloning keys per minute per project. Possibly allowlisted, not confirmed |
| ElevenLabs | The usage policy bans cloning without consent. Professional cloning has a verification step. Instant cloning relies on the account holder's attestation | Anecdotal only | US company. Voices are stored on their side until deleted | As a platform letting end users clone, Timbre carries the consent responsibility. Check whether reselling cloning to end users is allowed on our plan |
| Resemble AI | Requires a recorded consent clip in the target voice. Has a neural watermark (PerTh) | Not checked | Check | Watermark is a plus for our safeguards |
| Self-hosted CosyVoice 2 (Alibaba) | None built in. We own all misuse controls | Cantonese is a listed language in the paper | Runs on our GPU, so nothing leaves our infrastructure | Licence reported as Apache-2.0 by third parties. Verify the code *and weights* licence on the official repo. No watermark: we add our own |

My recommendation: run a short spike (stage 2 below) comparing Azure personal voice and self-hosted CosyVoice 2 on Cantonese quality, with ElevenLabs as the quality benchmark. Score each on Cantonese quality, consent fit, deletion API, region and cost per test.

Whatever the vendor, check: (1) whether they keep the uploaded sample or a speaker model after the call, and whether we can delete it immediately by API, (2) whether they train on customer data and how to opt out, (3) whether their terms allow a consumer-facing clone feature, (4) where processing happens, for the cross-border disclosure.

### 3.9 PDPO items to check with a lawyer

Flagged per point 9. None of these is settled by these docs.

1. Biometric data. The PCPD's *Guidance on Collection and Use of Biometric Data* asks for necessity, free and informed choice, and prompt purging. Even a transient voice sample is biometric data. Get a view on whether a live sample processed for seconds and then deleted still needs the full treatment (assume yes).
2. Vendor as data processor. DPP2(3) and DPP4(2) require contractual controls on retention and security when a processor handles the data.
3. Cross-border transfer. Vendor processing in the US or Singapore must be disclosed. Section 33 is not in force, but disclosure under DPP1 and DPP5 still applies.
4. Partner data sharing (§3.5): DPP3 new purpose and Part VI A direct marketing.
5. Minors, if 18+ is relaxed.
6. Audit logs. Keep challenge IDs and outcomes, never audio or embeddings.
7. Analytics and share links. Make sure no share URL carries anything identifying.
8. Data access requests. With no voiceprint stored, the export becomes simpler. Confirm what must be included.
9. A Privacy Impact Assessment, which the PCPD guidance recommends for biometric systems.

I found no 2025 or 2026 PDPO amendment in a quick search. Ask the lawyer to confirm.

### 3.10 Smaller points

- The clone test needs about 10 to 20 s of clean speech for a convincing zero-shot clone. The current 3 s minimum is too short. More phrases means more friction. Test it.
- `DESIGN.md` says the headline, CTA and founder story are fixed by the brief. The pivot changes the brief, so the founder needs to supply new fixed copy, or approve mine.
- `.plans/00` links a file that is not in the repo (`../voice-exposure-scanner-spec.md`).
- Founder story: the grandparents' call happened in Mainland China. That is fine for HK messaging, but keep it out of any Mainland product claims.

## 4. Implementation plan

Each stage is one small PR. No stage starts before you approve this review and answer §5.

1. **Docs.** Rewrite `01-prd.md` first (features, goals, non-goals, metrics, assumptions). Then `02-design.md` (IA, flows, screen list, states), `03-tech-spec.md` (remove scan pipeline and Stripe to a "later" appendix, add clone-test verification design, new data model with no voiceprints), `04-privacy-legal.md` (PDPO checklist from §3.9, partner data rule, new clone safeguards), `05-gtm-roadmap.md` (B2B2C, new funnel, Mainland as separate product), `00-README.md`. Update `DESIGN.md` Subject and fixed copy. Docs only.
2. **Vendor spike, written up only.** `.plans/06-clone-vendor-decision.md`: test 2 or 3 vendors on Cantonese and English samples from consenting volunteers, record consent flow, retention, deletion, region and cost. A decision record, no app code.
3. **Landing copy.** `src/content/landing.ts`, `faq.ts`, `site.ts`, `cloneTest.ts` intro copy. Run `scripts/slop-check.sh`. Update the landing smoke test heading.
4. **Landing structure and paywall removal.** New hero (clone demo with a clearly labelled example clip), sections re-ordered for the new story, remove `#pricing`, `PricingCards`, `pricing.ts`, the header Pricing link. Hero direction goes into `DESIGN.md` first. Screenshot at 320 px and desktop.
5. **Remove plans and billing from the app.** `Paywall`, `openPaywall`, `PlanBadge`, `UpgradeCard`, `LapsedBanner`, Settings plan row, `Plan`/`upgrade`/redaction in the API layer, related tests and `/dev/states` seeds.
6. **Clone test flow (mocked).** Unlocked for every signed-in user. New API shape `startCloneChallenge()` → `requestCloneTest(challengeId, sample)`. Multi-phrase challenge, longer minimum, verification failure states, rate-limit state, result screen with the "play it to your family" moment and the share card. Update `routing.ts` so new users land here after consent. Update consent copy for the clone test.
7. **Self-audit and checklist.** `/check` with the 5 places, reusing `remediation.ts`. A qualitative result band, then the action checklist (privatise videos, voicemail greeting, voice-only verification, family code word). Persist progress.
8. **Remove the scan stack.** Enrol, accounts, scan progress, results, dashboard, sources, `risk.ts`, `Sparkline`, `SourceCard`, scan and voiceprint types, monitoring settings, thumbnails. Simplify Settings to email, export and delete.
9. **Legal drafts.** `legal.ts` privacy and terms rewritten for the new data flows. Still marked as drafts pending lawyer review.
10. **Tests and report.** Rewrite smoke and screenshot specs for the new flow, update `BUILD_REPORT.md` and `README.md`.

Real backend work (Supabase auth, the verification service, the vendor integration) comes after stage 10 and after the vendor decision. It is not in this plan.

## 5. Questions before starting

1. **Exposure scan.** Is the "free one-time exposure scan" the self-audit questionnaire itself (§3.3 option a), or do you want any automated check in v0?
2. **Monitoring.** OK to cut it entirely from v0 (§3.4)?
3. **Clone language.** English, Cantonese, or both for the clone test? This decides the vendor shortlist.
4. **Share.** Which share format: outcome card with no audio, a watermarked clip, or replay-on-device only (§3.2)?
5. **Sign-in friction.** Email only, or require an HK phone number to replace the payment deterrent (§3.1)? Should visitors hear an example clone before signing in?
6. **Age.** Keep 18+?
7. **Partners.** Confirm partners get aggregate data only. Is there a named first partner type (bank, telco or insurer) to tailor the landing page or a partners page for, or is that out of v0?
8. **Voice-only verification wording.** OK to phrase the checklist item as "add a second factor" so it doesn't attack banks' voice ID (§3.5)?
9. **Copy.** Do you want to write the new headline and CTA, or should I propose options in stage 3? Is "Your voice is the weapon, your parents are the target" meant as the literal tagline?
10. **Elder-side features.** Is anything for parents in v0 (for example, a "share this with your parents" message or code-word card), or still a non-goal?
11. **Vendors.** Are you willing to apply for Azure Limited Access, and is self-hosting a GPU model acceptable cost-wise for the spike?
12. **Missing file.** Does `voice-exposure-scanner-spec.md` exist somewhere, or should the link in `.plans/00` go?

## Sources

- Microsoft, [What is personal voice for text to speech?](https://learn.microsoft.com/azure/ai-services/speech-service/personal-voice-overview), [Create consent](https://learn.microsoft.com/en-my/Azure/ai-services/speech-service/personal-voice-create-consent), [How to use personal voice](https://learn.microsoft.com/fi-fi/azure/ai-services/speech-service/personal-voice-how-to-use), [Code of conduct](https://learn.microsoft.com/ko-kr/legal/cognitive-services/speech-service/text-to-speech/code-of-conduct), [Speaker recognition retirement](https://learn.microsoft.com/hr-hr/azure/cognitive-services/speech-service/speaker-recognition-overview)
- The Register, [Microsoft updates Azure AI Speech](https://theregister.com/2025/07/31/microsoft_updates_azure_ai_speech) (July 2025)
- Google Cloud, [Chirp 3: Instant Custom Voice](https://docs.cloud.google.com/text-to-speech/docs/chirp3-instant-custom-voice)
- ElevenLabs policy summaries (secondary): [ConductAtlas, safety policy](https://conductatlas.com/platform/elevenlabs/elevenlabs-safety-policy/), [ConductAtlas, usage policy](https://conductatlas.com/platform/elevenlabs/elevenlabs-usage-policy/voice-cloning-without-consent-prohibition/), [Terms.law](https://terms.law/ai-output-rights/elevenlabs/)
- Resemble AI, [Ethics](https://www.resemble.ai/ethics/); Zohaib Ahmed, [Senate Judiciary testimony](https://www.judiciary.senate.gov/download/2024-04-16-pm-testimony-ahmed?download=1) (16 Apr 2024)
- Du et al., [CosyVoice](https://arxiv.org/pdf/2407.05407) (2024); [WenetSpeech-Yue](https://arxiv.org/pdf/2509.03959) (2025)
- PCPD, [Biometric data guidance](https://www.pcpd.org.hk/english/whatsnew/biometric_data.html), [Newsletter on biometric data](https://pcpd.org.hk/misc/dpoc/newsletter20.html)
