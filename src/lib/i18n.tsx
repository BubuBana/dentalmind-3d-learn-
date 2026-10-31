import * as React from "react";
import { LANGS, type Lang, type L } from "./teeth";
import type { BaseKey } from "./i18n.base";
import type { V2Key } from "./i18n.v2";
import { DICTS, type ExtraKey } from "./i18n.dict";

export type { Lang };

export type TKey = BaseKey | V2Key | ExtraKey | `lang.${Lang}`;

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TKey, vars?: Record<string, string | number>) => string;
  loc: (v: L) => string;
  /** Secondary language shown next to terms when "bilingual terms" is enabled. */
  other: Lang;
  setOther: (l: Lang) => void;
};

const LanguageContext = React.createContext<Ctx | null>(null);
const STORAGE_KEY = "dentalmind3d.lang";
const OTHER_KEY = "dentalmind3d.lang2";

const isLang = (v: unknown): v is Lang => typeof v === "string" && (LANGS as readonly string[]).includes(v);

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable (private mode): keep the in-memory choice */
  }
}

/** Default secondary language: Italian ↔ German, otherwise Italian. */
const defaultOther = (l: Lang): Lang => (l === "it" ? "de" : "it");

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>("it");
  const [other, setOtherState] = React.useState<Lang>("de");

  React.useEffect(() => {
    const saved = read(STORAGE_KEY);
    let initial: Lang = "it";
    if (isLang(saved)) initial = saved;
    else if (typeof navigator !== "undefined") {
      const nav = navigator.language?.slice(0, 2);
      if (isLang(nav)) initial = nav;
    }
    setLangState(initial);
    const savedOther = read(OTHER_KEY);
    setOtherState(isLang(savedOther) && savedOther !== initial ? savedOther : defaultOther(initial));
  }, []);

  React.useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = React.useCallback((l: Lang) => {
    setLangState(l);
    write(STORAGE_KEY, l);
    setOtherState((o) => (o === l ? defaultOther(l) : o));
  }, []);

  const setOther = React.useCallback((l: Lang) => {
    setOtherState(l);
    write(OTHER_KEY, l);
  }, []);

  const value = React.useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      other,
      setOther,
      t: (key, vars) => {
        let s: string = DICTS[lang][key] ?? DICTS.it[key] ?? key;
        if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
        return s;
      },
      loc: (v: L) => v[lang] ?? v.it,
    }),
    [lang, setLang, other, setOther],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n(): Ctx {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) throw new Error("useI18n must be used inside LanguageProvider");
  return ctx;
}
