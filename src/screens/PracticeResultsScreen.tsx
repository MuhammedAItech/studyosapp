'use client';

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, RotateCcw, CheckCircle2 } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  ProgressBar,
  ScreenSkeleton,
} from '@/src/components/ui';
import { PRACTICE_SUBJECTS } from '@/src/data/practice';
import { useStudyStore } from '@/src/lib/store';

export function PracticeResultsScreen() {
  const { subjectId, topicId } = useParams<{
    subjectId: string;
    topicId: string;
  }>();
  const navigate = useNavigate();
  const { state, hydrated } = useStudyStore();

  if (!hydrated) {
    return <ScreenSkeleton />;
  }

  const subject = PRACTICE_SUBJECTS.find((s) => s.id === subjectId);
  const topic = subject?.topics.find((t) => t.id === topicId);

  if (!subject || !topic) {
    return (
      <ErrorState
        title="Results unavailable"
        message="We couldn't find that practice topic. Return to all subjects."
        onBack={() =>
          navigate(subject ? `/app/practice/${subject.id}` : '/app/practice')
        }
      />
    );
  }

  const result = state.lastPracticeResult;
  if (!result || result.topicId !== topic.id) {
    return (
      <EmptyState
        title="No results for this topic yet"
        description="Complete the 5 sample questions to view your score and accuracy."
        actionLabel="Start practice"
        onAction={() => navigate(`/app/practice/${subject.id}/${topic.id}`)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate(`/app/practice/${subjectId ?? ''}`)}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to topics</span>
      </button>

      <Card className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#16A34A]">
              <CheckCircle2 className="h-4 w-4" />
              <span>Practice complete</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Topic Summary
            </h1>
          </div>
          <Badge tone="amber">+{result.correctCount * 10} XP</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
            <p className="text-xs font-medium text-slate-500">Score</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">
              {result.correctCount} / {result.totalQuestions}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
            <p className="text-xs font-medium text-slate-500">Accuracy</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">
              {result.accuracyPercent}%
            </p>
          </div>
        </div>

        <ProgressBar
          value={result.accuracyPercent}
          max={100}
          label="Accuracy rate"
        />

        <div className="space-y-2 border-t border-slate-100 pt-4">
          <h2 className="text-sm font-bold text-slate-900">Weak topics</h2>
          {result.weakTopics.length === 0 ? (
            <p className="text-sm text-slate-600">
              Strong score. No weak topic flagged from this drill.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {result.weakTopics.map((topic) => (
                <Badge key={topic} tone="warning">
                  Review: {topic}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Button
            variant="primary"
            fullWidth
            onClick={() =>
              navigate(`/app/practice/${result.subjectId}/${result.topicId}`)
            }
          >
            <RotateCcw className="h-4 w-4" />
            <span>Retry topic</span>
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate('/app/home')}
          >
            Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
}
