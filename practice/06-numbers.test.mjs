import { test } from 'node:test';
import assert from 'node:assert/strict';

// Default: grade the reference solution. PRACTICE=mine grades YOUR 06-numbers.mjs.
const src = process.env.PRACTICE === 'mine' ? './06-numbers.mjs' : './06-numbers.solution.mjs';
const { clamp, isPrime, roundTo } = await import(src);

test('clamp keeps a number within [min, max]', () => {
  assert.equal(clamp(5, 0, 10), 5);
  assert.equal(clamp(-3, 0, 10), 0);
  assert.equal(clamp(99, 0, 10), 10);
});

test('isPrime detects primes', () => {
  assert.equal(isPrime(2), true);
  assert.equal(isPrime(13), true);
  assert.equal(isPrime(9), false);
  assert.equal(isPrime(1), false);
  assert.equal(isPrime(0), false);
});

test('roundTo rounds to N decimal places', () => {
  assert.equal(roundTo(1.2345, 2), 1.23);
  assert.equal(roundTo(2.5, 0), 3);
  assert.equal(roundTo(1.005, 2), 1); // float reality: 1.005 is actually 1.00499…
});
