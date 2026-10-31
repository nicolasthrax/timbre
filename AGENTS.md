<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Anti-slop rules

Sections 1 to 4 of `docs/anti-slop.md` are always on and copied below. Read the vocabulary list (section 5), enforcement notes (section 6) and sources (section 7) in `docs/anti-slop.md` only when reviewing or editing prose. Run `scripts/slop-check.sh FILE...` on changed prose and UI copy before committing.

The product brief in `.plans/` and the token plan in `DESIGN.md` take precedence over these rules where they conflict.

## 1. Core design rules

### Start with a token plan tied to the brief

Before writing any UI code, write a short plan and keep it in the repo (for example `DESIGN.md`), then build only from it. Generated pages converge on the statistical center of their training data; a plan made from the brief is what pulls the output away from that center.

- Subject first. Name the product, the audience and the page's main job. If the brief does not say, propose them and confirm. Distinct choices come from the subject's industry, materials and vernacular: a toy for 8 to 11 year olds and a dashboard for financial analysts should look nothing alike.
- Color: 4 to 6 named hex values, named by role (`--color-action`, `--color-warning`, `--color-surface`), never `gradient-start` or `purple-500`.
- Type: one or two families with a stated reason from the brief, a role for each (display, body, data), and a type scale.
- Spacing and shape: a 4 px or 8 px spacing base; two radii (one for fields, one for cards) plus a pill radius only where a pill fits; one shadow depth shared across themes.
- Layout: one sentence per page shape (home, detail, form, list) and a rough ASCII wireframe showing alignment.
- Review pass. Reread the plan against the brief. Revise anything you would have produced for any similar page. Then build.

### Typography

- Choose faces for a reason you can state from the brief. Do not reach for Inter, Geist, Roboto, Arial, Open Sans, Lato or the system stack by default, and do not swap in the next default either (Space Grotesk, Fraunces, Instrument Serif have all become convergence points). Any font list, including one in a guide like this, turns into the next default.
- Body text near 16 px, line height near 1.5, line length under about 75 characters (`max-width: 65ch` is a good start). Serif body text gets a little more line height.
- Use sentence case and start-aligned text. Put more space above a heading than below it so it belongs to the section it introduces.
- Build hierarchy from weight, color and steps on your scale. Keep body tracking near default; wide tracking is for short labels only.
- Do not accent a single word in a headline with italic, bold or a different color, and do not put a label above every heading. These are among the most common tells of a generated page.

### Color

- One dominant color, one accent, and neutrals. Decide which elements get the accent and why, and keep it off everything else so it still marks the important element.
- Keep accent saturation moderate unless the brief calls for loud. Use one palette per project and do not mix warm and cool grays.
- Use a gradient only to point at one element, never as a wash behind everything.
- Tint shadows toward the background hue rather than using flat `rgba(0,0,0,.1)`.
- Meet WCAG AA: 4.5:1 for body text, 3:1 for large text (18 px and up) and UI components. Never put gray text on a colored background or light gray on white.

### Layout

- Group with space, proximity and type. Use a card only when the item is independently actionable or elevation shows real hierarchy. Never nest cards inside cards.
- Let the content set the section order and count. A centered hero, three equal feature cards, logos, pricing, FAQ is the template every generator ships.
- Open the page with the most characteristic thing in the subject's world: a product shot, a live demo, a real headline, a working tool. A big number with a small label and a gradient accent is the default; use it only when it is the best option.
- Vary radius with hierarchy. Keep the edge or the shadow on a surface, not both. Shrink radius as cards get smaller.
- Use tighter spacing inside groups and looser spacing between them. Use CSS Grid for columns instead of `w-[calc(33%-1rem)]`. Use `min-h-[100dvh]` instead of `h-screen` for full-height sections.
- Numbered markers (01, 02, 03) are for real sequences only: steps, timelines.
- Familiar, plain layouts are correct for internal tools and dashboards. Distinctiveness matters most on brand and marketing pages.

### Components

- One icon family per project with one stroke width. Never use emoji as icons, bullets or section markers. Do not hand-roll SVG icons. If you use a sparkle icon for AI features, pair it with a text label; in NN/g testing, no participant connected the sparkle to "artificial intelligence".
- Restyle library defaults (modal, toast, chart, spinner) to the token plan. Unstyled defaults date a page.
- No decorative status dots or pulsing "Live" and "New" pills on things that are neither.

### Motion

- Motion should answer a user action (open, expand, confirm, save) and show what changed. Add at most one orchestrated non-user moment, such as a page-load sequence.
- Do not fade and slide up every section on scroll or add hover transitions to every card; that pattern reads as generated.
- Animate `transform` and `opacity` only. Use non-linear easing, not bounce or elastic. Give each animation a one-sentence reason.
- Respect `prefers-reduced-motion`. Content must be visible by default so the page works if JavaScript or the animation fails.

### Accessibility floor

Meet this without announcing it: visible focus styles (never `outline-none` without a `focus-visible` replacement); `aria-label` on icon-only buttons; meaning never carried by color alone; `sr-only` instead of `hidden` for screen-reader text; focus trapped in modals; a skip link; touch targets near 44 by 44 px; layouts checked at 320 px wide; the real `disabled` attribute, not only `pointer-events-none`; heading levels in order with no jump from h1 to h3; no hover-only actions, since touch screens have no hover.

### Real content and states

- Write copy from the user's side: "Manage notifications", not "Configure webhooks". Buttons say what happens ("Save changes", not "Submit"), and the same action keeps one name through the flow ("Publish", then "Published").
- Error messages say what went wrong and what to do next, without apologizing. Empty states invite the next action. Design loading, empty and error states for every view that fetches data.
- Use real or realistic content from the brief. Never invent metrics, customer logos, testimonials, ratings or user counts. Show a metric only when it explains the product. If content is missing, leave a clearly marked gap and ask.
- No placeholder residue in shipped output: `{{TOKENS}}`, lorem ipsum, "John Doe", "Jane Doe, CEO", "Acme", "TechCorp", `NaN`, `null`, dead nav links.

### Code hygiene for UI

- Tokens over literals. No hex colors, pixel values or Tailwind arbitrary values (`text-[#1a1a1a]`, `mt-[13px]`) outside the token file. If you need a new value, add it to the tokens (`@theme` in Tailwind v4) and say so.
- Components over copied class lists. When the same long class string appears twice, extract a component.
- No interpolated class names like `` `text-${color}-500` ``; the build purges them. No two conflicting utilities on one element. Do not mix inline styles and utilities for the same property.
- Match the project's Tailwind version: v4 uses `@import "tailwindcss"` and `@theme`, not `tailwind.config.js` and `@tailwind base`.
- Use `currentColor` for SVG fills. Watch for specificity collisions between type-based and element-based selectors (`.section` padding overriding `.cta`).
- In long sessions, rules fade from context and new grays, radii and gradients creep in. Before finishing, diff the stylesheet against the token plan and remove anything off-system.

## 2. Design tells to avoid

Treat each item as a default to question, not a law. Any of them is fine when the brief asks for it.

Cluster A, the 2023 to 2025 Tailwind and shadcn SaaS kit:

- [ ] Indigo or purple gradients, above all `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`; `bg-indigo-500` buttons; purple-to-blue hero washes
- [ ] Inter or Geist for everything, with no second face
- [ ] `rounded-2xl` or `rounded-3xl` on every element, one radius everywhere, the same `shadow-lg` and `p-6` on every card
- [ ] A thick colored left border on a rounded card, or side tabs cycling red, blue, green, orange
- [ ] Emoji icons in nav, headings, bullets or form fields; a rounded-square icon tile above every heading
- [ ] Glassmorphism (`backdrop-filter: blur(20px)` on every panel), neon glow (`box-shadow: 0 0 80px rgba(120,80,200,.6)`), aurora or radial bloom behind the hero, gradient text
- [ ] Centered hero with a pill badge above the headline, then three identical one-third cards with centered icons, then the fixed hero, features, social proof, pricing, FAQ, footer order
- [ ] Six-card or sixteen-cell identical grids; faux dashboards in the hero
- [ ] Fake metrics ("10,000+ users", "99.9%", "5-star"), fake logo strips, "Jane Doe, CEO" testimonials
- [ ] Copy verbs like "Empower", "Unlock", "Supercharge", and headlines like "Build the future of work"

Cluster B, the 2026 "Claude aesthetic":

- [ ] Cream or beige background near `#F4F1EA` (also `#f5f1ea`, `#efeae0`)
- [ ] Terracotta or warm-clay accent near `#D97757` (also rust `#b6553a`, brass `#b08947`). This is Anthropic's own interface accent, so on a user's project it reads as a tell.
- [ ] Large high-contrast serif headline, often italic, or one serif word dropped into a sans headline
- [ ] Tracked-out ALL-CAPS eyebrow above every heading
- [ ] 01 / 02 / 03 markers on content that is not a sequence
- [ ] Meta strings joined with middle dots ("Design · 4 min · 2026"), and labels built as a capitalized word, a spaced em dash, then a fragment
- [ ] Monospace for small data labels; version stamps and `00 / INDEX` labels on marketing pages
- [ ] An arrow appended to every link and button label
- [ ] Ticker or marquee bars; tinted near-black (`#0B0B0B`, `#111`) used by reflex instead of a chosen dark

Two neighboring clusters also show up: near-black with one acid-green or vermilion accent, and the broadsheet look (hairline rules, zero radius, dense newspaper columns).

Dodging one cluster must not land you in another. "Avoid purple" pushed models straight into cream, serif and terracotta. Do not replace a banned look with a fixed alternative; go back to the token plan and derive the choice from the brief. Sources also disagree on details (one guide says always tint black, Anthropic lists tinted near-black as template chrome), which is one more reason to decide from the brief rather than from a list.

Self-review before you hand off:

1. Screenshot the page at desktop and at 320 px.
2. Reverse squint test: show the screenshot to a fresh session with no context and ask which AI builder made it. If it can name one, or names a cluster above, revise.
3. Check each tell above against the screenshot, not against your memory of the code.
4. Remove one accessory: take away the decoration that contributes least and see if the page improves.
5. Click through slowly. Tab through with the keyboard. Trigger the empty and error states.

## 3. Writing rules

Most prose tells share one root: ornament standing in for a claim. The general fix is to replace each flourish with the specific fact it gestures at, or delete it.

- Lead with the point. The first sentence answers the question or states the change.
- Use plain verbs. Write "is", "has", "uses", "shows" where you were about to write "serves as", "boasts", "utilizes", "showcases".
- Make specific claims. Give the number, the name, the date, the file. If a sentence only signals importance, cut it.
- Name your sources. "Kobak et al. (2025) found" instead of "studies show". If you have no source, state the claim as your own or drop it.
- Let the content set the count. Two reasons are fine. Four are fine. Do not pad to three.
- End the sentence at the fact. If the implication matters, give it its own sentence with evidence.
- Use short connectors ("but", "so", "still", "and") or none. The paragraph's order should carry the logic.
- Skip the recap. Short pieces need no summary. A long piece can end on what to do next.
- Contractions are fine. Let sentence length follow the content instead of a fixed rhythm.
- Never invent names, numbers, quotes, links, ISBNs or DOIs. When a detail is missing, ask or leave a marked gap.
- Leave chat out of artifacts. Files, docs and UI copy do not open with praise for the request, do not close with offers of more help, and do not carry knowledge-cutoff disclaimers.

Formatting:

- Use a list for discrete, parallel items or when asked. Use paragraphs for reasoning.
- Bold one or two phrases per page at most, and only where a reader scanning must not miss them. No bold label plus colon at the start of every bullet.
- Headings in sentence case, levels in order, no horizontal rule before each heading. No table for one or two facts.
- No emoji in headings, bullets, docs, comments or commit messages unless the project's existing style uses them.
- For asides, use commas, colons, parentheses or a new sentence. Default to zero em dashes; follow house style if the project has one. Use en dashes for ranges only where the project already does.
- Match the target format's quote style instead of normalizing it.

Sentence-structure tells and their rewrites:

| Tell | Example | Rewrite |
|---|---|---|
| Negative parallelism | "It's not a tool, it's a movement." / "Not just fast, but reliable." | Say what it is: "The tool cuts build time from 9 to 2 minutes." Keep a contrast only to correct a belief the reader actually holds. |
| Forced triad | "fast, flexible, and future-proof" | List what is true, at whatever count. |
| "-ing" tail clause | "...released in 2019, highlighting its commitment to openness." | Stop at the fact, or add a sentence with the evidence for the implication. |
| Significance inflation | "marks a pivotal moment", "a testament to" | State the fact and let the evidence show the weight. |
| Copula avoidance | "serves as the entry point" | "is the entry point" |
| Vague attribution | "Experts argue", "Industry reports suggest" | Name the source or state the claim directly. |
| False range | "from small startups to global enterprises" | Name the actual users. |
| Elegant variation | "the protagonist... the key player... the eponymous character" | Repeat the noun. |
| Staged setup | "Here's the thing:", "The kicker?", a rhetorical question then its answer | Delete the setup and state the point. |
| Arguing with no one | "Some might say X. But..." when no one said X | Make the positive claim. |
| Sycophantic opener | "Great question!", "Certainly!" | Start with the answer. |
| Summary closer | "In conclusion...", "Overall..." on a short piece | Delete it, or end with the next step. |
| Hedging stack | "could potentially possibly" | One hedge where real uncertainty exists: "may". |
| Filler phrase | "In order to", "It is important to note that" | "To", or delete. |
| Mannered prose | "a dial worth turning" | "a parameter worth changing" |
| Em-dash overuse | three dashes in a paragraph | Commas, colons, parentheses, or two sentences. |
| Heavy bold, emoji bullets, title case | a rocket emoji, then "**Key Features And Benefits**" in bold | "Features", plain list, no emoji. |

Before and after (illustrative):

<example>
Before: "Nestled in the heart of the old town, the library stands as a testament to the community's rich cultural heritage, showcasing its enduring commitment to learning."
After: "The library opened in 1912 on Market Street. It lends about 40,000 books a year."
</example>

<example>
Before: "It's not just a cache, it's a performance layer that empowers teams to move faster."
After: "The cache answers repeat reads from memory. In the load test, p95 latency fell from 180 ms to 40 ms."
</example>

<example>
Before (UI copy): a sparkle emoji, then "Unlock seamless collaboration"
After: "Edit the same document with your team and see their changes as they type"
</example>

## 4. Code, comments, commits and PRs

Code:

- Comment why the code exists or which constraint it works around. Delete comments that restate the next line ("// increment i by 1", "This function calculates the total").
- No emoji in comments, log lines or console output. No section-divider comment banners.
- Remove debug logging and function entry and exit logs before finishing.
- A TODO names an owner or ticket and a reason. "TODO: implement" is not allowed.
- Catch only errors you can handle at that point; otherwise let them propagate. No empty catch blocks, no catch blocks that only log, no try wrapped around code that cannot throw. Error messages say what failed, never "Something went wrong".
- Validate at system boundaries and trust the types inside. No triple null checks on values the types already guarantee.
- No abstraction with a single caller, no interface with a single implementation, no wrapper that only forwards.
- Use names that describe the thing. Avoid `data`, `result`, `helper`, `utils`, `manager` as complete names. Avoid `any`.
- Remove unused imports and dependencies. Keep filename casing consistent with the project.
- Remove generator residue: builder meta tags, platform packages such as `lovable-tagger` or `@base44/sdk` the project does not use, and `ignoreBuildErrors: true`.
- Tests check real behavior. Do not test the mock, do not mock the unit under test, never write `expect(true).toBe(true)`.
- Leave no stray files (`index-revised-2.html`, `DEBUGGING-RESULTS.md`, scratch notes) in the tree.
- Never leave placeholder output such as "rest of code here" in place of the full change.

Commits:

- Subject: imperative mood, within the project's length limit, describing the change ("Return 401 for expired sessions").
- Body: why the change was needed, and the issue link. Do not restate the diff file by file.
- No emoji, no inflated adjectives, no test-plan boilerplate unless the project's template asks for it.
- Leave attribution or co-author lines your harness or the project requires.

Pull requests:

- Fill the project's PR template if it has one. Otherwise: what changed, why, how you tested it in this environment, and what a reviewer should look at first.
- Scale the description to the change. A one-line fix gets a few lines. In a study of 33,596 agent PRs (Watanabe et al., MSR 2026), Claude Code wrote very long descriptions and used emoji, and much negative reviewer feedback targeted presentation rather than code.
- Do not open with "This PR introduces" or "In this pull request". Do not inflate a minor change. Code-level detail belongs in code comments.
- Build the description from `git log main..HEAD --oneline` and `git diff --stat`, then cut.

<example>
Before: "This PR introduces a robust, comprehensive refactor of the authentication module, significantly enhancing security and maintainability." followed by a rocket emoji
After: "Move session checks into middleware so expired tokens get a 401 before reaching handlers. Fixes #412. Tested by expiring a token locally and calling /api/me."
</example>
