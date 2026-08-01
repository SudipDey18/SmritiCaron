import { useLang } from "@/lib/i18n";
import { Languages } from "lucide-react";

export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLang();
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card/70 p-1 backdrop-blur">
      {!compact && (
        <Languages className="ml-1.5 size-3.5 text-muted-foreground" aria-hidden />
      )}
      {(["bn", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 ${
            lang === l
              ? "bg-primary text-primary-foreground shadow-warm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {l === "bn" ? "বাংলা" : "English"}
        </button>
      ))}
    </div>
  );
}
