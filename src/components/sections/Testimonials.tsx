"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";
import { TESTIMONIALS, type Testimonial } from "@/lib/content";
import { grid12, gridWide } from "@/lib/grid";
import { cn } from "@/lib/cn";
import { springSnappyOptions, reel } from "@/lib/motion";
import { MaskGroup } from "@/components/motion/MaskGroup";
import { MaskMedia } from "@/components/motion/MaskMedia";
import { MaskText } from "@/components/motion/MaskText";
import { SectionLabel, sectionLabelTop } from "@/components/ui/SectionLabel";
import { Figure } from "@/components/ui/Figure";

export function Testimonials() {
  const [active, setActive] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const ready = useRef(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, springSnappyOptions);
  const sy = useSpring(y, springSnappyOptions);

  function handleMove(e: React.MouseEvent) {
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
      className={cn("relative bg-surface-primary px-4 pb-40 md:px-6", sectionLabelTop)}
    >
      <SectionLabel label="Testimonials" />

      <div className={cn("mt-32 flex flex-col gap-32 md:gap-48", grid12)}>
        {TESTIMONIALS.map((t, i) => (
          <div key={t.name} className={cn("flex flex-col gap-6", gridWide)}>
            <div
              onMouseEnter={(e) => {
                handleMove(e);
                setActive(i);
              }}
              onMouseLeave={() => setActive(null)}
            >
              <MaskText
                as="blockquote"
                mode="words"
                className="m-0 cursor-default border-0 text-content-brand tracking-tight-2 transition-opacity duration-300"
                style={{
                  fontSize: "clamp(1.5rem, 3.2vw, 2.5rem)",
                  lineHeight: 1.2,
                  opacity: active === null || active === i ? 1 : 0.35,
                }}
              >
                {t.quote}
              </MaskText>
            </div>

            <MobileAttribution testimonial={t} />
          </div>
        ))}
      </div>

      <CursorCard active={active} sx={sx} sy={sy} />
    </section>
  );
}

function MobileAttribution({ testimonial: t }: { testimonial: Testimonial }) {
  return (
    <MaskGroup className="grid w-full grid-cols-12 gap-x-4 md:fine:hidden">
      <MaskMedia className="col-span-4 min-w-0">
        <Figure
          src={t.image}
          alt={t.name}
          name={t.name}
          variant="duotone"
          blendImage={false}
          className="aspect-square w-full"
        />
      </MaskMedia>
      <div
        className="col-span-8 col-start-5 flex min-w-0 flex-col justify-center text-left text-[14px] tracking-tight-2"
        style={{ lineHeight: "20px" }}
      >
        <MaskText as="span" mode="unit" className="text-content-brand">
          {t.name}
        </MaskText>
        <MaskText as="span" mode="unit" className="text-content-brand-secondary">
          {t.role}
        </MaskText>
      </div>
    </MaskGroup>
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
