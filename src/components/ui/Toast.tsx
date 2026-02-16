import { useState, useEffect, useCallback, createContext, useContext } from "react";

export interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextValue {
  addToast: (message: string, type?: ToastItem["type"]) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

function ToastNotification({ toast, onRemove }: { toast: ToastItem; onRemove: (id: string) => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(toast.id), 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const bgColor = {
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 light:bg-emerald-50 light:text-emerald-700 light:border-emerald-300/40",
    error: "border-red-500/30 bg-red-500/10 text-red-300 light:bg-red-50 light:text-red-700 light:border-red-300/40",
    info: "border-primary-500/30 bg-primary-500/10 text-primary-300 light:bg-primary-50 light:text-primary-700 light:border-primary-300/40",
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg backdrop-blur-sm transition-all duration-300 ${bgColor[toast.type]} ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
      }`}
    >
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onRemove(toast.id), 300);
        }}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastItem["type"] = "info") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 w-80">
        {toasts.map((toast) => (
          <ToastNotification key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
