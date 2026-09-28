import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
      {toasts.map(toast => {
        let Icon = Info;
        let bgStyle = 'bg-slate-900 text-white border-slate-700';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          bgStyle = 'bg-emerald-900/95 text-emerald-50 border-emerald-700 shadow-emerald-950/20';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          bgStyle = 'bg-rose-900/95 text-rose-50 border-rose-700 shadow-rose-950/20';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          bgStyle = 'bg-amber-900/95 text-amber-50 border-amber-700 shadow-amber-950/20';
        } else {
          Icon = Info;
          bgStyle = 'bg-slate-900/95 text-slate-100 border-slate-700 shadow-slate-950/20';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-0 ${bgStyle}`}
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium flex-1 leading-snug">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/60 hover:text-white transition-colors p-1"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
