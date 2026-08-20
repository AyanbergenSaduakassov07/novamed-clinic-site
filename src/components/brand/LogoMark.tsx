import { cn } from "@/lib/utils";

/** Shared between both hands; the right hand is the same path mirrored. */
const HAND =
  "M18 102 L18 45.5 A5.5 5.5 0 0 1 29 45.5 L29 68 A1.5 1.5 0 0 0 32 68 " +
  "L32 31.5 A5.5 5.5 0 0 1 43 31.5 L43 66 A1.5 1.5 0 0 0 46 66 " +
  "L46 35.5 A5.5 5.5 0 0 1 57 35.5 L57 68 A1.5 1.5 0 0 0 60 68 " +
  "L60 51.5 A5.5 5.5 0 0 1 71 51.5 L71 92 C80 92 84 98 84 106 " +
  "C84 112 78 116 70 116 L34 116 A16 16 0 0 1 18 100 Z";

const CROSS =
  "M92 76 L108 76 L108 88 L120 88 L120 104 L108 104 L108 116 " +
  "L92 116 L92 104 L80 104 L80 88 L92 88 Z";

/**
 * The NovaMed icon: two open hands cupping a medical cross.
 *
 * Redrawn from the client's logo cards. Every element is a STROKED path with
 * no fill on the hands, which is what lets <Loader /> draw the mark in with
 * stroke-dashoffset. Keep it that way if you swap the artwork.
 *
 * ─── PLACEHOLDER ──────────────────────────────────────────────────────────
 * Replace with the vector export from the source logo file when it arrives.
 * Preserve the viewBox and the `data-mark-path` attributes and the loader
 * keeps working untouched. Nothing else in the app reads the geometry.
 * ──────────────────────────────────────────────────────────────────────────
 *
 * `ground` fills the cross so it occludes the thumbs behind it, the way the
 * original lockup does. Pass the colour the mark is sitting on.
 */
export function LogoMark({
  className,
  ground = "transparent",
  strokeWidth = 6.5,
}: {
  className?: string;
  ground?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 200 150"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("block", className)}
    >
      <g
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path data-mark-path="hand-left" transform="rotate(-5 46 116)" d={HAND} />
        <path
          data-mark-path="hand-right"
          transform="matrix(-1 0 0 1 200 0) rotate(-5 46 116)"
          d={HAND}
        />
        <path data-mark-path="cross" fill={ground} d={CROSS} />
      </g>
    </svg>
  );
}
