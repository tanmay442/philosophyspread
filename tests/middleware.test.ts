import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getLegacyArchiveRedirectPath,
  shouldSkipClerkMiddleware,
} from '../src/utils/middleware.ts';

test('static and generated image routes bypass Clerk middleware', () => {
  assert.equal(shouldSkipClerkMiddleware('/_astro/app.hash.js'), true);
  assert.equal(shouldSkipClerkMiddleware('/_image/'), true);
  assert.equal(shouldSkipClerkMiddleware('/_image/anything'), true);
  assert.equal(shouldSkipClerkMiddleware('/editorial/essay.avif'), true);
});

test('HTML routes continue through Clerk middleware', () => {
  assert.equal(shouldSkipClerkMiddleware('/'), false);
  assert.equal(shouldSkipClerkMiddleware('/essays/'), false);
  assert.equal(shouldSkipClerkMiddleware('/logic-modules/module01-propositions/'), false);
});

test('numeric archive aliases redirect to paginated routes', () => {
  assert.equal(getLegacyArchiveRedirectPath('/essays/1'), '/essays/page/1/');
  assert.equal(getLegacyArchiveRedirectPath('/bits/12/'), '/bits/page/12/');
  assert.equal(getLegacyArchiveRedirectPath('/logic-modules/3'), '/logic-modules/page/3/');
});

test('content and invalid numeric routes are not treated as archive aliases', () => {
  assert.equal(getLegacyArchiveRedirectPath('/essays/nature-of-boredom/'), undefined);
  assert.equal(getLegacyArchiveRedirectPath('/essays/page/1/'), undefined);
  assert.equal(getLegacyArchiveRedirectPath('/essays/0'), undefined);
  assert.equal(getLegacyArchiveRedirectPath('/essays/-1'), undefined);
});
