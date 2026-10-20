// Lighthouse (mobile, default throttling) against the production preview.
// Chromium comes from Playwright with a debugging port, so Lighthouse doesn't need to spawn Chrome.
// Usage: node scripts/lighthouse.mjs [baseUrl] [paths...]
import { chromium } from 'playwright';
import lighthouse from 'lighthouse';
import { mkdirSync, writeFileSync } from 'node:fs';

const [base = 'http://127.0.0.1:4325/portfolio/', ...paths] = process.argv.slice(2);
const targets = paths.length ? paths : ['', 'work/daq-module/', 'work/ssd-adapter/', 'work/datasheet-tool/', 'work/smart-posture/'];
const PORT = 9333;

mkdirSync('lighthouse', { recursive: true });
const browser = await chromium.launch({ args: [`--remote-debugging-port=${PORT}`] });
const rows = [];
for (const p of targets) {
  const result = await lighthouse(base + p, {
    port: PORT,
    output: 'html',
    logLevel: 'error',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  });
  const slug = (p || 'home').replace(/\W+/g, '-').replace(/-$/, '');
  writeFileSync(`lighthouse/${slug}.html`, result.report);
  const { categories: c, audits: a } = result.lhr;
  const row = {
    page: p || '/',
    perf: Math.round(c.performance.score * 100),
    a11y: Math.round(c.accessibility.score * 100),
    bp: Math.round(c['best-practices'].score * 100),
    seo: Math.round(c.seo.score * 100),
    LCP: a['largest-contentful-paint'].displayValue,
    CLS: a['cumulative-layout-shift'].displayValue,
    TBT: a['total-blocking-time'].displayValue,
  };
  rows.push(row);
  const failed = Object.values(result.lhr.audits)
    .filter((x) => x.score !== null && x.score < 0.9 && x.scoreDisplayMode !== 'informative' && x.scoreDisplayMode !== 'manual')
    .map((x) => `${x.id} (${x.displayValue ?? x.score})`);
  console.log(JSON.stringify(row), failed.length ? '\n   below 0.9: ' + failed.join(', ') : '');
}
await browser.close();
