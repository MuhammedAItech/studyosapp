'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  BookOpen,
  MessageSquare,
  Timer,
  Check,
  ChevronRight,
} from 'lucide-react';
import {
  Card,
  Badge,
  Button,
  ScreenSkeleton,
  EmptyState,
  ErrorState,
} from '@/src/components/ui';
import { FlameStreakArt, SabiMascot } from '@/src/components/art/StudyArt';
import { STUDENT_OF_THE_WEEK } from '@/src/data/exams';
import { WEEK_DAY_LABELS } from '@/src/data/plan';
import { getDaysUntilExam } from '@/src/lib/study-logic';
import { useStudyStore } from '@/src/lib/store';
import { cn } from '@/lib/utils';

export function HomeScreen() {
  const navigate = useNavigate();
  const { state, hydrated, setStudyBlockStatus, showToast } = useStudyStore();
  const [hasError, setHasError] = useState(false);

  if (!hydrated) {
    return <ScreenSkeleton />;
  }

  if (hasError) {
    return (
      <ErrorState
        message="Unable to load your daily study workspace."
        onRetry={() => setHasError(false)}
        onBack={() => navigate('/')}
      />
    );
  }

  const firstName = state.user?.name?.split(' ')[0] || 'Student';
  const daysLeft = getDaysUntilExam(state.onboarding.examDate);
  const todaysBlocks = state.studyBlocks.filter((b) => b.dayIndex === 0).slice(0, 3);
  const completedTasks = todaysBlocks.filter((t) => t.status === 'done').length;

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Good day, {firstName}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            <span>{state.onboarding.exam}</span>
            {state.onboarding.crawfordCourse ? (
              <>
                <span className="mx-1.5" aria-hidden="true">
                  ·
                </span>
                <span>{state.onboarding.crawfordCourse}</span>
              </>
            ) : null}
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-500 tabular-nums">
          {completedTasks}/{todaysBlocks.length} tasks done
        </div>
      </header>

      {/* Streak (matching Streak Tracker ref) + Exam Countdown (Notion ref) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500">
                Study streak
              </p>
              <p className="text-2xl font-bold text-slate-900 tabular-nums">
                {state.streakDays} days
              </p>
              <p className="text-xs font-medium text-amber-700 tabular-nums">
                {state.xp} XP earned
              </p>
            </div>
            <FlameStreakArt size={56} />
          </div>

          <div className="grid grid-cols-7 gap-1 pt-2 border-t border-slate-100">
            {WEEK_DAY_LABELS.map((day, idx) => {
              const active = state.streakWeekMask[idx];
              return (
                <div key={day} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-semibold text-slate-400">
                    {day.slice(0, 1)}
                  </span>
                  <span
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold',
                      active
                        ? 'bg-[#F59E0B] text-white'
                        : 'bg-slate-100 text-slate-400'
                    )}
                  >
                    {active ? <Check className="h-3 w-3" /> : idx + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">
              Exam countdown
            </p>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">
              {state.onboarding.exam} in {daysLeft} days
            </p>
            <p className="text-xs text-slate-500">
              {state.onboarding.examDate || 'Target date not set'}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 border border-green-200 shrink-0">
            <Clock className="h-6 w-6 text-[#16A34A]" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <section aria-labelledby="quick-actions-heading" className="space-y-3">
        <h2
          id="quick-actions-heading"
          className="text-base font-bold text-slate-900"
        >
          Quick actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            variant="primary"
            fullWidth
            onClick={() => navigate('/app/practice')}
          >
            <BookOpen className="h-4 w-4" />
            <span>Practice</span>
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate('/app/tutor')}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Ask Tutor</span>
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => navigate('/app/timer')}
          >
            <Timer className="h-4 w-4" />
            <span>Start Timer</span>
          </Button>
        </div>
      </section>

      {/* Today's Plan (synced directly with Plan blocks) */}
      <section aria-labelledby="todays-plan-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2
            id="todays-plan-heading"
            className="text-base font-bold text-slate-900"
          >
            Today&apos;s plan
          </h2>
          <button
            type="button"
            onClick={() => navigate('/app/plan')}
            className="inline-flex min-h-[44px] items-center gap-1 text-xs font-semibold text-[#16A34A] hover:underline cursor-pointer"
          >
            <span>Open Plan</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {todaysBlocks.length === 0 ? (
          <EmptyState
            title="No tasks scheduled today"
            description="Open your study plan or replan missed sessions."
            actionLabel="Open Plan"
            onAction={() => navigate('/app/plan')}
          />
        ) : (
          <Card padding="sm" className="divide-y divide-slate-100">
            {todaysBlocks.map((task) => {
              const isDone = task.status === 'done';
              const isSkipped = task.status === 'skipped';
              return (
                <label
                  key={task.id}
                  className="flex min-h-[56px] items-center justify-between gap-3 px-2 py-2.5 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => {
                        const next = isDone ? 'pending' : 'done';
                        setStudyBlockStatus(task.id, next);
                        showToast(
                          next === 'done'
                            ? 'Task completed (+15 XP)'
                            : 'Task marked pending',
                          'success'
                        );
                      }}
                      className="sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-lg border shrink-0 transition-colors',
                        isDone
                          ? 'border-[#16A34A] bg-[#16A34A] text-white'
                          : isSkipped
                            ? 'border-slate-300 bg-slate-100'
                            : 'border-slate-300 bg-white'
                      )}
                    >
                      {isDone && <Check className="h-4 w-4" />}
                    </span>
                    <div className="min-w-0">
                      <p
                        className={cn(
                          'text-sm font-medium truncate',
                          isDone
                            ? 'line-through text-slate-400'
                            : isSkipped
                              ? 'text-slate-500'
                              : 'text-slate-800'
                        )}
                      >
                        {task.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {task.subject} · {task.durationMinutes} mins
                      </p>
                    </div>
                  </div>
                  {isSkipped && <Badge tone="neutral">Skipped</Badge>}
                </label>
              );
            })}
          </Card>
        )}
      </section>

      {/* Weak Topics Chips */}
      <section aria-labelledby="weak-topics-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2
            id="weak-topics-heading"
            className="text-base font-bold text-slate-900"
          >
            Weak topics to review
          </h2>
          <button
            type="button"
            onClick={() => navigate('/app/practice')}
            className="inline-flex min-h-[44px] items-center gap-1 text-xs font-semibold text-[#16A34A] hover:underline cursor-pointer"
          >
            <span>Open Practice</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {state.weakTopics.length === 0 ? (
          <EmptyState
            title="No weak topics flagged"
            description="Complete a practice drill to spot topics that need revision."
            actionLabel="Start practice"
            onAction={() => navigate('/app/practice')}
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {state.weakTopics.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => navigate('/app/practice')}
                className="min-h-[44px] rounded-xl border border-amber-200 bg-amber-50/70 px-3.5 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100/70 transition-colors cursor-pointer"
              >
                {topic}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Student of the Week (Mock with Sabi Mascot art) */}
      <Card className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <SabiMascot mood="celebrate" size={48} />
            <div>
              <p className="text-xs font-semibold text-[#16A34A]">
                Student of the Week (Sample)
              </p>
              <h2 className="text-base font-bold text-slate-900">
                {STUDENT_OF_THE_WEEK.name}
              </h2>
            </div>
          </div>
          <Badge tone="amber">{STUDENT_OF_THE_WEEK.streak}d streak</Badge>
        </div>
        <p className="text-xs text-slate-500">
          {STUDENT_OF_THE_WEEK.school} · {STUDENT_OF_THE_WEEK.accuracy} accuracy
        </p>
        <p className="text-sm text-slate-700 leading-relaxed">
          &ldquo;{STUDENT_OF_THE_WEEK.quote}&rdquo;
        </p>
      </Card>
    </div>
  );
}
