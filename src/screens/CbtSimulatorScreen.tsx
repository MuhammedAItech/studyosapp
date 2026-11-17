'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calculator,
  Flag,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Clock,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Modal,
  ScreenSkeleton,
} from '@/src/components/ui';
import { CbtCalculatorModal } from '@/src/components/cbt/CbtCalculatorModal';
import { CbtNavigatorCard } from '@/src/components/cbt/CbtNavigatorCard';
import { CbtResultsView } from '@/src/components/cbt/CbtResultsView';
import { CBT_QUESTIONS } from '@/src/data/cbt';
import {
  calculateCbtBreakdown,
  formatCountdown,
} from '@/src/lib/study-logic';
import { useStudyStore } from '@/src/lib/store';
import type { CbtResultSummary, OptionKey } from '@/src/types/study';
import { cn } from '@/lib/utils';

const DEFAULT_DURATION_SECONDS = 120 * 60; // 120:00
const TEST_DURATION_SECONDS = 60; // 01:00 for quick testing
const OPTION_KEYS: OptionKey[] = ['A', 'B', 'C', 'D'];

export function CbtSimulatorScreen() {
  const navigate = useNavigate();
  const { hydrated, showToast } = useStudyStore();

  const [initialDuration, setInitialDuration] = useState(
    DEFAULT_DURATION_SECONDS
  );
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_DURATION_SECONDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, OptionKey>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [calcOpen, setCalcOpen] = useState(false);
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [resultSummary, setResultSummary] = useState<CbtResultSummary | null>(
    null
  );
  const [hasError, setHasError] = useState(false);

  const questions = CBT_QUESTIONS;
  const currentQuestion = questions[currentIndex];

  const endAtMsRef = useRef<number | null>(null);
  const autoSubmittedRef = useRef(false);

  const handleSubmitExam = useCallback(() => {
    setSubmitModalOpen(false);
    setCalcOpen(false);
    setExitModalOpen(false);
    endAtMsRef.current = null;
    const summary = calculateCbtBreakdown({
      questions,
      answers,
      timeUsedSeconds: Math.max(0, initialDuration - secondsLeft),
    });
    setResultSummary(summary);
  }, [questions, answers, initialDuration, secondsLeft]);

  const autoSubmitRef = useRef<() => void>(() => {});
  useEffect(() => {
    autoSubmitRef.current = () => {
      if (autoSubmittedRef.current) return;
      autoSubmittedRef.current = true;
      showToast('Time elapsed. Exam submitted.', 'info');
      handleSubmitExam();
    };
  }, [handleSubmitExam, showToast]);

  useEffect(() => {
    if (!hydrated || resultSummary || questions.length === 0) return;
    if (endAtMsRef.current === null) {
      endAtMsRef.current = Date.now() + secondsLeft * 1000;
    }
    const timer = window.setInterval(() => {
      if (endAtMsRef.current === null) return;
      const next = Math.max(
        0,
        Math.ceil((endAtMsRef.current - Date.now()) / 1000)
      );
      setSecondsLeft(next);
      if (next <= 0) {
        window.clearInterval(timer);
        endAtMsRef.current = null;
        autoSubmitRef.current();
      }
    }, 250);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, resultSummary, questions.length, initialDuration]);

  useEffect(() => {
    if (resultSummary || calcOpen || exitModalOpen || submitModalOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT')
      ) {
        return;
      }

      const key = event.key.toUpperCase();
      if (
        (key === 'A' || key === 'B' || key === 'C' || key === 'D') &&
        currentQuestion
      ) {
        setAnswers((prev) => ({
          ...prev,
          [currentQuestion.id]: key as OptionKey,
        }));
      } else if (key === 'N') {
        setCurrentIndex((i) => Math.min(questions.length - 1, i + 1));
      } else if (key === 'P') {
        setCurrentIndex((i) => Math.max(0, i - 1));
      } else if (key === 'S') {
        setSubmitModalOpen(true);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    resultSummary,
    calcOpen,
    exitModalOpen,
    submitModalOpen,
    currentQuestion,
    questions.length,
  ]);

  const counts = useMemo(() => {
    const answeredCount = Object.keys(answers).length;
    const flaggedCount = Object.values(flagged).filter(Boolean).length;
    return {
      answeredCount,
      unansweredCount: questions.length - answeredCount,
      flaggedCount,
    };
  }, [answers, flagged, questions.length]);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <ScreenSkeleton />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <ErrorState
          message="Could not initialize JAMB CBT exam session."
          onRetry={() => setHasError(false)}
          onBack={() => navigate('/app/practice')}
        />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <EmptyState
          title="No CBT questions loaded"
          description="Return to Practice to select a topic drill."
          actionLabel="Back to Practice"
          onAction={() => navigate('/app/practice')}
        />
      </div>
    );
  }

  const handleRetake = () => {
    autoSubmittedRef.current = false;
    endAtMsRef.current = Date.now() + DEFAULT_DURATION_SECONDS * 1000;
    setAnswers({});
    setFlagged({});
    setCurrentIndex(0);
    setInitialDuration(DEFAULT_DURATION_SECONDS);
    setSecondsLeft(DEFAULT_DURATION_SECONDS);
    setResultSummary(null);
  };

  if (resultSummary) {
    return (
      <CbtResultsView
        summary={resultSummary}
        onRetake={handleRetake}
        onExit={() => navigate('/app/home')}
      />
    );
  }

  const isFlagged = Boolean(flagged[currentQuestion.id]);
  const selected = answers[currentQuestion.id];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Calm CBT Status Header (Full-screen, no bottom nav) */}
      <header className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExitModalOpen(true)}
            >
              <LogOut className="h-4 w-4" />
              <span>Exit</span>
            </Button>
            <div>
              <p className="text-sm font-bold text-slate-900">
                JAMB CBT Simulator
              </p>
              <p className="text-xs text-slate-500">
                Sample Paper · {currentQuestion.subjectName}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const next =
                  initialDuration === DEFAULT_DURATION_SECONDS
                    ? TEST_DURATION_SECONDS
                    : DEFAULT_DURATION_SECONDS;
                autoSubmittedRef.current = false;
                endAtMsRef.current = Date.now() + next * 1000;
                setInitialDuration(next);
                setSecondsLeft(next);
                showToast(
                  next === TEST_DURATION_SECONDS
                    ? 'Timer shortened to 01:00 for testing'
                    : 'Timer reset to 120:00',
                  'info'
                );
              }}
              className="min-h-[44px] rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              {initialDuration === DEFAULT_DURATION_SECONDS
                ? 'Test 01:00'
                : 'Reset 120:00'}
            </button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCalcOpen(true)}
            >
              <Calculator className="h-4 w-4" />
              <span>Calculator</span>
            </Button>

            <div
              aria-label="Exam time remaining"
              className={cn(
                'flex min-h-[44px] items-center gap-2 rounded-xl border px-3.5 text-sm font-bold tabular-nums',
                secondsLeft <= 60
                  ? 'border-red-200 bg-red-50 text-[#DC2626]'
                  : 'border-slate-200 bg-slate-50 text-slate-900'
              )}
            >
              <Clock className="h-4 w-4" />
              <span>{formatCountdown(secondsLeft)}</span>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setSubmitModalOpen(true)}
            >
              Submit
            </Button>
          </div>
        </div>
      </header>

      {/* Main Exam Workspace */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Question Column */}
          <div className="lg:col-span-8 space-y-4">
            <Card className="space-y-5">
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 tabular-nums">
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  <Badge tone="neutral">Sample</Badge>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFlagged((prev) => ({
                      ...prev,
                      [currentQuestion.id]: !prev[currentQuestion.id],
                    }))
                  }
                  className={cn(
                    'inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition-colors cursor-pointer',
                    isFlagged
                      ? 'border-amber-300 bg-amber-50 text-amber-900'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  )}
                >
                  <Flag className="h-4 w-4" />
                  <span>{isFlagged ? 'Flagged' : 'Flag'}</span>
                </button>
              </div>

              <h1 className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
                {currentQuestion.prompt}
              </h1>

              <div className="space-y-2.5">
                {OPTION_KEYS.map((key) => {
                  const isChosen = selected === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [currentQuestion.id]: key,
                        }))
                      }
                      className={cn(
                        'w-full min-h-[52px] rounded-xl border px-4 py-3 text-left text-sm font-medium flex items-center gap-3 transition-colors cursor-pointer',
                        isChosen
                          ? 'border-[#16A34A] bg-green-50 text-green-900'
                          : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-7 w-7 items-center justify-center rounded-lg border text-xs font-bold shrink-0',
                          isChosen
                            ? 'border-[#16A34A] bg-[#16A34A] text-white'
                            : 'border-slate-300 text-slate-700'
                        )}
                      >
                        {key}
                      </span>
                      <span>{currentQuestion.options[key]}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <Button
                  variant="outline"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
                <Button
                  variant="primary"
                  disabled={currentIndex === questions.length - 1}
                  onClick={() =>
                    setCurrentIndex((i) =>
                      Math.min(questions.length - 1, i + 1)
                    )
                  }
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            <p className="text-xs text-slate-500">
              Keyboard shortcuts: <kbd className="font-semibold">A–D</kbd>{' '}
              select option · <kbd className="font-semibold">N</kbd> next ·{' '}
              <kbd className="font-semibold">P</kbd> previous ·{' '}
              <kbd className="font-semibold">S</kbd> submit
            </p>
          </div>

          {/* Navigator Grid */}
          <CbtNavigatorCard
            questions={questions}
            currentIndex={currentIndex}
            answers={answers}
            flagged={flagged}
            answeredCount={counts.answeredCount}
            unansweredCount={counts.unansweredCount}
            flaggedCount={counts.flaggedCount}
            onSelectQuestion={setCurrentIndex}
          />
        </div>
      </main>

      <CbtCalculatorModal
        open={calcOpen}
        onClose={() => setCalcOpen(false)}
      />

      <Modal
        open={exitModalOpen}
        onClose={() => setExitModalOpen(false)}
        title="Exit JAMB CBT Simulator?"
        description="Your current simulation progress will not be saved."
      >
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => setExitModalOpen(false)}>
            Stay in exam
          </Button>
          <Button variant="danger" onClick={() => navigate('/app/practice')}>
            Exit exam
          </Button>
        </div>
      </Modal>

      <Modal
        open={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        title="Submit exam?"
        description={`You have answered ${counts.answeredCount} of ${questions.length} questions (${counts.unansweredCount} unanswered, ${counts.flaggedCount} flagged).`}
      >
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => setSubmitModalOpen(false)}>
            Review questions
          </Button>
          <Button variant="primary" onClick={handleSubmitExam}>
            Confirm submit
          </Button>
        </div>
      </Modal>
    </div>
  );
}
