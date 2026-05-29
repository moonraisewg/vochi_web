"use client";

import { useState } from "react";
import { Nav, type Lang } from "./Nav";
import { Footer } from "./Footer";

export function PageShell({
  children,
  initialLang = "vi",
}: {
  children: (lang: Lang) => React.ReactNode;
  initialLang?: Lang;
}) {
  const [lang, setLang] = useState<Lang>(initialLang);
  return (
    <main className="relative">
      <Nav lang={lang} onLangChange={setLang} />
      {children(lang)}
      <Footer lang={lang} />
    </main>
  );
}
