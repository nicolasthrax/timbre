# 03 Technical spec

v0.2, 31 Oct 2026. For the YC demo scope in [01](01-prd.md). The post-demo pipeline (voice matching, reposts, monitoring) is in the appendix (§11).

## 1. Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend and API routes | Next.js (TypeScript) on Vercel | Already built; the mock API layer swaps to real per method |
| Auth, database | Supabase (Postgres, Auth with email magic link) | One service, row-level security |
| Clone generation | Google Cloud voice replication in key-only mode (default) | Ranked first on retention among hosted vendors; see the decision in [06](06-clone-vendor-decision.md) |
| Speech-to-text for the challenge check | Google Cloud Speech-to-Text | Same vendor and data-processing terms as the clone step |
| Synthetic-speech check | Open anti-spoofing model (for example AASIST, licence to check) on a small worker, or the vendor's own check if it has one | Needed because the test is free (§4.3) |
| Worker (only if the anti-spoofing model needs one) | Modal, CPU or small GPU, pay per second | No servers to run |
| YouTube | YouTube Data API v3 with OAuth (`youtube.readonly`) | Official, covers personal channels |
| Analytics | PostHog | The YC metrics in [01](01-prd.md) §7 |
| Errors | Sentry | Free tier |
| Payments | Stripe, paused | Not built in v0 |

Region: Supabase in Singapore (nearest to Hong Kong). Google processing region to confirm in the spike.

The site URL is configuration, not code: `NEXT_PUBLIC_SITE_URL`, read by `src/content/site.ts`. No domain is owned yet; candidates are in [01](01-prd.md) §10.

## 2. Architecture

```
Browser (Next.js)
  │ records audio (MediaRecorder), keeps its own copy in memory for playback
  ▼
Next.js API routes ──► Supabase (users, challenges, YouTube connection, scans, checklist, audit log)
  │
  ├─ POST /api/clone/challenge ─► issue phrases, store challenge, check rate limits
  ├─ POST /api/clone ───────────► STT check ─► synthetic-speech check ─► Google voice replication
  │                                (key-only) ─► synthesise fixed sentence ─► add audible disclosure
  │                                ─► stream audio back ─► discard sample, key and output
  ├─ GET  /api/youtube/connect ─► Google OAuth (youtube.readonly)
  └─ POST /api/scans ───────────► YouTube Data API: channel uploads + video details ─► scan rows
```

Nothing in the clone path is written to disk or storage on our side. The recording lives in the request's memory, and the generated clip is streamed back and not kept.

## 3. Clone test pipeline

### 3.1 Challenge

- `POST /api/clone/challenge` (signed-in, email verified): checks rate limits (§4), picks 3 or 4 phrases from `src/content/phrases.ts` for the user's locale (`en` in v0), stores a challenge row with a 3-minute expiry, returns `{ challengeId, phrases, expiresAt }`.
- If the vendor needs a consent statement read aloud, it is added as the last phrase.

### 3.2 Verification

`POST /api/clone` with `challengeId` and the audio (WebM/Opus from Chrome, MP4/AAC from Safari; accept both):

1. Reject if the challenge is unknown, expired, already used or belongs to another user. Mark it used.
2. Length between 8 and 60 seconds.
3. Speech-to-text; normalised word match against the phrases of at least 80%.
4. Synthetic-speech check above a threshold set in the spike.
5. Any failure returns a specific error code (`phrase_mismatch`, `synthetic_suspected`, `too_short`, `expired`) and records the outcome; no clone is made.

### 3.3 Generation

1. Create a voice replication key from the verified sample (key-only: no voice profile kept by Google).
2. Synthesise the fixed sentence ("Every voice has a timbre, a colour that makes it yours and no one else's.").
3. Append an audible disclosure in a stock voice ("This was an AI clone made by Timbre."). Check whether Google adds its own inaudible watermark; if not, the audible disclosure is the watermark in v0.
4. Stream the audio to the browser with `Cache-Control: no-store`. No file URL is created.
5. Drop the sample, the key and the output from memory. Write an audit entry with the challenge ID and outcome only.

If the spike picks self-hosted CosyVoice 2 instead, steps 1 and 2 run on the Modal worker and the same rules apply.

## 4. Abuse controls

### 4.1 Rate limits

| Key | Limit (starting values) | Notes |
|---|---|---|
| Verified email | 3 clone tests per calendar month | The main limit |
| IP | 10 challenges per 24 h, sliding | Loose on purpose: HK mobile carriers and campuses share IPs |
| Device | 5 challenges per 24 h | Signed first-party cookie token; no browser fingerprinting |
| Global | Daily vendor spend cap (set from the spike's cost per test) | Over the cap, the UI shows "busy, try after TIME" |
| Scan | 1 manual run per user per 24 h | YouTube quota and cost control |

Disposable-email domains are rejected at sign-in. IPs and device tokens are stored hashed, for 30 days.

### 4.2 What the controls are for

The clone is built only from audio captured live in the session, so someone recording themselves only clones themselves. The challenge stops replaying an existing recording of someone else. The synthetic-speech check targets live voice conversion. The fixed sentence means the output can't be used as a scam script.

### 4.3 What they don't stop

A person who is tricked into reading the phrases. Screen recording of the result (the clip is "not offered as a download", never "can't be saved").

## 5. YouTube exposure scan

- OAuth: `https://www.googleapis.com/auth/youtube.readonly`, offline access for a refresh token. Until Google verifies the app, it runs in Testing status with named test users; refresh tokens then expire after 7 days, which is fine for the demo.
- Calls per scan:
  1. `channels.list?part=contentDetails,snippet&mine=true` → uploads playlist ID.
  2. `playlistItems.list?part=contentDetails&playlistId=…&maxResults=50`, paged.
  3. `videos.list?part=snippet,contentDetails,status&id=…` in batches of 50 → title, thumbnail, `duration`, `privacyStatus`.
- Only `privacyStatus = public` videos are listed as exposure. Unlisted videos are noted separately ("unlisted, anyone with the link can watch").
- Quota: each call costs 1 unit, so a channel with 200 videos costs about 10 units. The default daily quota is enough for the demo.
- No audio is fetched. The YouTube Developer Policies forbid storing copies of audiovisual content, and the API has no media download.
- Retention: check the YouTube API Services policies on how long API data may be stored without refreshing, and set the scan-row retention to match before stage 12. Placeholder: scan videos deleted 30 days after the last scan.
- Disconnect and delete revoke the token at Google (`https://oauth2.googleapis.com/revoke`) and delete the stored token.

## 6. Data model (Supabase, v0)

```
users(id, email, created_at, consent_version, consent_at, locale)
clone_challenges(id, user_id, phrases, issued_at, expires_at, used_at,
                 outcome[pending|ok|phrase_mismatch|synthetic_suspected|too_short|expired|failed],
                 ip_hash, device_hash)
youtube_connections(user_id, channel_id, channel_title, refresh_token_enc, scopes, connected_at)
scans(id, user_id, started_at, finished_at, status, public_video_count,
      speaking_video_count, speaking_seconds, band[none|some|a_lot])
scan_videos(id, scan_id, user_id, youtube_video_id, title, thumbnail_url,
            duration_seconds, published_at, privacy_status, user_speaks, status[open|fixed])
checklist_items(user_id, item_key, state[done|not_yet|not_applicable], updated_at)
audit_log(id, user_id, action, detail, at)
```

- No voiceprints, embeddings or audio anywhere in the schema.
- Row-level security: users read and write only their own rows. Challenge outcome and audit rows are written by the server only.
- `refresh_token_enc` is encrypted with a key held outside the database (Supabase Vault or a KMS key in Vercel env).

## 7. API routes

- `POST /api/clone/challenge`, `POST /api/clone`
- `GET /api/youtube/connect`, `GET /api/youtube/callback`, `DELETE /api/youtube`
- `POST /api/scans` (once per 24 h), `GET /api/scans/:id`, `POST /api/scans/:id/videos` (save "I speak in this" ticks), `POST /api/videos/:id/status`
- `PUT /api/checklist/:item`
- `GET /api/me/export`, `DELETE /api/me`

The UI keeps calling `api` from `@/lib/api`; `src/lib/api/client.ts` changes shape to match these routes (stages 6 to 8), and `supabase.ts` implements it (stages 10 to 12).

## 8. Security

- Secrets only in Vercel and Modal environment variables.
- Server-side route protection (proxy plus RLS), not only the client-side guard in `RequireAuth.tsx`.
- Least-privilege scopes: YouTube read-only, no other Google scopes.
- The clone endpoint never accepts a file the user picked; only a recording tied to a live challenge.

## 9. Cost (to confirm in the spike)

- Clone test: speech-to-text for about 15 s, one voice-replication key, about 80 characters of synthesis. Expected well under US$0.05 per test on Google; the spike measures it.
- Synthetic-speech check: CPU or small GPU seconds on Modal.
- YouTube scan: API quota only.
- Track cost per clone test from the first real request.

## 10. Build order

Stages 3 to 12 in [pivot-review.md](pivot-review.md) §5.

## 11. Appendix: post-demo pipeline

- Voice matching in the user's own exports or files, in the browser: a small speaker-embedding model in WebAssembly, embedding computed from the clone-test recording in the same session and discarded after the scan. Audio from the files never leaves the device. Check model size and speed on a mid-range phone.
- If repeat matching is ever added: embeddings encrypted per user with a KMS key, so destroying the key also removes them from backups; RLS denies client reads; 12-month inactivity deletion.
- TikTok Display API (`video.list`, `video.query`): metadata of own public videos; app review needed.
- Instagram API with Instagram Login: professional accounts only.
- Possible reposts: a web-search API on name and handles, filtered to the three platforms, listing URLs only. Fetching audio from other people's posts needs platform permission or a legal opinion.
- Monitoring: scheduled tier A polling and weekly web search, alerts by email via Resend (alert list in [01](01-prd.md) §9).
- Stripe Checkout and webhooks: paused.
