"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { MobileMenuIcon } from "@/components/ui/MobileMenuIcon";
import { NAV_LINKS } from "@/lib/content";
import { spring, springSnappy, staggerContainer } from "@/lib/motion";
import { MaskText } from "@/components/motion/MaskText";
import { NavWordmark } from "@/components/ui/NavWordmark";
import { Wordmark } from "@/components/ui/Wordmark";
import { SettingsMenu } from "@/components/layout/SettingsMenu";
import { LOAD } from "@/lib/loadSequence";
import { setScrollLocked } from "@/lib/scrollLock";
import { cn } from "@/lib/cn";

type PinnedChrome = {
  top: number;
  bottom: number;
  height: number;
};

export function Header() {
  const [open, setOpen] = useState(false);
  const [pinnedChrome, setPinnedChrome] = useState<PinnedChrome | null>(null);
  const [mounted, setMounted] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    const mobile = window.matchMedia("(max-width: 767px)");
    if (!mobile.matches) return;

    setScrollLocked(open);
    return () => setScrollLocked(false);
  }, [open]);

  const openMenu = () => {
    const rect = chromeRef.current?.getBoundingClientRect();
    setPinnedChrome({
      top: rect?.top ?? 0,
      bottom: rect?.bottom ?? 56,
      height: rect?.height ?? 56,
    });
    setOpen(true);
  };

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) closeMenu();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

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

  const mobileMenuLayer =
    mounted &&
    pinnedChrome &&
    createPortal(
      <>
        <div
          className="fixed left-0 right-0 z-[70] bg-surface-primary text-content-brand md:hidden"
          style={{ top: pinnedChrome.top, height: pinnedChrome.height }}
        >
          <Bar open onClose={closeMenu} inMobilePortal />
        </div>
        <AnimatePresence onExitComplete={() => setPinnedChrome(null)}>
          {open && (
            <MobileMenu
              key="mobile-menu"
              menuTop={pinnedChrome.bottom}
              onClose={closeMenu}
            />
          )}
        </AnimatePresence>
      </>,
      document.body,
    );

  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-[60] md:z-50">
        <div
          ref={chromeRef}
          className={cn(
            "relative z-[62]",
            pinnedChrome && "max-md:invisible max-md:pointer-events-none",
          )}
          aria-hidden={!!pinnedChrome}
        >
          <div className="bg-surface-primary text-content-brand">
            <Bar open={open} onOpen={openMenu} onClose={closeMenu} />
          </div>

          <div
            ref={overlayRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-surface-brand-primary text-content-brand-contrast"
            style={{ clipPath: "inset(0 0 100% 0)" }}
          >
            <Bar decorative />
          </div>
        </div>
      </header>
      {mobileMenuLayer}
    </>
  );
}

function Bar({
  open = false,
  onOpen,
  onClose,
  decorative,
  inMobilePortal = false,
}: {
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  decorative?: boolean;
  /** Portaled chrome — skip grip load intro; morph runs on mount. */
  inMobilePortal?: boolean;
}) {
  const animate = !decorative;

  return (
    <div className="flex h-14 items-center justify-between px-4 md:h-[68px] md:px-6">
      <a
        href={decorative ? undefined : "#top"}
        aria-label={decorative ? undefined : "Listen — home"}
        className="text-current"
        tabIndex={decorative ? -1 : undefined}
      >
        {animate ? (
          <NavWordmark className="h-5 w-auto" />
        ) : (
          <Wordmark ariaLabel={undefined} className="h-5 w-auto" />
        )}
      </a>

      <nav className="hidden items-center gap-8 md:flex">
        {NAV_LINKS.map((link, i) => {
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
              {animate ? (
                <MaskText
                  as="span"
                  mode="unit"
                  reveal="load"
                  revealDelay={LOAD.navDelay(i)}
                >
                  {link.label}
                </MaskText>
              ) : (
                link.label
              )}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </a>
          );
        })}
      </nav>

      <div className="flex items-center gap-4">
        {!decorative && <SettingsMenu visibleOnMobile={open} />}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-hidden={decorative}
          tabIndex={decorative ? -1 : undefined}
          onClick={decorative ? undefined : open ? onClose : onOpen}
          className="flex size-6 shrink-0 items-center justify-center text-current md:hidden"
        >
          <MobileMenuIcon
            open={open}
            className="size-6"
            animateLoad={animate && !inMobilePortal}
            enableMorph={animate}
          />
        </button>
      </div>
    </div>
  );
}

function MobileMenu({
  menuTop,
  onClose,
}: {
  menuTop: number;
  onClose: () => void;
}) {
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="fixed inset-x-0 bottom-0 z-[65] flex touch-none flex-col overscroll-none bg-surface-primary text-content-brand md:hidden"
      style={{ top: menuTop }}
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={spring}
    >
      <motion.nav
        className="flex min-h-0 flex-1 flex-col justify-center px-4"
        variants={staggerContainer(0.06, 0.08)}
        initial="hidden"
        animate="visible"
      >
        {NAV_LINKS.map((link) => {
          const external = link.href.startsWith("http");
          return (
            <motion.a
              key={link.href}
              href={link.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              onClick={onClose}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={springSnappy}
              className="block text-content-brand tracking-tight-2"
              style={{ fontSize: "40px", lineHeight: 1.2 }}
            >
              {link.label}
            </motion.a>
          );
        })}
      </motion.nav>
    </motion.div>
  );
}
