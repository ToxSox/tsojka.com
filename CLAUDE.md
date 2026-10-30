# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static Astro site for the Car-HiFi YouTube channel "TSojka Audio" (tsojka.com) by Thomas Sojka. The site is in German. It was migrated from Hugo/PaperMod to Astro in PR #3; the Hugo files (`content/`, `layouts/`, `config.yml`, `themes/`) no longer exist.

## Common Commands

```bash
npm install
npm run dev       # Dev server on http://localhost:4321 with live reload
npm run build     # Static build to dist/
npm run preview   # Serve the built dist/ locally
npm run check     # astro check (type checking)
```

Node >= 22.12 is required (`.nvmrc`: 24). `dist/`, `.astro/` and `node_modules/` are gitignored.

## Deployment

Vercel deploys automatically: `master` goes to production, every PR branch gets a preview deployment. `vercel.json` pins the framework to Astro (`npm run build`, output `dist/`) and overrides the project's dashboard settings, which still point to the old Hugo setup — do not remove it.

## Architecture

- **Pages** (`src/pages/`):
  - `index.astro` — one-pager composed of chapter components: Hero, Marquee, Intro, Videos, Labor, Workshops, About, Apps, Contact
  - `videos.astro` — full video archive with search and year filter
  - `impressum.astro` — legal notice
  - `404.astro` — „Kein Signal“ not-found page (Vercel serves `dist/404.html`)
  - `datenschutz.astro` — privacy policy (lists every external service the site talks to: Vercel, Cloudflare, all-inkl for `yt.tsojka.com`, YouTube thumbnails via `i.ytimg.com`, Formspree). Update it whenever a new external service, script, font source or storage key is added.
- **Layout:** `src/layouts/Base.astro` — HTML shell, meta/SEO tags, Header, Footer, custom cursor (stays, owner's decision); loads the scrollcraft engine CSS, `src/styles/global.css`, the engine JS and `src/scripts/core.ts`.
- **Design system: scroll-craft** (github.com/nateherkai/scroll-craft). Brief, journey, score and verification live in `scrollcraft/builds/tsojka/BRIEF.md`; `scrollcraft/FINGERPRINTS.md` is the build registry. The engine is vendored UNCHANGED: `public/scrollcraft/scrollcraft.js` and `src/vendor/scrollcraft/scrollcraft.css` (MIT). Never edit them; theme via tokens in `global.css` and write page-specific behaviour in page code driven by `--sc-p`. Acts are declared with `data-sc-act` (pin/pan/flow), cues with `data-sc-cue`, flow reveals with `data-sc-in`. Grounds switch per chapter with `.ground--black/--graphite/--light/--white` (hard cuts, no drift).
- **Content/data:** `src/data/site.ts` holds all texts and lists (site meta, chapter nav, pillars, labor tests, workshop topics, expertise, gallery, apps, …). Edit copy here rather than in components.
- **Components** (`src/components/`): one file per chapter, with scoped `<style>` blocks. `ChapterHead.astro` renders the shared chapter heading.
- **Client scripts** (`src/scripts/`):
  - `core.ts` — mounts the scrollcraft engine (re-layout on height changes), mobile menu, active nav link, back-to-top button. Native scrolling, no Lenis.
  - `eq.ts` + `eq-model.ts` — hero: REW-style chart on two canvases around the cut-out portrait (`src/assets/hero/thomas.png`); the pointer sets a parametric EQ band, published as `window.__tsaEq` / `eq:change`
  - `protocol.ts` — the lab's measurement sheet (signature move): draws four SVG plots, the frequency response is the visitor's EQ setting; drawing progress is CSS from `--sc-p`
  - `gallery.ts` — swipeable 3D-print rail with progress bar, plus lightbox
  - `videos.ts` — fetches `https://yt.tsojka.com/youtube_playlist.json` in the browser and renders video cards
- **Styles:** `src/styles/global.css` defines design tokens on `:root` (`--bg`, `--text`, `--muted`, `--signal` orange accent, `--gutter`, `--max`, easing curves, font stacks) plus shared utilities (`.wrap`, `.btn`, `.mono`, …). `src/styles/videos.css` is shared by the video chapter and the archive page. The site is dark-only.
- **Fonts:** self-hosted via `@fontsource-variable` (Geist, Geist Mono).
- **Images:** `src/assets/` (profile photo, `3dprint/` gallery) are processed by `astro:assets`; `public/` holds files copied as-is (favicon, logo SVG).

## Key Patterns

- Navigation is anchor-based: chapter IDs in `site.ts` (`videos`, `labor`, `about`, `workshops`, `apps`; plus `kontakt`) must match the section `id`s in the components. Chapter order is the owner's: Videos, Testlabor, Über mich, Workshops, Apps.
- Scroll-craft hard rules apply: no section numbers or counters, no scroll cue, at most one eyebrow per three sections, no em/en dashes in visible text, no glow, no invented measurement values (the lab plots other than the visitor's EQ are labelled „Schema“).
- Old Hugo URLs (`/about`, `/testlabor`, `/workshops`, `/kontakt`, `/apps`) redirect to the matching one-pager anchors via `redirects` in `astro.config.mjs`.
- Buttons that lead to the contact form use `href="#kontaktformular"` plus `data-topic="…"`; `Contact.astro` preselects the matching topic radio. The value must match one of the `topics` in `Contact.astro`.
- `site.email` (`youtube@tsojka.com`) is the only contact address on the site, including Impressum and Datenschutz. Always reference `site.email`, never hardcode an address.
- The contact form posts to Formspree (`site.formAction`) and is submitted via `fetch` in `Contact.astro`.
- The video feed URL exists twice: `site.videoFeed` in `site.ts` and the `FEED` constant in `src/scripts/videos.ts` (the one actually used).
