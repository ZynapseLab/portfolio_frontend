import { useState, useRef, useCallback, useEffect } from "react";
import type { ChatMessage as ChatMessageType, UsageInfo } from "../../types/chat";
import { sendMessage, deleteConversation, getUsageStats, getConversationHistory } from "../../services/chatService";
import { ToastProvider, useToast } from "../ui/Toast";
import { useTranslations } from "../../i18n/utils";
import type { Lang } from "../../i18n/utils";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import SuggestionList from "./SuggestionList";
import UsageBar from "./UsageBar";
import TypingIndicator from "./TypingIndicator";

const MAX_MESSAGES_PER_DAY = import.meta.env.MAX_MESSAGES_PER_DAY ?? 10;

interface Props {
  scope: string;
  lang?: Lang;
}

function ChatWidgetInner({ scope, lang = "es" }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [usage, setUsage] = useState<UsageInfo>({ used: 0, limit: MAX_MESSAGES_PER_DAY, resetAt: "" });
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const { addToast } = useToast();
  const t = useTranslations(lang);

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
    async function fetchChatContext() {
      const history = await getConversationHistory(scope);
      const usage = await getUsageStats(scope);

      if (history) {
        setMessages(history.messages);
      }

      setUsage(usage);
    }

    fetchChatContext();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    scrollToBottom();
  }, [messages, isWaiting, scrollToBottom, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    requestAnimationFrame(() => setIsAnimating(true));
  }, []);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => setIsOpen(false), 300);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, handleClose]);

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
            getUsageStats(scope).then((usage) => {
              setUsage(usage);
            });
            setIsStreaming(false);
            setIsWaiting(false);
          },
          onUsage: (info) => {
            if (info.used >= info.limit) {
              addToast(t("chat.limitReached"), "error");
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
      addToast(t("chat.deleted"), "success");
    } else {
      addToast(t("chat.deleteError"), "error");
    }
  }, [scope, addToast]);

  return (
    <>
      {/* Floating toggle button — centered bottom */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 py-3 pl-4 pr-5 text-white shadow-lg shadow-primary-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/40 hover:scale-105 active:scale-95"
          aria-label={t("chat.ariaOpen")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="hidden text-sm font-medium sm:inline">Chat IA</span>
        </button>
      )}

      {/* Full-screen overlay */}
      {isOpen && (
        <div
          className={`chat-overlay fixed inset-0 z-50 flex flex-col ${
            isAnimating ? "chat-overlay--open" : "chat-overlay--closed"
          }`}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
              isAnimating ? "opacity-75" : "opacity-0"
            }`}
            onClick={handleClose}
          />

          {/* Chat container */}
          <div
            className={`chat-panel relative z-10 flex h-full flex-col transition-all duration-300 ease-out ${
              isAnimating
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-th-chat-border bg-th-chat-surface/90 backdrop-blur-xl px-4 py-3 md:px-6">
              {/* Left: close button */}
              <button
                onClick={handleClose}
                className="flex items-center gap-2 rounded-lg p-2 text-th-text-muted transition-colors hover:bg-th-hover hover:text-th-text"
                aria-label={t("chat.ariaClose")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="hidden text-sm sm:inline">{t("chat.ariaClose")}</span>
              </button>

              {/* Center: bot name */}
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 text-[10px] font-bold text-white">
                  AI
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-th-text-strong">
                    Zynapse Assistant
                  </p>
                  <p className="hidden text-xs text-th-text-faint sm:block">
                    {scope === "global" ? t("chat.scopeGlobal") : scope}
                  </p>
                </div>
              </div>

              {/* Right: usage bar + delete */}
              <div className="flex items-center gap-2">
                <div className="hidden w-28 sm:block md:w-36">
                  <UsageBar usage={usage} />
                </div>
                {(messages ?? []).length > 0 && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="rounded-lg p-2 text-th-text-faint transition-colors hover:bg-th-hover hover:text-th-text-sub"
                    aria-label={t("chat.ariaDelete")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Mobile usage bar + delete */}
            <div className="flex items-center gap-2 border-b border-th-chat-border bg-th-chat-surface/60 px-4 py-2 sm:hidden">
              <div className="flex-1">
                <UsageBar usage={usage} />
              </div>
              {(messages ?? []).length > 0 && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="rounded-lg p-1.5 text-th-text-faint transition-colors hover:bg-th-hover hover:text-th-text-sub"
                  aria-label={t("chat.ariaDelete")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>

            {/* Messages area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth">
              <div className="mx-auto w-full px-4 py-6 space-y-3 md:px-6 md:max-w-[85%] lg:max-w-[70%]">
                {(messages ?? []).length === 0 && !isWaiting && (
                  <div className="flex flex-col items-center justify-center min-h-[50vh] gap-5 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-th-primary-soft text-th-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-base font-medium text-th-text-sub">
                        {t("chat.greeting")}
                      </p>
                      <p className="mt-1 text-sm text-th-text-faint">
                        {t("chat.greetingHint")}
                      </p>
                    </div>
                    <div className="mt-3 w-full max-w-md">
                      <SuggestionList scope={scope} onSelect={handleSend} lang={lang} />
                    </div>
                  </div>
                )}

                {(messages ?? []).map((msg, idx) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    isStreaming={isStreaming && idx === messages.length - 1 && msg.role === "assistant"}
                  />
                ))}

                {isWaiting && <TypingIndicator />}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mx-auto w-full px-4 md:max-w-[85%] lg:max-w-[70%]">
                <div className="mb-2 rounded-lg bg-th-error-soft px-3 py-2 text-xs text-th-error">
                  {error}
                </div>
              </div>
            )}

            {/* Delete confirmation */}
            {showDeleteConfirm && (
              <div className="mx-auto w-full px-4 md:max-w-[85%] lg:max-w-[70%]">
                <div className="mb-2 flex items-center justify-between rounded-lg border border-th-border-strong bg-th-bg-card px-3 py-2">
                  <p className="text-xs text-th-text-sub">
                    {t("chat.deleteConfirm")}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="rounded px-2 py-1 text-xs text-th-text-muted hover:text-th-text-strong"
                    >
                      {t("chat.cancel")}
                    </button>
                    <button
                      onClick={handleDelete}
                      className="rounded bg-th-error-soft px-2 py-1 text-xs text-th-error hover:opacity-80"
                    >
                      {t("chat.delete")}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Input footer */}
            <div className="border-t border-th-chat-border bg-th-chat-surface/90 backdrop-blur-xl p-3 md:p-4">
              <div className="mx-auto w-full md:max-w-[85%] lg:max-w-[70%]">
                <ChatInput
                  onSend={handleSend}
                  disabled={isLimitReached}
                  isStreaming={isStreaming || isWaiting}
                  lang={lang}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function ChatWidget({ scope, lang = "es" }: Props) {
  return (
    <ToastProvider>
      <ChatWidgetInner scope={scope} lang={lang} />
    </ToastProvider>
  );
}
