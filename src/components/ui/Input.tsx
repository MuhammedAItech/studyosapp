'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({
  label,
  error,
  hint,
  id,
  className,
  ...props
}: InputProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full min-h-[44px] rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:border-[#16A34A]',
          error ? 'border-[#DC2626] focus-visible:ring-[#DC2626]' : 'border-slate-200',
          className
        )}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error && (
        <p className="text-xs font-medium text-[#DC2626]" role="alert">
          {error}
        </p>
      )}
      {!error && hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
