"use client";

import { Fragment } from "react";
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

      {/*
        Rows and hairlines are equal siblings in one column with a single gap,
        so every hairline sits exactly halfway between two text blocks.
      */}
      <div className="mt-24 flex flex-col gap-18">
        {DETAILS.map((d, i) => (
          <Fragment key={d.n}>
            {i > 0 && <DrawingHairline />}
            <Reveal
              className="md:grid md:grid-cols-2 md:items-start md:gap-6"
              amount={0.4}
            >
              {/* Number + title: stacked on mobile, inline on desktop (per Figma). */}
              <div
                className="flex flex-col gap-2 text-[clamp(1.5rem,3vw,2rem)] tracking-tight-2 md:flex-row md:items-baseline md:gap-[clamp(2rem,5vw,5rem)]"
                style={{ lineHeight: 1.2 }}
              >
                <span className="shrink-0 tabular-nums">{d.n}</span>
                <h3 className="flex-1">{d.title}</h3>
              </div>
              {/* Body: below on mobile, second column on desktop. */}
              <p
                className="mt-6 text-[18px] tracking-tight-2 md:mt-0 md:pt-1"
                style={{ lineHeight: "24px" }}
              >
                {d.body}
              </p>
            </Reveal>
          </Fragment>
        ))}
      </div>
    </section>
  );
}

/** Full-width hairline that draws from the left as it scrolls in. */
function DrawingHairline() {
  return (
    <div className="relative h-px w-full">
      <motion.div
        className="absolute inset-0 origin-left bg-content-brand-contrast"
        style={{ opacity: 0.4 }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={springSoft}
      />
    </div>
  );
}
