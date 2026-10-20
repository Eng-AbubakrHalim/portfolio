// Reduced-motion and keyboard checks against a running server.
// Usage: node scripts/a11y-motion-check.mjs [baseUrl]
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://127.0.0.1:4325/portfolio/';
const browser = await chromium.launch();
const report = {};

// ---------- Reduced motion: everything in its final state, nothing animating ----------
for (const path of ['', 'work/daq-module/', 'work/datasheet-tool/']) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(base + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  // Jump (no smooth scroll) through the page, then check nothing is left hidden or mid-animation.
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 700) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(40);
  }
  await page.waitForTimeout(300);
  report[`reduced ${path || '/'}`] = await page.evaluate(() => {
    const visible = (el) => {
      const cs = getComputedStyle(el);
      return cs.visibility !== 'hidden' && Number(cs.opacity) > 0.99;
    };
    const watched = [...document.querySelectorAll('[data-reveal], [data-work-row], .fact__label, .section-head__title, .hero__name, [data-hero-fade], .section-head__rule')];
    const running = document.getAnimations().filter((a) => a.playState === 'running').map((a) => a.animationName ?? a.constructor.name);
    const band = document.querySelector('[data-band-track]');
    const anim = document.querySelector('.anim img');
    return {
      lenis: document.documentElement.classList.contains('lenis'),
      hiddenOrFaded: watched.filter((el) => !visible(el)).map((el) => el.className).slice(0, 5),
      runningCssAnimations: running,
      bandTransform: band ? getComputedStyle(band).transform : 'n/a',
      demoImage: anim ? anim.currentSrc.split('/').pop().split('?')[0] : 'n/a',
    };
  });
  report[`reduced ${path || '/'}`].errors = errors;
  await ctx.close();
}

// ---------- Keyboard: tab order, visible focus, skip link, menu ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  const stops = [];
  for (let i = 0; i < 16; i++) {
    await page.keyboard.press('Tab');
    stops.push(
      await page.evaluate(() => {
        const a = document.activeElement;
        const cs = getComputedStyle(a);
        return {
          text: (a.getAttribute('aria-label') || a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 28),
          ring: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2,
          color: cs.outlineColor,
        };
      }),
    );
  }
  report.tabOrder = stops.map((s) => `${s.text}${s.ring ? '' : ' [NO RING]'}`).join(' | ');
  report.ringColor = stops[0].color;
  // Skip link moves focus into main
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
  report.skipLinkTarget = await page.evaluate(() => location.hash);
  // aria-current on the index nav after a jump
  await page.goto(base + '#toolkit', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  report.ariaCurrent = await page.evaluate(() => document.querySelector('.index-nav [aria-current="true"]')?.textContent?.trim());
  // Work rows and project details reachable and operable with the keyboard
  report.detailsKeyboard = await page.evaluate(() => {
    const s = document.querySelector('.other__row');
    s.focus();
    return document.activeElement === s;
  });
  await page.keyboard.press('Enter');
  report.detailsOpened = await page.evaluate(() => document.querySelector('.other__details').open);
  await ctx.close();
}

// ---------- Mobile menu with keyboard (Escape closes, focus returns) ----------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.focus('[data-menu-open]');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
  const openState = await page.evaluate(() => ({ open: document.querySelector('[data-menu]').open, focusInMenu: !!document.activeElement.closest('[data-menu]') }));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  const closed = await page.evaluate(() => ({ open: document.querySelector('[data-menu]').open, focus: document.activeElement.textContent.trim() }));
  report.mobileMenu = { ...openState, afterEscape: closed };
  await ctx.close();
}

await browser.close();
console.log(JSON.stringify(report, null, 2));
