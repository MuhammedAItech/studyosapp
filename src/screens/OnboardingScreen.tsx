'use client';

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  Input,
  ProgressBar,
  ScreenSkeleton,
} from '@/src/components/ui';
import {
  AVAILABLE_SUBJECTS,
  CRAWFORD_COURSES,
  EXAM_OPTIONS,
} from '@/src/data/exams';
import {
  formatLocalDate,
  getDefaultExamDate,
  toggleSubjectSelection,
  validateExamDate,
} from '@/src/lib/study-logic';
import { useStudyStore } from '@/src/lib/store';
import type { ExamType } from '@/src/types/study';
import { cn } from '@/lib/utils';

export function OnboardingScreen() {
  const navigate = useNavigate();
  const { state, hydrated, saveOnboarding, showToast } = useStudyStore();

  const [step, setStep] = useState<number>(1);
  const [exam, setExam] = useState<ExamType>(state.onboarding.exam);
  const [subjects, setSubjects] = useState<string[]>(
    state.onboarding.subjects.length > 0
      ? state.onboarding.subjects
      : ['Use of English']
  );
  const [subjectWarning, setSubjectWarning] = useState<string | null>(null);
  const [examDate, setExamDate] = useState<string>(
    state.onboarding.examDate || getDefaultExamDate(47)
  );
  const [crawfordCourse, setCrawfordCourse] = useState<string>(
    state.onboarding.crawfordCourse
  );
  const [dateError, setDateError] = useState<string | null>(null);

  const filteredCourses = useMemo(() => {
    const query = crawfordCourse.trim().toLowerCase();
    if (!query) return CRAWFORD_COURSES;
    return CRAWFORD_COURSES.filter(
      (c) =>
        c.code.toLowerCase().includes(query) ||
        c.title.toLowerCase().includes(query)
    );
  }, [crawfordCourse]);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <ScreenSkeleton />
      </div>
    );
  }

  const handleExamSelect = (selectedExam: ExamType) => {
    setExam(selectedExam);
    setSubjectWarning(null);
    if (selectedExam === 'JAMB') {
      const next = subjects.includes('Use of English')
        ? subjects.slice(0, 4)
        : ['Use of English', ...subjects].slice(0, 4);
      setSubjects(next);
    }
  };

  const handleSubjectToggle = (subject: string) => {
    const result = toggleSubjectSelection(subjects, subject, exam);
    setSubjects(result.subjects);
    setSubjectWarning(result.error);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => s - 1);
      return;
    }
    navigate('/auth');
  };

  const minExamDate = formatLocalDate(new Date());

  const handleNext = () => {
    if (step === 2 && subjects.length === 0) {
      setSubjectWarning('Select at least 1 subject to continue.');
      return;
    }
    if (step === 3) {
      const err = validateExamDate(examDate);
      if (err) {
        setDateError(err);
        return;
      }
    }
    setDateError(null);
    if (step < 4) {
      setStep((s) => s + 1);
      return;
    }

    saveOnboarding({
      exam,
      subjects,
      examDate,
      crawfordCourse: crawfordCourse.trim(),
    });
    showToast('Study plan saved', 'success');
    navigate('/app/home');
  };

  if (step < 1 || step > 4) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <ErrorState
          message="Onboarding step was out of range."
          onRetry={() => setStep(1)}
          onBack={() => navigate('/auth')}
        />
      </div>
    );
  }

  if (EXAM_OPTIONS.length === 0 || AVAILABLE_SUBJECTS.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <EmptyState
          title="No exam options configured"
          description="Return to Sign in or jump straight into the Study OS workspace."
          actionLabel="Open Study OS"
          onAction={() => navigate('/app/home')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-lg space-y-6">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          <span className="text-xs font-semibold text-slate-500 tabular-nums">
            Step {step} of 4
          </span>
        </div>

        <ProgressBar value={step} max={4} />

        <Card className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Which exam are you preparing for?
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  We&apos;ll tailor your subjects and CBT timer to match.
                </p>
              </div>
              <div className="space-y-3">
                {EXAM_OPTIONS.map((opt) => {
                  const active = exam === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleExamSelect(opt.id)}
                      className={cn(
                        'w-full min-h-[64px] rounded-2xl border p-4 text-left transition-colors cursor-pointer flex items-center justify-between gap-3',
                        active
                          ? 'border-[#16A34A] bg-green-50/70'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      )}
                    >
                      <div>
                        <p className="text-base font-bold text-slate-900">
                          {opt.label}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {opt.subtitle}
                        </p>
                      </div>
                      <span
                        className={cn(
                          'flex h-6 w-6 items-center justify-center rounded-full border shrink-0',
                          active
                            ? 'border-[#16A34A] bg-[#16A34A] text-white'
                            : 'border-slate-300 bg-white'
                        )}
                      >
                        {active && <Check className="h-3.5 w-3.5" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Pick your {exam} subjects
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {exam === 'JAMB'
                    ? 'Choose up to 4 subjects. Use of English is pre-selected.'
                    : `Selected ${subjects.length} subject(s) for ${exam}.`}
                </p>
              </div>

              {subjectWarning && (
                <p
                  role="alert"
                  className="rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-2.5 text-xs font-semibold text-amber-900"
                >
                  {subjectWarning}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {AVAILABLE_SUBJECTS.map((subject) => {
                  const selected = subjects.includes(subject);
                  const locked =
                    exam === 'JAMB' && subject === 'Use of English';
                  return (
                    <button
                      key={subject}
                      type="button"
                      onClick={() => handleSubjectToggle(subject)}
                      className={cn(
                        'min-h-[48px] rounded-xl border px-3.5 py-2.5 text-left text-sm font-semibold flex items-center justify-between gap-2 transition-colors cursor-pointer',
                        selected
                          ? 'border-[#16A34A] bg-green-50 text-green-900'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      )}
                    >
                      <span className="truncate">
                        {subject}
                        {locked ? ' (Required)' : ''}
                      </span>
                      {selected && (
                        <Check className="h-4 w-4 text-[#16A34A] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  When is your exam date?
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Used to calculate your daily countdown on Home.
                </p>
              </div>
              <Input
                label="Target exam date"
                type="date"
                min={minExamDate}
                value={examDate}
                onChange={(e) => {
                  setExamDate(e.target.value);
                  if (dateError) setDateError(validateExamDate(e.target.value));
                }}
                error={dateError ?? undefined}
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Crawford University course (optional)
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  If you&apos;re in the Crawford pilot, pick or type a course
                  code. Otherwise leave blank.
                </p>
              </div>

              <Input
                label="Course code or title"
                type="text"
                placeholder="e.g. CSC 201, GST 102, BUS 301"
                value={crawfordCourse}
                onChange={(e) => setCrawfordCourse(e.target.value)}
                list="crawford-course-list"
              />
              <datalist id="crawford-course-list">
                {CRAWFORD_COURSES.map((course) => (
                  <option
                    key={course.code}
                    value={`${course.code} — ${course.title}`}
                  />
                ))}
              </datalist>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500">
                  Pilot suggestions
                </p>
                {filteredCourses.length === 0 ? (
                  <p className="text-xs text-slate-500 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                    No preset Crawford course matched &ldquo;{crawfordCourse}&rdquo;. Your custom entry will still be saved.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {filteredCourses.slice(0, 6).map((course) => {
                      const label = `${course.code} — ${course.title}`;
                      const active = crawfordCourse === label;
                      return (
                        <button
                          key={course.code}
                          type="button"
                          onClick={() =>
                            setCrawfordCourse(active ? '' : label)
                          }
                          className={cn(
                            'min-h-[44px] rounded-xl border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer',
                            active
                              ? 'border-[#16A34A] bg-green-50 text-green-900'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          )}
                        >
                          {course.code}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center gap-3">
            <Button variant="primary" size="lg" fullWidth onClick={handleNext}>
              {step === 4 ? 'Finish & open Study OS' : 'Continue'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
