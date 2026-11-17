'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onBack?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  onBack,
}: ErrorStateProps) {
  return (
    <Card className="border-red-200 bg-red-50/40 text-center py-10 px-6">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-[#DC2626]">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-600">
        {message}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <Button variant="primary" onClick={onRetry}>
            Try again
          </Button>
        )}
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Go back
          </Button>
        )}
      </div>
    </Card>
  );
}
