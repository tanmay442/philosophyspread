import assert from 'node:assert/strict';
import test from 'node:test';
import { buildPagePaths, resolvePage } from '../src/utils/pagination.ts';

test('buildPagePaths always includes a single page for an empty collection', () => {
  assert.deepEqual(buildPagePaths(0, 10), [{ params: { page: '1' } }]);
});

test('buildPagePaths creates one path per page', () => {
  assert.deepEqual(buildPagePaths(21, 10), [
    { params: { page: '1' } },
    { params: { page: '2' } },
    { params: { page: '3' } },
  ]);
});

test('resolvePage returns the requested slice and canonical navigation URLs', () => {
  const page = resolvePage(['a', 'b', 'c', 'd', 'e'], '2', 2, '/essays');

  assert.deepEqual(page, {
    items: ['c', 'd'],
    currentPage: 2,
    lastPage: 3,
    url: {
      prev: '/essays/',
      next: '/essays/page/3/',
    },
  });
});

test('resolvePage defaults an omitted page to page one', () => {
  assert.deepEqual(resolvePage(['a', 'b'], undefined, 10, '/bits'), {
    items: ['a', 'b'],
    currentPage: 1,
    lastPage: 1,
    url: { prev: null, next: null },
  });
});

test('resolvePage rejects malformed and out-of-range page numbers', () => {
  const items = ['a', 'b', 'c'];

  assert.equal(resolvePage(items, '0', 2, '/bits'), null);
  assert.equal(resolvePage(items, '-1', 2, '/bits'), null);
  assert.equal(resolvePage(items, '1.5', 2, '/bits'), null);
  assert.equal(resolvePage(items, '999999999999999999999', 2, '/bits'), null);
  assert.equal(resolvePage(items, '3', 2, '/bits'), null);
});
