interface QuizQuestion {
  question: string;
}

const normalizeIdPart = (value: string, fallback: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48) || fallback;

export const buildQuizKey = (scope: string, questions: QuizQuestion[]): string => {
  const readableQuestionKey = normalizeIdPart(
    questions.map((question) => question.question).join('|'),
    'set',
  );
  const scopeKey = normalizeIdPart(scope, 'quiz');

  return `${readableQuestionKey}-${scopeKey}`;
};
