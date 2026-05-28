"use client";

import { useState } from "react";
import { Nav, type Lang } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Manifesto } from "@/components/Manifesto";
import { PricingTeaser } from "@/components/PricingTeaser";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

export default function Home() {
  const [lang, setLang] = useState<Lang>("vi");

  return (
    <main className="relative">
      <Nav lang={lang} onLangChange={setLang} />
      <Hero lang={lang} />
      <Features lang={lang} />
      <Manifesto lang={lang} />
      <PricingTeaser lang={lang} />
      <FAQ lang={lang} />
      <Footer lang={lang} />
    </main>
  );
}
