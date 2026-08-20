import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/site";
import { GALLERY } from "@/lib/gallery";
import { CONTACTS } from "@/lib/contacts";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { buttonClass } from "@/components/ui/button";
import { InstagramIcon } from "@/components/ui/icons";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "gallery" });
  return pageMetadata({
    locale,
    path: "/gallery",
    title: t("title"),
    description: t("pageLead"),
  });
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("gallery");

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("pageLead")} />

      <section className="bg-surface pb-16 md:pb-24">
        <Container width="wide">
          {GALLERY.length === 0 ? (
            <div className="rounded-[1.75rem] border-2 border-dashed border-ink-faint px-6 py-16 text-center">
              <p className="measure mx-auto text-base text-ink-muted">{t("empty")}</p>
              <a
                href={CONTACTS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass({ variant: "primary", className: "mt-6" })}
              >
                <InstagramIcon className="size-5" />
                {t("emptyCta")}
              </a>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4">
              {GALLERY.map((p) => (
                <li key={p.src} className="overflow-hidden rounded-[1.25rem] bg-mint/40">
                  <Image
                    src={p.src}
                    alt={p.alt}
                    width={p.width}
                    height={p.height}
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="h-full w-full object-cover"
                  />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>
    </>
  );
}
