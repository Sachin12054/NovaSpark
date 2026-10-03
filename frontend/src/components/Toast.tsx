import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onClose: () => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-400 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/40 bg-[#0b1b14]/95 text-emerald-100',
    error: 'border-red-500/40 bg-[#1f0e11]/95 text-red-100',
    info: 'border-indigo-500/40 bg-[#0f1429]/95 text-indigo-100',
  };

  return (
    <div className={`pointer-events-auto p-3.5 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 transform translate-y-0 ${borders[toast.type]} flex items-start gap-3`}>
      {icons[toast.type]}
      <div className="flex-1 text-xs">
        <h5 className="font-semibold text-white text-sm">{toast.title}</h5>
        <p className="text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
      </div>
      <button onClick={onClose} className="text-slate-400 hover:text-white p-0.5">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
