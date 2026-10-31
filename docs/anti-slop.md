# Anti-slop rules for coding and writing agents

This file tells you, the agent, how to produce interfaces, prose, code and commits that do not read as generated defaults. The rules come from corpus studies of LLM vocabulary, the Wikipedia "Signs of AI writing" field guide, Anthropic's frontend-design skill and prompting docs, and the anti-slop tools listed at the end.

## How to use this file

- Placement. Save this file as `AGENTS.md` (read by Codex, Cursor and others, and by Claude Code when no `CLAUDE.md` exists), or import it from `CLAUDE.md` with a line reading `@AGENTS.md`. For Cursor, put it in `.cursor/rules/anti-slop.mdc` with `description`, `globs` and `alwaysApply` frontmatter; Cursor ignores plain `.md` files in that folder.
- Keep the always-on part short. Claude Code's docs say files over about 200 lines reduce adherence; Cursor suggests under 500. Keep sections 1 to 4 always on. Move section 5 (the vocabulary list) into a separate file such as `docs/slop-vocabulary.md` that you read only when reviewing or editing prose, and put its hard-ban tier in the lint script from section 6. Naming a forbidden word in a prompt can prime it, so the long list belongs in the checker, not the context.
- Scoping. Prose rules apply to docs, READMEs, UI copy, comments, commit messages and PR descriptions. They do not apply to code identifiers, quoted text, test fixtures, or terms that are correct in their field ("test harness", "financial leverage", "landscape orientation", "statistically significant").
- Precedence. The user's brief and the project's existing style guide win over this file. If the brief asks for a cream-and-serif page or a purple gradient, build it. These rules govern the choices the brief leaves open.
- Clusters, not single hits. One triad, one passive sentence or one em dash proves nothing. Fix a passage when several tells pile up, and fix it by stating the specific fact, not by swapping one flourish for another.

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

## 5. Vocabulary list

Read this section when reviewing or editing prose, not as standing context. If you keep this file always on, move this section to its own file (for example `docs/slop-vocabulary.md`) and reference it from here.

How to apply it:

- Hard ban: do not use these in prose, docs, UI copy, comments, commits or PRs. They have the strongest evidence: each hard-ban word appears in Wikipedia's AI-vocabulary list or in three or more independent lists, and most rose sharply in at least one corpus study of post-ChatGPT text. The hard-ban phrases are chat residue or templates that almost never carry content. The lint script in section 6 checks this tier.
- Use sparingly: legitimate words that turn into a tell when they cluster. As a rough limit, no more than one per 300 words, and never two in one sentence. Each has a plain alternative; use it.
- Rewrite the sentence, do not swap the word. Replacing "delve into" with "dig into" keeps the empty sentence. Ask what fact the word was standing in for.
- Exempt: code identifiers, quoted text, proper names, and a word's ordinary technical sense (noted in parentheses where it matters).
- Monitor, never ban: ordinary function and academic words that also rose in the corpus studies (across, within, these, using, approach, analysis, research, however, various, impact, findings). Banning them would cripple prose.
- Lists decay. "Delve" fell sharply after mid-2024 once it was publicly mocked, while "underscore", "notably", "enhance" and "emphasizing" kept rising into 2025 and 2026. Refresh this list against your current model's output.

Count: 713 entries. The core list has 517 (60 hard ban, 457 use sparingly), and the optional fiction subsection has 196. A word family counts once, with inflections and spelling variants in parentheses; each phrase or sentence template counts once. Words are comma-separated; phrases and templates are semicolon-separated.

### Verbs

Hard ban: delve, underscore, showcase, emphasize, enhance (an "enhancement" issue label is fine), leverage (fine in finance), foster, bolster, garner, boast, elevate ("elevated privileges" is fine), unveil, revolutionize, encompass, elucidate, streamline

Use sparingly: empower, utilize, embark, unleash, harness (fine for "test harness"), highlight (as a verb for "show"), align with, navigate (figurative), unlock (figurative), surpass, facilitate, heighten, resonate, illuminate, exhibit, grapple, pave the way, craft, tailor, cultivate, exemplify, captivate, solidify, thrive, excel, accentuate, pioneer, disrupt (and disruptive), optimize (outside performance work), yield (figurative), uncover, comprehend, substantiate, refine, categorize, adhere, embrace, shed light on, transcend, reverberate, amplify, augment, hone, redefine, reimagine, democratize, accelerate (marketing use), supercharge, turbocharge, debunk, demystify, strive, glean, master (mastering, mastery, masterclass), underpin, acknowledge, advocate, affirm, attain, capitalize on, complicate, consolidate, culminate, delineate, diminish, discern, emulate, escalate, exacerbate, expedite, exert, furnish, hinder, hinge on, impede, juxtapose, necessitate, orchestrate, pinpoint, pose (a challenge), propel, reframe, rethink, revolve around, scrutinize, signify, spur, surmount, uphold, warrant, posit, commence, serve as, stand as, function as, represent (in place of "is"), mark (as in "marks a shift"), weave, intertwine, brainstorm, prioritize

### Adjectives

Hard ban: pivotal, intricate (intricately, intricacies), meticulous, commendable, vibrant, multifaceted, groundbreaking, transformative, seamless, invaluable, noteworthy, holistic

Use sparingly: cutting-edge, unparalleled, crucial, robust (fine in its statistics or engineering sense), comprehensive, nuanced (and nuance), innovative, remarkable, valuable, versatile, profound, enduring, key (as an adjective), vital, unprecedented, compelling, exceptional, formidable, foundational, inherent, distinctive, prevalent, renowned, burgeoning, impressive, impactful, substantial, significant (outside statistics), paramount, essential, state-of-the-art (outside benchmark claims), dynamic, ever-evolving, rapidly evolving, uncharted, underexplored, imperative, pressing, poised, swift, thorough, dependable, akin, adept, broader (as in "reflects broader trends" or "part of a broader movement"), diverse (as in "a diverse array"), breathtaking, stunning, must-visit, must-see, nestled, bustling, daunting, indelible, lucid, cogent, laudable, ingenious, methodical, admirable, refreshing, proficient, intriguing, thoughtful, pragmatic, pertinent, tangible, potent, adaptable, appreciable, proactive, cohesive, instrumental, consequential, expansive, fascinating, digestible, world-class, enterprise-grade, revolutionary, stellar, powerful, data-driven, AI-powered, next-generation, future-proof, scalable (marketing use), mission-critical, customer-centric, frictionless, effortless, intuitive, immersive, turnkey, plug-and-play, hyper-personalized, results-driven, visionary, agile (marketing use), leading-edge, thought-provoking, esteemed, exemplary, enlightening, relentless, pervasive, manifold, granular (marketing use), undeniable, arduous, cognizant, entrenched, actionable, exciting, deeply rooted, steadfast, quiet (figurative)

### Nouns

Hard ban: tapestry, realm, testament, landscape (abstract; page orientation is fine), interplay, synergy, paradigm (and paradigm shift; "programming paradigm" is fine), advancements

Use sparingly: game-changer, insights (and insightful), journey (figurative), endeavor, avenue, groundwork, interconnectedness, capabilities, methodologies, plethora, myriad, multitude, symphony, kaleidoscope, labyrinth, cacophony, canvas (figurative), orchestra (figurative), dance (figurative), enigma, complexities, depths, ecosystem (figurative), framework (figurative), linchpin, treasure trove, epicenter, milestone, roadmap, stakeholders, touchpoint, deep dive, legacy, focal point, strides, resilience, adversity, inclusivity, resourcefulness, quandary, exploration, metropolis

### Adverbs and transitions

Hard ban: moreover, furthermore, additionally (sentence-initial), notably

Use sparingly: particularly, ultimately, consequently, conversely, subsequently, thereby, thus, importantly, strategically, effectively, predominantly, potentially (as in "could potentially"), undoubtedly, arguably, fundamentally, truly, genuinely, absolutely, utterly, incredibly, extremely, vastly, massively, nevertheless, nonetheless, hence, accordingly, whilst, herein, hitherto, heretofore, aptly, judiciously, markedly, starkly, succinctly, tirelessly, diligently, wholeheartedly, actually, honestly, amidst, alongside

### Buzzwords and marketing phrases

Use sparingly: low-hanging fruit; move the needle; touch base; value-add; win-win; bandwidth (for "time"); at the end of the day; best practices; thought leadership; value proposition; pain point; digital transformation; deep understanding; fresh perspectives; from inception to execution; golden ticket; in a sea of; with a keen eye on; passion for X; drive meaningful impact; making waves; a gateway to; push the boundaries of; reaching new heights; the next frontier; the road ahead; a step in the right direction; the future looks bright; commitment to excellence; reimagine what's possible; build the future of; scale without limits; welcome to our platform

### Openers, signposts and hedges

Hard ban: in today's fast-paced world; in today's digital age (or digital era); let's dive in (or dive into); certainly!; great question!; you're absolutely right; I'd be happy to; it's important to note; it's worth noting

Use sparingly: here's the thing; in this day and age; in the modern era; in today's rapidly evolving world; in today's world; in the world of; in the dynamic world of; in a world where; when it comes to; let's explore; let's break this down; here's what you need to know; now let's look at; without further ado; picture this; imagine if; buckle up; stay tuned; whether you're a X or a Y; of course!; you're not wrong to feel that way; you're not imagining it; let's be honest; real talk; here's the kicker; the best part?; and here's the part most people miss; here's the truth; what nobody tells you; no fluff; heads up; quick note; it's important to remember; it's important to consider; it should be noted that; it is essential to; remember that; it is advisable; you may want to; there are a few considerations; as previously mentioned; to put it simply; in essence; it is widely understood that; no discussion would be complete without; in this article; cannot be overstated; to be clear; don't get me wrong; this is not to say; one might be tempted to; at its core; the heart of the matter; what really matters; the real question is; on the one hand; that being said; with regards to; as a professional

### Puffery and significance

Hard ban: plays a pivotal (vital, crucial, key or significant) role

Use sparingly: key turning point; watershed moment; setting the stage for; shaping the future of; leaves a lasting impact; rich cultural heritage; in the heart of; enjoys close proximity; convenient location; coastal charm; dynamic hub of activity and culture; holds the distinction of being

### Closers and chat residue

Hard ban: in conclusion; in summary; I hope this helps; let me know if you have any other questions; as an AI language model; as of my last knowledge update (or training update); turn0search0 (citation artifact)

Use sparingly: to summarize; overall (sentence-initial); key takeaways; here's the key takeaway; the most important thing is; challenges and future directions (as a heading); future outlook (as a heading); the future of X lies in its ability to adapt; would you like me to; want me to; should I continue?; curious what others think; shouting into the void; let that sink in; read that again; that distinction matters; that is the real win; I don't have access to; based on the information provided; while specific details are limited; not widely documented; in the provided sources; maintains a low profile; regenerate response

### Vague attribution

Use sparingly (allowed only with a named, cited source): experts argue; industry reports suggest; observers have cited; some critics argue; several publications; studies show; research suggests

### Sentence templates

Hard ban: it's not X, it's Y (and "this isn't about X, it's about Y"); not just X, but Y (and "not merely X but Y"); no X, no Y, just Z

Use sparingly: not only X but also Y; not because X, because Y; not this, not that, but this; stop X, start Y; you don't need more X, you need Y; if you're not doing X, you're already behind; it's never been easier (or harder) to; the real work is; most people X, the few who Y; from X to Y (a range with nothing in between); the N pillars of X (arbitrary counts); three stacked adjectives as a default; Every. Single. Day. (dotted emphasis); rhetorical question then answer ("The solution? Let's find out."); X is the new Y; more than just X; despite its X, Y faces several challenges; despite these challenges, X continues to thrive; enter X (as a one-word scene setter)

### Optional: fiction and creative writing only

Apply this subsection only when writing stories, roleplay or other fiction. Most entries come from one community list and one paper, so treat all of it as use-sparingly.

Fiction names: Elara, Kael, Lyra, Aria, Elysia, Eldoria, Eira, Eluned, Elian, Elias, Elianore, Eitan, Jaxon, Aldric, Eadric, Freydis, Lykos, Zephyria, Atheria, Numeria, Oakhaven, Whisperwood, Ravenswood, Moonwhisper, Maplewood, Greenhaven, Seabrook, Bayville, Bakersville, Fruitville, Melodia, Kavarna

Fiction verbs: flicker, shimmer, stammer, murmur, whisper, mutter, nod, lean, gesture, grin, hum, blink, hesitate, thrum, rasp, twinkle, glint, sparkle, gleam, chuckle, sigh, exclaim, chime, interject, ponder, linger, marvel, savor, revel, reminisce, waft, patter, etch, echo, huddle, furrow, steeple, jot, fidget, well up, ripple, pulsate, teem, blossom, yearn, gnaw, whir, sip, strum, clink, glance, regale, commiserate, empathize, grumble, pique, embolden, unearth, persevere, cherish, nurture, spark

Fiction adjectives and nouns: palpable, ethereal, quaint, serendipitous, newfound, unwavering, insurmountable, delectable, mouthwatering, awestruck, unreadable, unforeseen, fateful, tightknit, gaze, solace, wonderment, camaraderie, pleasantries, ministrations, unease, curveball, setbacks, quirks, addendum, containment

Fiction adverbs: unsettlingly, faintly, unbeknownst, intently, attentively, excitedly, contemplatively, conspiratorially, hesitantly, understandingly, gruffly, skeptically, warmly, approvingly, questioningly, animatedly, harmoniously, mischievously, sympathetically, enigmatically, eagerly, quizzically, somberly, appreciatively, disapprovingly, reassuringly, absentmindedly, mindfully, sagely, enchantingly, blankly, worriedly, supportively, profusely, cheerily, nervously, triumphantly, remorsefully, ominously, precariously

Fiction phrases: barely above a whisper; shivers down her spine; maybe, just maybe; eyes glinted; eyes sparkling with mischief; eyes never leaving; moth to a flame; humble abode; cold and calculating; with a mixture of; the air was filled with anticipation; bore silent witness to; practiced ease; was only just beginning; they would face it together; life would never be the same; for what seemed like an eternity; little did he know; the ball is in your court; threatens to consume; reckless abandon; torn between; heart hammered against her ribs; voice trembling slightly; voice devoid of emotion; said, voice low; felt a profound sense of; the air thick with the scent of; took a deep breath; a smile playing on her lips; something else entirely; couldn't shake the feeling; couldn't help but feel; casting long shadows; heart pounding in her chest; one last time

## 6. Enforcement

Literal word lists work better in a checker than in the prompt. In a controlled study on one 7B model (Rana 2026), naming a forbidden word raised its chance of appearing, and 87.5% of failures were priming failures where the model attended to the word more than to the negation. The Antislop paper (Paech et al. 2025) found that instructing a model to avoid banned vocabulary "has limited efficacy and may backfire". Claude Code's docs say CLAUDE.md is context, not enforced configuration. So keep the prompt positive and short (sections 1 to 4), and let a script catch the literal hits and send them back to the agent.

Layering that works:

1. Always-on rules: sections 1 to 4 of this file.
2. Path-scoped rules: comment rules for `src/**`, prose rules for `docs/**` (Claude Code `.claude/rules/` with `paths:` frontmatter, Cursor `globs`).
3. A lint check on every write, wired to a hook, and the same check in CI.
4. An on-demand rewrite skill (humanizer, stop-slop) for full passes on long documents.

Lint script. Save as `scripts/slop-check.sh` and make it executable. It checks the hard-ban tier from section 5 (except abstract "landscape", which has too many legitimate senses for a regex) plus em dashes, in prose and markup files. It skips `AGENTS.md`, `CLAUDE.md` and any file with "slop" in its name, since those hold the rules themselves. Extend the `case` line to scan code comments if you want them covered.

```bash
#!/usr/bin/env bash
# slop-check.sh: flag hard-ban AI-tell vocabulary and em dashes in prose and UI copy.
# Usage: scripts/slop-check.sh FILE...   Exit 1 if anything is found, else 0.
# Needs GNU grep (on macOS: brew install grep, then set GREP=ggrep).
set -u
GREP="${GREP:-grep}"
EMDASH=$(printf '\342\200\224')
PATTERNS=(
  'delv(e|es|ed|ing)' 'underscor(e|es|ed|ing)' 'showcas(e|es|ed|ing)'
  'emphasi[sz](e|es|ed|ing)' 'enhanc(e|es|ed|ing)' 'leverag(e|es|ed|ing)'
  'foster(s|ed|ing)?' 'bolster(s|ed|ing)?' 'garner(s|ed|ing)?' 'boast(s|ed|ing)?'
  'elevat(e|es|ing)' 'unveil(s|ed|ing)?' 'revolutioni[sz](e|es|ed|ing)'
  'encompass(es|ed|ing)?' 'elucidat(e|es|ed|ing)' 'streamlin(e|es|ed|ing)'
  'pivotal' 'intricate(ly)?' 'intricacies' 'meticulous(ly)?' 'commendable'
  'vibrant(ly)?' 'multifaceted' 'groundbreaking' 'transformative'
  'seamless(ly)?' 'invaluable' 'noteworthy' 'holistic(ally)?'
  'tapestr(y|ies)' 'realms?' 'testament' 'interplay' 'synerg(y|ies)'
  'paradigms?' 'advancements'
  'moreover' 'furthermore' 'notably'
  "in today.?s (fast-paced|digital)" "let.?s dive" 'dive into'
  'great question' "you.?re absolutely right" "i.?d be happy to"
  "it.?s (important|worth) not(e|ing)" 'it is (important|worth) not(e|ing)'
  'plays? an? (pivotal|vital|crucial|key|significant) role'
  'in conclusion' 'in summary' 'i hope this helps' 'as an ai language model'
  'let me know if you have any (other |further )?questions'
  'as of my last (knowledge|training) update' 'turn0search'
  "(it|this|that)(.?s| is| was) not [^.;:]{1,50}, (it|this|that).?s"
  "(it|this|that) (isn.?t|wasn.?t) [^.;:]{1,50}, (it|this|that).?s"
  'not (just|merely) [^.;:]{1,50}, but'
  'no [a-z]+, no [a-z]+, just'
)
RE="\\b($(IFS='|'; echo "${PATTERNS[*]}"))\\b|(^|[.!?][[:space:]]+)(additionally,|certainly[!,])"
status=0
for f in "$@"; do
  [ -f "$f" ] || continue
  case "$(basename "$f")" in
    AGENTS.md|CLAUDE.md|*slop*) continue ;;  # the rule files and word list
    *.md|*.mdx|*.txt|*.rst|*.html|*.jsx|*.tsx|*.vue|*.svelte|*.astro) ;;
    *) continue ;;
  esac
  hits=$("$GREP" -n -- "$EMDASH" "$f" | sed "s|^|$f:em-dash:|")
  [ -n "$hits" ] && { echo "$hits"; status=1; }
  hits=$("$GREP" -n -i -E -- "$RE" "$f" | sed "s|^|$f:word:|")
  [ -n "$hits" ] && { echo "$hits"; status=1; }
done
exit $status
```

Notes on the script: "elevated" is left out on purpose ("elevated privileges"), and "enhancement" does not match, so issue labels pass. "Additionally" and "Certainly" are flagged only at the start of a sentence. The template patterns catch the common one-line forms of "it's not X, it's Y", "not just X, but Y" and "no X, no Y, just Z"; they will miss forms split across lines. Words with a legitimate technical sense ("financial leverage", "programming paradigm") will still be flagged; leave those in place.

Claude Code hook. Save the wrapper as `.claude/hooks/slop-hook.sh` (executable; needs `jq`). A PostToolUse hook that exits 2 shows its stderr to Claude after the write, so the agent sees the findings and fixes them. Claude never sees stderr from a hook that exits 0.

```bash
#!/usr/bin/env bash
# .claude/hooks/slop-hook.sh: PostToolUse hook. Exit 2 sends findings to the agent.
f=$(jq -r '.tool_input.file_path // empty')
[ -n "$f" ] || exit 0
out=$("${CLAUDE_PROJECT_DIR:-.}/scripts/slop-check.sh" "$f") && exit 0
{ echo "slop-check found AI-tell patterns. Rewrite each line with a plain, specific phrasing; do not swap in a synonym:"; echo "$out"; } >&2
exit 2
```

Register it in `.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/slop-hook.sh"
          }
        ]
      }
    ]
  }
}
```

CI. Run the same script on changed files and fail the job on exit 1:

```bash
git diff --name-only --diff-filter=AM origin/main...HEAD | xargs -r scripts/slop-check.sh
```

For code slop, `deslop` (npm) scores a diff and exits 1 on high-severity findings such as leftover debug logs. For a fuller prose linter, `vale-ai-tells` ships 17 Vale rules (including NegParallel, CopulaInflation, AbstractTriad and a Dash rule) and calls itself "a rule floor, not a detector". Add grep checks for placeholder residue (`{{`, "lorem", "John Doe", "Acme", `NaN`) and a link checker for dead nav links.

Treat every flag as a candidate, not a verdict. Check each hit in context; a forced rewrite of a correct technical term makes the text worse.

## 7. Sources

Corpus studies of LLM vocabulary:

- Kobak et al., "Delving into LLM-assisted writing in biomedical publications through excess vocabulary", Science Advances 2025: https://arxiv.org/abs/2406.07016 (word list: https://github.com/berenslab/llm-excess-vocab)
- Juzek and Ward, "Why Does ChatGPT 'Delve' So Much?", COLING 2025: https://arxiv.org/abs/2412.11385
- Liang et al., "Monitoring AI-Modified Content at Scale", ICML 2024: https://arxiv.org/abs/2403.07183
- Liang et al., "Mapping the Increasing Use of LLMs in Scientific Papers", 2024: https://arxiv.org/abs/2404.01268
- Geng and Trotta, "Human-LLM Coevolution: Evidence from Academic Writing", ACL Findings 2025: https://arxiv.org/abs/2502.09606
- Thelwall and Kousha, "Have LLM-associated terms increased in article full texts in all fields?", 2026: https://arxiv.org/abs/2604.07565
- Saad and Ting, "More than half of recent astronomy papers are written with language-model assistance", 2026: https://arxiv.org/abs/2609.10664

Slop suppression and negative instructions:

- Paech et al., "Antislop: A Comprehensive Framework", 2025: https://arxiv.org/abs/2510.15061 and the antislop-sampler lists: https://github.com/sam-paech/antislop-sampler
- Rana, "Semantic Gravity Wells" (priming from negative constraints), 2026: https://arxiv.org/abs/2601.08070
- Watanabe et al., "How AI Coding Agents Communicate", MSR 2026: https://www.alphaxiv.org/abs/2602.17084

Writing guides and tools:

- Wikipedia, "Signs of AI writing" (WikiProject AI Cleanup): https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing
- blader/humanizer: https://github.com/blader/humanizer
- vale-ai-tells: https://www.everydev.ai/tools/vale-ai-tells/llms.txt
- deslop: https://github.com/dabit3/deslop
- Anthropic prompting best practices: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices

Design:

- Anthropic frontend-design skill: https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md
- Anthropic cookbook, "Prompting for frontend aesthetics": https://platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics
- Anthropic, "Improving frontend design through Skills", Nov 2025: https://claude.com/resources/articles/improving-frontend-design-through-skills
- Impeccable slop catalogue: https://www.impeccable.style/slop
- taste-skill: https://github.com/leonxlnx/taste-skill
- Kyle Chayka, "The Claude Aesthetic", New Yorker, Jun 2026: https://www.newyorker.com/culture/infinite-scroll/the-ai-design-aesthetic-thats-taking-over-the-internet
- NN/g, "The AI sparkles icon problem", 2024: https://nngroup.com/articles/ai-sparkles-icon-problem/

Agent instruction files:

- Claude Code memory docs: https://code.claude.com/docs/en/memory and hooks reference: https://code.claude.com/docs/en/hooks
- AGENTS.md: https://agents.md/
- Cursor rules: https://cursor.com/docs/context/rules

Evidence limits: the vocabulary studies measure academic and review text, not chat, code or UI copy, and no study yet attributes words to current Claude or Gemini models. The design tells come from practitioner and vendor sources with no measured frequencies. The priming result covers one 7B model. Formatting habits (em dashes, bold) are shifting between model versions. Recheck this file against your own model's output every few months.
