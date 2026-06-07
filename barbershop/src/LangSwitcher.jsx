import { useLang } from "./LanguageContext";

export default function LangSwitcher() {
  const { lang, switchLang } = useLang();

  return (
    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-1 py-1">
      <button
        onClick={() => switchLang("en")}
        className={`px-3 py-1 rounded-full text-xs tracking-wider transition-all duration-200 ${
          lang === "en"
            ? "bg-white text-black font-semibold"
            : "text-white/60 hover:text-white"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLang("de")}
        className={`px-3 py-1 rounded-full text-xs tracking-wider transition-all duration-200 ${
          lang === "de"
            ? "bg-white text-black font-semibold"
            : "text-white/60 hover:text-white"
        }`}
      >
        DE
      </button>
    </div>
  );
}
