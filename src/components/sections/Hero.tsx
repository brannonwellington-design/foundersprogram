"use client";

import { motion } from "motion/react";
import { HERO } from "@/lib/content";
import { spring, springSoft, staggerContainer } from "@/lib/motion";
import { Marquee } from "@/components/layout/Marquee";
import { Header } from "@/components/layout/Header";
import { ApplyButton } from "@/components/ui/ApplyButton";
import { Figure } from "@/components/ui/Figure";

const lineUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col overflow-hidden bg-surface-primary"
    >
      <Marquee />
      <Header />

      <div className="relative flex flex-1 flex-col px-4 pb-4 pt-24 md:px-6 md:pb-6 md:pt-28">
        {/*
          Source order is the mobile order: title → image → lead.
          On desktop the grid repositions them: title top-left, lead bottom-left,
          image spanning the full-height right column.
        */}
        <div className="flex flex-1 flex-col gap-8 md:grid md:grid-cols-2 md:grid-rows-[auto_1fr] md:gap-x-6 md:gap-y-0">
          {/* Title + pill */}
          <motion.div
            variants={staggerContainer(0.12, 0.05)}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start gap-6 md:col-start-1 md:row-start-1 md:self-start"
          >
            <motion.h1
              variants={lineUp}
              transition={springSoft}
              className="max-w-[12ch] text-content-brand tracking-tight-2"
              style={{ fontSize: "clamp(2.5rem, 6.4vw, 5.5rem)", lineHeight: 1.05 }}
            >
              {HERO.title}
            </motion.h1>

            <motion.span
              variants={lineUp}
              transition={springSoft}
              className="inline-flex items-center rounded-[40px] border border-content-brand px-[10px] py-1 text-[14px] text-content-brand tracking-tight-2"
              style={{ lineHeight: "20px" }}
            >
              {HERO.pill}
            </motion.span>
          </motion.div>

          {/* Hero image with the floating "This could be you" mark */}
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...springSoft, delay: 0.15 }}
            className="relative min-h-[320px] flex-1 md:col-start-2 md:row-span-2 md:row-start-1 md:min-h-0 md:self-stretch"
          >
            <Figure
              src="/images/hero-portrait.png"
              alt="A founder at work"
              className="absolute inset-0 h-full w-full"
              objectPosition="center 20%"
            />
            <FloatingMark />
          </motion.div>

          {/* Lead + desktop CTA (pinned to the bottom of the left column) */}
          <motion.div
            variants={staggerContainer(0.1, 0.25)}
            initial="hidden"
            animate="visible"
            className="flex max-w-[472px] flex-col gap-6 md:col-start-1 md:row-start-2 md:self-end"
          >
            <motion.p
              variants={lineUp}
              transition={springSoft}
              className="text-[24px] tracking-tight-2"
              style={{ lineHeight: 1.4 }}
            >
              <span className="text-content-brand">{HERO.leadPrimary}</span>{" "}
              <span className="text-content-brand-secondary">{HERO.leadSecondary}</span>
            </motion.p>

            <motion.div variants={lineUp} transition={spring} className="hidden md:block">
              <ApplyButton />
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile-only inline CTA; also the sentinel for the sticky bar. */}
        <div id="hero-cta-sentinel" className="mt-8 md:hidden">
          <ApplyButton fill />
        </div>
      </div>
    </section>
  );
}

/** The red "This could be you" disc, gently drifting. */
function FloatingMark() {
  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-1/2 flex items-center justify-center rounded-full"
      style={{
        width: "min(40%, 252px)",
        aspectRatio: "1 / 1",
        backgroundColor: "var(--hero-accent)",
        x: "-50%",
        y: "-50%",
      }}
      animate={{ y: ["-52%", "-48%", "-52%"], x: "-50%" }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <span
        className="px-4 text-center text-[16px] md:text-[18px]"
        style={{ color: "var(--content-inverse-primary)", lineHeight: 1.3 }}
      >
        {HERO.circle}
      </span>
    </motion.div>
  );
}
