import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyTutorQuotaDecrement,
  calculateCbtBreakdown,
  calculatePracticeResult,
  evaluateCalculatorExpression,
  formatCountdown,
  getDaysUntilExam,
  getDefaultExamDate,
  isCramModeActive,
  reshuffleStudyBlocks,
  toggleSubjectSelection,
  validateAuthForm,
  validateExamDate,
} from './study-logic';
import { PRACTICE_QUESTIONS } from '../data/practice';
import { CBT_QUESTIONS } from '../data/cbt';
import { DEFAULT_STUDY_BLOCKS } from '../data/plan';
import { matchScriptedTutorReply } from '../data/tutor';

test('getDaysUntilExam, getDefaultExamDate, and validateExamDate stay consistent', () => {
  const from = new Date(2026, 10, 13); // Nov 13, 2026
  const default47 = getDefaultExamDate(47, from);
  assert.equal(getDaysUntilExam(default47, from), 47);
  assert.equal(isCramModeActive('2026-12-30', from), false);
  assert.equal(isCramModeActive('2026-11-20', from), true); // 7 days
  assert.equal(isCramModeActive('2026-11-15', from), true); // 2 days

  assert.equal(validateExamDate('2026-11-13', from), null); // today valid
  assert.ok(validateExamDate('2026-11-12', from)); // past invalid
  assert.ok(validateExamDate('', from)); // empty invalid
});

test('reshuffleStudyBlocks rotates pending blocks, resets skipped items, and balances Day 0', () => {
  const withSkipped = DEFAULT_STUDY_BLOCKS.map((b, i) =>
    i === 0 ? { ...b, status: 'skipped' as const } : b
  );
  const reshuffled = reshuffleStudyBlocks(withSkipped);
  assert.equal(reshuffled.length, DEFAULT_STUDY_BLOCKS.length);
  const skippedRemaining = reshuffled.filter((b) => b.status === 'skipped');
  assert.equal(skippedRemaining.length, 0);
  const firstPendingBefore = withSkipped.find((b) => b.status !== 'done')?.id;
  assert.notEqual(reshuffled[0].id, firstPendingBefore);
  const day0Count = reshuffled.filter((b) => b.dayIndex === 0).length;
  assert.ok(day0Count <= 3);
});

test('matchScriptedTutorReply and applyTutorQuotaDecrement handle Pidgin/English and zero floor', () => {
  const en = matchScriptedTutorReply('Explain quadratic equations', 'english');
  const pg = matchScriptedTutorReply('Explain quadratic equations', 'pidgin');
  assert.notEqual(en.intro, pg.intro);
  assert.ok(pg.intro.toLowerCase().includes('wahala'));
  assert.equal(applyTutorQuotaDecrement(87), 86);
  assert.equal(applyTutorQuotaDecrement(0), 0);
});

test('validateAuthForm checks email, password, name and consent on signup, and allows login without re-consent', () => {
  const bad = validateAuthForm({
    mode: 'signup',
    name: 'A',
    email: 'invalid-email',
    password: '123',
    consentChecked: false,
  });
  assert.equal(bad.valid, false);
  assert.ok(bad.errors.consent);

  const goodLogin = validateAuthForm({
    mode: 'login',
    email: 'ada@crawford.edu.ng',
    password: 'password123',
    consentChecked: false,
  });
  assert.equal(goodLogin.valid, true);
});

test('toggleSubjectSelection enforces JAMB 4-subject max and compulsory Use of English', () => {
  const initial = ['Use of English', 'Mathematics', 'Physics'];
  const removeEng = toggleSubjectSelection(initial, 'Use of English', 'JAMB');
  assert.equal(removeEng.subjects.length, 3);
  assert.ok(removeEng.error);

  const addChem = toggleSubjectSelection(initial, 'Chemistry', 'JAMB');
  assert.equal(addChem.subjects.length, 4);

  const addFifth = toggleSubjectSelection(addChem.subjects, 'Biology', 'JAMB');
  assert.equal(addFifth.subjects.length, 4);
  assert.ok(addFifth.error);
});

test('calculatePracticeResult and calculateCbtBreakdown score accurately', () => {
  const concordQuestions = PRACTICE_QUESTIONS.filter(
    (q) => q.topicId === 'eng-concord'
  );
  const result = calculatePracticeResult({
    subjectId: 'english',
    topicId: 'eng-concord',
    topicTitle: 'Concord & Agreement (Sample)',
    questions: concordQuestions,
    answers: {
      [concordQuestions[0].id]: concordQuestions[0].correctOption,
      [concordQuestions[1].id]: concordQuestions[1].correctOption,
    },
  });
  assert.equal(result.correctCount, 2);
  assert.equal(result.accuracyPercent, 40);

  const cbtAnswers: Record<string, 'A' | 'B' | 'C' | 'D'> = {};
  for (const q of CBT_QUESTIONS) cbtAnswers[q.id] = q.correctOption;
  const summary = calculateCbtBreakdown({
    questions: CBT_QUESTIONS,
    answers: cbtAnswers,
    timeUsedSeconds: 1200,
  });
  assert.equal(summary.estimatedJambScore, 400);
});

test('formatCountdown and evaluateCalculatorExpression behave deterministically', () => {
  assert.equal(formatCountdown(1500), '25:00');
  assert.equal(evaluateCalculatorExpression('12+8*2'), '28');
  assert.equal(evaluateCalculatorExpression('10/0'), 'Error');
});
