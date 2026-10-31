# Hero redesigns: token plans

Three directions for the landing hero only. Each is built from its own plan below and can be previewed at `/hero-lab/a`, `/hero-lab/b` and `/hero-lab/c`. The rest of the site still uses the v0 tokens in `src/app/globals.css` until one direction is chosen.

## Subject

- Product: Timbre AI, which shows people where their voice is public on Instagram, TikTok and YouTube and helps them remove it.
- Audience: people aged 18 to 30 in Hong Kong who post videos and have parents or grandparents who could get a fake call in their voice.
- The hero's one job: get a visitor to start a free scan. It has to say what the risk is without fear tactics, and the copy can't claim Timbre detects clones or stops scams.
- Fixed by the brief: the headline "How much of your voice is out there?", the CTA "Scan my voice — free" (the em dash is the brief's own wording), the founder story, and the waveform with lit segments as the signature visual.

## Shared copy

- Subline: "AI can copy a voice from a few seconds of audio, and scammers use those copies to call families. Timbre shows where your voice is public on Instagram, TikTok and YouTube, and helps you take it down."
- Reassurance line: "Free scan. No card needed. Raw audio is never stored."
- Founder line, from `.plans/01-prd.md`: "Scammers called my grandparents with an AI clone of my voice. They only avoided paying because they reached me directly." Nicolas Fostier, founder.
- Example result, from the brief: "We found 47 minutes of your voice in 12 public videos." Always labelled as an example.

## Shared rules

- Spacing base: 8 px.
- Each direction sets the same token names (`--hero-*`) under its own scope class, mapped to Tailwind utilities in `globals.css` (`bg-hero-bg`, `text-hero-muted`, `rounded-hero-card`, ...).
- Icons come from lucide-react only. Platforms are named in text, never shown as drawn logos.
- No pill badge above the headline, no radial glow, no gradient wash, no monospace data labels, no arrows on buttons.

## A. Start the scan

The hero is the first step of the product: a handle field you can fill in right away, next to an example of the report you get back.

- Type: Public Sans, for display and body. It was made for the US government's web design system, and its plain public-service tone fits a safety tool. Scale: 56 / 20 / 16 / 14 px.
- Color:
  - `--hero-bg` #F4F7F9: page, a cool off-white.
  - `--hero-surface` #FFFFFF: the form and the report.
  - `--hero-ink` #142231: text.
  - `--hero-muted` #4B5B6B: secondary text, 6.5:1 on the page.
  - `--hero-line` #D5DDE4: borders and unlit bars.
  - `--hero-action` #0A6B52: the button and lit waveform bars, a deep "safe" green with white text at 6.5:1.
- Shape: 8 px radius on fields, 12 px on cards, a 1 px border, no shadow.
- Layout: two columns. The left one holds the headline, the subline and the form. The right one holds the example report: a waveform strip, then three source rows.

```
[Timbre]                                        [Sign in]
How much of your voice        | Example report          |
is out there?                 | |||||||||||||||||||||    |
subline                       | Instagram Reel   2m 10s |
[@handle_______][Scan ...]    | TikTok repost      48s  |
reassurance                   | YouTube vlog     6m 02s |
```

## B. The call

The hero opens on what actually happened: a phone ringing with a familiar name, and a voice that isn't really them.

- Type: Schibsted Grotesk, for display and body. It was drawn for a news publisher. The founder story reads like a scam report in the news, and scam news is one of Timbre's launch channels. Scale: 60 / 20 / 17 / 14 px.
- Color:
  - `--hero-bg` #0F1B2D: page, the blue of a phone screen at night (chosen on purpose, not a default near-black).
  - `--hero-surface` #182A42: the phone body.
  - `--hero-ink` #EEF2F7: text.
  - `--hero-muted` #A9B6C7: secondary text, 8.4:1 on the page.
  - `--hero-line` #2A3E5A: borders and unlit bars.
  - `--hero-action` #F5C04A: the button and lit bars, a signal yellow with page-coloured text on it at 10.3:1.
- Shape: 10 px radius on the button, 16 px on the founder quote, 36 px on the phone (a phone shape), no shadows.
- Motion: one moment. The phone's waveform pulses like a live call, because the call is the subject. It's off under reduced motion.
- Layout: two columns. The left one holds the headline, the subline, the founder quote and the CTA. The right one holds the phone, with a caption under it.

```
[Timbre]                                  [Sign in]
How much of your voice          .-------------.
is out there?                   |  Nicolas    |
subline                         |  mobile     |
| "Scammers called my ..."      |  |||||||||  |
|  Nicolas Fostier              | Decline Acc.|
[Scan my voice — free]          '-------------'
reassurance                     caption
```

## C. Where it was found

The waveform itself is the hero. It runs the full page width, and notes above the lit parts say where each piece of voice was found.

- Type: Atkinson Hyperlegible Next, for display and body. The Braille Institute designed it for readers with low vision. The people Timbre protects include elderly relatives, and plain, readable text matches the honest tone. Scale: 64 / 20 / 17 / 15 px.
- Color:
  - `--hero-bg` #E8EEF3: page, a pale blue-grey.
  - `--hero-surface` #FFFFFF: the note cards.
  - `--hero-ink` #0E1B26: text.
  - `--hero-muted` #44535F: secondary text, 6.8:1 on the page.
  - `--hero-line` #AFBCC8: unlit bars and connectors.
  - `--hero-action` #1F47B8: the button and lit bars, a cobalt blue with white text at 7.9:1.
- Shape: 6 px radius on the note cards and the button. Each note has a 1 px border and no shadow.
- Layout: the headline on the left, with the subline in a narrow right column on the same row. The waveform runs full width below, with the notes pinned above it, and the CTA row sits under the waveform.

```
[Timbre]                                        [Sign in]
How much of your                    subline subline
voice is out there?                 subline
      [Instagram Reel]   [TikTok repost]     [YouTube vlog]
 |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
[Scan my voice — free]  reassurance           Example scan
```

## Review against the brief

- All three keep the brief's headline, CTA and waveform, and none claims to detect cloning.
- A opens on a working tool, B on the event behind the product, C on the signature visual. None uses the centred hero with a pill badge, and each picks a face other than the v0 Geist.
- B is the only dark one. Its blue comes from the night-time call it depicts and its accent is yellow, so it stays clear of the near-black-plus-neon look.
