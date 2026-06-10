import { test } from 'node:test';
import assert from 'node:assert/strict';

const src = process.env.PRACTICE === 'mine' ? './assessment.mjs' : './assessment.solution.mjs';
const { fizzbuzz, dedupe, mapSeries, memoize, binarySearch } = await import(src);

test('L1 · fizzbuzz', () => {
  assert.deepEqual(fizzbuzz(5), [1, 2, 'Fizz', 4, 'Buzz']);
  assert.deepEqual(fizzbuzz(15).at(-1), 'FizzBuzz');
});

test('L2 · dedupe preserves order', () => {
  assert.deepEqual(dedupe([1, 1, 2, 1, 3]), [1, 2, 3]);
  assert.deepEqual(dedupe(['a', 'b', 'a']), ['a', 'b']);
});

test('L3 · mapSeries runs sequentially, in order', async () => {
  const order = [];
  const out = await mapSeries([1, 2, 3], async (x) => {
    order.push(x);
    return x * 10;
  });
  assert.deepEqual(out, [10, 20, 30]);
  assert.deepEqual(order, [1, 2, 3]);
});

test('L4 · memoize caches by first arg', () => {
  let calls = 0;
  const slow = memoize((x) => {
    calls++;
    return x * 2;
  });
  assert.equal(slow(5), 10);
  assert.equal(slow(5), 10);
  assert.equal(calls, 1); // second call served from cache
  assert.equal(slow(6), 12);
  assert.equal(calls, 2);
});

test('L5 · binarySearch finds the index or -1', () => {
  const a = [1, 3, 5, 7, 9, 11];
  assert.equal(binarySearch(a, 7), 3);
  assert.equal(binarySearch(a, 1), 0);
  assert.equal(binarySearch(a, 11), 5);
  assert.equal(binarySearch(a, 4), -1);
});
