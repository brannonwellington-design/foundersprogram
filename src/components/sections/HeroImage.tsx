"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HERO_IMAGES, HERO_IMAGE_FALLBACK } from "@/lib/content";
import { cn } from "@/lib/cn";

/**
 * Interactive hero image. Desktop: cursor X across the page selects the frame.
 * Mobile: tilt left↔right via gyro (HTTPS + permission on iOS), or drag across
 * the image as a fallback (works over local HTTP during dev).
 */
export function HeroImage({ className }: { className?: string }) {
  const count = HERO_IMAGES.length;
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(Math.floor(count / 2));
  const frame = useRef(0);
  const pending = useRef<number | null>(null);
  const ready = useRef(false);
  const decoded = useRef(0);
  const gyroActive = useRef(false);

  const scheduleIndex = useCallback(
    (idx: number) => {
      const clamped = Math.min(count - 1, Math.max(0, idx));
      pending.current = clamped;
      if (!frame.current) {
        frame.current = requestAnimationFrame(() => {
          frame.current = 0;
          if (pending.current !== null) setActive(pending.current);
        });
      }
    },
    [count],
  );

  const onFrameReady = useCallback(() => {
    decoded.current += 1;
    if (decoded.current >= count) ready.current = true;
  }, [count]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      ready.current = true;
    }, 900);
    return () => window.clearTimeout(t);
  }, []);

  // Desktop: cursor X across the page selects the frame.
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    function onMove(e: MouseEvent) {
      if (!ready.current) return;
      const ratio = e.clientX / window.innerWidth;
      scheduleIndex(Math.floor(ratio * count));
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [count, scheduleIndex]);

  // Mobile: horizontal drag on the hero (works without gyro / over HTTP).
  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) return;

    const el = rootRef.current;
    if (!el) return;

    const pickFromTouch = (clientX: number) => {
      if (!ready.current || gyroActive.current) return;
      const { left, width } = el.getBoundingClientRect();
      if (width <= 0) return;
      const ratio = (clientX - left) / width;
      scheduleIndex(Math.floor(ratio * count));
    };

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) pickFromTouch(touch.clientX);
    };

    el.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => el.removeEventListener("touchmove", onTouchMove);
  }, [count, scheduleIndex]);

  // Mobile: tilt left↔right via gyroscope (requires HTTPS on iOS).
  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) return;

    const TILT = 35;
    const onOrient = (e: DeviceOrientationEvent) => {
      if (!ready.current) return;
      const gamma = e.gamma;
      if (gamma == null) return;
      gyroActive.current = true;
      const clamped = Math.max(-TILT, Math.min(TILT, gamma));
      scheduleIndex(Math.round(((clamped + TILT) / (TILT * 2)) * (count - 1)));
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

    if (!window.isSecureContext) {
      // iOS blocks gyro over http://192.168.x.x — touch drag is the fallback.
      return;
    }

    if (typeof DOEvent.requestPermission !== "function") {
      start();
      return () => window.removeEventListener("deviceorientation", onOrient);
    }

    const el = rootRef.current;
    let requested = false;
    const request = () => {
      if (requested) return;
      requested = true;
      DOEvent.requestPermission?.()
        .then((res) => {
          if (res === "granted") start();
        })
        .catch(() => {});
    };

    el?.addEventListener("touchend", request, { passive: true });
    window.addEventListener("touchend", request, { passive: true });

    return () => {
      window.removeEventListener("deviceorientation", onOrient);
      el?.removeEventListener("touchend", request);
      window.removeEventListener("touchend", request);
    };
  }, [count, scheduleIndex]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative touch-pan-y overflow-hidden bg-surface-secondary",
        className,
      )}
    >
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
