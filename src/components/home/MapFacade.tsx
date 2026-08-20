"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import { CONTACTS, mapsUrl } from "@/lib/contacts";
import { Button, buttonClass } from "@/components/ui/button";

/**
 * Click-to-load map.
 *
 * Google's embed sets third-party cookies and pulls a large payload on every
 * page view. Loading it only when someone asks for it keeps the default page
 * private and fast, and the address plus the maps link work regardless.
 */
export function MapFacade() {
  const t = useTranslations("location");
  const [loaded, setLoaded] = useState(false);

  const src = `https://www.google.com/maps?q=${encodeURIComponent(
    CONTACTS.address.query,
  )}&output=embed&hl=ru`;

  return (
    <div className="relative aspect-4/3 w-full overflow-hidden rounded-[1.75rem] bg-mint/45 sm:aspect-16/10">
      {loaded ? (
        <iframe
          src={src}
          title={t("mapAlt")}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <MapPin className="size-8 text-ink" aria-hidden="true" />
          <p className="text-base font-medium text-ink">
            {CONTACTS.address.street}, {CONTACTS.address.city}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button size="sm" onClick={() => setLoaded(true)}>
              {t("mapAlt")}
            </Button>
            <a
              href={mapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass({ variant: "outline", size: "sm" })}
            >
              {t("mapCta")}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
