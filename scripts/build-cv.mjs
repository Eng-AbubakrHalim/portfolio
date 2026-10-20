// Render cv/cv.html to public/cv/*.pdf with the site's fonts embedded.
// Usage: node scripts/build-cv.mjs   (writes a preview PNG per page to screenshots/)
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const font = (pkgFile) => readFileSync(require.resolve(pkgFile)).toString('base64');

const faces = `
@font-face { font-family: 'Familjen Grotesk Variable'; font-weight: 400 700; font-style: normal; font-display: block;
  src: url(data:font/woff2;base64,${font('@fontsource-variable/familjen-grotesk/files/familjen-grotesk-latin-wght-normal.woff2')}) format('woff2'); }
@font-face { font-family: 'IBM Plex Mono'; font-weight: 400; font-style: normal; font-display: block;
  src: url(data:font/woff2;base64,${font('@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2')}) format('woff2'); }
@font-face { font-family: 'IBM Plex Mono'; font-weight: 500; font-style: normal; font-display: block;
  src: url(data:font/woff2;base64,${font('@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2')}) format('woff2'); }
`;

const html = readFileSync('cv/cv.html', 'utf8').replace('/* FONTS */', faces);
const out = 'public/cv/Abubakr-M-Abdelhalim-CV.pdf';
mkdirSync('public/cv', { recursive: true });
mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true });

// Preview at the printable width (A4 minus 13mm side margins) so line breaks match the PDF.
await page.emulateMedia({ media: 'print' });
await page.setViewportSize({ width: 696, height: 1043 });
const contentHeight = await page.evaluate(() => document.body.scrollHeight);
console.log(`content height ${contentHeight}px of 1043px printable per page`);
await page.screenshot({ path: 'screenshots/cv-preview.png', fullPage: true });
await browser.close();
console.log(`wrote ${out}`);
