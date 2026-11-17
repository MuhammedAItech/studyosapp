'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Image as ImageIcon,
  Mic,
  Send,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  ProgressBar,
  ScreenSkeleton,
} from '@/src/components/ui';
import { SabiMascot } from '@/src/components/art/StudyArt';
import { TUTOR_QUICK_PROMPTS } from '@/src/data/tutor';
import { useStudyStore } from '@/src/lib/store';
import { cn } from '@/lib/utils';

export function TutorScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    state,
    hydrated,
    setTutorLanguage,
    appendTutorExchange,
    setTutorQuotaForDemo,
    showToast,
  } = useStudyStore();

  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasError, setHasError] = useState(false);
  const replyTimerRef = useRef<number | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (searchParams.get('quota') === '0' && state.tutorQuotaLeft !== 0) {
      setTutorQuotaForDemo(0);
    }
  }, [searchParams, state.tutorQuotaLeft, setTutorQuotaForDemo]);

  useEffect(() => {
    return () => {
      if (replyTimerRef.current) window.clearTimeout(replyTimerRef.current);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [state.tutorMessages.length, isTyping]);

  if (!hydrated) {
    return <ScreenSkeleton />;
  }

  if (hasError) {
    return (
      <ErrorState
        message="Unable to load Sabi Tutor right now."
        onRetry={() => setHasError(false)}
        onBack={() => navigate('/app/home')}
      />
    );
  }

  const quotaHitZero = state.tutorQuotaLeft <= 0;

  const handleSend = (textToSend?: string) => {
    const clean = (textToSend ?? draft).trim();
    if (!clean || isTyping) return;
    setDraft('');
    setIsTyping(true);

    replyTimerRef.current = window.setTimeout(() => {
      appendTutorExchange(clean);
      setIsTyping(false);
    }, 350);
  };

  return (
    <div className="space-y-5">
      {/* Header row (no app top bar) */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/app/home')}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Home</span>
        </button>

        {/* Pidgin / English toggle */}
        <div
          role="group"
          aria-label="Tutor reply language"
          className="inline-flex rounded-xl bg-slate-100 p-1"
        >
          <button
            type="button"
            onClick={() => {
              setTutorLanguage('english');
              showToast('Tutor switched to English', 'info');
            }}
            className={cn(
              'min-h-[44px] rounded-lg px-3.5 text-xs font-bold transition-colors cursor-pointer',
              state.tutorLanguage === 'english'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => {
              setTutorLanguage('pidgin');
              showToast('Tutor switched to Pidgin', 'info');
            }}
            className={cn(
              'min-h-[44px] rounded-lg px-3.5 text-xs font-bold transition-colors cursor-pointer',
              state.tutorLanguage === 'pidgin'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Pidgin
          </button>
        </div>
      </div>

      {/* Brainly-inspired Hero + Quota Bar */}
      <Card className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <SabiMascot
            mood={isTyping ? 'thinking' : 'happy'}
            size={68}
            className="mx-auto sm:mx-0"
          />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Ask Sabi Tutor
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
              Step-by-step sample explanations in{' '}
              <span className="font-semibold text-slate-700">
                {state.tutorLanguage === 'pidgin' ? 'Nigerian Pidgin' : 'English'}
              </span>
              .
            </p>
          </div>
        </div>

        <div className="space-y-1.5 border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-600">Daily message quota</span>
            <span
              className={cn(
                'tabular-nums',
                quotaHitZero ? 'text-[#DC2626]' : 'text-slate-800'
              )}
            >
              {state.tutorQuotaLeft} of {state.tutorQuotaMax} messages left
            </span>
          </div>
          <ProgressBar
            value={state.tutorQuotaLeft}
            max={state.tutorQuotaMax}
            tone={quotaHitZero ? 'amber' : 'primary'}
          />
        </div>
      </Card>

      {/* Quota 0 notice */}
      {quotaHitZero && (
        <Card className="border-amber-200 bg-amber-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-[#D97706] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-950">
                Cached explanation mode
              </p>
              <p className="text-xs text-amber-900 mt-0.5">
                You have 0 of {state.tutorQuotaMax} messages left today.
                Replies now come from offline cached sample guides.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/#pricing')}
          >
            <Sparkles className="h-4 w-4" />
            <span>Upgrade</span>
          </Button>
        </Card>
      )}

      {/* Chat Messages */}
      <Card padding="sm" className="space-y-4">
        {state.tutorMessages.length === 0 ? (
          <EmptyState
            title="No messages yet"
            description="Pick a quick prompt below or type any JAMB/WAEC topic."
          />
        ) : (
          <div
            className="max-h-[380px] overflow-y-auto space-y-3 p-2"
            aria-live="polite"
          >
            {state.tutorMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={cn(
                    'flex items-end gap-2.5',
                    isUser ? 'justify-end' : 'justify-start'
                  )}
                >
                  {!isUser && (
                    <SabiMascot mood="happy" size={32} className="mb-1" />
                  )}
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                      isUser
                        ? 'bg-[#16A34A] text-white rounded-br-sm'
                        : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-bl-sm'
                    )}
                  >
                    <p className="font-medium">{msg.text}</p>
                    {msg.steps && msg.steps.length > 0 && (
                      <ul className="mt-2 space-y-1.5 text-xs sm:text-sm text-slate-700">
                        {msg.steps.map((step, idx) => (
                          <li key={`${msg.id}-step-${idx}`}>{step}</li>
                        ))}
                      </ul>
                    )}
                    {msg.cached && (
                      <p className="mt-2 text-[11px] font-semibold text-amber-700">
                        Cached explanation (offline sample)
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2.5">
                <SabiMascot mood="thinking" size={32} />
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-500">
                  Sabi is typing...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Quick Prompt Chips */}
        <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3 px-1">
          {TUTOR_QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSend(prompt)}
              className="min-h-[44px] rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-[#16A34A] hover:bg-green-50/50 transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Brainly-style Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="rounded-2xl border border-slate-200 bg-slate-50/60 p-2 flex flex-wrap sm:flex-nowrap items-center gap-2"
        >
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask a question (e.g. quadratic, concord, indices)..."
            aria-label="Ask tutor a question"
            className="flex-1 min-w-[180px] min-h-[44px] bg-transparent px-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <div className="flex items-center gap-1.5 ml-auto">
            <button
              type="button"
              aria-label="Upload question image"
              onClick={() => showToast('Image upload coming soon', 'info')}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <ImageIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Voice input"
              onClick={() => showToast('Voice mic coming soon', 'info')}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <Mic className="h-4 w-4" />
            </button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!draft.trim() || isTyping}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
              <span>Send</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
