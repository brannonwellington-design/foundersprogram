"use client";

import { Fragment } from "react";
import { motion } from "motion/react";
import { DETAILS, DETAILS_HEADLINE, type Detail } from "@/lib/content";
import { springSoft } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/SectionLabel";

const rise = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

/** Reveals on scroll-in with a staggered delay (seconds). */
function casc(delay: number) {
  return {
    variants: rise,
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: { once: true, amount: 0.5 },
    transition: { ...springSoft, delay },
  };
}

export function Details() {
  return (
    <section
      id="details"
      data-nav-invert
      // `relative z-10 -mt-[60vh]` pulls this section up over the Edge section's
      // matching overlap spacer so its opaque blue background scrolls across the
      // still-pinned Program headline (which sits at z-0 inside Edge).
      className="relative z-10 -mt-[60vh] bg-surface-brand-primary px-4 pb-16 pt-6 text-content-brand-contrast md:px-6"
    >
      <SectionLabel label="Details" tone="contrast" />

      {/* Centered section headline, introduced above the numbered rows. */}
      <motion.h2
        className="mx-auto mt-20 max-w-[820px] text-center tracking-tight-2"
        style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 1.05 }}
        variants={rise}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        transition={springSoft}
      >
        {DETAILS_HEADLINE}
      </motion.h2>

      {/*
        Rows and hairlines are equal siblings in one column with a single gap,
        so every hairline sits exactly halfway between two text blocks.
      */}
      <div className="mt-20 flex flex-col gap-18">
        {DETAILS.map((d, i) => (
          <Fragment key={d.n}>
            {i > 0 && <DrawingHairline />}
            <DetailRow d={d} />
          </Fragment>
        ))}
      </div>
    </section>
  );
}

/** A detail row whose number, title, and body cascade in one at a time. */
function DetailRow({ d }: { d: Detail }) {
  return (
    <div className="md:grid md:grid-cols-2 md:items-start md:gap-6">
      {/* Number + title: stacked on mobile, inline on desktop (per Figma). */}
      <div
        className="flex flex-col gap-2 text-[clamp(1.5rem,3vw,2rem)] tracking-tight-2 md:flex-row md:items-baseline md:gap-[clamp(2rem,5vw,5rem)]"
        style={{ lineHeight: 1.2 }}
      >
        <motion.span className="shrink-0 tabular-nums" {...casc(0)}>
          {d.n}
        </motion.span>
        <motion.h3 className="flex-1" {...casc(0.1)}>
          {d.title}
        </motion.h3>
      </div>
      {/* Body: below on mobile, second column on desktop. */}
      <motion.p
        className="mt-6 text-[18px] tracking-tight-2 md:mt-0 md:pt-1"
        style={{ lineHeight: "24px" }}
        {...casc(0.2)}
      >
        {d.body}
      </motion.p>
    </div>
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
