/* =============================================================================
 * SOLUTIONS · 43 · POLYFILLS — implement the built-ins yourself
 * =============================================================================
 * Run:  node lessons/solutions/43-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/43-polyfills.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. Implement myForEach(arr, fn) (like map but returns nothing). ──────────
function myForEach(arr, fn) {
  for (let i = 0; i < arr.length; i++) fn(arr[i], i, arr); // fn gets (item, index, array)
  // returns undefined — forEach is called for side effects only
}
const out = [];
myForEach(['a', 'b', 'c'], (item, i) => out.push(`${i}:${item}`));
console.log('1.', out); // => 1. [ '0:a', '1:b', '2:c' ]

// ── 2. Implement myFlat(arr, depth) using recursion (lesson 09). ─────────────
function myFlat(arr, depth = 1) {
  return arr.reduce((acc, item) => {
    if (Array.isArray(item) && depth > 0) {
      acc.push(...myFlat(item, depth - 1)); // recurse one level shallower
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
}
console.log('2.', myFlat([1, [2, [3, [4]]]], 1)); // => 2. [ 1, 2, [ 3, [ 4 ] ] ]
console.log('2.', myFlat([1, [2, [3, [4]]]], Infinity)); // => 2. [ 1, 2, 3, 4 ]

// ── 3. Add a .catch(fn) method to MyPromise (hint: then(undefined, fn)). ─────
// A minimal Promise: enough to show that .catch is just .then with no success
// handler — it forwards rejections to onRejected.
class MyPromise {
  #state = 'pending';
  #value;
  #handlers = [];
  constructor(executor) {
    const resolve = (v) => this.#settle('fulfilled', v);
    const reject = (e) => this.#settle('rejected', e);
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
  #settle(state, value) {
    if (this.#state !== 'pending') return;
    this.#state = state;
    this.#value = value;
    this.#handlers.forEach((h) => this.#dispatch(h));
    this.#handlers = [];
  }
  #dispatch(handler) {
    queueMicrotask(() => {
      const { onFulfilled, onRejected, resolve, reject } = handler;
      try {
        if (this.#state === 'fulfilled') {
          resolve(onFulfilled ? onFulfilled(this.#value) : this.#value);
        } else if (onRejected) {
          resolve(onRejected(this.#value)); // handled → the chain recovers
        } else {
          reject(this.#value); // no handler → keep rejecting down the chain
        }
      } catch (err) {
        reject(err);
      }
    });
  }
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handler = { onFulfilled, onRejected, resolve, reject };
      if (this.#state === 'pending') this.#handlers.push(handler);
      else this.#dispatch(handler);
    });
  }
  catch(onRejected) {
    return this.then(undefined, onRejected); // ← the whole exercise
  }
}
new MyPromise((_resolve, reject) => reject(new Error('boom')))
  .catch((err) => console.log('3.', 'caught via .catch:', err.message));
// => 3. caught via .catch: boom
