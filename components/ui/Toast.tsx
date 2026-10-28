import React, { useState, useEffect } from 'react';
import { Check, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
}

export default function Toast({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, isVisible, onClose]);

  if (!isVisible) return null;

  const configs = {
    success: { bg: 'bg-green-500', icon: Check },
    error: { bg: 'bg-red-500', icon: AlertCircle },
    warning: { bg: 'bg-amber-500', icon: AlertCircle },
    info: { bg: 'bg-blue-500', icon: Info },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom duration-200`}>
      <Icon size={20} />
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className="ml-auto text-white hover:opacity-75 transition"
      >
        <X size={18} />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts }: { toasts: ToastProps[] }) {
  return (
    <div className="fixed bottom-6 right-6 space-y-3 z-50">
      {toasts.map((toast, idx) => (
        <Toast key={idx} {...toast} />
      ))}
    </div>
  );
}
