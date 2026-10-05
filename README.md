# astreys.com

[![CI](https://github.com/Astreys/astreys-site/actions/workflows/ci.yml/badge.svg)](https://github.com/Astreys/astreys-site/actions/workflows/ci.yml)

The personal site of Sasha Chernyavsky, a senior front-end developer in Toronto.
Live at **<https://astreys.com>**.

It answers one question for a stranger in about thirty seconds: can this person
build a whole product, and does the craft hold up? Every claim on it is one click
from proof — each product is headed by its live URL.

The site is also a work sample, so the reasoning matters more than the markup.

## Design and architecture decisions

**Pre-rendered React, without a framework.** Every route is rendered to real HTML
at build time, with its own `<title>`, description and Open Graph tags, so a URL
pasted into LinkedIn gets a proper preview and the site reads fine with
JavaScript off. The pre-render step is two small files rather than a framework:
[`src/entry-server.tsx`](src/entry-server.tsx) exports `render(url)`, and
[`scripts/prerender.mjs`](scripts/prerender.mjs) writes one HTML file per route
into the client build's template. React then hydrates, and only adds client-side
navigation — which is why the bundle is fetched at low priority.

I looked at `vite-react-ssg` (React Router 6 only) and React Router's own
framework mode, and chose the version I can explain line by line.

**Two schemes, one system.** The light scheme is clean and airy — pale ground,
white surfaces, navy ink, a blue accent. The dark scheme is deep navy with a
bright cyan accent. The visitor's system preference picks one; both are tested
for contrast and with axe. One typeface, Archivo, in three weights. Prose is
held under 75 characters a line; screenshots and photographs break wider.

**Hand-written CSS, scoped with CSS Modules.** Design tokens are custom
properties in [`src/styles/global.css`](src/styles/global.css); each component
owns its styles. There is no Tailwind or component library, because a site this
size doesn't need one and the CSS is part of what is being shown. Mobile-first
CSS, with design decisions made at desktop width.

**Content is typed data.** Projects, employment, photographs and page metadata
live in [`src/content/`](src/content/). Adding a project means editing one
file; tests check the content itself (word counts, alt text, files on disk).

**Images are generated, never hand-exported.**
[`scripts/process-media.mjs`](scripts/process-media.mjs) turns originals into
AVIF and JPEG at several widths, strips all metadata (phone photos carry GPS),
and writes [`media.generated.ts`](src/content/media.generated.ts) so every
`<img>` has real `width`/`height` and the layout never shifts. Fonts are
self-hosted Latin subsets (Archivo 400/600/700) with metric-matched Arial
fallbacks, so the swap moves nothing.

**Video costs nothing until asked for.** A `<video poster>` downloads its
poster at load and cannot be lazy, so each clip starts as a lazy image inside a
link to the MP4. Without JavaScript, the link opens the clip; with it, a click
swaps in a native `<video controls>`. Nothing autoplays.

**Accessibility is tested, not asserted.** One `h1` per page, landmarks, a skip
link, a single visible focus style, contrast checked in both colour schemes.
Client-side navigation moves focus to the new page's heading, as a full page
load would. axe runs on every route in light and dark.

**Analytics that need no banner.** [GoatCounter](https://www.goatcounter.com):
cookieless, no personal data, page views and referrers only. It loads only on
`astreys.com`, never on localhost or deploy previews, and not at all when Do Not
Track is set. There is no visit counter anywhere on the site.
`astreys.com/?from=okta` attributes a visit to an application; the site itself
ignores the query string completely.

## Running it

Node 22.

```bash
npm install
npm run dev          # Vite dev server (client-rendered)
npm run build        # client build → SSR build → pre-render into dist/
npm run preview      # serve dist/ the way Netlify does (real 404s, gzip, CSP)
```

| Script | |
| --- | --- |
| `npm run typecheck` | `tsc -b`, strict, across app, tests and tooling |
| `npm run lint` | ESLint (typescript-eslint strict) |
| `npm test` | Vitest + React Testing Library |
| `npm run test:e2e` | Playwright against the production build — run `build` first |
| `npm run check:budget` | Fails if any page exceeds the performance budget |
| `npm run media` | Regenerate images and clips from `media-src/` |

## Testing

**Unit** ([`src/**/*.test.ts(x)`](src/)): content conforms and its files exist,
the work page renders one entry per project, unknown paths render the 404 page,
query strings never reach the page, external links carry `rel="noopener"`.

**End-to-end** ([`e2e/`](e2e/)), always against the production build:

- every route returns 200 with the right title and metadata, and unknown paths a real 404;
- every internal link resolves, and every external link points at an expected host;
- Tab reaches every interactive element on the home page, each with a visible focus ring;
- zero axe violations on every route, light and dark;
- no console errors under the production Content-Security-Policy;
- pages render with JavaScript disabled;
- visual baselines at 390, 768 and 1440 px.

Visual baselines are per platform. CI runs on Linux: run the **Update visual
baselines** workflow, download its artifact and commit the PNGs. Until a
platform has baselines, CI skips those comparisons rather than failing.

## Performance

Measured with Lighthouse against the production build:

| | Desktop | Mobile |
| --- | --- | --- |
| Performance | 100 | 90–99 (varies run to run with machine load) |
| Accessibility, best practices, SEO | 100 | 100 |
| Largest Contentful Paint | ≤ 0.5 s | 1.9–2.3 s |

Budget, enforced in CI by [`scripts/check-budget.mjs`](scripts/check-budget.mjs):
HTML+CSS+JS ≤ 150 KB gzipped per page (actual ≈ 95 KB), no image over 250 KB,
page weight ≤ 900 KB, clips ≤ 6 MB (actual 1.4–1.9 MB).

## Media

Originals live in `media-src/`, which is not committed: they are large, and
phone photos carry location data. Product screenshots are captured from the live
sites by [`scripts/capture-screenshots.mjs`](scripts/capture-screenshots.mjs).
Only my own products and photographs appear on this site; work done for
employers is described in prose only.

## Deploying

Netlify builds `npm run build` and publishes `dist/`; see
[`netlify.toml`](netlify.toml) for the `www` → apex redirect, security headers
and caching. Every route is pre-rendered, so there is no SPA fallback: unknown
paths get `404.html` with a 404 status. Pull requests get deploy previews.

Nothing in this project needs a secret.

---

Font: Archivo, SIL Open Font License (see `public/fonts/`).
Built with AI-assisted development (Claude Code), reviewed and owned by me.
