import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/site";
import { PageHeader } from "@/components/ui/page-header";
import { ServicesList } from "@/components/services/ServicesList";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "services" });
  return pageMetadata({
    locale,
    path: "/services",
    title: t("listTitle"),
    description: t("listLead"),
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");

  return (
    <>
      <PageHeader title={t("listTitle")} lead={t("listLead")} />
      <ServicesList />
    </>
  );
}
