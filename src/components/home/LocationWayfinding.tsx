import { useTranslations } from "next-intl";
import { MapPin, Clock, Phone, CornerRightUp } from "lucide-react";
import { CONTACTS } from "@/lib/contacts";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { LogoMark } from "@/components/brand/LogoMark";
import { OlympLogo } from "@/components/brand/OlympLogo";
import { MapFacade } from "./MapFacade";

/**
 * Wayfinding, built from real elements rather than an SVG drawing, so it
 * reflows on small screens and the floor labels are selectable, translatable
 * text. Sharing a building with a busy lab is a genuine friction point for a
 * first visit, which is why this exists at all.
 */
function Wayfinding() {
  const t = useTranslations("location.wayfinding");

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-ink">{t("title")}</h3>
      <p className="mt-1.5 text-sm text-ink-muted">{t("lead")}</p>

      <div className="mt-5 overflow-hidden rounded-[1.5rem] border-2 border-ink-faint">
        {/* upper floor: us */}
        <div className="flex items-center gap-4 bg-mint p-5">
          <LogoMark ground="#99D1AA" className="h-9 w-auto shrink-0 text-ink" />
          <div className="min-w-0">
            <p className="text-2xs font-semibold tracking-[0.14em] text-ink uppercase">
              {t("floor2")}
            </p>
            <p className="mt-0.5 font-medium text-ink">{t("novamedHere")}</p>
          </div>
        </div>

        {/* lower floor: the lab */}
        <div className="flex items-center gap-4 border-t-2 border-ink-faint bg-white p-5">
          <span className="shrink-0 text-[0.95rem] text-ink-muted">
            <OlympLogo />
          </span>
          <div className="min-w-0">
            <p className="text-2xs font-semibold tracking-[0.14em] text-ink-muted uppercase">
              {t("floor1")}
            </p>
            <p className="mt-0.5 font-medium text-ink">{t("olympHere")}</p>
          </div>
        </div>

        {/* street entrance */}
        <div className="flex items-center gap-3 border-t-2 border-ink-faint bg-surface px-5 py-4">
          <CornerRightUp className="size-5 shrink-0 text-ink" aria-hidden="true" />
          <p className="text-sm font-medium text-ink">{t("entrance")}</p>
        </div>
      </div>

      <ol className="mt-5 flex flex-col gap-2.5">
        {(["step1", "step2", "step3"] as const).map((k, i) => (
          <li key={k} className="flex gap-3 text-sm text-ink-muted">
            <span className="mt-px shrink-0 font-display text-sm font-extrabold text-ink tabular-nums">
              {i + 1}
            </span>
            {t(k)}
          </li>
        ))}
      </ol>

      <p className="mt-4 rounded-[1rem] bg-mint/40 px-4 py-3 text-sm text-ink">{t("hint")}</p>
    </div>
  );
}

export function LocationWayfinding() {
  const t = useTranslations("location");

  return (
    <section className="bg-surface py-16 md:py-24">
      <Container width="wide">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

        <div className="mt-11 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <MapFacade />

            {/* A <div> inside <dl> may group only <dt>/<dd>, so the icons
                live in the <dt> rather than in a wrapper alongside it. */}
            <dl className="mt-7 grid gap-6 sm:grid-cols-3">
              <div>
                <dt className="flex items-center gap-2 text-2xs font-semibold tracking-[0.14em] text-ink-muted uppercase">
                  <MapPin className="size-5 shrink-0 text-ink" aria-hidden="true" />
                  {t("addressLabel")}
                </dt>
                <dd className="mt-2 text-sm text-ink">
                  <address className="not-italic">
                    {CONTACTS.address.street}
                    <br />
                    {CONTACTS.address.city}
                  </address>
                </dd>
              </div>

              <div>
                <dt className="flex items-center gap-2 text-2xs font-semibold tracking-[0.14em] text-ink-muted uppercase">
                  <Clock className="size-5 shrink-0 text-ink" aria-hidden="true" />
                  {t("hoursLabel")}
                </dt>
                <dd className="mt-2 text-sm text-ink">
                  {t("hoursValue")}
                  <span className="mt-1 block text-ink-muted">{t("hoursNote")}</span>
                </dd>
              </div>

              <div>
                <dt className="flex items-center gap-2 text-2xs font-semibold tracking-[0.14em] text-ink-muted uppercase">
                  <Phone className="size-5 shrink-0 text-ink" aria-hidden="true" />
                  {t("phoneLabel")}
                </dt>
                <dd className="mt-2 text-sm">
                  <a
                    href={CONTACTS.phoneHref}
                    className="text-ink underline underline-offset-4 transition-colors
                               duration-150 hover:text-ink-muted"
                  >
                    {CONTACTS.phoneDisplay}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-5">
            <Wayfinding />
          </div>
        </div>
      </Container>
    </section>
  );
}
