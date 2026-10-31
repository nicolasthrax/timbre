# 02 — Design Doc

## 1. Brand direction: techy & premium
- **Feel:** a premium security tool — think Linear/Arc/1Password, not antivirus pop-ups.
- **Principles:** calm confidence (never cheap fear tactics), show real data, one clear action per screen.
- **Palette (starting point):** near-black background `#0B0D10`, off-white text `#E8EAED`, one accent (electric teal `#2EE6C5`) for "safe/action", amber `#FFB020` for warnings, red reserved strictly for Critical.
- **Type:** a geometric sans (e.g. Inter / Geist) + a monospace for numbers and data (e.g. Geist Mono / JetBrains Mono).
- **Signature visual:** a live audio waveform that "lights up" segments where the voice was found.
- **Tone of copy:** precise, honest, short. "We found 47 minutes of your voice in 12 public videos." Never "Your voice HAS BEEN CLONED!"

## 2. Information architecture
```
Landing → Sign up → Enrol voice → Add accounts → Scanning → Results
                                                             ├── (free) blurred report → Upgrade
                                                             └── (paid) full report
                                                                   ├── Source detail → Fix steps / Takedown draft
                                                                   ├── Clone test
                                                                   └── Monitoring settings
Settings: account, billing, delete my data
```

## 3. Key flows

### Flow A — First scan (free)
1. **Landing:** headline "How much of your voice is out there?" + CTA "Scan my voice — free".
2. **Sign up:** email magic link or Google. No password.
3. **Consent screen:** plain-English explanation of what we store (voiceprint only, raw audio deleted), checkbox.
4. **Enrol:** mic permission → read 3 random sentences → live waveform + quality meter ("too quiet", "background noise").
5. **Add accounts:** enter IG / TikTok / YouTube handles (or connect where supported) + full name for web search. Skip allowed for any.
6. **Scanning:** progress screen with honest steps ("Collecting public videos… 32/50", "Matching voice…"). Email when done if user leaves (scans may take minutes).
7. **Results (free):** big number "47 min", risk badge, source count, blurred source list, upgrade card.

### Flow B — Upgrade
- Paywall sheet: what unlocks, monthly/yearly toggle, Stripe Checkout, return to unblurred report.

### Flow C — Clone test (paid)
1. Explain what will happen + "this clip can't be downloaded and is deleted after".
2. Generate (loading ~10–30s).
3. Side-by-side player: **Real** vs **Clone**, same sentence, synced waveforms.
4. Follow-up CTA: "Reduce your exposure →".

### Flow D — Remediation
- Source card: thumbnail, platform, date, minutes of voice, "posted by you / by someone else".
- If by you → step-by-step platform instructions + "Mark as fixed".
- If by others → "Copy takedown request" + link to the platform's report form.
- Score recalculates when items are marked fixed (re-verified on next scan).

### Flow E — Alert
- Email: "New: 3 minutes of your voice found on TikTok" → deep link to the source card.

## 4. Screen list (MVP)
1. Landing page
2. Sign-in
3. Consent
4. Voice enrolment
5. Add accounts
6. Scan progress
7. Results — free (blurred)
8. Paywall
9. Results — paid (dashboard)
10. Source detail + remediation
11. Clone test
12. Settings (account, billing, monitoring, delete data)

## 5. States to design (often forgotten)
- Mic denied / no mic / poor audio quality
- Scan found **nothing** (must still feel valuable: "Low exposure — here's how to keep it that way")
- Private account / platform blocked fetch
- Scan partially failed (some sources unreachable)
- Payment failed / subscription lapsed (report re-blurs, data kept 30 days)
- Data deletion confirmation

## 6. Accessibility & responsiveness
- Mobile-first (most HK users will arrive from Instagram on phones).
- WCAG AA contrast on dark theme; don't rely on colour alone for risk levels (icons + labels).
- Captions/text for all audio (clone test shows transcript).

## 7. Open questions
- Should results be shareable (e.g. an Instagram-story-sized "My voice exposure: 47 min" card) for virality? Risk: tells scammers who's exposed — share only the number, never sources.
- Final name and logo.
