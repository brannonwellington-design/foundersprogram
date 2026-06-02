"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/content";
import { spring, springSnappy, staggerContainer } from "@/lib/motion";
import { Logo } from "@/components/ui/Logo";
import { ApplyButton } from "@/components/ui/ApplyButton";

/**
 * Sticky top navigation. 68px tall on desktop. Stays pinned to the top of the
 * viewport on scroll (on both desktop and mobile). The hamburger opens a
 * full-screen menu on mobile.
 */
export function Header() {
  const [open, setOpen] = useState(false);

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

  return (
    <header className="sticky top-0 z-50 bg-surface-primary">
      <div className="flex h-14 items-center justify-between px-4 md:h-[68px] md:px-6">
        <a href="#top" aria-label="Listen — home" className="text-content-brand">
          <Logo className="text-[18px]" />
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
          className="text-content-brand md:hidden"
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
      className="group relative text-[14px] text-content-brand tracking-tight-2"
      style={{ lineHeight: "20px" }}
    >
      {label}
      {/* Underline draws from the left on hover. */}
      <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-content-brand transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </a>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-surface-primary md:hidden"
      initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
      animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
      exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
      transition={spring}
    >
      <div className="flex h-14 items-center justify-between px-4">
        <span className="text-[18px] text-content-brand">
          <Logo />
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
