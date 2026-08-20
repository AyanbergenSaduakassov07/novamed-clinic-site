import { whatsappUrl } from "@/lib/contacts";
import { buttonClass, type ButtonVariants } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * Every booking CTA on the site is one of these.
 *
 * Pass the already-translated `message` and it is encoded into the wa.me deep
 * link by `whatsappUrl()`. No component builds that URL itself, so the number
 * and the encoding live in exactly one place.
 */
export function WhatsAppLink({
  message,
  children,
  className,
  variant,
  size,
  full,
  withIcon = true,
}: {
  message?: string;
  children: React.ReactNode;
  className?: string;
  withIcon?: boolean;
} & ButtonVariants) {
  return (
    <a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClass({ variant, size, full, className })}
    >
      {withIcon && <WhatsAppIcon className="size-5 shrink-0" />}
      <span>{children}</span>
    </a>
  );
}

/** Bare anchor, for footer and dock rows that carry their own styling. */
export function WhatsAppAnchor({
  message,
  children,
  className,
}: {
  message?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(className)}
    >
      {children}
    </a>
  );
}
