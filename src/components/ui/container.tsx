import { cn } from "@/lib/utils";

/**
 * Three widths, used deliberately. Sections alternate between them so the page
 * does not settle into one repeated column.
 *   wide   — pillar grids, galleries, the hero
 *   normal — most content
 *   narrow — reading passages: safety, FAQ, about
 */
export function Container({
  width = "normal",
  className,
  children,
  as: As = "div",
}: {
  width?: "wide" | "normal" | "narrow";
  className?: string;
  children: React.ReactNode;
  /* Constrained to HTML tags: @react-three/fiber augments the global JSX
     namespace, which makes a bare React.ElementType resolve to three.js
     objects whose children type is `never`. */
  as?: "div" | "section" | "article" | "aside" | "header" | "footer" | "main";
}) {
  return (
    <As
      className={cn(
        "mx-auto w-full px-5 sm:px-8",
        width === "wide" && "max-w-[1320px]",
        width === "normal" && "max-w-[1080px]",
        width === "narrow" && "max-w-[720px]",
        className,
      )}
    >
      {children}
    </As>
  );
}
