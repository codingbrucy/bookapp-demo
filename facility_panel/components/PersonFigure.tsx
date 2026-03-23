/**
 * Cartoonized person figure SVG — placeholder.
 * Swap this out with a custom SVG by replacing the <svg> contents.
 * Uses `currentColor` so you control color via Tailwind text-* classes.
 */
export default function PersonFigure({
  className = "w-6 h-10",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 40"
      fill="currentColor"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Head */}
      <circle cx="12" cy="6" r="5.5" />
      {/* Body */}
      <rect x="6" y="13" width="12" height="14" rx="3" />
      {/* Left leg */}
      <rect x="7" y="27" width="4" height="11" rx="2" />
      {/* Right leg */}
      <rect x="13" y="27" width="4" height="11" rx="2" />
    </svg>
  );
}
