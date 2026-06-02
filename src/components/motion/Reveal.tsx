"use client";

import { motion, type Variants } from "motion/react";
import { revealVariants } from "@/lib/motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Delay before this element starts revealing (seconds). */
  delay?: number;
  /** Override the default rise+fade variants. */
  variants?: Variants;
  as?: "div" | "section" | "li" | "span";
  amount?: number;
};

/**
 * Reveals its children once on scroll-in with a springy rise + fade.
 * Used across sections so entrances feel consistent and intentional.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  variants = revealVariants,
  as = "div",
  amount = 0.3,
}: RevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}
