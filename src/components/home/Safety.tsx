import { useTranslations } from "next-intl";
import { PackageOpen, Stethoscope, UserRound, SprayCan, Trash2, HandHelping } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Meniscus } from "@/components/Meniscus";
import { Reveal } from "@/components/motion/Reveal";

const ICONS = {
  one: PackageOpen,
  two: Stethoscope,
  three: UserRound,
  four: SprayCan,
  five: Trash2,
  six: HandHelping,
} as const;

/**
 * Deliberately plain. This section exists because IV therapy involves needles
 * and most competitor sites skip the subject entirely, so it is written as
 * documentation rather than marketing: hairlines, no cards, no shadows.
 */
export function Safety() {
  const t = useTranslations("safety");

  return (
    <section className="bg-surface">
      <Meniscus fill="var(--color-surface-sunk)" />
      <div className="bg-surface-sunk pt-4 pb-16 md:pb-24">
        <Container width="normal">
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

          <Reveal className="mt-11 grid gap-x-10 sm:grid-cols-2" stagger={40}>
            {(["one", "two", "three", "four", "five", "six"] as const).map((k) => {
              const Icon = ICONS[k];
              return (
                <div key={k} className="border-t border-ink/12 py-6">
                  <div className="flex gap-3.5">
                    <Icon className="mt-0.5 size-6 shrink-0 text-ink" aria-hidden="true" />
                    <div>
                      <h3 className="font-display text-base font-semibold text-ink">
                        {t(`items.${k}.title`)}
                      </h3>
                      <p className="mt-1.5 text-sm text-ink-muted">{t(`items.${k}.text`)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </Reveal>
        </Container>
      </div>
    </section>
  );
}
