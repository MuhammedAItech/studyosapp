import type { TutorLanguage, TutorMessage } from '@/src/types/study';

export interface ScriptedTutorEntry {
  keywords: string[];
  topic: string;
  english: {
    intro: string;
    steps: string[];
  };
  pidgin: {
    intro: string;
    steps: string[];
  };
}

export const TUTOR_QUICK_PROMPTS = [
  'How do I solve quadratic equations?',
  'Explain English concord rules',
  'Laws of indices shortcut',
  'Newton force & motion formula',
];

// TODO(backend): Replace scripted keyword bank with live AI tutor endpoint (/api/tutor/chat).
export const SCRIPTED_TUTOR_REPLIES: ScriptedTutorEntry[] = [
  {
    keywords: ['quadratic', 'roots', 'factor', 'x^2', 'equation'],
    topic: 'Quadratic Equations',
    english: {
      intro: 'Sample explanation for Quadratic Equations (ax² + bx + c = 0):',
      steps: [
        '1. Identify a, b, and c from standard form ax² + bx + c = 0.',
        '2. Find two numbers that multiply to (a × c) and add up to b.',
        '3. Split the middle term and factorize, or use x = (-b ± √(b² - 4ac)) / 2a.',
        '4. Check sum of roots (-b/a) and product of roots (c/a) for fast JAMB questions.',
      ],
    },
    pidgin: {
      intro: 'No wahala, make we break Quadratic Equation down sharp-sharp (Sample):',
      steps: [
        '1. First arrange am well as ax² + bx + c = 0 so you go know your a, b, and c.',
        '2. Find two numbers wey if you multiply dem go give (a × c), and if you add dem go give b.',
        '3. Break the middle number, factor am out, or use almighty formula (-b ± √(b² - 4ac)) / 2a.',
        '4. For fast JAMB objective, remember say sum of roots na -b/a and product na c/a.',
      ],
    },
  },
  {
    keywords: ['concord', 'english', 'neither', 'verb', 'agreement', 'grammar'],
    topic: 'Concord & Agreement',
    english: {
      intro: 'Sample step-by-step guide for Use of English Concord:',
      steps: [
        '1. Spot the true subject first—ignore parenthetical phrases like "together with" or "as well as".',
        '2. With "neither...nor" or "either...or", match the verb to the noun closest to the blank.',
        '3. Words like "every", "each", and sums of money ("Ten thousand naira") take singular verbs.',
        '4. Re-read the full sentence aloud to confirm subject and verb match in number.',
      ],
    },
    pidgin: {
      intro: 'Make we run Use of English Concord rules easy-peasy (Sample):',
      steps: [
        '1. Look for the main person or thing wey dey do the action—no let "together with" confuse you.',
        '2. If you see "neither...nor" or "either...or", make the verb follow the subject wey dey near am pass.',
        '3. "Every", "each", and money amount like "Ten thousand naira" dey always carry singular verb ("is").',
        '4. Read the sentence again for your mind make sure e sound correct.',
      ],
    },
  },
  {
    keywords: ['indices', 'log', 'logarithm', 'power', 'exponent'],
    topic: 'Indices & Logarithms',
    english: {
      intro: 'Sample rules for Indices & Logarithms:',
      steps: [
        '1. Multiplication with the same base adds powers: a^m × a^n = a^(m+n).',
        '2. Division subtracts powers: a^m ÷ a^n = a^(m-n).',
        '3. Negative power means reciprocal: a^(-n) = 1 / a^n.',
        '4. Convert logs using log_b(x) = y ⇔ b^y = x.',
      ],
    },
    pidgin: {
      intro: 'See how Indices & Logarithm dey work without stress (Sample):',
      steps: [
        '1. When same base dey multiply, just add their powers: a^m × a^n = a^(m+n).',
        '2. When dem dey divide, minus the powers: a^m ÷ a^n = a^(m-n).',
        '3. Minus power mean say flip am upside down: a^(-n) = 1 / a^n.',
        '4. For log, just turn am back to index: log_b(x) = y mean b^y = x.',
      ],
    },
  },
  {
    keywords: ['force', 'motion', 'newton', 'physics', 'velocity', 'acceleration'],
    topic: 'Newton Laws & Motion',
    english: {
      intro: 'Sample Physics Motion & Force breakdown:',
      steps: [
        '1. List your known quantities in SI units (mass in kg, time in s, velocity in m/s).',
        '2. Use F = m × a for net force (in Newtons).',
        '3. Pick the right SUVAT equation: v = u + at, s = ut + ½at², or v² = u² + 2as.',
        '4. Double-check units before selecting your final JAMB option.',
      ],
    },
    pidgin: {
      intro: 'Make we tackle Motion & Force for Physics sharp-sharp (Sample):',
      steps: [
        '1. First write out wetin question give you and convert everything to standard SI units (kg, m, s).',
        '2. Remember Newton second law: F = m × a (Force dey measured in Newtons).',
        '3. Choose the SUVAT formula wey match wetin you get: v = u + at or s = ut + ½at².',
        '4. Check your unit well-well before you shade answer.',
      ],
    },
  },
];

export const DEFAULT_TUTOR_FALLBACK = {
  english: {
    intro: 'Sample general study guide (keyword fallback):',
    steps: [
      '1. Break the question down into what is given and what is being asked.',
      '2. Eliminate two clearly wrong options first.',
      '3. Apply the core definition or formula from your JAMB/WAEC syllabus.',
      '4. Verify your unit or grammar check before moving on.',
    ],
  },
  pidgin: {
    intro: 'Make we solve am step by step together (Sample):',
    steps: [
      '1. First read the question well to know wetin dem give you and wetin dem dey find.',
      '2. Cancel the two options wey clearly no make sense.',
      '3. Use the main formula or grammar rule wey fit the topic.',
      '4. Double-check your final answer sharp-sharp before next question.',
    ],
  },
};

export const INITIAL_TUTOR_MESSAGES: TutorMessage[] = [
  {
    id: 'tutor-welcome-1',
    sender: 'tutor',
    text: 'Ask me any JAMB, WAEC, NECO, or Crawford pilot question. Switch between English and Pidgin anytime.',
    steps: [
      'Try asking about "quadratic equations", "concord", "indices", or "force & motion".',
    ],
    language: 'english',
    createdAt: '2026-11-13T08:00:00.000Z',
  },
];

export function matchScriptedTutorReply(
  query: string,
  language: TutorLanguage
): { intro: string; steps: string[] } {
  const normalized = query.toLowerCase();
  const match = SCRIPTED_TUTOR_REPLIES.find((entry) =>
    entry.keywords.some((kw) => normalized.includes(kw))
  );
  if (match) {
    return match[language];
  }
  return DEFAULT_TUTOR_FALLBACK[language];
}
