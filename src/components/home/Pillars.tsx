import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SERVICES, SERVICE_THEME, type PillarId } from "@/lib/services";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

/**
 * Three pillar cards.
 *
 * Not an equal grid: the cards hang at different heights, the way bags sit at
 * different levels on a stand, and the card proportion and corner radius come
 * from the logo card itself.
 *
 * The hover state is a liquid fill that rises from the bottom in the pillar's
 * *fg* colour. It deliberately stops below the text. Filling the whole card
 * would put ink on pillar-fg at 2.73–4.06:1 and break AA, so the copy stays on
 * pillar-bg where it measures 4.56–7.37:1 and only the arrow sits on the fill.
 */
export function Pillars() {
  const t = useTranslations("pillars");
  const tS = useTranslations("services");

  const offset: Record<PillarId, string> = {
    mame: "lg:mt-0",
    zolushka: "lg:mt-12",
    detox: "lg:mt-24",
  };

  return (
    <section className="bg-surface py-16 md:py-24">
      <Container width="wide">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

        <Reveal className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6" stagger={45}>
          {SERVICES.map((s) => {
            const theme = SERVICE_THEME[s.id];
            return (
              <Link
                key={s.id}
                href={`/services/${s.slug}`}
                className={cn(
                  "group relative flex min-h-[22rem] flex-col overflow-hidden rounded-[1.75rem] p-7",
                  "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink",
                  theme.surface,
                  offset[s.id],
                )}
              >
                {/* liquid rising on hover, with a meniscus surface */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] translate-y-full
                             transition-transform duration-300 ease-out
                             group-hover:translate-y-0 group-focus-visible:translate-y-0"
                >
                  <svg
                    viewBox="0 0 400 26"
                    preserveAspectRatio="none"
                    className="block h-5 w-full"
                  >
                    <path
                      d="M0 0 C25 1 42 17 200 18 C358 17 375 1 400 0 L400 26 L0 26 Z"
                      fill={theme.hex.fg}
                    />
                  </svg>
                  <div className="h-full w-full" style={{ background: theme.hex.fg }} />
                </div>

                <div className="relative">
                  <h3 className="font-display text-lg font-semibold">{tS(`${s.id}.name`)}</h3>
                  <p className="mt-3 text-base">{tS(`${s.id}.short`)}</p>
                </div>

                <div className="relative mt-auto flex items-end justify-between gap-4 pt-8">
                  <span className="text-sm font-medium">
                    {tS("durationValue", { min: s.durationMin[0], max: s.durationMin[1] })}
                  </span>
                  <span
                    className="inline-flex size-12 shrink-0 items-center justify-center rounded-full
                               bg-white text-ink transition-transform duration-250 ease-out
                               group-hover:-translate-y-1"
                  >
                    <ArrowUpRight className="size-5" aria-hidden="true" />
                    <span className="sr-only">{t("more")}</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
