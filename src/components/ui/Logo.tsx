/**
 * "Listen" wordmark, recreated as text in Inter so it stays crisp at any size
 * and inherits the active brand color through `currentColor`. Used small in the
 * header and very large in the footer.
 *
 * NOTE: if you later drop in the official Listen logo SVG, swap the <span> for
 * the SVG and this component's two call-sites keep working unchanged.
 */
export function Logo({
  className,
  label = "Listen",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span
      className={className}
      style={{
        fontFamily: "var(--font-inter), sans-serif",
        fontWeight: 400,
        letterSpacing: "-0.03em",
        lineHeight: 1,
        display: "inline-block",
      }}
    >
      {label}
    </span>
  );
}
