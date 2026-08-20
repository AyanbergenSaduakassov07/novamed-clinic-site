import { useTranslations } from "next-intl";
import { Phone, MapPin, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { NAV_ROUTES } from "@/lib/routes";
import { CONTACTS, OLYMP, whatsappUrl } from "@/lib/contacts";
import { LogoLockup } from "@/components/brand/LogoLockup";
import { OlympLogo } from "@/components/brand/OlympLogo";
import { WhatsAppIcon, InstagramIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/container";
import { Meniscus } from "@/components/Meniscus";

const linkCls =
  "inline-flex min-h-11 items-center gap-2.5 text-white/85 transition-colors duration-150 hover:text-mint";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tWa = useTranslations("wa");
  const tLoc = useTranslations("location");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface">
      <Meniscus fill="var(--color-ink)" />
      <div className="bg-ink text-white">
        <Container width="wide" className="py-14 md:py-20">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <span className="text-[1.75rem] text-white">
                <LogoLockup variant="stacked" ground="#123B3A" className="items-start" />
              </span>
              <p className="mt-5 max-w-xs text-sm text-white/70">{t("tagline")}</p>
            </div>

            <nav className="md:col-span-3" aria-label={t("navTitle")}>
              <h2 className="text-2xs font-semibold tracking-[0.2em] text-mint uppercase">
                {t("navTitle")}
              </h2>
              <ul className="mt-4 flex flex-col gap-1">
                {NAV_ROUTES.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href} className={linkCls}>
                      {tNav(r.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="md:col-span-3">
              <h2 className="text-2xs font-semibold tracking-[0.2em] text-mint uppercase">
                {t("contactTitle")}
              </h2>
              <ul className="mt-4 flex flex-col gap-1">
                <li>
                  <a
                    href={whatsappUrl(tWa("general"))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkCls}
                  >
                    <WhatsAppIcon className="size-5 shrink-0" />
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href={CONTACTS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkCls}
                  >
                    <InstagramIcon className="size-5 shrink-0" />
                    {CONTACTS.instagramHandle}
                  </a>
                </li>
                <li>
                  <a href={CONTACTS.phoneHref} className={linkCls}>
                    <Phone className="size-5 shrink-0" aria-hidden="true" />
                    {CONTACTS.phoneDisplay}
                  </a>
                </li>
                <li className="mt-3 flex gap-2.5 text-sm text-white/70">
                  <MapPin className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                  <address className="not-italic">
                    {CONTACTS.address.street}
                    <br />
                    {CONTACTS.address.city}
                  </address>
                </li>
                <li className="flex gap-2.5 text-sm text-white/70">
                  <Clock className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                  <span>{tLoc("hoursValue")}</span>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h2 className="text-2xs font-semibold tracking-[0.2em] text-mint uppercase">
                {t("legalTitle")}
              </h2>
              <ul className="mt-4 flex flex-col gap-2 text-sm text-white/70">
                <li>{t("entity")}</li>
                <li>{t("licence")}</li>
                <li className="text-white/55">{t("licenceNumber")}</li>
              </ul>

              <a
                href={OLYMP.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex text-[1.05rem] text-white/65 transition-colors
                           duration-150 hover:text-mint"
              >
                <OlympLogo />
              </a>
            </div>
          </div>

          <div className="mt-14 border-t border-white/15 pt-7">
            <p className="measure text-sm text-white/70">{t("medicalNote")}</p>
            <div className="mt-5 flex flex-col gap-2 text-2xs text-white/55 sm:flex-row sm:justify-between">
              <span>{t("olympNote")}</span>
              <span>
                © {year} {t("entity")}. {t("rights")}.
              </span>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
