/*
 * Generic scroll reveal for [data-reveal] blocks: 16px rise + fade, batched so
 * items entering together stagger by 50ms. Skipped under reduced motion.
 */
import { gsap, DUR, EASE, prefersReducedMotion } from './motion';
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
  const els = gsap.utils.toArray<HTMLElement>('[data-reveal]');
  if (!els.length) return;
  gsap.set(els, { autoAlpha: 0, y: 16 });
  triggers = ScrollTrigger.batch(els, {
    start: 'top 92%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { autoAlpha: 1, y: 0, duration: DUR.slow, stagger: 0.05, ease: EASE.out, clearProps: 'transform' }),
  });
}

document.addEventListener('astro:page-load', () => document.fonts.ready.then(initReveals));
document.addEventListener('astro:before-swap', kill);
