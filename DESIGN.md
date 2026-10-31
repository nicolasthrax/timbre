# Design plan

The site uses direction C, "Where it was found", chosen from three hero explorations. Directions A ("Start the scan") and B ("The call") are in the history of PR #2. Build new UI from this plan and the tokens in `src/app/globals.css`, and follow the rules in `AGENTS.md`.

## Subject

- Product: Timbre AI, which lets people hear an AI clone of their own voice, shows how much of their voice is public on YouTube, and gives them steps to protect themselves and their family. See `.plans/01-prd.md` (v0.2).
- Audience: people aged 18 to 30 in Hong Kong who post videos and have parents or grandparents who could get a fake call in their voice.
- The landing page's job: get a visitor to hear their own clone. It says what the risk is without fear tactics (every risk line is followed by an action), and nothing claims Timbre detects clones or stops scams.
- Fixed by the brief: the founder story. The old headline ("How much of your voice is out there?") and CTA ("Scan my voice, free" with a dash) belong to the scan-first product and are replaced in stage 3 of `.plans/pivot-review.md`. The hero direction below (direction C) is revised in stage 4, before the landing page is rebuilt.
- Copy rule: "audio never leaves your device" appears only next to the data-export upload feature (post-demo), never in general marketing copy.

## Type

Atkinson Hyperlegible Next, for everything. The Braille Institute designed it for readers with low vision. The people Timbre protects include elderly relatives, and plain, readable text matches the honest tone. Numbers use `tabular-nums` rather than a second, monospace face.

Scale: 64 px display (`text-display`), then Tailwind's 36 / 30 / 20 / 18 / 16 / 14 / 12 px steps. Body text is 16 to 18 px with a line height near 1.5, and copy is capped at `max-w-copy` (54ch). Headings are bold and in sentence case, with more space above them than below. There are no eyebrow labels and no uppercase tracking.

## Color

| Token | Hex | Role |
|---|---|---|
| `--bg` | #E8EEF3 | Page, a pale blue-grey |
| `--surface` | #FFFFFF | Cards, fields, dialogs |
| `--surface-2` | #F3F6F9 | Hover and raised areas |
| `--border` | #C9D4DD | Card hairlines (decorative) |
| `--field` | #7A8896 | Input, select and secondary-button borders (3.6:1 on white) |
| `--bar` | #AFBCC8 | Unlit waveform bars, connectors |
| `--text` | #0E1B26 | Text |
| `--text-muted` | #44535F | Secondary text (7.9:1 on white, 6.8:1 on the page) |
| `--accent` | #1F47B8 | Primary actions and lit waveform bars, with white text at 7.9:1 |
| `--accent-hover` | #193A96 | Hover on primary actions |
| `--success` | #17663F | Low risk, fixed items, "good" recording quality |
| `--warn` | #8A5300 | Medium and high risk, open items, quality warnings |
| `--danger` | #B42318 | Critical risk, destructive actions, errors |

The accent marks the one main action on a screen and the voice found in a waveform. Status colours always come with an icon and a label. There are no gradients, glows or blur.

## Shape and spacing

- Spacing uses an 8 px base: tighter inside groups, looser between them.
- Radii: `rounded-field` (6 px) on fields, buttons and small notes, and `rounded-card` (10 px) on cards and dialogs. Pills (`rounded-full`) appear only on badges, toggles and filter chips.
- Surfaces get a 1 px border and no shadow. Cards are used only for items you act on (a source, a plan, a form) and are never nested.

## Layout

- Landing hero: the headline on the left with the subline on the right of the same row. The full-width example waveform sits below, with notes above its lit stretches, then the CTA row.
- Landing sections: how a scan works (a real three-step sequence), the founder story, what we look for, what we keep, pricing, questions, and a closing CTA. Sections are separated by a rule, not by cards or backgrounds.
- App: a sidebar from `lg` up and a top bar below it, with one main column capped at `max-w-5xl`.

```
Timbre                                          Sign in  [Scan free]
How much of your                    subline subline subline
voice is out there?                 subline subline
      [Instagram Reel]   [TikTok repost]     [YouTube vlog]
 |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Example scan. We found 47 minutes ...
[Primary CTA]  Reassurance line ...
```

## Motion

- The waveform pulses only while something is happening (a scan running or a clone being generated).
- Button and toggle state changes are short colour transitions.
- Everything respects `prefers-reduced-motion`.

## Icons

lucide-react only, at its default stroke width. Platforms are named in text, never shown as drawn logos.
