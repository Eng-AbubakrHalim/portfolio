/*
 * Shared GSAP setup. Mirrors the motion tokens in tokens.css so CSS and JS
 * animations use identical durations and curves.
 */
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(CustomEase, SplitText);

export const DUR = { fast: 0.15, base: 0.3, slow: 0.5 } as const;
export const EXIT = 0.75; // exits run at ~75% of the entrance duration
export const STAGGER = 0.05;

export const EASE = {
  out: CustomEase.create('ep-out', '0.22,1,0.36,1'),
  in: CustomEase.create('ep-in', '0.5,0,0.75,0'),
  inOut: CustomEase.create('ep-inout', '0.65,0,0.35,1'),
} as const;

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Masked line reveal: each line slides up from behind its own clip mask.
 * Re-splits on resize/font load (autoSplit) without layout jumps.
 */
export function lineReveal(
  el: HTMLElement,
  { duration = DUR.slow, stagger = 0.06, delay = 0, paused = false } = {},
) {
  let tween: gsap.core.Tween | undefined;
  const split = SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'split-line',
    autoSplit: true,
    onSplit(self) {
      const progress = tween?.progress() ?? 0;
      tween = gsap.from(self.lines, {
        yPercent: 110,
        duration,
        stagger,
        delay,
        ease: EASE.out,
        paused,
      });
      if (progress) tween.progress(progress);
      return tween;
    },
  });
  return { split, get tween() { return tween; } };
}

export { gsap, SplitText };
