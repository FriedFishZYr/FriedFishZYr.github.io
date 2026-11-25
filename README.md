# Yinran Zhu — Portfolio

Personal portfolio served by GitHub Pages at <https://friedfishzyr.github.io>.

Plain HTML and CSS. No framework and no build step. Edit a file, refresh the browser.

JavaScript is three dependency-free files loaded with `defer`: `js/home.js` (Home), `js/article.js` (the contents bar on the four pieces under `work/`) and `js/mufin-generation.js` (the walkthrough demo on the MuFIN Generation article). The only requests any of them makes are `home.js` re-reading the four cover files from this site (see "Change a cover"), and every page still reads completely with JavaScript off.

The design source is the Figma file **YinranZhu_Portfolios**, page **Portfolio**:

| Page | Figma frame | File |
|---|---|---|
| Home | `74:249` (superseded: the current Home was built in code, see below) | `index.html` |
| MuFIN Pathway Analysis article | `6:41` (superseded: rebuilt in code on the MuFIN Generation layout) | `work/mufin/index.html` |
| KeyPalette case study | `29:249` (superseded: rebuilt in code on the shared article layout) | `work/keypalette/index.html` |
| MeArm case study | `82:257` (superseded: rebuilt in code on the shared article layout) | `work/mearm/index.html` |
| MuFIN Generation article | `144:652` | `work/mufin-generation/index.html` |

Case studies live under `/work/…` so they never collide with the KeyPalette app itself at `/KeyPalette`.

## Preview locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Use a server rather than opening the files directly: links and images use site-root paths such as `/css/base.css`, which only resolve over HTTP.

## Project layout

```
index.html                 Home
work/mufin/index.html      MuFIN Pathway Analysis article (what learners did after the feedback)
work/keypalette/index.html KeyPalette case study
work/mearm/index.html      MeArm case study
work/mufin-generation/index.html  MuFIN Generation article (how the feedback was generated)
404.html                   "Page not found" (GitHub Pages serves it automatically)
css/base.css               Shared: reset, .wrap layout column, focus styles, reduced motion
css/home.css               Home and 404 (Geist + Geist Mono, white page in ink and grey)
css/article.css            Shared by all four pieces: top bar, lead row, reading column, figure mats, captions, footer, contents bar (Geist / Geist Mono / Source Serif 4)
css/case-study.css         Shared by the three case studies (MuFIN Pathway, KeyPalette, MeArm): stat row, topic grids, steps, rows, callouts, screenshot cards, wide figure tier
css/mufin.css              MuFIN Pathway Analysis only: its own figures and modules
css/mearm.css              MeArm only: the sketch figure and the three diagnostic states
css/mufin-generation.css   MuFIN Generation only: its figures and the walkthrough demo
js/home.js                 Home only: header name-to-monogram on scroll, dropdowns, mobile menu, the study / design / build filter, cover motion
js/article.js              All four pieces: the contents bar that slides out from under the top bar once the contents rail scrolls away
js/mufin-generation.js     MuFIN Generation only: the scripted walkthrough demo
assets/covers/             The four cover illustrations shown in Home's work grid (SVG, 16:9)
assets/mufin/              MuFIN charts, diagrams and artifact thumbnails (SVG)
assets/keypalette/         KeyPalette screenshots (WebP) and keyboard art (SVG)
assets/mearm/              MeArm screenshots (WebP)
assets/og/                 1200×630 link-preview images (Slack, LinkedIn, …)
favicon.svg, favicon-32.png, apple-touch-icon.png
.nojekyll                  Tells GitHub Pages to serve the files as-is
```

Every page is white and keeps the interface in ink and grey: no accent colour on links, labels, hovers or focus rings. Colour is reserved for the cover art, for screenshots, and for figures where it means something (in the Generation figures, teal is the correct distance and red the mistaken one; in the Pathway charts, red marks the 32 mismatch cases; in the MeArm diagnostics, amber is a caution and red a stop).

The four pieces under `work/` share one layout. Stylesheets stack in this order, and each page links only the ones it needs:

1. `base.css` (every page): reset and accessibility basics.
2. `article.css` (all four pieces): the page shell. Edit this to change the top bar, title block, contents rail, metadata rail, captions or footer everywhere.
3. `case-study.css` (the three case studies): the modules a case study is built from.
4. The page's own file, only for what no other page has. KeyPalette needs none.

Home has its own header and footer (in `home.css`), shared only with the 404 page. The name sits on the left and plain text links on the right; once you scroll, the header turns into a dark bar and the name collapses to the "Y/Z" mark. The name is set in Archivo (expanded width) with a drawn slash in place of the I; the slash steepens to 24° in the name and tips to 42° in the mark, parallel to the Y's arm and the Z's diagonal (see `.brand__slash` in `home.css`). The four pieces share a simpler top bar and footer in `article.css`.

Three things on Home are its own, and new work should follow them:

- **The statement is the filter.** In "I study how people use products, then design and build better ones", the words *study*, *design* and *build* are marked with `data-skill`. `home.js` turns each into a button: pointing at one fades the pieces that don't show it, pressing it keeps only the ones that do, and pressing it again shows everything. The row above the grid (All / Study / Design / Build) drives the same filter. Each card says what it shows in `data-skills`, for example `data-skills="design build"`.
- **The slash separates.** Items in a line (a card's category and date, the filter row, the line under the statement) are separated by a drawn 42° slash, `<span class="sl" aria-hidden="true"></span>`, not a typed "/" or "·". The 404 page uses the wordmark's slash for the zero in "404".
- **The covers move.** Pointing at a card plays its cover: the coral point slides down the curve into the dashed ring, the pathway's main band fades to leave the red strand, the keycaps swap colours, the robot arm swings across its sweep. The rules are under "Cover motion" in `home.css` and are switched off for people who ask for reduced motion.

## Edit text

All copy is in the HTML files. Open the page, find the sentence and change it. A few things to know:

- **Small uppercase labels are typed in sentence case.** Labels like "SUMMARY" or "01 OVERVIEW" are written as `Summary` and `Overview` and uppercased by CSS (`text-transform`). Type them normally.
- **Special characters.** Write `&amp;` for &, and `&lt;` / `&gt;` for < and >. Curly quotes (“ ” ’), arrows (→) and dashes (—, –) can be typed directly.
- **Double spaces around "·"** in labels like `KeyPalette  ·  Product design + engineering` are intentional. Those elements have `class="pre"`, which keeps the spacing.
- **Contents list on the four pieces.** The rail beside Figure 1 uses short labels ("Method", "Results"), not the full section headings. Each label is written twice near the top of the page: once in `<nav class="toc">` and once in `<details class="toc-mini">` (the version phones show). Change both. The contents bar under the top bar copies the first list.
- **Page title and link preview.** Each page's `<head>` has a `<title>`, a `<meta name="description">` and `og:*` tags. Update them if you change a headline.

## Update the résumé

The Resume links (Home header, Home footer, and the top bar of the four pieces) point to the résumé PDF on Google Drive. To update it without changing the link, open the file in Drive and use "Manage versions" → "Upload new version". If you share a different file instead, search the HTML files for `drive.google.com` and update the address. Keep the file shared as "Anyone with the link can view".

Contact emails appear in the Home header's Contact menu and in the footer on Home and the four pieces. The Gmail address is labelled "Jobs" and the CMU address "School".

## Swap an image

1. Export the new image at **2×** the size it appears on the page (for example, 1224×764 for a 612×382 slot).
2. Convert it to WebP. <https://squoosh.app> works well: WebP, quality about 80.
3. Save two files in the page's folder under `assets/`: a 1× and a 2× version, e.g. `assets/keypalette/06-compare-612.webp` and `…-1224.webp`. The simplest option is to overwrite the existing files with the same names.
4. If the file names change, update the `<img>` tag: `src`, `srcset`, and `width`/`height` (the 1× size, which prevents layout jumps while loading).
5. Update the `alt` text so it describes the new image.

Vector art (keyboard, MuFIN charts and diagrams) is SVG. Export it from Figma as SVG with **Outline text** turned on, so it looks the same without web fonts. The text inside these SVGs is converted to shapes, so it can't be edited in the HTML. To change a chart label, edit it in Figma and re-export the SVG. Keep the file name the same and the page picks it up.

On phones, wide charts and drawings scroll sideways inside their own box (`class="scroll-x"`) instead of shrinking until the text is unreadable. The `--min` value on that box sets how wide the chart stays.

## Change a cover

Each piece has one cover illustration, shown in the work grid on Home. The drawings live in the Figma file **YinranZhu_Portfolios**, page **Arts**, as four 1600×900 frames. They share one recipe: a flat pale background and one or two simple shapes cut from 24px graph paper, in three or four colours.

To change one, edit its frame in Figma, export the frame as SVG with **Include "id" attribute** turned on, and save it over the file of the same name in `assets/covers/` (`mufin-generation.svg`, `mufin-pathway.svg`, `keypalette.svg`, `mearm.svg`). Keep the frame at 1600×900 so it fills its slot. If the drawing changes meaning, update its `alt` text in `index.html`.

The hover motion finds the moving parts by their Figma layer names, which the export writes as ids. Keep these names, or that cover stops moving (it still shows, just still):

| Cover | Layers the motion uses |
|---|---|
| `mufin-generation.svg` | `right-point` (the solid coral point) |
| `mufin-pathway.svg` | `most-episodes` (the dark band) |
| `keypalette.svg` | `blue-key`, `cream-key`, `coral-key`, each holding `…-key-body` and `…-key-dish` |
| `mearm.svg` | `arm` |

If you move or reshape one of these parts, the numbers in the "Cover motion" rules in `home.css` need to follow: the curve the point rides, the arm's pivot and angles, and the keycap colours are written there.

## Add a new case study

1. Copy an existing case study folder, e.g. `work/keypalette/` → `work/new-project/`. KeyPalette is the plainest one: it uses only the shared stylesheets.
2. Build the page from the shared modules first (see `case-study.css` for the list: stat row, topic grid, steps, rows, callout, labelled note, screenshot cards). Only if the page needs something none of them covers, create `css/new-project.css` and link it last.
3. In the new `index.html`:
   - update `<title>`, the meta description, the `og:*` tags and the `canonical` URL,
   - keep exactly one `<h1>`,
   - write the contents list twice (see "Edit text"), with short labels,
   - number the sections `s01`, `s02`, … so the contents links and the contents bar find them.
4. Put images in `assets/new-project/`, a 1200×630 preview image in `assets/og/new-project.png`, and a 1600×900 cover in `assets/covers/new-project.svg` (see "Change a cover").
5. Add it to the Home page (`index.html`) in three places: the Work menu in the header, a card in the work grid (most recent first, with `data-skills` listing which of `study`, `design` and `build` it shows), and the Work column in the footer. Also update the "4 pieces" count. A new cover is a still image unless you give its `<img>` a `data-cover` name and write motion rules for it in `home.css`.

## Accessibility and performance checklist

- One `<h1>` per page, headings in order (h1 → h2 → h3).
- Every `<img>` has `alt` text, `width` and `height`. Images below the first screen use `loading="lazy"`.
- Interactive elements show a visible focus ring when tabbing (`:focus-visible` in `base.css`).
- Motion respects `prefers-reduced-motion`.
- Check new pages at 1440px, 1024px, 768px and 390px wide: nothing should scroll sideways.

## Deploy

GitHub Pages publishes the `main` branch from the repository root. Push to `main` and the site updates within a minute or two.
