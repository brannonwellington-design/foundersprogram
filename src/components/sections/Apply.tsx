"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { APPLY } from "@/lib/content";
import { asset } from "@/lib/asset";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ApplyButton } from "@/components/ui/ApplyButton";

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
  // The panel drifts up over the background as the section scrolls through.
  const panelY = useTransform(scrollYProgress, [0, 1], [110, -110]);

  return (
    <section
      ref={sectionRef}
      data-hide-apply-bar
      className="bg-surface-primary px-4 pb-6 pt-6 md:px-6"
    >
      <SectionLabel id="apply" label="Apply" />

      {/* Mobile: 1:1 square, full-bleed edge-to-edge (cancel the section's px-4).
          Desktop: inset within the section, 760px tall. */}
      <div className="relative -mx-4 mt-6 aspect-square overflow-hidden md:mx-0 md:aspect-auto md:min-h-[760px]">
        {/* Full-bleed background photo (static). */}
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${asset("/images/apply-bg.webp")})` }}
        />

        {/* Panel fills the image box and bottom-aligns its content; it
            parallaxes up over the photo on mobile, static left column on desktop. */}
        <div className="absolute inset-0 flex items-end p-4 md:p-6">
          <motion.div
            style={{ y: isMobile ? panelY : undefined }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="flex w-full max-w-[572px] flex-col self-end"
          >
            {/* Content-height text card with 24px between heading and body, so
                more of the background image shows above it. */}
            <div className="flex flex-col gap-6 bg-surface-primary p-6">
              <h2
                className="text-content-brand tracking-tight-2 md:text-balance"
                style={{ fontSize: "clamp(2.25rem, 4.8vw, 3.5rem)", lineHeight: 1.15 }}
              >
                {APPLY.heading}
              </h2>
              <p
                className="text-[16px] text-content-brand tracking-tight-2 md:text-[20px]"
                style={{ lineHeight: 1.4 }}
              >
                {APPLY.body}
              </p>
            </div>

            <ApplyButton fill size="lg" label={APPLY.cta} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
