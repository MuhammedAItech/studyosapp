import type { StudyBlock } from '@/src/types/study';

export const WEEK_DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// TODO(backend): Replace initial blocks with personalized planner schedule API.
export const DEFAULT_STUDY_BLOCKS: StudyBlock[] = [
  {
    id: 'blk-1',
    title: 'Sample: Use of English Concord drill',
    subject: 'Use of English',
    timeSlot: '08:00 - 08:30',
    durationMinutes: 25,
    dayIndex: 0,
    status: 'pending',
  },
  {
    id: 'blk-2',
    title: 'Sample: Quadratic Equations formula sheet',
    subject: 'Mathematics',
    timeSlot: '10:00 - 10:30',
    durationMinutes: 25,
    dayIndex: 0,
    status: 'done',
  },
  {
    id: 'blk-3',
    title: 'Sample: JAMB CBT mini-drill (Physics)',
    subject: 'Physics',
    timeSlot: '16:00 - 16:30',
    durationMinutes: 25,
    dayIndex: 0,
    status: 'pending',
  },
  {
    id: 'blk-4',
    title: 'Sample: Indices & Logarithms practice',
    subject: 'Mathematics',
    timeSlot: '09:00 - 09:30',
    durationMinutes: 25,
    dayIndex: 1,
    status: 'pending',
  },
  {
    id: 'blk-5',
    title: 'Sample: Oral English & Stress review',
    subject: 'Use of English',
    timeSlot: '14:00 - 14:30',
    durationMinutes: 25,
    dayIndex: 2,
    status: 'pending',
  },
  {
    id: 'blk-6',
    title: 'Sample: Stoichiometry & Acid-Base notes',
    subject: 'Chemistry',
    timeSlot: '11:00 - 11:30',
    durationMinutes: 25,
    dayIndex: 3,
    status: 'pending',
  },
  {
    id: 'blk-7',
    title: 'Sample: Full-length CBT mock checkpoint',
    subject: 'JAMB CBT',
    timeSlot: '09:00 - 11:00',
    durationMinutes: 50,
    dayIndex: 4,
    status: 'pending',
  },
  {
    id: 'blk-8',
    title: 'Sample: Weekly weak-topic recap',
    subject: 'Mixed Revision',
    timeSlot: '15:00 - 15:45',
    durationMinutes: 25,
    dayIndex: 5,
    status: 'pending',
  },
];

export const TIMER_TOPICS = [
  'Use of English · Concord (Sample)',
  'Mathematics · Quadratic Equations (Sample)',
  'Mathematics · Indices & Logarithms (Sample)',
  'Physics · Motion & Electricity (Sample)',
  'Chemistry · Atomic Structure (Sample)',
  'Crawford Pilot · CSC 201 (Sample)',
];
