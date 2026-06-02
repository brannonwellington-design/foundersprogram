"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Logo } from "@/components/ui/Logo";

/**
 * The closing statement: an oversized "Listen" wordmark that scales and lifts
 * into place as the footer enters the viewport. Scale contrast as the primary
 * compositional tool, per the brand's art direction.
 */
export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.4, 1]);

  return (
    <footer
      ref={ref}
      className="flex min-h-[60vh] items-end overflow-hidden px-4 pb-6 md:px-6"
    >
      <motion.div
        style={{ scale, y, opacity, fontSize: "34vw" }}
        className="w-full origin-bottom-left text-content-brand"
      >
        <Logo label="Listen" className="block w-full leading-[0.8]" />
      </motion.div>
    </footer>
  );
}
