// Render the social preview cards (1200×630) into public/og/ with the site's fonts.
// Usage: node scripts/build-og.mjs
import { chromium } from 'playwright';
import { readFileSync, readdirSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const b64 = (file) => readFileSync(file).toString('base64');
const font = (pkgFile) => b64(require.resolve(pkgFile));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const FACES = `
@font-face { font-family: 'Familjen'; font-weight: 400 700; src: url(data:font/woff2;base64,${font('@fontsource-variable/familjen-grotesk/files/familjen-grotesk-latin-wght-normal.woff2')}) format('woff2'); }
@font-face { font-family: 'Plex Mono'; font-weight: 400; src: url(data:font/woff2;base64,${font('@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2')}) format('woff2'); }
@font-face { font-family: 'Plex Mono'; font-weight: 500; src: url(data:font/woff2;base64,${font('@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2')}) format('woff2'); }`;

const BASE_CSS = `
${FACES}
* { box-sizing: border-box; margin: 0; }
html, body { width: 1200px; height: 630px; }
body { background: #0e0e0c; color: #e8e6df; font-family: 'Familjen', sans-serif; padding: 56px 64px; display: grid; }
.mono { font-family: 'Plex Mono', monospace; font-size: 18px; letter-spacing: 0.06em; text-transform: uppercase; color: #8c8a83; }
.accent { color: #e4572e; }
.rule { position: relative; height: 1px; background: #34332e; }
.rule::before { content: ''; position: absolute; left: 0; top: -1px; width: 64px; height: 3px; background: #e4572e; }`;

const home = `<!doctype html><html><head><meta charset="utf-8"><style>${BASE_CSS}
body { grid-template-rows: auto 1fr auto; }
h1 { font-weight: 500; font-size: 168px; line-height: 0.9; letter-spacing: -0.04em; align-self: end; margin-bottom: 40px; white-space: nowrap; }
.foot { display: grid; gap: 22px; }
.row { display: flex; justify-content: space-between; align-items: baseline; }
.lead { font-size: 30px; letter-spacing: -0.01em; }
</style></head><body>
<p class="mono">Portfolio · Hardware design · Embedded systems</p>
<h1>Abubakr M<span class="accent">.</span><br>Abdelhalim</h1>
<div class="foot"><div class="rule"></div>
<div class="row"><p class="lead">Electrical engineer designing industrial measurement hardware.</p></div>
<div class="row"><p class="mono">Based in Malaysia · Graduating Feb 2027</p><p class="mono">eng-abubakrhalim.github.io/portfolio</p></div></div>
</body></html>`;

const caseCard = ({ num, title, summary, cover }) => `<!doctype html><html><head><meta charset="utf-8"><style>${BASE_CSS}
body { grid-template-columns: ${cover ? '1fr 470px' : '1fr'}; column-gap: 48px; }
.text { display: grid; grid-template-rows: auto 1fr auto; min-width: 0; }
h1 { font-weight: 500; font-size: ${title.length > 26 ? 60 : 76}px; line-height: 0.98; letter-spacing: -0.035em; margin-top: 28px; }
.sum { font-size: 25px; line-height: 1.35; color: #b9b7b0; margin-top: 24px; max-width: 30ch; }
.foot { display: grid; gap: 18px; align-self: end; }
.cover { align-self: center; width: 470px; aspect-ratio: 16 / 10; border: 1px solid #34332e; background: #121210 url(${cover}) center / cover no-repeat; }
</style></head><body>
<div class="text">
  <p class="mono">Case study ${num}</p>
  <div><h1>${esc(title)}</h1><p class="sum">${esc(summary)}</p></div>
  <div class="foot"><div class="rule"></div><p class="mono">Abubakr M. Abdelhalim · Electrical engineer</p></div>
</div>
${cover ? '<div class="cover"></div>' : ''}
</body></html>`;

// Project frontmatter (title, summary, cover, order) straight from the MDX files.
const dir = 'src/content/projects';
const projects = readdirSync(dir)
  .filter((f) => f.endsWith('.mdx'))
  .map((f) => {
    const fm = readFileSync(path.join(dir, f), 'utf8').split('---')[1];
    const get = (k) => fm.match(new RegExp(`^${k}:\\s*(.+)$`, 'm'))?.[1].trim().replace(/^'(.*)'$/, '$1');
    const coverRel = get('cover');
    const ext = coverRel ? path.extname(coverRel).slice(1).replace('jpg', 'jpeg') : null;
    return {
      id: f.replace(/\.mdx$/, ''),
      title: get('title'),
      summary: get('summary'),
      order: Number(get('order')),
      cover: coverRel ? `data:image/${ext};base64,${b64(path.join(dir, coverRel))}` : null,
    };
  })
  .sort((a, b) => a.order - b.order);

mkdirSync('public/og', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
const render = async (html, out) => {
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out, type: 'png' });
  console.log('wrote', out);
};
await render(home, 'public/og/home.png');
for (const [i, p] of projects.entries()) {
  await render(caseCard({ ...p, num: String(i + 1).padStart(2, '0') }), `public/og/work-${p.id}.png`);
}
await browser.close();
