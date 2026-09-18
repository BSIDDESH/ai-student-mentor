"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { X, AlertCircle, CheckCircle2, WifiOff } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type ToastType = "error" | "success" | "offline";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  showOffline: () => void;
}

// ── Context ───────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue>({
  showError:   () => {},
  showSuccess: () => {},
  showOffline: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

// ── Provider ──────────────────────────────────────────────────────────────────

const AUTO_DISMISS_MS: Record<ToastType, number> = {
  error:   5000,
  success: 3000,
  offline: 8000,
};

const MAX_TOASTS = 3;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback(
    (type: ToastType, message: string) => {
      const id = Math.random().toString(36).slice(2, 9);
      setToasts((prev) => [
        // Keep at most MAX_TOASTS - 1 existing ones, then add new
        ...prev.slice(-(MAX_TOASTS - 1)),
        { id, type, message },
      ]);
      setTimeout(() => dismiss(id), AUTO_DISMISS_MS[type]);
    },
    [dismiss]
  );

  const showError   = useCallback((msg: string) => add("error",   msg), [add]);
  const showSuccess = useCallback((msg: string) => add("success", msg), [add]);
  const showOffline = useCallback(() =>
    add("offline", "You appear to be offline. Check your connection."), [add]);

  return (
    <ToastContext.Provider value={{ showError, showSuccess, showOffline }}>
      {children}

      {/* Toast stack — sits above bottom tab bar on mobile, bottom-right on desktop */}
      {toasts.length > 0 && (
        <div
          role="region"
          aria-label="Notifications"
          aria-live="polite"
          className="fixed bottom-24 md:bottom-6 left-4 right-4 md:left-auto md:right-5 md:w-96 z-50 flex flex-col-reverse gap-2 pointer-events-none"
        >
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

// ── Single toast item ─────────────────────────────────────────────────────────

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: () => void;
}) {
  const config = {
    error: {
      wrap:  "bg-rose-50 border-rose-200",
      icon:  <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />,
      text:  "text-rose-900",
      close: "text-rose-400",
      bar:   "bg-rose-400",
      label: "Error",
    },
    success: {
      wrap:  "bg-emerald-50 border-emerald-200",
      icon:  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />,
      text:  "text-emerald-900",
      close: "text-emerald-400",
      bar:   "bg-emerald-400",
      label: "Done",
    },
    offline: {
      wrap:  "bg-stone-800 border-stone-700",
      icon:  <WifiOff size={18} className="text-stone-300 shrink-0 mt-0.5" />,
      text:  "text-stone-100",
      close: "text-stone-400",
      bar:   "bg-stone-500",
      label: "Offline",
    },
  }[toast.type];

  return (
    <div
      className={`pointer-events-auto w-full rounded-2xl border p-4 shadow-lg flex items-start gap-3 ${config.wrap}`}
      role="alert"
    >
      {config.icon}

      <div className="flex-1 min-w-0">
        <p className={`font-display text-sm font-bold ${config.text} leading-none mb-1`}>
          {config.label}
        </p>
        <p className={`text-sm leading-snug ${config.text} opacity-90`}>
          {toast.message}
        </p>
      </div>

      <button
        onClick={onDismiss}
        className={`shrink-0 p-1 rounded-lg mt-0.5 ${config.close}`}
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}
