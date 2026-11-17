'use client';

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Check,
  Flame,
  RefreshCw,
  SkipForward,
  Timer,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  ScreenSkeleton,
} from '@/src/components/ui';
import { WEEK_DAY_LABELS } from '@/src/data/plan';
import {
  formatLocalDate,
  getDaysUntilExam,
  isCramModeActive,
  validateExamDate,
} from '@/src/lib/study-logic';
import { useStudyStore } from '@/src/lib/store';
import { cn } from '@/lib/utils';

export function PlanScreen() {
  const navigate = useNavigate();
  const {
    state,
    hydrated,
    setStudyBlockStatus,
    replanStudyBlocks,
    updateExamDate,
    showToast,
  } = useStudyStore();

  const [selectedDay, setSelectedDay] = useState(0);
  const [hasError, setHasError] = useState(false);

  const daysLeft = getDaysUntilExam(state.onboarding.examDate);
  const cramMode = isCramModeActive(state.onboarding.examDate);

  const todayBlocks = useMemo(
    () => state.studyBlocks.filter((b) => b.dayIndex === selectedDay),
    [state.studyBlocks, selectedDay]
  );

  if (!hydrated) {
    return <ScreenSkeleton />;
  }

  if (hasError) {
    return (
      <ErrorState
        message="Unable to load your study schedule."
        onRetry={() => setHasError(false)}
        onBack={() => navigate('/app/home')}
      />
    );
  }

  const todayStr = formatLocalDate(new Date());

  const handleReplan = () => {
    const hasUnfinished = state.studyBlocks.some((b) => b.status !== 'done');
    if (!hasUnfinished) {
      showToast('All study blocks are already done!', 'info');
      return;
    }
    replanStudyBlocks();
    setSelectedDay(0);
    showToast('Schedule replanned around missed sessions', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/app/home')}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Home</span>
        </button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/app/timer')}
        >
          <Timer className="h-4 w-4" />
          <span>Focus Timer</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Study Plan
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {state.onboarding.exam} in {daysLeft} days · synced with Home
          </p>
        </div>

        {/* Exam date adjuster (lets user test <=7 day Cram mode cleanly) */}
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <Calendar className="h-4 w-4 text-slate-500" />
          <span>Exam date:</span>
          <input
            type="date"
            min={todayStr}
            value={state.onboarding.examDate}
            onChange={(e) => {
              const nextDate = e.target.value;
              const dateErr = validateExamDate(nextDate);
              if (dateErr) {
                showToast(dateErr, 'warning');
                return;
              }
              updateExamDate(nextDate);
              showToast('Exam countdown updated', 'info');
            }}
            className="min-h-[44px] rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]"
          />
        </label>
      </div>

      {/* Cram Mode Banner (when exam date <= 7 days) */}
      {cramMode && (
        <Card className="border-amber-300 bg-amber-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-[#D97706] shrink-0">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-950">
                Cram mode active · {daysLeft} days to {state.onboarding.exam}
              </p>
              <p className="text-xs text-amber-900 mt-0.5">
                Prioritizing high-yield past questions, weak topics, and timed
                CBT drills.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/app/cbt')}
          >
            Run CBT Drill
          </Button>
        </Card>
      )}

      {/* Notion-style Week View Selector */}
      <Card padding="sm" className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-slate-900">Week view</h2>
          <span className="text-xs text-slate-500">Sample schedule</span>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {WEEK_DAY_LABELS.map((day, index) => {
            const dayBlocks = state.studyBlocks.filter(
              (b) => b.dayIndex === index
            );
            const active = selectedDay === index;
            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(index)}
                className={cn(
                  'min-h-[56px] rounded-xl border p-1.5 flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer',
                  active
                    ? 'border-[#16A34A] bg-green-50 text-[#16A34A]'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                )}
              >
                <span className="text-xs font-bold">
                  {index === 0 ? 'Today' : day}
                </span>
                <span className="text-[11px] text-slate-500 tabular-nums">
                  {dayBlocks.length}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Today's / Selected Day's Blocks + Missed Session Replan */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900">
            {selectedDay === 0
              ? "Today's blocks"
              : `${WEEK_DAY_LABELS[selectedDay]} blocks`}
          </h2>
          <Button variant="outline" size="sm" onClick={handleReplan}>
            <RefreshCw className="h-4 w-4" />
            <span>Missed a session? Replan</span>
          </Button>
        </div>

        {todayBlocks.length === 0 ? (
          <EmptyState
            title="No study blocks on this day"
            description="Use Replan to distribute pending study sessions across the week."
            actionLabel="Missed a session? Replan"
            onAction={handleReplan}
          />
        ) : (
          <div className="space-y-3">
            {todayBlocks.map((block) => {
              const isDone = block.status === 'done';
              const isSkipped = block.status === 'skipped';

              return (
                <Card
                  key={block.id}
                  padding="sm"
                  className={cn(
                    'flex flex-col sm:flex-row sm:items-center justify-between gap-3',
                    isDone && 'bg-green-50/40 border-green-200',
                    isSkipped && 'bg-slate-50 border-slate-200 opacity-80'
                  )}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700 tabular-nums">
                        {block.timeSlot}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{block.subject}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        {block.durationMinutes}m
                      </span>
                      {isDone && <Badge tone="success">Done</Badge>}
                      {isSkipped && <Badge tone="neutral">Skipped</Badge>}
                    </div>
                    <p
                      className={cn(
                        'text-sm font-bold',
                        isDone
                          ? 'line-through text-slate-400'
                          : 'text-slate-900'
                      )}
                    >
                      {block.title}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant={isDone ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={() => {
                        const next = isDone ? 'pending' : 'done';
                        setStudyBlockStatus(block.id, next);
                        showToast(
                          next === 'done'
                            ? 'Block marked done (+15 XP)'
                            : 'Block restored to pending',
                          'success'
                        );
                      }}
                    >
                      <Check className="h-4 w-4" />
                      <span>{isDone ? 'Undo' : 'Done'}</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (isSkipped) {
                          setStudyBlockStatus(block.id, 'pending');
                          showToast('Block restored to pending', 'info');
                        } else {
                          setStudyBlockStatus(block.id, 'skipped');
                          showToast('Block skipped', 'info');
                        }
                      }}
                    >
                      <SkipForward className="h-4 w-4" />
                      <span>{isSkipped ? 'Restore' : 'Skip'}</span>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
