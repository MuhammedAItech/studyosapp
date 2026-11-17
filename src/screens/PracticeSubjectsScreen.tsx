'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, ChevronRight, Timer } from 'lucide-react';
import {
  Card,
  Badge,
  Button,
  ProgressBar,
  ScreenSkeleton,
  EmptyState,
  ErrorState,
} from '@/src/components/ui';
import { PRACTICE_SUBJECTS } from '@/src/data/practice';
import { useStudyStore } from '@/src/lib/store';

export function PracticeSubjectsScreen() {
  const navigate = useNavigate();
  const { state, hydrated } = useStudyStore();
  const [hasError, setHasError] = useState(false);

  if (!hydrated) {
    return <ScreenSkeleton />;
  }

  if (hasError) {
    return (
      <ErrorState
        message="Could not load practice subjects."
        onRetry={() => setHasError(false)}
        onBack={() => navigate('/app/home')}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/app/home')}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Home</span>
        </button>
        <Badge tone="neutral">Sample Content</Badge>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Practice by subject
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Pick a subject to drill sample topics with instant explanations.
        </p>
      </div>

      {/* CBT Simulator Entry */}
      <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-slate-300">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Timer className="h-4 w-4 text-[#16A34A]" />
            <span>JAMB UTME Mode</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Full-screen JAMB CBT Simulator
          </h2>
          <p className="text-xs text-slate-500">
            120-minute countdown, question grid, calculator, and keyboard
            shortcuts.
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/app/cbt')}>
          Open CBT Simulator
        </Button>
      </Card>

      {PRACTICE_SUBJECTS.length === 0 ? (
        <EmptyState
          title="No practice subjects available"
          description="Check back once subjects are added to your study plan."
          actionLabel="Back to Home"
          onAction={() => navigate('/app/home')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PRACTICE_SUBJECTS.map((subject) => {
            const totalQuestions = subject.topics.reduce(
              (sum, t) => sum + t.totalCount,
              0
            );
            const completedQuestions = subject.topics.reduce(
              (sum, t) => sum + (state.topicProgress[t.id] ?? t.completedCount),
              0
            );

            return (
              <Card key={subject.id} className="flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-xs font-bold text-[#16A34A]">
                      {subject.shortCode}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {subject.topics.length} sample topics
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {subject.name}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                      {subject.description}
                    </p>
                  </div>
                  <ProgressBar
                    value={completedQuestions}
                    max={totalQuestions}
                    label={`${completedQuestions}/${totalQuestions} answered`}
                  />
                </div>

                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => navigate(`/app/practice/${subject.id}`)}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Open topics</span>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
