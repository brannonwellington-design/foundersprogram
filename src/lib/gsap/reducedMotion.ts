/** True when the user prefers reduced motion (client only). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Set mask units to their revealed position without animating. */
export function setMaskUnitsRevealed(units: HTMLElement[]): void {
  units.forEach((el) => {
    el.style.transform = "translateY(0)";
  });
}
