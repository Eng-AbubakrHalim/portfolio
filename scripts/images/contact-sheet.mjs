// Build _raw/inventory.md and _raw/contact-sheet/index.html (both gitignored) from the
// review notes and the processed images, then render the sheet to a PNG for review.
// Usage: node scripts/images/contact-sheet.mjs <screens-notes.tsv> <legacy-notes.tsv>
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const [screensTsv, legacyTsv] = process.argv.slice(2);
const parse = (file) =>
  readFileSync(file, 'utf8')
    .trim()
    .split('\n')
    .map((l) => l.split('\t'));
const screens = parse(screensTsv); // n, stamp, kind:what, project, verdict, note
const legacy = parse(legacyTsv); // id, path under _raw/, kind:what, project, verdict, note
const processed = JSON.parse(readFileSync('_raw/processed/manifest.json', 'utf8'));
const usedSources = new Set(processed.map((p) => p.src));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const verdictOf = (src, verdict) => (usedSources.has(src) ? 'selected' : verdict.startsWith('candidate') ? 'not used' : verdict);

// ---------- inventory.md ----------
const md = [
  '# Image inventory',
  '',
  `Reviewed ${screens.length} internship screenshots and ${legacy.length} other images (v1 site photos, WhatsApp photos, FYP figures).`,
  'Verdicts: **selected** (on the contact sheet), **not used** (usable, but a better shot covers it), **reject** (reason given).',
  '',
  '## Internship screenshots (`_raw/screens/`)',
  '',
  '| # | File | Shows | Project | Verdict | Note |',
  '|---|---|---|---|---|---|',
  ...screens.map(([n, stamp, what, project, verdict, note]) => {
    const file = n === '1' ? 'Pin Configuration.png' : `Screenshot ${stamp}.png`;
    const src = n === '1' ? 'screens/Pin Configuration.png' : `screens/${file}`;
    return `| ${n} | ${file} | ${what} | ${project} | ${verdictOf(src, verdict)} | ${note} |`;
  }),
  '',
  '## Other images (`_raw/legacy/`, `_raw/fyp/`)',
  '',
  '| # | File | Shows | Project | Verdict | Note |',
  '|---|---|---|---|---|---|',
  ...legacy.map(([id, file, what, project, verdict, note]) => {
    return `| ${id} | ${file} | ${what} | ${project} | ${usedSources.has(file) ? 'selected' : verdict.startsWith('candidate') ? 'not used / ask' : verdict} | ${note} |`;
  }),
  '',
];
writeFileSync('_raw/inventory.md', md.join('\n'));

// ---------- reject summary ----------
const reasons = [
  ['Vendor datasheets, app notes, eval-board schematics, vendor websites', /^vendor|^web/],
  ['Standards documents (IPC, SFF/PCI-SIG tables and drawings)', /^standard/],
  ['Third-party articles and generated explainer diagrams/tables', /^third-party|^diagram:.*explainer|^table:.*explainer|^diagram:(isolation|4-20|ESD)/],
  ['Company schematics (net names, full sheets)', /^schematic/],
  ['Full or net-labelled layout views', /^layout/],
  ['Tool UI: dialogs, rule editors, stack tables, pinouts, project trees', /^tool/],
  ['Fab drawings and notes (fab data, laminate names, project title)', /^drawing/],
  ['Early draw.io block diagrams and sketches (superseded; redrawn as SVG)', /^diagram|^sketch|^notes/],
  ['Spreadsheets and comparison tables', /^spreadsheet|^table/],
  ['Chats, meetings, error dialogs', /^chat|^meeting/],
];
const rejects = screens.filter(([, , , , v, ]) => v === 'reject');
const counted = new Set();
const summary = reasons.map(([label, re]) => {
  const rows = rejects.filter((r) => !counted.has(r[0]) && re.test(r[2]));
  rows.forEach((r) => counted.add(r[0]));
  return [label, rows.length];
});
const otherRejects = rejects.filter((r) => !counted.has(r[0]));
if (otherRejects.length) summary.push(['Other: low value, near-duplicates, superseded renders/sims', otherRejects.length]);
const notUsed = screens.filter(([n, stamp, , , v]) => v.startsWith('candidate') && !usedSources.has(`screens/Screenshot ${stamp}.png`));

// ---------- HTML ----------
const groups = [
  ['daq-module', 'Industrial DAQ module', 'Company work: cropped views only; product name, file names and dialogs removed.'],
  ['ssd-adapter', 'M.2-to-EDSFF SSD tester adapter', 'Company work: no schematics, layout files or fab data.'],
  ['smart-posture', 'Smart Posture Correction', 'From the v1 site.'],
  ['robocon', 'UTM Robocon', 'From the v1 site.'],
  ['fyp', 'Final-year project', 'From Desktop/FYP_Simulation_Figures and Supraharmoins pv inverter.'],
  ['workshop', 'Workshops', 'Event photos (B).'],
  ['iyrc', 'IYRC 2025', 'Event photo (B).'],
  ['custom-boards', 'Custom boards', 'From the v1 site.'],
];
const card = (p) => `
  <figure class="card${p.role === 'cover' ? ' card--cover' : ''}">
    <div class="frame"><img src="../processed/${p.slug}/${p.name}.${p.ext}" alt="${esc(p.alt)}"></div>
    <figcaption>
      <p class="name">${esc(p.name)}.${p.ext}${p.role === 'cover' ? ' <span class="tag">cover 16:10</span>' : ''} <span class="dim">${p.width}×${p.height}</span></p>
      <p class="cap">${esc(p.caption)}</p>
      <p class="alt"><b>Alt:</b> ${esc(p.alt)}</p>
      <p class="src">${esc(p.src.replace('screens/', ''))}</p>
    </figcaption>
  </figure>`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Contact sheet</title>
<style>
  :root { --bg:#0e0e0c; --fg:#e8e6df; --muted:#8c8a83; --rule:#34332e; --frame:#121210; --accent:#e4572e; }
  * { box-sizing: border-box; margin: 0; }
  body { background: var(--bg); color: var(--fg); font: 15px/1.5 system-ui, sans-serif; padding: 40px; }
  h1 { font-size: 40px; font-weight: 500; letter-spacing: -0.02em; }
  h2 { font-size: 24px; font-weight: 500; margin: 48px 0 4px; padding-top: 16px; border-top: 1px solid var(--rule); }
  .lede, .note { color: var(--muted); max-width: 80ch; }
  .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; margin-top: 16px; }
  .card { border: 1px solid var(--rule); }
  .card--cover { grid-column: span 2; }
  .frame { background: var(--frame); aspect-ratio: 16/10; display: grid; place-items: center; padding: 12px; border-bottom: 1px solid var(--rule); }
  .frame img { max-width: 100%; max-height: 100%; object-fit: contain; border: 1px solid var(--rule); }
  figcaption { padding: 12px; display: grid; gap: 6px; }
  .name { font-family: ui-monospace, monospace; font-size: 13px; }
  .tag { color: var(--accent); }
  .dim, .src { color: var(--muted); font-family: ui-monospace, monospace; font-size: 12px; }
  .cap { font-size: 15px; }
  .alt { color: var(--muted); font-size: 13px; }
  table { border-collapse: collapse; margin-top: 12px; font-size: 14px; }
  td, th { text-align: left; padding: 6px 16px 6px 0; border-bottom: 1px solid var(--rule); vertical-align: top; }
  th { color: var(--muted); font-weight: 400; }
  .num { font-family: ui-monospace, monospace; text-align: right; }
</style></head><body>
<h1>Image contact sheet</h1>
<p class="lede">${processed.length} images selected from ${screens.length + legacy.length} reviewed. Nothing here is on the site yet. Full per-file list: <code>_raw/inventory.md</code>.</p>
${groups
  .map(([slug, title, note]) => {
    const items = processed.filter((p) => p.slug === slug);
    return items.length ? `<h2>${esc(title)} <span class="dim">(${items.length})</span></h2><p class="note">${esc(note)}</p><div class="grid">${items.map(card).join('')}</div>` : '';
  })
  .join('\n')}
<h2>Datasheet lookup tool</h2>
<p class="note">No usable images (it's a CLI and none of the screenshots show it). The case study gets a typographic cover; a demo GIF can be added later.</p>
<h2>Rejected: ${rejects.length} of ${screens.length} screenshots</h2>
<table><tr><th>Reason</th><th class="num">Count</th></tr>
${summary.filter(([, n]) => n).map(([l, n]) => `<tr><td>${esc(l)}</td><td class="num">${n}</td></tr>`).join('\n')}
</table>
<p class="note" style="margin-top:12px">Also usable but not selected (a better shot of the same thing was picked): ${notUsed.map((r) => '#' + r[0]).join(', ')}.</p>
<h2>Other photos: rejected or needing your call</h2>
<table><tr><th>#</th><th>File</th><th>Verdict</th><th>Reason</th></tr>
${legacy
  .filter(([, file]) => !usedSources.has(file))
  .map(([id, file, , , v, note]) => `<tr><td>${id}</td><td>${esc(file)}</td><td>${v.startsWith('candidate') ? 'ask' : v}</td><td>${esc(note)}</td></tr>`)
  .join('\n')}
</table>
</body></html>`;
mkdirSync('_raw/contact-sheet', { recursive: true });
writeFileSync('_raw/contact-sheet/index.html', html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
await page.goto('file:///' + process.cwd().replace(/\\/g, '/') + '/_raw/contact-sheet/index.html', { waitUntil: 'load' });
await page.screenshot({ path: '_raw/contact-sheet/contact-sheet.png', fullPage: true });
await browser.close();
console.log('wrote _raw/inventory.md, _raw/contact-sheet/index.html, contact-sheet.png');
