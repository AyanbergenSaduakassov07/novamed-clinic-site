/**
 * Namespaces that actually reach the browser.
 *
 * NextIntlClientProvider serialises whatever it is given into the HTML. With no
 * `messages` prop that is the entire catalogue, including long server-only text
 * like the FAQ answers, the safety list and the walkthrough, none of which any
 * client component reads.
 *
 * Keep this in sync when a client component starts using a new namespace: a
 * missing entry surfaces as a next-intl "missing message" error in dev.
 */
export const CLIENT_NAMESPACES = [
  "nav",      // Nav
  "wa",       // every WhatsApp CTA
  "hero",     // Hero
  "trust",    // Hero trust bar
  "services", // Hero chips, Quiz result, ServicesList
  "pillars",  // Hero chips, ServicesList
  "quiz",     // Quiz
  "dock",     // ContactDock
  "loader",   // Loader
  "contacts", // ContactForm
  "location", // MapFacade
] as const;

type Messages = Record<string, unknown>;

export function pickClientMessages(all: Messages): Messages {
  const out: Messages = {};
  for (const ns of CLIENT_NAMESPACES) {
    if (ns in all) out[ns] = all[ns];
  }
  return out;
}
