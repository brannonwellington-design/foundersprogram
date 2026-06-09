"use client";

import { useRef } from "react";
import { MaskHairline } from "@/components/motion/MaskHairline";
import { MaskText } from "@/components/motion/MaskText";
import { cn } from "@/lib/cn";

/** Section top padding so the label sits 16px (mobile) / 24px (desktop) from the edge. */
export const sectionLabelTop = "pt-4 md:pt-6";

/**
 * Section marker: label, hairline, mirrored label — each wipes in reading
 * order (left → line → right) on scroll.
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
  const containerRef = useRef<HTMLDivElement>(null);
  const color =
    tone === "contrast" ? "text-content-brand-contrast" : "text-content-brand";

  return (
    <div
      ref={containerRef}
      id={id}
      className={cn(
        "flex w-full items-center gap-6 text-[14px] tracking-tight-2 scroll-mt-24",
        color,
        className,
      )}
      style={{ lineHeight: "20px" }}
    >
      <MaskText
        as="span"
        mode="unit"
        tight
        className="shrink-0"
        clipClassName="whitespace-nowrap"
        scrollTriggerRef={containerRef}
        revealDelay={0}
      >
        {label}
      </MaskText>

      <div className="relative h-px min-w-0 flex-1">
        <MaskHairline
          opacity={0.55}
          scrollTriggerRef={containerRef}
          revealDelay={0.12}
        />
      </div>

      <MaskText
        as="span"
        mode="unit"
        tight
        className="shrink-0 text-right"
        clipClassName="whitespace-nowrap"
        scrollTriggerRef={containerRef}
        revealDelay={0.24}
      >
        {label}
      </MaskText>
    </div>
  );
}
