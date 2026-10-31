# 03 — Technical Spec

## 1. Recommended stack (optimised for a solo, vibe-coding founder + later co-founder)
| Layer | Choice | Why |
|---|---|---|
| Frontend + API routes | **Next.js (TypeScript)** on **Vercel** | Fast to build, great AI-codegen support, already connected |
| Auth, DB, file storage | **Supabase** (Postgres + Auth + Storage) | One service, row-level security, already connected |
| Audio/ML worker | **Python** on **Modal** (serverless GPU) | Pay per second of GPU; no servers to run; Python is where audio ML lives |
| Job queue | Supabase table + Modal webhook (v1); upgrade to a real queue later | Simple enough for low volume |
| Payments | **Stripe** Checkout + Customer Portal + webhooks | Standard subscriptions |
| Email | **Resend** | Simple transactional email from Next.js |
| Search | A web-search API (e.g. Brave/Bing/SerpAPI) | Finding reposts by name/handle |
| Monitoring | Sentry (errors) + PostHog (product analytics) | Free tiers |

## 2. Architecture
```
Browser (Next.js)
  │ record audio (MediaRecorder, WebM/Opus)
  ▼
Next.js API ──► Supabase (users, scans, sources, voiceprints)
  │
  └─► enqueue job ──► Modal worker (Python, GPU)
                         1. enrol: audio → voiceprint embedding
                         2. discover: platform APIs + web search → candidate URLs
                         3. fetch audio for candidates
                         4. diarise + match segments vs voiceprint
                         5. write results → Supabase
                         6. delete all fetched/raw audio
  ◄── webhook: scan complete ──► email via Resend
Stripe ──webhook──► Next.js API ──► update subscription in Supabase
Scheduler (Modal cron) ──► weekly monitoring scans for paid users
```

## 3. ML pipeline

### 3.1 Enrolment
- Input: 20–30s browser recording of random phrases.
- Liveness: speech-to-text (e.g. Whisper small) → check transcript matches the random phrases (≥ 80%).
- Quality check: SNR / loudness thresholds; reject and re-prompt if poor.
- Embedding: open-source speaker-verification model (e.g. **SpeechBrain ECAPA-TDNN**, Apache-2.0) → 192-dim vector.
- Store the embedding; **delete raw audio immediately**.

### 3.2 Discovery (candidate videos)
| Source | Method | Notes |
|---|---|---|
| YouTube own channel | YouTube Data API (public channel uploads) | Reliable, quota-limited |
| TikTok own account | TikTok Display API via user login (own videos) | Requires app approval |
| Instagram own account | Instagram Graph API (business/creator accounts only) | Personal accounts → fallback: user pastes Reel links |
| Reposts / tags | Web-search API on name + handles, filtered to the 3 platforms | Cap 50 (free) / 300 (paid per month) |

⚠️ Fetching audio from public video URLs outside official APIs (e.g. yt-dlp) may breach platform ToS. See 04 §4. v1 should prefer official APIs + user-provided links; treat scraping as a legal decision, not a technical one.

### 3.3 Matching
1. Extract audio track; resample 16 kHz mono.
2. Voice activity detection → speech segments.
3. Speaker diarisation (e.g. pyannote; check licence/terms) → per-speaker clusters.
4. Embed each cluster; cosine similarity vs user voiceprint.
5. Match if similarity ≥ threshold (calibrate on test set; start ~0.65 and tune for low false positives).
6. Record: source URL, matched seconds, confidence, quality estimate.
7. Delete audio.

### 3.4 Clone test
- Use the user's **enrolment audio only** — which means the enrolment recording must be kept temporarily for paid users who opt in, or re-recorded at clone-test time. **Decision: re-record a fresh live phrase at clone-test time** (consistent with "delete raw audio"; also re-verifies identity).
- Model: a zero-shot TTS / voice-cloning model. **Check licence before choosing** — many open models (e.g. XTTS, F5-TTS weights) are non-commercial. Options: commercially-licensed model or a cloning API with consent/verification controls.
- Output: one fixed sentence, audible watermark, streamed to browser, not stored; never exposed as a downloadable file URL.

### 3.5 Accuracy targets (to measure before launch)
- False positive rate (someone else's voice counted as yours): **< 2%** — false alarms destroy trust.
- Recall on clear solo speech ≥ 85%.
- Build a test set: ~50 consenting volunteers × own videos + negatives.

## 4. Data model (Supabase / Postgres)
```
users(id, email, created_at, plan, stripe_customer_id, consent_version, consent_at)
voiceprints(id, user_id, embedding vector(192), model_version, created_at)
linked_accounts(id, user_id, platform, handle, oauth_token_enc, created_at)
scans(id, user_id, type[free|paid|monitor], status, candidates_count,
      matched_seconds, risk_level, started_at, finished_at)
sources(id, scan_id, user_id, platform, url, posted_by[self|other|unknown],
        matched_seconds, confidence, first_seen_at, status[open|fixed|ignored])
subscriptions(user_id, stripe_sub_id, status, current_period_end)
audit_log(id, user_id, action, at)   -- consent, deletion, clone tests
```
- Use **pgvector** for embeddings.
- Row-level security: users only read their own rows.
- Free-tier blurring enforced **server-side** (API doesn't return URLs to free users) — never just CSS blur.

## 5. Key API routes (Next.js)
- `POST /api/enrol` — upload audio → job
- `POST /api/accounts` — add handles / OAuth callbacks
- `POST /api/scans` — start scan (checks plan + cap)
- `GET /api/scans/:id` — status + results (redacted for free)
- `POST /api/clone-test` — paid only, rate-limited (e.g. 3/month)
- `POST /api/sources/:id/status` — mark fixed/ignored
- `POST /api/stripe/webhook`
- `DELETE /api/me` — full data deletion

## 6. Security
- Encrypt OAuth tokens at rest; least-privilege API scopes.
- Rate-limit enrolment, scans, clone tests per user and per IP.
- Clone-test abuse controls: paid + live liveness check + rate limit + audit log.
- Secrets in Vercel/Modal env vars only; never in client code.

## 7. Cost model (rough, verify)
- Per scan of 50 videos × ~1 min: GPU minutes on Modal ≈ a few HK$ at most; search API ≈ HK$0.5–2; platform APIs mostly free within quota.
- Target: free scan cost < HK$5; paid user cost < HK$20/month → healthy margin at HK$68.
- Monitor cost per scan from day one (log GPU seconds + API calls per scan).

## 8. Build order (MVP)
1. Enrolment + voiceprint (Python, local notebook first)
2. Matching on a manual list of URLs (prove accuracy)
3. Next.js shell + Supabase auth + DB
4. Scan job end-to-end with user-pasted links
5. Results page + free/paid redaction
6. Stripe
7. Official platform APIs + web search discovery
8. Clone test
9. Monitoring cron + email alerts

## 9. Open questions
- Licence-safe choices for diarisation and cloning models.
- Can we get TikTok/Instagram API approval as a tiny startup? If not, user-pasted links are the fallback.
- Hosting region for data (Supabase region: Singapore is nearest to HK).
