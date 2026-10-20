/*
 * Smooth scrolling: one Lenis instance for the whole session, driven by the
 * GSAP ticker and synced to ScrollTrigger. Skipped entirely under
 * prefers-reduced-motion (native scrolling, instant anchor jumps).
 */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './motion';

gsap.registerPlugin(ScrollTrigger);

// The fixed-header offset comes from `scroll-padding-top` on <html>, which both Lenis and
// native anchor scrolling already honour, so no extra offset is passed here.
export const lenis: Lenis | null = prefersReducedMotion()
  ? null
  : new Lenis({ anchors: true, stopInertiaOnNavigate: true });

if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/** Scroll to a section and hand keyboard focus to it, like a native anchor jump would. */
export function scrollToSection(target: HTMLElement) {
  const focus = () => {
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  };
  if (lenis) {
    lenis.scrollTo(target, { onComplete: focus });
  } else {
    target.scrollIntoView();
    focus();
  }
  history.replaceState(null, '', `#${target.id}`);
}

// Same-page hash links. Runs in the capture phase on window so it sees the click before
// Astro's router (which would set location.href and jump instantly) and before Lenis'
// own anchor handler (which scrolls but doesn't cancel the native jump).
// Menu links are left to the menu, which closes itself first and then dispatches site:scroll-to.
window.addEventListener(
  'click',
  (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>('a[href*="#"]') : null;
    if (!link || link.hasAttribute('data-menu-link')) return;
    if (link.origin !== location.origin || link.pathname !== location.pathname || !link.hash) return;
    const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    e.stopPropagation();
    scrollToSection(target);
  },
  { capture: true },
);

window.addEventListener('site:scroll-to', (e) => scrollToSection((e as CustomEvent<HTMLElement>).detail));

// The router resets scroll on navigation; make Lenis pick up the new page height and position.
document.addEventListener('astro:after-swap', () => {
  lenis?.resize();
  ScrollTrigger.refresh();
});
