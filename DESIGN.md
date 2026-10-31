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
[Scan my voice — free]  Free scan. No card needed. ...
```

## Motion

Motion shows what changed after someone acts, and the waveform is the one place it gets expressive. All of it is CSS (transitions, keyframes, `@starting-style`, view transitions) plus one small `requestAnimationFrame` counter. There is no animation library. Animations use `transform`, `scale`, `translate` and `opacity`; the one exception is the disclosure height, which is the only way to show an answer opening without a jump.

Tokens live in `globals.css`: `--ease-out` (fast start, long settle) for things arriving, `--ease-in-out` for things moving between two places, and durations of 150 ms (state changes), 250 ms (enter, exit) and 600 ms (the waveform sweep per bar).

| Moment | What moves | Why |
|---|---|---|
| Landing load (the one orchestrated non-user moment) | Headline and subline rise in, a playhead sweeps the waveform left to right, each bar rises as it passes, the found stretches light up and their notes drop in when the playhead reaches them. About 1.8 s, CTA usable after 0.4 s. | It acts out a scan finding the voice, which is what the product does. |
| Header links (landing only) | Links scroll smoothly to their section; an underline slides to the section in view. | Where you are on a long page. |
| How a scan works | Each step's top rule fills left to right, 1, 2, 3, linked to scroll. | It is a real sequence, so it reads as progress. |
| Founder quote | Words go from 20 % to full opacity as they rise; full by 70 % down the viewport. | Slows the reader on the reason the product exists. |
| What we look for | A small waveform per platform; its found stretch lights left to right with scroll. | Ties each platform to "found here" using the signature visual. |
| What we keep | A waveform flattens to a thin line, left to right, with scroll. | Acts out "your recording is deleted, a voiceprint stays". |
| Closing CTA | A short waveform with the hero's scan line, played once when it is 60 % on screen. | Bookends the page right above the button. Accent stays on the button. |
| Pointer over the hero waveform (fine pointers only) | Bars near the pointer lift slightly. | The example reads as audio you can scrub, not a picture. |
| Results and dashboard load | The minutes figure counts up and the waveform sweeps in once. | The number is the answer to the scan, so it arrives as a result. |
| Scan running, then done | Bars pulse while running; on completion the bars light up left to right and each step's check pops in. | Shows progress and the moment it finished. |
| Route change | Old page fades out fast, new page rises 8 px and fades in. The header and sidebar stay still. Moving forward (into a source, to the next onboarding step) slides left; "All sources" slides right. | Tells the person the content changed and in which direction they moved. |
| Paywall dialog | Sheet slides up on phones; on wider screens it scales from 98 % and fades. The backdrop fades. Closing reverses it. | Shows where the dialog came from and where it went. |
| Disclosure (FAQ, fix steps) | The answer opens to its height and fades in; the chevron turns. | Keeps the reader's place instead of jumping the page. |
| Buttons, switches, billing toggle | Press scales to 98 %; switch thumb and billing indicator slide with `--ease-out`. | Confirms the press or the new choice. |
| Banners, mobile menu, "Copied" | Short fade and 4 px drop on mount. | Marks new information that appeared after an action. |

Scroll-linked effects use CSS scroll timelines and run only where `animation-timeline: view()` is supported and motion is welcome; elsewhere each element shows its finished state. Pricing stays still because people compare numbers there. Sections never fade in as whole blocks and cards have no hover motion. Under `prefers-reduced-motion` every animation and view transition finishes instantly, the counter shows the final number and the pointer effect is off. Content never depends on an animation finishing to be visible.

## Icons

lucide-react only, at its default stroke width. Platforms are named in text, never shown as drawn logos.
