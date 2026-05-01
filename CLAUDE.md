# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Constraints (from `.agents/rules/technology.md`)

- This site **must remain a static Hugo site**. Do not introduce React, PHP, or any other application framework.
- **Do not add a dark-mode toggle.** The design is already dark-only (slate-900 background, cyan-500 accent) and is intentionally not switchable.
- Content language is **German (`de-de`)**. New content, UI strings, and meta descriptions should be written in German.

## Tech Stack

- **Hugo** static site generator (extended version required — the CSS pipeline uses `postCSS`).
- **Tailwind CSS v3** + `@tailwindcss/typography` + `autoprefixer`, processed through Hugo's asset pipeline (not a standalone build script).
- **Node 24** (`.nvmrc`). Only dev dependencies are installed; `package.json` has no build/lint/test scripts of its own.

## Common commands

```bash
# install Node deps so Hugo's PostCSS pipeline can resolve tailwindcss/autoprefixer
npm install

# local dev server with drafts and live reload
hugo server -D

# production build (output goes to ./public, which is gitignored)
hugo --minify

# scaffold a new content file using archetypes/default.md
hugo new <section>/<name>.md
```

There is no test suite, no linter config, and no CI in this repo. The `npm test` script is the default placeholder and should not be run.

## Architecture

### CSS pipeline (important)

`layouts/_default/baseof.html` builds the stylesheet inline via Hugo:

```
{{ $styles := resources.Get "css/main.css" | postCSS (dict "config" "postcss.config.js") | minify | fingerprint }}
```

This means:
- The single source of truth for styles is `assets/css/main.css` (Tailwind directives + a `@layer components` block translating legacy class names like `.cta`, `.btn`, `.gallery` to Tailwind utilities).
- Tailwind only scans the paths listed in `tailwind.config.js` (`layouts/**`, `content/**`, `assets/**/*.js`). Classes used outside those paths will be purged.
- `assets/css/extended/style.css` is **leftover from the removed PaperMod theme and is not imported anywhere** — do not edit it expecting changes to appear; either delete it or import it from `main.css` if it's actually needed.
- Running `hugo` without Node modules installed will fail because PostCSS can't resolve Tailwind.

### Layouts (custom, no theme)

The site previously used the PaperMod theme; that theme is now removed (`config.yml` keeps the `# theme: PaperMod is removed` comment) and all layouts are hand-written in `/layouts`:

- `_default/baseof.html` — root document, SEO/OG/Twitter meta tags, JSON-LD `WebSite` schema, Outfit font preconnect, PostCSS pipeline.
- `_default/list.html` — section/list pages, renders child pages as cards using `.Params.cover.image` (PaperMod-style front matter is preserved).
- `_default/single.html` — single content pages, uses Tailwind Typography (`prose prose-invert`).
- `index.html` — homepage hero, reads `Site.Params.profileMode` (buttons, image) from `config.yml`.
- `partials/header.html` — sticky header + a self-contained mobile menu overlay with inline `<script>` for open/close/ESC handling. Active-link detection compares trimmed `RelPermalink` against menu URLs.
- `partials/footer.html`, `partials/extend_head.html` — minor; `extend_head.html` duplicates the font preconnect already in `baseof.html`.

### Shortcodes

- `layouts/shortcodes/youtube-videos.html` renders an empty grid and ships an inline `<script>` that fetches `https://yt.tsojka.com/youtube_playlist.json` at runtime and injects video cards client-side. The video list is **not** built into the static output. Used by `content/videos.md` via `{{< youtube-videos >}}`.

### Content

All pages are top-level markdown files in `content/` (no `posts/` section). Front matter follows PaperMod conventions even though PaperMod is gone: `title`, `description`, `keywords`, `cover.image`, `ShowToc`, `ShowBreadCrumbs`, `draft`. The menu is defined statically in `config.yml` under `menu.main`, not via `menu:` front matter.

`config.yml` highlights:
- `markup.goldmark.renderer.unsafe: true` — raw HTML inside markdown is allowed and is used heavily (Tailwind-styled `<div class="grid ...">` blocks inside `workshops.md`, `about.md`, etc.). Keep it on.
- `ignoreLogs: [warning-goldmark-raw-html]` suppresses the resulting warning.
- `params.profileMode` is read by `layouts/index.html` only — it is not the PaperMod `profileMode` feature.

## Conventions when editing

- When adding a new component style, prefer adding utility classes directly in the template. Only add a new entry under `@layer components` in `assets/css/main.css` if the same combination repeats across multiple templates or appears in markdown content (where authoring long Tailwind chains is awkward).
- Inside markdown files, use `not-prose` on wrapper `<div>`s when you don't want `prose` typography styles to bleed into custom Tailwind grids (see `workshops.md`, `videos.md` shortcode output for the pattern).
- The cyan/slate palette and the `bg-slate-900` body background are part of the brand — keep new components consistent (`primary` is `cyan-500`, surfaces are `slate-800`, borders are `slate-700`).

## Git workflow

Active development branch for Claude-authored changes: `claude/add-claude-documentation-v9gyD`. Push to this branch unless explicitly told otherwise; do not open a PR unless asked.
