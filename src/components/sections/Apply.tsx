"use client";

import { APPLY } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Figure } from "@/components/ui/Figure";
import { ApplyButton } from "@/components/ui/ApplyButton";

export function Apply() {
  return (
    <section className="bg-surface-primary px-4 pb-6 pt-6 md:px-6">
      <SectionLabel id="apply" label="Apply" />

      <div className="relative mt-6 min-h-[640px] overflow-hidden p-4 md:min-h-[760px] md:p-6">
        <Figure
          src="/images/apply-bg.webp"
          alt="A researcher inspecting a sample in a cleanroom"
          className="absolute inset-0 h-full w-full"
          objectPosition="center right"
        />

        <Reveal
          className="relative flex h-full w-full max-w-[572px] flex-col"
          amount={0.2}
        >
          {/* Content card */}
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
    </section>
  );
}
