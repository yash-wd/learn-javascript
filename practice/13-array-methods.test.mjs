import { test } from 'node:test';
import assert from 'node:assert/strict';

const src = process.env.PRACTICE === 'mine' ? './13-array-methods.mjs' : './13-array-methods.solution.mjs';
const { sumOfEvens, groupBy, countWords } = await import(src);

test('sumOfEvens adds only even numbers', () => {
  assert.equal(sumOfEvens([1, 2, 3, 4]), 6);
  assert.equal(sumOfEvens([1, 3, 5]), 0);
  assert.equal(sumOfEvens([]), 0);
});

test('groupBy buckets by the key function', () => {
  assert.deepEqual(groupBy([1, 2, 3, 4], (n) => (n % 2 ? 'odd' : 'even')), {
    odd: [1, 3],
    even: [2, 4],
  });
});

test('countWords counts each word', () => {
  assert.deepEqual(countWords('the cat the dog'), { the: 2, cat: 1, dog: 1 });
  assert.deepEqual(countWords('  spaced   out  '), { spaced: 1, out: 1 });
});
