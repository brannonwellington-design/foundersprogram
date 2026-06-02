"use client";

import { useEffect, useRef, useState } from "react";
import { HERO_IMAGES, HERO_IMAGE_FALLBACK } from "@/lib/content";
import { cn } from "@/lib/cn";

/**
 * Interactive hero image. The cursor's horizontal position across the page
 * selects which of the nine images is shown (far-left → first, far-right →
 * ninth), with a quick cross-fade between them. This makes the whole page feel
 * responsive to the visitor as they move left↔right.
 *
 * - No-pointer / touch devices show a default frame (no hover to track).
 * - Any missing image falls back to the default portrait, so it never breaks.
 * - Honors prefers-reduced-motion (the cross-fade transition is removed in CSS).
 */
export function HeroImage({ className }: { className?: string }) {
  const count = HERO_IMAGES.length;
  const [active, setActive] = useState(Math.floor(count / 2));
  const frame = useRef<number>(0);
  const pending = useRef<number | null>(null);

  useEffect(() => {
    // Only track a real (fine) pointer.
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer) return;

    function onMove(e: MouseEvent) {
      const ratio = e.clientX / window.innerWidth;
      const idx = Math.min(count - 1, Math.max(0, Math.floor(ratio * count)));
      pending.current = idx;
      if (!frame.current) {
        frame.current = requestAnimationFrame(() => {
          frame.current = 0;
          if (pending.current !== null) setActive(pending.current);
        });
      }
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [count]);

  return (
    <div className={cn("relative overflow-hidden bg-surface-secondary", className)}>
      {HERO_IMAGES.map((src, i) => (
        <HeroFrame key={src} src={src} alt="" active={i === active} priority={i === active} />
      ))}
      <span className="sr-only">Listen — future founders</span>
    </div>
  );
}

function HeroFrame({
  src,
  alt,
  active,
  priority,
}: {
  src: string;
  alt: string;
  active: boolean;
  priority: boolean;
}) {
  const [resolvedSrc, setResolvedSrc] = useState(src);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolvedSrc}
      alt={alt}
      aria-hidden={!active}
      onError={() => {
        if (resolvedSrc !== HERO_IMAGE_FALLBACK) setResolvedSrc(HERO_IMAGE_FALLBACK);
      }}
      className={cn(
        // Hard cut between frames (no fade) for a crisp, responsive feel.
        "absolute inset-0 h-full w-full object-cover",
        active ? "opacity-100" : "opacity-0",
      )}
      style={{ objectPosition: "center" }}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
    />
  );
}
