"use client";

import { useRef } from "react";
import { motion, useAnimationFrame, useMotionValue, useVelocity, useScroll } from "motion/react";
import { MARQUEE_ITEMS } from "@/lib/content";
import { easeOutExpo } from "@/lib/motion";

/**
 * Continuous "ACCEPTING APPLICATIONS · 2026" ticker on the brand-blue bar.
 * Base speed is constant; scroll velocity nudges it faster (and can briefly
 * reverse direction) so it feels alive without becoming a screensaver.
 */
export function Marquee() {
  const x = useMotionValue(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  const BASE_SPEED = 40; // px per second
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    const seg = baseRef.current?.offsetWidth ?? 0;
    if (!seg) return;

    const v = scrollVelocity.get();
    direction.current = v < -5 ? -1 : v > 5 ? 1 : direction.current;

    const boost = Math.min(Math.abs(v) / 120, 240);
    const move =
      direction.current * (BASE_SPEED + boost) * (delta / 1000);

    let next = x.get() - move;
    // Wrap within one segment width for a seamless loop.
    if (next <= -seg) next += seg;
    if (next > 0) next -= seg;
    x.set(next);

    if (trackRef.current) {
      // Snap to whole pixels — sub-pixel transforms blur the text on the GPU layer.
      trackRef.current.style.transform = `translate3d(${Math.round(next)}px,0,0)`;
    }
  });

  // Enough repeats to overflow wide viewports; we translate by one segment.
  const cells = Array.from({ length: 14 }, (_, i) => MARQUEE_ITEMS[i % MARQUEE_ITEMS.length]);

  return (
    // The whole bar — blue background and all — wipes in from the bottom up on
    // load via a clip-path reveal, matching the hero's bottom-up image wipe.
    <motion.div
      initial={{ clipPath: "inset(100% 0 0 0)" }}
      animate={{ clipPath: "inset(0 0 0 0)" }}
      transition={{ duration: 0.8, ease: easeOutExpo }}
      className="w-full overflow-hidden bg-surface-brand-primary py-1 select-none"
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        <div ref={baseRef} className="flex shrink-0">
          <MarqueeRow cells={cells} />
        </div>
        {/* Duplicate segment for the seamless wrap. */}
        <div className="flex shrink-0" aria-hidden>
          <MarqueeRow cells={cells} />
        </div>
      </div>
    </motion.div>
  );
}

function MarqueeRow({ cells }: { cells: string[] }) {
  return (
    <div className="flex items-center gap-3 pr-3">
      {cells.map((c, i) => (
        <div key={i} className="flex items-center gap-3">
          <span
            className="whitespace-nowrap text-[10px] text-content-brand-contrast tracking-tight-2"
            style={{ lineHeight: "14px" }}
          >
            {c}
          </span>
          <span className="size-1 rounded-full bg-content-brand-contrast" aria-hidden />
        </div>
      ))}
    </div>
  );
}
