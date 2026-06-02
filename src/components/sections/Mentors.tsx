"use client";

import { motion } from "motion/react";
import { MENTORS, MENTORS_INTRO, type Mentor } from "@/lib/content";
import { springSoft, staggerContainer, OVERSHOOT_SCALE } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Figure } from "@/components/ui/Figure";
import { Magnetic } from "@/components/motion/Magnetic";

export function Mentors() {
  return (
    <section className="bg-surface-primary px-4 pb-24 pt-6 md:px-6">
      <SectionLabel id="mentors" label="Mentors" />

      {/* 12-column grid: intro uses 4 of the left 6 columns (cols 1–4);
          the mentor cards occupy the right 6 columns (cols 7–12). */}
      <div className="mt-24 md:grid md:grid-cols-12 md:gap-x-6">
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="flex flex-col gap-2 md:col-span-4 md:col-start-1 lg:sticky lg:top-24 lg:self-start"
        >
          <motion.h2
            variants={fade}
            transition={springSoft}
            className="text-content-brand tracking-tight-2"
            style={{ fontSize: "clamp(2rem, 3.4vw, 2.5rem)", lineHeight: 1.2 }}
          >
            {MENTORS_INTRO.title}
          </motion.h2>
          <motion.p
            variants={fade}
            transition={springSoft}
            className="text-content-brand-secondary text-[20px] tracking-tight-2"
            style={{ lineHeight: 1.4 }}
          >
            {MENTORS_INTRO.body}
          </motion.p>
        </motion.div>

        <motion.ul
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          className="mt-16 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:col-span-6 md:col-start-7 md:mt-0"
        >
          {MENTORS.map((m) => (
            <MentorCard key={m.name} mentor={m} />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

const fade = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function MentorCard({ mentor }: { mentor: Mentor }) {
  return (
    <motion.li variants={fade} transition={springSoft}>
      <Magnetic factor={0.12}>
        <motion.div
          whileHover={{ scale: OVERSHOOT_SCALE }}
          transition={springSoft}
          className="flex flex-col gap-4"
        >
          <Figure
            src={mentor.image}
            alt={mentor.name}
            name={mentor.name}
            variant="duotone"
            blendImage={false}
            className="aspect-square w-full"
          />
          <div className="flex flex-col gap-2">
            <div
              className="flex flex-col text-[18px] tracking-tight-2"
              style={{ lineHeight: "24px" }}
            >
              <span className="text-content-brand">{mentor.name}</span>
              <span className="text-content-brand-secondary">{mentor.role}</span>
            </div>
            <p
              className="text-[14px] text-content-brand tracking-tight-2"
              style={{ lineHeight: "20px" }}
            >
              {mentor.bio}
            </p>
          </div>
        </motion.div>
      </Magnetic>
    </motion.li>
  );
}
