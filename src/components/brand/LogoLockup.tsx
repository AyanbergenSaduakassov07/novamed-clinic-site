import { cn } from "@/lib/utils";
import { LogoMark } from "./LogoMark";
import { BrandTagline } from "./BrandTagline";

/**
 * NOVA + the MED pill.
 *
 * NOTE — the source logo sets NOVA in a slab serif. This renders it in
 * Unbounded, the display face the brief specifies, so the site loads no third
 * font family for a mark that appears on every page. When the vector export
 * arrives it replaces this wholesale and the difference disappears.
 */
function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display inline-flex flex-col items-center leading-none",
        className,
      )}
      aria-hidden="true"
    >
      <span className="text-[1em] font-extrabold tracking-[0.14em]">NOVA</span>
      <span
        className="mt-[0.14em] rounded-[0.28em] border-[0.075em] border-current
                   px-[0.3em] pt-[0.09em] pb-[0.13em] text-[0.62em]
                   font-extrabold tracking-[0.2em]"
      >
        MED
      </span>
    </span>
  );
}

/**
 * `horizontal` — mark beside the wordmark. Nav and compact placements.
 * `stacked`    — the vertical card lockup from the source files.
 *
 * Colour comes from `currentColor`, so set `text-*` on the parent. `ground`
 * must match the surface behind it so the cross reads correctly.
 */
export function LogoLockup({
  variant = "horizontal",
  withTagline = false,
  ground = "transparent",
  className,
  label = "NovaMed",
}: {
  variant?: "horizontal" | "stacked";
  withTagline?: boolean;
  ground?: string;
  className?: string;
  label?: string;
}) {
  if (variant === "horizontal") {
    return (
      <span className={cn("inline-flex items-center gap-2.5", className)}>
        <LogoMark ground={ground} className="h-[1.55em] w-auto shrink-0" />
        <Wordmark className="text-[0.82em]" />
        <span className="sr-only">{label}</span>
      </span>
    );
  }

  return (
    <span className={cn("inline-flex flex-col items-center gap-3", className)}>
      <LogoMark ground={ground} className="h-[2.1em] w-auto" />
      <Wordmark />
      {withTagline && <BrandTagline className="mt-1 h-[2.4em] w-auto" />}
      <span className="sr-only">{label}</span>
    </span>
  );
}
