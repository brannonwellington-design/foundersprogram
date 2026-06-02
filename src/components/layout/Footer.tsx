"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Wordmark } from "@/components/ui/Wordmark";

/**
 * The closing statement: the "Listen" wordmark as a true inline SVG vector,
 * stretched to full width and locked 24px from the left, right, and bottom.
 * It scales and lifts into place as the footer enters the viewport.
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
    <footer ref={ref} className="px-6 pb-6 pt-[12vh] text-content-brand">
      <motion.div style={{ scale, y, opacity }} className="origin-bottom-left">
        <Wordmark ariaLabel="Listen" className="w-full" />
      </motion.div>
    </footer>
  );
}
