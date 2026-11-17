import type { ExamType } from '@/src/types/study';

export const EXAM_OPTIONS: {
  id: ExamType;
  label: string;
  subtitle: string;
  maxSubjects: number;
}[] = [
  {
    id: 'JAMB',
    label: 'JAMB UTME',
    subtitle: '4 subjects · 180 questions · 120 mins CBT',
    maxSubjects: 4,
  },
  {
    id: 'WAEC',
    label: 'WAEC SSCE',
    subtitle: 'Up to 9 subjects · Theory & Objective',
    maxSubjects: 9,
  },
  {
    id: 'NECO',
    label: 'NECO SSCE',
    subtitle: 'Up to 9 subjects · National Examination',
    maxSubjects: 9,
  },
];

export const AVAILABLE_SUBJECTS: string[] = [
  'Use of English',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Economics',
  'Government',
  'Literature in English',
  'Commerce',
  'Accounting',
];

export const CRAWFORD_COURSES: { code: string; title: string }[] = [
  { code: 'CSC 201', title: 'Computer Programming I' },
  { code: 'GST 102', title: 'Use of English & Communication' },
  { code: 'BUS 301', title: 'Management Principles' },
  { code: 'ECO 101', title: 'Principles of Microeconomics' },
  { code: 'MTH 101', title: 'Elementary Mathematics I' },
  { code: 'BIO 101', title: 'General Biology I' },
  { code: 'PHY 102', title: 'Electricity & Magnetism' },
  { code: 'ACC 201', title: 'Financial Accounting I' },
];

export const DEFAULT_WEAK_TOPICS: string[] = [
  'Oral English & Stress',
  'Indices & Logarithms',
  'Projectile Motion',
];

export const PRICING_TIERS = [
  {
    name: 'Free',
    price: '₦0',
    period: 'forever',
    description: 'Daily sample drills and streak tracking to get started.',
    features: ['15 sample questions/day', 'Streak & XP tracker', '1 CBT preview'],
    popular: false,
  },
  {
    name: 'Weekly',
    price: '₦800',
    period: '/ week',
    description: 'Short burst revision before school tests or mid-terms.',
    features: ['Unlimited topic drills', 'Instant explanations', 'Weak topic alerts'],
    popular: false,
  },
  {
    name: 'Exam Sprint',
    price: '₦1,500',
    period: '/ month',
    description: 'Built for final 30-day JAMB, WAEC, and NECO readiness.',
    features: ['Full CBT simulator', 'All past-style sets', 'Daily smart study plan'],
    popular: true,
  },
  {
    name: 'Semester',
    price: '₦2,500',
    period: '/ semester',
    description: 'Covers JAMB + Crawford University 100L–300L pilot courses.',
    features: ['Crawford course packs', 'CBT + topic mastery', 'Priority tutor queue'],
    popular: false,
  },
  {
    name: 'Annual',
    price: '₦8,500',
    period: '/ year',
    description: 'Full academic year access across all exams and courses.',
    features: ['All exams & Crawford packs', 'Offline-ready study sets', 'Parent progress digest'],
    popular: false,
  },
];

export const LANDING_FEATURES = [
  {
    number: '01',
    title: 'Focused Topic Drills',
    description:
      'Master JAMB, WAEC, and NECO syllabi topic by topic with instant right/wrong feedback and concise explanations.',
  },
  {
    number: '02',
    title: 'Calm JAMB CBT Simulator',
    description:
      'Practice under real 120-minute exam conditions with a question grid, on-screen calculator, and keyboard shortcuts.',
  },
  {
    number: '03',
    title: 'Notion-Clean Daily Plan',
    description:
      'See your exam countdown, 3 bite-sized daily tasks, and weak topic chips without cluttered dashboards.',
  },
  {
    number: '04',
    title: 'Crawford University Pilot',
    description:
      'Undergraduate pilot support for courses like CSC 201, GST 102, and BUS 301 right alongside national exams.',
  },
];

export const STUDENT_OF_THE_WEEK = {
  name: 'Toluwanimi Adeyemi',
  school: 'Crawford University Pilot · 200L CSC',
  streak: 19,
  accuracy: '92%',
  quote: 'Doing 15 minutes of timed drills before morning lectures kept my CSC 201 and JAMB math sharp.',
};
