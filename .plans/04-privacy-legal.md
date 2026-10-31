# 04 — Privacy, Legal & Trust

> Not legal advice. Have a Hong Kong lawyer review before public launch (many offer startup packages; Cyberport/HKSTP programmes can connect you).

## 1. Company setup — recommendation
1. **Now → validation:** no company. Build the landing page and run interviews under your own name.
2. **Before taking payments:** register a **Hong Kong limited company** (cheap, quick, credible for HK users and Stripe HK).
3. **If accepted to YC / raising from US investors:** YC typically asks companies to be (or convert to) a US (Delaware) C-Corp or certain other structures — flip then, with YC's/a lawyer's guidance. Don't pay for Delaware upfront.

## 2. Hong Kong Personal Data (Privacy) Ordinance (PDPO)
Voiceprints are biometric personal data → treat as **highly sensitive**.
Design to the 6 Data Protection Principles:
| Principle | What we do |
|---|---|
| DPP1 Collection purpose | Collect only what's needed for scanning; clear purpose statement at consent |
| DPP2 Accuracy & retention | Delete raw audio immediately; delete voiceprint + results on account deletion or after 12 months inactive |
| DPP3 Use | Never use voice data to train models or for anything beyond the user's own scans without separate opt-in consent |
| DPP4 Security | Encryption at rest/in transit, RLS, access logs, minimal staff access |
| DPP5 Openness | Public privacy policy in plain English |
| DPP6 Access & correction | Self-serve export + delete in Settings |

Also: cross-border transfer (servers in Singapore) must be disclosed. If later serving Mainland users, China's PIPL applies — separate review.

## 3. Consent design
- Separate, explicit consent screen before enrolment (not buried in ToS).
- Versioned consent stored with timestamp.
- Separate consent for clone test.
- Users can revoke anytime → triggers deletion.

## 4. Platform terms of service (biggest legal risk)
- Downloading audio from Instagram/TikTok/YouTube outside their official APIs likely breaches their ToS, even for public content.
- Lower-risk path for v1:
  1. Official APIs for the user's **own** accounts.
  2. **User-provided links** (user submits URLs they want checked).
  3. Web search only to *list* candidate URLs; get a legal view before fetching audio from them.
- Never store downloaded media; process and delete.

## 5. Third-party voices
Found videos contain other people's voices too. Only compute embeddings transiently; store results **only** for the matched user; never build profiles of anyone else.

## 6. Clone-test misuse safeguards
- Only the account holder's own voice, verified by a fresh live random phrase.
- Paid accounts only (payment identity = deterrent), rate-limited, audit-logged.
- Fixed sentence chosen by us (no custom text → can't generate scam scripts).
- Watermarked, streamed, never downloadable, deleted after session.
- Terms of Service ban misuse; accounts terminated on abuse.

## 7. Model & software licences
- Check every model's licence for **commercial use** (many voice-cloning and some diarisation models are non-commercial).
- Keep a `LICENSES.md` listing every model/library + licence.

## 8. Marketing claims (consumer protection)
- Don't claim "we detect if your voice was cloned" or "we stop scams" — say "we show where your voice is publicly exposed and help you reduce it".
- Risk score must be explained as an estimate.

## 9. Documents needed before launch
- Privacy Policy (PDPO-compliant)
- Terms of Service (incl. acceptable use / anti-abuse)
- Consent texts (enrolment, clone test)
- Data retention & deletion policy (internal)
- Breach response plan (who to notify, incl. the PCPD; within what time)

## 10. Open questions
- Lawyer's view on fetching audio from public URLs surfaced by web search.
- Do takedown drafts create any liability if the user misuses them?
