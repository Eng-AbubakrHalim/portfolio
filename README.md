# Portfolio — Abubakr M. Abdelhalim

Source for [eng-abubakrhalim.github.io/portfolio](https://eng-abubakrhalim.github.io/portfolio/). Built with Astro, GSAP and Lenis; published to GitHub Pages by GitHub Actions.

## Run it

```bash
npm install
npm run dev        # http://localhost:4321/portfolio/
npm run build      # static site in dist/
npm run preview    # serve dist/ locally
```

Needs Node 22.12 or newer.

## Where things live

| What | Where |
|---|---|
| Home page sections | `src/pages/index.astro`, components in `src/components/` |
| Text for Other projects, Experience, Toolkit, contact details | `src/data/*.ts` |
| Case studies | `src/content/projects/*.mdx` (frontmatter: title, summary, year, role, tools, tags, status, cover, order) |
| Diagrams | `src/components/diagrams/*.astro` (hand-drawn SVG) |
| Colours, type scale, spacing, motion | `src/styles/tokens.css` |
| CV | `cv/cv.html`, built to `public/cv/Abubakr-M-Abdelhalim-CV.pdf` |
| Link-preview cards | `public/og/*.png` |

## After editing

```bash
node scripts/build-cv.mjs                       # CV source changed: re-render the PDF (one A4 page)
node scripts/build-og.mjs                       # a project title, summary or cover changed: re-render preview cards
node scripts/images/process.mjs --publish       # images/manifest.mjs changed: re-crop images into src/assets/projects/
```

The image pipeline reads raw screenshots from `_raw/`, which is gitignored and never committed (company work).

## Checks

```bash
npm run build && npm run preview -- --port 4325 --host 127.0.0.1
node scripts/lighthouse.mjs                     # Lighthouse (mobile) on the home page and every case study
node scripts/a11y-motion-check.mjs              # reduced motion, tab order, focus ring, skip link, menu
node scripts/shoot.mjs "" --widths 360,768,1280,1920 --full --prescroll   # screenshots into screenshots/
```

These use Playwright's Chromium (`npx playwright install chromium` once).

## Publishing

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and deploys it to GitHub Pages. Pull requests into `main` are built but not deployed. Pages must be set to **Settings → Pages → Source: GitHub Actions**.

The v1 site is kept at tag `v1-archive`.
