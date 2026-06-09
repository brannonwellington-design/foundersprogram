"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Settings } from "lucide-react";
import { EASE_OUT_EXPO } from "@/lib/gsap/eases";
import { prefersReducedMotion } from "@/lib/gsap/reducedMotion";
import { ensureGsapRegistered, gsap } from "@/lib/gsap/register";
import { MENU_ICON_WIPE } from "@/components/ui/MobileMenuIcon";
import { easeOutExpo, springSnappy } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { useDevSettings } from "@/components/layout/DevSettings";

const TRACK_SLIDE = { duration: 0.2, ease: easeOutExpo } as const;

/** Enters just after the menu icon wipe begins. */
const MOBILE_REVEAL_DELAY = 0.1;
const WIPE_TRAVEL = 24;

export function SettingsMenu({
  className,
  visibleOnMobile = false,
}: {
  className?: string;
  /** On mobile, settings is only shown while the nav menu is open. */
  visibleOnMobile?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileMounted, setMobileMounted] = useState(false);
  const gearRef = useRef<HTMLButtonElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const prevVisibleMobile = useRef(false);
  const [anchor, setAnchor] = useState({ top: 0, right: 0 });
  const { gridOverlay, setGridOverlay, theme, setTheme } = useDevSettings();

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    const mobile = window.matchMedia("(max-width: 767px)");
    if (!mobile.matches) return;

    const inner = wipeRef.current;
    if (!inner) return;

    ensureGsapRegistered();

    const entering = visibleOnMobile && !prevVisibleMobile.current;
    const exiting = !visibleOnMobile && prevVisibleMobile.current;

    gsap.killTweensOf(inner);

    if (visibleOnMobile) {
      setMobileMounted(true);

      if (prefersReducedMotion() || !entering) {
        gsap.set(inner, { y: 0 });
      } else {
        gsap.fromTo(
          inner,
          { y: WIPE_TRAVEL },
          {
            y: 0,
            duration: MENU_ICON_WIPE,
            ease: EASE_OUT_EXPO,
            delay: MOBILE_REVEAL_DELAY,
          },
        );
      }

      prevVisibleMobile.current = true;
      return;
    }

    if (exiting) {
      if (prefersReducedMotion()) {
        gsap.set(inner, { y: 0 });
        setMobileMounted(false);
      } else {
        gsap.to(inner, {
          y: -WIPE_TRAVEL,
          duration: MENU_ICON_WIPE * 0.75,
          ease: EASE_OUT_EXPO,
          onComplete: () => {
            gsap.set(inner, { y: WIPE_TRAVEL });
            setMobileMounted(false);
          },
        });
      }

      prevVisibleMobile.current = false;
    }
  }, [visibleOnMobile]);

  useLayoutEffect(() => {
    if (!open || !gearRef.current) return;

    const update = () => {
      const rect = gearRef.current!.getBoundingClientRect();
      setAnchor({
        top: rect.bottom + 10,
        right: window.innerWidth - rect.right,
      });
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (gearRef.current?.contains(target)) return;
      setOpen(false);
    }

    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const popover =
    mounted &&
    createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            key="settings-popover"
            ref={rootRef}
            role="dialog"
            aria-label="Settings"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={springSnappy}
            style={{ top: anchor.top, right: anchor.right }}
            className="fixed z-[10001] w-[min(280px,calc(100vw-2rem))] rounded-lg border border-content-brand/15 bg-surface-secondary p-4 text-content-brand shadow-[0_12px_40px_color-mix(in_srgb,var(--content-primary)_12%,transparent)]"
          >
            <p className="mb-3 text-[12px] tracking-tight-2 text-content-secondary">
              Display
            </p>
            <MotionConfig reducedMotion="never">
              <ul className="flex flex-col gap-3">
                <li>
                  <SettingToggle
                    label="Dark mode"
                    checked={theme === "dark"}
                    onChange={(checked) =>
                      setTheme(checked ? "dark" : "light")
                    }
                  />
                </li>
                <li>
                  <SettingToggle
                    label="12-column grid"
                    checked={gridOverlay}
                    onChange={setGridOverlay}
                  />
                </li>
              </ul>
            </MotionConfig>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
    );

  const showOnMobile = visibleOnMobile || mobileMounted;

  return (
    <div
      className={cn(
        "relative size-6 shrink-0 overflow-hidden text-current max-md:overflow-hidden",
        !showOnMobile && "max-md:hidden",
        className,
      )}
    >
      <button
        ref={gearRef}
        type="button"
        aria-label="Settings"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
        className="relative z-[10001] flex size-6 items-center justify-center text-current"
      >
        <div
          ref={wipeRef}
          className="flex size-6 items-center justify-center text-current will-change-transform"
        >
          <Settings
            className="size-5 text-current"
            strokeWidth={2}
            aria-hidden
          />
        </div>
      </button>
      {popover}
    </div>
  );
}

function SettingToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 text-[14px] tracking-tight-2">
      <span>{label}</span>
      <motion.button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className="relative h-5 w-9 shrink-0 rounded-full"
        initial={false}
        animate={{
          backgroundColor: checked
            ? "var(--content-brand)"
            : "var(--surface-tertiary)",
        }}
        transition={TRACK_SLIDE}
      >
        <motion.span
          className="absolute top-0.5 left-0.5 block size-4 rounded-full bg-surface-primary"
          initial={false}
          animate={{ x: checked ? 16 : 0 }}
          transition={springSnappy}
        />
      </motion.button>
    </label>
  );
}
