"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Image with a graceful, on-brand fallback.
 *
 * Renders the real asset at `src`; if the file isn't present yet it hides the
 * broken image and shows a branded placeholder underneath (initials for people,
 * a label otherwise). The instant the real export is added to /public/images,
 * it appears with no code change.
 *
 * `variant="duotone"` reproduces the design's mentor/testimonial treatment:
 * a brand-blue plate with the photo composited via mix-blend-screen.
 */
export function Figure({
  src,
  alt,
  name,
  variant = "plain",
  className,
  imgClassName,
  objectPosition,
  blendImage = true,
}: {
  src: string;
  alt: string;
  /** Person's name — used to derive initials for the duotone fallback. */
  name?: string;
  variant?: "plain" | "duotone";
  className?: string;
  imgClassName?: string;
  objectPosition?: string;
  /**
   * Whether to apply mix-blend-screen to the loaded image (duotone only).
   * Set false when the source image is already a composited duotone export,
   * so we keep the brand-blue fallback plate but don't blend twice.
   */
  blendImage?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // The image often finishes loading from the SSR HTML before React attaches
  // onLoad, so that event never fires and the image would stay hidden. Check
  // `complete` on mount (and when src changes) to catch that race.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) setLoaded(true);
  }, [src]);

  const initials = name
    ? name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
    : null;

  const isDuotone = variant === "duotone";

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        isDuotone ? "bg-surface-brand-primary" : "bg-surface-secondary",
        className,
      )}
      aria-label={!loaded ? alt : undefined}
      role={!loaded ? "img" : undefined}
    >
      {/* Branded fallback (sits behind the photo; visible until it loads). */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center select-none">
          {isDuotone ? (
            <span
              className="text-content-brand-contrast/70 tracking-tight-2"
              style={{ fontSize: "clamp(28px, 8vw, 56px)" }}
            >
              {initials}
            </span>
          ) : (
            <span className="text-content-secondary text-[14px] tracking-tight-2">
              {alt}
            </span>
          )}
        </div>
      )}

      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            isDuotone && blendImage && "mix-blend-screen",
            loaded ? "opacity-100" : "opacity-0",
            imgClassName,
          )}
          style={objectPosition ? { objectPosition } : undefined}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
}
