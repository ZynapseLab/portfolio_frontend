import { useState, useRef, useCallback } from "react";

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
  isStreaming?: boolean;
}

export default function ChatInput({ onSend, disabled = false, isStreaming = false }: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled || isStreaming) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, disabled, isStreaming, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const isDisabled = disabled || isStreaming;

  return (
    <div className="flex items-end gap-2 rounded-xl border border-surface-700 bg-surface-800/50 p-2 transition-colors focus-within:border-primary-500/50 light:border-surface-300 light:bg-white light:focus-within:border-primary-400">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
        placeholder={
          disabled
            ? "Límite diario alcanzado"
            : "Escribe tu mensaje..."
        }
        rows={1}
        className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-surface-100 placeholder-surface-500 outline-none disabled:cursor-not-allowed disabled:opacity-50 light:text-surface-900 light:placeholder-surface-400"
      />
      <button
        onClick={handleSubmit}
        disabled={isDisabled || !value.trim()}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-500 text-white transition-all hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-40 active:scale-95"
        aria-label="Enviar mensaje"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
        </svg>
      </button>
    </div>
  );
}
