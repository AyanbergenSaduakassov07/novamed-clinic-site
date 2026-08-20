import { cn } from "@/lib/utils";

/**
 * PLACEHOLDER — KDL Olymp's wordmark, set typographically.
 * Replace with their official logo asset once the client supplies one they
 * have permission to use. A partner's mark should not be redrawn by hand.
 */
export function OlympLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center gap-2 leading-none", className)}
      data-placeholder="olymp-logo"
    >
      <span className="rounded-[0.3em] border-2 border-current px-[0.34em] py-[0.2em] text-[0.66em] font-extrabold tracking-[0.14em]">
        KDL
      </span>
      <span className="font-display text-[1em] font-semibold tracking-[0.02em]">
        Olymp
      </span>
    </span>
  );
}
