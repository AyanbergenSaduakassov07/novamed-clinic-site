import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { buttonClass } from "@/components/ui/button";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";

export default function NotFound() {
  const t = useTranslations("common");
  const tWa = useTranslations("wa");
  const tNav = useTranslations("nav");

  return (
    <section className="bg-surface pt-40 pb-24">
      <Container width="narrow">
        <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
          {t("notFoundTitle")}
        </h1>
        <p className="measure mt-4 text-base text-ink-muted">{t("notFoundText")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className={buttonClass({ variant: "primary", size: "lg" })}>
            {t("notFoundCta")}
          </Link>
          <WhatsAppLink message={tWa("general")} variant="outline" size="lg">
            {tNav("book")}
          </WhatsAppLink>
        </div>
      </Container>
    </section>
  );
}
