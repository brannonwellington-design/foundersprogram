import type Lenis from "lenis";

let lenis: Lenis | null = null;
let lockCount = 0;
let savedScrollY = 0;
let touchMoveBlocker: ((e: TouchEvent) => void) | null = null;

export function registerLenis(instance: Lenis) {
  lenis = instance;
}

export function unregisterLenis(instance: Lenis) {
  if (lenis === instance) lenis = null;
}

/** Lenis virtualizes scroll — window.scrollY stays 0 while lenis.scroll tracks position. */
function getScrollY(): number {
  if (lenis) return lenis.scroll;
  return (
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

function applyBodyFixedLock(y: number) {
  document.body.style.position = "fixed";
  document.body.style.top = `-${y}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
}

function clearBodyFixedLock() {
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
}

function addTouchBlock() {
  touchMoveBlocker = (e: TouchEvent) => {
    e.preventDefault();
  };
  document.addEventListener("touchmove", touchMoveBlocker, { passive: false });
}

function removeTouchBlock() {
  if (!touchMoveBlocker) return;
  document.removeEventListener("touchmove", touchMoveBlocker);
  touchMoveBlocker = null;
}

/**
 * Freeze page scroll. Avoid overflow:hidden — it breaks position:sticky and
 * makes the mobile nav vanish when the menu opens mid-scroll. Lenis: stop +
 * touch block; native: body position fixed.
 */
export function setScrollLocked(locked: boolean) {
  if (locked) {
    lockCount += 1;
    if (lockCount === 1) {
      savedScrollY = getScrollY();

      lenis?.stop();
      document.documentElement.style.overscrollBehavior = "none";

      if (lenis) {
        addTouchBlock();
      } else {
        applyBodyFixedLock(savedScrollY);
      }
    }
    return;
  }

  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    const y = savedScrollY;

    removeTouchBlock();
    document.documentElement.style.overscrollBehavior = "";

    if (!lenis) {
      clearBodyFixedLock();
      window.scrollTo(0, y);
    } else {
      lenis.start();
    }
  }
}
