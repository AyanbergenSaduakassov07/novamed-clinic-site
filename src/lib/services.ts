/**
 * The three NovaMed pillars.
 *
 * Only non-translatable, structural data lives here. Every name, description
 * and composition string is in messages/{ru,kk}.json under `services.<id>`,
 * so the clinic edits copy in one place per language.
 *
 * CLINIC TO CONFIRM
 *   price          — currently null everywhere. While null the UI renders
 *                    "Цену уточним на консультации" instead of a number, which
 *                    is the honest default rather than a fake figure.
 *   composition    — currently an empty array in both message files. While
 *                    empty the detail page renders "Состав подбирает врач на
 *                    консультации". Fill the array and the list appears.
 *   durationMin    — session length in minutes. Operational, not clinical,
 *                    but worth a sanity check against real appointments.
 */

export type PillarId = "mame" | "zolushka" | "detox";

export interface Service {
  id: PillarId;
  slug: string;
  /** [min, max] session length in minutes, chair time included. */
  durationMin: readonly [number, number];
  /** Tenge. `null` renders the consultation fallback. */
  price: number | null;
}

export const SERVICES: readonly Service[] = [
  { id: "mame", slug: "mame-mozhno", durationMin: [30, 45], price: null },
  { id: "zolushka", slug: "zolushka", durationMin: [40, 60], price: null },
  { id: "detox", slug: "detoks-plus", durationMin: [45, 60], price: null },
] as const;

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

/**
 * Static class + hex map per pillar.
 *
 * Tailwind cannot resolve `bg-${id}-bg` at build time, so every class is
 * written out. The pairings follow the colour contract in globals.css:
 * anything FILLED uses `*-bg` with ink text; `*-fg` is accent-only.
 */
export const SERVICE_THEME: Record<
  PillarId,
  {
    /** Filled card / button surface. Always paired with ink text. */
    surface: string;
    /** Accent: borders >=2px, icon strokes, liquid fill, progress. */
    accent: string;
    accentText: string;
    accentBorder: string;
    ring: string;
    /** Raw values for the WebGL scene and inline SVG. */
    hex: { bg: string; fg: string };
  }
> = {
  mame: {
    surface: "bg-mame-bg text-ink",
    accent: "bg-mame-fg",
    accentText: "text-mame-fg",
    accentBorder: "border-mame-fg",
    ring: "focus-visible:outline-mame-fg",
    hex: { bg: "#FBB5CF", fg: "#FF3882" },
  },
  zolushka: {
    surface: "bg-zolushka-bg text-ink",
    accent: "bg-zolushka-fg",
    accentText: "text-zolushka-fg",
    accentBorder: "border-zolushka-fg",
    ring: "focus-visible:outline-zolushka-fg",
    hex: { bg: "#4FAABC", fg: "#2F8192" },
  },
  detox: {
    surface: "bg-detox-bg text-ink",
    accent: "bg-detox-fg",
    accentText: "text-detox-fg",
    accentBorder: "border-detox-fg",
    ring: "focus-visible:outline-detox-fg",
    hex: { bg: "#87C764", fg: "#5BA632" },
  },
};

/** Formats a price, or returns null so the caller can render the fallback. */
export function formatPrice(price: number | null, locale: string): string | null {
  if (price === null) return null;
  return new Intl.NumberFormat(locale === "kk" ? "kk-KZ" : "ru-KZ", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  }).format(price);
}
