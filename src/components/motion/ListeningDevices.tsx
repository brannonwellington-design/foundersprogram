"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  type MotionValue,
} from "motion/react";
import { LISTENING_DEVICES } from "@/lib/content";
import { cn } from "@/lib/cn";

const DEVICE_W = 96;
const DEVICE_ASPECT = 1062 / 800;
const DEVICE_H = DEVICE_W * DEVICE_ASPECT;
const DEVICE_INSET_RIGHT = 16;
const DEVICE_INSET_TOP = 16;
const DEVICE_GAP_ABOVE_BAR = 16;
/** Full image cycles across one pass through the Details section. */
const DEVICE_SCRUB_ROTATIONS = 2;

function getPinSlot() {
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const bar = document.querySelector<HTMLElement>("[data-mobile-apply-bar]");
  const barTop = bar?.getBoundingClientRect().top ?? vh;

  return {
    left: vw - DEVICE_W - DEVICE_INSET_RIGHT,
    top: barTop - DEVICE_H - DEVICE_GAP_ABOVE_BAR,
  };
}

type TrailItem = { id: number; src: string; x: number; y: number };

/** Desktop: listening-device photos trail the cursor through the section. */
export function DeviceTrail({
  sectionRef,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  const [items, setItems] = useState<TrailItem[]>([]);
  const id = useRef(0);
  const imgIdx = useRef(0);
  const last = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    LISTENING_DEVICES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const l = last.current;
      const dist = l ? Math.hypot(x - l.x, y - l.y) : Infinity;
      if (dist < 90) return;
      last.current = { x, y };

      const src = LISTENING_DEVICES[imgIdx.current % LISTENING_DEVICES.length];
      imgIdx.current += 1;
      const itemId = id.current++;
      setItems((prev) => [...prev.slice(-7), { id: itemId, src, x, y }]);
      window.setTimeout(
        () => setItems((prev) => prev.filter((it) => it.id !== itemId)),
        700,
      );
    }

    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [sectionRef]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden>
      <AnimatePresence>
        {items.map((it) => (
          <motion.img
            key={it.id}
            src={it.src}
            alt=""
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute w-[clamp(108px,11vw,168px)] -translate-x-1/2 -translate-y-1/2 object-cover"
            style={{ left: it.x, top: it.y, aspectRatio: "800 / 1062" }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * Mobile: starts at the section top-right, pins to the viewport bottom-right
 * (16px above the sticky Apply bar), then hides when section 3 scrolls away.
 */
export function DeviceScrub({
  sectionRef,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  const elRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const [idx, setIdx] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    LISTENING_DEVICES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const sp = scrollYProgress as MotionValue<number>;
    return sp.on("change", (v) => {
      const frame = Math.floor(
        v * LISTENING_DEVICES.length * DEVICE_SCRUB_ROTATIONS,
      );
      setIdx(frame % LISTENING_DEVICES.length);
    });
  }, [scrollYProgress]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    function updatePosition() {
      const el = elRef.current;
      if (!el) return;

      const rect = section!.getBoundingClientRect();
      const vh = window.innerHeight;
      const { left: pinLeft, top: pinTop } = getPinSlot();

      const sectionActive =
        rect.bottom > 0 &&
        rect.top < vh &&
        rect.bottom >= pinTop + DEVICE_H;

      if (!sectionActive) {
        el.style.visibility = "hidden";
        return;
      }

      el.style.visibility = "visible";

      const startLeft = rect.right - DEVICE_W - DEVICE_INSET_RIGHT;
      const startTop = rect.top + DEVICE_INSET_TOP;

      const enterTop = vh;
      const travelDenom = enterTop - pinTop;
      const travelProgress =
        travelDenom <= 0
          ? 1
          : Math.min(1, Math.max(0, (enterTop - rect.top) / travelDenom));

      let left: number;
      let top: number;

      if (travelProgress >= 1) {
        left = pinLeft;
        top = pinTop;
      } else {
        left = startLeft + (pinLeft - startLeft) * travelProgress;
        top = startTop + (pinTop - startTop) * travelProgress;
      }

      el.style.transform = `translate3d(${Math.round(left)}px,${Math.round(top)}px,0)`;
    }

    function onScroll() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updatePosition);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    updatePosition();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [sectionRef]);

  return (
    <div
      ref={elRef}
      className="pointer-events-none fixed left-0 top-0 z-10 w-24 will-change-transform md:hidden"
      style={{ visibility: "hidden" }}
      aria-hidden
    >
      <div className="relative aspect-[800/1062] w-full">
        {LISTENING_DEVICES.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt=""
            className={cn(
              "absolute inset-0 h-full w-full object-cover",
              i === idx ? "opacity-100" : "opacity-0",
            )}
            loading="eager"
            decoding="async"
          />
        ))}
      </div>
    </div>
  );
}
