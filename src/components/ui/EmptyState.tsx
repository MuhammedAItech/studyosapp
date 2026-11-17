'use client';

import React from 'react';
import { Inbox } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <Card className="text-center py-10 px-6">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
        {icon ?? <Inbox className="h-6 w-6" />}
      </div>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-6 flex justify-center">
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </Card>
  );
}
