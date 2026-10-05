# Decisions

Choices made where the brief was silent or left room, and why. Newest at the
bottom; change an entry by adding a new one.

1. **Own pre-render step instead of `vite-react-ssg`.** It supports React Router 6
   only, and React Router is now on 8. A Vite SSR build plus a 40-line script gives
   the same result with nothing hidden. React Router is pinned to 7, whose
   `StaticRouter`/`BrowserRouter` library mode is stable and well understood.

2. **Pages imported eagerly, not lazily.** The whole site is ~90 KB of JS gzipped,
   mostly React. Lazy routes would complicate hydrating pre-rendered HTML for no
   measurable gain.

3. **External links open in the same tab.** The visitor chooses where links open
   and the back button keeps working. `rel="noopener"` is set anyway; no
   `noreferrer`, so my own products can see where visits come from.

4. **eshee esthetic is shown by its redesign.** The live site's dated design
   undersold the engagement, so the screenshot is of the React rebuild in
   preview at eshee.netlify.app, and the write-up says plainly which is which.

5. **Plane Spotter screenshot taken from a local run.** The public board's API
   runs on a home machine and was offline at capture time. The screenshot shows
   the real app against live ADS-B data, with third-party photo thumbnails switched
   off. The write-up says plainly that the live board is sometimes in its error
   state.

6. **Clips are silent and start as a poster link.** Audio was wind and engine
   noise; dropping it removes the need for captions and shrinks the files. A
   poster link that becomes a `<video>` on click keeps poster and video bytes off
   the critical path, and still works with JavaScript disabled.

7. **Analytics loader is a deferred first-party file, not an inline script.**
   That keeps the Content-Security-Policy free of `'unsafe-inline'`. It sets
   GoatCounter's `path` explicitly, because GoatCounter otherwise prefers the
   canonical URL and would drop `?from=` attribution.

8. **Hydration script fetched at low priority.** Every page is complete before any
   script runs, so the bundle shouldn't compete with fonts, CSS and the LCP image.

9. **Visual baselines are per platform; CI skips a platform with none.** Font
   rasterisation differs between Windows and Linux. A manual workflow renders the
   Linux set for committing.

10. **No dark/light toggle.** Per the brief, the system preference decides.

11. **Redesign from two mock-ups: "Modern & Clean" as the light scheme, "Dark &
    Bold" as the dark scheme.** This replaces the brief's achromatic,
    serif-prose direction: one sans (Archivo), an accent colour, cards for
    featured work, eyebrow labels. Kept from the mock-ups only what the site can
    back up: the "technologies I know" logo row was left out (a non-goal in the
    brief), and the mock-up's live-arrivals table on Spotting became a link to
    the real Plane Spotter Board rather than a table of invented flights.

12. **"About" is a section of the home page, not a fifth route.** The nav links
    to `/#about`; the brief's four routes stay four.

13. **The home hero is an AI-generated illustration, and says so.** Its alt text
    labels it as an illustration, and it never appears on Spotting, which shows
    only my own photographs.
