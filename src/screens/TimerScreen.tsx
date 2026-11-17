'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Flame,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  ScreenSkeleton,
} from '@/src/components/ui';
import { SabiMascot, TimerRingSvg } from '@/src/components/art/StudyArt';
import { TIMER_TOPICS } from '@/src/data/plan';
import { formatCountdown } from '@/src/lib/study-logic';
import { useStudyStore } from '@/src/lib/store';
import type { TimerSessionLog } from '@/src/types/study';
import { cn } from '@/lib/utils';

export function TimerScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state, hydrated, completeTimerSession, showToast } = useStudyStore();

  const isFastDemo = searchParams.get('fast') === '1';

  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [phase, setPhase] = useState<'focus' | 'break'>('focus');
  const [selectedTopic, setSelectedTopic] = useState(TIMER_TOPICS[0]);
  const [secondsLeft, setSecondsLeft] = useState(isFastDemo ? 2 : 25 * 60);
  const [running, setRunning] = useState(false);
  const [completedLog, setCompletedLog] = useState<TimerSessionLog | null>(null);
  const [hasError, setHasError] = useState(false);

  const totalPhaseSeconds = isFastDemo
    ? 2
    : (phase === 'focus' ? focusMinutes : breakMinutes) * 60;

  const endAtMsRef = useRef<number | null>(null);
  const onFinishPhaseRef = useRef<() => void>(() => {});
  useEffect(() => {
    onFinishPhaseRef.current = () => {
      setRunning(false);
      endAtMsRef.current = null;
      if (phase === 'focus') {
        const log = completeTimerSession(selectedTopic, focusMinutes);
        setCompletedLog(log);
      } else {
        setPhase('focus');
        setSecondsLeft(isFastDemo ? 2 : focusMinutes * 60);
        showToast('Break complete! Ready for next focus session.', 'info');
      }
    };
  }, [phase, selectedTopic, focusMinutes, isFastDemo, completeTimerSession, showToast]);

  useEffect(() => {
    if (!running) return;
    if (endAtMsRef.current === null) {
      endAtMsRef.current = Date.now() + secondsLeft * 1000;
    }
    const targetMs = endAtMsRef.current;
    const timer = window.setInterval(() => {
      const nextSeconds = Math.max(0, Math.ceil((targetMs - Date.now()) / 1000));
      setSecondsLeft(nextSeconds);
      if (nextSeconds <= 0) {
        window.clearInterval(timer);
        endAtMsRef.current = null;
        onFinishPhaseRef.current();
      }
    }, 250);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const handleToggleRunning = () => {
    if (running) {
      if (endAtMsRef.current !== null) {
        const remaining = Math.max(
          0,
          Math.ceil((endAtMsRef.current - Date.now()) / 1000)
        );
        setSecondsLeft(remaining);
        endAtMsRef.current = null;
      }
      setRunning(false);
    } else {
      endAtMsRef.current = Date.now() + secondsLeft * 1000;
      setRunning(true);
    }
  };

  if (!hydrated) {
    return <ScreenSkeleton />;
  }

  if (hasError) {
    return (
      <ErrorState
        message="Unable to initialize Pomodoro timer."
        onRetry={() => setHasError(false)}
        onBack={() => navigate('/app/home')}
      />
    );
  }

  if (TIMER_TOPICS.length === 0) {
    return (
      <EmptyState
        title="No study topics found"
        description="Return to Home or Practice to add study topics."
        actionLabel="Back to Home"
        onAction={() => navigate('/app/home')}
      />
    );
  }

  const applyPreset = (focusMins: number, breakMins: number) => {
    const nextFocus = Math.max(5, Math.min(90, focusMins));
    const nextBreak = Math.max(1, Math.min(30, breakMins));
    setRunning(false);
    endAtMsRef.current = null;
    setPhase('focus');
    setFocusMinutes(nextFocus);
    setBreakMinutes(nextBreak);
    setSecondsLeft(isFastDemo ? 2 : nextFocus * 60);
  };

  if (completedLog) {
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

        <Card className="text-center space-y-5 py-8">
          <div className="flex justify-center">
            <SabiMascot mood="celebrate" size={96} />
          </div>

          <div className="space-y-1">
            <Badge tone="amber">Session complete · +{completedLog.xpEarned} XP</Badge>
            <h1 className="text-2xl font-bold text-slate-900 pt-2">
              Great focus session!
            </h1>
            <p className="text-sm text-slate-500">
              {completedLog.topic} · {completedLog.focusMinutes} minutes logged
            </p>
          </div>

          <div className="mx-auto max-w-xs rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-center justify-center gap-2">
            <Flame className="h-5 w-5 text-[#F59E0B]" />
            <span className="text-sm font-bold text-amber-950 tabular-nums">
              Streak updated: {state.streakDays} days
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-md mx-auto">
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                setCompletedLog(null);
                setPhase('break');
                setSecondsLeft(isFastDemo ? 2 : breakMinutes * 60);
                setRunning(true);
              }}
            >
              Start {breakMinutes}m Break
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
        <Badge tone="neutral">
          {phase === 'focus' ? 'Focus session' : 'Break time'}
        </Badge>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Study Timer
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Complete a full focus session to earn +25 XP and grow your streak.
        </p>
      </div>

      {/* Notion-style Circular Timer Card */}
      <Card className="space-y-6">
        {/* Topic selector */}
        <div className="space-y-1.5">
          <label
            htmlFor="timer-topic"
            className="block text-xs font-semibold text-slate-500"
          >
            Focus topic
          </label>
          <select
            id="timer-topic"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            disabled={running}
            className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]"
          >
            {TIMER_TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        {/* Circular SVG Ring */}
        <TimerRingSvg
          progressRatio={
            totalPhaseSeconds === 0 ? 1 : secondsLeft / totalPhaseSeconds
          }
          formattedTime={formatCountdown(secondsLeft)}
          label={phase === 'focus' ? `${focusMinutes}m focus` : `${breakMinutes}m break`}
        />

        {/* Start / Pause / Reset */}
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={handleToggleRunning}
          >
            {running ? (
              <>
                <Pause className="h-4 w-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Start</span>
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              setRunning(false);
              endAtMsRef.current = null;
              setSecondsLeft(totalPhaseSeconds);
            }}
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </Button>
        </div>

        {/* Configurable Focus / Break Presets & Steppers */}
        <div className="border-t border-slate-100 pt-4 space-y-4">
          <p className="text-xs font-semibold text-slate-500 text-center">
            Pomodoro settings (Focus / Break minutes)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-1.5">
              <span className="text-xs font-semibold text-slate-600">Focus</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Decrease focus minutes"
                  disabled={running || focusMinutes <= 5}
                  onClick={() => applyPreset(focusMinutes - 5, breakMinutes)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-700 hover:bg-white disabled:opacity-40 cursor-pointer"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-slate-900 tabular-nums">
                  {focusMinutes}m
                </span>
                <button
                  type="button"
                  aria-label="Increase focus minutes"
                  disabled={running || focusMinutes >= 90}
                  onClick={() => applyPreset(focusMinutes + 5, breakMinutes)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-700 hover:bg-white disabled:opacity-40 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-1.5">
              <span className="text-xs font-semibold text-slate-600">Break</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Decrease break minutes"
                  disabled={running || breakMinutes <= 1}
                  onClick={() => applyPreset(focusMinutes, breakMinutes - 1)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-700 hover:bg-white disabled:opacity-40 cursor-pointer"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-slate-900 tabular-nums">
                  {breakMinutes}m
                </span>
                <button
                  type="button"
                  aria-label="Increase break minutes"
                  disabled={running || breakMinutes >= 30}
                  onClick={() => applyPreset(focusMinutes, breakMinutes + 1)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-700 hover:bg-white disabled:opacity-40 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: '25 / 5', f: 25, b: 5 },
              { label: '15 / 3', f: 15, b: 3 },
              { label: '45 / 10', f: 45, b: 10 },
            ].map((preset) => {
              const active =
                focusMinutes === preset.f && breakMinutes === preset.b;
              return (
                <button
                  key={preset.label}
                  type="button"
                  disabled={running}
                  onClick={() => applyPreset(preset.f, preset.b)}
                  className={cn(
                    'min-h-[44px] rounded-xl border px-4 text-xs font-bold tabular-nums transition-colors cursor-pointer disabled:opacity-50',
                    active
                      ? 'border-[#16A34A] bg-green-50 text-[#16A34A]'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  )}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
