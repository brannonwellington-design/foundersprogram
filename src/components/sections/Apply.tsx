"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { APPLY } from "@/lib/content";
import { asset } from "@/lib/asset";
import { MaskGroup } from "@/components/motion/MaskGroup";
import { MaskMedia } from "@/components/motion/MaskMedia";
import { MaskText } from "@/components/motion/MaskText";
import { SectionLabel, sectionLabelTop } from "@/components/ui/SectionLabel";
import { ApplyButton } from "@/components/ui/ApplyButton";
import { cn } from "@/lib/cn";

export function Apply() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const panelY = useTransform(scrollYProgress, [0.15, 0.4], ["110%", "0%"]);

  return (
    <section
      ref={sectionRef}
      data-hide-apply-bar
      className={cn("bg-surface-primary px-4 pb-6 md:px-6", sectionLabelTop)}
    >
      <SectionLabel id="apply" label="Apply" />

      <div className="relative -mx-4 mt-6 aspect-square overflow-visible max-md:mb-[76px] md:mx-0 md:mb-0 md:aspect-auto md:min-h-[760px] md:overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${asset("/images/apply-bg.webp")})` }}
        />

        <div className="absolute inset-0 flex items-end px-4 pb-0 md:grid md:grid-cols-12 md:gap-x-6 md:p-6">
          <motion.div
            style={{ y: isMobile ? panelY : undefined }}
            className="w-full min-w-0 max-md:-mb-[76px] md:col-span-5 md:col-start-1 md:self-end"
          >
            <div className="flex w-full min-w-0 flex-col">
              <MaskGroup className="flex w-full min-w-0 flex-col gap-6 bg-surface-primary p-6">
                <MaskText
                  as="h2"
                  mode="words"
                  className="w-full text-[28px] text-content-brand leading-[1.2] tracking-tight-2 md:text-[40px]"
                >
                  {APPLY.heading}
                </MaskText>
                <MaskText
                  as="p"
                  mode="unit"
                  className="w-full text-[16px] text-content-brand leading-[22px] tracking-tight-2 md:text-[24px] md:leading-[1.4]"
                >
                  {APPLY.body}
                </MaskText>
              </MaskGroup>

              <MaskMedia
                releaseClip
                className="w-full"
                innerClassName="block w-full"
              >
                <ApplyButton fill size="lg" label={APPLY.cta} />
              </MaskMedia>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
