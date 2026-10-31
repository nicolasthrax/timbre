# Timbre v0 — Build report

Complete marketing site + app UI for Timbre AI, running on a **mocked backend** behind one swappable API layer (`src/lib/api/`). No real auth, database, payments or ML yet.

Stack: Next.js 16.4 (App Router, Turbopack) · React 19 · TypeScript strict · Tailwind CSS v4 · Geist Sans/Mono · lucide-react · Playwright.

---

## 1. How to run

```bash
npm install
cp .env.example .env.local      # NEXT_PUBLIC_API_MODE=mock (also the default)
npm run dev                     # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run lint` | ESLint (next/core-web-vitals + TypeScript + React Compiler rules) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` / `npm start` | Production build / serve |
| `npm run test:e2e` | All Playwright specs (smoke + screenshots) at 375px and 1280px. Builds and starts the app on port 3100 automatically. |
| `npx playwright test tests/smoke.spec.ts` | Smoke tests only |
| `npm run screenshots` | Writes every main screen to `screenshots/<viewport>/` (gitignored) |
| `npm run assets` | Regenerates placeholder audio (`public/audio/*.wav`) and thumbnails |

Playwright uses the pre-installed Chromium; if you run it elsewhere, run `npx playwright install chromium` once.

**Shortcuts for demoing:** open `/dev/states` (hidden, `noindex`) to seed a signed-in Free / Pro / Lapsed account, switch mock scenarios, and preview every required state. You can also append `?scenario=high|none|partial|lapsed` to any URL.

---

## 2. Route map

| Route | Screen |
|---|---|
| `/` | Landing: hero + animated waveform, how it works, founder story, platforms, privacy promise, pricing, FAQ (8), footer |
| `/privacy` | Privacy policy placeholder (PDPO DPP1–6, retention, security, access/deletion, Singapore transfer) with draft banner |
| `/terms` | Terms placeholder (acceptable use, clone-test safeguards, billing) with draft banner |
| `/signin` | Email magic-link + "Continue with Google" (both mocked, instant) |
| `/onboarding/consent` | Plain-English storage explanation, required checkbox, records consent version + timestamp |
| `/onboarding/enrol` | Real mic recording: 3 random phrases (from 24), live level meter + waveform, quality hints, 15 s minimum, mic error states |
| `/onboarding/accounts` | Instagram / TikTok / YouTube handles + full name; ≥1 required; handle validation; starts the scan |
| `/scan/[id]` | Honest progress steps ("Collecting public videos… 32/50", matching, scoring), ~10 s mock, "you can leave" note |
| `/results` | Free view: huge minutes number, risk badge + exposure-estimate tooltip, platform counts, redacted/blurred sources, upgrade card. Pro users are redirected to `/dashboard` |
| Paywall (modal/bottom sheet) | What unlocks, monthly/yearly toggle, Upgrade (mock → Pro instantly). Opened from results, sidebar, clone test, source detail, settings |
| `/dashboard` | Pro view: exposure summary, trend sparkline, open/fixed/ignored counts, platform + status filters, full source list, Run new scan, monitoring status |
| `/sources/[id]` | Facts (platform, date, posted by, seconds matched, confidence); self-posted → platform fix guides + Mark as fixed; posted by others → pre-filled takedown + Copy + report link, Mark as fixed / Ignore |
| `/clone-test` | Pro only (locked state for others): safeguards explainer, re-record one random phrase, side-by-side Real vs Clone players with synced waveforms, transcript, Watermarked label, no download |
| `/settings` | Email, plan + Manage billing (mock), monitoring + email alert toggles, Export my data (JSON), Delete my data (type "DELETE") |
| `/dev/states` | Hidden state gallery + mock scenario / seed controls |
| any unknown URL | Branded 404 (`app/not-found.tsx`) |
| runtime error | Branded error page (`app/error.tsx`) and `app/global-error.tsx` |

---

## 3. Mocked vs real

| Feature | Status | Notes |
|---|---|---|
| Marketing pages, SEO/OG metadata | **Real** | Title "Timbre AI — How much of your voice is out there?" |
| Microphone recording (MediaRecorder + Web Audio AnalyserNode) | **Real** | Runs fully in-browser; blob discarded after the mock enrol call |
| Live level meter, live waveform, quality hints (RMS) | **Real** | Simple thresholds in `useRecorder` |
| Mic denied / no mic / unsupported detection | **Real** | |
| Random enrolment phrases per visit | **Real** | Picked server-side per request |
| Handle / email validation | **Real** | Client-side |
| Auth (magic link, Google) | Mocked | `TODO(real)` Supabase Auth |
| Consent record | Mocked | Stored in localStorage |
| Voiceprint creation | Mocked | `TODO(real)` Whisper liveness + ECAPA-TDNN on Modal |
| Scan pipeline (discovery, matching, scoring) | Mocked | Deterministic seeded results, ~10 s timed progress |
| Risk score | Mocked inputs, real rule | `src/lib/risk.ts` heuristic; recalculates when sources are marked fixed |
| Free-plan redaction | Mocked server-side | Done inside `mock.ts`; UI only renders nulls |
| Payments / upgrade / billing portal | Mocked | `TODO(real)` Stripe Checkout + Customer Portal + webhook |
| Subscription lapse | Mocked | `lapsed` scenario |
| Source status (fixed / ignored) | Mocked | Persisted in localStorage |
| Clone test generation | Mocked | Bundled placeholder WAVs (`public/audio/`) |
| Weekly monitoring, email alerts | TODO | Toggles persist; no scheduler or email (`TODO(real)` Modal cron + Resend) |
| Export my data | Mocked | Downloads JSON built from the mock store |
| Delete my data | Mocked | Wipes the mock store |
| Route protection | Client-side only | `TODO(real)` enforce server-side (proxy + RLS) |
| Error reporting / analytics | TODO | Out of scope |

---

## 4. Swap guide (mock → Supabase + Python worker)

UI code only imports `api` from `@/lib/api`. Nothing else needs to change.

1. **Implement `src/lib/api/supabase.ts`** — `SupabaseTimbreApi implements TimbreApi`. Every method currently throws "not implemented". The contract is in `src/lib/api/client.ts`; domain types in `src/lib/api/types.ts` mirror the schema (camelCase ↔ snake_case).
2. **Set `NEXT_PUBLIC_API_MODE=supabase`** — `src/lib/api/index.ts` picks the implementation.
3. **Add Next.js API routes** (from `.plans/03-tech-spec.md` §5) that the client calls for anything privileged:

| `TimbreApi` method | Backed by |
|---|---|
| `signIn` / `signOut` / `getMe` | Supabase Auth (`signInWithOtp`, Google OAuth) + `users` row |
| `recordConsent` | `users.consent_version/consent_at` + `audit_log` |
| `enrolVoice`, `getVoiceprint` | `POST /api/enrol` → Modal worker (liveness + embedding) → `voiceprints`; raw audio deleted |
| `setAccounts`, `getAccounts` | `linked_accounts` (+ `users.full_name`) |
| `startScan`, `getScan`, `listScans` | `POST /api/scans` (plan + cap checks, enqueue) / `GET /api/scans/:id`; worker writes `scans` + `sources` |
| `listSources`, `getSource` | **Server route** that nulls `url/title/thumbnail/author` for non-Pro users (never rely on RLS + client) |
| `updateSourceStatus` | `POST /api/sources/:id/status` |
| `upgrade` | Stripe Checkout redirect; `POST /api/stripe/webhook` sets `users.plan` |
| `setMonitoring`, `setEmailAlerts` | `users` preference columns; Modal cron reads them |
| `requestCloneTest` | `POST /api/clone-test` (Pro, rate-limited, audit-logged, streamed, watermarked) |
| `exportData`, `deleteAllData` | `GET /api/me/export`, `DELETE /api/me` |

4. **Delete or keep** `mock.ts`, `mock-data.ts`, `ScenarioSync` and `/dev/states` (they no-op outside mock mode; `mockControls` is `null`).
5. **Search for `TODO(real)`** to find every integration point (auth redirect, Stripe, Sentry, clone-test API, re-verification of fixed items, etc.).

Schema columns not in the prompt's list that the UI uses: `users.full_name`, `users.billing_interval`, `users.lapsed_at`, `users.monitoring`, `users.email_alerts`, `sources.author`, `sources.posted_at`, and a per-scan `issues` list (partial failures / private accounts).

---

## 5. Decisions I made

- **Repo/branch:** the session is attached to the existing `nicolasthrax/timbre` repo and pinned to branch `claude/beautiful-allen-34hdx1`, and `gh` is not available here. So instead of creating a new private repo and pushing `main`, I pushed to that branch and opened a draft PR.
- **Next.js 16 defaults:** `create-next-app` turned on `cacheComponents` + `partialPrefetching`. I turned them off. They keep routes mounted in `<Activity>` and need Suspense around all dynamic reads. With a client-side mock store, that's needless complexity and could leave hidden-but-mounted pages in the DOM (which matters for the "no source URLs in the DOM" check).
- **Tailwind v4:** there's no `tailwind.config.*` in v4. The "Tailwind config" mapping is the `@theme inline` block in `globals.css`, which maps the CSS variable tokens to utilities (`bg-surface`, `text-muted`, `border-border`, …).
- **Fonts:** used the `geist` package (local font files) rather than `next/font/google`, so builds don't need network access.
- **Brand icons:** lucide-react 1.x no longer ships Instagram/YouTube logos. I drew simple generic glyphs (`PlatformIcon`), always shown with a text label. These are not official logos.
- **Risk thresholds:** the PRD says >15 min = Critical, but the prompt's example is "47 min, High risk". To reconcile them, Critical requires >15 min **and** ≥40% high-confidence (clean) audio. Low <30 s, Medium 30 s–3 min, High otherwise (`src/lib/risk.ts`).
- **Plan model:** `Plan = "free" | "pro" | "lapsed"`. Lapsed users get redacted data (same as free) and a banner saying data is kept 30 days.
- **Extra API methods** beyond the prompt's list: `getVoiceprint`, `getAccounts`, `listScans`, `setEmailAlerts`. Routing, the sparkline and settings need them.
- **Scans:** free plan = 1 scan (the API refuses a second). Each later Pro scan surfaces one new "repost" so monitoring looks alive. Existing source statuses carry over between scans.
- **Exposure minutes** on the latest scan exclude sources marked *fixed* (ignored ones still count). The risk badge recalculates to match.
- **Export redaction:** free/lapsed exports follow the same redaction as the UI, so the paywall can't be bypassed. A PDPO data-access request may legally require full data. **Ask the lawyer.**
- **Dev seeding:** tests and demos seed accounts through buttons on `/dev/states` rather than writing localStorage directly. The full happy path is still tested end-to-end through the real UI.
- **Enrol recording** is one continuous recording with pause/resume (a single valid WebM file), not one file per phrase.
- **Delete / sign out** use client navigation to `/`. Leaving the `(app)` route group unmounts the session provider, so no user state survives. The landing page shows a "data deleted" banner via `?deleted=1`.
- **Copy location:** marketing, FAQ, remediation, phrases, consent, pricing, legal, clone-test and site copy live in `src/content/`. Small UI labels (buttons, error strings) are still inline. Pull them out when i18n starts.
- **Founder story:** written in first person from Nicolas, based on the PRD (grandparents, kidnapping-ransom call, avoided paying by reaching him). I deliberately left out where the grandparents live.
- **Clone-test sentence** is fixed and harmless ("Every voice has a timbre…"), so it can't be used as a scam script, per `.plans/04` §6.
- **Help-centre URLs** for fixes and reports are the best-known public pages (see Known issues: not checked).
- **Responsive shell:** top bar with a disclosure menu below `lg`, sidebar at `lg`+. The paywall is a bottom sheet on mobile and a centred dialog on desktop (native `<dialog>`, which handles the focus trap and Esc).

---

## 6. Verification results

| Check | Result |
|---|---|
| `npm run lint` | ✅ 0 errors, 0 warnings |
| `npx tsc --noEmit` | ✅ 0 errors |
| `npm run build` | ✅ succeeds (15 routes) |
| Playwright smoke (`tests/smoke.spec.ts`) | ✅ **10/10 passed** (5 tests × 375px + 1280px) |
| Playwright screenshots (`tests/screenshots.spec.ts`) | ✅ 10/10 passed, 25 screens × 2 viewports |

The smoke tests cover:
- Landing renders and the CTA goes to `/signin`.
- Full happy path with a mocked `getUserMedia`. The free results show "47" and the page HTML contains no YouTube / Instagram / TikTok source URLs.
- Upgrade → dashboard shows URLs → source detail → Mark as fixed.
- Clone test is locked for free users and unlocked for Pro, including a generated result. Both `<audio>` elements have `controlslist=nodownload`, no native controls, and there are no `.wav` links.
- Delete my data → landing page with confirmation, the store is wiped, and `/results` redirects to sign-in.

**Visual review:** I looked at the screenshots and fixed three problems:
- A hidden tooltip caused about 65px of horizontal overflow on desktop.
- The live recording waveform never lit up.
- The trend sparkline looked flat.

Platform names were also truncated at 375px; I fixed that too. All screenshots now match the viewport width exactly (no horizontal scroll).

---

## 7. Known issues & next steps

- **Help-centre / report URLs are unverified.** This environment blocks outbound requests to instagram.com, tiktok.com and support.google.com. Check every URL in `src/content/remediation.ts` (and the in-app menu steps) before launch.
- The `MediaRecorder` blob format varies by browser (WebM/Opus in Chrome, MP4 in Safari). The worker must accept both.
- Quality hints are simple RMS heuristics. A steady tone reads as "Background noise", which you'll see in the test's synthetic mic.
- Auth guards run client-side only. Add server enforcement (proxy + RLS) with the real backend.
- Mock latency (300–900 ms) makes every page show a short skeleton. That's intentional for realism.
- The clone-test audio is a synthetic placeholder tone, not speech.
- Legal pages are drafts. They need Hong Kong lawyer review (PDPO, cross-border transfer wording, takedown-draft liability).
- Next steps:
  1. Supabase schema + RLS.
  2. Implement `SupabaseTimbreApi`.
  3. Python enrol/match worker on Modal.
  4. Stripe.
  5. Resend alerts.
  6. Sentry/PostHog.
  7. Shareable "47 min" score card (from `.plans/02` open questions).
  8. Pull the remaining inline UI strings into `src/content/` for Cantonese / Traditional Chinese.

**Dependencies added** beyond the scaffold:
- `geist`: local Geist fonts.
- `lucide-react`: icons.
- `@playwright/test` (dev): smoke tests.

No other runtime dependencies.

---

## 8. GitHub

Pushed to `nicolasthrax/timbre`, branch `claude/beautiful-allen-34hdx1`, draft PR: https://github.com/nicolasthrax/timbre/pull/1. To work locally:

```bash
git clone https://github.com/nicolasthrax/timbre.git
cd timbre && git checkout claude/beautiful-allen-34hdx1
npm install && npm run dev
```
