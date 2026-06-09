"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { DETAILS, DETAILS_HEADLINE, type Detail } from "@/lib/content";
import {
  grid12,
  gridCenter8,
  gridCol1,
  gridLeft,
  gridRight,
  gridSpan12,
} from "@/lib/grid";
import {
  DeviceScrub,
  DeviceTrail,
} from "@/components/motion/ListeningDevices";
import { MaskHairline } from "@/components/motion/MaskHairline";
import { MaskText } from "@/components/motion/MaskText";
import { SectionLabel, sectionLabelTop } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/cn";

const ROW_TYPE =
  "text-[32px] tracking-tight-2 md:text-[clamp(1.5rem,3vw,2rem)]";

export function Details() {
  const sectionRef = useRef<HTMLElement>(null);
  const [fine, setFine] = useState<boolean | null>(null);

  useEffect(() => {
    setFine(window.matchMedia("(pointer: fine)").matches);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="details"
      data-nav-invert
      className={cn(
        "relative isolate overflow-hidden bg-surface-brand-primary px-4 pb-24 text-content-brand-contrast md:px-6 md:pb-32",
        sectionLabelTop,
      )}
    >
      <SectionLabel label="Details" tone="contrast" />

      <div className={cn(grid12)}>
        <MaskText
          as="h2"
          mode="words"
          className={cn(
            "mt-16 mb-12 text-center text-[32px] tracking-tight-2 md:mt-24 md:mb-12 md:text-[clamp(2.5rem,5vw,4rem)]",
            gridCenter8,
          )}
          style={{ lineHeight: 1.2 }}
        >
          {DETAILS_HEADLINE}
        </MaskText>

        <div
          className={cn(
            "relative mt-18 flex flex-col gap-18",
            gridSpan12,
            "md:mt-16",
          )}
        >
          {DETAILS.map((d, i) => (
            <Fragment key={d.n}>
              {i > 0 && <MaskHairline opacity={0.4} />}
              <DetailRow d={d} />
            </Fragment>
          ))}
        </div>
      </div>

      {fine === false && <DeviceScrub sectionRef={sectionRef} />}
      {fine === true && <DeviceTrail sectionRef={sectionRef} />}
    </section>
  );
}

function DetailRow({ d }: { d: Detail }) {
  return (
    <div className={cn("flex flex-col gap-6", grid12, "md:items-start")}>
      <div className={cn("flex flex-col gap-2", ROW_TYPE, "md:contents")}>
        <MaskText
          as="span"
          mode="unit"
          className={cn("shrink-0 tabular-nums", gridCol1)}
          style={{ lineHeight: 1.2 }}
        >
          {d.n}
        </MaskText>
        <MaskText
          as="h3"
          mode="words"
          className={cn(gridLeft)}
          style={{ lineHeight: 1.2 }}
        >
          {d.title}
        </MaskText>
      </div>

      <MaskText
        as="p"
        mode="lines"
        className={cn(
          "text-[18px] tracking-tight-2 md:pt-1",
          gridRight,
        )}
        style={{ lineHeight: "24px" }}
      >
        {d.body}
      </MaskText>
    </div>
  );
}
