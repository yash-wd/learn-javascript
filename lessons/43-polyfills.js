/* =============================================================================
 * 43 · POLYFILLS — implement the built-ins yourself
 * =============================================================================
 * Run:  node lessons/43-polyfills.js
 *
 * WHAT YOU'LL LEARN
 *   Re-building the methods you use every day. This is the single best way to
 *   *truly* understand them — and it's the most common JS interview exercise.
 *
 *   We'll re-implement: map, filter, reduce, call/apply/bind, debounce,
 *   and a minimal Promise.
 *
 * (A real "polyfill" also checks `if (!Array.prototype.x)` before defining, so
 *  it only fills the gap in old engines. We focus on the implementations.)
 * ========================================================================== */

// ── 1. Array.prototype.map ───────────────────────────────────────────────────
function myMap(arr, fn) {
  const out = [];
  for (let i = 0; i < arr.length; i++) out.push(fn(arr[i], i, arr));
  return out;
}
console.log(myMap([1, 2, 3], (n) => n * 2)); // => [ 2, 4, 6 ]


// ── 2. Array.prototype.filter ────────────────────────────────────────────────
function myFilter(arr, predicate) {
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i], i, arr)) out.push(arr[i]);
  }
  return out;
}
console.log(myFilter([1, 2, 3, 4], (n) => n % 2 === 0)); // => [ 2, 4 ]


// ── 3. Array.prototype.reduce ────────────────────────────────────────────────
function myReduce(arr, reducer, initial) {
  let acc = initial;
  let start = 0;
  if (acc === undefined) { acc = arr[0]; start = 1; } // no seed → use first item
  for (let i = start; i < arr.length; i++) acc = reducer(acc, arr[i], i, arr);
  return acc;
}
console.log(myReduce([1, 2, 3, 4], (a, b) => a + b, 0)); // => 10


// ── 4. Function.prototype.call / apply / bind ────────────────────────────────
// The trick: put the function on the target object so `this` becomes that object.
function myCall(fn, context, ...args) {
  const key = Symbol('fn');
  context = context ?? globalThis;
  context[key] = fn;
  const result = context[key](...args);
  delete context[key];
  return result;
}
function myBind(fn, context, ...preset) {
  return (...later) => myCall(fn, context, ...preset, ...later);
}
const person = { name: 'Ana' };
function greet(greeting) { return `${greeting}, ${this.name}`; }
console.log(myCall(greet, person, 'Hi'));        // => Hi, Ana
const sayHello = myBind(greet, person, 'Hello');
console.log(sayHello());                          // => Hello, Ana


// ── 5. debounce — delay until calls stop (lesson 30, built from scratch) ─────
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);                 // cancel the previous pending call
    timer = setTimeout(() => fn(...args), delay);
  };
}
const log = debounce((msg) => console.log('debounced:', msg), 50);
log('a'); log('b'); log('c'); // only 'c' fires, ~50ms later


// ── 6. A minimal Promise ─────────────────────────────────────────────────────
// Simplified, but shows the core: state machine + queued callbacks + then().
class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.callbacks = [];
    const resolve = (value) => this.#settle('fulfilled', value);
    const reject = (reason) => this.#settle('rejected', reason);
    try { executor(resolve, reject); } catch (e) { reject(e); }
  }
  #settle(state, value) {
    if (this.state !== 'pending') return;  // settle only once
    this.state = state;
    this.value = value;
    this.callbacks.forEach((cb) => cb());  // flush anyone waiting
  }
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const run = () => {
        try {
          if (this.state === 'fulfilled') resolve(onFulfilled ? onFulfilled(this.value) : this.value);
          else reject(onRejected ? onRejected(this.value) : this.value);
        } catch (e) { reject(e); }
      };
      // if already settled, run on the microtask queue; else queue until settle
      this.state === 'pending' ? this.callbacks.push(run) : queueMicrotask(run);
    });
  }
}
new MyPromise((resolve) => setTimeout(() => resolve(21), 10))
  .then((n) => n * 2)
  .then((n) => console.log('MyPromise result:', n)); // => 42


/* PRACTICE -------------------------------------------------------------------
 *   1. Implement myForEach(arr, fn) (like map but returns nothing).
 *   2. Implement myFlat(arr, depth) using recursion (lesson 09).
 *   3. Add a .catch(fn) method to MyPromise (hint: then(undefined, fn)).
 * ------------------------------------------------------------------------- */
