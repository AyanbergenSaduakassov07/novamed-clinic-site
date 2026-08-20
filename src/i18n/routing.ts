import { defineRouting } from "next-intl/routing";

/**
 * Russian is the default and lives at the root (`/`, `/services`).
 * Kazakh is served under `/kz` per the brief and the convention KDL Olymp's
 * own national site uses.
 *
 * The locale code is `kk` (ISO 639-1 for Kazakh) so `<html lang>` and hreflang
 * are correct; only the URL prefix is `/kz`, which is a country code.
 */
export const routing = defineRouting({
  locales: ["ru", "kk"],
  defaultLocale: "ru",
  localePrefix: {
    mode: "as-needed",
    prefixes: { kk: "/kz" },
  },
});

export type Locale = (typeof routing.locales)[number];
