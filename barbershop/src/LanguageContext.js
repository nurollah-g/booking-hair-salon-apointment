import { createContext, useContext, useState } from "react";
import { translations } from "./i18n";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(
    localStorage.getItem("lang") || "en"
  );

  const switchLang = (l) => {
    setLang(l);
    localStorage.setItem("lang", l);
  };

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
