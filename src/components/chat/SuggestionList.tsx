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
          className="rounded-full border border-th-border-strong bg-th-bg-subtle px-3 py-1.5 text-xs text-th-text-sub transition-all hover:border-primary-500/40 hover:bg-th-primary-soft hover:text-th-primary active:scale-95"
        >
          {text}
        </button>
      ))}
    </div>
  );
}
