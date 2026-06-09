/** Seconds — single mask wipe duration. */
export const WIPE_DURATION = 0.65;

/** Stagger between word units. */
export const WORD_STAGGER = 0.06;

/** Stagger between line units. */
export const LINE_STAGGER = 0.08;

/** Cap total reveal length so dense blocks stay classy. */
export const MAX_REVEAL_DURATION = 1.1;

/** Default ScrollTrigger start for scroll-in reveals. */
export const SCROLL_START = "top 85%";

export function cappedStagger(
  unitCount: number,
  requested: number,
): number {
  if (unitCount <= 1) return 0;
  const maxStagger = (MAX_REVEAL_DURATION - WIPE_DURATION) / (unitCount - 1);
  return Math.min(requested, Math.max(0, maxStagger));
}
