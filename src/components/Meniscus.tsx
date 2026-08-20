import { cn } from "@/lib/utils";

/**
 * The site's signature divider.
 *
 * A meniscus is the curve a liquid makes against the wall of its container:
 * surface tension pulls it UP at the edges, so the surface sits high at the
 * sides and low across the middle. That is the shape below, and it is why the
 * page reads as a column of settled fluids rather than stacked boxes.
 *
 * It is deliberately low amplitude (roughly 40 units in a 60-unit box, at a
 * rendered height of 28–48px) and it never animates. Used sparingly, only
 * where one major section hands off to the next.
 *
 * `fill` is the colour of the section BELOW the curve.
 */
export function Meniscus({
  fill = "var(--color-surface)",
  flip = false,
  className,
}: {
  fill?: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none relative h-7 w-full md:h-12", className)}
    >
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className={cn("absolute inset-0 h-full w-full", flip && "rotate-180")}
      >
        <path
          d="M0 0 C90 3 150 40 720 42 C1290 40 1350 3 1440 0 L1440 60 L0 60 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
