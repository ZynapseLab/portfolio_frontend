import { useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import type { ChatMessage as ChatMessageType } from "../../types/chat";

marked.setOptions({
  breaks: true,
  gfm: true,
});

const CURSOR_HTML = '<span class="streaming-cursor"></span>';

const TEXT_TAGS = ["p", "li", "td", "th", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote"];

function injectCursor(html: string): string {
  let bestPos = -1;
  for (const tag of TEXT_TAGS) {
    const needle = `</${tag}>`;
    const pos = html.lastIndexOf(needle);
    if (pos > bestPos) bestPos = pos;
  }
  if (bestPos > -1) {
    return html.slice(0, bestPos) + CURSOR_HTML + html.slice(bestPos);
  }
  return html + CURSOR_HTML;
}

interface Props {
  message: ChatMessageType;
  isStreaming?: boolean;
}

export default function ChatMessage({ message, isStreaming = false }: Props) {
  const isUser = message.role === "user";

  const htmlContent = useMemo(() => {
    if (isUser) return "";
    const raw = marked.parse(message.content, { async: false }) as string;
    const clean = DOMPurify.sanitize(raw);
    return isStreaming ? injectCursor(clean) : clean;
  }, [message.content, isUser, isStreaming]);

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
          <div
            className="chat-markdown break-words"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}
      </div>
    </div>
  );
}
