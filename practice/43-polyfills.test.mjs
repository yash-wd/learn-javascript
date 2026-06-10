import { test } from 'node:test';
import assert from 'node:assert/strict';

const src = process.env.PRACTICE === 'mine' ? './43-polyfills.mjs' : './43-polyfills.solution.mjs';
const { myMap, myFilter, myReduce, myBind } = await import(src);

test('myMap transforms each item', () => {
  assert.deepEqual(myMap([1, 2, 3], (x) => x * 2), [2, 4, 6]);
  assert.deepEqual(myMap([1, 2, 3], (x, i) => i), [0, 1, 2]);
});

test('myFilter keeps truthy results', () => {
  assert.deepEqual(myFilter([1, 2, 3, 4], (x) => x % 2 === 0), [2, 4]);
});

test('myReduce folds, with and without a seed', () => {
  assert.equal(myReduce([1, 2, 3, 4], (a, b) => a + b, 0), 10);
  assert.equal(myReduce([1, 2, 3, 4], (a, b) => a + b), 10); // no seed
});

test('myBind fixes this and prepends args', () => {
  function greet(greeting, punct) {
    return `${greeting}, ${this.name}${punct}`;
  }
  const bound = myBind(greet, { name: 'Sam' }, 'Hi');
  assert.equal(bound('!'), 'Hi, Sam!');
});
