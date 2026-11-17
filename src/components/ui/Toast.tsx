'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useStudyStore, type ToastItem } from '@/src/lib/store';
import { cn } from '@/lib/utils';

export function ToastViewport() {
  const { toasts, dismissToast } = useStudyStore();

  if (toasts.length === 0) return null;

  const toneStyles: Record<ToastItem['tone'], string> = {
    success: 'bg-slate-900 text-white border-slate-800',
    error: 'bg-[#DC2626] text-white border-red-700',
    warning: 'bg-amber-950 text-amber-50 border-amber-800',
    info: 'bg-slate-900 text-white border-slate-800',
  };

  const icons: Record<ToastItem['tone'], React.ReactNode> = {
    success: <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />,
    error: <AlertCircle className="h-4 w-4 text-red-100 shrink-0" />,
    warning: <AlertTriangle className="h-4 w-4 text-amber-300 shrink-0" />,
    info: <Info className="h-4 w-4 text-slate-300 shrink-0" />,
  };

  return (
    <div
      className="fixed bottom-20 lg:bottom-6 right-4 left-4 sm:left-auto sm:max-w-sm z-50 flex flex-col gap-2 pointer-events-none"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'pointer-events-auto flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg',
            toneStyles[toast.tone]
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {icons[toast.tone]}
            <span className="truncate">{toast.message}</span>
          </div>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss notification"
            className="min-h-[44px] min-w-[44px] -my-1.5 -mr-1.5 flex items-center justify-center rounded-lg hover:bg-white/10 shrink-0 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
