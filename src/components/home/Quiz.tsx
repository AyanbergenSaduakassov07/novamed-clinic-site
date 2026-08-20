"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { QUIZ, scoreQuiz } from "@/lib/quiz";
import { SERVICES, SERVICE_THEME } from "@/lib/services";
import { Container } from "@/components/ui/container";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";
import { Button, buttonClass } from "@/components/ui/button";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Service matcher.
 *
 * Runs on an ink panel, which is the only full-dark section on the page. That
 * is deliberate: it marks the quiz as an instrument rather than more reading,
 * and white on ink measures 12.26:1.
 *
 * The result is a suggestion, never a diagnosis, and the disclaimer under it
 * says so on every outcome.
 */
export function Quiz() {
  const t = useTranslations("quiz");
  const tS = useTranslations("services");
  const tWa = useTranslations("wa");

  const [picks, setPicks] = useState<number[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);

  const step = picks.length;
  const finished = step >= QUIZ.length;
  const result = finished ? scoreQuiz(picks) : null;
  const resultService = SERVICES.find((s) => s.id === result) ?? null;

  // Slide/fade between questions rather than a hard cut. anime.js is fetched
  // on the first transition, so the quiz costs nothing until it is used.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || prefersReducedMotion()) return;
    let cancelled = false;
    void (async () => {
      const { animate } = await import("animejs");
      if (cancelled || !stageRef.current) return;
      animate(stageRef.current, {
        opacity: [0, 1],
        translateX: [18, 0],
        duration: 260,
        ease: "out(3)",
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [step]);

  const choose = (answerIndex: number) => setPicks((p) => [...p, answerIndex]);
  const back = () => setPicks((p) => p.slice(0, -1));
  const restart = () => setPicks([]);

  const question = !finished ? QUIZ[step] : null;

  return (
    <section className="bg-ink py-16 text-white md:py-24">
      <Container width="normal">
        <div className="flex flex-col gap-3">
          <span className="text-2xs font-semibold tracking-[0.2em] text-mint uppercase">
            {t("eyebrow")}
          </span>
          <h2 className="text-xl font-semibold md:text-2xl">{t("title")}</h2>
          <p className="measure text-base text-white/80">{t("lead")}</p>
        </div>

        {/* progress reads as a fill level, matching the rest of the page */}
        <div className="mt-10 flex items-center gap-4">
          <div
            className="h-2 flex-1 overflow-hidden rounded-full bg-white/15"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={QUIZ.length}
            aria-valuenow={step}
            aria-label={t("progress", { current: Math.min(step + 1, QUIZ.length), total: QUIZ.length })}
          >
            <div
              className="h-full rounded-full bg-mint transition-[width] duration-400 ease-out"
              style={{ width: `${(step / QUIZ.length) * 100}%` }}
            />
          </div>
          <span className="shrink-0 text-sm text-white/70 tabular-nums">
            {finished
              ? `${QUIZ.length}/${QUIZ.length}`
              : t("progress", { current: step + 1, total: QUIZ.length })}
          </span>
        </div>

        <div ref={stageRef} className="mt-8" aria-live="polite">
          {question && (
            <fieldset>
              <legend className="font-display text-lg font-semibold md:text-xl">
                {t(`${question.key}.question`)}
              </legend>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {question.answers.map((a, i) => (
                  <li key={a.key}>
                    <button
                      type="button"
                      onClick={() => choose(i)}
                      className="flex min-h-16 w-full items-center rounded-[1.25rem] border-2
                                 border-white/25 bg-white/5 px-5 py-4 text-left text-base
                                 transition-[background-color,border-color,transform] duration-150 ease-out
                                 hover:border-mint hover:bg-white/12 active:translate-y-px
                                 focus-visible:outline-3 focus-visible:outline-offset-3
                                 focus-visible:outline-mint"
                    >
                      {t(`${question.key}.${a.key}`)}
                    </button>
                  </li>
                ))}
              </ul>
            </fieldset>
          )}

          {finished && resultService && (
            <div>
              <p className="text-sm text-white/70">{t("resultTitle")}</p>
              <div
                className={cn(
                  "mt-3 rounded-[1.75rem] p-7",
                  SERVICE_THEME[resultService.id].surface,
                )}
              >
                <h3 className="font-display text-lg font-semibold md:text-xl">
                  {tS(`${resultService.id}.name`)}
                </h3>
                <p className="mt-2 text-base">
                  {tS(`${resultService.id}.short`)}
                </p>
                <p className="mt-4 text-sm">{t("resultLead")}</p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <WhatsAppLink
                    message={tWa("quiz", { name: tS(`${resultService.id}.name`) })}
                    size="md"
                  >
                    {t("resultCta", { name: tS(`${resultService.id}.name`) })}
                  </WhatsAppLink>
                  <Link
                    href={`/services/${resultService.slug}`}
                    className={buttonClass({ variant: "outline", className: "border-ink/30" })}
                  >
                    {tS("compositionLabel")}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          {step > 0 && !finished && (
            <Button variant="ghost" size="sm" onClick={back} className="text-white hover:bg-white/10">
              <ArrowLeft className="size-4" aria-hidden="true" />
              {t("back")}
            </Button>
          )}
          {finished && (
            <Button variant="ghost" size="sm" onClick={restart} className="text-white hover:bg-white/10">
              <RotateCcw className="size-4" aria-hidden="true" />
              {t("restart")}
            </Button>
          )}
        </div>

        <p className="measure mt-8 border-t border-white/15 pt-6 text-sm text-white/70">
          {t("disclaimer")}
        </p>
      </Container>
    </section>
  );
}
