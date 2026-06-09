"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { WORD_STAGGER, WIPE_DURATION } from "@/lib/gsap/constants";
import { EASE_OUT_EXPO } from "@/lib/gsap/eases";
import {
  prefersReducedMotion,
  setMaskUnitsRevealed,
} from "@/lib/gsap/reducedMotion";
import { ensureGsapRegistered, gsap } from "@/lib/gsap/register";
import { FOOTER_TAGLINE } from "@/lib/content";
import { WORDMARK_LETTERS, WORDMARK_VIEWBOX } from "@/lib/wordmarkLetters";
import { MaskGroup } from "@/components/motion/MaskGroup";
import { MaskText } from "@/components/motion/MaskText";

/**
 * Footer wordmark — each letter wipes up in sequence on scroll, then the
 * company tagline reveals word by word as soon as the last letter lands.
 */
export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { w, h } = WORDMARK_VIEWBOX;
  const lastLetterIndex = WORDMARK_LETTERS.length - 1;
  // First tagline word starts as soon as "n" begins its wipe.
  const taglineDelay = lastLetterIndex * WORD_STAGGER;

  useGSAP(
    () => {
      ensureGsapRegistered();
      const footer = ref.current;
      if (!footer) return;

      const letters = Array.from(
        footer.querySelectorAll<SVGPathElement>("[data-mask-letter]"),
      );
      if (!letters.length) return;

      if (prefersReducedMotion()) {
        setMaskUnitsRevealed(letters as unknown as HTMLElement[]);
        gsap.set(letters, { y: 0 });
        return;
      }

      gsap.set(letters, { y: h });

      gsap.to(letters, {
        y: 0,
        duration: WIPE_DURATION,
        ease: EASE_OUT_EXPO,
        stagger: WORD_STAGGER,
        scrollTrigger: {
          trigger: footer,
          start: "top 85%",
          once: true,
          toggleActions: "play none none none",
        },
      });
    },
    { scope: ref, revertOnUpdate: true },
  );

  return (
    <footer
      ref={ref}
      data-hide-apply-bar
      className="flex flex-col gap-4 px-4 pb-4 pt-24 text-content-brand md:gap-6 md:p-6 md:pt-[14vh]"
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

      <MaskGroup
        className="flex flex-col text-[20px] leading-[1.4] tracking-tight-2 md:text-[56px] md:leading-[1.2]"
        scrollStart="top 85%"
        revealDelay={taglineDelay}
      >
        {FOOTER_TAGLINE.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex w-full items-center justify-between"
          >
            {row.map((word) => (
              <MaskText key={word} as="span" mode="unit" className="shrink-0">
                {word}
              </MaskText>
            ))}
          </div>
        ))}
      </MaskGroup>
    </footer>
  );
}
