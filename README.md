# Yinran Zhu — Portfolio

Personal portfolio served by GitHub Pages at <https://friedfishzyr.github.io>.

Plain HTML and CSS. No framework, no build step, no JavaScript. Edit a file, refresh the browser.

The design source is the Figma file **YinranZhu_Portfolios**, page **Portfolio**:

| Page | Figma frame | File |
|---|---|---|
| Home | `74:249` | `index.html` |
| MuFIN case study | `6:41` | `work/mufin/index.html` |
| KeyPalette case study | `29:249` | `work/keypalette/index.html` |
| MeArm case study | `82:257` | `work/mearm/index.html` |

Case studies live under `/work/…` so they never collide with the KeyPalette app itself at `/KeyPalette`.

## Preview locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Use a server rather than opening the files directly: links and images use site-root paths such as `/css/base.css`, which only resolve over HTTP.

## Project layout

```
index.html                 Home
work/mufin/index.html      MuFIN case study
work/keypalette/index.html KeyPalette case study
work/mearm/index.html      MeArm case study
404.html                   "Page not found" (GitHub Pages serves it automatically)
css/base.css               Shared: reset, .wrap layout column, focus styles, reduced motion
css/home.css               Home and 404 (Source Serif 4 + Source Sans 3)
css/mufin.css              MuFIN only (research-report look, same fonts as Home)
css/keypalette.css         KeyPalette only (Archivo, keycap theme)
css/mearm.css              MeArm only (Barlow / Barlow Condensed / Fragment Mono, laser-cut kit theme)
assets/home/               Home card thumbnails
assets/mufin/              MuFIN charts, diagrams and artifact thumbnails (SVG)
assets/keypalette/         KeyPalette screenshots (WebP) and keyboard art (SVG)
assets/mearm/              MeArm screenshots (WebP) and cut-sheet motif (SVG)
assets/og/                 1200×630 link-preview images (Slack, LinkedIn, …)
favicon.svg, favicon-32.png, apple-touch-icon.png
.nojekyll                  Tells GitHub Pages to serve the files as-is
```

Each case study has its own stylesheet and visual language on purpose. Only `base.css` is shared.

The Home and MuFIN pages use the same nav and footer. Their styles are repeated in `home.css` and `mufin.css`, so if you restyle one, update the other too.

## Edit text

All copy is in the HTML files. Open the page, find the sentence and change it. A few things to know:

- **Uppercase headings are typed in sentence case.** On the KeyPalette page, headings like "DESIGN A KEYCAP COLORWAY…" are written as `Design a keycap colorway…` and uppercased by CSS (`text-transform`). Type them normally.
- **Special characters.** Write `&amp;` for &, and `&lt;` / `&gt;` for < and >. Curly quotes (“ ” ’), arrows (→) and dashes (—, –) can be typed directly.
- **Double spaces around "·"** in labels like `Case study  ·  KeyPalette` are intentional. Those elements have `class="pre"`, which keeps the spacing.
- **Page title and link preview.** Each page's `<head>` has a `<title>`, a `<meta name="description">` and `og:*` tags. Update them if you change a headline.

## Update the résumé

The Resume links (Home nav, Home contact row, MuFIN nav) point to the résumé PDF on Google Drive. To update it without changing the link, open the file in Drive and use "Manage versions" → "Upload new version". If you share a different file instead, search the HTML files for `drive.google.com` and update the address. Keep the file shared as "Anyone with the link can view".

Contact emails appear in two places, the Home contact row and the footer on Home and MuFIN. The Gmail address is labelled "Jobs" and the CMU address "School".

## Swap an image

1. Export the new image at **2×** the size it appears on the page (for example, 1224×764 for a 612×382 slot).
2. Convert it to WebP. <https://squoosh.app> works well: WebP, quality about 80.
3. Save two files in the page's folder under `assets/`: a 1× and a 2× version, e.g. `assets/keypalette/06-compare-612.webp` and `…-1224.webp`. The simplest option is to overwrite the existing files with the same names.
4. If the file names change, update the `<img>` tag: `src`, `srcset`, and `width`/`height` (the 1× size, which prevents layout jumps while loading).
5. Update the `alt` text so it describes the new image.

Vector art (keyboard, cut sheet, MuFIN charts and diagrams) is SVG. Export it from Figma as SVG with **Outline text** turned on, so it looks the same without web fonts. The text inside these SVGs is converted to shapes, so it can't be edited in the HTML. To change a chart label, edit it in Figma and re-export the SVG. Keep the file name the same and the page picks it up.

On phones, the wide MuFIN charts scroll sideways inside their own box (`class="scroll-x"`) instead of shrinking until the text is unreadable. The `--min` value on that box sets how wide the chart stays.

## Add a new case study

1. Copy an existing case study folder, e.g. `work/keypalette/` → `work/new-project/`.
2. Create `css/new-project.css` for the new page's look. Start from scratch or copy pieces from another case-study stylesheet. Keep `base.css` linked first.
3. In the new `index.html`:
   - change the stylesheet link and the Google Fonts link to the fonts this case study uses,
   - update `<title>`, the meta description, the `og:*` tags and the `canonical` URL,
   - keep exactly one `<h1>`,
   - set `href="/"` on the "All work" link.
4. Put images in `assets/new-project/` and a 1200×630 preview image in `assets/og/new-project.png`.
5. Add a card for it on the Home page (`index.html`). Copy one of the `<li class="card">` blocks inside `<ul class="cards">` and update the number, title, link, description, meta and thumbnail. Also update the "3 case studies" count.

## Accessibility and performance checklist

- One `<h1>` per page, headings in order (h1 → h2 → h3).
- Every `<img>` has `alt` text, `width` and `height`. Images below the first screen use `loading="lazy"`.
- Interactive elements show a visible focus ring when tabbing (`:focus-visible` in `base.css`).
- Motion respects `prefers-reduced-motion`.
- Check new pages at 1440px, 1024px, 768px and 390px wide: nothing should scroll sideways.

## Deploy

GitHub Pages publishes the `main` branch from the repository root. Push to `main` and the site updates within a minute or two.
