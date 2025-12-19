"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Language, getTranslation } from "@/lib/i18n"
import { getLanguagePreference, setLanguagePreference } from "@/lib/auth"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const defaultContextValue: LanguageContextType = {
  language: "en",
  setLanguage: () => {},
  t: (key: string) => getTranslation("en", key),
}

const LanguageContext = createContext<LanguageContextType>(defaultContextValue)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLang] = useState<Language>("en")

  useEffect(() => {
    const saved = getLanguagePreference() as Language
    if (saved) setLang(saved)
  }, [])

  const setLanguage = (lang: Language) => {
    setLang(lang)
    setLanguagePreference(lang)
  }

  const t = (key: string) => getTranslation(language, key)

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}
