export const ELLIPSIS = '\u2026';

export const truncateText = (value: string, maxLength: number): string =>
  value.length > maxLength ? `${value.slice(0, maxLength).trimEnd()}${ELLIPSIS}` : value;

export const truncateWords = (value: string, maxWords: number): string => {
  const words = value.trim().split(/\s+/).filter(Boolean);
  return words.length > maxWords ? `${words.slice(0, maxWords).join(' ')}${ELLIPSIS}` : value;
};
