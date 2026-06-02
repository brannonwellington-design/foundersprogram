"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Image with a graceful, on-brand fallback.
 *
 * The real image is always rendered at full opacity with the fallback sitting
 * *behind* it — so whenever the image has data it simply covers the fallback,
 * with no JS load-event gating (which previously caused images to occasionally
 * stay hidden when they loaded from the SSR HTML before React hydrated). If the
 * image 404s, onError reveals the fallback.
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
  /** Apply mix-blend-screen to the image (duotone only, raw photos). */
  blendImage?: boolean;
}) {
  const [failed, setFailed] = useState(false);

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
    >
      {/* Branded fallback — sits behind the photo and shows through until the
          image paints (or permanently if it fails to load). */}
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

      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover",
            isDuotone && blendImage && "mix-blend-screen",
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
