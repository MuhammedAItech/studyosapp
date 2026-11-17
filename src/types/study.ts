export type ExamType = 'JAMB' | 'WAEC' | 'NECO';

export type ScreenStatus = 'ready' | 'loading' | 'empty' | 'error';

export type OptionKey = 'A' | 'B' | 'C' | 'D';

export type TutorLanguage = 'english' | 'pidgin';

export type PlanBlockStatus = 'pending' | 'done' | 'skipped';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  provider: 'google' | 'apple' | 'email';
  consentConfirmed: boolean;
}

export interface OnboardingState {
  completed: boolean;
  exam: ExamType;
  subjects: string[];
  examDate: string;
  crawfordCourse: string;
}

export interface StudyBlock {
  id: string;
  title: string;
  subject: string;
  timeSlot: string;
  durationMinutes: number;
  dayIndex: number; // 0 = Mon ... 6 = Sun
  status: PlanBlockStatus;
}

export interface TutorMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  steps?: string[];
  language?: TutorLanguage;
  cached?: boolean;
  createdAt: string;
}

export interface TimerSessionLog {
  id: string;
  topic: string;
  focusMinutes: number;
  xpEarned: number;
  completedAt: string;
}

export interface SampleQuestion {
  id: string;
  topicId: string;
  subjectId: string;
  subjectName: string;
  prompt: string;
  options: Record<OptionKey, string>;
  correctOption: OptionKey;
  explanation: string;
  isSample: true;
}

export interface PracticeTopic {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  completedCount: number;
  totalCount: number;
  isSample: true;
}

export interface PracticeSubject {
  id: string;
  name: string;
  shortCode: string;
  description: string;
  topics: PracticeTopic[];
}

export interface PracticeSessionResult {
  subjectId: string;
  topicId: string;
  totalQuestions: number;
  correctCount: number;
  accuracyPercent: number;
  weakTopics: string[];
  completedAt: string;
}

export interface CbtSubjectBreakdown {
  subjectName: string;
  total: number;
  answered: number;
  correct: number;
  jambScaledScore: number;
}

export interface CbtResultSummary {
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  accuracyPercent: number;
  estimatedJambScore: number;
  timeUsedSeconds: number;
  breakdown: CbtSubjectBreakdown[];
}

export interface ProblemReport {
  id: string;
  questionId: string;
  reason: string;
  details: string;
  createdAt: string;
}

export interface StudyOsState {
  user: UserProfile | null;
  onboarding: OnboardingState;
  streakDays: number;
  streakWeekMask: boolean[]; // Mon..Sun
  xp: number;
  studyBlocks: StudyBlock[];
  weakTopics: string[];
  topicProgress: Record<string, number>;
  lastPracticeResult: PracticeSessionResult | null;
  problemReports: ProblemReport[];
  tutorQuotaLeft: number;
  tutorQuotaMax: number;
  tutorLanguage: TutorLanguage;
  tutorMessages: TutorMessage[];
  timerSessions: TimerSessionLog[];
}
