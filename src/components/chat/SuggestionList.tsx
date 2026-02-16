interface Props {
  scope: string;
  onSelect: (text: string) => void;
}

const globalSuggestions = [
  "¿Qué servicios de IA ofrecen?",
  "¿Cuál es su experiencia con LLMs?",
  "¿Han trabajado con sistemas RAG?",
  "¿Cómo puedo contactarlos?",
];

const developerSuggestions: Record<string, string[]> = {
  jonathan: [
    "¿Cuáles son tus habilidades principales?",
    "¿Qué proyectos de IA has desarrollado?",
    "¿Con qué tecnologías trabajas?",
    "Cuéntame sobre tu experiencia",
  ],
  pablo: [
    "¿Cuáles son tus habilidades principales?",
    "¿Qué proyectos de IA has desarrollado?",
    "¿Con qué tecnologías trabajas?",
    "Cuéntame sobre tu experiencia",
  ],
};

export default function SuggestionList({ scope, onSelect }: Props) {
  const suggestions =
    scope === "global"
      ? globalSuggestions
      : developerSuggestions[scope] ?? globalSuggestions;

  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((text) => (
        <button
          key={text}
          onClick={() => onSelect(text)}
          className="rounded-full border border-surface-700 bg-surface-800/50 px-3 py-1.5 text-xs text-surface-300 transition-all hover:border-primary-500/40 hover:bg-primary-500/10 hover:text-primary-300 active:scale-95 light:border-surface-300 light:bg-surface-100 light:text-surface-600 light:hover:border-primary-400/40 light:hover:bg-primary-50 light:hover:text-primary-600"
        >
          {text}
        </button>
      ))}
    </div>
  );
}
