import { test } from 'node:test';
import assert from 'node:assert/strict';

const src = process.env.PRACTICE === 'mine' ? './30-functional.mjs' : './30-functional.solution.mjs';
const { compose, pipe, curry } = await import(src);

const inc = (x) => x + 1;
const double = (x) => x * 2;

test('compose runs right-to-left', () => {
  assert.equal(compose(double, inc)(3), 8); // double(inc(3)) = double(4)
});

test('pipe runs left-to-right', () => {
  assert.equal(pipe(double, inc)(3), 7); // inc(double(3)) = inc(6)
});

test('curry collects args until arity is met', () => {
  const add = (a, b, c) => a + b + c;
  const cAdd = curry(add);
  assert.equal(cAdd(1)(2)(3), 6);
  assert.equal(cAdd(1, 2)(3), 6);
  assert.equal(cAdd(1, 2, 3), 6);
});
