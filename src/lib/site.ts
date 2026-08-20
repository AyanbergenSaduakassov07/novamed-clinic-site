/**
 * Canonical origin. hreflang and rel=canonical must be absolute URLs, so this
 * has to be right in production or both tags are invalid.
 *
 * Set NEXT_PUBLIC_SITE_URL in Vercel once the domain is registered.
 * novamed.kz was available at time of writing.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://novamed.kz";

import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";

/**
 * Per-page canonical and hreflang.
 *
 * Sub-pages inherit `alternates` from the root layout unless they set their
 * own, which silently pointed every page's canonical at the homepage and would
 * have had Google treat them all as duplicates of "/". Every generateMetadata
 * on a page must go through here.
 *
 * @param path route without the locale prefix, e.g. "/services" or "/"
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  path: string;
  title: string;
  description?: string;
}): Metadata {
  const clean = path === "/" ? "" : path.replace(/\/$/, "");
  const ru = clean || "/";
  const kk = `/kz${clean}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: locale === "ru" ? ru : kk,
      languages: { ru, kk, "x-default": ru },
    },
    openGraph: {
      title,
      description,
      url: locale === "ru" ? ru : kk,
      locale: locale === "ru" ? "ru_RU" : "kk_KZ",
      type: "website",
      siteName: "NovaMed",
    },
  };
}
