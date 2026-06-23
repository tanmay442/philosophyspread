export const ELLIPSIS = '\u2026';

export const truncateText = (value: string, maxLength: number): string =>
  value.length > maxLength ? `${value.slice(0, maxLength).trimEnd()}${ELLIPSIS}` : value;

export const truncateWords = (value: string, maxWords: number): string => {
  const words = value.trim().split(/\s+/).filter(Boolean);
  // Return the normalized (trimmed) form in both branches so the under-
  // limit path doesn't leak leading/trailing whitespace from the input.
  return words.length > maxWords ? `${words.slice(0, maxWords).join(' ')}${ELLIPSIS}` : words.join(' ');
};

/**
 * Strip common inline Markdown emphasis/quote markers from a string.
 *
 * Used for meta descriptions / SERP snippets where literal `*`, `_`, or
 * backtick characters would otherwise show up (e.g. a bit whose
 * `content` begins with `*…*`). Block markers (`#`, `>`, `-`, list
 * digits) are only stripped when leading a line, so inline text is
 * preserved.
 */
export const stripMarkdown = (value: string): string =>
  value
    .replace(/[*_`]+/g, '') // emphasis, strong, code spans
    .replace(/^\s{0,3}#{1,6}\s+/gm, '') // ATX headings
    .replace(/^\s{0,3}>\s?/gm, '') // blockquotes
    .replace(/^\s{0,3}[-*+]\s+/gm, '') // unordered list bullets
    .replace(/^\s{0,3}\d+\.\s+/gm, '') // ordered list items
    .replace(/\s+/g, ' ')
    .trim();
