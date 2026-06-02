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

      <div className="mt-24 flex flex-col gap-16 lg:grid lg:grid-cols-[472px_1fr] lg:gap-[clamp(3rem,9vw,9.25rem)]">
        {/* Intro — sticks while the grid scrolls past on large screens. */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="flex flex-col gap-2 lg:sticky lg:top-24 lg:self-start"
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

        {/* Cards */}
        <motion.ul
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-2 gap-x-6 gap-y-12"
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
