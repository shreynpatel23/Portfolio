# CLAUDE.md

Working rules for Claude Code in this repository. Read `README.md` first for the structure, the motion system and the deploy flow.

## What this is

The live portfolio at https://shreynpatel.com. Static HTML, CSS and JS, no build step, deployed by GitHub Pages from `main`. **A push to `main` is a production deploy.**

## Before you change anything

- Copy and facts: use only what Shrey has confirmed. Never invent numbers, clients, dates, titles or outcomes. If a claim is not confirmed, ask Shrey or mark it as a question in your reply; do not ship it.
- This repo is public. Keep private details out of every file: no local file paths, personal notes, phone numbers on the page, or internal information about employers or clients.
- Do not add availability or "open to work" messaging unless Shrey asks.

## Writing rules for page copy

- Formal, short and specific. Concrete nouns over adjectives.
- No em dashes or en dashes. Use commas, periods, middle dots (`·`) or "to".
- No hype words ("passionate", "cutting-edge", "world-class" and the like).
- First person, as Shrey.

## Design rules

- Dark theme only. Colours come from the tokens at the top of `styles/styles.css`; do not hard-code new colours without a reason.
- **Geist only**, with Geist Mono for small labels. No serif or italic accent fonts.
- Hover and micro-interactions stay subtle: no full fills on hover, no big transforms, magnetic pull capped at 4 px.
- No logo walls, skill percentage bars, intro loaders or custom cursors.
- Illustrations in project cards are built in code with sample data, never screenshots of client systems.

## Code rules

- Keep it dependency-free apart from the pinned CDN scripts (GSAP 3.13.0, Lenis 1.3.11). New CDN scripts must use an exact version.
- Content must be readable without JavaScript: anything hidden for an entrance animation is hidden only under `html.js`.
- Respect `prefers-reduced-motion`: no GSAP or Lenis motion, no running CSS animations.
- Animate only `transform`, `opacity` and colours. Dim stacked cards with the `--shade` overlay, not `opacity`.
- **Never set `scroll-behavior: smooth` on `html` while the motion script runs** (see README, Known gotchas). It breaks ScrollTrigger positions after a reload mid-page.
- Keep the padding and negative margins on reveal masks so glyphs are not cropped.
- **Bump the `?v=` number** on `styles/styles.css` and `index.js` in `index.html` whenever you change those files.
- Do not delete the `CNAME` file. Do not delete the legacy files in `images/` without Shrey's OK.

## How to verify a change

Run `python3 -m http.server 5173` and check at **1440 px and 375 px** widths:

1. No console errors.
2. No horizontal scroll on phones (`document.documentElement.scrollWidth <= innerWidth`).
3. No clipped text: in particular headings with descenders (g, y, p) and the card illustrations.
4. Scroll through the project cards: each holds at full brightness, then shrinks and dims as the next one rises.
5. **Reload test:** scroll to Selected work, reload, and confirm the first card is full size and undimmed.
6. The top bar hides while scrolling and returns when scrolling stops.
7. With reduced motion turned on, everything is visible and static.

Animations freeze in a hidden or background browser tab, so test in a visible window.

## Git and deploy

- Work on a branch; commit there freely.
- **Ask Shrey before merging into `main` or pushing `main`**, since that deploys to the live site.
- After a push, confirm the Pages build passed (`gh api repos/shreynpatel23/Portfolio/pages/builds/latest --jq .status`) and check the live site.
- Commit messages: a short imperative summary line, then a body explaining why.
