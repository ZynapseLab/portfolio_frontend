import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "../../i18n/utils";
import type { Lang } from "../../i18n/utils";
import { useToast } from "../ui/Toast";
import { sendContactEmail } from "../../services/contactService";
import { detectCountry } from "../../utils/detectCountry";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: Lang;
}

export default function ContactModal({ isOpen, onClose, lang }: Props) {
  const t = useTranslations(lang);
  const { addToast } = useToast();

  const [isAnimating, setIsAnimating] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [country] = useState(() => detectCountry());
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsAnimating(true));
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => onClose(), 300);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      addToast(t("contact.validationRequired"), "error");
      return;
    }

    if (!isValidEmail(email)) {
      addToast(t("contact.validationEmail"), "error");
      return;
    }

    setIsSending(true);
    const result = await sendContactEmail({
      name: name.trim(),
      email: email.trim(),
      country,
      subject: subject.trim(),
      message: message.trim(),
    });
    setIsSending(false);

    if (result.ok) {
      addToast(t("contact.success"), "success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      handleClose();
    } else {
      addToast(result.error ?? t("contact.error"), "error");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-th-border bg-th-bg-card px-3 py-2 text-sm text-th-text placeholder:text-th-text-faint focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? "opacity-95" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative z-10 mx-4 w-full max-w-lg rounded-2xl border border-th-border bg-th-bg-card shadow-2xl transition-all duration-300 ease-out ${
          isAnimating
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-8 scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-th-border px-5 py-4">
          <h2 className="text-base font-semibold text-th-text-strong">
            {t("contact.title")}
          </h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-th-text-muted transition-colors hover:bg-th-hover hover:text-th-text"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-th-text-sub">
              {t("contact.name")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("contact.namePlaceholder")}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-th-text-sub">
              {t("contact.email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("contact.emailPlaceholder")}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-th-text-sub">
              {t("contact.subject")}
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t("contact.subjectPlaceholder")}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-th-text-sub">
              {t("contact.message")}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("contact.messagePlaceholder")}
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Country info */}
          <p className="text-xs text-th-text-faint">
            {t("contact.country")}: <span className="font-medium">{country}</span>
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSending}
            className="w-full rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
          >
            {isSending ? t("contact.sending") : t("contact.send")}
          </button>
        </form>
      </div>
    </div>
  );
}
