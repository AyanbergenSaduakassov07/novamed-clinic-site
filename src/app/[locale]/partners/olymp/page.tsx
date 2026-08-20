import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ExternalLink, Phone, Clock } from "lucide-react";
import { routing, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/site";
import { OLYMP } from "@/lib/contacts";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { OlympLogo } from "@/components/brand/OlympLogo";
import { buttonClass } from "@/components/ui/button";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "olymp" });
  return pageMetadata({
    locale,
    path: "/partners/olymp",
    title: t("pageTitle"),
    description: t("pageLead"),
  });
}

export default async function OlympPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("olymp");
  const tLoc = await getTranslations("location");

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("pageTitle")} lead={t("pageLead")}>
        <div className="mt-8 text-[1.6rem] text-ink">
          <OlympLogo />
        </div>
      </PageHeader>

      <section className="bg-surface pb-16 md:pb-24">
        <Container width="wide">
          <ul className="flex flex-wrap gap-2">
            <li className="rounded-full bg-mint px-4 py-2 text-sm font-semibold text-ink">
              {t("badgeJciFull")}
            </li>
            <li className="rounded-full bg-mint px-4 py-2 text-sm font-semibold text-ink">
              {t("badgeIsoFull")}
            </li>
          </ul>

          <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="font-display text-base font-semibold text-ink">
                {t("whatTitle")}
              </h2>
              <p className="measure mt-2 text-base text-ink-muted">{t("whatText")}</p>
            </div>
            <div>
              <h2 className="font-display text-base font-semibold text-ink">
                {t("whyTitle")}
              </h2>
              <p className="measure mt-2 text-base text-ink-muted">{t("whyText")}</p>
            </div>
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-5 border-t border-ink-faint pt-8">
            <div>
              <dt className="flex items-center gap-2 text-2xs font-semibold tracking-[0.14em] text-ink-muted uppercase">
                <Clock className="size-5 shrink-0 text-ink" aria-hidden="true" />
                {tLoc("hoursLabel")}
              </dt>
              <dd className="mt-2 text-sm text-ink">{t("hours")}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-2xs font-semibold tracking-[0.14em] text-ink-muted uppercase">
                <Phone className="size-5 shrink-0 text-ink" aria-hidden="true" />
                {tLoc("phoneLabel")}
              </dt>
              <dd className="mt-2 text-sm">
                <a
                  href={OLYMP.phoneHref}
                  className="text-ink underline underline-offset-4 transition-colors
                             duration-150 hover:text-ink-muted"
                >
                  {OLYMP.phoneDisplay}
                </a>
              </dd>
            </div>
          </dl>

          <a
            href={OLYMP.website}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass({ variant: "primary", size: "lg", className: "mt-9" })}
          >
            {t("link")}
            <ExternalLink className="size-5" aria-hidden="true" />
            <span className="sr-only">{t("linkNote")}</span>
          </a>

          <p className="measure mt-10 border-t border-ink-faint pt-6 text-sm text-ink-muted">
            {t("disclaimer")}
          </p>
        </Container>
      </section>
    </>
  );
}
