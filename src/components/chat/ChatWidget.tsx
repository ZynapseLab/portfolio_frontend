import { useState, useRef, useCallback, useEffect } from "react";
import type { ChatMessage as ChatMessageType, UsageInfo } from "../../types/chat";
import { sendMessage, deleteConversation } from "../../services/chatService";
import { ToastProvider, useToast } from "../ui/Toast";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import SuggestionList from "./SuggestionList";
import UsageBar from "./UsageBar";
import TypingIndicator from "./TypingIndicator";

interface Props {
  scope: string;
}

function ChatWidgetInner({ scope }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [usage, setUsage] = useState<UsageInfo>({ used: 0, limit: 10, resetAt: "" });
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const { addToast } = useToast();

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isWaiting, scrollToBottom]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    requestAnimationFrame(() => setIsAnimating(true));
  }, []);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => setIsOpen(false), 200);
  }, []);

  const isLimitReached = usage.used >= usage.limit;

  const handleSend = useCallback(
    async (text: string) => {
      if (isStreaming || isLimitReached) return;

      const userMsg: ChatMessageType = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setError(null);
      setIsWaiting(true);

      const assistantId = crypto.randomUUID();
      let started = false;

      abortRef.current = new AbortController();

      await sendMessage(
        text,
        scope,
        {
          onToken: (token) => {
            if (!started) {
              started = true;
              setIsWaiting(false);
              setIsStreaming(true);
              setMessages((prev) => [
                ...prev,
                { id: assistantId, role: "assistant", content: token, timestamp: Date.now() },
              ]);
            } else {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: m.content + token } : m
                )
              );
            }
          },
          onDone: () => {
            setIsStreaming(false);
            setIsWaiting(false);
          },
          onUsage: (info) => {
            setUsage(info);
            if (info.used >= info.limit) {
              addToast("Has alcanzado el límite diario de mensajes.", "error");
            }
          },
          onError: (errMsg) => {
            setError(errMsg);
            setIsStreaming(false);
            setIsWaiting(false);
            addToast(errMsg, "error");
          },
        },
        abortRef.current.signal
      );
    },
    [scope, isStreaming, isLimitReached, addToast]
  );

  const handleDelete = useCallback(async () => {
    const success = await deleteConversation(scope);
    if (success) {
      setMessages([]);
      setShowDeleteConfirm(false);
      setError(null);
      addToast("Conversación borrada correctamente.", "success");
    } else {
      addToast("No se pudo borrar la conversación.", "error");
    }
  }, [scope, addToast]);

  return (
    <>
      {/* Floating toggle button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/25 transition-all hover:shadow-primary-500/40 hover:scale-105 active:scale-95"
          aria-label="Abrir chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex h-[520px] w-[380px] flex-col overflow-hidden rounded-2xl border border-surface-800/60 bg-surface-950 shadow-2xl transition-all duration-200 sm:h-[580px] sm:w-[420px] light:border-surface-200 light:bg-white light:shadow-xl ${
            isAnimating
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-95 opacity-0 translate-y-4"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-surface-800/50 bg-surface-900/50 px-4 py-3 light:border-surface-200 light:bg-surface-50">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 text-xs font-bold text-white">
                AI
              </div>
              <div>
                <p className="text-sm font-semibold text-surface-100 light:text-surface-900">
                  Zynapse Assistant
                </p>
                <p className="text-xs text-surface-500">
                  {scope === "global" ? "Equipo" : scope}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="rounded-lg p-2 text-surface-500 transition-colors hover:bg-surface-800 hover:text-surface-300 light:hover:bg-surface-100 light:hover:text-surface-700"
                  aria-label="Borrar conversación"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
              <button
                onClick={handleClose}
                className="rounded-lg p-2 text-surface-500 transition-colors hover:bg-surface-800 hover:text-surface-300 light:hover:bg-surface-100 light:hover:text-surface-700"
                aria-label="Cerrar chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Usage bar */}
          <div className="px-4 py-2 border-b border-surface-800/30 light:border-surface-200/60">
            <UsageBar usage={usage} />
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth">
            {messages.length === 0 && !isWaiting && (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-300 light:text-surface-700">
                    ¡Hola! ¿En qué puedo ayudarte?
                  </p>
                  <p className="mt-1 text-xs text-surface-500">
                    Pregúntame sobre nuestras habilidades, proyectos y servicios.
                  </p>
                </div>
                <div className="mt-2 w-full">
                  <SuggestionList scope={scope} onSelect={handleSend} />
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                isStreaming={isStreaming && idx === messages.length - 1 && msg.role === "assistant"}
              />
            ))}

            {isWaiting && <TypingIndicator />}
          </div>

          {/* Error */}
          {error && (
            <div className="mx-4 mb-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400 light:bg-red-50 light:text-red-600">
              {error}
            </div>
          )}

          {/* Delete confirmation */}
          {showDeleteConfirm && (
            <div className="mx-4 mb-2 flex items-center justify-between rounded-lg border border-surface-700 bg-surface-900 px-3 py-2 animate-in light:border-surface-300 light:bg-surface-50">
              <p className="text-xs text-surface-300 light:text-surface-600">
                ¿Borrar la conversación?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded px-2 py-1 text-xs text-surface-400 hover:text-surface-200 light:hover:text-surface-800"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="rounded bg-red-500/20 px-2 py-1 text-xs text-red-400 hover:bg-red-500/30 light:bg-red-50 light:text-red-600 light:hover:bg-red-100"
                >
                  Borrar
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-surface-800/50 p-3 light:border-surface-200">
            <ChatInput
              onSend={handleSend}
              disabled={isLimitReached}
              isStreaming={isStreaming || isWaiting}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default function ChatWidget({ scope }: Props) {
  return (
    <ToastProvider>
      <ChatWidgetInner scope={scope} />
    </ToastProvider>
  );
}
