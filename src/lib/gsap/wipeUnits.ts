import {
  SCROLL_START,
  WIPE_DURATION,
  cappedStagger,
} from "@/lib/gsap/constants";
import { EASE_OUT_EXPO } from "@/lib/gsap/eases";
import { ensureGsapRegistered, gsap, ScrollTrigger } from "@/lib/gsap/register";

export type WipeMode = "load" | "scroll";

export type WipeUnitsOptions = {
  units: HTMLElement[];
  mode?: WipeMode;
  stagger?: number;
  delay?: number;
  /** ScrollTrigger target; defaults to the first mask unit. */
  trigger?: Element | null;
  scrollStart?: string;
  scrollOnce?: boolean;
};

/**
 * Mask wipe-up reveal for pre-split `[data-mask-unit]` elements.
 * Units must sit inside `overflow-hidden` parents; only the inner span moves.
 */
export function wipeUnits({
  units,
  mode = "scroll",
  stagger = 0.06,
  delay = 0,
  trigger,
  scrollStart = SCROLL_START,
  scrollOnce = true,
}: WipeUnitsOptions): gsap.core.Timeline {
  ensureGsapRegistered();

  const tl = gsap.timeline({ delay });

  if (!units.length) return tl;

  gsap.set(units, { y: "120%" });

  const staggerEach = cappedStagger(units.length, stagger);

  units.forEach((unit, i) => {
    tl.to(
      unit,
      {
        y: "0%",
        duration: WIPE_DURATION,
        ease: EASE_OUT_EXPO,
      },
      i * staggerEach,
    );
  });

  if (mode === "load") return tl;

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

  return tl;
}
