import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const KEYS = [
  "pain", "duration", "who", "contra", "prepare", "drive", "course", "children",
] as const;

/**
 * Built on <details>/<summary> rather than a JS accordion: it is keyboard
 * operable, screen-reader correct, and openable with JS disabled, for free.
 * The open animation degrades to an instant toggle where ::details-content is
 * unsupported.
 */
export function Faq() {
  const t = useTranslations("faq");

  return (
    <section className="bg-surface py-16 md:py-24">
      <Container width="narrow">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />

        <div className="mt-10">
          {KEYS.map((k) => (
            <details key={k} className="group border-t border-ink-faint last:border-b">
              <summary
                className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4
                           py-4 text-base font-medium text-ink transition-colors duration-150
                           hover:text-ink-muted focus-visible:outline-3 focus-visible:outline-offset-2
                           focus-visible:outline-ink [&::-webkit-details-marker]:hidden"
              >
                {t(`items.${k}.q`)}
                <Plus
                  aria-hidden="true"
                  className="size-5 shrink-0 text-ink-muted transition-transform duration-250
                             ease-out group-open:rotate-45"
                />
              </summary>
              <div className="faq-body pb-5 text-base text-ink-muted">{t(`items.${k}.a`)}</div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
