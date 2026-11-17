'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'neutral' | 'primary' | 'amber' | 'success' | 'error' | 'warning';
}

export function Badge({
  tone = 'neutral',
  className,
  children,
  ...props
}: BadgeProps) {
  const tones: Record<NonNullable<BadgeProps['tone']>, string> = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-green-50 text-green-800 border-green-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold whitespace-nowrap shrink-0',
        tones[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
