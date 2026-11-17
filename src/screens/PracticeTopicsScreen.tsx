'use client';

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
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

export function PracticeTopicsScreen() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const { state, hydrated } = useStudyStore();

  if (!hydrated) {
    return <ScreenSkeleton />;
  }

  const subject = PRACTICE_SUBJECTS.find((s) => s.id === subjectId);

  if (!subject) {
    return (
      <ErrorState
        title="Subject not found"
        message="We couldn't find that practice subject. Return to the subject list."
        onBack={() => navigate('/app/practice')}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/app/practice')}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>All subjects</span>
        </button>
        <Badge tone="neutral">Sample</Badge>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {subject.name}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{subject.description}</p>
      </div>

      {subject.topics.length === 0 ? (
        <EmptyState
          title="No topics yet"
          description="This subject doesn't have sample topics yet."
          actionLabel="Back to subjects"
          onAction={() => navigate('/app/practice')}
        />
      ) : (
        <div className="space-y-3">
          {subject.topics.map((topic) => {
            const done = state.topicProgress[topic.id] ?? topic.completedCount;
            return (
              <Card key={topic.id} className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      {topic.title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {topic.description}
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      navigate(`/app/practice/${subject.id}/${topic.id}`)
                    }
                  >
                    <span>Start 5 questions</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <ProgressBar
                  value={done}
                  max={topic.totalCount}
                  label={`${done} of ${topic.totalCount} sample questions`}
                />
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
