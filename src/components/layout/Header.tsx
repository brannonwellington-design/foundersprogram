"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/content";
import { spring, springSnappy, staggerContainer } from "@/lib/motion";
import { Wordmark } from "@/components/ui/Wordmark";
import { ApplyButton } from "@/components/ui/ApplyButton";
import { cn } from "@/lib/cn";

/**
 * Sticky top navigation. 68px tall on desktop. Inverts to the brand-blue
 * background (with contrast text/logo) while it overlaps a section marked
 * `data-nav-invert` — i.e. the blue Details section — for a seamless transition.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [invert, setInvert] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

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

  // Invert the nav while a `data-nav-invert` section sits behind it.
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-nav-invert]"),
    );
    if (!targets.length) return;

    let raf = 0;
    const check = () => {
      raf = 0;
      const header = headerRef.current;
      const line = header ? header.getBoundingClientRect().height / 2 : 34;
      let on = false;
      for (const el of targets) {
        const r = el.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) {
          on = true;
          break;
        }
      }
      setInvert(on);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    check();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-50 transition-colors duration-500",
        invert
          ? "bg-surface-brand-primary text-content-brand-contrast"
          : "bg-surface-primary text-content-brand",
      )}
    >
      <div className="flex h-14 items-center justify-between px-4 md:h-[68px] md:px-6">
        <a href="#top" aria-label="Listen — home" className="text-current">
          <Wordmark ariaLabel="Listen" className="h-5" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        {/* Mobile control */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="text-current md:hidden"
        >
          <Menu size={24} strokeWidth={2} />
        </button>
      </div>

      <AnimatePresence>
        {open && <MobileMenu onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </header>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="group relative text-[14px] text-current tracking-tight-2"
      style={{ lineHeight: "20px" }}
    >
      {label}
      {/* Underline draws from the left on hover. */}
      <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </a>
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
          <Wordmark ariaLabel="Listen" className="h-5" />
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
        {NAV_LINKS.map((link) => (
          <motion.a
            key={link.href}
            href={link.href}
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
        ))}
      </motion.nav>

      <div className="px-4 pb-8">
        <ApplyButton fill onClick={onClose} />
      </div>
    </motion.div>
  );
}
