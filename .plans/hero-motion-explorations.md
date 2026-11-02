# Hero and motion explorations (Nov 2026)

Task: redesign the landing page around a new hero demo, with expressive animation throughout. The page's one job is to get a visitor to click "Hear my clone". The founder's real example recording does not exist yet (`exampleClone.realSrc`/`cloneSrc` are null in `src/content/landing.ts`; the spike instructions are in `scripts/spike/clone-vendors/README.md` §6), so every direction must work as pure visuals until it lands, and upgrade to real playback when it does. No audio may be invented for the marketing page.

Three directions were explored before building.

## Direction A, "The echo" (hero: one voice turning into another)

The headline sentence types in word by word as a soft waveform speaks it. Halfway down the hero, the same waveform repeats itself shifted in time, quieter and slightly out of register, lit in the accent: the copy. Scroll-linked echoes trail section headings; the closing CTA's echo arrives in step with the button.

- Says: a voice always makes a copy, and you can't stop the second one.
- Risk: poetic but indirect. An echo is natural; cloning isn't. Weakest call to action of the three.
- Motion library use: none needed, CSS scroll timelines carry it.

## Direction B, "The incoming call" (hero: the scam call as UI)

A phone-call card rings into the hero: "Grandma · calling…", an animated avatar made of concentric sound rings. Answering shows a live transcript ("Kai has had an accident, I need money") where each word flickers from grey (heard) to accent (cloned). Below: "This call could be made in minutes from your videos. Hear how real your voice sounds first." and the CTA.

- Says: the risk, exactly as the PRD describes it, felt in seconds.
- Risks: fear tactics unless every beat carries its action; reusing a family's real scam wording walks close to the tone line (PRD §11 Q1); reads as alarmist next to the brand's calm blue-grey; and at 320 px the card eats the headline's space.
- Better placed lower on the page than as the hero.

## Direction C, "The clone booth" (hero: the product moment, simulated)

A single console that plays the whole promise without asking for anything:
1. A mic row listens while a challenge sentence types itself (a real idle level meter, no fake speech).
2. A short "making your clone" pass, bars converging.
3. Two identical rows appear: "You" and "Your AI clone". A playhead crosses the real row; as it passes, the clone row lights up bar by bar behind it, one beat late. The lag is the lesson: the copy follows the original everywhere.
4. "Hear my clone" sits directly under the machine that just demonstrated it. When the founder's example recording exists, real play buttons replace the simulation in the same slot.

- Says: hear it for yourself, and here is what "it" looks like.
- Cost: needs JS orchestration; the no-JS state must show the finished pair.

## Recommendation: C, with B's ring motif moved to the family section

C puts the CTA at the end of a demonstration rather than a description, which is what the brief asks for. B's strongest image, a call arriving, belongs where the page talks about the call: the family section gets an incoming-call card that morphs into the code-word tip. A survives as the clone row trailing the real row, which is already step 3.

Built as C + the family-section call card. Motion uses the `motion` package (installed): variants and staggered sequences for the console, `useInView` triggers per section, spring transitions tuned to avoid bounce. Everything degrades: content renders server-side in its final state, animation layers hide themselves when JS is off or reduced motion is set.
