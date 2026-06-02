"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sun, Moon } from "lucide-react";
import { springSnappy } from "@/lib/motion";

type Theme = "light" | "dark";

/** Light/dark switch. Persists choice and flips the [data-theme] on <html>. */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current =
      (document.documentElement.getAttribute("data-theme") as Theme) || "light";
    setTheme(current);
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* ignore */
    }
  }

  // Icon size 22 / stroke 1.75 for 20px-class text, per the brand icon table.
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className={className}
      style={{ display: "inline-flex", color: "var(--content-brand)" }}
    >
      <span className="relative block size-[22px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={mounted ? theme : "placeholder"}
            initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
            transition={springSnappy}
            className="absolute inset-0 flex items-center justify-center"
          >
            {theme === "light" ? (
              <Moon size={22} strokeWidth={1.75} />
            ) : (
              <Sun size={22} strokeWidth={1.75} />
            )}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  );
}
