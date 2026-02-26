import { useTranslations } from "../../i18n/utils";
import type { Lang } from "../../i18n/utils";

interface Props {
  scope: string;
  onSelect: (text: string) => void;
  lang?: Lang;
}

export default function SuggestionList({ scope, onSelect, lang = "es" }: Props) {
  const t = useTranslations(lang);

  const globalSuggestions = [
    t("suggestions.global.1"),
    t("suggestions.global.2"),
    t("suggestions.global.3"),
    t("suggestions.global.4"),
  ];

  const developerSuggestions = [
    t("suggestions.developer.1"),
    t("suggestions.developer.2"),
    t("suggestions.developer.3"),
    t("suggestions.developer.4"),
  ];

  const suggestions = scope === "global" ? globalSuggestions : developerSuggestions;

  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((text) => (
        <button
          key={text}
          onClick={() => onSelect(text)}
          className="rounded-full border border-th-border-strong bg-th-bg-subtle px-3 py-1.5 text-xs text-th-text-sub transition-all hover:border-primary-500/40 hover:bg-th-primary-soft hover:text-th-primary active:scale-95"
        >
          {text}
        </button>
      ))}
    </div>
  );
}
