import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { SERVICES } from "@/lib/services";

const PATHS = [
  "",
  "/services",
  "/about",
  "/partners/olymp",
  "/gallery",
  "/contacts",
  ...SERVICES.map((s) => `/services/${s.slug}`),
];

/** Both locales, cross-linked with hreflang alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((p) => ({
    url: `${SITE_URL}${p || "/"}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.7,
    alternates: {
      languages: {
        ru: `${SITE_URL}${p || "/"}`,
        kk: `${SITE_URL}/kz${p}`,
      },
    },
  }));
}
