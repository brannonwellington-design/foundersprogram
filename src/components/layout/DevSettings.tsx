"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { easeOutExpo } from "@/lib/motion";
import { mountThemeWipeSnapshot } from "@/lib/themeWipeCapture";

type Theme = "light" | "dark";

type DevSettingsContextValue = {
  gridOverlay: boolean;
  setGridOverlay: (value: boolean) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const GRID_STORAGE_KEY = "dev-grid-overlay";
const THEME_STORAGE_KEY = "theme";
const COLUMN_COUNT = 12;
const COLUMN_STAGGER = 0.04;
const THEME_WIPE_DURATION = 0.92;

const DevSettingsContext = createContext<DevSettingsContextValue | null>(null);

export function useDevSettings() {
  const ctx = useContext(DevSettingsContext);
  if (!ctx) {
    throw new Error("useDevSettings must be used within DevSettingsProvider");
  }
  return ctx;
}

export function DevSettingsProvider({ children }: { children: ReactNode }) {
  const [gridOverlay, setGridOverlayState] = useState(false);
  const [theme, setThemeState] = useState<Theme>("light");
  const [themeWipe, setThemeWipe] = useState<{
    from: Theme;
    to: Theme;
    id: number;
  } | null>(null);
  const [mounted, setMounted] = useState(false);
  const wipeId = useRef(0);

  const applyThemeToDom = useCallback((next: Theme) => {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    try {
      if (localStorage.getItem(GRID_STORAGE_KEY) === "true") {
        setGridOverlayState(true);
      }
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      if (stored === "light" || stored === "dark") {
        setThemeState(stored);
        applyThemeToDom(stored);
      } else {
        const current =
          (document.documentElement.getAttribute("data-theme") as Theme) ||
          "light";
        setThemeState(current);
      }
    } catch {
      /* ignore */
    }
  }, [applyThemeToDom]);

  const setGridOverlay = useCallback((value: boolean) => {
    setGridOverlayState(value);
    try {
      localStorage.setItem(GRID_STORAGE_KEY, String(value));
    } catch {
      /* ignore */
    }
  }, []);

  const setTheme = useCallback(
    (next: Theme) => {
      if (next === theme || themeWipe) return;
      const from = theme;
      wipeId.current += 1;
      setThemeState(next);
      setThemeWipe({ from, to: next, id: wipeId.current });
    },
    [theme, themeWipe],
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [setTheme, theme]);

  const onThemeWipeComplete = useCallback(
    (to: Theme) => {
      applyThemeToDom(to);
      setThemeState(to);
      setThemeWipe(null);
    },
    [applyThemeToDom],
  );

  return (
    <DevSettingsContext.Provider
      value={{ gridOverlay, setGridOverlay, theme, setTheme, toggleTheme }}
    >
      {children}
      <AnimatePresence initial={false}>
        {mounted && gridOverlay && <GridOverlay key="grid-overlay" />}
      </AnimatePresence>
      <AnimatePresence>
        {themeWipe && (
          <ThemeWipe
            key={themeWipe.id}
            from={themeWipe.from}
            to={themeWipe.to}
            onComplete={onThemeWipeComplete}
            onApplyTheme={applyThemeToDom}
          />
        )}
      </AnimatePresence>
    </DevSettingsContext.Provider>
  );
}

/** 12-column layout grid aligned to section padding (px-4 / 16px gutters mobile, md:px-6 / gap-x-6). */
function GridOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] grid grid-cols-12 gap-x-4 px-4 md:gap-x-6 md:px-6"
    >
      {Array.from({ length: COLUMN_COUNT }, (_, i) => (
        <motion.div
          key={i}
          className="grid-overlay-column"
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={{
            clipPath: "inset(0 0 0 0)",
            transition: {
              duration: 0.58,
              ease: easeOutExpo,
              delay: i * COLUMN_STAGGER,
            },
          }}
          exit={{
            clipPath: "inset(100% 0 0 0)",
            transition: {
              duration: 0.48,
              ease: easeOutExpo,
              delay: (COLUMN_COUNT - 1 - i) * COLUMN_STAGGER,
            },
          }}
        />
      ))}
    </div>
  );
}

/**
 * Snapshot of the outgoing theme wipes up, revealing the live page underneath
 * which has already switched to the incoming theme.
 */
function ThemeWipe({
  from,
  to,
  onComplete,
  onApplyTheme,
}: {
  from: Theme;
  to: Theme;
  onComplete: (to: Theme) => void;
  onApplyTheme: (theme: Theme) => void;
}) {
  const [shellRef, animate] = useAnimate<HTMLDivElement>();
  const finished = useRef(false);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    finished.current = false;
    shell.style.clipPath = "inset(0 0 0 0)";

    const cleanupSnapshot = mountThemeWipeSnapshot(shell, from);
    onApplyTheme(to);

    const controls = animate(
      shell,
      { clipPath: "inset(0 0 100% 0)" },
      { duration: THEME_WIPE_DURATION, ease: easeOutExpo },
    );

    void controls.then(() => {
      if (finished.current) return;
      finished.current = true;
      onComplete(to);
    });

    return () => {
      finished.current = true;
      controls.stop();
      cleanupSnapshot();
    };
  }, [animate, from, onApplyTheme, onComplete, shellRef, to]);

  return (
    <div
      ref={shellRef}
      data-theme-wipe=""
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
    />
  );
}
