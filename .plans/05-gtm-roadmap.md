# 05 Go-to-market and roadmap

v0.2, 31 Oct 2026.

North star: a YC application with a live demo, real users and week-over-week growth. Revenue is not a v0 goal.

## 1. Positioning

- One-liner (draft): "Hear an AI clone of your own voice, then make it harder for scammers to fool your family."
- Category: personal voice security.
- Why us, why now: the founder's grandparents got a ransom call in an AI clone of his voice. Cloning became trivial in the last two years. Existing tools protect celebrities and enterprises, not regular people and their parents.

## 2. Channels (Hong Kong, by expected return)

1. Founder story content on Instagram and TikTok: the grandparents' story and a live clone of the founder's own voice.
2. The clone test itself: every result leads to "play it to your family" and a share card.
3. Campus: HKU SPACE and other universities, student societies, class group chats. Rate limits are loose per IP so a lecture hall can all try it at once.
4. "Protect your parents" pushes around family holidays (Chinese New Year, Mid-Autumn).
5. Scam-news hooks: quick posts whenever HK police or media report a voice or deepfake scam.

## 3. Funnel (hypotheses)

Landing visit → signup 20% → clone test completed 70% → family replay or share 40% → YouTube connected 30% → checklist item done 50%.

## 4. Revenue later: B2B2C

- Banks, telcos and insurers bundle Timbre for their customers. Users never pay.
- The pitch: banks lose money when parents are scammed; Timbre reaches their customers' children and gets them to act.
- Partners get aggregate numbers only ([04](04-privacy-legal.md) §9).
- Watch the checklist wording on voice verification ("add a second factor"), since some banks use voice ID.
- Not built in v0. Partner conversations start once the demo has numbers.

## 5. Roadmap

### Phase 1: YC demo (now)

Stages 1 to 12 in [pivot-review.md](pivot-review.md) §5: docs, clone vendor spike, landing, clone test, share card, YouTube scan, checklist, then the real backend. Google OAuth verification is prepared in parallel and submitted from the stage 12 build.

### Phase 2: after the demo

- TikTok scan (apply for Display API review when the demo ships)
- Matching voice in the user's own data export, in the browser
- Possible reposts by other people (listing only)
- Monitoring alerts
- Cantonese clone test
- First partner pilot
- Lawyer review, then public launch in Hong Kong

### Phase 3: YC application

Metrics to show: clone tests completed, share-to-signup rate, week-over-week growth, cost per clone test, partner conversations.

## 6. Metrics to track from day one

Signups, clone tests completed, verification failures by reason, family replays, shares, signups from shares, YouTube connections, scans, checklist items done, cost per clone test, rate-limit hits.

## 7. Team

- Now: Nicolas (product, design, GTM, building).
- Needed: a technical co-founder with audio or ML and backend experience.
- Advisors: a privacy lawyer; someone from HK anti-fraud or a bank's fraud team.

## 8. Not on this roadmap

Mainland China is a separate future product with its own legal setup ([04](04-privacy-legal.md) §11).

## 9. Open questions

- Does the clone moment drive sharing on its own, or does it need the family step to spread?
- Which partner type (bank, telco or insurer) is most likely to pilot first?
