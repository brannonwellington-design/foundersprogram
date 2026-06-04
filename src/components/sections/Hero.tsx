"use client";

import { motion } from "motion/react";
import { HERO } from "@/lib/content";
import { easeOutExpo, maskRise } from "@/lib/motion";
import { ApplyButton } from "@/components/ui/ApplyButton";
import { HeroImage } from "@/components/sections/HeroImage";

/**
 * One shared entrance timeline (seconds). Everything is choreographed off
 * these so the hero loads as a single composed sequence rather than a set of
 * independent fades. Every element — pill, title words, image, lead, CTA —
 * uses the same wipe-up mask (rising from behind a hard edge), so the whole
 * landing reveals as one coordinated cascade rather than a mix of effects.
 */
const T = {
  image: 0.05,
  pill: 0.2,
  title: 0.32,
  titleStep: 0.08,
  lead: 0.66,
  button: 0.78,
};

/** Title split into rising word-masks; "Founder Program" stays on one line. */
const TITLE_WORDS = ["Listen", "Future", "Founder Program"];

export function Hero() {
  return (
    <section
      id="top"
      // Fill the viewport below the sticky marquee (~22px) + nav (~68px).
      className="relative flex min-h-[calc(100svh-90px)] flex-col overflow-hidden bg-surface-primary"
    >
      {/* No top padding: the hero content starts immediately under the nav. */}
      <div className="relative flex flex-1 flex-col px-4 pb-4 md:px-6 md:pb-6">
        {/*
          Source order is the mobile order: title → image → lead.
          On desktop the grid repositions them: title top-left, lead bottom-left,
          image spanning the full-height right column.
        */}
        <div className="flex flex-1 flex-col gap-4 md:grid md:grid-cols-2 md:grid-rows-[auto_1fr] md:gap-x-6 md:gap-y-0">
          {/* Pill (desktop only, above the title) + title.
              `animate="visible"` propagates the named state down to the masked
              word-spans; each one carries its own staggered delay via `custom`. */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start gap-4 pt-6 md:col-start-1 md:row-start-1 md:self-start md:pt-8"
          >
            {/* Pill rises up from behind a mask, like the title words. */}
            <span className="hidden overflow-hidden md:inline-block">
              <motion.span
                variants={maskRise}
                custom={T.pill}
                className="inline-flex items-center rounded-[40px] border border-content-brand px-[10px] py-1 text-[14px] text-content-brand tracking-tight-2"
                style={{ lineHeight: "20px" }}
              >
                {HERO.pill}
              </motion.span>
            </span>

            <h1
              className="max-w-none text-content-brand tracking-tight-2"
              style={{ fontSize: "clamp(2.5rem, 5.6vw, 5.5rem)", lineHeight: 1.05 }}
            >
              {TITLE_WORDS.map((word, i) => (
                // Static clip; the inner span slides up from behind its edge.
                // The padding/negative-margin pair keeps descenders (g, p) from
                // being shaved by overflow-hidden without altering layout.
                <span
                  key={word}
                  className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom"
                  style={{ marginRight: i < TITLE_WORDS.length - 1 ? "0.25em" : 0 }}
                >
                  <motion.span
                    className="inline-block"
                    variants={maskRise}
                    custom={T.title + i * T.titleStep}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h1>
          </motion.div>

          {/* Interactive hero image — stays in place while a bottom-up mask
              reveals it on load, rather than the whole frame sliding in. */}
          <div className="relative h-[52vh] w-full overflow-hidden md:col-start-2 md:row-span-2 md:row-start-1 md:h-auto md:self-stretch">
            <motion.div
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0 0 0 0)" }}
              transition={{ duration: 1.0, ease: easeOutExpo, delay: T.image }}
              className="absolute inset-0"
            >
              <HeroImage className="absolute inset-0 h-full w-full" />
            </motion.div>
          </div>

          {/* Lead + desktop CTA (pinned to the bottom of the left column). */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="flex max-w-[472px] flex-col gap-6 pb-2 md:col-start-1 md:row-start-2 md:self-end md:pb-0"
          >
            {/* Whole paragraph rises as one block from behind a mask. */}
            <div className="overflow-hidden pb-[0.12em] -mb-[0.12em]">
              <motion.p
                variants={maskRise}
                custom={T.lead}
                className="text-[24px] tracking-tight-2"
                style={{ lineHeight: 1.4 }}
              >
                <span className="text-content-brand">{HERO.leadPrimary}</span>{" "}
                <span className="text-content-brand-secondary">{HERO.leadSecondary}</span>
              </motion.p>
            </div>

            <div className="hidden overflow-hidden md:block">
              <motion.div variants={maskRise} custom={T.button} className="inline-block">
                <ApplyButton />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
