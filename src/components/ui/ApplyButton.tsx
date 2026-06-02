"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { APPLY_URL } from "@/lib/content";
import { springSnappy } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Primary call to action. Solid brand-blue block, contrast text, and an arrow
 * that springs forward on hover. Always links out to the Ashby posting.
 */
export function ApplyButton({
  label = "Apply Now",
  className,
  size = "md",
  fill = false,
  onClick,
}: {
  label?: string;
  className?: string;
  size?: "md" | "lg";
  /** Stretch to fill the container width and space label/arrow apart. */
  fill?: boolean;
  onClick?: () => void;
}) {
  const pad = size === "lg" ? "px-6 py-6" : "px-3 py-2";
  const text = size === "lg" ? "text-[20px]" : "text-[20px]";

  return (
    <motion.a
      href={APPLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group inline-flex items-center gap-3 bg-surface-brand-primary text-content-brand-contrast tracking-tight-2",
        fill ? "w-full justify-between" : "justify-center",
        pad,
        text,
        className,
      )}
      style={{ lineHeight: 1.4 }}
    >
      <span>{label}</span>
      <motion.span
        className="inline-flex shrink-0"
        variants={{ rest: { x: 0 }, hover: { x: 5 } }}
        transition={springSnappy}
      >
        {/* 24px text class → 24px icon, 2px stroke (brand icon table). */}
        <ArrowRight size={24} strokeWidth={2} />
      </motion.span>
    </motion.a>
  );
}
