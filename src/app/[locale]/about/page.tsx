import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { LogoLockup } from "@/components/brand/LogoLockup";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";
import { Safety } from "@/components/home/Safety";
import { OlympStrip } from "@/components/home/OlympStrip";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "about" });
  return pageMetadata({
    locale,
    path: "/about",
    title: t("title"),
    description: t("p1"),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tWa = await getTranslations("wa");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} />

      <section className="bg-surface pb-16 md:pb-24">
        <Container width="wide">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <p className="measure text-base text-ink-muted">{t("p1")}</p>
              <p className="measure mt-4 text-base text-ink-muted">{t("p2")}</p>

              <div className="mt-9 flex flex-col">
                {(["one", "two", "three"] as const).map((k) => (
                  <div key={k} className="border-t border-ink-faint py-5">
                    <h2 className="font-display text-base font-semibold text-ink">
                      {t(`values.${k}.title`)}
                    </h2>
                    <p className="measure mt-1.5 text-sm text-ink-muted">
                      {t(`values.${k}.text`)}
                    </p>
                  </div>
                ))}
              </div>

              <WhatsAppLink message={tWa("general")} size="lg" className="mt-8">
                {tNav("book")}
              </WhatsAppLink>
            </div>

            <div className="lg:col-span-5 lg:order-first">
              <div className="flex aspect-4/5 max-h-[30rem] items-center justify-center rounded-[1.75rem] bg-mint p-8">
                <span className="text-[2.1rem] text-ink">
                  <LogoLockup variant="stacked" withTagline ground="#99D1AA" />
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Safety />
      <OlympStrip />
    </>
  );
}
