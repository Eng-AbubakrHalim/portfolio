/*
 * Generic scroll reveal for [data-reveal] blocks: 16px rise + fade, batched so
 * items entering together stagger by 50ms. Skipped under reduced motion.
 */
import { gsap, DUR, EASE, prefersReducedMotion, alreadyInView } from './motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let triggers: ScrollTrigger[] = [];

function kill() {
  triggers.forEach((t) => t.kill());
  triggers = [];
}

function initReveals() {
  kill();
  if (prefersReducedMotion()) return;
  const els = gsap.utils.toArray<HTMLElement>('[data-reveal]').filter((el) => !alreadyInView(el));
  if (!els.length) return;
  gsap.set(els, { opacity: 0, y: 16 });
  triggers = ScrollTrigger.batch(els, {
    start: 'top 92%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { opacity: 1, y: 0, duration: DUR.slow, stagger: 0.05, ease: EASE.out, clearProps: 'transform' }),
  });
}

document.addEventListener('astro:page-load', () => document.fonts.ready.then(initReveals));
document.addEventListener('astro:before-swap', kill);

// Content waiting to be revealed is only transparent, never visibility-hidden, so the keyboard can
// still reach it. If focus lands inside something not yet revealed, show it straight away.
document.addEventListener('focusin', (e) => {
  const el = e.target instanceof Element ? e.target.closest<HTMLElement>('[data-reveal], [data-work-row], [data-hero-below]') : null;
  if (el && Number(getComputedStyle(el).opacity) < 1) {
    gsap.to(el, { opacity: 1, y: 0, duration: DUR.fast, ease: EASE.out, overwrite: true });
  }
});
