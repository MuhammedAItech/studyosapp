'use client';

import React from 'react';
import { Card } from '@/src/components/ui';
import type { OptionKey, SampleQuestion } from '@/src/types/study';
import { cn } from '@/lib/utils';

interface CbtNavigatorCardProps {
  questions: SampleQuestion[];
  currentIndex: number;
  answers: Record<string, OptionKey>;
  flagged: Record<string, boolean>;
  answeredCount: number;
  unansweredCount: number;
  flaggedCount: number;
  onSelectQuestion: (index: number) => void;
}

export function CbtNavigatorCard({
  questions,
  currentIndex,
  answers,
  flagged,
  answeredCount,
  unansweredCount,
  flaggedCount,
  onSelectQuestion,
}: CbtNavigatorCardProps) {
  return (
    <aside className="lg:col-span-4">
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Question Navigator
          </h2>
          <span className="text-xs text-slate-500 tabular-nums">
            {answeredCount}/{questions.length}
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-4 gap-2">
          {questions.map((q, idx) => {
            const isCurrent = idx === currentIndex;
            const isAnswered = Boolean(answers[q.id]);
            const qFlagged = Boolean(flagged[q.id]);
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onSelectQuestion(idx)}
                aria-label={`Question ${idx + 1}${
                  isAnswered ? ', answered' : ', unanswered'
                }${qFlagged ? ', flagged' : ''}`}
                className={cn(
                  'relative min-h-[44px] rounded-xl border text-xs font-bold tabular-nums transition-colors cursor-pointer',
                  isAnswered
                    ? 'border-[#16A34A] bg-[#16A34A] text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
                  isCurrent && 'ring-2 ring-slate-900 ring-offset-1',
                  qFlagged &&
                    !isAnswered &&
                    'border-[#F59E0B] bg-amber-50 text-amber-900'
                )}
              >
                {idx + 1}
                {qFlagged && (
                  <span
                    aria-hidden="true"
                    className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#F59E0B]"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-600">
          <p className="flex items-center justify-between">
            <span>Answered</span>
            <span className="font-bold tabular-nums">{answeredCount}</span>
          </p>
          <p className="flex items-center justify-between">
            <span>Unanswered</span>
            <span className="font-bold tabular-nums">{unansweredCount}</span>
          </p>
          <p className="flex items-center justify-between">
            <span>Flagged</span>
            <span className="font-bold tabular-nums">{flaggedCount}</span>
          </p>
        </div>
      </Card>
    </aside>
  );
}
