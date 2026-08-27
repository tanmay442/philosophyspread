import assert from 'node:assert/strict';
import test from 'node:test';
import {
  absoluteSiteUrl,
  getImageDimensions,
  serializeJsonLd,
  truncateMetadata,
  withTrailingSlash,
} from '../src/utils/seo.ts';

test('withTrailingSlash preserves root and file URLs', () => {
  assert.equal(withTrailingSlash('/'), '/');
  assert.equal(withTrailingSlash('/essays'), '/essays/');
  assert.equal(withTrailingSlash('/essays/page/2/'), '/essays/page/2/');
  assert.equal(withTrailingSlash('/sitemap.xml'), '/sitemap.xml');
});

test('absoluteSiteUrl resolves paths against the configured site and canonicalizes routes', () => {
  const siteUrl = new URL('https://philosophyspread.live/base/');

  assert.equal(absoluteSiteUrl('/essays', siteUrl), 'https://philosophyspread.live/essays/');
  assert.equal(absoluteSiteUrl('/sitemap.xml', siteUrl), 'https://philosophyspread.live/sitemap.xml');
});

test('getImageDimensions handles known assets and query strings', () => {
  assert.deepEqual(getImageDimensions('/choice.avif?v=1'), { width: 500, height: 333 });
  assert.equal(getImageDimensions('/unknown.avif'), undefined);
});

test('serializeJsonLd escapes script-breaking characters without changing data semantics', () => {
  const serialized = serializeJsonLd({ title: '</script><script>alert("x")</script> & friends' });

  assert.equal(serialized.includes('</script>'), false);
  assert.equal(serialized.includes('\\u003c/script\\u003e'), true);
  assert.equal(serialized.includes('\\u0026'), true);
});

test('truncateMetadata normalizes whitespace and reserves room for an ellipsis', () => {
  assert.equal(truncateMetadata('  a\n  b  ', 20), 'a b');
  assert.equal(truncateMetadata('abcdefghij', 6), 'abcde…');
});

