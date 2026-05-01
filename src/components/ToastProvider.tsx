'use client';

import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Toast, ToastContextValue, ToastVariant } from '../types/Toast';
import { VARIANT_TOAST_STYLES } from '../constants/variant-toast-styles.constant';
import { ToastIcon } from './ToastIcon';

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const addToast = useCallback((message: string, variant: ToastVariant) => {
    const id = ++counterRef.current;
    setToasts((prev) => [...prev, { id, message, variant, visible: true }]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
      );
    }, 3400);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => {
        const s = VARIANT_TOAST_STYLES[toast.variant];
        return (
          <div
            key={toast.id}
            className={`
              pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl
              max-w-sm min-w-65 backdrop-blur-sm
              ${s.bg} ${s.border}
              transition-all duration-500 ease-in-out
              ${toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
            `}
          >
            <span className={`mt-0.5 ${s.icon}`}>
              <ToastIcon variant={toast.variant} />
            </span>
            <p className={`text-sm font-medium leading-snug ${s.text}`}>{toast.message}</p>
          </div>
        );
      })}
    </div>
  );
}
