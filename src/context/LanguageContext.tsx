
import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "fr" | "en";

export interface LanguageContextProps {
  language: string;
  changeLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    "dashboard.loading": "Chargement...",
    "dashboard.title": "Tableau de bord",
    "team.title": "Notre équipe",
    "team.subtitle": "Découvrez les personnes qui travaillent chaque jour pour améliorer votre expérience de trading.",
    "currency.EUR": "Euro",
    "currency.USD": "Dollar américain",
    "currency.GBP": "Livre sterling"
  },
  en: {
    "dashboard.loading": "Loading...",
    "dashboard.title": "Dashboard",
    "team.title": "Our Team",
    "team.subtitle": "Meet the people who work every day to improve your trading experience.",
    "currency.EUR": "Euro",
    "currency.USD": "US Dollar",
    "currency.GBP": "British Pound"
  }
};

const LanguageContext = createContext<LanguageContextProps>({
  language: "fr",
  changeLanguage: () => {},
  t: () => "",
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>(() => {
    return localStorage.getItem("language") || "fr";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // Traduire une clé dans la langue actuelle
  const t = (key: string): string => {
    const lang = language.substring(0, 2) as "fr" | "en";
    return translations[lang][key as keyof typeof translations["fr"]] || key;
  };

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
