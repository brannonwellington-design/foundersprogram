"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { WORDMARK_LETTERS, WORDMARK_VIEWBOX } from "@/lib/wordmarkLetters";

/**
 * Footer "Listen" wordmark (true inline SVG vector), full width and locked 24px
 * from the left/right/bottom.
 *
 * Entrance/exit: each letter is clipped to its own vertical frame and rolls up
 * from below into place (and back down out of frame on exit), one after another
 * — a sequential roll-wipe driven by whether the footer is in view.
 */
export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotion();
  const { w, h } = WORDMARK_VIEWBOX;

  return (
    <footer
      ref={ref}
      // Extra bottom padding on mobile so the wordmark sits above the sticky CTA.
      className="px-6 pb-28 pt-[14vh] text-content-brand md:pb-6"
    >
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="block w-full"
        fill="currentColor"
        role="img"
        aria-label="Listen"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {WORDMARK_LETTERS.map((l, i) => (
            <clipPath key={i} id={`wm-clip-${i}`}>
              <rect x={l.minX - 1} y={0} width={l.maxX - l.minX + 2} height={h} />
            </clipPath>
          ))}
        </defs>

        {WORDMARK_LETTERS.map((l, i) => (
          <g key={i} clipPath={`url(#wm-clip-${i})`}>
            <motion.path
              d={l.d}
              fillRule="evenodd"
              aria-hidden
              initial={false}
              animate={{ y: reduce ? 0 : inView ? 0 : h }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 24,
                mass: 1,
                delay: i * 0.07,
              }}
            />
          </g>
        ))}
      </svg>
    </footer>
  );
}
