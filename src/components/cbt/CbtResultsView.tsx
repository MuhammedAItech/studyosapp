'use client';

import React from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { Button, Card } from '@/src/components/ui';
import { formatCountdown } from '@/src/lib/study-logic';
import type { CbtResultSummary } from '@/src/types/study';

interface CbtResultsViewProps {
  summary: CbtResultSummary;
  onRetake: () => void;
  onExit: () => void;
}

export function CbtResultsView({
  summary,
  onRetake,
  onExit,
}: CbtResultsViewProps) {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Exit to App</span>
          </button>
          <span className="text-xs font-semibold text-slate-500">
            Sample CBT Report
          </span>
        </div>

        <Card className="space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <p className="text-xs font-semibold text-slate-500">
              JAMB UTME Simulation Complete
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
              Estimated Score: {summary.estimatedJambScore} / 400
            </h1>
            <p className="mt-1 text-sm text-slate-500 tabular-nums">
              {summary.correctCount} of {summary.totalQuestions} correct (
              {summary.accuracyPercent}%) · Time used:{' '}
              {formatCountdown(summary.timeUsedSeconds)}
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">
              Per-subject breakdown
            </h2>
            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden">
              {summary.breakdown.map((item) => (
                <div
                  key={item.subjectName}
                  className="flex items-center justify-between gap-4 bg-white px-4 py-3.5"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {item.subjectName}
                    </p>
                    <p className="text-xs text-slate-500 tabular-nums">
                      {item.correct}/{item.total} correct · {item.answered}{' '}
                      answered
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-slate-900 tabular-nums">
                      {item.jambScaledScore}
                    </p>
                    <p className="text-[11px] text-slate-500">/ 100</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Button variant="primary" fullWidth onClick={onRetake}>
              <RotateCcw className="h-4 w-4" />
              <span>Retake CBT</span>
            </Button>
            <Button variant="outline" fullWidth onClick={onExit}>
              Return to Study OS
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
