import assert from 'node:assert/strict';
import test from 'node:test';
import { stripMarkdown, truncateText, truncateWords } from '../src/utils/text.ts';

test('truncateText only appends an ellipsis when the limit is exceeded', () => {
  assert.equal(truncateText('short', 10), 'short');
  assert.equal(truncateText('long   ', 4), 'long…');
});

test('truncateWords normalizes whitespace in both branches', () => {
  assert.equal(truncateWords('  one   two  ', 3), 'one two');
  assert.equal(truncateWords('  one   two three  ', 2), 'one two…');
});

test('stripMarkdown removes common presentation markers from metadata text', () => {
  assert.equal(
    stripMarkdown('# Heading\n> **A** [link](https://example.com) and `code`'),
    'Heading A and code',
  );
});
