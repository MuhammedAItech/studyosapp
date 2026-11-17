'use client';

import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Flag,
  ChevronRight,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Input,
  Modal,
  ProgressBar,
  ScreenSkeleton,
} from '@/src/components/ui';
import { PRACTICE_QUESTIONS, PRACTICE_SUBJECTS } from '@/src/data/practice';
import { calculatePracticeResult } from '@/src/lib/study-logic';
import { useStudyStore } from '@/src/lib/store';
import type { OptionKey } from '@/src/types/study';
import { cn } from '@/lib/utils';

const OPTION_KEYS: OptionKey[] = ['A', 'B', 'C', 'D'];

export function PracticeQuestionScreen() {
  const { subjectId, topicId } = useParams<{
    subjectId: string;
    topicId: string;
  }>();
  const navigate = useNavigate();
  const { hydrated } = useStudyStore();

  const subject = PRACTICE_SUBJECTS.find((s) => s.id === subjectId);
  const topic = subject?.topics.find((t) => t.id === topicId);

  const questions = useMemo(
    () =>
      PRACTICE_QUESTIONS.filter(
        (q) => q.subjectId === subjectId && q.topicId === topicId
      ),
    [subjectId, topicId]
  );

  if (!hydrated) {
    return <ScreenSkeleton />;
  }

  if (!subject || !topic) {
    return (
      <ErrorState
        title="Topic not found"
        message="That practice topic could not be located."
        onBack={() =>
          navigate(subject ? `/app/practice/${subject.id}` : '/app/practice')
        }
      />
    );
  }

  return (
    <PracticeQuestionRunner
      key={`${subject.id}-${topic.id}`}
      subjectId={subject.id}
      subjectName={subject.name}
      topicId={topic.id}
      topicTitle={topic.title}
      questions={questions}
    />
  );
}

interface PracticeQuestionRunnerProps {
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicTitle: string;
  questions: typeof PRACTICE_QUESTIONS;
}

function PracticeQuestionRunner({
  subjectId,
  subjectName,
  topicId,
  topicTitle,
  questions,
}: PracticeQuestionRunnerProps) {
  const navigate = useNavigate();
  const { recordPracticeSession, submitProblemReport, showToast } =
    useStudyStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, OptionKey>>({});
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Wrong answer or typo');
  const [reportDetails, setReportDetails] = useState('');

  if (questions.length === 0) {
    return (
      <EmptyState
        title="No sample questions here"
        description="This topic has no sample questions loaded yet."
        actionLabel="Back to topics"
        onAction={() => navigate(`/app/practice/${subjectId}`)}
      />
    );
  }

  const question = questions[currentIndex];
  const selectedOption = answers[question.id];
  const hasAnswered = Boolean(selectedOption);
  const isCorrect = selectedOption === question.correctOption;

  const handleSelectOption = (key: OptionKey) => {
    if (hasAnswered) return;
    setAnswers((prev) => ({ ...prev, [question.id]: key }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      return;
    }

    const result = calculatePracticeResult({
      subjectId,
      topicId,
      topicTitle,
      questions,
      answers,
    });
    recordPracticeSession(result);
    navigate(`/app/practice/${subjectId}/${topicId}/results`);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitProblemReport(question.id, reportReason, reportDetails.trim());
    setReportOpen(false);
    setReportDetails('');
    showToast('Problem reported. Thank you for the feedback!', 'success');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate(`/app/practice/${subjectId}`)}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Topics</span>
        </button>

        <div className="flex items-center gap-2">
          <Badge tone="neutral">Sample</Badge>
          <span className="text-xs font-semibold text-slate-600 tabular-nums">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
      </div>

      <ProgressBar value={currentIndex + 1} max={questions.length} />

      <Card className="space-y-5">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-500">
            {subjectName} · {topicTitle}
          </p>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            {question.prompt}
          </h1>
        </div>

        <div className="space-y-2.5">
          {OPTION_KEYS.map((key) => {
            const isSelected = selectedOption === key;
            const isRightOption = question.correctOption === key;

            let styleClass =
              'border-slate-200 bg-white text-slate-800 hover:border-slate-300';
            if (hasAnswered) {
              if (isRightOption) {
                styleClass = 'border-[#16A34A] bg-green-50 text-green-900';
              } else if (isSelected && !isRightOption) {
                styleClass = 'border-[#DC2626] bg-red-50 text-red-900';
              } else {
                styleClass = 'border-slate-200 bg-slate-50/70 text-slate-500';
              }
            }

            return (
              <button
                key={key}
                type="button"
                disabled={hasAnswered}
                onClick={() => handleSelectOption(key)}
                className={cn(
                  'w-full min-h-[52px] rounded-xl border px-4 py-3 text-left text-sm font-medium flex items-center justify-between gap-3 transition-colors cursor-pointer disabled:cursor-default',
                  styleClass
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-current/20 text-xs font-bold shrink-0">
                    {key}
                  </span>
                  <span className="break-words">{question.options[key]}</span>
                </div>
                {hasAnswered && isRightOption && (
                  <CheckCircle2 className="h-5 w-5 text-[#16A34A] shrink-0" />
                )}
                {hasAnswered && isSelected && !isRightOption && (
                  <XCircle className="h-5 w-5 text-[#DC2626] shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {hasAnswered && (
          <div
            role="region"
            aria-label="Answer explanation"
            className={cn(
              'rounded-2xl border p-4 space-y-2',
              isCorrect
                ? 'border-green-200 bg-green-50/70'
                : 'border-red-200 bg-red-50/60'
            )}
          >
            <div className="flex items-center gap-2 text-sm font-bold">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
                  <span className="text-green-900">Correct (+10 XP)</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-[#DC2626]" />
                  <span className="text-red-900">
                    Incorrect · Correct answer is {question.correctOption}
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {question.explanation}
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setReportOpen(true)}
          >
            <Flag className="h-4 w-4" />
            <span>Report a problem</span>
          </Button>

          <Button
            variant="primary"
            disabled={!hasAnswered}
            onClick={handleNext}
          >
            <span>
              {currentIndex === questions.length - 1
                ? 'View results'
                : 'Next question'}
            </span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <Modal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Report a problem"
        description="Help us fix errors in this sample question."
      >
        <form onSubmit={handleReportSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="report-reason"
              className="block text-sm font-medium text-slate-700"
            >
              Reason
            </label>
            <select
              id="report-reason"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]"
            >
              <option>Wrong answer or typo</option>
              <option>Unclear explanation</option>
              <option>Missing diagram or text</option>
            </select>
          </div>

          <Input
            label="Details (optional)"
            placeholder="Describe what looks off..."
            value={reportDetails}
            onChange={(e) => setReportDetails(e.target.value)}
          />

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setReportOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit report
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
