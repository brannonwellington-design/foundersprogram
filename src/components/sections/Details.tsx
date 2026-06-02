"use client";

import { motion } from "motion/react";
import { DETAILS } from "@/lib/content";
import { springSoft } from "@/lib/motion";
import { Reveal } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function Details() {
  return (
    <section
      id="details"
      className="bg-surface-brand-primary px-4 pb-16 pt-6 text-content-brand-contrast md:px-6"
    >
      <SectionLabel label="Details" tone="contrast" />

      <div className="mt-24 flex flex-col gap-18">
        {DETAILS.map((d, i) => (
          <div key={d.n}>
            {i > 0 && <DrawingHairline />}
            <Reveal
              className="flex flex-col gap-6 py-9 md:grid md:grid-cols-2 md:items-start md:gap-6 md:py-0"
              amount={0.4}
            >
              {/* Number + title */}
              <div className="flex items-start gap-[clamp(2rem,5vw,5rem)] text-[clamp(1.5rem,3vw,2rem)] tracking-tight-2" style={{ lineHeight: 1.2 }}>
                <span className="shrink-0 tabular-nums">{d.n}</span>
                <h3 className="flex-1">{d.title}</h3>
              </div>
              {/* Body */}
              <p
                className="text-[18px] tracking-tight-2 md:pt-1"
                style={{ lineHeight: "24px" }}
              >
                {d.body}
              </p>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Full-width hairline that draws from the left as it scrolls in. */
function DrawingHairline() {
  return (
    <div className="relative h-px w-full overflow-hidden">
      <motion.span
        className="absolute inset-0 block origin-left bg-content-brand-contrast"
        style={{ opacity: 0.35 }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 1 }}
        transition={springSoft}
      />
    </div>
  );
}
