"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  type MotionValue,
} from "motion/react";
import { Play } from "lucide-react";
import { EDGE, LISTENING_DEVICES, PROGRAM_VIDEO } from "@/lib/content";
import { asset } from "@/lib/asset";
import { springSoft } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Figure } from "@/components/ui/Figure";
import { cn } from "@/lib/cn";

export function Edge() {
  const sectionRef = useRef<HTMLElement>(null);

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
      className="relative overflow-hidden bg-surface-primary px-4 pb-24 pt-20 md:px-6 md:pt-16"
    >
      <SectionLabel id="program" label="The Program" />

      {/* Section headline, centered above the video. */}
      <motion.h2
        className="mx-auto mt-16 max-w-[820px] text-balance text-center text-content-brand tracking-tight-2"
        style={{ fontSize: "clamp(2.25rem, 4.6vw, 3.75rem)", lineHeight: 1.05 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={springSoft}
      >
        {EDGE.title}
      </motion.h2>

      {/* Featured video — relative z-10 so it sits above the cursor trail. */}
      <motion.div
        className="relative z-10 mx-auto mt-12 w-full max-w-[720px]"
        initial={{ opacity: 0, scale: 1.02 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={springSoft}
      >
        <VideoEmbed id={PROGRAM_VIDEO.id} caption={PROGRAM_VIDEO.caption} />
      </motion.div>

      {/* Body copy, centered below the video. */}
      <motion.p
        className="mx-auto mt-12 max-w-[640px] text-center text-[20px] text-content-brand tracking-tight-2"
        style={{ lineHeight: 1.4 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={springSoft}
      >
        {EDGE.body}
      </motion.p>

      {/* Closing portrait. The mobile device-scrub anchors to its bottom-left. */}
      <div className="relative mx-auto mt-16 w-full max-w-[472px]">
        <motion.div
          className="relative z-0 aspect-[472/560] w-full"
          initial={{ opacity: 0, scale: 1.03 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={springSoft}
        >
          <Figure
            src={asset("/images/program-center.webp")}
            alt="A founder listening on the phone"
            className="h-full w-full"
          />
        </motion.div>

        {/* Mobile: the rotating device frame, 16px from the image's
            bottom-left corner (z-10). */}
        {fine === false && <DeviceScrub sectionRef={sectionRef} />}
      </div>

      {/* Desktop: cursor image-trail across the whole section. */}
      {fine === true && <DeviceTrail sectionRef={sectionRef} />}
    </section>
  );
}

/**
 * Lite YouTube facade: renders the YouTube poster + play button, and only
 * swaps in the real (autoplaying) iframe on click — so the page never ships
 * the heavy embed until the visitor asks for it. With no `id` set yet, it
 * shows a branded placeholder carrying the caption.
 */
function VideoEmbed({ id, caption }: { id: string; caption: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-surface-brand-primary">
      {playing && id ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
          title="Listen Future Founder Program"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => id && setPlaying(true)}
          aria-label={id ? "Play video" : "Video coming soon"}
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          {id ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`https://img.youtube.com/vi/${id}/maxresdefault.jpg`}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className="absolute inset-x-0 bottom-0 p-6 text-left text-content-brand-contrast text-[clamp(1rem,2vw,1.5rem)] tracking-tight-2">
              {caption}
            </span>
          )}

          {/* Play affordance, centered, with a soft scrim for contrast. */}
          <span className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/0" />
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-surface-primary/90 shadow-lg transition-transform duration-300 group-hover:scale-110">
            <Play className="ml-0.5 h-6 w-6 fill-content-brand text-content-brand" />
          </span>
        </button>
      )}
    </div>
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
    // 16px from the image's bottom-left corner, beneath the headline (z-10).
    <div
      className="pointer-events-none absolute bottom-4 left-4 z-10 w-[36%] max-w-[150px]"
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
