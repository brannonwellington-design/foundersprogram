"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

/**
 * The closing statement: the exact "Listen" wordmark from Figma, stretched to
 * full width and locked 24px from the left, right, and bottom edges. It scales
 * and lifts into place as the footer enters the viewport.
 */
export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0.3, 1]);

  return (
    <footer ref={ref} className="px-6 pb-6 pt-[12vh]">
      <motion.img
        src="/images/listen-wordmark.png"
        alt="Listen"
        style={{ scale, y, opacity }}
        className="block w-full origin-bottom-left select-none"
        // Native aspect ratio (1464 × 436) keeps height correct at any width.
        width={1464}
        height={436}
        draggable={false}
      />
    </footer>
  );
}
