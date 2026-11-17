'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, CalendarDays, User } from 'lucide-react';
import {
  Button,
  EmptyState,
  ErrorState,
  ScreenSkeleton,
} from '@/src/components/ui';
import { useStudyStore } from '@/src/lib/store';

interface ShellPlaceholderScreenProps {
  section: 'Tutor' | 'Plan' | 'Profile';
}

export function ShellPlaceholderScreen({
  section,
}: ShellPlaceholderScreenProps) {
  const navigate = useNavigate();
  const { hydrated, showToast } = useStudyStore();
  const [hasError, setHasError] = useState(false);

  if (!hydrated) {
    return <ScreenSkeleton />;
  }

  if (hasError) {
    return (
      <ErrorState
        message={`Could not load the ${section} shell.`}
        onRetry={() => setHasError(false)}
        onBack={() => navigate('/app/home')}
      />
    );
  }

  const icons = {
    Tutor: <MessageSquare className="h-6 w-6" />,
    Plan: <CalendarDays className="h-6 w-6" />,
    Profile: <User className="h-6 w-6" />,
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate('/app/home')}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Home</span>
      </button>

      <EmptyState
        icon={icons[section]}
        title={`${section} screen (Coming soon)`}
        description={`This ${section.toLowerCase()} tab is part of the Study OS app shell and is reserved for the next build phase.`}
        actionLabel="Back to Home"
        onAction={() => navigate('/app/home')}
      />

      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => showToast(`${section} features are coming soon`, 'info')}
        >
          Notify when {section} is ready
        </Button>
      </div>
    </div>
  );
}
