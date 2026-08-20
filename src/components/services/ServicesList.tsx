"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SERVICES, SERVICE_THEME, type PillarId } from "@/lib/services";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

export function ServicesList() {
  const t = useTranslations("services");
  const tP = useTranslations("pillars");
  const [filter, setFilter] = useState<PillarId | null>(null);

  const shown = filter ? SERVICES.filter((s) => s.id === filter) : SERVICES;

  return (
    <section className="bg-surface pb-16 md:pb-24">
      <Container width="wide">
        <div role="group" aria-label={t("filterLabel")} className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter(null)}
            aria-pressed={filter === null}
            className={cn(
              "inline-flex min-h-11 items-center rounded-full border-2 px-5 text-sm",
              "transition-colors duration-150 focus-visible:outline-3",
              "focus-visible:outline-offset-3 focus-visible:outline-ink",
              filter === null
                ? "border-transparent bg-ink font-medium text-white"
                : "border-ink/20 text-ink hover:border-ink/45",
            )}
          >
            {t("filterAll")}
          </button>

          {SERVICES.map((s) => {
            const on = filter === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setFilter(on ? null : s.id)}
                aria-pressed={on}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-5 text-sm",
                  "transition-colors duration-150 focus-visible:outline-3",
                  "focus-visible:outline-offset-3 focus-visible:outline-ink",
                  on
                    ? cn(SERVICE_THEME[s.id].surface, "border-transparent font-medium")
                    : "border-ink/20 text-ink hover:border-ink/45",
                )}
              >
                <span
                  aria-hidden="true"
                  className="size-2.5 rounded-full"
                  style={{ background: SERVICE_THEME[s.id].hex.fg }}
                />
                {t(`${s.id}.name`)}
              </button>
            );
          })}
        </div>

        <ul className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((s) => {
            const theme = SERVICE_THEME[s.id];
            return (
              <li key={s.id}>
                <Link
                  href={`/services/${s.slug}`}
                  className={cn(
                    "group relative flex h-full min-h-[20rem] flex-col overflow-hidden",
                    "rounded-[1.75rem] p-7 focus-visible:outline-3",
                    "focus-visible:outline-offset-3 focus-visible:outline-ink",
                    theme.surface,
                  )}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] translate-y-full
                               transition-transform duration-300 ease-out
                               group-hover:translate-y-0 group-focus-visible:translate-y-0"
                  >
                    <svg viewBox="0 0 400 26" preserveAspectRatio="none" className="block h-5 w-full">
                      <path
                        d="M0 0 C25 1 42 17 200 18 C358 17 375 1 400 0 L400 26 L0 26 Z"
                        fill={theme.hex.fg}
                      />
                    </svg>
                    <div className="h-full w-full" style={{ background: theme.hex.fg }} />
                  </div>

                  <div className="relative">
                    <h2 className="font-display text-lg font-semibold">{t(`${s.id}.name`)}</h2>
                    <p className="mt-3 text-base">{t(`${s.id}.short`)}</p>
                  </div>

                  <div className="relative mt-auto flex items-end justify-between gap-4 pt-8">
                    <span className="text-sm font-medium">
                      {t("durationValue", { min: s.durationMin[0], max: s.durationMin[1] })}
                    </span>
                    <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-ink transition-transform duration-250 ease-out group-hover:-translate-y-1">
                      <ArrowUpRight className="size-5" aria-hidden="true" />
                      <span className="sr-only">{tP("more")}</span>
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
