import { cn } from "@/lib/cn";

/** 24×24 "L" in a circle — program section mark from the Figma artboards. */
export function ListenMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-content-brand bg-surface-primary text-[14px] text-content-brand tracking-tight-2",
        className,
      )}
      style={{ lineHeight: "20px" }}
      aria-hidden
    >
      L
    </span>
  );
}
