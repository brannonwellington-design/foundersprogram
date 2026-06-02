"use client";

import { motion } from "motion/react";
import { springSoft } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * The repeated section marker from the design: a small label, a hairline that
 * draws across the width on scroll-in, and the same label mirrored on the
 * right. `tone="contrast"` is for use on the brand-blue section.
 */
export function SectionLabel({
  label,
  id,
  tone = "brand",
  className,
}: {
  label: string;
  id?: string;
  tone?: "brand" | "contrast";
  className?: string;
}) {
  const color =
    tone === "contrast" ? "text-content-brand-contrast" : "text-content-brand";

  return (
    <div
      id={id}
      className={cn(
        "flex items-center gap-6 text-[14px] tracking-tight-2 scroll-mt-24",
        color,
        className,
      )}
      style={{ lineHeight: "20px" }}
    >
      <span className="shrink-0 whitespace-nowrap">{label}</span>
      <span className="relative h-px flex-1 overflow-hidden">
        <motion.span
          className="absolute inset-0 block origin-left"
          style={{ backgroundColor: "currentColor", opacity: 0.4 }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={springSoft}
        />
      </span>
      <span className="shrink-0 whitespace-nowrap text-right">{label}</span>
    </div>
  );
}
