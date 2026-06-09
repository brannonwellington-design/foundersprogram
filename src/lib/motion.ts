import type { Transition, Variants } from "motion/react";

/**
 * Spring constants from the awwwards-motion skill (stiffness 300 / damping 30 /
 * mass 1). We use springs for primary motion — never duration-based easing —
 * so everything responds to velocity and settles with a slight life to it.
 */
export const spring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 1,
};

/** Softer spring for large/slow elements (the footer wordmark, hero circle). */
export const springSoft: Transition = {
  type: "spring",
  stiffness: 140,
  damping: 26,
  mass: 1,
};

/** Snappier spring for small interactive nudges (arrows, hovers). */
export const springSnappy: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 28,
  mass: 0.8,
};

/**
 * Slot-machine reel for the testimonial photo on hover. Snappy and critically
 * damped (no overshoot) so faces roll up through the window crisply — quick to
 * arrive on activation, and seamless when swapping between people at speed.
 */
export const reel: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 44,
  mass: 0.9,
};

/**
 * Premium exponential ease-out — long, decisive tail. Used for "curtain"
 * wipes (clip-path reveals) where a spring's overshoot would look wrong.
 */
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

/**
 * Masked line/word reveal. The child rises from fully below its clipping
 * parent (which MUST be `overflow-hidden`), so the text appears to slide up
 * from behind a hard edge. `custom` is the absolute start delay in seconds,
 * letting a row of words cascade up in sequence.
 */
export const maskRise: Variants = {
  hidden: { y: "120%" },
  visible: (delay: number = 0) => ({
    y: "0%",
    transition: { ...springSoft, delay },
  }),
};

/** Curtain fill rising into view on hover (paired with `maskHoverSwap`). */
export const maskHoverRise: Variants = {
  rest: { y: "100%" },
  hover: {
    y: "0%",
    transition: { duration: 0.48, ease: easeOutExpo },
  },
};

/** Two-line stack inside `overflow-hidden`; shifts up to swap contrast ↔ brand. */
export const maskHoverSwap: Variants = {
  rest: { y: "0%" },
  hover: {
    y: "-50%",
    transition: { duration: 0.42, ease: easeOutExpo, delay: 0.06 },
  },
};

/** Label/arrow swap plus a slight forward nudge on the arrow. */
export const maskHoverSwapArrow: Variants = {
  rest: { y: "0%", x: 0 },
  hover: {
    y: "-50%",
    x: 5,
    transition: {
      y: { duration: 0.42, ease: easeOutExpo, delay: 0.1 },
      x: { duration: 0.35, ease: easeOutExpo, delay: 0.1 },
    },
  },
};

/**
 * Soft fade + rise for elements that don't get a hard mask (pills, buttons).
 * `custom` is the absolute start delay in seconds.
 */
export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { ...springSoft, delay, opacity: { duration: 0.6, delay } },
  }),
};

/** Standard scroll-reveal: rise + fade, springy settle. */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...springSoft, opacity: { duration: 0.6 } },
  },
};

/** Stagger container for sequenced children (Details rows, nav items). */
export const staggerContainer = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

/**
 * Spring *options* (no `type` field) for `useSpring`, which takes SpringOptions
 * rather than a full Transition.
 */
export const springOptions = { stiffness: 300, damping: 30, mass: 1 };
export const springSnappyOptions = { stiffness: 420, damping: 28, mass: 0.8 };

/** Magnetic strength + overshoot from the skill's interaction tokens. */
export const MAGNETIC_FACTOR = 0.18;
export const OVERSHOOT_SCALE = 1.03;
