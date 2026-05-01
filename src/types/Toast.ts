export type ToastVariant = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
  visible: boolean;
}

export interface ToastContextValue {
  addToast: (message: string, variant: ToastVariant) => void;
}