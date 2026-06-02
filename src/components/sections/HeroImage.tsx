"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HERO_IMAGES, HERO_IMAGE_FALLBACK } from "@/lib/content";
import { cn } from "@/lib/cn";

/**
 * Interactive hero image. The cursor's horizontal position across the page
 * selects which image is shown (far-left → first, far-right → last), with a
 * hard cut between them. On touch devices, tilting the phone left↔right does
 * the same via the gyroscope.
 *
 * Every frame is loaded AND decoded up front; interaction is gated until all
 * are decode-ready, so switching is instant and never flickers a blank/partly
 * decoded image during a transition.
 */
export function HeroImage({ className }: { className?: string }) {
  const count = HERO_IMAGES.length;
  const [active, setActive] = useState(Math.floor(count / 2));
  const frame = useRef<number>(0);
  const pending = useRef<number | null>(null);
  const ready = useRef(false);
  const decoded = useRef(0);

  const onFrameReady = useCallback(() => {
    decoded.current += 1;
    if (decoded.current >= count) ready.current = true;
  }, [count]);

  // Desktop: cursor X across the page selects the frame.
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    function onMove(e: MouseEvent) {
      if (!ready.current) return;
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

  // Touch devices: tilt the phone left↔right (gyroscope).
  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) return;

    const TILT = 35; // degrees of tilt mapped across all frames
    const onOrient = (e: DeviceOrientationEvent) => {
      if (!ready.current) return;
      const gamma = e.gamma;
      if (gamma == null) return;
      const clamped = Math.max(-TILT, Math.min(TILT, gamma));
      const idx = Math.round(((clamped + TILT) / (TILT * 2)) * (count - 1));
      pending.current = idx;
      if (!frame.current) {
        frame.current = requestAnimationFrame(() => {
          frame.current = 0;
          if (pending.current !== null) setActive(pending.current);
        });
      }
    };

    const start = () => window.addEventListener("deviceorientation", onOrient);

    type DOE = typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<"granted" | "denied">;
    };
    const DOEvent =
      typeof DeviceOrientationEvent !== "undefined"
        ? (DeviceOrientationEvent as DOE)
        : undefined;
    if (!DOEvent) return;

    let grant: (() => void) | undefined;
    if (typeof DOEvent.requestPermission === "function") {
      // iOS requires a user gesture before motion access; grant on the first
      // interaction of any kind.
      const events: (keyof WindowEventMap)[] = [
        "touchend",
        "pointerdown",
        "click",
      ];
      grant = () => {
        DOEvent.requestPermission?.()
          .then((res) => res === "granted" && start())
          .catch(() => {});
        events.forEach((ev) => window.removeEventListener(ev, grant!));
      };
      events.forEach((ev) =>
        window.addEventListener(ev, grant!, { once: true, passive: true }),
      );
    } else {
      // Android etc.: no permission needed.
      start();
    }

    return () => {
      window.removeEventListener("deviceorientation", onOrient);
      if (grant) {
        (["touchend", "pointerdown", "click"] as (keyof WindowEventMap)[]).forEach(
          (ev) => window.removeEventListener(ev, grant!),
        );
      }
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [count]);

  return (
    <div className={cn("relative overflow-hidden bg-surface-secondary", className)}>
      {HERO_IMAGES.map((src, i) => (
        <HeroFrame
          key={src}
          src={src}
          active={i === active}
          priority={i === active}
          onReady={onFrameReady}
        />
      ))}
      <span className="sr-only">Listen — future founders</span>
    </div>
  );
}

function HeroFrame({
  src,
  active,
  priority,
  onReady,
}: {
  src: string;
  active: boolean;
  priority: boolean;
  onReady: () => void;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const [resolvedSrc, setResolvedSrc] = useState(src);

  // Force a full decode up front so the first paint of this frame (when it
  // becomes active) doesn't flicker.
  useEffect(() => {
    const img = ref.current;
    if (!img) return;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      onReady();
    };
    const decode = () => img.decode().then(finish).catch(finish);
    if (img.complete && img.naturalWidth > 0) {
      decode();
    } else {
      img.addEventListener("load", decode, { once: true });
      img.addEventListener("error", finish, { once: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={resolvedSrc}
      alt=""
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
      loading="eager"
      fetchPriority={priority ? "high" : "low"}
      decoding="async"
      draggable={false}
    />
  );
}
