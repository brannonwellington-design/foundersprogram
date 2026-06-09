"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { useGSAP } from "@gsap/react";
import { SCROLL_START, WORD_STAGGER } from "@/lib/gsap/constants";
import { prefersReducedMotion } from "@/lib/gsap/reducedMotion";
import { ensureGsapRegistered } from "@/lib/gsap/register";
import {
  revealElements,
  setUnitRevealed,
} from "@/lib/gsap/revealElements";
import type { WipeMode } from "@/lib/gsap/wipeUnits";
import { MaskGroupContext } from "@/components/motion/maskContext";
import { cn } from "@/lib/cn";

export type MaskGroupProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  reveal?: WipeMode;
  scrollStart?: string;
  revealDelay?: number;
  /** When false, only provides group context — parent owns animation. */
  animate?: boolean;
};

function maskUnitsFrom(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>("[data-mask-unit]"));
}

/**
 * Animates all nested MaskText units in DOM order with one timeline —
 * top to bottom, left to right, element by element.
 */
export function MaskGroup({
  children,
  as: Tag = "div",
  className,
  style,
  reveal = "scroll",
  scrollStart = SCROLL_START,
  revealDelay = 0,
  animate = true,
}: MaskGroupProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [unitCount, setUnitCount] = useState(0);

  // Re-sync when line measurement adds units after first paint.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const count = root.querySelectorAll("[data-mask-unit]").length;
    setUnitCount(count);

    const ro = new ResizeObserver(() => {
      const next = root.querySelectorAll("[data-mask-unit]").length;
      setUnitCount(next);
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [children]);

  useGSAP(
    () => {
      if (!animate) return;

      ensureGsapRegistered();
      const root = rootRef.current;
      if (!root) return;

      const units = maskUnitsFrom(root);
      if (!units.length) return;

      if (prefersReducedMotion()) {
        units.forEach(setUnitRevealed);
        return;
      }

      revealElements({
        units,
        mode: reveal,
        stagger: WORD_STAGGER,
        delay: revealDelay,
        trigger: root,
        scrollStart,
      });
    },
    {
      scope: rootRef,
      dependencies: [animate, reveal, scrollStart, revealDelay, unitCount],
      revertOnUpdate: true,
    },
  );

  return (
    <MaskGroupContext.Provider value={true}>
      <Tag ref={rootRef} className={cn(className)} style={style}>
        {children}
      </Tag>
    </MaskGroupContext.Provider>
  );
}
