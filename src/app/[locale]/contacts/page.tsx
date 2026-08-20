import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Phone } from "lucide-react";
import { routing, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/site";
import { CONTACTS, whatsappUrl } from "@/lib/contacts";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { WhatsAppIcon, InstagramIcon } from "@/components/ui/icons";
import { ContactForm } from "@/components/contacts/ContactForm";
import { LocationWayfinding } from "@/components/home/LocationWayfinding";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "contacts" });
  return pageMetadata({
    locale,
    path: "/contacts",
    title: t("title"),
    description: t("lead"),
  });
}

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contacts");
  const tWa = await getTranslations("wa");
  const tDock = await getTranslations("dock");

  const channels = [
    {
      href: whatsappUrl(tWa("general")),
      label: tDock("whatsapp"),
      value: "WhatsApp",
      icon: <WhatsAppIcon className="size-6" />,
      external: true,
    },
    {
      href: CONTACTS.instagram,
      label: tDock("instagram"),
      value: CONTACTS.instagramHandle,
      icon: <InstagramIcon className="size-6" />,
      external: true,
    },
    {
      href: CONTACTS.phoneHref,
      label: tDock("phone"),
      value: CONTACTS.phoneDisplay,
      icon: <Phone className="size-6" aria-hidden="true" />,
      external: false,
    },
  ];

  return (
    <>
      <PageHeader title={t("title")} lead={t("lead")} />

      <section className="bg-surface pb-16 md:pb-20">
        <Container width="wide">
          <ul className="grid gap-4 sm:grid-cols-3">
            {channels.map((c) => (
              <li key={c.value}>
                <a
                  href={c.href}
                  {...(c.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group flex min-h-24 flex-col justify-between gap-3 rounded-[1.5rem]
                             border-2 border-ink-faint p-5 transition-colors duration-150
                             hover:border-ink/40 focus-visible:outline-3
                             focus-visible:outline-offset-3 focus-visible:outline-ink"
                >
                  <span className="text-ink">{c.icon}</span>
                  <span>
                    <span className="block text-2xs font-semibold tracking-[0.14em] text-ink-muted uppercase">
                      {c.label}
                    </span>
                    <span className="mt-0.5 block font-medium text-ink">{c.value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <h2 className="font-display text-lg font-semibold text-ink">
                {t("formTitle")}
              </h2>
              <p className="measure mt-2 text-base text-ink-muted">{t("formLead")}</p>
            </div>
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>

      <LocationWayfinding />
    </>
  );
}
