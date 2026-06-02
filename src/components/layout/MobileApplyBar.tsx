"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { APPLY_URL, HERO } from "@/lib/content";
import { spring } from "@/lib/motion";

/**
 * Mobile-only sticky Apply bar.
 *
 * Visibility: appears once the hero is scrolled away and hides again when the
 * Apply section (which has its own CTA) and footer come into view.
 *
 * Color: default brand-blue. While it overlaps a `data-nav-invert` section (the
 * blue Details block), a cream copy is revealed by a clip-path wipe tied to the
 * section edge — the same wipe as the sticky nav, but reversed (blue→cream, from
 * the bottom bar), so the CTA stays legible against the blue background.
 */
export function MobileApplyBar() {
  const [show, setShow] = useState(false);
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Always present (including the hero), but hide once the Apply section and
  // footer — which carry their own CTA — come into view.
  useEffect(() => {
    const enders = Array.from(
      document.querySelectorAll<HTMLElement>("[data-hide-apply-bar]"),
    );
    if (!enders.length) {
      setShow(true);
      return;
    }
    const endVisible = new Set<Element>();
    const endObs = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (en.isIntersecting) endVisible.add(en.target);
        else endVisible.delete(en.target);
      }
      setShow(endVisible.size === 0);
    });
    enders.forEach((el) => endObs.observe(el));
    setShow(true);
    return () => endObs.disconnect();
  }, []);

  // Reverse wipe over the blue Details section.
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-nav-invert]"),
    );
    if (!targets.length) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const a = anchorRef.current;
      const overlay = overlayRef.current;
      if (!a || !overlay) return;
      const rect = a.getBoundingClientRect();
      const H = rect.height;
      let top = 0;
      let bottom = 0;
      let found = false;
      for (const el of targets) {
        const r = el.getBoundingClientRect();
        const t = Math.max(rect.top, Math.min(rect.bottom, r.top));
        const b = Math.max(rect.top, Math.min(rect.bottom, r.bottom));
        if (b > t) {
          top = t - rect.top;
          bottom = b - rect.top;
          found = true;
          break;
        }
      }
      overlay.style.clipPath = found
        ? `inset(${top}px 0 ${H - bottom}px 0)`
        : "inset(0 0 100% 0)";
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [show]);

  return (
    <div className="md:hidden">
      <AnimatePresence>
        {show && (
          <motion.a
            ref={anchorRef}
            href={APPLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={spring}
            className="fixed inset-x-0 bottom-0 z-40 block"
          >
            <div className="relative">
              {/* Base: brand-blue with contrast content. */}
              <div className="bg-surface-brand-primary text-content-brand-contrast">
                <BarRow />
              </div>
              {/* Cream overlay, revealed by the clip wipe over blue sections. */}
              <div
                ref={overlayRef}
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-surface-primary text-content-brand"
                style={{ clipPath: "inset(0 0 100% 0)" }}
              >
                <BarRow />
              </div>
            </div>
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
}

function BarRow() {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 tracking-tight-2"
      style={{
        paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))",
        lineHeight: 1.4,
      }}
    >
      <span className="text-[20px]">{HERO.cta}</span>
      <ArrowRight size={24} strokeWidth={2} />
    </div>
  );
}
