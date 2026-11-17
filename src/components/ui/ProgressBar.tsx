'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  value: number;
  max?: number;
  tone?: 'primary' | 'amber' | 'slate';
  label?: string;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  tone = 'primary',
  label,
  className,
}: ProgressBarProps) {
  const safeMax = max <= 0 ? 100 : max;
  const percent = Math.max(0, Math.min(100, Math.round((value / safeMax) * 100)));

  const fills: Record<NonNullable<ProgressBarProps['tone']>, string> = {
    primary: 'bg-[#16A34A]',
    amber: 'bg-[#F59E0B]',
    slate: 'bg-slate-700',
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-600">
          <span>{label}</span>
          <span className="tabular-nums">{percent}%</span>
        </div>
      )}
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-200',
            fills[tone]
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
