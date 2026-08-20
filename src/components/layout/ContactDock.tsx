"use client";

import { useTranslations } from "next-intl";
import { Phone } from "lucide-react";
import { CONTACTS, whatsappUrl } from "@/lib/contacts";
import { WhatsAppIcon, InstagramIcon } from "@/components/ui/icons";
import { useScrolledPast } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Appears once the hero has scrolled away.
 *   mobile  — a bottom bar with visible labels
 *   desktop — a fixed cluster on the right that expands its label on hover
 *
 * No icon here is unlabelled: each carries an accessible name, and the label
 * is visible outright on mobile and on hover/focus on desktop.
 */
export function ContactDock() {
  const t = useTranslations("dock");
  const tWa = useTranslations("wa");
  // Appears once the hero is mostly out of the way. 520px approximates 60% of
  // a typical mobile viewport and avoids reading innerHeight during render.
  const shown = useScrolledPast(520);

  const items = [
    {
      key: "whatsapp",
      href: whatsappUrl(tWa("general")),
      label: t("whatsapp"),
      short: "WhatsApp",
      icon: <WhatsAppIcon className="size-6" />,
      primary: true,
      external: true,
    },
    {
      key: "instagram",
      href: CONTACTS.instagram,
      label: t("instagram"),
      short: "Instagram",
      icon: <InstagramIcon className="size-6" />,
      primary: false,
      external: true,
    },
    {
      key: "phone",
      href: CONTACTS.phoneHref,
      label: t("phone"),
      short: CONTACTS.phoneDisplay,
      icon: <Phone className="size-6" aria-hidden="true" />,
      primary: false,
      external: false,
    },
  ];

  return (
    <>
      {/* mobile: bottom bar */}
      <nav
        aria-label={t("label")}
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-ink-faint bg-surface/96 backdrop-blur-md md:hidden",
          "transition-transform duration-250 ease-out",
          shown ? "translate-y-0" : "translate-y-full",
        )}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="grid grid-cols-3">
          {items.map((i) => (
            <li key={i.key}>
              <a
                href={i.href}
                {...(i.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                aria-label={i.label}
                className={cn(
                  "flex min-h-16 flex-col items-center justify-center gap-1 px-2 py-2 text-2xs font-medium",
                  i.primary ? "text-ink" : "text-ink-muted",
                )}
              >
                {i.icon}
                <span className="truncate">{i.short}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* desktop: right-hand cluster */}
      <nav
        aria-label={t("label")}
        className={cn(
          "fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 flex-col gap-3 md:flex",
          "transition-[opacity,transform] duration-250 ease-out",
          shown ? "opacity-100" : "pointer-events-none translate-x-4 opacity-0",
        )}
      >
        {items.map((i) => (
          <a
            key={i.key}
            href={i.href}
            {...(i.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            aria-label={i.label}
            className={cn(
              "group inline-flex min-h-12 items-center gap-0 overflow-hidden rounded-full px-3",
              "shadow-[0_6px_24px_-12px_rgba(18,59,58,0.6)] transition-all duration-250 ease-out",
              "hover:gap-3 hover:pr-5 focus-visible:gap-3 focus-visible:pr-5",
              i.primary
                ? "bg-ink text-white focus-visible:outline-ink"
                : "border-2 border-ink/12 bg-surface text-ink focus-visible:outline-ink",
            )}
          >
            {i.icon}
            <span
              className="max-w-0 text-sm font-medium whitespace-nowrap opacity-0 transition-all duration-250
                         ease-out group-hover:max-w-[14rem] group-hover:opacity-100
                         group-focus-visible:max-w-[14rem] group-focus-visible:opacity-100"
            >
              {i.short}
            </span>
          </a>
        ))}
      </nav>

      {/* keeps the mobile bar from covering the end of the page */}
      <div aria-hidden="true" className="h-16 md:hidden" />
    </>
  );
}
