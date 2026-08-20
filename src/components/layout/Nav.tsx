"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_ROUTES } from "@/lib/routes";
import { LogoLockup } from "@/components/brand/LogoLockup";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";
import { useScrolledPast } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * A floating pill rather than a full-width bar. The shape is lifted from the
 * MED badge in the logo, which is why it is here and not a default header.
 */
export function Nav() {
  const t = useTranslations("nav");
  const tWa = useTranslations("wa");
  const locale = useLocale();
  const pathname = usePathname();

  const scrolled = useScrolledPast(24);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.removeProperty("overflow");
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60]
                   focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white"
      >
        {t("skipToContent")}
      </a>

      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5">
        <nav
          aria-label={t("menu")}
          className={cn(
            "mx-auto flex max-w-[1320px] items-center gap-3 rounded-full px-3 py-2 sm:px-4",
            "transition-[background-color,box-shadow,backdrop-filter] duration-250 ease-out",
            scrolled
              ? "bg-surface/92 shadow-[0_6px_28px_-14px_rgba(18,59,58,0.5)] backdrop-blur-md"
              : "bg-transparent",
          )}
        >
          <Link
            href="/"
            className="shrink-0 rounded-full px-1 py-1 text-[1.35rem] text-ink"
            aria-label={t("home")}
          >
            <LogoLockup variant="horizontal" ground="var(--color-surface)" />
          </Link>

          <ul className="ml-auto hidden items-center gap-1 lg:flex">
            {NAV_ROUTES.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-full px-4 text-sm text-ink",
                    "transition-colors duration-150 hover:bg-ink/6",
                    pathname === r.href && "bg-ink/8 font-medium",
                  )}
                >
                  {t(r.key)}
                </Link>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <LocaleSwitch current={locale} pathname={pathname} />
            <WhatsAppLink
              message={tWa("general")}
              size="sm"
              className="hidden sm:inline-flex"
              withIcon={false}
            >
              {t("book")}
            </WhatsAppLink>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={t("menu")}
              className="inline-flex size-11 items-center justify-center rounded-full text-ink
                         transition-colors duration-150 hover:bg-ink/8 lg:hidden"
            >
              <Menu className="size-6" aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>

      {/* mobile drawer */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-0 z-60 lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label={t("menu")}
      >
        <div
          className="absolute inset-0 bg-ink/45 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <div className="absolute inset-x-3 top-3 rounded-[1.75rem] bg-surface p-5 shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[1.35rem] text-ink">
              <LogoLockup variant="horizontal" ground="var(--color-surface)" />
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("close")}
              autoFocus
              className="inline-flex size-11 items-center justify-center rounded-full text-ink
                         transition-colors duration-150 hover:bg-ink/8"
            >
              <X className="size-6" aria-hidden="true" />
            </button>
          </div>

          <ul className="mt-4 flex flex-col">
            {NAV_ROUTES.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-14 items-center border-b border-ink-faint text-lg text-ink"
                >
                  {t(r.key)}
                </Link>
              </li>
            ))}
          </ul>

          <WhatsAppLink message={tWa("general")} size="lg" full className="mt-5">
            {t("book")}
          </WhatsAppLink>
        </div>
      </div>
    </>
  );
}

function LocaleSwitch({ current, pathname }: { current: string; pathname: string }) {
  const t = useTranslations("nav");
  const target = current === "ru" ? "kk" : "ru";

  return (
    <Link
      href={pathname}
      locale={target}
      lang={target}
      hrefLang={target}
      aria-label={t("language")}
      className="inline-flex min-h-11 items-center rounded-full border-2 border-ink/20 px-3
                 text-sm font-medium text-ink transition-colors duration-150 hover:border-ink"
    >
      {target === "kk" ? "ҚАЗ" : "РУС"}
    </Link>
  );
}
