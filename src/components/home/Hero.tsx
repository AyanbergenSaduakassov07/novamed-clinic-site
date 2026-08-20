"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { ArrowRight, ShieldCheck, Stethoscope, Clock, FileCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SERVICES, SERVICE_THEME, type PillarId } from "@/lib/services";
import { Container } from "@/components/ui/container";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";
import { buttonClass } from "@/components/ui/button";
import { Meniscus } from "@/components/Meniscus";
import { IVStandFallback } from "./IVStandFallback";
import { cn } from "@/lib/utils";

/** WebGL is heavy; keep it out of the initial bundle and off the server. */
const IVStandScene = dynamic(
  () => import("./IVStandScene").then((m) => m.IVStandScene),
  { ssr: false, loading: () => <IVStandFallback /> },
);

/**
 * Decides whether this visit gets WebGL at all.
 *
 * three.js is ~230KB transferred and ~520ms of script evaluation on a
 * mid-range phone. The SVG fallback is a complete picture of the same stand,
 * and the three pillar buttons below the scene expose the identical
 * interaction, so the canvas is a genuine enhancement rather than the content.
 *
 * The rules, in order:
 *   prefers-reduced-motion  never upgrade. The scene's value is the sway and
 *                           the hover swell; a 3D engine rendering a still
 *                           image is pure cost.
 *   fine pointer, >=1024px  upgrade when the browser goes idle. Hover is the
 *                           scene's main affordance and these machines have
 *                           the budget for it.
 *   everything else         upgrade on first touch of the scene. Someone who
 *                           reaches for a bag gets the real thing; someone who
 *                           scrolls past never pays for it.
 *
 * Set FORCE_SCENE_EVERYWHERE to true to always upgrade at idle.
 */
const FORCE_SCENE_EVERYWHERE = false;

function useSceneUpgrade(): { webgl: boolean; arm: () => void } {
  const [webgl, setWebgl] = useState(false);

  const arm = () => setWebgl(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const capable =
      FORCE_SCENE_EVERYWHERE ||
      (window.matchMedia("(pointer: fine)").matches && window.innerWidth >= 1024);
    if (!capable) return;

    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (h: number) => void;
    };
    const w = window as IdleWindow;

    let idleHandle: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (w.requestIdleCallback) {
      idleHandle = w.requestIdleCallback(() => setWebgl(true), { timeout: 2500 });
    } else {
      timer = setTimeout(() => setWebgl(true), 1200);
    }

    return () => {
      if (idleHandle !== undefined) w.cancelIdleCallback?.(idleHandle);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return { webgl, arm };
}

const TRUST_ICONS = {
  doctor: Stethoscope,
  sterile: ShieldCheck,
  licence: FileCheck,
  time: Clock,
} as const;

export function Hero() {
  const t = useTranslations("hero");
  const tWa = useTranslations("wa");
  const tS = useTranslations("services");
  const tP = useTranslations("pillars");
  const tTrust = useTranslations("trust");

  const [active, setActive] = useState<PillarId | null>(null);
  const activeService = SERVICES.find((s) => s.id === active) ?? null;
  const { webgl, arm } = useSceneUpgrade();

  return (
    <section className="relative overflow-hidden bg-surface pt-28 md:pt-32">
      <Container width="wide" className="relative">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-6 lg:pb-24">
            <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
              {t("h1")}
            </h1>
            <p className="measure mt-6 text-base text-ink-muted">{t("lead")}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <WhatsAppLink message={tWa("general")} size="lg">
                {t("ctaPrimary")}
              </WhatsAppLink>
              <Link
                href="/services"
                className={buttonClass({ variant: "outline", size: "lg" })}
              >
                {t("ctaSecondary")}
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div
              onPointerDown={webgl ? undefined : arm}
              className="relative mx-auto -mb-20 h-[360px] w-full max-w-[520px] sm:h-[440px] lg:-mb-28 lg:h-[560px]"
            >
              {webgl ? (
                <IVStandScene active={active} onSelect={setActive} />
              ) : (
                <IVStandFallback />
              )}
            </div>
          </div>
        </div>
      </Container>

      {/* the pool. ink on mint = 7.04:1 */}
      <div className="relative z-10">
        <Meniscus fill="var(--color-mint)" className="h-8 md:h-14" />
        <div className="bg-mint pt-2 pb-12 md:pb-16">
          <Container width="wide">
            {/* The keyboard and screen-reader path into the same state the
                canvas drives. Also the primary control on touch. */}
            <div className="relative">
              <p className="mb-3 text-center text-2xs font-medium tracking-[0.14em] text-ink uppercase">
                {t("sceneHint")}
              </p>
              <ul className="flex flex-wrap justify-center gap-2">
                {SERVICES.map((s) => {
                  const on = active === s.id;
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => setActive(on ? null : s.id)}
                        aria-pressed={on}
                        className={cn(
                          "inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm",
                          "border-2 transition-all duration-150 ease-out",
                          "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink",
                          on
                            ? cn(SERVICE_THEME[s.id].surface, "border-transparent font-medium")
                            : "border-ink/20 bg-white/70 text-ink hover:border-ink/45",
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className="size-2.5 rounded-full"
                          style={{ background: SERVICE_THEME[s.id].hex.fg }}
                        />
                        {tS(`${s.id}.name`)}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* the selected pillar's detail, surfaced inline */}
              <div aria-live="polite" className="mt-4 min-h-[1px]">
                {activeService && (
                  <div
                    className={cn(
                      "mx-auto max-w-md rounded-[1.25rem] p-5",
                      SERVICE_THEME[activeService.id].surface,
                    )}
                  >
                    <p className="text-sm font-medium">
                      {tS(`${activeService.id}.short`)}
                    </p>
                    <p className="mt-1 text-2xs font-medium">
                      {tS("durationValue", {
                        min: activeService.durationMin[0],
                        max: activeService.durationMin[1],
                      })}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href={`/services/${activeService.slug}`}
                        className={buttonClass({ variant: "primary", size: "sm" })}
                      >
                        {tP("more")}
                      </Link>
                      <WhatsAppLink
                        message={tWa("service", { name: tS(`${activeService.id}.name`) })}
                        variant="outline"
                        size="sm"
                        withIcon={false}
                        className="border-ink/30"
                      >
                        {tP("book")}
                      </WhatsAppLink>
                    </div>
                  </div>
                )}
              </div>
            </div>

        {/* trust bar */}
        <div className="relative mt-10 md:mt-14">
          <h2 className="sr-only">{tTrust("title")}</h2>
          <ul className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            {(["doctor", "sterile", "licence", "time"] as const).map((k) => {
              const Icon = TRUST_ICONS[k];
              return (
                <li key={k} className="flex gap-3">
                  <Icon className="mt-0.5 size-6 shrink-0 text-ink" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-ink">{tTrust(`items.${k}.label`)}</p>
                    <p className="mt-0.5 text-sm text-ink">{tTrust(`items.${k}.detail`)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
            </div>
          </Container>
        </div>
        <Meniscus fill="var(--color-surface)" flip />
      </div>
    </section>
  );
}
