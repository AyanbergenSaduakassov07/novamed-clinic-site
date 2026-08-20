import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Variants follow the colour contract in globals.css.
 *
 * `pillar` deliberately fills with the pillar's *bg* token and labels it in
 * ink (4.56–7.37:1). Filling with the *fg* token and labelling it white would
 * land at 3.02–4.49:1 and fail AA, so that combination does not exist here.
 */
const button = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-medium " +
    "transition-[transform,background-color,color,border-color] duration-150 ease-out " +
    "focus-visible:outline-3 focus-visible:outline-offset-3 " +
    "active:translate-y-px disabled:pointer-events-none disabled:opacity-55",
  {
    variants: {
      variant: {
        /** Default CTA. white on ink = 12.26:1 */
        primary: "bg-ink text-white hover:bg-ink/90 focus-visible:outline-ink",
        /** On an ink panel. ink on white = 12.26:1 */
        onDark:
          "bg-white text-ink hover:bg-mint focus-visible:outline-mint focus-visible:outline-offset-4",
        outline:
          "border-2 border-ink/25 bg-transparent text-ink hover:border-ink hover:bg-ink/5 " +
          "focus-visible:outline-ink",
        ghost: "text-ink hover:bg-ink/6 focus-visible:outline-ink",
        /** Colour supplied by the caller via SERVICE_THEME.surface. */
        pillar: "hover:brightness-[0.96] focus-visible:outline-ink",
      },
      size: {
        sm: "px-4 py-2.5 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-base md:text-lg",
      },
      full: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "md", full: false },
  },
);

export type ButtonVariants = VariantProps<typeof button>;

export function buttonClass(opts: ButtonVariants & { className?: string }) {
  const { className, ...rest } = opts;
  return cn(button(rest), className);
}

export function Button({
  className,
  variant,
  size,
  full,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariants) {
  return <button className={buttonClass({ variant, size, full, className })} {...props} />;
}
