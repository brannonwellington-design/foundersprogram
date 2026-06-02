"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { EDGE } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Figure } from "@/components/ui/Figure";

export function Edge() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Two images drift at different rates for depth.
  const yMain = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const ySecondary = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

  return (
    <section className="bg-surface-primary px-4 pb-24 pt-0 md:px-6">
      <SectionLabel id="program" label="The Program" />

      <Reveal className="mx-auto mt-24 flex max-w-[755px] flex-col items-center gap-4 text-center">
        <h2
          className="text-content-brand tracking-tight-2"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.2 }}
        >
          {EDGE.title}
        </h2>
        <p
          className="max-w-[569px] text-content-brand-secondary text-[20px] tracking-tight-2"
          style={{ lineHeight: 1.4 }}
        >
          {EDGE.body}
        </p>
      </Reveal>

      {/* Image composition */}
      <div
        ref={ref}
        className="relative mx-auto mt-16 h-[560px] w-full max-w-[640px] md:h-[640px]"
      >
        <motion.div
          style={{ y: yMain }}
          className="absolute left-1/2 top-0 h-[88%] w-[72%] -translate-x-1/2"
        >
          <Figure
            src="/images/edge-1.png"
            alt="Founders collaborating"
            className="h-full w-full"
          />
        </motion.div>
        <motion.div
          style={{ y: ySecondary }}
          className="absolute right-0 top-[28%] h-[44%] w-[36%] md:right-[4%]"
        >
          <Figure
            src="/images/edge-2.png"
            alt="A founder presenting"
            className="h-full w-full"
          />
        </motion.div>
      </div>
    </section>
  );
}
