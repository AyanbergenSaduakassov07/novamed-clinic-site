import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/site";
import { pickClientMessages } from "@/i18n/client-namespaces";
import { golos, unbounded } from "../fonts";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ContactDock } from "@/components/layout/ContactDock";
import { Loader } from "@/components/Loader";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return pageMetadata({
    locale,
    path: "/",
    title: t("title"),
    description: t("description"),
  });
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  // Only the namespaces client components read are serialised into the page.
  const messages = pickClientMessages(await getMessages());

  return (
    // suppressHydrationWarning: the inline script below adds `js` to this
    // element before hydration, so its class list intentionally differs from
    // the server HTML. Scoped to this element's own attributes only.
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${unbounded.variable} ${golos.variable}`}
    >
      <head>
        {/*
          Marks that JS is alive BEFORE first paint. `.reveal` only hides its
          content under `html.js`, so a failed or slow bundle leaves the page
          fully readable instead of blank. Must stay inline and stay here.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Loader />
          <SmoothScroll />
          <Nav />
          {/* tabIndex allows the skip link to move focus here. */}
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <ContactDock />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
