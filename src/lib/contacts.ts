/**
 * Single source of truth for every way a patient can reach NovaMed.
 * Nothing here is duplicated in a component — nav, dock, cards, footer and
 * detail pages all read these values and call `whatsappUrl()`.
 */

/** Digits only, international format, no `+` — the shape wa.me expects. */
const WHATSAPP_NUMBER = "77760402388";

export const CONTACTS = {
  /** For `tel:` hrefs. */
  phoneHref: "tel:+77760402388",
  /** For display. Kazakh convention groups the last six digits 3-2-2. */
  phoneDisplay: "+7 776 040-23-88",
  instagram: "https://instagram.com/novamed_aktobe",
  instagramHandle: "@novamed_aktobe",
  address: {
    street: "ул. Есета Котибарулы, 1а",
    district: "Жибек Жолы ж/м, Алматы район",
    city: "Актобе",
    /** Used for the map link and the LocalBusiness schema. */
    query: "Актобе, улица Есета Котибарулы 1а",
  },
} as const;

export const OLYMP = {
  name: "KDL Olymp",
  phoneHref: "tel:+77020528585",
  phoneDisplay: "+7 702 052-85-85",
  website: "https://kdlolymp.kz",
  websiteDisplay: "kdlolymp.kz",
} as const;

/**
 * Build a wa.me deep link, optionally pre-filling the chat.
 *
 * Every booking CTA on the site routes through here, so the number and the
 * encoding live in exactly one place. Pass the already-translated message so
 * the pre-fill matches the page the patient is reading.
 *
 * @example
 * whatsappUrl("Здравствуйте! Хочу записаться на процедуру «Золушка».")
 * // https://wa.me/77760402388?text=%D0%97%D0%B4%D1%80...
 */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!message?.trim()) return base;
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}

/** Google Maps link for the clinic address. */
export function mapsUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    CONTACTS.address.query,
  )}`;
}
