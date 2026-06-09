/* =============================================================================
 * SOLUTIONS · 10 · SCOPE & CLOSURES
 * =============================================================================
 * Run:  node lessons/solutions/10-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/10-scope-closures.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. Write makeAdder(x) that returns a function adding x to its argument. ──
//    const add5 = makeAdder(5); add5(10) === 15
function makeAdder(x) {
  return (y) => x + y; // the returned function closes over `x`
}
const add5 = makeAdder(5);
console.log('1.', add5(10)); // => 1. 15

// ── 2. Build a once(fn) wrapper that runs fn only the first time it's called. ──
function once(fn) {
  let called = false;
  let result;
  return (...args) => {
    if (!called) {
      called = true;
      result = fn(...args); // run once, remember the result
    }
    return result;          // every later call returns the cached value
  };
}
const init = once(() => {
  console.log('2.', 'initialising…');
  return 42;
});
console.log('2.', init()); // => 2. initialising… / 2. 42
console.log('2.', init()); // => 2. 42  (the body does NOT run again)

// ── 3. Explain in your own words why `count` survives between counter() calls. ──
function makeCounter() {
  let count = 0;          // lives in makeCounter's scope
  return () => ++count;   // this inner function keeps that scope alive
}
const counter = makeCounter();
console.log('3.', counter(), counter(), counter()); // => 3. 1 2 3
// `count` survives because the returned function is a CLOSURE: it holds a live
// reference to the variable environment it was created in. As long as that
// function exists, `count` can't be garbage-collected, so each call mutates the
// same `count` rather than starting fresh.
