import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { Pillars } from "@/components/home/Pillars";
import { Quiz } from "@/components/home/Quiz";
import { AboutBlock } from "@/components/home/AboutBlock";
import { Safety } from "@/components/home/Safety";
import { OlympStrip } from "@/components/home/OlympStrip";
import { WhatToExpect } from "@/components/home/WhatToExpect";
import { GalleryStrip } from "@/components/home/GalleryStrip";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import { Faq } from "@/components/home/Faq";
import { LocationWayfinding } from "@/components/home/LocationWayfinding";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Pillars />
      <Quiz />
      <AboutBlock />
      <Safety />
      <OlympStrip />
      <WhatToExpect />
      <GalleryStrip />
      <InstagramFeed />
      <Faq />
      <LocationWayfinding />
    </>
  );
}
