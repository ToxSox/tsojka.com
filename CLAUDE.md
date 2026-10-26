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
  - `datenschutz.astro` — privacy policy (lists every external service the site talks to: Vercel, Cloudflare, all-inkl for `yt.tsojka.com`, YouTube thumbnails via `i.ytimg.com`, Formspree). Update it whenever a new external service, script, font source or storage key is added.
- **Layout:** `src/layouts/Base.astro` — HTML shell, meta/SEO tags, Header, Footer, custom cursor; loads `src/styles/global.css` and `src/scripts/core.ts`.
- **Content/data:** `src/data/site.ts` holds all texts and lists (site meta, chapter nav, pillars, labor tests, workshop topics, expertise, gallery, apps, …). Edit copy here rather than in components.
- **Components** (`src/components/`): one file per chapter, with scoped `<style>` blocks. `ChapterHead.astro` renders the shared chapter heading.
- **Client scripts** (`src/scripts/`):
  - `core.ts` — Lenis smooth scroll, scroll reveals (`data-reveal`, `data-split`, `data-scrub`), magnetic buttons
  - `eq.ts` — hero background: REW-style measurement chart, the mouse pointer acts as a parametric EQ band
  - `scope.ts` — oscilloscope in the labor chapter, switches display per test based on scroll position
  - `gallery.ts` — horizontally pinned 3D-print gallery plus lightbox
  - `videos.ts` — fetches `https://yt.tsojka.com/youtube_playlist.json` in the browser and renders video cards
- **Styles:** `src/styles/global.css` defines design tokens on `:root` (`--bg`, `--text`, `--muted`, `--signal` orange accent, `--gutter`, `--max`, easing curves, font stacks) plus shared utilities (`.wrap`, `.btn`, `.mono`, …). `src/styles/videos.css` is shared by the video chapter and the archive page. The site is dark-only.
- **Fonts:** self-hosted via `@fontsource-variable` (Bricolage Grotesque for display, JetBrains Mono for mono labels).
- **Images:** `src/assets/` (profile photo, `3dprint/` gallery) are processed by `astro:assets`; `public/` holds files copied as-is (favicon, logo SVG).

## Key Patterns

- Navigation is anchor-based: chapter IDs in `site.ts` (`videos`, `labor`, `workshops`, `about`, `apps`, `kontakt`) must match the section `id`s in the components.
- Old Hugo URLs (`/about`, `/testlabor`, `/workshops`, `/kontakt`, `/apps`) redirect to the matching one-pager anchors via `redirects` in `astro.config.mjs`.
- The contact form posts to Formspree (`site.formAction`) and is submitted via `fetch` in `Contact.astro`.
- The video feed URL exists twice: `site.videoFeed` in `site.ts` and the `FEED` constant in `src/scripts/videos.ts` (the one actually used).
