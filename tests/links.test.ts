import assert from 'node:assert/strict';
import test from 'node:test';
import { buildClerkRedirectProps, currentReturnTo } from '../src/utils/clerk-redirect.ts';
import { getSiteUrl } from '../src/utils/site.ts';

test('currentReturnTo preserves path and query string for auth redirects', () => {
  assert.equal(currentReturnTo('/essays/example/', '?from=home'), '/essays/example/?from=home');
  assert.deepEqual(buildClerkRedirectProps('/essays/example/'), {
    forceRedirectUrl: '/essays/example/',
    signUpForceRedirectUrl: '/essays/example/',
    fallbackRedirectUrl: '/essays/example/',
    signUpFallbackRedirectUrl: '/essays/example/',
  });
});

test('getSiteUrl returns configured URLs and rejects missing configuration', () => {
  const siteUrl = new URL('https://philosophyspread.live');
  assert.equal(getSiteUrl(siteUrl), siteUrl);
  assert.throws(() => getSiteUrl(undefined), /Astro\.site is not configured/);
});

