"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "motion/react";
import { ArrowRight } from "lucide-react";
import { APPLY_URL } from "@/lib/content";
import { easeOutExpo, maskHoverRise, springSnappy } from "@/lib/motion";
import { cn } from "@/lib/cn";

const LINE = { lineHeight: 1.4 } as const;

/** Parent variant state so masked children inherit rest / hover reliably. */
const heroButtonVariants: Variants = {
  rest: {},
  hover: {
    transition: { staggerChildren: 0.05, delayChildren: 0.03 },
  },
};

/**
 * Primary call to action. Solid brand-blue block, contrast text, and an arrow
 * that springs forward on hover. Always links out to the Ashby posting.
 *
 * `variant="hero"` — desktop pointer hover only: paper fill wipes up behind a
 * hard mask while label and arrow swap contrast → brand blue in sync with the
 * hero copy beside it.
 */
export function ApplyButton({
  label = "Apply Now",
  className,
  size = "md",
  fill = false,
  variant = "default",
  onClick,
}: {
  label?: string;
  className?: string;
  size?: "md" | "lg";
  /** Stretch to fill the container width and space label/arrow apart. */
  fill?: boolean;
  variant?: "default" | "hero";
  onClick?: () => void;
}) {
  const pad = size === "lg" ? "px-6 py-6" : "px-3 py-2";
  const text = size === "lg" ? "text-[20px]" : "text-[20px]";
  const fine = useFinePointer();

  if (variant === "hero") {
    return (
      <motion.a
        href={APPLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        initial="rest"
        animate="rest"
        whileHover={fine ? "hover" : undefined}
        whileTap={fine ? { scale: 0.98 } : undefined}
        variants={heroButtonVariants}
        className={cn(
          "relative inline-flex items-center gap-3 overflow-hidden bg-surface-brand-primary tracking-tight-2",
          fill ? "w-full justify-between" : "justify-center",
          pad,
          text,
          className,
        )}
        style={LINE}
      >
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-surface-primary"
          variants={maskHoverRise}
        />

        <motion.span
          className={cn("relative z-10", text)}
          variants={{
            rest: { color: "var(--content-brand-contrast)" },
            hover: {
              color: "var(--content-brand)",
              transition: { duration: 0.35, delay: 0.08, ease: easeOutExpo },
            },
          }}
        >
          {label}
        </motion.span>

        <motion.span
          className="relative z-10 inline-flex shrink-0"
          variants={{
            rest: { color: "var(--content-brand-contrast)", x: 0 },
            hover: {
              color: "var(--content-brand)",
              x: 5,
              transition: {
                color: { duration: 0.35, delay: 0.1, ease: easeOutExpo },
                x: { ...springSnappy, delay: 0.1 },
              },
            },
          }}
        >
          <ArrowRight size={24} strokeWidth={2} />
        </motion.span>
      </motion.a>
    );
  }

  return (
    <motion.a
      href={APPLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      initial="rest"
      whileHover={fine ? "hover" : undefined}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group inline-flex items-center gap-3 bg-surface-brand-primary text-content-brand-contrast tracking-tight-2",
        fill ? "w-full justify-between" : "justify-center",
        pad,
        text,
        className,
      )}
      style={LINE}
    >
      <span>{label}</span>
      <motion.span
        className="inline-flex shrink-0"
        variants={{ rest: { x: 0 }, hover: { x: 5 } }}
        transition={springSnappy}
      >
        <ArrowRight size={24} strokeWidth={2} />
      </motion.span>
    </motion.a>
  );
}

function useFinePointer() {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return fine;
}
