"use client";

import { Fragment, useEffect, useMemo, useRef } from "react";

type HeroLeadWordsProps = {
  text: string;
};

/**
 * Secondary hero lead copy: each word starts muted and fills to brand blue
 * in sequence as the user scrolls (GSAP ScrollTrigger + scrub).
 * Resets to all-muted when the page is scrolled back to the top.
 */
export function HeroLeadWords({ text }: HeroLeadWordsProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const wordEls = Array.from(
      container.querySelectorAll<HTMLElement>("[data-word]"),
    );
    if (!wordEls.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      wordEls.forEach((el) => {
        el.style.color = "var(--content-brand)";
      });
      return;
    }

    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    (async () => {
      try {
        const { ensureGsapRegistered, gsap, ScrollTrigger } = await import(
          "@/lib/gsap/register"
        );
        if (cancelled) return;

        ensureGsapRegistered();

        ctx = gsap.context(() => {
          const brand = "var(--content-brand)";
          const muted = "var(--content-brand-secondary)";

          const applyProgress = (progress: number) => {
            const filled = Math.min(
              wordEls.length,
              Math.floor(progress * wordEls.length),
            );
            wordEls.forEach((el, i) => {
              el.style.color = i < filled ? brand : muted;
            });
          };

          const scrollTop = () =>
            window.scrollY ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0;

          const resolveProgress = (progress: number) => {
            // At the top of the page, secondary copy stays muted.
            if (scrollTop() < 12) return 0;
            return progress;
          };

          applyProgress(0);

          ScrollTrigger.create({
            trigger: container,
            start: "top 88%",
            end: "top 28%",
            scrub: 0.45,
            onUpdate: (self) =>
              applyProgress(resolveProgress(self.progress)),
            onRefresh: (self) =>
              applyProgress(resolveProgress(self.progress)),
          });
        }, container);
      } catch {
        wordEls.forEach((el) => {
          el.style.removeProperty("color");
        });
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [text]);

  return (
    <span ref={containerRef}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          {i > 0 && " "}
          <span data-word className="inline text-content-brand-secondary">
            {word}
          </span>
        </Fragment>
      ))}
    </span>
  );
}
