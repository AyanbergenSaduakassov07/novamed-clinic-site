import { useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";
import { OLYMP } from "@/lib/contacts";
import { OlympLogo } from "@/components/brand/OlympLogo";
import { Container } from "@/components/ui/container";

/**
 * A quiet band, not a feature block. Olymp is a co-tenant the patient may find
 * useful, not a NovaMed service, and the visual weight says so.
 */
export function OlympStrip() {
  const t = useTranslations("olymp");

  return (
    <section className="bg-surface py-12 md:py-16">
      <Container width="wide">
        <div className="flex flex-col gap-6 rounded-[1.75rem] border-2 border-ink-faint px-6 py-7 md:flex-row md:items-center md:gap-10 md:px-9">
          <div className="shrink-0 text-[1.35rem] text-ink">
            <OlympLogo />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-2xs font-semibold tracking-[0.2em] text-ink-muted uppercase">
              {t("eyebrow")}
            </p>
            <p className="mt-1.5 text-base text-ink">{t("text")}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              <li className="rounded-full bg-mint px-3 py-1 text-2xs font-semibold text-ink">
                <abbr title={t("badgeJciFull")} className="no-underline">
                  {t("badgeJci")}
                </abbr>
              </li>
              <li className="rounded-full bg-mint px-3 py-1 text-2xs font-semibold text-ink">
                <abbr title={t("badgeIsoFull")} className="no-underline">
                  {t("badgeIso")}
                </abbr>
              </li>
              <li className="px-1 py-1 text-2xs text-ink-muted">{t("hours")}</li>
            </ul>
          </div>

          <a
            href={OLYMP.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-full
                       border-2 border-ink/25 px-5 text-sm font-medium text-ink
                       transition-colors duration-150 hover:border-ink hover:bg-ink/5
                       focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink
                       md:self-auto"
          >
            {t("link")}
            <ExternalLink className="size-4" aria-hidden="true" />
            <span className="sr-only">{t("linkNote")}</span>
          </a>
        </div>
      </Container>
    </section>
  );
}
