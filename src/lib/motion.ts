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
