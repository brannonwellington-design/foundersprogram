import { cn } from "@/lib/cn";

/**
 * The real "Listen" wordmark from Figma, rendered as a CSS mask of the exact
 * vector export. Using a mask (rather than an <img>) lets the mark take the
 * current text color — so it stays crisp at any size and can flip between
 * brand and contrast colors (e.g. when the sticky nav inverts over the blue
 * Details section). Aspect ratio is the artwork's native 1464:436.
 */
export function Wordmark({
  className,
  ariaLabel,
}: {
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <span
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={cn("block", className)}
      style={{
        WebkitMaskImage: "url(/images/listen-wordmark.png)",
        maskImage: "url(/images/listen-wordmark.png)",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "left center",
        maskPosition: "left center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        backgroundColor: "currentColor",
        aspectRatio: "1464 / 436",
      }}
    />
  );
}
