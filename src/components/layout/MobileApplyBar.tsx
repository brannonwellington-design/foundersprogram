"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { APPLY_URL, HERO } from "@/lib/content";
import { spring } from "@/lib/motion";

/**
 * Mobile-only sticky Apply bar pinned to the bottom of the viewport.
 * Hidden while the in-hero Apply button is still on screen, then slides up
 * once the user scrolls past it so the CTA is always one tap away.
 */
export function MobileApplyBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("hero-cta-sentinel");
    if (!sentinel) {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting),
      { rootMargin: "0px 0px -40% 0px" },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  return (
    <div className="md:hidden">
      <AnimatePresence>
        {show && (
          <motion.a
            href={APPLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={spring}
            className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between bg-surface-brand-primary px-4 py-3 text-content-brand-contrast tracking-tight-2"
            style={{
              paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))",
              lineHeight: 1.4,
            }}
          >
            <span className="text-[20px]">{HERO.cta}</span>
            <ArrowRight size={24} strokeWidth={2} />
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
}
