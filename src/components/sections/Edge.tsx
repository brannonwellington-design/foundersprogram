"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { EDGE, LISTENING_DEVICES } from "@/lib/content";
import { springSoft } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Figure } from "@/components/ui/Figure";
import { cn } from "@/lib/cn";

export function Edge() {
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll parallax for the oversized headline.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headlineY = useTransform(scrollYProgress, [0, 1], [70, -70]);

  // Desktop (fine pointer) gets the cursor trail; touch gets the scroll scrub.
  const [fine, setFine] = useState<boolean | null>(null);
  useEffect(() => {
    setFine(window.matchMedia("(pointer: fine)").matches);
    // Preload all device photos so neither mode flickers.
    LISTENING_DEVICES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-surface-primary px-4 pb-24 pt-20 md:px-6 md:pt-0"
    >
      <SectionLabel id="program" label="The Program" />

      {/* Body copy — constrained to the central image's width, centered. */}
      <motion.p
        className="mx-auto mt-16 max-w-[472px] text-center text-[20px] text-content-brand tracking-tight-2"
        style={{ lineHeight: 1.4 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={springSoft}
      >
        {EDGE.body}
      </motion.p>

      {/* Central image with the oversized headline overlapping in front. */}
      <div className="relative mx-auto mt-12 w-full max-w-[472px]">
        <motion.div
          className="relative z-0 aspect-[472/560] w-full"
          initial={{ opacity: 0, scale: 1.03 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={springSoft}
        >
          <Figure
            src="/images/program-center.webp"
            alt="A founder listening on the phone"
            className="h-full w-full"
          />
        </motion.div>

        {/* Oversized headline, centered over the image, overlapping in front.
            Mobile: 3 lines (wraps within the image width). Desktop: one line,
            edge-to-edge. Inner element carries the scroll parallax (kept off the
            positioning wrapper to avoid transform conflicts). */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 md:left-1/2 md:right-auto md:w-screen md:-translate-x-1/2">
          <motion.h2
            className="text-center text-[clamp(3.25rem,24vw,7rem)] leading-[0.92] text-content-brand tracking-tight-2 md:whitespace-nowrap md:text-[clamp(2.5rem,10.2vw,12rem)] md:leading-none"
            style={{ y: headlineY }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={springSoft}
          >
            {EDGE.title}
          </motion.h2>
        </div>

        {/* Mobile: the rotating device frame, tucked lower-left of the image. */}
        {fine === false && <DeviceScrub sectionRef={sectionRef} />}
      </div>

      {/* Desktop: cursor image-trail across the whole section. */}
      {fine === true && <DeviceTrail sectionRef={sectionRef} />}
    </section>
  );
}

type TrailItem = { id: number; src: string; x: number; y: number };

/** Desktop: device photos spawn at the cursor and fade out as you move. */
function DeviceTrail({
  sectionRef,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  const [items, setItems] = useState<TrailItem[]>([]);
  const id = useRef(0);
  const imgIdx = useRef(0);
  const last = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const l = last.current;
      const dist = l ? Math.hypot(x - l.x, y - l.y) : Infinity;
      if (dist < 90) return; // spawn cadence by distance moved
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

/** Mobile: a device photo frame cycles through all 13 as the section scrolls. */
function DeviceScrub({
  sectionRef,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const sp = scrollYProgress as MotionValue<number>;
    return sp.on("change", (v) => {
      const i = Math.min(
        LISTENING_DEVICES.length - 1,
        Math.max(0, Math.floor(v * LISTENING_DEVICES.length)),
      );
      setIdx(i);
    });
  }, [scrollYProgress]);

  return (
    // Positioned relative to the central image: tucked lower-left so it doesn't
    // fight the centered headline or the portrait.
    <div
      className="pointer-events-none absolute bottom-[6%] left-[4%] z-20 w-[36%] max-w-[150px]"
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
