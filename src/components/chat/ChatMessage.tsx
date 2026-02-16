import type { ChatMessage as ChatMessageType } from "../../types/chat";

interface Props {
  message: ChatMessageType;
  isStreaming?: boolean;
}

export default function ChatMessage({ message, isStreaming = false }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-primary-500 text-white rounded-br-md"
            : "bg-surface-800 text-surface-200 rounded-bl-md light:bg-surface-100 light:text-surface-800"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">
          {message.content}
          {isStreaming && (
            <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-current align-middle" />
          )}
        </p>
      </div>
    </div>
  );
}
