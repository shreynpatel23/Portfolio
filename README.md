# shreynpatel.com

Personal portfolio of **Shrey Patel**, Engineering Manager and Senior Frontend Engineer.

**Live:** [https://shreynpatel.com](https://shreynpatel.com)

A single, hand-built page: plain HTML, CSS and JavaScript with no build step, served by GitHub Pages. Motion comes from GSAP and Lenis loaded from a CDN.

---

## Contents

- [What is on the page](#what-is-on-the-page)
- [Project structure](#project-structure)
- [Run it locally](#run-it-locally)
- [Deploy](#deploy)
- [How the motion works](#how-the-motion-works)
- [Editing guide](#editing-guide)
- [Design system](#design-system)
- [Accessibility and performance](#accessibility-and-performance)
- [Known gotchas](#known-gotchas)
- [Domain and DNS](#domain-and-dns)

---

## What is on the page

| # | Section | Anchor | What it shows |
|---|---|---|---|
| | Hero | `#top` | Name, tagline with a rotating last word, four key numbers |
| | Marquee | | Slow, constant strip of focus areas |
| 01 | Selected work | `#work` | Five stacking project cards: Surfacemap (with the PromptSight note), Oro AI Interview module, Rategate, Awayme, PharmaTrack |
| 02 | How my team ships | `#approach` | The evals-first agent workflow at Oro Money, and the PromptSight agent-team loop |
| 03 | Experience | `#experience` | Timeline from 2018 to now |
| 04 | Open source | | npm library and GitHub |
| 05 | Stack | `#stack` | Grouped, plain-text skills |
| 06 | Contact | `#contact` | Email, LinkedIn, GitHub, resume download |

The illustrations inside the project cards (heatmap, mock interview, QR review flow, calendar, inventory) are built in HTML and CSS with sample data. They are not screenshots of client systems.

---

## Project structure

```
.
├── index.html              The whole page: markup and all copy
├── index.js                Motion and small behaviours (one IIFE, no modules)
├── styles/styles.css       All styles: tokens, sections, responsive rules
├── Shrey_Patel_Resume.pdf  Downloaded by the Resume buttons as Shrey-Patel-Resume.pdf
├── images/favicon.svg      The only image the current page uses
├── images/*                Legacy assets from the previous site (see below)
├── CNAME                   Custom domain for GitHub Pages: shreynpatel.com
├── CLAUDE.md               Working rules for Claude Code sessions in this repo
└── README.md
```

**Legacy images.** Everything in `images/` except `favicon.svg` belongs to the previous version of the site and is not referenced anywhere. It is kept for now; remove it in a separate commit when you are sure nothing links to those files.

### External dependencies

All loaded at runtime, pinned to exact versions in `index.html`:

| Dependency | Version | Source | Used for |
|---|---|---|---|
| GSAP, ScrollTrigger, SplitText | 3.13.0 | cdn.jsdelivr.net | Scroll and entrance animations, text splitting |
| Lenis | 1.3.11 | cdn.jsdelivr.net | Smooth scrolling on desktop (fine pointer only) |
| Geist, Geist Mono | latest | Google Fonts | All type |

GSAP and all its plugins, SplitText included, are free for commercial use.

---

## Run it locally

No install or build is needed. Serve the folder with any static server:

```bash
python3 -m http.server 5173
```

Then open [http://localhost:5173](http://localhost:5173).

Open the page through a server rather than as a `file://` URL, so the fonts, the CDN scripts and the resume download behave as they do in production.

---

## Deploy

GitHub Pages builds the site from the **`main` branch, root folder** (classic Pages build). Every push to `main` goes live, usually within a minute.

Recommended flow:

1. Work on a branch.
2. Check the page locally at desktop (1440 px) and phone (375 px) widths.
3. Merge into `main` and push.
4. Check that the Pages build passed:
   ```bash
   gh api repos/shreynpatel23/Portfolio/pages/builds/latest --jq '.status'
   ```
5. Hard refresh [https://shreynpatel.com](https://shreynpatel.com) (Cmd+Shift+R).

### Cache busting

Browsers cache `styles.css` and `index.js` aggressively. Both are linked with a version query, for example `styles/styles.css?v=18` and `index.js?v=6`. **Bump the number in `index.html` whenever you change either file**, or returning visitors may see a mix of old and new code.

---

## How the motion works

All motion lives in `index.js`. It runs in this order:

1. **Before paint** (inline script in `<head>`): adds the `js` class to `<html>` unless the visitor prefers reduced motion. Elements that animate in are hidden only under `.js`, so the page is fully readable without JavaScript. If GSAP has not loaded within 3 seconds, the class is removed and everything shows.
2. **Always on**, with or without GSAP: the year and IST clock in the footer, the QR pattern in the Rategate card, the cursor spotlight (fine pointers only), the active nav link, and the top bar that hides while the page scrolls and returns about 0.2 s after scrolling stops.
3. **Motion** (skipped entirely for reduced motion or if GSAP is missing):
   - Lenis smooth scrolling on desktop, wired to ScrollTrigger.
   - Scroll progress bar.
   - Hero: the name splits into characters and rises in; the tagline's last word rotates; the hero drifts up as you scroll away.
   - Section headings reveal word by word through masks.
   - `.reveal-up` elements fade up in batches.
   - Numbers with `.count` count up once when they enter the screen.
   - **Project cards** (desktop only) are `position: sticky`. Each card holds at full brightness for a short stretch, then shrinks to 92% and dims through an overlay (`--shade`, not opacity, so the card underneath never shows through) as the next card rises over it. Each card's illustration also animates in.
   - Agent pipeline connectors draw in as you scroll.
   - Experience timeline line draws with scroll; roles, open-source rows and stack rows stagger in.
   - Magnetic buttons: a pull of at most 4 px toward the cursor.

The PromptSight agent-team flow and the marquee use pure CSS keyframes.

---

## Editing guide

All copy lives in `index.html`. Facts on the page come from Shrey's experience notes; do not add numbers, clients or claims that are not confirmed there.

### Add or change a project card

Cards live inside `<div class="stack">` in the `#work` section. Copy an existing `<article class="card">` and change:

- `style="--hue: 280"`: the card's accent colour (an HSL hue).
- The tag (`Client · ...`), the `NN / NN` counter on every card, the title, the tagline, the body and the two bullet points.
- The link (`.link-arrow`). A card can hold several links inside `<div class="card__links">`.
- The illustration inside `.card__visual`. Reuse an existing `viz` block or build a new one; its entrance animation is set up per card in `index.js` (search for `/* Work cards */`).

Update the section intro ("Four products built for clients ...") if the count changes.

### Update the stack

Edit the four `<div class="skills__row">` rows in the `#stack` section. Keep it to skills used in production.

### Replace the resume

1. Copy the new PDF over `Shrey_Patel_Resume.pdf` (keep this file name; the buttons download it as `Shrey-Patel-Resume.pdf`).
2. Clean its metadata so it does not show a tool name such as HeadlessChrome as the author.
3. Read the whole PDF before pushing; it is public, and anything in it (including the phone number) is published.

### Change colours or fonts

See [Design system](#design-system). Colours are CSS custom properties at the top of `styles.css`.

---

## Design system

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0b0b0c` | Page background |
| `--panel` | `#161618` | Cards and panels |
| `--text` | `#f2f1ec` | Main text |
| `--muted` | `#9a9993` | Secondary text |
| `--dim` | `#5f5e59` | Tertiary text |
| `--accent` | `#d4ff3f` | Accent: links, highlights, progress bar |
| `--line`, `--line-2` | white at 9% and 16% | Hairlines and borders |
| `--radius` | `22px` | Card corners |

- **Type:** Geist for everything, Geist Mono for small labels (section kickers, counters, tags). No serif or italic accents.
- **Accent words** are set apart by colour only.
- **Hover states are subtle:** small colour and border shifts, a 2 px arrow nudge, at most 4 px of magnetic pull.
- **Breakpoints:** 900 px (cards stop stacking, pipeline and flow go vertical) and 720 px (phone layout, nav links hidden).

---

## Accessibility and performance

- `prefers-reduced-motion: reduce` turns off all GSAP and Lenis motion and freezes CSS animations; content shows in its final state.
- The page reads fully without JavaScript.
- A "Skip to work" link is the first focusable element.
- Decorative visuals carry `aria-hidden="true"`; the agent flow has a text label.
- Keyboard focus is shown with an accent outline.
- Only `transform`, `opacity` and colour are animated. There is no intro loader and no WebGL.

---

## Known gotchas

- **Do not put `scroll-behavior: smooth` on `html` while the motion script runs.** It makes ScrollTrigger's measuring scroll animate instead of jump, so after a reload mid-page the trigger positions are off by the restored scroll offset and the project cards stay shrunk and dimmed. The CSS applies native smooth scrolling only under `html:not(.js)`.
- **Reveal masks need room.** Headings are split into masked words with tight line heights. The masks carry padding with matching negative margins (`.split-lines div`, `.hero__title .line`) so letters like g, y and p are not cropped. Keep this if you change heading sizes or line heights.
- **Sticky cards and triggers.** Each card's dimming is driven by the *next* card's position. Changing the gap between cards (`.stack { gap: 30vh }` on desktop) changes how long each card holds before dimming.
- **Testing in a background browser tab.** Browsers throttle `requestAnimationFrame` in hidden tabs, so animations may look frozen. Test in a visible window.

---

## Domain and DNS

The domain is registered with Squarespace Domains. DNS points at GitHub Pages:

| Type | Host | Value |
|---|---|---|
| A | @ | 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153 |
| CNAME | www | shreynpatel23.github.io |

Squarespace's email-security TXT records (SPF, DMARC, DKIM) are kept so nobody can send mail as the domain.

In the repository settings, Pages uses the custom domain `shreynpatel.com` with **Enforce HTTPS** on. The certificate is issued and renewed by GitHub. The `CNAME` file in the repo root must stay; deleting it detaches the domain.

---

© Shrey Patel. All rights reserved.
