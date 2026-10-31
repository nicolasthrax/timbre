# Design plan

The site uses direction C, "Where it was found", chosen from three hero explorations. Directions A ("Start the scan") and B ("The call") are in the history of PR #2. Build new UI from this plan and the tokens in `src/app/globals.css`, and follow the rules in `AGENTS.md`.

## Subject

- Product: Timbre AI, which shows people where their voice is public on Instagram, TikTok and YouTube and helps them remove it.
- Audience: people aged 18 to 30 in Hong Kong who post videos and have parents or grandparents who could get a fake call in their voice.
- The landing page's job: get a visitor to start a free scan. It says what the risk is without fear tactics, and nothing claims Timbre detects clones or stops scams.
- Fixed by the brief: the headline "How much of your voice is out there?", the CTA "Scan my voice — free" (the em dash is the brief's own wording), the founder story, and the waveform with lit segments as the signature visual.

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
| `--ink` | #0E1B26 | The ink band behind the founder story |
| `--on-ink` | #FFFFFF | Text on the ink band (17:1) |
| `--on-ink-muted` | #A9B7C4 | Secondary text and the copied waveform on ink (8.5:1) |
| `--accent-on-ink` | #8EA8F2 | Lit waveform bars and the monogram on ink (7.5:1) |

The accent marks the one main action on a screen and the voice found in a waveform. Status colours always come with an icon and a label. There are no gradients, glows or blur.

## Shape and spacing

- Spacing uses an 8 px base: tighter inside groups, looser between them.
- Radii: `rounded-field` (6 px) on fields, buttons and small notes, and `rounded-card` (10 px) on cards and dialogs. Pills (`rounded-full`) appear only on badges, toggles and filter chips.
- Surfaces get a 1 px border and no shadow. Cards are used only for items you act on (a source, a plan, a form) and are never nested.

## Layout

- Landing hero: the headline on its own. The full-width example waveform sits below, with notes above its lit stretches, then the CTA row.
- Landing sections: how a scan works (a real three-step sequence), the founder story, what we look for, what we keep, pricing, questions, and a closing CTA. Sections are told apart by tone and space, not rules: they alternate the page colour and white, with generous padding, and the founder story sits on the full-bleed ink band. Panels inside a white section use the page colour instead of a border.
- How a scan works ends with "What fixing looks like": a before and after pair labelled as an example.
- What we look for: from `lg` up, the platform list scrolls past an example find that stays in place and changes with the platform in view. Below `lg` each platform has its own example card.
- Why Timbre exists (ink band): the quote is the subject, set large; beside it, two waveforms with the founder's voice from a public video and the AI copy on the call, near-identical; the founder's two paragraphs run in two columns below.
- What we keep opens with the recording-to-voiceprint figure: a waveform above its example numbers.
- App: a sidebar from `lg` up and a top bar below it, with one main column capped at `max-w-5xl`.

```
Timbre                                          Sign in  [Scan free]
How much of your
voice is out there?
      [Instagram Reel]   [TikTok repost]     [YouTube vlog]
 |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Example scan. We found 47 minutes ...
[Scan my voice — free]  Free scan. No card needed. ...
```

## Motion

- The waveform pulses only while something is happening (a scan running or a clone being generated).
- Button and toggle state changes are short colour transitions.
- The three "How a scan works" steps pop in (fade, rise 32 px, scale from 96 %) as each enters the viewport, staggered 120 ms when they enter together. They are only hidden when the list starts below the fold and motion is allowed.
- Three landing figures are linked to scroll with CSS scroll timelines: the "after fixing" figure counts down from the "before" value while the fixed stretches go dark; the voiceprint waveform flattens left to right and its numbers appear on the line; the platform example card cross-fades (300 ms) when the platform in view changes. Without scroll timelines, or with reduced motion, each shows its finished state.
- Everything respects `prefers-reduced-motion`.

## Icons

lucide-react only, at its default stroke width. Platforms are named in text, never shown as drawn logos.
