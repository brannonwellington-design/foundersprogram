"use client";

import { MENTORS, MENTORS_INTRO, type Mentor } from "@/lib/content";
import { grid12, gridLeft, gridRight } from "@/lib/grid";
import { cn } from "@/lib/cn";
import { MaskGroup } from "@/components/motion/MaskGroup";
import { MaskMedia } from "@/components/motion/MaskMedia";
import { MaskText } from "@/components/motion/MaskText";
import { SectionLabel, sectionLabelTop } from "@/components/ui/SectionLabel";
import { Figure } from "@/components/ui/Figure";

export function Mentors() {
  return (
    <section className={cn("bg-surface-primary px-4 pb-24 md:px-6", sectionLabelTop)}>
      <SectionLabel id="mentors" label="Mentors" />

      <div className={cn("mt-24", grid12)}>
        <MaskGroup
          className={cn(
            "flex flex-col gap-2 lg:sticky lg:top-24 lg:self-start",
            gridLeft,
          )}
        >
          <MaskText
            as="h2"
            mode="words"
            className="text-content-brand tracking-tight-2 md:text-balance"
            style={{ fontSize: "clamp(2rem, 3.4vw, 2.5rem)", lineHeight: 1.2 }}
          >
            {MENTORS_INTRO.title}
          </MaskText>
          <MaskText
            as="p"
            mode="lines"
            className="text-content-brand-secondary text-[20px] tracking-tight-2"
            style={{ lineHeight: 1.4 }}
          >
            {MENTORS_INTRO.body}
          </MaskText>
        </MaskGroup>

        <ul
          className={cn(
            "mt-16 grid w-full grid-cols-12 gap-x-4 gap-y-12 md:mt-0 md:grid-cols-2 md:gap-x-6",
            gridRight,
          )}
        >
          {MENTORS.map((m) => (
            <MentorCard key={m.name} mentor={m} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function MentorCard({ mentor }: { mentor: Mentor }) {
  return (
    <li className="col-span-8 min-w-0 odd:col-start-1 even:col-start-5 md:col-span-1 md:col-start-auto">
      <MaskGroup className="group flex flex-col gap-4">
        <MaskMedia>
          <Figure
            src={mentor.image}
            alt={mentor.name}
            name={mentor.name}
            variant="duotone"
            blendImage={false}
            className="aspect-square w-full"
            imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
          />
        </MaskMedia>
        <div className="flex flex-col gap-2">
          <div
            className="flex flex-col text-[18px] tracking-tight-2"
            style={{ lineHeight: "24px" }}
          >
            <MaskText as="span" mode="unit" tight className="text-content-brand">
              {mentor.name}
            </MaskText>
            <MaskText
              as="span"
              mode="unit"
              tight
              className="text-content-brand-secondary"
            >
              {mentor.role}
            </MaskText>
          </div>
          <MaskText
            as="p"
            mode="lines"
            className="text-[14px] text-content-brand tracking-tight-2"
            style={{ lineHeight: "20px" }}
          >
            {mentor.bio}
          </MaskText>
        </div>
      </MaskGroup>
    </li>
  );
}
