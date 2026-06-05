"use client";

import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Method } from "@/components/Method";
import { Manifesto } from "@/components/Manifesto";
import { PricingTeaser } from "@/components/PricingTeaser";
import { CtaBand } from "@/components/CtaBand";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { useLang } from "@/components/LangProvider";

export default function Home() {
  const { lang, setLang } = useLang();

  return (
    <main className="relative">
      <Nav lang={lang} onLangChange={setLang} />
      <Hero lang={lang} />
      <Features lang={lang} />
      <CtaBand lang={lang} variant="soft" />
      <Manifesto lang={lang} />
      <Method lang={lang} />
      <CtaBand lang={lang} variant="convert" />
      <PricingTeaser lang={lang} />
      <FAQ lang={lang} />
      <Footer lang={lang} />
      <FloatingActions />
    </main>
  );
}
