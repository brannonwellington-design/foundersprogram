"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";
import { TESTIMONIALS, type Testimonial } from "@/lib/content";
import { spring, springSnappyOptions } from "@/lib/motion";
import { Reveal } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Figure } from "@/components/ui/Figure";

export function Testimonials() {
  const [active, setActive] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Cursor-following card (desktop only). Springs toward the pointer.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, springSnappyOptions);
  const sy = useSpring(y, springSnappyOptions);

  function handleMove(e: React.MouseEvent) {
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
                onMouseEnter={() => setActive(i)}
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
    <div className="flex items-stretch gap-4 md:hidden">
      <Figure
        src={t.image}
        alt={t.name}
        name={t.name}
        variant="duotone"
        className="h-[176px] flex-1"
      />
      <div
        className="flex flex-1 flex-col justify-center text-center text-[14px] tracking-tight-2"
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
      className="pointer-events-none fixed left-0 top-0 z-30 hidden w-[224px] md:block"
      style={{ x: sx, y: sy, translateX: "24px", translateY: "-50%" }}
      aria-hidden
    >
      <AnimatePresence>
        {t && (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={spring}
            className="flex flex-col gap-4"
          >
            <Figure
              src={t.image}
              alt={t.name}
              name={t.name}
              variant="duotone"
              className="aspect-square w-full"
            />
            <div
              className="flex flex-col text-center text-[14px] tracking-tight-2"
              style={{ lineHeight: "20px" }}
            >
              <span className="text-content-brand">{t.name}</span>
              <span className="text-content-brand-secondary">{t.role}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
