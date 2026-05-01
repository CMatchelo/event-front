import { ToastVariant } from "../types/Toast";

export const VARIANT_TOAST_STYLES: Record<ToastVariant, { border: string; icon: string; text: string; bg: string }> = {
  success: {
    bg: 'bg-[#0a1a0f]',
    border: 'border-emerald-500/30',
    icon: 'text-emerald-400',
    text: 'text-emerald-100',
  },
  error: {
    bg: 'bg-[#1a0a0a]',
    border: 'border-red-500/30',
    icon: 'text-red-400',
    text: 'text-red-100',
  },
  info: {
    bg: 'bg-[#0a0f1a]',
    border: 'border-blue-500/30',
    icon: 'text-blue-400',
    text: 'text-blue-100',
  },
};