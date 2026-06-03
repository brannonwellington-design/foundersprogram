"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";
import { TESTIMONIALS, type Testimonial } from "@/lib/content";
import { springSnappyOptions, reel } from "@/lib/motion";
import { Reveal } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Figure } from "@/components/ui/Figure";

export function Testimonials() {
  const [active, setActive] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const ready = useRef(false);

  // Cursor-following card (desktop only). Springs toward the pointer.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, springSnappyOptions);
  const sy = useSpring(y, springSnappyOptions);

  function handleMove(e: React.MouseEvent) {
    // The first time we know where the cursor is, snap the spring there so the
    // card never flies in from the top-left corner (0,0).
    if (!ready.current) {
      sx.jump(e.clientX);
      sy.jump(e.clientY);
      ready.current = true;
    }
    x.set(e.clientX);
    y.set(e.clientY);
  }

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      onMouseMove={handleMove}
      className="relative bg-surface-primary px-4 pb-40 pt-6 md:px-6"
    >
      <SectionLabel label="Testimonials" />

      <div className="mx-auto mt-32 flex max-w-[1216px] flex-col gap-32 md:gap-48">
        {TESTIMONIALS.map((t, i) => (
          <div key={t.name} className="flex flex-col gap-6">
            <Reveal>
              <blockquote
                className="cursor-default text-content-brand tracking-tight-2 transition-opacity duration-300"
                style={{
                  fontSize: "clamp(1.5rem, 3.2vw, 2.5rem)",
                  lineHeight: 1.2,
                  // Dim the other quote while one is hovered (desktop).
                  opacity: active === null || active === i ? 1 : 0.35,
                }}
                onMouseEnter={(e) => {
                  handleMove(e); // position the card at the cursor before showing
                  setActive(i);
                }}
                onMouseLeave={() => setActive(null)}
              >
                {t.quote}
              </blockquote>
            </Reveal>

            {/* Mobile: static attribution card under each quote. */}
            <MobileAttribution testimonial={t} />
          </div>
        ))}
      </div>

      {/* Desktop: floating card that follows the cursor over a quote. */}
      <CursorCard active={active} sx={sx} sy={sy} />
    </section>
  );
}

function MobileAttribution({ testimonial: t }: { testimonial: Testimonial }) {
  return (
    // Always shown except on desktop-with-mouse (where the cursor card is used).
    // Gating on `md AND fine` avoids phones that misreport pointer capability.
    <div className="flex items-center gap-4 md:fine:hidden">
      <Figure
        src={t.image}
        alt={t.name}
        name={t.name}
        variant="duotone"
        blendImage={false}
        className="size-[136px] shrink-0"
      />
      <div
        className="flex flex-1 flex-col justify-center text-left text-[14px] tracking-tight-2"
        style={{ lineHeight: "20px" }}
      >
        <span className="text-content-brand">{t.name}</span>
        <span className="text-content-brand-secondary">{t.role}</span>
      </div>
    </div>
  );
}

function CursorCard({
  active,
  sx,
  sy,
}: {
  active: number | null;
  sx: ReturnType<typeof useSpring>;
  sy: ReturnType<typeof useSpring>;
}) {
  const t = active !== null ? TESTIMONIALS[active] : null;
  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-30 hidden w-[224px] flex-col gap-4 md:fine:flex"
      style={{ x: sx, y: sy, translateX: "24px", translateY: "-50%" }}
      aria-hidden
    >
      {/* Photo reel: each opaque duotone plate rolls up into the window from the
          bottom while the previous one rolls out the top. Because the plates
          overlap and never leave a gap, rapid hops between people read as a
          continuous slot-machine roll rather than a blank-then-repopulate. The
          window clips the off-screen frames. */}
      <div className="relative aspect-square w-full overflow-hidden">
        <AnimatePresence>
          {t && (
            <motion.div
              key={t.name}
              className="absolute inset-0"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={reel}
            >
              <Figure
                src={t.image}
                alt={t.name}
                name={t.name}
                variant="duotone"
                blendImage={false}
                className="h-full w-full"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Attribution rolls in lockstep with the photo, clipped to its own
          two-line strip so the names swap on the same reel. */}
      <div className="relative h-10 overflow-hidden">
        <AnimatePresence>
          {t && (
            <motion.div
              key={t.name}
              className="absolute inset-0 flex flex-col text-left text-[14px] tracking-tight-2"
              style={{ lineHeight: "20px" }}
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={reel}
            >
              <span className="text-content-brand">{t.name}</span>
              <span className="text-content-brand-secondary">{t.role}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
