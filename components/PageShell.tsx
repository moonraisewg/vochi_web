"use client";

import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { useLang } from "./LangProvider";
import type { Lang } from "./Nav";

export function PageShell({
  children,
}: {
  children: (lang: Lang) => React.ReactNode;
}) {
  const { lang, setLang } = useLang();
  return (
    <main className="relative">
      <Nav lang={lang} onLangChange={setLang} />
      {children(lang)}
      <Footer lang={lang} />
    </main>
  );
}
