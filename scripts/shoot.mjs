// Screenshot pages at the brief's test widths.
// Usage: node scripts/shoot.mjs <path> [--widths 360,768,1280,1920] [--themes dark,light] [--full] [--reduced] [--prescroll]
// --prescroll scrolls through the page first so once-only scroll reveals have fired.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const rawPath = args.find((a) => !a.startsWith('--') && !args[args.indexOf(a) - 1]?.startsWith('--')) ?? '';
// Git Bash rewrites a leading "/" into a Windows path, so accept "styleguide/" as well as "/styleguide/".
const path = '/' + rawPath.replace(/^\/+/, '');
const base = process.env.BASE_URL ?? 'http://localhost:4321/portfolio';
const widths = opt('widths', '360,1280').split(',').map(Number);
const themes = opt('themes', 'dark').split(',');
const full = args.includes('--full');
const reduced = args.includes('--reduced');
const prescroll = args.includes('--prescroll');
const out = opt('out', 'screenshots');
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
for (const theme of themes) {
  for (const width of widths) {
    const ctx = await browser.newContext({
      viewport: { width, height: width < 768 ? 800 : 900 },
      deviceScaleFactor: 1,
      reducedMotion: reduced ? 'reduce' : 'no-preference',
    });
    await ctx.addInitScript((t) => localStorage.setItem('theme', t), theme);
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await page.goto(base + path, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(900);
    if (prescroll) {
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < height; y += 400) {
        await page.mouse.wheel(0, 400);
        await page.waitForTimeout(60);
      }
      await page.waitForTimeout(1200);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(1200);
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const slug = path.replace(/\W+/g, '-').replace(/^-|-$/g, '') || 'home';
    const file = `${out}/${slug}-${width}-${theme}${reduced ? '-reduced' : ''}.png`;
    await page.screenshot({ path: file, fullPage: full });
    console.log(file, overflow > 0 ? `HORIZONTAL OVERFLOW ${overflow}px` : 'no overflow', errors.length ? `ERRORS: ${errors.join(' | ')}` : '');
    await ctx.close();
  }
}
await browser.close();
