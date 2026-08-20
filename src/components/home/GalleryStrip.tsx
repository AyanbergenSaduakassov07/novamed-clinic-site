import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { GALLERY } from "@/lib/gallery";
import { CONTACTS } from "@/lib/contacts";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonClass } from "@/components/ui/button";
import { InstagramIcon } from "@/components/ui/icons";

export function GalleryStrip() {
  const t = useTranslations("gallery");

  return (
    <section className="bg-surface py-16 md:py-24">
      <Container width="wide">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
          {GALLERY.length > 0 && (
            <Link href="/gallery" className={buttonClass({ variant: "outline" })}>
              {t("viewAll")}
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
          )}
        </div>

        {GALLERY.length === 0 ? (
          <div className="mt-10 rounded-[1.75rem] border-2 border-dashed border-ink-faint px-6 py-14 text-center">
            <p className="measure mx-auto text-base text-ink-muted">{t("empty")}</p>
            <a
              href={CONTACTS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass({ variant: "primary", className: "mt-6" })}
            >
              <InstagramIcon className="size-5" />
              {t("emptyCta")}
            </a>
          </div>
        ) : (
          <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {GALLERY.slice(0, 4).map((p) => (
              <li key={p.src} className="overflow-hidden rounded-[1.25rem] bg-mint/40">
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={p.width}
                  height={p.height}
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="h-full w-full object-cover"
                />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
