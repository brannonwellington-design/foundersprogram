"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { springOptions, MAGNETIC_FACTOR } from "@/lib/motion";

/**
 * Wraps content so it drifts toward the cursor while hovered and springs
 * back on leave — the magnetic pattern from the awwwards-motion skill.
 * Used on the mentor cards and primary buttons.
 */
export function Magnetic({
  children,
  className,
  factor = MAGNETIC_FACTOR,
}: {
  children: React.ReactNode;
  className?: string;
  factor?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, springOptions);
  const sy = useSpring(y, springOptions);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * factor);
    y.set((e.clientY - cy) * factor);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  );
}
