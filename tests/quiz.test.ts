import assert from 'node:assert/strict';
import test from 'node:test';
import { buildQuizKey } from '../src/utils/quiz.ts';

const questions = [{ question: 'What makes an argument valid?' }];

test('quiz keys retain a readable question component', () => {
  assert.match(buildQuizKey('module02-validity', questions), /^what-makes-an-argument-valid-/);
});

test('caller scopes distinguish quizzes with identical questions', () => {
  assert.notEqual(
    buildQuizKey('module01-propositions', questions),
    buildQuizKey('module02-validity', questions),
  );
});
