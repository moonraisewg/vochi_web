"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { Lang } from "./Nav";

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

const LangContext = createContext<LangContextValue>({
  lang: "vi",
  setLang: () => {},
});

const COOKIE = "vochi_lang";
const ONE_YEAR = 60 * 60 * 24 * 365;

export function LangProvider({
  initialLang,
  children,
}: {
  initialLang: Lang;
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    document.cookie = `${COOKIE}=${next}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
