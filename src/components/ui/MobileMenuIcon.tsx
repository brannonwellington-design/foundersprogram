"use client";

import { useId, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { WIPE_DURATION } from "@/lib/gsap/constants";
import { EASE_OUT_EXPO } from "@/lib/gsap/eases";
import { prefersReducedMotion } from "@/lib/gsap/reducedMotion";
import { ensureGsapRegistered, gsap } from "@/lib/gsap/register";
import { LOAD } from "@/lib/loadSequence";
import { cn } from "@/lib/cn";

/** Grid and X swap via vertical mask wipes inside a 24×24 clip. */
export const MENU_ICON_WIPE = 0.38;

const DOTS = [
  { cx: 5, cy: 5 },
  { cx: 12, cy: 5 },
  { cx: 19, cy: 5 },
  { cx: 5, cy: 12 },
  { cx: 12, cy: 12 },
  { cx: 19, cy: 12 },
  { cx: 5, cy: 19 },
  { cx: 12, cy: 19 },
  { cx: 19, cy: 19 },
] as const;

const DOT_RADIUS = 2;
const CLIP = 8;
const TRAVEL = 24;

function dotCircles(svg: SVGSVGElement | null) {
  if (!svg) return [];
  return Array.from(svg.querySelectorAll<SVGCircleElement>("[data-grip-dot]"));
}

function setClosedAtRest(grid: Element | null, x: Element | null) {
  if (grid) gsap.set(grid, { y: 0 });
  if (x) gsap.set(x, { y: TRAVEL });
}

function setOpenAtRest(grid: Element | null, x: Element | null) {
  if (grid) gsap.set(grid, { y: -TRAVEL });
  if (x) gsap.set(x, { y: 0 });
}

function playOpenWipe(grid: Element | null, x: Element | null) {
  const tl = gsap.timeline();
  if (grid) {
    gsap.set(grid, { y: 0 });
    tl.to(grid, { y: -TRAVEL, duration: MENU_ICON_WIPE, ease: EASE_OUT_EXPO }, 0);
  }
  if (x) {
    gsap.set(x, { y: TRAVEL });
    tl.to(x, { y: 0, duration: MENU_ICON_WIPE, ease: EASE_OUT_EXPO }, 0.08);
  }
  return tl;
}

function playCloseWipe(grid: Element | null, x: Element | null) {
  const tl = gsap.timeline();
  if (x) {
    tl.to(x, { y: -TRAVEL, duration: MENU_ICON_WIPE, ease: EASE_OUT_EXPO }, 0);
  }
  if (grid) {
    gsap.set(grid, { y: TRAVEL });
    tl.to(grid, { y: 0, duration: MENU_ICON_WIPE, ease: EASE_OUT_EXPO }, 0.08);
  }
  return tl;
}

export function MobileMenuIcon({
  open,
  className,
  animateLoad = true,
  enableMorph = true,
}: {
  open: boolean;
  className?: string;
  animateLoad?: boolean;
  enableMorph?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<SVGSVGElement>(null);
  const xRef = useRef<SVGSVGElement>(null);
  const uid = useId().replace(/:/g, "");
  const [introDone, setIntroDone] = useState(!animateLoad);
  const swapTl = useRef<gsap.core.Timeline | null>(null);
  const prevOpen = useRef<boolean | null>(null);

  useGSAP(
    () => {
      ensureGsapRegistered();
      const grid = gridRef.current;
      const circles = dotCircles(grid);
      if (!grid || !circles.length) return;

      if (!animateLoad || introDone) return;

      setClosedAtRest(grid, xRef.current);

      if (prefersReducedMotion()) {
        gsap.set(circles, { y: 0, opacity: 1 });
        setIntroDone(true);
        return;
      }

      swapTl.current?.kill();
      const travel = CLIP;
      gsap.set(circles, { y: travel, opacity: 0 });
      gsap.to(circles, {
        y: 0,
        opacity: 1,
        duration: WIPE_DURATION * 0.58,
        ease: EASE_OUT_EXPO,
        stagger: LOAD.menuGrip.dotStagger,
        delay: LOAD.logo + LOAD.menuGrip.start,
        onComplete: () => setIntroDone(true),
      });
    },
    { scope: rootRef, dependencies: [animateLoad, introDone] },
  );

  useGSAP(
    () => {
      if (!introDone) return;

      ensureGsapRegistered();
      const grid = gridRef.current;
      const x = xRef.current;
      if (!grid || !x) return;

      if (prefersReducedMotion()) {
        if (open) setOpenAtRest(grid, x);
        else setClosedAtRest(grid, x);
        return;
      }

      if (!enableMorph) {
        setClosedAtRest(grid, x);
        return;
      }

      if (prevOpen.current === null) {
        prevOpen.current = open;
        swapTl.current?.kill();
        if (open) {
          swapTl.current = playOpenWipe(grid, x);
        } else {
          setClosedAtRest(grid, x);
        }
        return;
      }

      if (prevOpen.current === open) return;
      prevOpen.current = open;

      swapTl.current?.kill();

      if (open) {
        setClosedAtRest(grid, x);
        swapTl.current = playOpenWipe(grid, x);
      } else {
        swapTl.current = playCloseWipe(grid, x);
      }
    },
    {
      scope: rootRef,
      dependencies: [open, enableMorph, introDone],
      revertOnUpdate: false,
    },
  );

  return (
    <div
      ref={rootRef}
      className={cn("relative size-6 overflow-hidden", className)}
      aria-hidden
    >
      <svg
        ref={gridRef}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 size-6 text-current"
        data-menu-grid
      >
        <defs>
          {DOTS.map((d, i) => (
            <clipPath key={i} id={`menu-icon-clip-${uid}-${i}`}>
              <rect
                x={d.cx - CLIP / 2}
                y={d.cy - CLIP / 2}
                width={CLIP}
                height={CLIP}
              />
            </clipPath>
          ))}
        </defs>
        {DOTS.map((d, i) => (
          <g key={i} clipPath={`url(#menu-icon-clip-${uid}-${i})`}>
            <circle
              data-grip-dot
              cx={d.cx}
              cy={d.cy}
              r={DOT_RADIUS}
              style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
            />
          </g>
        ))}
      </svg>

      <svg
        ref={xRef}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 size-6 text-current"
        data-menu-x
      >
        <g data-x-mark>
          <line
            x1={6}
            y1={6}
            x2={18}
            y2={18}
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          />
          <line
            x1={18}
            y1={6}
            x2={6}
            y2={18}
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
