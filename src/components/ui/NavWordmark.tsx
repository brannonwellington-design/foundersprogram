"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { WIPE_DURATION, WORD_STAGGER } from "@/lib/gsap/constants";
import { EASE_OUT_EXPO } from "@/lib/gsap/eases";
import { prefersReducedMotion } from "@/lib/gsap/reducedMotion";
import { ensureGsapRegistered, gsap } from "@/lib/gsap/register";
import { LOAD } from "@/lib/loadSequence";
import { WORDMARK_LETTERS, WORDMARK_VIEWBOX } from "@/lib/wordmarkLetters";
import { cn } from "@/lib/cn";

/**
 * Header wordmark — each letter wipes up in sequence on first load,
 * matching the footer treatment at nav scale.
 */
export function NavWordmark({
  className,
  animate = true,
  ariaLabel = "Listen",
}: {
  className?: string;
  animate?: boolean;
  ariaLabel?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const { w, h } = WORDMARK_VIEWBOX;

  useGSAP(
    () => {
      if (!animate) return;

      ensureGsapRegistered();
      const svg = ref.current;
      if (!svg) return;

      const letters = Array.from(
        svg.querySelectorAll<SVGPathElement>("[data-mask-letter]"),
      );
      if (!letters.length) return;

      if (prefersReducedMotion()) {
        gsap.set(letters, { y: 0 });
        return;
      }

      gsap.set(letters, { y: h });
      gsap.to(letters, {
        y: 0,
        duration: WIPE_DURATION,
        ease: EASE_OUT_EXPO,
        stagger: WORD_STAGGER,
        delay: LOAD.logo,
      });
    },
    { scope: ref, dependencies: [animate], revertOnUpdate: true },
  );

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${w} ${h}`}
      fill="currentColor"
      role="img"
      aria-label={ariaLabel}
      xmlns="http://www.w3.org/2000/svg"
      className={cn("block", className)}
    >
      <defs>
        {WORDMARK_LETTERS.map((l, i) => (
          <clipPath key={i} id={`nav-wm-clip-${i}`}>
            <rect x={l.minX - 1} y={0} width={l.maxX - l.minX + 2} height={h} />
          </clipPath>
        ))}
      </defs>

      {WORDMARK_LETTERS.map((l, i) => (
        <g key={i} clipPath={`url(#nav-wm-clip-${i})`}>
          <path
            data-mask-letter
            d={l.d}
            fillRule="evenodd"
            aria-hidden
            style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
          />
        </g>
      ))}
    </svg>
  );
}
