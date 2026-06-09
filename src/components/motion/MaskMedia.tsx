"use client";

import { useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { SCROLL_START, WORD_STAGGER } from "@/lib/gsap/constants";
import { prefersReducedMotion } from "@/lib/gsap/reducedMotion";
import {
  revealElements,
  setUnitRevealed,
} from "@/lib/gsap/revealElements";
import { ensureGsapRegistered } from "@/lib/gsap/register";
import type { WipeMode } from "@/lib/gsap/wipeUnits";
import { cn } from "@/lib/cn";
import { useInMaskGroup } from "@/components/motion/maskContext";

export type MaskMediaProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  style?: CSSProperties;
  reveal?: WipeMode;
  scrollStart?: string;
  revealDelay?: number;
  scrollTriggerRef?: RefObject<Element | null>;
  /** After reveal, stop clipping so hovers / nested motion can run freely. */
  releaseClip?: boolean;
};

/** Images, video frames, buttons — clip-path wipe (not translate-y). */
export function MaskMedia({
  children,
  className,
  innerClassName,
  style,
  reveal = "scroll",
  scrollStart = SCROLL_START,
  revealDelay = 0,
  scrollTriggerRef,
  releaseClip = false,
}: MaskMediaProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inGroup = useInMaskGroup();

  useGSAP(
    () => {
      if (inGroup) return;

      ensureGsapRegistered();
      const root = rootRef.current;
      if (!root) return;

      const unit = root.querySelector<HTMLElement>("[data-mask-unit]");
      if (!unit) return;

      if (prefersReducedMotion()) {
        setUnitRevealed(unit);
        if (releaseClip) root.style.overflow = "visible";
        return;
      }

      revealElements({
        units: [unit],
        mode: reveal,
        stagger: WORD_STAGGER,
        delay: revealDelay,
        trigger: scrollTriggerRef?.current ?? root,
        scrollStart,
        onComplete: () => {
          if (releaseClip) root.style.overflow = "visible";
        },
      });
    },
    {
      scope: rootRef,
      dependencies: [
        reveal,
        scrollStart,
        revealDelay,
        inGroup,
        scrollTriggerRef,
        releaseClip,
      ],
      revertOnUpdate: true,
    },
  );

  return (
    <div ref={rootRef} className={cn("overflow-hidden", className)} style={style}>
      <div
        data-mask-unit
        data-mask-reveal="clip"
        className={innerClassName}
      >
        {children}
      </div>
    </div>
  );
}
