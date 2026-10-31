# 01 — Product Requirements Document (PRD)

## 1. Problem
AI voice cloning now needs only seconds of audio. Scammers clone a young person's voice from public videos and call their elderly relatives (fake kidnapping, emergency money). Regular people have no idea how much of their voice is public or how cloneable it is.

**Founder story:** Nicolas's grandparents in Mainland China received a kidnapping-ransom call in an AI clone of his voice. They only avoided paying by reaching him directly. He still doesn't know where the sample came from.

## 2. Target user
- **Persona — "Connected Kai":** 18–30, Hong Kong, posts Reels/TikToks/YouTube, has parents/grandparents who use WeChat & phone calls, pays for a few subscriptions (Spotify, iCloud).
- **Not v1:** creators/celebrities, businesses, Mainland China users.

## 3. Goals & non-goals
**Goals**
- G1: In under 5 minutes, show a user how much of their voice is publicly exposed.
- G2: Convert scared-but-curious users into paid monitoring subscribers.
- G3: Give users concrete actions to reduce exposure.

**Non-goals (v1)**
- Detecting where a voice has *actually been cloned* (not technically possible — we measure exposure).
- Real-time call screening / scam-call detection.
- Elder-side features (safe words, check-in buttons).
- Deepfake forensics reports.
- Mainland platforms (Douyin, Xiaohongshu, Bilibili), mobile apps, non-English UI.

## 4. Core features

### F1 — Voice enrolment
- User records ~20–30s reading a randomised on-screen phrase in the browser.
- Liveness/identity check: phrase is random per session → prevents uploading someone else's recording.
- Output: a voiceprint (numeric embedding). Raw audio deleted after processing.

### F2 — Exposure scan
- **Sources:** (a) user's linked/entered own accounts on Instagram, TikTok, YouTube; (b) web search on name + handles for reposts/tags on those 3 platforms.
- **Cap:** max 50 candidate videos per free scan (cost control); higher cap on paid.
- **Output:** total minutes of matching voice found, number of sources, risk score (Low/Medium/High/Critical).

### F3 — Free vs paid reveal (freemium gate)
| | Free (1 scan) | Paid |
|---|---|---|
| Total voice minutes found | ✅ | ✅ |
| Risk score | ✅ | ✅ |
| Number of sources | ✅ | ✅ |
| Which videos/links | ❌ blurred | ✅ |
| Clone test | ❌ | ✅ |
| Guided privacy steps & takedown drafts | ❌ | ✅ |
| Ongoing monitoring + email alerts | ❌ | ✅ |
| Scan cap | 50 videos | 300 videos/month |

**The "aha":** *"We found 47 minutes of your voice publicly online."*

### F4 — Clone test (paid)
- Uses only the user's own live-verified enrolment sample.
- Shows a **side-by-side** of real vs cloned voice saying the same sentence.
- Not downloadable; audible watermark; generated clip deleted at end of session.

### F5 — Remediation (paid)
- **Guided privacy steps:** per found item, platform-specific instructions (make private, delete, archive, remove audio).
- **Takedown drafts:** pre-filled report text for reposts uploaded by others (platform privacy/impersonation forms).

### F6 — Monitoring (paid)
- Weekly re-scan of linked accounts + web search.
- Email alert only when new matching voice content is found (no spam "all clear" emails; monthly summary instead).

## 5. Risk score (v1 logic — to be tuned)
Score = f(total clean minutes, number of independent sources, audio quality, public vs semi-public).
- **Low:** < 30s clean audio
- **Medium:** 30s–3 min
- **High:** 3–15 min
- **Critical:** > 15 min or high-quality talking-head audio
*Rationale: modern cloning works from ~10–30s; more/cleaner audio = better clones.* Copy must say the score reflects **exposure**, not proof of cloning.

## 6. Pricing (hypothesis)
- Free: 1 scan.
- **Pro: HK$68/month** or HK$588/year (within the HK$50–100 range from founder interview). Test HK$48 vs HK$88 on landing page.
- Later: family plan.

## 7. Success metrics
- Activation: % signups completing enrolment + scan (target ≥ 60%).
- Aha: % scans finding ≥ 1 minute of voice (track; if most find ~0, the product weakens).
- Conversion free → paid: target 5–8%.
- Retention: paid month-2 retention ≥ 70%.

## 8. Key assumptions to validate
1. Regular HK young adults worry enough about voice cloning to pay.
2. Most of them have ≥ 1 minute of public voice online.
3. Seeing their own clone drives conversion.
4. Monitoring finds new things often enough to justify a subscription.

## 9. Name shortlist (check domains/trademarks)
- **Echoproof** — clear benefit, techy
- **VoiceVault**
- **Unclone**
- **Timbre** — premium feel
- **Vocalock**
- **Earshot** — "what's within earshot of scammers"

## 10. Open questions
- What % of a typical user's exposure comes from *other people's* posts (friends' stories)?
- Should we offer a one-off paid report for non-subscribers?
- How do we credibly explain "exposure ≠ cloned" without killing urgency?
