'use client';

import React, { useState } from 'react';
import { Delete } from 'lucide-react';
import { Button, Modal } from '@/src/components/ui';
import { evaluateCalculatorExpression } from '@/src/lib/study-logic';

interface CbtCalculatorModalProps {
  open: boolean;
  onClose: () => void;
}

const KEYS = [
  '7', '8', '9', '/',
  '4', '5', '6', '*',
  '1', '2', '3', '-',
  '0', '.', '(', ')',
];

export function CbtCalculatorModal({ open, onClose }: CbtCalculatorModalProps) {
  const [expression, setExpression] = useState('');

  const handleKey = (val: string) => {
    setExpression((prev) => (prev === 'Error' ? val : prev + val));
  };

  const handleEvaluate = () => {
    setExpression((prev) => evaluateCalculatorExpression(prev));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="JAMB CBT Calculator"
      description="Basic arithmetic calculator for exam calculations."
      maxWidthClass="max-w-xs"
    >
      <div className="space-y-3">
        <div
          aria-live="polite"
          className="min-h-[56px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-right text-xl font-bold text-slate-900 tabular-nums break-all"
        >
          {expression || '0'}
        </div>

        <div className="grid grid-cols-4 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpression('')}
            className="col-span-2"
          >
            Clear
          </Button>
          <Button
            variant="outline"
            size="sm"
            aria-label="Backspace"
            onClick={() => setExpression((prev) => prev.slice(0, -1))}
          >
            <Delete className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleKey('+')}>
            +
          </Button>

          {KEYS.map((key) => (
            <Button
              key={key}
              variant="outline"
              size="sm"
              onClick={() => handleKey(key)}
            >
              {key}
            </Button>
          ))}

          <Button
            variant="primary"
            size="sm"
            onClick={handleEvaluate}
            className="col-span-4"
          >
            =
          </Button>
        </div>
      </div>
    </Modal>
  );
}
