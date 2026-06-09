import {
  SCROLL_START,
  WIPE_DURATION,
  cappedStagger,
} from "@/lib/gsap/constants";
import { EASE_OUT_EXPO } from "@/lib/gsap/eases";
import { ensureGsapRegistered, gsap, ScrollTrigger } from "@/lib/gsap/register";
import type { WipeMode } from "@/lib/gsap/wipeUnits";

export function isClipUnit(el: HTMLElement): boolean {
  return el.dataset.maskReveal === "clip";
}

export function setUnitHidden(el: HTMLElement): void {
  if (isClipUnit(el)) {
    gsap.set(el, { clipPath: "inset(100% 0 0 0)" });
  } else {
    gsap.set(el, { y: "120%" });
  }
}

export function setUnitRevealed(el: HTMLElement): void {
  if (isClipUnit(el)) {
    gsap.set(el, { clipPath: "inset(0% 0 0 0)" });
  } else {
    gsap.set(el, { y: "0%" });
  }
}

export type RevealElementsOptions = {
  units: HTMLElement[];
  mode?: WipeMode;
  stagger?: number;
  delay?: number;
  trigger?: Element | null;
  scrollStart?: string;
  scrollOnce?: boolean;
  onComplete?: () => void;
};

/**
 * Reveal mask units in order — text uses translate-y; media uses clip-path
 * so images keep their layout and interactive children aren't left transformed.
 */
export function revealElements({
  units,
  mode = "scroll",
  stagger = 0.06,
  delay = 0,
  trigger,
  scrollStart = SCROLL_START,
  scrollOnce = true,
  onComplete,
}: RevealElementsOptions): gsap.core.Timeline {
  ensureGsapRegistered();

  const tl = gsap.timeline({ delay, onComplete });

  if (!units.length) return tl;

  units.forEach(setUnitHidden);

  const staggerEach = cappedStagger(units.length, stagger);

  units.forEach((unit, i) => {
    const at = i * staggerEach;
    if (isClipUnit(unit)) {
      tl.to(
        unit,
        {
          clipPath: "inset(0% 0 0 0)",
          duration: WIPE_DURATION,
          ease: EASE_OUT_EXPO,
        },
        at,
      );
    } else {
      tl.to(
        unit,
        { y: "0%", duration: WIPE_DURATION, ease: EASE_OUT_EXPO },
        at,
      );
    }
  });

  if (mode === "scroll") {
    const triggerEl = trigger ?? units[0];
    if (!triggerEl) return tl;

    tl.pause();
    ScrollTrigger.create({
      trigger: triggerEl,
      start: scrollStart,
      once: scrollOnce,
      toggleActions: "play none none none",
      animation: tl,
    });
  }

  return tl;
}

export type ScrubRevealStep = {
  el: Element;
  from: gsap.TweenVars;
  to: gsap.TweenVars;
};

export type RevealScrubOptions = {
  steps: ScrubRevealStep[];
  trigger: Element;
  scrollStart?: string;
  scrollEnd?: string;
  scrub?: number | boolean;
};

/**
 * Reveal units one at a time, driven by scroll position (scrub) rather than
 * wall-clock stagger. Each step occupies one non-overlapping segment of the
 * timeline so only one unit animates per scroll increment.
 */
export function revealScrubSequence({
  steps,
  trigger,
  scrollStart = "top 90%",
  scrollEnd = "top 15%",
  scrub = 0.4,
}: RevealScrubOptions): ScrollTrigger | undefined {
  ensureGsapRegistered();

  if (!steps.length) return;

  steps.forEach(({ el, from }) => gsap.set(el, from));

  const tl = gsap.timeline();
  steps.forEach(({ el, to }, i) => {
    tl.to(el, { ...to, duration: 1, ease: EASE_OUT_EXPO }, i);
  });

  return ScrollTrigger.create({
    trigger,
    start: scrollStart,
    end: scrollEnd,
    scrub,
    animation: tl,
  });
}
