"use client";

import { APPLY } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ApplyButton } from "@/components/ui/ApplyButton";

export function Apply() {
  return (
    <section className="bg-surface-primary px-4 pb-6 pt-6 md:px-6">
      <SectionLabel id="apply" label="Apply" />

      <div className="relative mt-6 min-h-[620px] overflow-hidden md:min-h-[760px]">
        {/* Full-bleed background photo (CSS background — always paints, no JS). */}
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/apply-bg.webp)" }}
        />

        {/* Card: inset 24px; bottom-aligned on mobile (photo shows above),
            full-height left column on desktop (photo shows to the right). */}
        <div className="relative flex min-h-[620px] items-end p-4 md:min-h-[760px] md:items-stretch md:p-6">
          <Reveal
            className="flex w-full max-w-[572px] flex-col self-end md:self-stretch"
            amount={0.2}
          >
            <div className="flex flex-1 flex-col justify-between gap-12 bg-surface-primary p-6">
              <div className="flex flex-col gap-2">
                <h2
                  className="text-content-brand tracking-tight-2"
                  style={{ fontSize: "clamp(1.75rem, 3.4vw, 2.5rem)", lineHeight: 1.2 }}
                >
                  {APPLY.title}
                </h2>
                <p
                  className="text-content-brand-secondary tracking-tight-2"
                  style={{ fontSize: "clamp(1.75rem, 3.4vw, 2.5rem)", lineHeight: 1.2 }}
                >
                  {APPLY.subtitle}
                </p>
              </div>
              <p
                className="text-[18px] text-content-brand tracking-tight-2"
                style={{ lineHeight: "24px" }}
              >
                {APPLY.body}
              </p>
            </div>

            {/* CTA bar */}
            <ApplyButton fill size="lg" label={APPLY.cta} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
