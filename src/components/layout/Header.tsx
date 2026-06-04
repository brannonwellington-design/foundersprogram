"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/content";
import { maskRise, spring, springSnappy, staggerContainer } from "@/lib/motion";
import { Wordmark } from "@/components/ui/Wordmark";

/**
 * Entrance timeline (seconds) for the nav, sharing the hero's wipe-up mask:
 * the logo rises first, then the links cascade up after it.
 */
const NAV_T = { logo: 0.08, nav: 0.14, navStep: 0.05 };

/**
 * Sticky top navigation (68px on desktop).
 *
 * Color "wipe": a brand-blue copy of the bar sits on top of the default cream
 * bar and is revealed by a clip-path tied to scroll position. As a section
 * marked `data-nav-invert` (the blue Details section) slides up behind the nav,
 * the blue copy is unmasked exactly along the section's edge — so the nav, logo,
 * and links flip color along the same line, like a wipe rather than a fade.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Drive the blue overlay's clip from the position of invert sections.
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-nav-invert]"),
    );
    const overlay = overlayRef.current;
    const header = headerRef.current;
    if (!overlay || !header || !targets.length) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const H = header.getBoundingClientRect().height;
      let top = 0;
      let bottom = 0;
      let found = false;
      for (const el of targets) {
        const r = el.getBoundingClientRect();
        const t = Math.max(0, Math.min(H, r.top));
        const b = Math.max(0, Math.min(H, r.bottom));
        if (b > t) {
          top = t;
          bottom = b;
          found = true;
          break;
        }
      }
      // inset(top right bottom left): reveal only the band of the nav that has
      // a blue section behind it; collapse fully when there's none.
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
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-50">
      <div className="relative">
        {/* Base bar: cream background, brand-colored content. */}
        <div className="bg-surface-primary text-content-brand">
          <Bar onOpen={() => setOpen(true)} open={open} />
        </div>

        {/* Blue overlay: identical bar, revealed by the clip-path wipe. */}
        <div
          ref={overlayRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-surface-brand-primary text-content-brand-contrast"
          style={{ clipPath: "inset(0 0 100% 0)" }}
        >
          <Bar decorative />
        </div>
      </div>

      <AnimatePresence>
        {open && <MobileMenu onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </header>
  );
}

/** The bar row, rendered for both the base and the (decorative) blue overlay. */
function Bar({
  onOpen,
  decorative,
}: {
  onOpen?: () => void;
  open?: boolean;
  decorative?: boolean;
}) {
  // Only the real bar plays the load animation; the decorative blue copy stays
  // at rest (it's revealed later by the scroll-driven color wipe).
  const animate = !decorative;
  return (
    <motion.div
      className="flex h-14 items-center justify-between px-4 md:h-[68px] md:px-6"
      initial={animate ? "hidden" : false}
      animate={animate ? "visible" : false}
    >
      <a
        href={decorative ? undefined : "#top"}
        aria-label={decorative ? undefined : "Listen — home"}
        className="text-current"
        tabIndex={decorative ? -1 : undefined}
      >
        {/* Logo rises up from behind a mask, like the hero title. */}
        <span className="block overflow-hidden">
          <motion.span
            className="block"
            variants={animate ? maskRise : undefined}
            custom={NAV_T.logo}
          >
            <Wordmark ariaLabel={decorative ? undefined : "Listen"} className="h-5 w-auto" />
          </motion.span>
        </span>
      </a>

      {/* Desktop nav */}
      <nav className="hidden items-center gap-8 md:flex">
        {NAV_LINKS.map((link, i) => {
          // External (job posting) links open in a new tab; in-page anchors don't.
          const external = link.href.startsWith("http");
          return (
            <a
              key={link.href}
              href={link.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              tabIndex={decorative ? -1 : undefined}
              className="group relative text-[14px] text-current tracking-tight-2"
              style={{ lineHeight: "20px" }}
            >
              {/* Padding/negative-margin keeps descenders clear of the mask edge. */}
              <span className="inline-block overflow-hidden pb-[0.15em] -mb-[0.15em] align-bottom">
                <motion.span
                  className="inline-block"
                  variants={animate ? maskRise : undefined}
                  custom={NAV_T.nav + i * NAV_T.navStep}
                >
                  {link.label}
                </motion.span>
              </span>
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </a>
          );
        })}
      </nav>

      {/* Mobile control */}
      <button
        type="button"
        aria-label="Open menu"
        aria-hidden={decorative}
        tabIndex={decorative ? -1 : undefined}
        onClick={decorative ? undefined : onOpen}
        className="text-current md:hidden"
      >
        <Menu size={24} strokeWidth={2} />
      </button>
    </motion.div>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-surface-primary text-content-brand md:hidden"
      initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
      animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
      exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
      transition={spring}
    >
      <div className="flex h-14 items-center justify-between px-4">
        <span className="text-content-brand">
          <Wordmark ariaLabel="Listen" className="h-5 w-auto" />
        </span>
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="text-content-brand"
        >
          <X size={24} strokeWidth={2} />
        </button>
      </div>

      <motion.nav
        className="flex flex-1 flex-col justify-center gap-2 px-4"
        variants={staggerContainer(0.07, 0.1)}
        initial="hidden"
        animate="visible"
      >
        {NAV_LINKS.map((link) => {
          // External (job posting) links open in a new tab; in-page anchors don't.
          const external = link.href.startsWith("http");
          return (
            <motion.a
              key={link.href}
              href={link.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              onClick={onClose}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={springSnappy}
              className="text-content-brand tracking-tight-2"
              style={{ fontSize: "clamp(40px, 12vw, 56px)", lineHeight: 1.1 }}
            >
              {link.label}
            </motion.a>
          );
        })}
      </motion.nav>
    </motion.div>
  );
}
