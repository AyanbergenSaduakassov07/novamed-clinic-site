import { cn } from "@/lib/utils";

/**
 * The eyebrow / title / lead group.
 *
 * Alignment and width are props rather than fixed, because sections on this
 * site deliberately do not share one rhythm: some are centred and narrow,
 * some run left-aligned against a wide grid.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "light",
  className,
  as: As = "h2",
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "text-2xs font-semibold tracking-[0.2em] uppercase",
            tone === "dark" ? "text-mint" : "text-ink-muted",
          )}
        >
          {eyebrow}
        </span>
      )}
      <As
        className={cn(
          "text-xl font-semibold md:text-2xl",
          tone === "dark" ? "text-white" : "text-ink",
        )}
      >
        {title}
      </As>
      {lead && (
        <p
          className={cn(
            "measure text-base",
            align === "center" && "mx-auto",
            tone === "dark" ? "text-white/80" : "text-ink-muted",
          )}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
