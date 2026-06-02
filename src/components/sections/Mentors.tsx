"use client";

import { motion } from "motion/react";
import { MENTORS, MENTORS_INTRO, type Mentor } from "@/lib/content";
import { springSoft } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Figure } from "@/components/ui/Figure";

const rise = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

/** Reveals on scroll-in with a staggered delay (seconds). */
function casc(delay: number) {
  return {
    variants: rise,
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: { once: true, amount: 0.4 },
    transition: { ...springSoft, delay },
  };
}

export function Mentors() {
  return (
    <section className="bg-surface-primary px-4 pb-24 pt-6 md:px-6">
      <SectionLabel id="mentors" label="Mentors" />

      {/* 12-column grid: intro uses 4 of the left 6 columns (cols 1–4);
          the mentor cards occupy the right 6 columns (cols 7–12). */}
      <div className="mt-24 md:grid md:grid-cols-12 md:gap-x-6">
        <div className="flex flex-col gap-2 md:col-span-4 md:col-start-2 lg:sticky lg:top-24 lg:self-start">
          <motion.h2
            className="text-content-brand tracking-tight-2"
            style={{ fontSize: "clamp(2rem, 3.4vw, 2.5rem)", lineHeight: 1.2 }}
            {...casc(0)}
          >
            {MENTORS_INTRO.title}
          </motion.h2>
          <motion.p
            className="text-content-brand-secondary text-[20px] tracking-tight-2"
            style={{ lineHeight: 1.4 }}
            {...casc(0.1)}
          >
            {MENTORS_INTRO.body}
          </motion.p>
        </div>

        <ul className="mt-16 grid grid-cols-12 gap-y-12 md:col-span-6 md:col-start-7 md:mt-0 md:grid-cols-2 md:gap-x-6">
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
    <li
      // Mobile only: each card spans 8/12 columns and alternates left/right for a
      // staggered staircase (per Figma). At md+ it returns to the even 2-col grid.
      className="max-md:col-span-8 max-md:[&:nth-child(even)]:col-start-5"
    >
      {/* Hover: a graceful zoom of the photo within its frame — nothing else
          moves. */}
      <div className="group flex flex-col gap-4">
        <motion.div {...casc(0)}>
          <Figure
            src={mentor.image}
            alt={mentor.name}
            name={mentor.name}
            variant="duotone"
            blendImage={false}
            className="aspect-square w-full"
            imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
          />
        </motion.div>
        <div className="flex flex-col gap-2">
          <motion.div
            className="flex flex-col text-[18px] tracking-tight-2"
            style={{ lineHeight: "24px" }}
            {...casc(0.1)}
          >
            <span className="text-content-brand">{mentor.name}</span>
            <span className="text-content-brand-secondary">{mentor.role}</span>
          </motion.div>
          <motion.p
            className="text-[14px] text-content-brand tracking-tight-2"
            style={{ lineHeight: "20px" }}
            {...casc(0.2)}
          >
            {mentor.bio}
          </motion.p>
        </div>
      </div>
    </li>
  );
}
