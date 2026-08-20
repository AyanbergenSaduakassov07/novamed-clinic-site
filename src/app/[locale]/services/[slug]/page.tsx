import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, Clock, Tag, Info, AlertCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/site";
import { SERVICES, SERVICE_THEME, getService, formatPrice } from "@/lib/services";
import { Container } from "@/components/ui/container";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";
import { Meniscus } from "@/components/Meniscus";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    SERVICES.map((s) => ({ locale, slug: s.slug })),
  );
}

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const service = getService(slug);
  if (!service) return {};
  const t = await getTranslations({ locale, namespace: "services" });
  return pageMetadata({
    locale,
    path: `/services/${service.slug}`,
    title: t(`${service.id}.name`),
    description: t(`${service.id}.short`),
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const service = getService(slug);
  if (!service) notFound();

  const t = await getTranslations("services");
  const tWa = await getTranslations("wa");
  const theme = SERVICE_THEME[service.id];
  const name = t(`${service.id}.name`);

  // Empty until the clinic supplies it; the fallback below is the honest state.
  const composition = t.raw(`${service.id}.composition`) as string[];
  const price = formatPrice(service.price, locale);

  return (
    <>
      <div className={cn("pt-32 pb-14 md:pt-40 md:pb-20", theme.surface)}>
        <Container width="wide">
          <Link
            href="/services"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium
                       underline underline-offset-4 transition-opacity
                       duration-150 hover:opacity-80"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {t("backToList")}
          </Link>

          <h1 className="mt-5 text-xl font-extrabold sm:text-2xl">{name}</h1>
          <p className="measure mt-4 text-base">{t(`${service.id}.short`)}</p>

          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            <div>
              <dt className="flex items-center gap-2 text-2xs font-semibold tracking-[0.14em] uppercase">
                <Clock className="size-5 shrink-0" aria-hidden="true" />
                {t("duration")}
              </dt>
              <dd className="mt-1 font-medium">
                {t("durationValue", {
                  min: service.durationMin[0],
                  max: service.durationMin[1],
                })}
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-2xs font-semibold tracking-[0.14em] uppercase">
                <Tag className="size-5 shrink-0" aria-hidden="true" />
                {t("priceLabel")}
              </dt>
              <dd className="mt-1 font-medium">{price ?? t("priceFallback")}</dd>
            </div>
          </dl>

          <WhatsAppLink message={tWa("service", { name })} size="lg" className="mt-9">
            {t("bookCta", { name })}
          </WhatsAppLink>
        </Container>
      </div>

      <Meniscus fill="var(--color-surface)" />

      <div className="bg-surface pt-4 pb-16 md:pb-24">
        <Container width="normal">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <p className="measure text-base text-ink-muted">
                {t(`${service.id}.description`)}
              </p>

              <section className="mt-10">
                <h2 className="font-display text-base font-semibold text-ink">
                  {t("compositionLabel")}
                </h2>
                {composition.length > 0 ? (
                  <ul className="mt-4 flex flex-col">
                    {composition.map((item) => (
                      <li
                        key={item}
                        className="border-t border-ink-faint py-3 text-base text-ink last:border-b"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="measure mt-3 flex gap-2.5 text-base text-ink-muted">
                    <Info className="mt-1 size-5 shrink-0" aria-hidden="true" />
                    {t("compositionFallback")}
                  </p>
                )}
              </section>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-[1.5rem] bg-mint/45 p-6">
                <h2 className="font-display text-base font-semibold text-ink">
                  {t("forWhomLabel")}
                </h2>
                <p className="mt-2 text-sm text-ink-muted">{t(`${service.id}.forWhom`)}</p>
              </div>

              <div className="mt-4 rounded-[1.5rem] border-2 border-ink-faint p-6">
                <h2 className="flex items-center gap-2 font-display text-base font-semibold text-ink">
                  <AlertCircle className="size-5 shrink-0" aria-hidden="true" />
                  {t("cautionLabel")}
                </h2>
                <p className="mt-2 text-sm text-ink-muted">{t(`${service.id}.caution`)}</p>
              </div>

              <WhatsAppLink
                message={tWa("service", { name })}
                size="lg"
                full
                className="mt-4"
              >
                {t("bookCta", { name })}
              </WhatsAppLink>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
