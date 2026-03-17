import { useLanguage } from "@/contexts/LanguageContext";

const LanguageToggle = () => {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === "en" ? "am" : "en")}
      className="px-3 py-1.5 rounded-full text-xs font-semibold border border-border bg-card text-card-foreground hover:bg-muted transition-colors"
      aria-label="Toggle language"
    >
      {lang === "en" ? "አማ" : "EN"}
    </button>
  );
};

export default LanguageToggle;
