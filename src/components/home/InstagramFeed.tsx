import { useTranslations } from "next-intl";
import { CONTACTS } from "@/lib/contacts";
import { Container } from "@/components/ui/container";
import { InstagramIcon } from "@/components/ui/icons";

/**
 * Social proof in place of a star rating.
 *
 * NOT a live feed. Rendering real posts needs either an Instagram Graph API
 * token tied to a Business account or a third-party widget, and neither exists
 * for this client yet. A fake grid of placeholder tiles would imply activity
 * that is not being shown, so this links out instead and says what it is.
 *
 * TO MAKE IT LIVE: add a Graph API token and fetch recent media in a server
 * component, or drop in a hosted widget. The layout below already reserves the
 * space, so swapping it in shifts nothing.
 */
export function InstagramFeed() {
  const t = useTranslations("instagram");

  return (
    <section className="bg-surface pb-16 md:pb-24">
      <Container width="wide">
        <a
          href={CONTACTS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col gap-6 rounded-[1.75rem] bg-mint p-7 transition-colors
                     duration-250 hover:bg-mint/80 focus-visible:outline-3
                     focus-visible:outline-offset-3 focus-visible:outline-ink md:flex-row
                     md:items-center md:justify-between md:p-10"
        >
          <div>
            <span className="text-2xs font-semibold tracking-[0.2em] text-ink uppercase">
              {t("eyebrow")}
            </span>
            <h2 className="mt-3 font-display text-lg font-semibold text-ink md:text-xl">
              {t("title")}
            </h2>
            <p className="measure mt-2 text-base text-ink">{t("lead")}</p>
          </div>

          <span
            className="inline-flex min-h-12 shrink-0 items-center gap-2.5 rounded-full bg-ink px-6
                       text-base font-medium text-white transition-transform duration-250 ease-out
                       group-hover:-translate-y-0.5"
          >
            <InstagramIcon className="size-5" />
            {t("cta")}
          </span>
        </a>
      </Container>
    </section>
  );
}
