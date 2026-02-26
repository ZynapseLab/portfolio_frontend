import { useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import type { ChatMessage as ChatMessageType } from "../../types/chat";

marked.setOptions({
  breaks: true,
  gfm: true,
});

interface Props {
  message: ChatMessageType;
  isStreaming?: boolean;
}

export default function ChatMessage({ message, isStreaming = false }: Props) {
  const isUser = message.role === "user";

  const htmlContent = useMemo(() => {
    if (isUser) return "";
    const raw = marked.parse(message.content, { async: false }) as string;
    return DOMPurify.sanitize(raw);
  }, [message.content, isUser]);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-primary-500 text-white rounded-br-md"
            : "bg-th-bg-subtle text-th-text-strong rounded-bl-md"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        ) : (
          <div className="chat-markdown break-words">
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            {isStreaming && (
              <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-current align-middle" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
