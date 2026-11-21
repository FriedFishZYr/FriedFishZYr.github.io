# Yinran Zhu — Portfolio

Personal portfolio served by GitHub Pages at <https://friedfishzyr.github.io>.

Plain HTML and CSS. No framework and no build step. Edit a file, refresh the browser.

Three pages use JavaScript, in dependency-free files loaded with `defer`: `js/home.js` (Home), `js/mufin-article.js` (the contents bar on both MuFIN articles) and `js/mufin-generation.js` (the walkthrough demo on the MuFIN Generation article). None makes network requests, and every page still reads completely with JavaScript off. The KeyPalette and MeArm pages have no scripts.

The design source is the Figma file **YinranZhu_Portfolios**, page **Portfolio**:

| Page | Figma frame | File |
|---|---|---|
| Home | `74:249` (superseded: the current Home was built in code, see below) | `index.html` |
| MuFIN Pathway Analysis article | `6:41` (superseded: rebuilt in code on the MuFIN Generation layout) | `work/mufin/index.html` |
| KeyPalette case study | `29:249` | `work/keypalette/index.html` |
| MeArm case study | `82:257` | `work/mearm/index.html` |
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
css/home.css               Home and 404 (Geist + Geist Mono, research-index layout)
css/mufin-article.css      Shared by the two MuFIN articles: top bar, lead row, reading column, figure mats, footer (Geist / Geist Mono / Source Serif 4)
css/mufin.css              MuFIN Pathway Analysis only: wide chart tier, case-study modules
css/keypalette.css         KeyPalette only (Archivo, keycap theme)
css/mearm.css              MeArm only (Barlow / Barlow Condensed / Fragment Mono, laser-cut kit theme)
css/mufin-generation.css   MuFIN Generation only: its figures and the walkthrough demo
js/home.js                 Home only: header name-to-monogram on scroll, dropdowns, mobile menu, carousels, filters
js/mufin-article.js        Both MuFIN articles: the contents bar that slides out from under the top bar once the contents rail scrolls away
js/mufin-generation.js     MuFIN Generation only: the scripted walkthrough demo
assets/covers/             The four cover illustrations shown on Home (SVG, 16:9)
assets/home/               Older Home images, no longer shown
assets/mufin/              MuFIN charts, diagrams and artifact thumbnails (SVG)
assets/keypalette/         KeyPalette screenshots (WebP) and keyboard art (SVG)
assets/mearm/              MeArm screenshots (WebP) and cut-sheet motif (SVG)
assets/og/                 1200×630 link-preview images (Slack, LinkedIn, …)
favicon.svg, favicon-32.png, apple-touch-icon.png
.nojekyll                  Tells GitHub Pages to serve the files as-is
```

Home and the two MuFIN articles keep the interface in ink and grey: no accent colour on links, labels, hovers or focus rings. Colour is reserved for the cover art and for figures where it means something (in the Generation figures, teal is the correct distance and red the mistaken one; in the Pathway charts, red marks the 32 mismatch cases). The KeyPalette and MeArm case studies keep their own themes.

Each project has its own stylesheet and visual language on purpose. `base.css` is shared by every page. The two MuFIN articles also share `mufin-article.css`, so they read as a pair with the same layout. To change something on both (top bar, title block, contents rail, captions, footer), edit `mufin-article.css`; each page's own file only holds what the other page does not have.

Home has its own header and footer (in `home.css`), shared only with the 404 page. The header shows the full name at the top of the page; once you scroll, it turns into a dark bar and the name collapses to the "Y/Z" mark. The name is set in Archivo (expanded width) with a drawn slash in place of the I; the slash steepens to 24° in the name and tips to 42° in the mark, parallel to the Y's arm and the Z's diagonal (see `.brand__slash` in `home.css`). The two MuFIN articles share a simpler top bar and footer in `mufin-article.css`.

The three project marks on Home (MuFIN, KeyPalette, MeArm) are inline SVGs in `index.html`, drawn only with circles on a 48×48 grid: chains of small beads for lines, larger circles for joints and points, overlapping circles for solid shapes. They are filled with `currentColor`, so they grey out with the rest of the column on hover. A new project's mark should follow the same recipe. The link lists under the three columns start on one line because the columns share their rows (`grid-template-rows: subgrid` on `.proj` in `home.css`).

## Edit text

All copy is in the HTML files. Open the page, find the sentence and change it. A few things to know:

- **Uppercase headings are typed in sentence case.** On the KeyPalette page, headings like "DESIGN A KEYCAP COLORWAY…" are written as `Design a keycap colorway…` and uppercased by CSS (`text-transform`). Type them normally.
- **Special characters.** Write `&amp;` for &, and `&lt;` / `&gt;` for < and >. Curly quotes (“ ” ’), arrows (→) and dashes (—, –) can be typed directly.
- **Double spaces around "·"** in labels like `Case study  ·  KeyPalette` are intentional. Those elements have `class="pre"`, which keeps the spacing.
- **Contents list on the MuFIN articles.** The rail beside Figure 1 uses short labels ("Method", "Results"), not the full section headings. Each label is written twice near the top of the page: once in `<nav class="toc">` and once in `<details class="toc-mini">` (the version phones show). Change both. The contents bar under the top bar copies the first list.
- **Page title and link preview.** Each page's `<head>` has a `<title>`, a `<meta name="description">` and `og:*` tags. Update them if you change a headline.

## Update the résumé

The Resume links (Home header, Home footer, and the top bar of both MuFIN articles) point to the résumé PDF on Google Drive. To update it without changing the link, open the file in Drive and use "Manage versions" → "Upload new version". If you share a different file instead, search the HTML files for `drive.google.com` and update the address. Keep the file shared as "Anyone with the link can view".

Contact emails appear in the Home header's Contact menu and in the footer on Home and both MuFIN articles. The Gmail address is labelled "Jobs" and the CMU address "School".

## Swap an image

1. Export the new image at **2×** the size it appears on the page (for example, 1224×764 for a 612×382 slot).
2. Convert it to WebP. <https://squoosh.app> works well: WebP, quality about 80.
3. Save two files in the page's folder under `assets/`: a 1× and a 2× version, e.g. `assets/keypalette/06-compare-612.webp` and `…-1224.webp`. The simplest option is to overwrite the existing files with the same names.
4. If the file names change, update the `<img>` tag: `src`, `srcset`, and `width`/`height` (the 1× size, which prevents layout jumps while loading).
5. Update the `alt` text so it describes the new image.

Vector art (keyboard, cut sheet, MuFIN charts and diagrams) is SVG. Export it from Figma as SVG with **Outline text** turned on, so it looks the same without web fonts. The text inside these SVGs is converted to shapes, so it can't be edited in the HTML. To change a chart label, edit it in Figma and re-export the SVG. Keep the file name the same and the page picks it up.

On phones, the wide MuFIN charts scroll sideways inside their own box (`class="scroll-x"`) instead of shrinking until the text is unreadable. The `--min` value on that box sets how wide the chart stays.

## Change a cover

Each piece has one cover illustration, shown twice on Home (the featured band and the work canvas). The drawings live in the Figma file **YinranZhu_Portfolios**, page **Arts**, as four 1600×900 frames. They share one recipe: a flat pale background and one or two simple shapes cut from 24px graph paper, in three or four colours.

To change one, edit its frame in Figma, export the frame as SVG, and save it over the file of the same name in `assets/covers/` (`mufin-generation.svg`, `mufin-pathway.svg`, `keypalette.svg`, `mearm.svg`). Keep the frame at 1600×900 so it fills its slot. If the drawing changes meaning, update the two `alt` texts for it in `index.html`.

## Add a new case study

1. Copy an existing case study folder, e.g. `work/keypalette/` → `work/new-project/`.
2. Create `css/new-project.css` for the new page's look. Start from scratch or copy pieces from another case-study stylesheet. Keep `base.css` linked first.
3. In the new `index.html`:
   - change the stylesheet link and the Google Fonts link to the fonts this case study uses,
   - update `<title>`, the meta description, the `og:*` tags and the `canonical` URL,
   - keep exactly one `<h1>`,
   - set `href="/"` on the "All work" link.
4. Put images in `assets/new-project/`, a 1200×630 preview image in `assets/og/new-project.png`, and a 1600×900 cover in `assets/covers/new-project.svg` (see "Change a cover").
5. Add it to the Home page (`index.html`) in five places: the Work menu in the header, its project column (or a link in an existing one, and that column's piece count), a slide in the featured band, a card on the work canvas (with `data-project` matching a filter button; the `piece--1` to `piece--4` classes set each card's size and offset in `home.css`), and the Work column in the footer. Also update the "4 pieces" count.

## Accessibility and performance checklist

- One `<h1>` per page, headings in order (h1 → h2 → h3).
- Every `<img>` has `alt` text, `width` and `height`. Images below the first screen use `loading="lazy"`.
- Interactive elements show a visible focus ring when tabbing (`:focus-visible` in `base.css`).
- Motion respects `prefers-reduced-motion`.
- Check new pages at 1440px, 1024px, 768px and 390px wide: nothing should scroll sideways.

## Deploy

GitHub Pages publishes the `main` branch from the repository root. Push to `main` and the site updates within a minute or two.
