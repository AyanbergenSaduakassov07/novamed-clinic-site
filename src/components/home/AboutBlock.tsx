import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { LogoLockup } from "@/components/brand/LogoLockup";
import { buttonClass } from "@/components/ui/button";
import { Reveal } from "@/components/motion/Reveal";

export function AboutBlock() {
  const t = useTranslations("about");

  return (
    <section className="bg-surface py-16 md:py-24">
      <Container width="wide">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* the logo card, reused at scale as a real composition element */}
          <div className="lg:col-span-5">
            <div className="flex aspect-4/5 max-h-[30rem] items-center justify-center rounded-[1.75rem] bg-mint p-8">
              <span className="text-[2.1rem] text-ink">
                <LogoLockup variant="stacked" withTagline ground="#99D1AA" />
              </span>
            </div>
          </div>

          <div className="lg:col-span-7 lg:pt-4">
            <span className="text-2xs font-semibold tracking-[0.2em] text-ink-muted uppercase">
              {t("eyebrow")}
            </span>
            <h2 className="mt-4 text-xl font-semibold text-ink md:text-2xl">{t("title")}</h2>
            <p className="measure mt-5 text-base text-ink-muted">{t("p1")}</p>
            <p className="measure mt-4 text-base text-ink-muted">{t("p2")}</p>

            <Reveal className="mt-9 flex flex-col" stagger={45}>
              {(["one", "two", "three"] as const).map((k) => (
                <div key={k} className="border-t border-ink-faint py-5">
                  <h3 className="font-display text-base font-semibold text-ink">
                    {t(`values.${k}.title`)}
                  </h3>
                  <p className="measure mt-1.5 text-sm text-ink-muted">{t(`values.${k}.text`)}</p>
                </div>
              ))}
            </Reveal>

            <Link href="/about" className={buttonClass({ variant: "outline", className: "mt-7" })}>
              {t("readMore")}
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
