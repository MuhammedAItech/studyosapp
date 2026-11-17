'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { DEFAULT_WEAK_TOPICS } from '@/src/data/exams';
import { DEFAULT_STUDY_BLOCKS } from '@/src/data/plan';
import {
  INITIAL_TUTOR_MESSAGES,
  matchScriptedTutorReply,
} from '@/src/data/tutor';
import {
  applyTutorQuotaDecrement,
  getDefaultExamDate,
  reshuffleStudyBlocks,
} from '@/src/lib/study-logic';
import type {
  OnboardingState,
  PlanBlockStatus,
  PracticeSessionResult,
  ProblemReport,
  StudyOsState,
  TimerSessionLog,
  TutorLanguage,
  TutorMessage,
  UserProfile,
} from '@/src/types/study';

const STORAGE_KEY = 'study_os_demo_state_v2';

export interface ToastItem {
  id: string;
  message: string;
  tone: 'success' | 'error' | 'info' | 'warning';
}

function createInitialState(): StudyOsState {
  return {
    user: null,
    onboarding: {
      completed: false,
      exam: 'JAMB',
      subjects: ['Use of English', 'Mathematics', 'Physics', 'Chemistry'],
      examDate: getDefaultExamDate(47),
      crawfordCourse: '',
    },
    streakDays: 6,
    streakWeekMask: [true, true, true, true, false, false, false],
    xp: 240,
    studyBlocks: DEFAULT_STUDY_BLOCKS,
    weakTopics: DEFAULT_WEAK_TOPICS,
    topicProgress: {
      'eng-concord': 3,
      'eng-lexis': 1,
      'eng-oral': 0,
      'mth-indices': 2,
      'mth-quadratics': 4,
      'mth-geometry': 0,
    },
    lastPracticeResult: null,
    problemReports: [],
    tutorQuotaLeft: 87,
    tutorQuotaMax: 100,
    tutorLanguage: 'english',
    tutorMessages: INITIAL_TUTOR_MESSAGES,
    timerSessions: [],
  };
}

interface StudyStoreContextValue {
  state: StudyOsState;
  hydrated: boolean;
  toasts: ToastItem[];
  showToast: (message: string, tone?: ToastItem['tone']) => void;
  dismissToast: (id: string) => void;
  loginMockUser: (params: {
    name?: string;
    email?: string;
    provider: 'google' | 'apple' | 'email';
    consentConfirmed: boolean;
  }) => void;
  logoutUser: () => void;
  saveOnboarding: (data: Omit<OnboardingState, 'completed'>) => void;
  updateExamDate: (examDate: string) => void;
  setStudyBlockStatus: (blockId: string, status: PlanBlockStatus) => void;
  replanStudyBlocks: () => void;
  setTutorLanguage: (language: TutorLanguage) => void;
  appendTutorExchange: (prompt: string) => TutorMessage;
  setTutorQuotaForDemo: (quota: number) => void;
  completeTimerSession: (topic: string, focusMinutes: number) => TimerSessionLog;
  recordPracticeSession: (result: PracticeSessionResult) => void;
  submitProblemReport: (questionId: string, reason: string, details: string) => void;
  resetDemoData: () => void;
}

const StudyStoreContext = createContext<StudyStoreContextValue | null>(null);

function loadStoredState(): StudyOsState {
  const initial = createInitialState();
  if (typeof window === 'undefined') return initial;
  try {
    // TODO(backend): Hydrate authenticated student profile, plan blocks, tutor quota, and streak from API.
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return initial;
    const parsed = JSON.parse(saved) as Partial<StudyOsState>;
    return {
      ...initial,
      ...parsed,
      onboarding: {
        ...initial.onboarding,
        ...(parsed.onboarding ?? {}),
      },
      studyBlocks:
        Array.isArray(parsed.studyBlocks) && parsed.studyBlocks.length > 0
          ? parsed.studyBlocks
          : initial.studyBlocks,
      tutorMessages:
        Array.isArray(parsed.tutorMessages) && parsed.tutorMessages.length > 0
          ? parsed.tutorMessages
          : initial.tutorMessages,
      streakWeekMask:
        Array.isArray(parsed.streakWeekMask) && parsed.streakWeekMask.length === 7
          ? parsed.streakWeekMask
          : initial.streakWeekMask,
    };
  } catch {
    return initial;
  }
}

export function StudyStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StudyOsState>(loadStoredState);
  const hydrated = true;
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    try {
      // TODO(backend): Persist study state mutations to backend database.
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota issues in demo mode
    }
  }, [state]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, tone: ToastItem['tone'] = 'info') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-2), { id, message, tone }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
      }, 3600);
    },
    []
  );

  const loginMockUser = useCallback(
    (params: {
      name?: string;
      email?: string;
      provider: 'google' | 'apple' | 'email';
      consentConfirmed: boolean;
    }) => {
      // TODO(backend): Exchange OAuth or email credentials via /api/auth/session.
      const fallbackName =
        params.provider === 'google'
          ? 'Chinedu Okafor'
          : params.provider === 'apple'
            ? 'Amaka Nwosu'
            : 'Student Demo';

      const cleanName = params.name?.trim() || fallbackName;
      const cleanEmail =
        params.email?.trim() ||
        `${cleanName.toLowerCase().replace(/\s+/g, '.')}@studyos.ng`;

      const user: UserProfile = {
        id: 'demo-student-1',
        name: cleanName,
        email: cleanEmail,
        provider: params.provider,
        consentConfirmed: params.consentConfirmed,
      };

      setState((prev) => ({ ...prev, user }));
    },
    []
  );

  const logoutUser = useCallback(() => {
    // TODO(backend): Revoke active user session token.
    setState((prev) => ({ ...prev, user: null }));
  }, []);

  const saveOnboarding = useCallback((data: Omit<OnboardingState, 'completed'>) => {
    // TODO(backend): Save onboarding preferences (exam, subjects, examDate, crawfordCourse).
    setState((prev) => ({
      ...prev,
      onboarding: { ...data, completed: true },
    }));
  }, []);

  const updateExamDate = useCallback((examDate: string) => {
    // TODO(backend): Update user target exam date via /api/profile/exam-date.
    setState((prev) => ({
      ...prev,
      onboarding: { ...prev.onboarding, examDate },
    }));
  }, []);

  const setStudyBlockStatus = useCallback(
    (blockId: string, status: PlanBlockStatus) => {
      // TODO(backend): Persist study block completion or skip status via /api/plan/blocks/:id.
      setState((prev) => {
        let xpDelta = 0;
        const studyBlocks = prev.studyBlocks.map((block) => {
          if (block.id !== blockId) return block;
          if (block.status !== 'done' && status === 'done') xpDelta = 15;
          if (block.status === 'done' && status !== 'done') xpDelta = -15;
          return { ...block, status };
        });
        return {
          ...prev,
          studyBlocks,
          xp: Math.max(0, prev.xp + xpDelta),
        };
      });
    },
    []
  );

  const replanStudyBlocks = useCallback(() => {
    // TODO(backend): Recompute adaptive study schedule via /api/plan/replan.
    setState((prev) => ({
      ...prev,
      studyBlocks: reshuffleStudyBlocks(prev.studyBlocks),
    }));
  }, []);

  const setTutorLanguage = useCallback((tutorLanguage: TutorLanguage) => {
    setState((prev) => ({ ...prev, tutorLanguage }));
  }, []);

  const appendTutorExchange = useCallback(
    (prompt: string): TutorMessage => {
      // TODO(backend): Send user prompt to /api/tutor/messages and stream/return explanation.
      const userMsg: TutorMessage = {
        id: `usr-${Date.now()}`,
        sender: 'user',
        text: prompt,
        createdAt: new Date().toISOString(),
      };

      const isCached = state.tutorQuotaLeft <= 0;
      const reply = matchScriptedTutorReply(prompt, state.tutorLanguage);

      const tutorMsg: TutorMessage = {
        id: `tut-${Date.now() + 1}`,
        sender: 'tutor',
        text: reply.intro,
        steps: reply.steps,
        language: state.tutorLanguage,
        cached: isCached,
        createdAt: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        tutorQuotaLeft: applyTutorQuotaDecrement(prev.tutorQuotaLeft),
        tutorMessages: [...prev.tutorMessages, userMsg, tutorMsg],
      }));

      return tutorMsg;
    },
    [state.tutorLanguage, state.tutorQuotaLeft]
  );

  const setTutorQuotaForDemo = useCallback((quota: number) => {
    setState((prev) => ({
      ...prev,
      tutorQuotaLeft: Math.max(0, Math.min(prev.tutorQuotaMax, quota)),
    }));
  }, []);

  const completeTimerSession = useCallback(
    (topic: string, focusMinutes: number): TimerSessionLog => {
      // TODO(backend): Log completed Pomodoro focus session and increment streak via /api/timer/complete.
      const xpEarned = 25;
      const log: TimerSessionLog = {
        id: `tmr-${Date.now()}`,
        topic,
        focusMinutes,
        xpEarned,
        completedAt: new Date().toISOString(),
      };

      setState((prev) => {
        const nextMask = [...prev.streakWeekMask];
        const firstEmpty = nextMask.indexOf(false);
        if (firstEmpty !== -1) nextMask[firstEmpty] = true;

        return {
          ...prev,
          streakDays: prev.streakDays + 1,
          streakWeekMask: nextMask,
          xp: prev.xp + xpEarned,
          timerSessions: [log, ...prev.timerSessions],
        };
      });

      return log;
    },
    []
  );

  const recordPracticeSession = useCallback((result: PracticeSessionResult) => {
    // TODO(backend): Record topic practice attempt, accuracy, and weak topics.
    setState((prev) => {
      const updatedWeak = Array.from(
        new Set([...result.weakTopics, ...prev.weakTopics])
      ).slice(0, 5);
      return {
        ...prev,
        xp: prev.xp + result.correctCount * 10,
        topicProgress: {
          ...prev.topicProgress,
          [result.topicId]: result.totalQuestions,
        },
        weakTopics: updatedWeak,
        lastPracticeResult: result,
      };
    });
  }, []);

  const submitProblemReport = useCallback(
    (questionId: string, reason: string, details: string) => {
      // TODO(backend): POST question issue report to moderation queue.
      const report: ProblemReport = {
        id: `rep-${Date.now()}`,
        questionId,
        reason,
        details,
        createdAt: new Date().toISOString(),
      };
      setState((prev) => ({
        ...prev,
        problemReports: [report, ...prev.problemReports],
      }));
    },
    []
  );

  const resetDemoData = useCallback(() => {
    const fresh = createInitialState();
    setState(fresh);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  const value = useMemo<StudyStoreContextValue>(
    () => ({
      state,
      hydrated,
      toasts,
      showToast,
      dismissToast,
      loginMockUser,
      logoutUser,
      saveOnboarding,
      updateExamDate,
      setStudyBlockStatus,
      replanStudyBlocks,
      setTutorLanguage,
      appendTutorExchange,
      setTutorQuotaForDemo,
      completeTimerSession,
      recordPracticeSession,
      submitProblemReport,
      resetDemoData,
    }),
    [
      state,
      hydrated,
      toasts,
      showToast,
      dismissToast,
      loginMockUser,
      logoutUser,
      saveOnboarding,
      updateExamDate,
      setStudyBlockStatus,
      replanStudyBlocks,
      setTutorLanguage,
      appendTutorExchange,
      setTutorQuotaForDemo,
      completeTimerSession,
      recordPracticeSession,
      submitProblemReport,
      resetDemoData,
    ]
  );

  return (
    <StudyStoreContext.Provider value={value}>
      {children}
    </StudyStoreContext.Provider>
  );
}

export function useStudyStore() {
  const ctx = useContext(StudyStoreContext);
  if (!ctx) {
    throw new Error('useStudyStore must be used inside StudyStoreProvider');
  }
  return ctx;
}
