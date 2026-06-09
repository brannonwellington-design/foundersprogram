"use client";

import {
  createElement,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type RefObject,
} from "react";
import { useGSAP } from "@gsap/react";
import {
  LINE_STAGGER,
  SCROLL_START,
  WORD_STAGGER,
} from "@/lib/gsap/constants";
import {
  prefersReducedMotion,
  setMaskUnitsRevealed,
} from "@/lib/gsap/reducedMotion";
import { ensureGsapRegistered } from "@/lib/gsap/register";
import {
  MASK_CLIP,
  MASK_CLIP_BLOCK,
  MASK_CLIP_BLOCK_TIGHT,
  MASK_CLIP_TIGHT,
  groupWordsIntoLines,
  splitWords,
} from "@/lib/gsap/splitText";
import { revealElements } from "@/lib/gsap/revealElements";
import type { WipeMode } from "@/lib/gsap/wipeUnits";
import { cn } from "@/lib/cn";
import { useInMaskGroup } from "@/components/motion/maskContext";

export type MaskTextMode = "words" | "lines" | "unit";

export type MaskTextProps = {
  children: string;
  as?: ElementType;
  mode?: MaskTextMode;
  className?: string;
  style?: CSSProperties;
  /** `load` plays on mount; `scroll` reveals when entering the viewport. */
  reveal?: WipeMode;
  /** Override ScrollTrigger start (scroll mode only). */
  scrollStart?: string;
  /** Extra delay before this block's reveal (seconds). */
  revealDelay?: number;
  /** Share one ScrollTrigger across siblings (e.g. section label + hairline). */
  scrollTriggerRef?: RefObject<Element | null>;
  /** Override per-unit stagger (seconds). */
  stagger?: number;
  /** Skip descender padding on the clip (labels, names, nav). */
  tight?: boolean;
  /** Extra classes on the overflow clip wrapper. */
  clipClassName?: string;
};

function maskUnitsFrom(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>("[data-mask-unit]"));
}

/**
 * Text that reveals via mask wipe-up. Words for display type, lines for body,
 * or a single unit for numbers/labels. Skips its own animation inside MaskGroup.
 */
export function MaskText({
  children,
  as: Tag = "span",
  mode = "words",
  className,
  style,
  reveal = "scroll",
  scrollStart = SCROLL_START,
  revealDelay = 0,
  scrollTriggerRef,
  stagger: staggerOverride,
  tight = false,
  clipClassName,
}: MaskTextProps) {
  const inlineClip = tight ? MASK_CLIP_TIGHT : MASK_CLIP;
  const blockClip = tight ? MASK_CLIP_BLOCK_TIGHT : MASK_CLIP_BLOCK;
  const rootRef = useRef<HTMLElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const inGroup = useInMaskGroup();
  const words = useMemo(() => splitWords(children), [children]);
  const [lines, setLines] = useState<string[] | null>(
    mode === "lines" ? null : null,
  );

  useLayoutEffect(() => {
    if (mode !== "lines") return;

    const measure = measureRef.current;
    if (!measure || !words.length) {
      setLines([children]);
      return;
    }

    const updateLines = () => {
      const wordEls = Array.from(
        measure.querySelectorAll<HTMLElement>("[data-line-word]"),
      );
      setLines(groupWordsIntoLines(wordEls, words));
    };

    updateLines();

    const target = measure.parentElement ?? measure;
    const ro = new ResizeObserver(updateLines);
    ro.observe(target);
    return () => ro.disconnect();
  }, [mode, words, children]);

  useGSAP(
    () => {
      if (inGroup) return;

      ensureGsapRegistered();
      const root = rootRef.current;
      if (!root) return;

      if (mode === "lines" && !lines?.length) return;

      const units = maskUnitsFrom(root);
      if (!units.length) return;

      if (prefersReducedMotion()) {
        setMaskUnitsRevealed(units);
        return;
      }

      const stagger =
        staggerOverride ??
        (mode === "lines" ? LINE_STAGGER : WORD_STAGGER);

      const triggerEl = scrollTriggerRef?.current ?? root;

      revealElements({
        units,
        mode: reveal,
        stagger,
        delay: revealDelay,
        trigger: triggerEl,
        scrollStart,
      });
    },
    {
      scope: rootRef,
      dependencies: [
        children,
        mode,
        reveal,
        scrollStart,
        revealDelay,
        inGroup,
        lines,
        scrollTriggerRef,
        staggerOverride,
      ],
      revertOnUpdate: true,
    },
  );

  if (mode === "unit") {
    const blockUnit =
      typeof Tag === "string" &&
      /^(p|h[1-6]|div|li|blockquote)$/.test(Tag);
    return createElement(
      Tag,
      {
        ref: rootRef,
        className: cn(blockUnit && "w-full", className),
        style,
      },
      <span
        className={cn(
          blockUnit ? blockClip : inlineClip,
          "max-w-full",
          clipClassName,
        )}
      >
        <span data-mask-unit className={blockUnit ? "block" : "inline-block"}>
          {children}
        </span>
      </span>,
    );
  }

  if (mode === "words") {
    return createElement(
      Tag,
      { ref: rootRef, className: cn("w-full", className), style },
      words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className={cn(inlineClip, clipClassName)}
          style={{ marginRight: i < words.length - 1 ? "0.25em" : 0 }}
        >
          <span data-mask-unit className="inline-block">
            {word}
          </span>
        </span>
      )),
    );
  }

  // Lines: measure first, then render wipe units (no fallback paragraph).
  return createElement(
    Tag,
    {
      ref: rootRef,
      className: cn("relative w-full text-pretty", className),
      style,
    },
    <>
      <span
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible absolute inset-x-0 top-0 text-pretty"
      >
        {words.map((word, i) => (
          <span key={`m-${word}-${i}`} data-line-word className="inline">
            {word}
            {i < words.length - 1 ? "\u00a0" : ""}
          </span>
        ))}
      </span>
      {lines?.map((line, i) => (
        <span key={`line-${line}-${i}`} className={cn(blockClip, clipClassName)}>
          <span data-mask-unit className="block">
            {line}
          </span>
        </span>
      ))}
    </>,
  );
}
