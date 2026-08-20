import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { EXPECT_STEPS, EXPECT_TOTAL } from "@/lib/expect";
import { Reveal } from "@/components/motion/Reveal";

/**
 * The one place on this site where numbering is earned: these are five steps
 * in a real order, each with a real duration.
 *
 * On desktop the segments are sized in proportion to their minutes, so the
 * long stretch in the chair reads as long. The tick scale above them is a
 * graduated measure, borrowed from the markings printed on an IV bag.
 */
export function WhatToExpect() {
  const t = useTranslations("expect");
  const ticks = Array.from({ length: EXPECT_TOTAL / 5 + 1 }, (_, i) => i * 5);

  return (
    <section className="bg-surface py-16 md:py-24">
      <Container width="wide">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

        {/* graduated scale, desktop only */}
        <div className="mt-12 hidden md:block" aria-hidden="true">
          <div className="relative h-7">
            {ticks.map((m) => (
              <div
                key={m}
                className="absolute top-0 flex flex-col items-center"
                style={{ left: `${(m / EXPECT_TOTAL) * 100}%` }}
              >
                <span className={m % 10 === 0 ? "h-3 w-px bg-ink/35" : "h-1.5 w-px bg-ink/20"} />
                {m % 10 === 0 && (
                  <span className="mt-1 -translate-x-1/2 text-2xs text-ink-muted tabular-nums">
                    {m}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Proportional bar carries the duration comparison; the cards below
            are equal width so the copy stays readable. Sizing text containers
            by minutes crushed the 5-minute steps into unreadable columns. */}
        <div className="mt-1 hidden gap-1 md:flex" aria-hidden="true">
          {EXPECT_STEPS.map((s, i) => (
            <div
              key={s.key}
              style={{ flexGrow: s.minutes, flexBasis: 0 }}
              className="flex h-12 min-w-0 items-center justify-center rounded-lg bg-mint
                         first:rounded-l-[1rem] last:rounded-r-[1rem]"
            >
              <span className="font-display text-sm font-extrabold text-ink tabular-nums">
                {i + 1}
              </span>
            </div>
          ))}
        </div>

        <Reveal className="mt-3 hidden gap-3 md:grid md:grid-cols-5" stagger={50}>
          {EXPECT_STEPS.map((s, i) => (
            <div key={s.key} className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-lg font-extrabold text-ink tabular-nums">
                  {i + 1}
                </span>
                <span className="text-2xs font-semibold text-ink-muted tabular-nums">
                  {t("minutes", { n: s.minutes })}
                </span>
              </div>
              <h3 className="mt-2 font-display text-base font-semibold text-ink">
                {t(`steps.${s.key}.title`)}
              </h3>
              <p className="mt-2 text-sm text-ink-muted">{t(`steps.${s.key}.text`)}</p>
            </div>
          ))}
        </Reveal>

        {/* mobile: a vertical run down a single line */}
        <Reveal className="mt-10 flex flex-col md:hidden" stagger={45}>
          {EXPECT_STEPS.map((s, i) => (
            <div key={s.key} className="relative flex gap-4 pb-7 last:pb-0">
              <div className="flex flex-col items-center">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-mint font-display text-sm font-extrabold text-ink tabular-nums">
                  {i + 1}
                </span>
                {i < EXPECT_STEPS.length - 1 && (
                  <span aria-hidden="true" className="mt-1 w-px flex-1 bg-ink-faint" />
                )}
              </div>
              <div className="pb-1">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-display text-base font-semibold text-ink">
                    {t(`steps.${s.key}.title`)}
                  </h3>
                  <span className="text-2xs font-semibold text-ink-muted tabular-nums">
                    {t("minutes", { n: s.minutes })}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-ink-muted">{t(`steps.${s.key}.text`)}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
