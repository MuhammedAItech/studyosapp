'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary:
      'bg-[#16A34A] text-white hover:bg-[#15803D] active:bg-[#166534] shadow-sm',
    secondary:
      'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 shadow-sm',
    outline:
      'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 hover:border-slate-300',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
    danger: 'bg-[#DC2626] text-white hover:bg-red-700 active:bg-red-800',
  };

  const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'min-h-[44px] px-4 py-2 text-sm',
    md: 'min-h-[44px] px-5 py-2.5 text-sm',
    lg: 'min-h-[48px] px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full flex-1' : 'shrink-0',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
