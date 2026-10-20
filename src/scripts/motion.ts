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
 * Re-splits on resize/font load (autoSplit) without layout jumps: the new lines pick up
 * the old progress, and keep playing if a reveal was already requested (even mid-delay).
 */
export function lineReveal(
  el: HTMLElement,
  { duration = DUR.slow, stagger = 0.06, delay = 0, paused = false } = {},
) {
  let tween: gsap.core.Tween | undefined;
  let requested = false;
  let pending: gsap.core.Tween | undefined;

  const build = (lines: Element[]) => {
    const progress = tween?.progress() ?? 0;
    tween?.kill();
    tween = gsap.fromTo(
      lines,
      { yPercent: 120 },
      { yPercent: 0, duration, stagger, ease: EASE.out, paused: true },
    );
    tween.progress(progress);
    if (requested && !pending && progress < 1) tween.play();
  };

  // Lines-only splits keep words intact, so the text stays readable as-is: no aria rewriting.
  const split = SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'split-line',
    aria: 'none',
    autoSplit: true,
    onSplit: (self) => build(self.lines),
  });

  const play = () => {
    requested = true;
    pending?.kill();
    pending = undefined;
    if (delay) {
      pending = gsap.delayedCall(delay, () => {
        pending = undefined;
        tween?.play();
      });
    } else {
      tween?.play();
    }
  };

  const restart = () => {
    requested = true;
    pending?.kill();
    pending = undefined;
    tween?.restart();
  };

  if (!paused) play();

  return {
    split,
    play,
    restart,
    /** Jump to the end state (no animation). */
    finish: () => tween?.progress(1),
  };
}

export { gsap, SplitText };
