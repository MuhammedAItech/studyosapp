import type {
  CbtResultSummary,
  CbtSubjectBreakdown,
  ExamType,
  OptionKey,
  PracticeSessionResult,
  SampleQuestion,
  StudyBlock,
} from '../types/study';

export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDefaultExamDate(daysAhead = 47, fromDate = new Date()): string {
  const date = new Date(
    fromDate.getFullYear(),
    fromDate.getMonth(),
    fromDate.getDate() + daysAhead
  );
  return formatLocalDate(date);
}

export function getDaysUntilExam(examDateStr: string, fromDate = new Date()): number {
  if (!examDateStr) return 0;
  const target = new Date(`${examDateStr}T00:00:00`);
  if (Number.isNaN(target.getTime())) return 0;
  const startOfToday = new Date(
    fromDate.getFullYear(),
    fromDate.getMonth(),
    fromDate.getDate()
  );
  const diffMs = target.getTime() - startOfToday.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export function validateExamDate(
  examDateStr: string,
  fromDate = new Date()
): string | null {
  if (!examDateStr) {
    return 'Choose your target exam date.';
  }
  const target = new Date(`${examDateStr}T00:00:00`);
  if (Number.isNaN(target.getTime())) {
    return 'Enter a valid exam date.';
  }
  const startOfToday = new Date(
    fromDate.getFullYear(),
    fromDate.getMonth(),
    fromDate.getDate()
  );
  if (target.getTime() < startOfToday.getTime()) {
    return 'Choose today or a future exam date.';
  }
  return null;
}

export function isCramModeActive(examDateStr: string, fromDate = new Date()): boolean {
  if (!examDateStr) return false;
  return getDaysUntilExam(examDateStr, fromDate) <= 7;
}

export function reshuffleStudyBlocks(blocks: StudyBlock[]): StudyBlock[] {
  const slots = ['08:00 - 08:30', '10:30 - 11:00', '15:00 - 15:30', '18:00 - 18:30'];
  const pending = blocks.filter((b) => b.status !== 'done');
  const done = blocks.filter((b) => b.status === 'done');

  const rotated =
    pending.length > 1 ? [...pending.slice(1), pending[0]] : [...pending];

  const doneTodayCount = done.filter((b) => b.dayIndex === 0).length;
  const day0OpenSlots = Math.max(1, 3 - doneTodayCount);

  const replannedPending = rotated.map((block, index) => ({
    ...block,
    status: 'pending' as const,
    dayIndex: index < day0OpenSlots ? 0 : ((index - day0OpenSlots) % 6) + 1,
    timeSlot: slots[index % slots.length],
  }));

  return [...replannedPending, ...done];
}

export function applyTutorQuotaDecrement(quotaLeft: number): number {
  return Math.max(0, quotaLeft - 1);
}

export function validateAuthForm(params: {
  mode: 'login' | 'signup';
  email: string;
  password: string;
  name?: string;
  consentChecked: boolean;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const trimmedEmail = params.email.trim();

  if (params.mode === 'signup' && (!params.name || params.name.trim().length < 2)) {
    errors.name = 'Enter your full name (at least 2 characters).';
  }
  if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!params.password || params.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }
  if (params.mode === 'signup' && !params.consentChecked) {
    errors.consent = 'Please confirm you are 18+ or have parental consent.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function toggleSubjectSelection(
  current: string[],
  subject: string,
  exam: ExamType
): { subjects: string[]; error: string | null } {
  if (exam === 'JAMB' && subject === 'Use of English') {
    return {
      subjects: current,
      error: 'Use of English is compulsory for JAMB.',
    };
  }

  const exists = current.includes(subject);
  if (exists) {
    return {
      subjects: current.filter((item) => item !== subject),
      error: null,
    };
  }

  const maxLimit = exam === 'JAMB' ? 4 : 9;
  if (current.length >= maxLimit) {
    return {
      subjects: current,
      error: `${exam} allows up to ${maxLimit} subjects.`,
    };
  }

  return {
    subjects: [...current, subject],
    error: null,
  };
}

export function calculatePracticeResult(params: {
  subjectId: string;
  topicId: string;
  topicTitle: string;
  questions: SampleQuestion[];
  answers: Record<string, OptionKey>;
}): PracticeSessionResult {
  const totalQuestions = params.questions.length;
  let correctCount = 0;

  for (const question of params.questions) {
    if (params.answers[question.id] === question.correctOption) {
      correctCount += 1;
    }
  }

  const accuracyPercent =
    totalQuestions === 0 ? 0 : Math.round((correctCount / totalQuestions) * 100);

  const weakTopics =
    accuracyPercent < 80 ? [params.topicTitle.replace(' (Sample)', '')] : [];

  return {
    subjectId: params.subjectId,
    topicId: params.topicId,
    totalQuestions,
    correctCount,
    accuracyPercent,
    weakTopics,
    completedAt: new Date().toISOString(),
  };
}

export function calculateCbtBreakdown(params: {
  questions: SampleQuestion[];
  answers: Record<string, OptionKey>;
  timeUsedSeconds: number;
}): CbtResultSummary {
  const bySubject = new Map<
    string,
    { total: number; answered: number; correct: number }
  >();

  let answeredCount = 0;
  let correctCount = 0;

  for (const q of params.questions) {
    const entry = bySubject.get(q.subjectName) ?? {
      total: 0,
      answered: 0,
      correct: 0,
    };
    entry.total += 1;

    const chosen = params.answers[q.id];
    if (chosen) {
      entry.answered += 1;
      answeredCount += 1;
      if (chosen === q.correctOption) {
        entry.correct += 1;
        correctCount += 1;
      }
    }
    bySubject.set(q.subjectName, entry);
  }

  const breakdown: CbtSubjectBreakdown[] = Array.from(bySubject.entries()).map(
    ([subjectName, stats]) => ({
      subjectName,
      total: stats.total,
      answered: stats.answered,
      correct: stats.correct,
      jambScaledScore:
        stats.total === 0 ? 0 : Math.round((stats.correct / stats.total) * 100),
    })
  );

  const totalQuestions = params.questions.length;
  const accuracyPercent =
    totalQuestions === 0 ? 0 : Math.round((correctCount / totalQuestions) * 100);

  const estimatedJambScore = breakdown.reduce(
    (sum, item) => sum + item.jambScaledScore,
    0
  );

  return {
    totalQuestions,
    answeredCount,
    correctCount,
    accuracyPercent,
    estimatedJambScore,
    timeUsedSeconds: params.timeUsedSeconds,
    breakdown,
  };
}

export function formatCountdown(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function evaluateCalculatorExpression(raw: string): string {
  const sanitized = raw.replace(/\s+/g, '');
  if (!sanitized || !/^[0-9+\-*/().]+$/.test(sanitized)) {
    return 'Error';
  }
  try {
    let index = 0;
    const peek = () => sanitized[index];
    const consume = () => sanitized[index++];

    const parseNumber = (): number => {
      let numStr = '';
      if (peek() === '-') numStr += consume();
      while (index < sanitized.length && /[0-9.]/.test(peek())) {
        numStr += consume();
      }
      const value = Number(numStr);
      if (Number.isNaN(value) || numStr === '' || numStr === '-') {
        throw new Error('Invalid number');
      }
      return value;
    };

    const parseFactor = (): number => {
      if (peek() === '(') {
        consume();
        const inner = parseExpression();
        if (consume() !== ')') throw new Error('Mismatched parentheses');
        return inner;
      }
      return parseNumber();
    };

    const parseTerm = (): number => {
      let left = parseFactor();
      while (peek() === '*' || peek() === '/') {
        const op = consume();
        const right = parseFactor();
        if (op === '*') left *= right;
        else {
          if (right === 0) throw new Error('Divide by zero');
          left /= right;
        }
      }
      return left;
    };

    const parseExpression = (): number => {
      let left = parseTerm();
      while (peek() === '+' || peek() === '-') {
        const op = consume();
        const right = parseTerm();
        left = op === '+' ? left + right : left - right;
      }
      return left;
    };

    const result = parseExpression();
    if (index !== sanitized.length || !Number.isFinite(result)) {
      return 'Error';
    }
    return Number(result.toFixed(6)).toString();
  } catch {
    return 'Error';
  }
}
