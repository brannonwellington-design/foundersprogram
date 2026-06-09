"use client";

import { useRef, type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { SCROLL_START, WIPE_DURATION } from "@/lib/gsap/constants";
import { EASE_OUT_EXPO } from "@/lib/gsap/eases";
import { prefersReducedMotion } from "@/lib/gsap/reducedMotion";
import { ensureGsapRegistered, gsap, ScrollTrigger } from "@/lib/gsap/register";
import type { WipeMode } from "@/lib/gsap/wipeUnits";
import { cn } from "@/lib/cn";

export type MaskHairlineProps = {
  className?: string;
  opacity?: number;
  reveal?: WipeMode;
  scrollStart?: string;
  revealDelay?: number;
  scrollTriggerRef?: RefObject<Element | null>;
};

/** Horizontal hairline that wipes left → right on reveal. */
export function MaskHairline({
  className,
  opacity = 0.4,
  reveal = "scroll",
  scrollStart = SCROLL_START,
  revealDelay = 0,
  scrollTriggerRef,
}: MaskHairlineProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      ensureGsapRegistered();
      const line = lineRef.current;
      const root = rootRef.current;
      if (!line || !root) return;

      if (prefersReducedMotion()) {
        gsap.set(line, { scaleX: 1 });
        return;
      }

      gsap.set(line, { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({ delay: revealDelay });
      tl.to(line, {
        scaleX: 1,
        duration: WIPE_DURATION,
        ease: EASE_OUT_EXPO,
      });

      if (reveal === "load") return;

      const triggerEl = scrollTriggerRef?.current ?? root;
      if (!triggerEl) return;

      tl.pause();
      ScrollTrigger.create({
        trigger: triggerEl,
        start: scrollStart,
        once: true,
        toggleActions: "play none none none",
        animation: tl,
      });
    },
    {
      scope: rootRef,
      dependencies: [reveal, scrollStart, revealDelay, opacity, scrollTriggerRef],
      revertOnUpdate: true,
    },
  );

  return (
    <div ref={rootRef} className={cn("relative h-px w-full", className)}>
      <div
        ref={lineRef}
        className="absolute inset-0 origin-left bg-current"
        style={{ opacity }}
      />
    </div>
  );
}
